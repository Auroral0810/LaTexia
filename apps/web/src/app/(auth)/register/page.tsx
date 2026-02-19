'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@latexia/ui/components/ui/tabs";
import { Input } from "@latexia/ui/components/ui/input";
import { Label } from "@latexia/ui/components/ui/label";
import { Button } from "@latexia/ui/components/ui/button";
import { GraphicCaptcha } from "@latexia/ui/components/ui/graphic-captcha";
import { AuthLogo } from "@latexia/ui/components/ui/auth-logo";
import { useAuthStore } from '@/store/auth.store';
import { register as registerApi, sendCode } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');

  // 图形验证码
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaTarget, setCaptchaTarget] = useState<'email' | 'phone'>('email');

  // 倒计时
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [phoneCountdown, setPhoneCountdown] = useState(0);

  // 通用状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCaptchaChange = useCallback((answer: string) => {
    setCaptchaAnswer(answer);
  }, []);

  // 开始倒计时
  const startCountdown = (target: 'email' | 'phone') => {
    const setter = target === 'email' ? setEmailCountdown : setPhoneCountdown;
    setter(60);
    const timer = setInterval(() => {
      setter((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // 发起获取验证码流程
  const handleRequestCode = (target: 'email' | 'phone') => {
    const value = target === 'email' ? email.trim() : phone.trim();
    if (!value) {
      setError(target === 'email' ? '请输入邮箱地址' : '请输入手机号码');
      return;
    }
    setError('');
    setCaptchaTarget(target);
    setCaptchaInput('');
    setShowCaptcha(true);
  };

  // 校验图形验证码后发送验证码
  const handleCaptchaSubmit = async () => {
    if (captchaInput.toLowerCase() !== captchaAnswer.toLowerCase()) {
      setError('图形验证码错误');
      return;
    }
    setShowCaptcha(false);
    setError('');
    setLoading(true);

    const target = captchaTarget === 'email' ? email.trim() : phone.trim();
    try {
      const res = await sendCode(target, 'register');
      if (res.success) {
        startCountdown(captchaTarget);
      } else {
        setError(res.message || '发送失败');
      }
    } catch {
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  // 注册提交
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 表单校验
    if (!username.trim()) { setError('请输入用户名'); return; }
    if (username.length < 2) { setError('用户名至少 2 个字符'); return; }
    if (!password) { setError('请输入密码'); return; }
    if (password.length < 8) { setError('密码至少 8 个字符'); return; }

    const target = registerMethod === 'email' ? email.trim() : phone.trim();
    const code = registerMethod === 'email' ? emailCode.trim() : phoneCode.trim();

    if (!target) { setError(registerMethod === 'email' ? '请输入邮箱' : '请输入手机号'); return; }
    if (!code) { setError('请输入验证码'); return; }

    setLoading(true);
    try {
      const res = await registerApi(username.trim(), target, code, password);
      if (res.success && res.data?.user && res.data.accessToken) {
        login(res.data.accessToken, {
          id: res.data.user.id,
          username: res.data.user.username,
          role: res.data.user.role as any,
          avatarUrl: res.data.user.avatarUrl,
        });
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        router.push('/');
      } else {
        setError(res.message || '注册失败');
      }
    } catch {
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex h-screen">
      {/* 左侧品牌区 */}
      <div className="hidden lg:flex w-1/2 bg-teal-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-bl from-teal-800 via-primary to-emerald-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}></div>
        
        {/* 装饰元素 */}
        <div className="absolute bottom-1/4 left-10 transform -translate-x-1/4 -rotate-12 w-64 h-64 bg-white/5 backdrop-blur-3xl rounded-full blur-2xl animate-breathe"></div>
        
        <div className="relative z-10">
          <AuthLogo lightMode />
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-6">让 LaTeX 学习<br/>像刷题一样简单</h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Latexia 不是编辑器，是练习场。通过系统化的题库训练，
            从基础符号到复杂公式，建立真正的 LaTeX 肌肉记忆。
          </p>
          <div className="mt-8 flex gap-4">
            <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>3000+ 符号题库</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>即时渲染反馈</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/60">
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
        
        <div className="w-full max-w-md space-y-6 animate-slide-up">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">创建账户</h1>
            <p className="mt-2 text-muted-foreground">
              开启你的 LaTeX 练习之旅
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          <Tabs defaultValue="email" onValueChange={(v) => setRegisterMethod(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">邮箱注册</TabsTrigger>
              <TabsTrigger value="phone">手机注册</TabsTrigger>
            </TabsList>

            <form className="mt-6 space-y-4" onSubmit={handleRegister}>
              {/* 用户名（公共） */}
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="latex_master"
                  disabled={loading}
                />
              </div>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailCode">邮箱验证码</Label>
                  <div className="flex gap-2">
                    <Input
                      id="emailCode"
                      placeholder="6位数字验证码"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      disabled={loading}
                      maxLength={6}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-32 shrink-0"
                      disabled={emailCountdown > 0 || loading}
                      onClick={() => handleRequestCode('email')}
                    >
                      {emailCountdown > 0 ? `${emailCountdown}s` : '获取验证码'}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号码</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="13800000000"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneCode">手机验证码</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phoneCode"
                      placeholder="6位数字验证码"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      disabled={loading}
                      maxLength={6}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-32 shrink-0"
                      disabled={phoneCountdown > 0 || loading}
                      onClick={() => handleRequestCode('phone')}
                    >
                      {phoneCountdown > 0 ? `${phoneCountdown}s` : '获取验证码'}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* 密码（公共） */}
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 8 个字符"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-none">
                  我同意{' '}
                  <Link href="/terms" className="text-primary hover:underline">用户协议</Link>
                  {' '}和{' '}
                  <Link href="/privacy" className="text-primary hover:underline">隐私政策</Link>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '注册中...' : '注 册'}
              </Button>
            </form>
          </Tabs>

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

          <p className="text-center text-sm text-muted-foreground">
            已经有账户？{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              登录
            </Link>
          </p>
        </div>
      </div>

      {/* 图形验证码弹窗 */}
      {showCaptcha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-background border rounded-xl p-6 w-full max-w-sm space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="text-center">
              <h3 className="text-lg font-semibold">安全验证</h3>
              <p className="text-sm text-muted-foreground mt-1">请输入下方图形验证码后发送{captchaTarget === 'email' ? '邮箱' : '手机'}验证码</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <GraphicCaptcha onCaptchaChange={handleCaptchaChange} width={140} height={44} />
              <span className="text-xs text-muted-foreground">点击图片刷新</span>
            </div>
            <Input
              placeholder="请输入图形验证码"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="text-center"
              autoFocus
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCaptcha(false)}>
                取消
              </Button>
              <Button className="flex-1" onClick={handleCaptchaSubmit} disabled={loading}>
                {loading ? '发送中...' : '确认发送'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
