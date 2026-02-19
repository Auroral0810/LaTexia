'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getProblemById, ProblemDetail } from '@/lib/problems';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ChevronRight,
  BookOpen,
  Send,
  RotateCcw,
  Lightbulb,
  Copy,
  Check,
  Clock,
  Code2,
  Lock,
  Star,
} from 'lucide-react';
import { FeedbackDialog } from '@/components/practice/FeedbackDialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 难度配色映射
function getDifficultyConfig(diff: string) {
  switch (diff) {
    case 'easy': return { label: '简单', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
    case 'medium': return { label: '中等', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
    case 'hard': return { label: '困难', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' };
    case 'hell': return { label: '地狱', color: 'bg-red-500/10 text-red-600 border-red-500/20' };
    default: return { label: diff, color: 'bg-muted text-muted-foreground border-border' };
  }
}

// 智能 LaTeX 预览：尝试 KaTeX 渲染，失败则回退为代码展示
function useLatexPreview(input: string) {
  return useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { html: '', isRendered: false, error: '' };
    try {
      // 尝试用 KaTeX 渲染（displayMode 用于独立公式）
      const html = katex.renderToString(trimmed, {
        throwOnError: true,
        displayMode: true,
        trust: true,
        strict: false,
      });
      return { html, isRendered: true, error: '' };
    } catch (e: any) {
      // KaTeX 无法解析（如 \begin{document} 等文档级命令），回退为代码展示
      return { html: '', isRendered: false, error: e.message || '无法渲染' };
    }
  }, [input]);
}

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // 答题状态
  const [userAnswer, setUserAnswer] = useState('');

  // 智能 LaTeX 预览
  const latexPreview = useLatexPreview(userAnswer);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // 收藏状态
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // 获取题目数据
  const { data: problem, isLoading, error } = useQuery({
    queryKey: ['problem', params.id, user?.id],
    queryFn: () => getProblemById(params.id, user?.id),
  });

  // 获取收藏状态
  useEffect(() => {
    if (!isAuthenticated || !user || !params.id) return;
    fetch(`${API_URL}/api/bookmarks/check/${params.id}`, {
      headers: { 'X-User-Id': user.id },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setIsBookmarked(data.data.bookmarked);
      })
      .catch(() => {});
  }, [isAuthenticated, user, params.id]);

  // 切换收藏
  const handleToggleBookmark = async () => {
    if (!isAuthenticated || !user || bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookmarks/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id,
        },
        body: JSON.stringify({ problemId: params.id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.data.bookmarked);
      }
    } catch (e) {
      // 静默处理
    } finally {
      setBookmarkLoading(false);
    }
  };

  // 处理提交
  const handleSubmit = useCallback(async () => {
    if (!problem) return;
    setSubmitted(true);

    let correct = false;
    if (problem.type === 'single' || problem.type === 'multiple') {
      // 选择题判定
      const correctOptions = (problem.options || [])
        .filter((o: any) => o.is_correct)
        .map((o: any) => o.key)
        .sort();
      const userSelected = [...selectedOptions].sort();
      correct = correctOptions.length === userSelected.length &&
        correctOptions.every((v: string, i: number) => v === userSelected[i]);
    } else {
      // 填空/LaTeX 输入判定 - 简单比较（去除空格）
      const normalizedAnswer = problem.answer.replace(/\s+/g, '').trim().toLowerCase();
      const normalizedUser = userAnswer.replace(/\s+/g, '').trim().toLowerCase();
      correct = normalizedAnswer === normalizedUser;
    }

    setIsCorrect(correct);

    // 上报答题结果（如果登录了）
    if (isAuthenticated && user) {
      try {
        await fetch(`${API_URL}/api/problems/${problem.id}/attempt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': user.id,
          },
          body: JSON.stringify({ isCorrect: correct }),
        });
      } catch (e) {
        // 静默处理
      }
    }
  }, [problem, userAnswer, selectedOptions, isAuthenticated, user]);

  // 重置
  const handleReset = () => {
    setUserAnswer('');
    setSelectedOptions([]);
    setSubmitted(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setShowAnswer(false);
  };

  // 选择题切换选项
  const toggleOption = (key: string) => {
    if (submitted) return;
    if (problem?.type === 'single') {
      setSelectedOptions([key]);
    } else {
      setSelectedOptions(prev =>
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
    }
  };

  // 复制答案
  const handleCopyAnswer = () => {
    if (!problem) return;
    navigator.clipboard.writeText(problem.answer);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // 快捷键支持
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !submitted) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSubmit, submitted]);

  // 加载态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">正在加载题目...</p>
        </div>
      </div>
    );
  }

  // 错误态
  if (error || !problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold">题目不存在</h2>
          <p className="text-sm text-muted-foreground">该题目可能已被移除或 ID 无效</p>
          <button
            onClick={() => router.push('/practice')}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            返回题库
          </button>
        </div>
      </div>
    );
  }

  const diffConfig = getDifficultyConfig(problem.difficulty);
  const passRate = problem.attemptCount
    ? ((problem.correctCount || 0) / problem.attemptCount * 100).toFixed(1)
    : '0.0';

  return (
    <div className="bg-background">
      <div className="container py-6 max-w-5xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/practice')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回题库</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-sm text-foreground font-medium truncate max-w-[300px]">{problem.title}</span>
        </div>

        {/* 登录网关：未登录时显示玻璃模糊遮罩 */}
        <div className="relative">
          {!isAuthenticated && (
            <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ minHeight: '400px' }}>
              {/* 模糊遮罩层 */}
              <div className="absolute inset-0 backdrop-blur-md bg-background/60" />
              {/* 登录提示卡片 */}
              <div className="relative z-10 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">登录后开始答题</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    请先登录您的账号，即可查看完整题目并提交答案
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 pt-1">
                  <Link
                    href="/login"
                    className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity text-center"
                  >
                    立即登录
                  </Link>
                  <Link
                    href="/register"
                    className="w-full py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-center"
                  >
                    注册账号
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start ${!isAuthenticated ? 'select-none pointer-events-none' : ''}`}>
          {/* 左侧：题目内容 */}
          <div className="space-y-4 min-w-0">
            {/* 题头 + 题目内容合并卡 */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              {/* 标题行 */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-xl font-bold leading-snug">{problem.title}</h1>
                <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${diffConfig.color}`}>
                  {diffConfig.label}
                </span>
              </div>

              {/* 元信息标签 */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                {problem.categoryName && (
                  <span className="bg-muted px-2 py-0.5 rounded-md">{problem.categoryName}</span>
                )}
                {problem.tags.map(t => (
                  <span
                    key={t.id}
                    className="px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${t.color}15`, color: t.color || 'var(--muted-foreground)' }}
                  >
                    {t.name}
                  </span>
                ))}
                <span className="ml-auto">
                  通过率 <span className="font-bold text-foreground">{passRate}%</span>
                  <span className="opacity-50 ml-1">({problem.attemptCount || 0} 次尝试)</span>
                </span>
              </div>

              {/* 分隔线 */}
              <div className="h-px bg-border/50 mb-4" />

              {/* 题目描述 */}
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">题目描述</h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeRaw]}
                >
                  {problem.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* 答题区 */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                  {problem.type === 'single' ? '单选题' : problem.type === 'multiple' ? '多选题' : problem.type === 'latex_input' ? 'LaTeX 输入' : '填空题'}
                </h2>
              </div>

              {/* 选择题 */}
              {(problem.type === 'single' || problem.type === 'multiple') && problem.options && (
                <div className="space-y-3">
                  {(problem.options as any[]).map((opt) => {
                    const isSelected = selectedOptions.includes(opt.key);
                    const isSubmittedCorrect = submitted && opt.is_correct;
                    const isSubmittedWrong = submitted && isSelected && !opt.is_correct;

                    return (
                      <button
                        key={opt.key}
                        onClick={() => toggleOption(opt.key)}
                        disabled={submitted}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSubmittedCorrect
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : isSubmittedWrong
                              ? 'border-red-500/50 bg-red-500/5'
                              : isSelected
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border/50 bg-background/50 hover:border-border hover:bg-muted/30'
                        } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isSubmittedCorrect
                              ? 'bg-emerald-500 text-white'
                              : isSubmittedWrong
                                ? 'bg-red-500 text-white'
                                : isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                          }`}>
                            {opt.key}
                          </span>
                          <div className="flex-1 text-sm">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex, rehypeRaw]}
                            >
                              {opt.content}
                            </ReactMarkdown>
                          </div>
                          {isSubmittedCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                          {isSubmittedWrong && <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 填空/LaTeX 输入题 */}
              {(problem.type === 'fill_blank' || problem.type === 'latex_input') && (
                <div className="space-y-3">
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={submitted}
                    placeholder={problem.type === 'latex_input' ? '输入 LaTeX 代码，如 \\frac{a}{b}' : '输入你的答案...'}
                    className="w-full min-h-[100px] p-4 rounded-xl border-2 border-border/50 bg-background/50 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-y disabled:opacity-60 disabled:cursor-default placeholder:text-muted-foreground/50"
                  />
                  {/* LaTeX 智能预览 */}
                  {problem.type === 'latex_input' && userAnswer.trim() && (
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                          {latexPreview.isRendered ? '渲染预览' : '代码预览'}
                        </span>
                        {!latexPreview.isRendered && (
                          <span className="text-[10px] text-amber-500/80 ml-auto">该命令无法作为数学公式渲染</span>
                        )}
                      </div>
                      {latexPreview.isRendered ? (
                        <div
                          className="py-3 px-4 rounded-lg bg-background border border-border/30 overflow-x-auto text-center [&_.katex-display]:!my-0"
                          dangerouslySetInnerHTML={{ __html: latexPreview.html }}
                        />
                      ) : (
                        <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-100 text-sm font-mono leading-relaxed overflow-x-auto"><code>{userAnswer}</code></pre>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 判定结果 */}
              {submitted && (
                <div className={`mt-4 p-4 rounded-xl border-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  isCorrect
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                }`}>
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <div>
                      <p className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isCorrect ? '回答正确！' : '回答错误'}
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          正确答案已标出，可查看解析了解详情
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                {!submitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={
                      (problem.type === 'single' || problem.type === 'multiple')
                        ? selectedOptions.length === 0
                        : !userAnswer.trim()
                    }
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    提交答案
                    <span className="text-[10px] opacity-60 ml-1">⌘↵</span>
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重新作答
                  </button>
                )}
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all flex items-center gap-2"
                >
                  {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showAnswer ? '隐藏答案' : '查看答案'}
                </button>
                {problem.answerExplanation && (
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all flex items-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showExplanation ? '隐藏解析' : '查看解析'}
                  </button>
                )}
              </div>
            </div>

            {/* 正确答案展示 */}
            {showAnswer && (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    正确答案
                  </h3>
                  <button
                    onClick={handleCopyAnswer}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? '已复制' : '复制'}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/30 font-mono text-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {problem.answer}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* 答案解析 */}
            {showExplanation && problem.answerExplanation && (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  答案解析
                </h3>
                <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {problem.answerExplanation}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：题目信息侧栏 */}
          <div className="space-y-3 lg:sticky lg:top-24">
            {/* 题目信息卡 */}
            <div className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm">
              <h3 className="font-bold text-xs mb-3 uppercase tracking-wider text-muted-foreground">题目信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">题型</span>
                  <span className="font-medium text-xs">
                    {problem.type === 'single' ? '单选题' : problem.type === 'multiple' ? '多选题' : problem.type === 'latex_input' ? 'LaTeX 输入' : '填空题'}
                  </span>
                </div>
                <div className="h-px bg-border/40" />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">难度</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${diffConfig.color}`}>{diffConfig.label}</span>
                </div>
                <div className="h-px bg-border/40" />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">分值</span>
                  <span className="font-medium text-xs">{problem.score || 10} 分</span>
                </div>
                <div className="h-px bg-border/40" />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">通过率</span>
                  <span className="font-bold text-primary text-xs">{passRate}%</span>
                </div>
              </div>
            </div>

            {/* 用户状态 */}
            {isAuthenticated && (
              <div className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm">
                <div className={`flex items-center gap-2.5 p-2.5 rounded-xl ${
                  problem.status === 'solved'
                    ? 'bg-emerald-500/5 border border-emerald-500/20'
                    : problem.status === 'attempted'
                      ? 'bg-amber-500/5 border border-amber-500/20'
                      : 'bg-muted/30 border border-border/50'
                }`}>
                  {problem.status === 'solved' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {problem.status === 'attempted' && <Clock className="w-4 h-4 text-amber-500" />}
                  {problem.status === 'unstarted' && <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />}
                  <span className="text-xs font-medium">
                    {problem.status === 'solved' ? '已通过' : problem.status === 'attempted' ? '尝试中' : '未开始'}
                  </span>
                </div>
              </div>
            )}

            {/* 快捷操作 */}
            <div className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>提交答案</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono border border-border">⌘ + ↵</kbd>
              </div>
              <div className="h-px bg-border/40" />
              {isAuthenticated && (
                <>
                  <button
                    onClick={handleToggleBookmark}
                    disabled={bookmarkLoading}
                    className={`flex items-center gap-1.5 w-full text-xs transition-colors py-1.5 px-2 rounded-lg ${
                      isBookmarked
                        ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/15'
                        : 'text-muted-foreground hover:text-amber-500 hover:bg-amber-500/5'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span>{isBookmarked ? '已收藏' : '收藏题目'}</span>
                  </button>
                  <div className="h-px bg-border/40" />
                </>
              )}
              <div className="flex justify-center pt-1">
                <FeedbackDialog problemId={problem.id} problemTitle={problem.title} />
              </div>
            </div>

            {/* 返回按钮 */}
            <Link
              href="/practice"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              返回题库
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
