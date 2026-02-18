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

          <div className="grid grid-cols-4 gap-3">
             <button className="flex h-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors" title="GitHub">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
             </button>
             <button className="flex h-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors" title="Apple">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" /></svg>
                 {/* Apple Icon placeholder, reusing FB icon path for structure, replace with actual SVG path */}
                 <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.64 4.19-1.29 1.49.25 2.36 1.15 2.71 1.66-2.3 1.4-1.92 4.49.52 5.51-.43 1.54-1.67 3.99-2.5 5.35zm-2.8-15.68c1.3-1.57 2.14-1.39 2.56-1.3 0 0 .15 2.94-2.56 4.73-1.44.97-2.61.55-2.61.55-.38-2.61 2.06-3.98 2.61-3.98z"/></svg>
             </button>
             <button className="flex h-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-blue-600" title="QQ">
                {/* QQ Icon Placehoder */}
               <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.003 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm.983 16.152c-.628.718-2.227 1.258-3.52 0-.294-.286-1.55-2.316-1.748-2.785-.098-.23.125-.333.272-.257.653.336 1.472.585 1.503.593.06.016.108-.052.176-.145.428-.58.74-1.527.74-2.58 0-2.73-1.637-4.225-3.418-4.225-1.782 0-3.418 1.495-3.418 4.225 0 1.053.313 2.002.742 2.58.067.092.115.16.175.145.032-.008.85-.257 1.503-.593.147-.076.37.027.272.257-.198.47-1.455 2.5-1.748 2.785-1.293 1.258-2.892.718-3.52 0-.29-.333-.217-1.12.308-1.58.267-.234 1.192-.61 2.12-.224l.056.023c.338.136.26.685-.113.685-.095 0-.177-.076-.23-.153-.306-.437-1.05-.137-1.02.323.01.127.348 2.04 2.82 2.04 1.137 0 1.94-.37 2.45-1.128l.26-.406c.205-.327.994-.327 1.2 0l.26.406c.51.758 1.312 1.128 2.448 1.128 2.472 0 2.81-1.913 2.82-2.04.032-.46-.713-.76-1.02-.323-.053.077-.135.153-.23.153-.373 0-.45-.55-.113-.685l.057-.023c.928-.386 1.853-.01 2.12.224.524.46.598 1.247.308 1.58z"/></svg> 
             </button>
             <button className="flex h-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-green-600" title="WeChat">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.5 12c-2.4 0-4.4 1.7-4.4 3.9 0 2.2 2 3.9 4.4 3.9 0.5 0 1.1-0.1 1.5-0.2 0.4 0.3 1.4 0.9 1.5 0.9 0 0-0.2-0.8-0.2-1 0.6-0.8 1-1.8 1-2.8C21.4 14.1 19.8 12 17.5 12zM7.7 3C3.6 3 0.2 6.1 0.2 10c0 2.2 1.1 4.2 2.8 5.4 -0.1 0.5-0.4 1.8-0.5 2.1 0 0 2.4-0.4 3.3-1.1 0.6 0.2 1.3 0.3 2 0.3 0.1 0 0.1 0 0.2 0 -0.1-0.5-0.1-1-0.1-1.6C7.9 9.8 11.6 6.3 16.1 6.3 13.7 4.3 10.9 3 7.7 3zM9.5 8c0 0.4-0.3 0.7-0.7 0.7 -0.4 0-0.7-0.3-0.7-0.7 0-0.4 0.3-0.7 0.7-0.7C9.2 7.3 9.5 7.6 9.5 8zM5.5 8c0 0.4-0.3 0.7-0.7 0.7 -0.4 0-0.7-0.3-0.7-0.7 0-0.4 0.3-0.7 0.7-0.7C5.2 7.3 5.5 7.6 5.5 8z"/></svg>
             </button>
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
