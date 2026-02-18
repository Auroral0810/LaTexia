'use client';

/**
 * 全局错误页面
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-danger mb-4">出错了</h1>
      <p className="text-lg text-muted-foreground mb-8">
        {error.message || '发生了意外错误'}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        重试
      </button>
    </main>
  );
}
