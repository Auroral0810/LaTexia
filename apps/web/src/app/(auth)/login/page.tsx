'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@latexia/ui/components/ui/tabs";
import { Input } from "@latexia/ui/components/ui/input";
import { Label } from "@latexia/ui/components/ui/label";
import { Button } from "@latexia/ui/components/ui/button";
import { AuthLogo } from "@latexia/ui/components/ui/auth-logo";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [code, setCode] = useState('');

  return (
    <div className="w-full flex h-screen">
      {/* 左侧品牌区 */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12 text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal-600 to-emerald-700"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        {/* 浮动代码片段 */}
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
          <AuthLogo lightMode />
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-6">用练习掌握 LaTeX<br/>而不是死记硬背</h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Latexia 是你的 LaTeX 在线练习场。从基础符号到复杂公式，
            通过系统化的题库训练，建立真正的肌肉记忆。
          </p>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} Latexia Inc.
        </div>
      </div>

      {/* 右侧表单区 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background relative">
        <div className="absolute top-6 left-6 lg:hidden">
          <AuthLogo />
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
              登录以继续你的 LaTeX 练习之旅
            </p>
          </div>

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">密码登录</TabsTrigger>
              <TabsTrigger value="code">验证码登录</TabsTrigger>
            </TabsList>
            
            <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <TabsContent value="password" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">账号</Label>
                  <Input 
                    id="identifier" 
                    placeholder="用户名 / 邮箱 / 手机号" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">密码</Label>
                    <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                      忘记密码？
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="phoneOrEmail">手机号 / 邮箱</Label>
                  <Input 
                    id="phoneOrEmail" 
                    placeholder="请输入手机号或邮箱" 
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">验证码</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="code" 
                      placeholder="6位数字验证码" 
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <Button type="button" variant="outline" className="w-32 shrink-0">
                      获取验证码
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <Button type="submit" className="w-full mt-2">
                登 录
              </Button>
            </form>
          </Tabs>

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
