'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown,
  Search,
  Check,
  Disc,
  Music,
  ListVideo
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const PRESETS = [
  { name: '方大同', id: '13532313680' },
  { name: '林俊杰', id: '6627049290' },
  { name: '周杰伦', id: '11860849' },
  { name: '张杰', id: '530928958' },
  { name: '邓紫棋', id: '5279377564' },
  { name: '中文说唱', id: '2240792884' },
  { name: 'R&B', id: '6703233707' },
  { name: '流行', id: '12740998746' },
  { name: '古风', id: '2357742963' },
  { name: '民谣', id: '2770902965' },
  { name: '英文', id: '2256615030' },
];

export function MusicPlayer() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLyrics, setShowLyrics] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const [neteaseId, setNeteaseId] = useState(PRESETS[0].id);
  const [inputUrl, setInputUrl] = useState('');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('latexia-netease-id');
    const savedLyrics = localStorage.getItem('latexia-netease-lyrics');
    if (saved) {
        setNeteaseId(saved);
    }
    if (savedLyrics !== null) {
        setShowLyrics(savedLyrics === 'true');
    }
  }, []);

  // Poll for APlayer's play state to animate our floating disc
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const aplayer = document.querySelector('.custom-aplayer-theme .aplayer');
      if (aplayer) {
        setIsPlaying(aplayer.classList.contains('aplayer-playing'));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  const handleUpdateId = () => {
    if (!inputUrl.trim()) return;
    
    let newId = inputUrl.trim();
    const match = newId.match(/id=(\d+)/);
    if (match) {
      newId = match[1];
    }
    
    if (/^\d+$/.test(newId)) {
        setNeteaseId(newId);
        localStorage.setItem('latexia-netease-id', newId);
        setInputUrl('');
    } else {
        alert("请输入有效的网易云歌单 ID 或链接");
    }
  };

  const handleSelectPreset = (id: string) => {
    setNeteaseId(id);
    localStorage.setItem('latexia-netease-id', id);
  };

  const toggleLyrics = () => {
    const newVal = !showLyrics;
    setShowLyrics(newVal);
    localStorage.setItem('latexia-netease-lyrics', String(newVal));
  };

  if (!mounted) return null;

  return (
    <div className={cn("fixed bottom-6 left-6 z-[100] font-sans", currentTheme === 'dark' ? "dark" : "")}>
      
      {/* Floating Toggle Button */}
      <button 
         onClick={() => setIsExpanded(!isExpanded)}
         className="relative w-12 h-12 rounded-full bg-background/90 backdrop-blur-md border border-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center text-primary group transition-all hover:scale-110"
      >
         <Disc className={cn("w-6 h-6 transition-transform", isPlaying ? "animate-spin" : "")} style={{ animationDuration: '3s' }} />
         {!isExpanded && (
           <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
         )}
      </button>

      {/* 
          Unified Card 
          We use strictly CSS width/height/padding transitions WITHOUT transform or opacity.
          This ensures fixed positioning of the lyrics breaks out of this container securely
          even when collapsed. 
      */}
      <div 
         className={cn(
            "absolute bottom-16 left-0 bg-background rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border flex flex-col transition-[max-width,max-height,padding] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] custom-aplayer-theme",
            isExpanded ? "max-w-[360px] max-h-[800px] p-4 border-border" : "max-w-0 max-h-0 p-0 border-transparent",
            showLyrics ? "lrc-enabled" : "lrc-disabled"
         )}
      >
         {/* Fixed width container prevents APlayer from jumping during card stretch */}
         <div className="w-[326px] flex flex-col gap-4">
             {/* Header */}
             <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold tracking-tight text-foreground uppercase">Audio Station</span>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                      onClick={toggleLyrics} 
                      className={cn(
                        "text-[11px] px-2.5 py-1 rounded-full font-semibold transition-colors flex items-center gap-1", 
                        showLyrics ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                   >
                      歌词 {showLyrics ? 'ON' : 'OFF'}
                   </button>
                   <button 
                      onClick={() => setIsExpanded(false)} 
                      className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                   >
                      <ChevronDown className="w-5 h-5"/>
                   </button>
                </div>
             </div>

             {/* Presets (Scrollable pill list) */}
             <div className="space-y-2">
                 <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">精选歌单</div>
                 <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto custom-scrollbar pr-1 pb-1">
                     {PRESETS.map(p => (
                        <button 
                          key={p.id} 
                          onClick={() => handleSelectPreset(p.id)}
                          className={cn(
                             "text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200", 
                             neteaseId === p.id 
                               ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105" 
                               : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-primary"
                          )}
                        >
                          {p.name}
                        </button>
                     ))}
                 </div>
             </div>

             {/* Input for Custom ID */}
             <div className="flex gap-2 items-center">
                 <div className="relative flex-1">
                     <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                     <input 
                        type="text"
                        placeholder="或输入网易云歌单ID..."
                        className="w-full bg-muted/60 border-none rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:ring-1 ring-primary transition-all outline-none"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateId()}
                     />
                 </div>
                 <button 
                    onClick={handleUpdateId}
                    className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
                 >
                     <Check className="w-4 h-4" />
                 </button>
             </div>

             {/* MetingJS player block */}
             <div className="rounded-2xl overflow-hidden shadow-inner border border-border/40 [&_.aplayer]:!m-0 [&_.aplayer]:!shadow-none [&_.aplayer]:!border-none" key={neteaseId}>
                 <meting-js 
                    server="netease" 
                    type="playlist" 
                    id={neteaseId} 
                    auto="auto" 
                    list-folded="true" 
                    theme={currentTheme === 'dark' ? '#10b981' : '#059669'} 
                    suppressHydrationWarning
                 ></meting-js>
             </div>
         </div>
      </div>

      {/* Global CSS to override MetingJS & APlayer */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Hidden lyrics state */
        .lrc-disabled .aplayer-lrc {
            display: none !important;
        }

        /* Modern Flat Lyrics Container */
        .lrc-enabled .aplayer-lrc {
            display: block !important;
            position: fixed !important;
            bottom: 40px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 100vw !important;
            height: 60px !important;
            z-index: 9999 !important;
            pointer-events: none !important;
            background: transparent !important;
            overflow: visible !important;
            margin: 0 !important;
            text-align: center !important;
            /* Remove bad gradient masks and shadows added by APlayer */
            mask-image: none !important;
            -webkit-mask-image: none !important;
            text-shadow: none !important;
        }

        .lrc-enabled .aplayer-lrc::before,
        .lrc-enabled .aplayer-lrc::after {
            display: none !important;
        }

        .lrc-enabled .aplayer-lrc-contents {
            transform: none !important;
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
        }

        .lrc-enabled .aplayer-lrc p {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: max-content !important;
            max-width: 90vw !important;
            font-size: 16px !important;
            font-family: 'Inter', ui-sans-serif, system-ui, sans-serif !important;
            color: transparent !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: opacity 0.4s ease !important;
            line-height: 1.5 !important;
            margin: 0 !important;
            padding: 8px 24px !important;
            white-space: normal !important;
        }

        .lrc-enabled .aplayer-lrc p.aplayer-lrc-current {
            visibility: visible !important;
            opacity: 1 !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            color: hsl(var(--foreground)) !important;
            
            /* Sleek Modern Pill Background */
            background: hsl(var(--background) / 0.85) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid hsl(var(--border) / 0.6) !important;
            border-radius: 9999px !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08) !important;
            letter-spacing: 0.5px !important;
        }

        /* Dark mode overrides for the internal player within the card */
        .dark .custom-aplayer-theme .aplayer {
            background: #18181b !important;
            color: #fff !important;
        }
        .dark .custom-aplayer-theme .aplayer .aplayer-info .aplayer-controller .aplayer-time { color: #a1a1aa !important; }
        .dark .custom-aplayer-theme .aplayer .aplayer-info .aplayer-music .aplayer-title { color: #f4f4f5 !important; }
        .dark .custom-aplayer-theme .aplayer .aplayer-info .aplayer-music .aplayer-author { color: #a1a1aa !important; }
        .dark .custom-aplayer-theme .aplayer .aplayer-list { background: #18181b !important; border-color: #27272a !important; }
        .dark .custom-aplayer-theme .aplayer .aplayer-list ol li { border-top: 1px solid #27272a !important; }
        .dark .custom-aplayer-theme .aplayer .aplayer-list ol li:hover { background: #27272a !important; }
        .dark .custom-aplayer-theme .aplayer .aplayer-list ol li.aplayer-list-light { background: #3f3f46 !important; }
        .dark .custom-aplayer-theme .aplayer .aplayer-list ol li .aplayer-list-author { color: #a1a1aa !important; }
        .dark .custom-aplayer-theme .aplayer .aplayer-list ol li .aplayer-list-title { color: #e4e4e7 !important; }
        .dark .custom-aplayer-theme .aplayer .aplayer-list ol li .aplayer-list-index { color: #52525b !important; }
      `}} />
    </div>
  );
}
