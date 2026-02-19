'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
        {/* Logo + 花体品牌名 */}
        <div className="relative flex items-center gap-4">
          {/* Logo 图标 + 光环动画 */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl bg-primary/15 animate-ping opacity-30" style={{ animationDuration: '2s' }} />
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/20 to-teal-500/20 animate-pulse" style={{ animationDuration: '3s' }} />
            <Image
              src="/images/logo1.png"
              alt="Latexia"
              width={56}
              height={56}
              className="relative rounded-xl shadow-2xl shadow-primary/30"
              priority
            />
            {/* 旋转光环 */}
            <div
              className="absolute -inset-1 border-2 border-t-primary/40 border-r-transparent border-b-transparent border-l-transparent rounded-xl animate-spin"
              style={{ animationDuration: '3s' }}
            />
          </div>

          {/* SVG 花体文字 — 使用独立 SVG 文件 */}
          <div className="h-10 w-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/latexia-text.svg"
              alt="Latexia"
              className="h-full w-auto"
              style={{ filter: 'brightness(0)' }}
            />
          </div>
        </div>

        {/* 打字机效果 */}
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
