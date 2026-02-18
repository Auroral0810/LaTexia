export function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-6">
        {/* 外环脉冲 */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
          <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse-ring" style={{ animationDelay: '0.3s' }} />

          {/* Logo 呼吸动画 */}
          <div className="relative w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground animate-breathe shadow-lg shadow-primary/25">
            <span className="text-2xl font-bold font-heading">L</span>
          </div>
        </div>

        {/* 加载文字 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">加载中</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
          </span>
        </div>

        {/* 底部 LaTeX 公式装饰 */}
        <div className="text-xs text-muted-foreground/40 font-mono tracking-wider">
          {'\\documentclass{latexia}'}
        </div>
      </div>
    </div>
  );
}

export default Loading;
