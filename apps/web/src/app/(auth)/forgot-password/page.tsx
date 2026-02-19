'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { Input } from "@latexia/ui/components/ui/input";
import { Label } from "@latexia/ui/components/ui/label";
import { Button } from "@latexia/ui/components/ui/button";
import { GraphicCaptcha } from "@latexia/ui/components/ui/graphic-captcha";
import { AuthLogo } from "@latexia/ui/components/ui/auth-logo";
import { CheckCircle2 } from 'lucide-react';
import { forgotPassword, resetPassword } from '@/lib/auth';

type Step = 'input' | 'verify' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('input');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 图形验证码
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 通用状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCaptchaChange = useCallback((answer: string) => {
    setCaptchaAnswer(answer);
  }, []);

  // 开始倒计时
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // 先弹出图形验证码
  const handleSendCode = () => {
    if (!identifier.trim()) {
      setError('请输入手机号或邮箱');
      return;
    }
    setError('');
    setCaptchaInput('');
    setShowCaptcha(true);
  };

  // 校验图形验证码后发送重置验证码
  const handleCaptchaSubmit = async () => {
    if (captchaInput.toLowerCase() !== captchaAnswer.toLowerCase()) {
      setError('图形验证码错误');
      return;
    }
    setShowCaptcha(false);
    setError('');
    setLoading(true);

    try {
      const res = await forgotPassword(identifier.trim());
      if (res.success) {
        setStep('verify');
        startCountdown();
      } else {
        setError(res.message || '发送失败');
      }
    } catch {
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  // 验证码校验 → 进入重置步骤
  const handleVerifyCode = () => {
    if (!code.trim() || code.length !== 6) {
      setError('请输入 6 位验证码');
      return;
    }
    setError('');
    setStep('reset');
  };

  // 重置密码
  const handleResetPassword = async () => {
    if (!password || password.length < 8) {
      setError('密码长度不能少于 8 位');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await resetPassword(identifier.trim(), code.trim(), password);
      if (res.success) {
        setStep('success');
      } else {
        setError(res.message || '重置失败');
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
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12 text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-primary to-teal-600"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        {/* 装饰元素 */}
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-white/5 backdrop-blur-3xl rounded-full blur-3xl animate-breathe"></div>
        <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

        {/* 锁定图标装饰 */}
        <div className="absolute top-1/4 right-16 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 animate-float">
          <svg className="w-16 h-16 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <AuthLogo lightMode />
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-6">安全找回<br/>你的密码</h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            别担心，忘记密码是常有的事。只需简单几步验证，
            你就能重新设置密码并回到 LaTeX 练习中来。
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

        <Link href="/login" className="absolute top-8 right-8 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回登录
        </Link>
        
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* 步骤指示器 */}
          {step !== 'success' && (
            <div className="flex items-center justify-center gap-2">
              {['input', 'verify', 'reset'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step === s ? 'bg-primary text-primary-foreground' :
                    ['input', 'verify', 'reset'].indexOf(step) > i ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  {i < 2 && (
                    <div className={`w-12 h-0.5 ${
                      ['input', 'verify', 'reset'].indexOf(step) > i ? 'bg-primary/40' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">找回密码</h1>
            <p className="mt-2 text-muted-foreground">
              {step === 'input' && "请输入您的注册邮箱或手机号"}
              {step === 'verify' && `验证码已发送至 ${identifier}`}
              {step === 'reset' && "请设置您的新密码"}
              {step === 'success' && "密码重置成功"}
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {step === 'input' && (
              <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">手机号 / 邮箱</Label>
                  <Input
                    id="identifier"
                    placeholder="请输入手机号或邮箱"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoFocus
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '发送中...' : '发送验证码'}
                </Button>
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">验证码</Label>
                  <Input
                    id="code"
                    placeholder="6位数字验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                    autoFocus
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  验证
                </Button>
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={handleSendCode}
                    disabled={countdown > 0 || loading}
                    className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                  >
                    {countdown > 0 ? `${countdown}s 后重新发送` : '重新发送验证码'}
                  </button>
                </div>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">新密码</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="至少 8 个字符"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">确认新密码</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="再次输入新密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '重置中...' : '重置密码'}
                </Button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center space-y-6 py-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-in zoom-in">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-muted-foreground">
                  您的密码已成功重置，现在可以使用新密码登录了。
                </p>
                <Button asChild className="w-full">
                  <Link href="/login">立即登录</Link>
                </Button>
              </div>
            )}
          </div>

          {step !== 'success' && (
            <p className="text-center text-sm text-muted-foreground">
              想起密码了？{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                返回登录
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* 图形验证码弹窗 */}
      {showCaptcha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-background border rounded-xl p-6 w-full max-w-sm space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="text-center">
              <h3 className="text-lg font-semibold">安全验证</h3>
              <p className="text-sm text-muted-foreground mt-1">请输入下方图形验证码以发送验证码</p>
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
