'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  return (
    <div className="w-full flex h-screen">
      {/* Left Side - Brand & Info */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12 text-primary-foreground">
        {/* Background Decor */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal-600 to-emerald-700"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        {/* Floating Code Snippets */}
        <div className="absolute top-1/4 right-0 transform translate-x-1/3 rotate-12 bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 w-80 animate-float">
          <code className="font-mono text-sm text-blue-200">
            \documentclass{'{article}'}<br/>
            \usepackage{'{amsmath}'}<br/>
            \begin{'{document}'}<br/>
            &nbsp;&nbsp;Hello, \LaTeX!<br/>
            \end{'{document}'}
          </code>
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-2 group w-fit">
             <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-110">
              L
            </div>
            <span className="font-heading font-bold text-2xl">Latexia</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-6">大师级的排版体验<br/>触手可及</h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            无论你是撰写学术论文、制作简历，还是记录数学笔记，
            Latexia 都能为你提供最优雅、最高效的写作环境。
          </p>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/60">
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
            <h1 className="text-3xl font-bold tracking-tight">欢迎回来</h1>
            <p className="mt-2 text-muted-foreground">
              登录以继续你的 LaTeX 之旅
            </p>
          </div>

          {/* Login Method Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setLoginMethod('email')}
              className={`py-2 text-sm font-medium rounded-lg transition-all ${
                loginMethod === 'email' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              邮箱密码
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`py-2 text-sm font-medium rounded-lg transition-all ${
                loginMethod === 'phone' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              手机验证码
            </button>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {loginMethod === 'email' ? (
              <>
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
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      密码
                    </label>
                    <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                      忘记密码？
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </>
            ) : (
              <>
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
              </>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full shadow-sm"
            >
              登 录
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                其他方式登录
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {[
              { name: 'QQ', icon: '/images/QQ.svg', width: 20, height: 20 },
              { name: 'Google', icon: '/images/google.svg', width: 20, height: 20 },
              { name: 'GitHub', icon: '/images/GitHub.svg', width: 22, height: 22 },
              { name: 'WeChat', icon: '/images/wechat.svg', width: 24, height: 24 },
              { name: 'Apple', icon: '/images/apple.svg', width: 20, height: 20 },
            ].map((item) => (
              <button 
                key={item.name}
                className="flex h-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all hover:-translate-y-0.5" 
                title={item.name}
              >
                <img src={item.icon} alt={item.name} width={item.width} height={item.height} className="opacity-90 hover:opacity-100" />
              </button>
            ))}
          </div>


          <p className="px-8 text-center text-sm text-muted-foreground">
            还没有账户？{' '}
            <Link href="/register" className="hover:text-primary underline underline-offset-4">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
