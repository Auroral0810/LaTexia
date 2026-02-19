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
