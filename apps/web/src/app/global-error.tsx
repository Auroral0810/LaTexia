'use client';

import React from 'react';

/**
 * 根级错误边界：捕获根 layout 及以下的未处理错误，避免白屏或“missing required error components”等异常。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            backgroundColor: '#0c0c0d',
            color: '#f8fafc',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>页面出错</h1>
          <p style={{ color: '#a1a1aa', marginBottom: 24, textAlign: 'center' }}>
            {error.message || '发生了意外错误'}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2dd4bf',
              color: '#042f2e',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            重试
          </button>
          <a
            href="/"
            style={{
              marginTop: 16,
              color: '#2dd4bf',
              textDecoration: 'none',
            }}
          >
            返回首页
          </a>
        </main>
      </body>
    </html>
  );
}
