'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  X,
  Minus,
  Copy,
  Check,
  Trash2,
  Maximize2,
  Minimize2,
  GripVertical,
  PenTool,
  ChevronDown,
  PanelLeftOpen,
  PanelRightOpen,
  Columns2,
  Square,
  Grid2x2,
} from 'lucide-react';
import { SYMBOL_CATEGORIES, type SymbolCategory, type SymbolItem } from './latex-symbols';

/* ─── KaTeX 渲染 Hook ─── */
function useKatexRender(input: string) {
  return useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { html: '', error: '', isEmpty: true };
    try {
      const html = katex.renderToString(trimmed, {
        throwOnError: true,
        displayMode: true,
        trust: true,
        strict: false,
      });
      return { html, error: '', isEmpty: false };
    } catch (e: any) {
      return { html: '', error: e.message || '渲染失败', isEmpty: false };
    }
  }, [input]);
}

/* ─── KaTeX 微型渲染（符号按钮用） ─── */
function MiniKatex({ tex, className = '' }: { tex: string; className?: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        throwOnError: false,
        displayMode: false,
        trust: true,
        strict: false,
      });
    } catch {
      return tex;
    }
  }, [tex]);

  return (
    <span
      className={`[&_.katex]:text-[11px] ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ─── Snap 布局定义 ─── */
type SnapPosition = 'free' | 'full' | 'left' | 'right' | 'tl' | 'tr' | 'bl' | 'br';

interface SnapLayout {
  label: string;
  icon: React.ReactNode;
  style: React.CSSProperties;
}

function getSnapLayouts(): Record<SnapPosition, SnapLayout> {
  const pad = 8; // 边距
  return {
    free: { label: '自由', icon: <Square className="w-3 h-3" />, style: {} },
    full: {
      label: '全屏',
      icon: <Maximize2 className="w-3 h-3" />,
      style: { left: pad, top: pad, right: pad, bottom: pad, width: 'auto', height: 'auto' },
    },
    left: {
      label: '左半屏',
      icon: <PanelLeftOpen className="w-3 h-3" />,
      style: { left: pad, top: pad, bottom: pad, width: '50vw', height: 'auto' },
    },
    right: {
      label: '右半屏',
      icon: <PanelRightOpen className="w-3 h-3" />,
      style: { right: pad, top: pad, bottom: pad, width: '50vw', height: 'auto' },
    },
    tl: {
      label: '左上',
      icon: <Grid2x2 className="w-3 h-3" />,
      style: { left: pad, top: pad, width: '50vw', height: '50vh' },
    },
    tr: {
      label: '右上',
      icon: <Grid2x2 className="w-3 h-3" />,
      style: { right: pad, top: pad, width: '50vw', height: '50vh' },
    },
    bl: {
      label: '左下',
      icon: <Grid2x2 className="w-3 h-3" />,
      style: { left: pad, bottom: pad, width: '50vw', height: '50vh' },
    },
    br: {
      label: '右下',
      icon: <Grid2x2 className="w-3 h-3" />,
      style: { right: pad, bottom: pad, width: '50vw', height: '50vh' },
    },
  };
}

/* ─── 符号面板下拉菜单 ─── */
function SymbolPaletteDropdown({
  category,
  onInsert,
  isOpen,
  onToggle,
}: {
  category: SymbolCategory;
  onInsert: (code: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 分类按钮 */}
      <button
        onClick={onToggle}
        className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border transition-all min-w-[64px] ${
          isOpen
            ? 'border-primary/30 bg-primary/5 shadow-sm'
            : 'border-transparent hover:border-border/50 hover:bg-muted/50'
        }`}
      >
        <MiniKatex tex={category.icon} className="[&_.katex]:!text-[13px]" />
        <div className="flex items-center gap-0.5">
          <span className="text-[9px] text-muted-foreground leading-none">{category.name}</span>
          <ChevronDown className={`w-2 h-2 text-muted-foreground/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* 下拉面板 */}
      {isOpen && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 z-[100] w-[460px] bg-card border border-border shadow-2xl rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ maxWidth: 'min(460px, calc(100vw - 40px))' }}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[13px] font-bold text-primary flex items-center gap-2">
              <div className="p-1 bg-primary/10 rounded-lg">
                <MiniKatex tex={category.icon} className="[&_.katex]:!text-[14px]" />
              </div>
              {category.name}
            </span>
            <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="p-1 px-2 text-[10px] flex items-center gap-1 hover:bg-muted font-medium text-muted-foreground transition-colors rounded-md border border-border/50">
              <X className="w-3 h-3" />
              关闭
            </button>
          </div>
          <div className="max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
            {category.groups.map((group, gi) => (
              <div key={gi} className="mb-5 last:mb-0">
                <div className="text-[10px] font-extrabold text-muted-foreground/40 uppercase tracking-[0.2em] px-1 mb-2.5 border-l-2 border-primary/20 pl-2">
                  {group.title}
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                  {group.items.map((item, ii) => (
                    <button
                      key={ii}
                      onClick={(e) => { e.stopPropagation(); onInsert(item.code); }}
                      title={item.tip || item.code}
                      className="aspect-square flex items-center justify-center rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 hover:text-primary transition-all group/item bg-muted/30 shadow-sm"
                    >
                      <MiniKatex tex={item.display} className="group-hover/item:scale-125 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── 主组件 ─── */
export function LatexScratchpad() {
  // 面板状态
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [showSnapMenu, setShowSnapMenu] = useState(false);

  // Snap 布局
  const [snapPos, setSnapPos] = useState<SnapPosition>('free');
  const snapLayouts = useMemo(() => getSnapLayouts(), []);

  // 编辑器内容
  const [code, setCode] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自由模式下的位置与尺寸
  const [freeRect, setFreeRect] = useState({ x: 0, y: 0, w: 520, h: 520 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // FAB 拖拽
  const [fabPos, setFabPos] = useState({ x: -1, y: -1 }); // -1 表示使用默认 fixed
  const [isFabDragging, setIsFabDragging] = useState(false);
  const fabDragStart = useRef({ x: 0, y: 0 });
  const fabMoved = useRef(false);

  // KaTeX 渲染
  const { html, error, isEmpty } = useKatexRender(code);

  // 初始化位置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFreeRect(prev => ({
        ...prev,
        x: window.innerWidth - prev.w - 24,
        y: window.innerHeight - prev.h - 80,
      }));
    }
  }, []);

  // 复制代码
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  // 清空
  const handleClear = useCallback(() => {
    setCode('');
    textareaRef.current?.focus();
  }, []);

  // 插入符号到光标位置
  const insertCode = useCallback((template: string) => {
    setCode(prev => {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newCode = prev.substring(0, start) + template + prev.substring(end);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + template.length;
          textarea.focus();
        }, 0);
        return newCode;
      }
      return prev ? prev + ' ' + template : template;
    });
  }, []);

  // ─── FAB 拖拽 ───
  const handleFabMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    fabDragStart.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setIsFabDragging(true);
    fabMoved.current = false;
  }, []);

  useEffect(() => {
    if (!isFabDragging) return;
    const onMove = (e: MouseEvent) => {
      fabMoved.current = true;
      setFabPos({
        x: e.clientX - fabDragStart.current.x,
        y: e.clientY - fabDragStart.current.y,
      });
    };
    const onUp = () => setIsFabDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isFabDragging]);

  const handleFabClick = useCallback(() => {
    if (!fabMoved.current) setIsOpen(true);
  }, []);

  // ─── 面板拖拽（标题栏） ───
  const handlePanelMouseDown = useCallback((e: React.MouseEvent) => {
    if (snapPos !== 'free') {
      // 解除snap时，将面板移到鼠标位置附近
      setSnapPos('free');
      setFreeRect(prev => ({ ...prev, x: e.clientX - prev.w / 2, y: e.clientY - 16 }));
    }
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - freeRect.x,
      y: e.clientY - freeRect.y,
    };
  }, [freeRect, snapPos]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      setFreeRect(prev => ({
        ...prev,
        x: Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragStart.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStart.current.y)),
      }));
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging]);

  // 点击外部关闭分类下拉和snap菜单
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpenCategory(null);
        setShowSnapMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── 悬浮按钮 ───
  if (!isOpen) {
    const fabStyle: React.CSSProperties = fabPos.x >= 0
      ? { left: fabPos.x, top: fabPos.y, right: 'auto', bottom: 'auto', position: 'fixed' }
      : { right: 24, bottom: 24, position: 'fixed' };

    return (
      <button
        onMouseDown={handleFabMouseDown}
        onClick={handleFabClick}
        className="z-50 group"
        style={{ ...fabStyle, cursor: isFabDragging ? 'grabbing' : 'grab' }}
        title="LaTeX 草稿本"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95">
          <PenTool className="w-5 h-5" />
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-medium rounded-lg shadow-lg border border-border/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          LaTeX 草稿本
        </span>
      </button>
    );
  }

  // 最小化状态
  if (isMinimized) {
    return (
      <div
        className="fixed z-50 bottom-6 right-6 bg-card border border-border/50 rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => setIsMinimized(false)}
      >
        <PenTool className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">LaTeX 草稿本</span>
        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }}
          className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // ─── 面板样式计算 ───
  const isFree = snapPos === 'free';
  const snapStyle = !isFree ? snapLayouts[snapPos].style : {};
  const panelStyle: React.CSSProperties = isFree
    ? { left: freeRect.x, top: freeRect.y, width: freeRect.w, height: freeRect.h }
    : { ...snapStyle };

  return (
    <div
      ref={panelRef}
      className={`fixed z-50 flex flex-col bg-card border border-border/50 rounded-2xl shadow-2xl ${
        isDragging ? '' : 'transition-[left,top,width,height,right,bottom]'
      } duration-300 ease-in-out`}
      style={{
        ...panelStyle,
        transitionProperty: isDragging ? 'none' : 'left, top, width, height, right, bottom',
      }}
    >
      {/* ─── 标题栏 ─── */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-border/40 cursor-move select-none shrink-0"
        onMouseDown={handlePanelMouseDown}
      >
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50" />
        <PenTool className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex-1">
          LaTeX 草稿本
        </span>

        {/* 布局切换按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowSnapMenu(!showSnapMenu)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="窗口布局"
          >
            <Columns2 className="w-3.5 h-3.5" />
          </button>
          {showSnapMenu && (
            <div className="absolute top-full right-0 mt-1 z-50 bg-popover border border-border/50 rounded-xl shadow-xl p-1.5 w-[180px]">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 mb-0.5">
                窗口布局
              </div>
              {/* 布局网格 */}
              <div className="grid grid-cols-3 gap-0.5 p-1 bg-muted/30 rounded-lg mb-1">
                {(['tl', 'full', 'tr', 'left', 'free', 'right', 'bl', 'full', 'br'] as (SnapPosition | 'full')[]).map((pos, i) => {
                  if (i === 1 || i === 7) return <div key={i} className="h-6" />;
                  return (
                    <button
                      key={i}
                      onClick={() => { setSnapPos(pos as SnapPosition); setShowSnapMenu(false); }}
                      className={`h-6 rounded text-[8px] font-medium transition-colors ${
                        snapPos === pos
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                      title={snapLayouts[pos as SnapPosition]?.label}
                    >
                      {snapLayouts[pos as SnapPosition]?.label}
                    </button>
                  );
                })}
              </div>
              {/* 快捷按钮列表 */}
              {(
                [
                  ['full', '全屏'],
                  ['left', '左半屏'],
                  ['right', '右半屏'],
                  ['free', '自由浮窗'],
                ] as [SnapPosition, string][]
              ).map(([pos, label]) => (
                <button
                  key={pos}
                  onClick={() => { setSnapPos(pos); setShowSnapMenu(false); }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    snapPos === pos
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-muted/50'
                  }`}
                >
                  {snapLayouts[pos].icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          title="最小化"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => { setIsOpen(false); setIsMinimized(false); }}
          className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="关闭"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ─── 符号面板（两行网格布局） ─── */}
      <div className="shrink-0 border-b border-border/30 bg-muted/20 px-3 py-3">
        <div className="grid grid-cols-6 sm:grid-cols-7 gap-x-1 gap-y-2">
          {SYMBOL_CATEGORIES.map((cat, i) => (
            <SymbolPaletteDropdown
              key={i}
              category={cat}
              onInsert={insertCode}
              isOpen={openCategory === i}
              onToggle={() => setOpenCategory(openCategory === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* ─── 主体区域：编辑器 + 预览 ─── */}
      <div className="flex-1 flex flex-col min-h-0 bg-background/50 rounded-b-2xl overflow-hidden">
        {/* 工具栏内嵌在主体区顶部 */}
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/10 bg-muted/5">
          <div className="text-[10px] text-muted-foreground font-medium pl-1">编辑区域</div>
          <div className="flex-1" />
          <button
            onClick={handleCopy}
            disabled={!code.trim()}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30"
            title="复制代码"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClear}
            disabled={!code.trim()}
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
            title="清空"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 编辑器 */}
        <div className="flex-1 min-h-0 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="在此输入 LaTeX 代码..."
            className="w-full h-full p-4 text-sm font-mono bg-transparent resize-none focus:outline-none placeholder:text-muted-foreground/30 leading-relaxed custom-scrollbar"
            spellCheck={false}
            autoFocus
          />
        </div>

        {/* 分割线改为渐变 */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent shrink-0" />

        {/* 预览区域 */}
        <div className="shrink-0 bg-muted/30 min-h-[140px]" style={{ flex: '0 0 35%' }}>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border/10">
            <div className={`w-2 h-2 rounded-full shadow-sm ${isEmpty ? 'bg-muted-foreground/20' : error ? 'bg-amber-500 shadow-amber-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-bold">
              {isEmpty ? 'PREVIEW' : error ? 'SYNTAX ERROR' : 'RENDER RESULT'}
            </span>
          </div>
          <div className="h-[calc(100%-32px)] overflow-auto flex items-center justify-center p-6 bg-grid-pattern">
            {isEmpty ? (
              <div className="flex flex-col items-center gap-2 opacity-30">
                <PenTool className="w-8 h-8" />
                <p className="text-xs text-center font-medium">
                  等待输入代码...
                </p>
              </div>
            ) : error ? (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 max-w-[90%]">
                <p className="text-[11px] text-amber-600 font-mono leading-relaxed break-words">
                  {error}
                </p>
              </div>
            ) : (
              <div
                className="[&_.katex-display]:!my-0 [&_.katex]:!text-2xl overflow-x-auto max-w-full w-full text-center px-4 py-2"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
