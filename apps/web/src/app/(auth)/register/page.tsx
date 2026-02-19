'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');

  return (
    <div className="w-full flex h-screen">
      {/* Left Side - Brand & Info (Mirrored/Varied from Login) */}
      <div className="hidden lg:flex w-1/2 bg-teal-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Decor */}
        <div className="absolute inset-0 bg-gradient-to-bl from-teal-800 via-primary to-emerald-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}></div>
        
        {/* Floating Icons */}
        <div className="absolute bottom-1/4 left-10 transform -translate-x-1/4 -rotate-12 w-64 h-64 bg-white/5 backdrop-blur-3xl rounded-full blur-2xl animate-breathe"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-2 group w-fit">
             <div className="w-10 h-10 rounded-xl bg-white text-teal-800 flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-110">
              L
            </div>
            <span className="font-heading font-bold text-2xl">Latexia</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-6">甚至比 Word <br/>更简单？</h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Latexia 的智能辅助和实时预览功能，消除了 LaTeX 陡峭的学习曲线。
            立即注册，免费体验新时代的文档排版工具。
          </p>
          <div className="mt-8 flex gap-4">
            <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>云端实时同步</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>团队协作编辑</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/60">
          © {new Date().getFullYear()} Latexia Inc.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background relative">
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="flex items-center space-x-2 group">
             <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              L
            </div>
          </Link>
        </div>

        <Link href="/" className="absolute top-8 right-8 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
        
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">创建账户</h1>
            <p className="mt-2 text-muted-foreground">
              开启你的学术写作新篇章
            </p>
          </div>

          {/* Register Method Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setRegisterMethod('email')}
              className={`py-2 text-sm font-medium rounded-lg transition-all ${
                registerMethod === 'email' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              邮箱注册
            </button>
            <button
              onClick={() => setRegisterMethod('phone')}
              className={`py-2 text-sm font-medium rounded-lg transition-all ${
                registerMethod === 'phone' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              手机注册
            </button>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="latex_master"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {registerMethod === 'email' ? (
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            ) : (
               <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  手机号码
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="13800000000"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 8 个字符"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                密码强度: <span className="text-xs text-muted-foreground/60">输入以查看</span>
              </p>
            </div>

            {registerMethod === 'phone' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  验证码
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="6位数字"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <button type="button" className="shrink-0 px-4 h-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors">
                    获取验证码
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                我同意{' '}
                <Link href="/terms" className="text-primary hover:underline">用户协议</Link>
                {' '}和{' '}
                <Link href="/privacy" className="text-primary hover:underline">隐私政策</Link>
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full shadow-sm"
            >
              注 册
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                快捷注册
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
             <button className="flex h-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors" title="GitHub">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
             </button>
             <button className="flex h-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors" title="Apple">
                 <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.64 4.19-1.29 1.49.25 2.36 1.15 2.71 1.66-2.3 1.4-1.92 4.49.52 5.51-.43 1.54-1.67 3.99-2.5 5.35zm-2.8-15.68c1.3-1.57 2.14-1.39 2.56-1.3 0 0 .15 2.94-2.56 4.73-1.44.97-2.61.55-2.61.55-.38-2.61 2.06-3.98 2.61-3.98z"/></svg>
             </button>
             <button className="flex h-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-blue-600" title="QQ">
               <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.41 15.54c-.63.72-2.23 1.26-3.52 0-.29-.29-1.55-2.32-1.75-2.79-.1-.23.13-.33.27-.26.65.34 1.47.59 1.5.59.06.02.11-.05.18-.14.43-.58.74-1.53.74-2.58 0-2.73-1.64-4.22-3.42-4.22-1.78 0-3.42 1.49-3.42 4.22 0 1.05.32 2.01.75 2.58.06.09.11.16.17.14.03-.01.85-.26 1.5-.59.15-.08.37.03.27.26-.2.47-1.46 2.5-1.75 2.79-1.29 1.26-2.89.72-3.52 0-.29-.33-.22-1.12.31-1.58.27-.23 1.19-.61 2.12-.22l.06.02c.34.14.26.69-.11.69-.1 0-.18-.08-.23-.15-.31-.44-1.05-.14-1.02.32.01.13.35 2.04 2.82 2.04 1.14 0 1.94-.37 2.45-1.13l.26-.41c.21-.33.99-.33 1.2 0l.26.41c.51.76 1.31 1.13 2.45 1.13 2.47 0 2.81-1.91 2.82-2.04.03-.46-.71-.76-1.02-.32-.05.08-.14.15-.23.15-.37 0-.45-.55-.11-.69l.06-.02c.93-.39 1.85-.01 2.12.22.53.46.6 1.25.31 1.58z"/></svg> 
             </button>
             <button className="flex h-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-green-600" title="WeChat">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.5 12c-2.4 0-4.4 1.7-4.4 3.9 0 2.2 2 3.9 4.4 3.9 0.5 0 1.1-0.1 1.5-0.2 0.4 0.3 1.4 0.9 1.5 0.9 0 0-0.2-0.8-0.2-1 0.6-0.8 1-1.8 1-2.8C21.4 14.1 19.8 12 17.5 12zM7.7 3C3.6 3 0.2 6.1 0.2 10c0 2.2 1.1 4.2 2.8 5.4 -0.1 0.5-0.4 1.8-0.5 2.1 0 0 2.4-0.4 3.3-1.1 0.6 0.2 1.3 0.3 2 0.3 0.1 0 0.1 0 0.2 0 -0.1-0.5-0.1-1-0.1-1.6C7.9 9.8 11.6 6.3 16.1 6.3 13.7 4.3 10.9 3 7.7 3zM9.5 8c0 0.4-0.3 0.7-0.7 0.7 -0.4 0-0.7-0.3-0.7-0.7 0-0.4 0.3-0.7 0.7-0.7C9.2 7.3 9.5 7.6 9.5 8zM5.5 8c0 0.4-0.3 0.7-0.7 0.7 -0.4 0-0.7-0.3-0.7-0.7 0-0.4 0.3-0.7 0.7-0.7C5.2 7.3 5.5 7.6 5.5 8z"/></svg>
             </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            已经有账户？{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
