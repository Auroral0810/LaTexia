'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const formulas = [
  'E = mc^2',
  '\\int_0^\\infty e^{-x} dx = 1',
  '\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}',
  '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
  'i\\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H} \\Psi',
];

export default function NotFound() {
  const [currentFormula, setCurrentFormula] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFormula((prev) => (prev + 1) % formulas.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const glitch = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);
    return () => clearInterval(glitch);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* 背景粒子装饰 */}
      <div className="absolute inset-0 -z-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/5 animate-float"
            style={{
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 16}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${4 + i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* 404 大文字 */}
      <div className="relative mb-8">
        <h1
          className={`text-[10rem] sm:text-[14rem] font-heading font-black leading-none tracking-tighter text-gradient bg-gradient-to-br from-primary/80 via-primary to-teal-300 transition-all duration-100 ${
            glitchActive ? 'translate-x-1 skew-x-2' : ''
          }`}
        >
          404
        </h1>
        {/* 阴影效果 */}
        <div className="absolute inset-0 text-[10rem] sm:text-[14rem] font-heading font-black leading-none tracking-tighter text-primary/5 translate-x-2 translate-y-2 -z-10 select-none" aria-hidden="true">
          404
        </div>
      </div>

      {/* 装饰分割线 */}
      <div className="w-16 h-1 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />

      {/* 描述 */}
      <div className="text-center max-w-md animate-slide-up">
        <h2 className="text-2xl font-heading font-bold mb-3">
          页面已编译失败
        </h2>
        <p className="text-muted-foreground mb-2">
          看起来这个页面在编译过程中遇到了错误…
        </p>
        <p className="text-sm font-mono text-muted-foreground/60 mb-8 bg-muted/50 rounded-lg px-4 py-2 border border-border/50">
          ! LaTeX Error: File &apos;{'{page}'}&apos; not found.
        </p>
      </div>

      {/* 流动公式装饰 */}
      <div className="mb-10 h-6 overflow-hidden">
        <p className="font-mono text-xs text-muted-foreground/30 animate-fade-in" key={currentFormula}>
          $ {formulas[currentFormula]} $
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-4 flex-wrap justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
        >
          <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          返回首页
        </Link>
        <Link
          href="/practice"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold shadow-sm hover:bg-accent transition-all hover:-translate-y-0.5"
        >
          去练习
        </Link>
      </div>
    </div>
  );
}
