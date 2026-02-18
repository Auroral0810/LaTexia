'use client';

import { useEffect, useState } from 'react';

export function Loading() {
  const [text, setText] = useState('');
  const fullText = '\\documentclass{latexia}';

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      setText(fullText.substring(0, index));

      if (!isDeleting && index < fullText.length) {
        index++;
        timeoutId = setTimeout(type, 100);
      } else if (!isDeleting && index === fullText.length) {
        timeoutId = setTimeout(() => {
          isDeleting = true;
          type();
        }, 1500);
      } else if (isDeleting && index > 0) {
        index--;
        timeoutId = setTimeout(type, 50);
      } else {
        isDeleting = false;
        timeoutId = setTimeout(type, 500);
      }
    };

    type();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md transition-all duration-500">
      <div className="relative flex flex-col items-center gap-8">
        {/* Central Logo Construction Animation */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-xl bg-primary/20 animate-ping opacity-20 duration-1000" />
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-primary to-teal-600 shadow-2xl shadow-primary/30 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            <span className="text-5xl font-bold text-white font-heading relative z-10 animate-pulse">L</span>
            
            {/* Spinning Ring */}
            <div className="absolute inset-0 border-2 border-white/20 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-t-white/60 border-r-transparent border-b-transparent border-l-transparent rounded-2xl animate-spin duration-[3s]"></div>
          </div>
        </div>

        {/* Typing Text Effect */}
        <div className="flex flex-col items-center gap-2 h-16">
          <div className="flex items-center gap-1 font-mono text-lg text-primary/80">
            <span>{text}</span>
            <span className="w-2 h-5 bg-primary/50 animate-blink"></span>
          </div>
          <p className="text-xs text-muted-foreground/60 uppercase tracking-[0.2em] animate-pulse">
            Compiling assets...
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loading;
