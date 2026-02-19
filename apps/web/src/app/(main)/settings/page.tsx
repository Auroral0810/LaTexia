'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  sendBindCode, 
  bindEmail, 
  bindPhone 
} from '@/lib/auth';
import { 
  Input, 
  Label, 
  Button, 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger, 
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@latexia/ui";
import { GraphicCaptcha } from "@latexia/ui/components/ui/graphic-captcha";
import { AvatarUpload } from "@/components/common/AvatarUpload";

import { 
  User, 
  Shield, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Loader2, 
  Link2, 
  Github, 
  MessageSquare, 
  Globe, 
  Smartphone,
  ChevronRight,
  Mail,
  Zap,
  LogOut,
  Moon,
  Sun,
  Laptop,
  Apple
} from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { user, setUserData } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // 个人资料状态
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    avatarUrl: '',
    email: '',
    phone: '',
  });

  // 安全状态
  const [securityData, setSecurityData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 绑定弹窗状态
  const [isBindModalOpen, setIsBindModalOpen] = useState(false);
  const [bindType, setBindType] = useState<'email' | 'phone'>('email');
  const [bindValue, setBindValue] = useState('');
  const [bindCode, setBindCode] = useState('');
  const [bindCountdown, setBindCountdown] = useState(0);

  // 全局图形验证码状态 (用于敏感操作)
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');


  const handleCaptchaChange = useCallback((answer: string) => {
    setCaptchaAnswer(answer);
  }, []);


  // 初始加载真实数据
  useEffect(() => {
    const fetchRealData = async () => {
      if (!user?.id) return;
      setFetching(true);
      try {
        const res = await getProfile(user.id);
        if (res.success && res.data?.user) {
          setUserData(res.data.user as any);
          const u = res.data.user;
          setProfileData({
            username: u.username || '',
            bio: u.bio || '',
            avatarUrl: u.avatarUrl || '',
            email: u.email || '',
            phone: u.phone || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchRealData();
  }, [user?.id, setUserData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const res = await updateProfile(user.id, profileData);
      if (res.success && res.data?.user) {
        setUserData(res.data.user as any);
        setSuccess('个人资料已成功保存');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.message || '更新失败');
      }
    } catch {
      setError('网络连接异常');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (securityData.newPassword !== securityData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      } finally {
      setLoading(false);
    }
  };



  /** 真实的改密逻辑 */
  const submitRealPasswordChange = async () => {
    setLoading(true);
    try {
      const res = await changePassword(user!.id, {
        oldPassword: securityData.oldPassword,
        newPassword: securityData.newPassword,
      });
      if (res.success) {
        setSuccess('密码已成功重置');
        setSecurityData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(res.message || '修改失败');
      }
    } catch {
      setError('网络连接异常');
    } finally {
      setLoading(false);
    }
  };

  /** 真实的发送绑定验证码 */
  const submitSendBindCode = async () => {
    setLoading(true);
    try {
      const res = await sendBindCode(bindValue.trim());
      if (res.success) {
        setSuccess('验证码已发送');
        setBindCountdown(60);
        const timer = setInterval(() => {
          setBindCountdown(p => {
            if (p <= 1) { clearInterval(timer); return 0; }
            return p - 1;
          });
        }, 1000);
      } else {
        setError(res.message || '发送失败');
      }
    } catch {
      setError('网络连接异常');
    } finally {
      setLoading(false);
    }
  };

  /** 执行最后的绑定操作 */
  const handleFinalBind = async () => {
    if (!bindCode.trim()) {
      setError('请输入验证码');
      return;
    }
    setLoading(true);
    try {
      let res;
      if (bindType === 'email') {
        res = await bindEmail(user!.id, bindValue.trim(), bindCode);
      } else {
        res = await bindPhone(user!.id, bindValue.trim(), bindCode);
      }
      
      if (res.success) {
        setSuccess('绑定成功');
        setIsBindModalOpen(false);
        // 更新本地状态
        setProfileData(p => ({ ...p, [bindType]: bindValue.trim() }));
        setUserData({ ...user, [bindType === 'email' ? 'email' : 'phone']: bindValue.trim() } as any);
      } else {
        setError(res.message || '绑定失败');
      }
    } catch {
      setError('网络连接异常');
    } finally {
      setLoading(false);
    }
  };


  if (!user || fetching) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-primary">
        <Loader2 className="w-10 h-10 animate-spin opacity-60" />
        <p className="text-sm font-medium animate-pulse">正在同步云端数据...</p>
      </div>
    );
  }

  const oauthPlatforms = [
    { id: 'github', name: 'GitHub', iconSrc: '/images/GitHub.svg', color: 'bg-transparent', connected: !!user.githubId },
    { id: 'google', name: 'Google', iconSrc: '/images/google.svg', color: 'bg-transparent', connected: !!user.googleId },
    { id: 'apple', name: 'Apple', iconSrc: '/images/apple.svg', color: 'bg-transparent', connected: !!user.appleId },
    { id: 'qq', name: 'QQ', iconSrc: '/images/QQ.svg', color: 'bg-transparent', connected: !!user.qqId },
    { id: 'wechat', name: '微信', iconSrc: '/images/wechat.svg', color: 'bg-transparent', connected: !!user.wechatId },
  ];

  const menuItems = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'security', label: '账户安全', icon: Shield },
    { id: 'binding', label: '第三方绑定', icon: Link2 },
    { id: 'preferences', label: '界面偏好', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-500">
      <main className="container max-w-6xl py-12 px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-foreground">设置中心</h1>
            <p className="text-muted-foreground text-lg">定制您的专属体验与隐私偏好</p>
          </div>
          
          <div className="flex-shrink-0">
            {success && (
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold px-6 py-3 rounded-2xl border border-emerald-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 className="w-5 h-5" />
                {success}
              </div>
            )}
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-bold px-6 py-3 rounded-2xl border border-destructive/20 flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
          {/* Sidebar Navigation */}
          <TabsList className="flex flex-col items-stretch h-auto bg-transparent p-0 gap-2 shrink-0 md:self-start">
            {menuItems.map((item) => (
              <TabsTrigger 
                key={item.id}
                value={item.id} 
                className="group relative flex items-center justify-between px-6 py-4 rounded-2xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:data-[state=active]:shadow-none data-[state=active]:text-primary border border-transparent data-[state=active]:border-border/50 transition-all duration-300 hover:bg-white/60 dark:hover:bg-zinc-900/40"
              >
                <div className="flex items-center gap-4">
                  <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  <span className="font-bold text-[15px]">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight className="w-4 h-4 opacity-50" />}
              </TabsTrigger>
            ))}
            
            <div className="mt-8 pt-6 border-t border-border/40 px-6">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">版本信息</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Zap className="w-4 h-4 text-amber-500" />
                Latexia Pro v1.0.4
              </div>
            </div>
          </TabsList>

          {/* Content Area */}
          <div className="min-w-0">
            {/* 个人资料 */}
            <TabsContent value="profile" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="p-8 md:p-10 rounded-[32px] border-none shadow-[0_8px_40px_rgba(0,0,0,0.03)] dark:bg-zinc-900/50 backdrop-blur-sm">
                <form onSubmit={handleUpdateProfile} className="space-y-12">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row gap-10 items-center">
                    <AvatarUpload 
                      currentAvatar={profileData.avatarUrl} 
                      userId={user.id} 
                      onSuccess={(url) => setProfileData(p => ({ ...p, avatarUrl: url }))}
                    />
                    <div className="text-center sm:text-left space-y-3">
                      <h3 className="text-2xl font-black">自定义头像</h3>
                      <p className="text-muted-foreground leading-relaxed max-w-md">上传一张能代表您的独特头像。支持 JPG、PNG 格式，建议尺寸 512x512px。</p>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-tighter">PREMIUM</span>
                        <span className="text-[10px] font-bold text-muted-foreground/60 italic">当前由 Aliyun OSS 提供服务</span>
                      </div>
                    </div>
                  </div>


                  {/* Form Grid */}
                  <div className="grid gap-10">
                    <div className="space-y-4">
                      <Label htmlFor="username" className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">开发者昵称</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input 
                          id="username" 
                          value={profileData.username}
                          onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                          placeholder="起一个响亮的名字" 
                          className="pl-12 h-14 rounded-2xl bg-white dark:bg-zinc-800 border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">密保邮箱</Label>
                        <div className="flex gap-4">
                          <div className="relative flex-1">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                            <Input value={profileData.email || '尚未绑定'} disabled className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border-none opacity-60 font-medium italic" />
                          </div>
                          <Button 
                            type="button" 
                            variant="secondary" 
                            className="h-14 px-6 rounded-2xl font-bold transition-all hover:bg-primary hover:text-white"
                            onClick={() => { setBindType('email'); setBindValue(profileData.email); setIsBindModalOpen(true); }}
                          >
                            {profileData.email ? '更换' : '绑定'}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">联系电话</Label>
                        <div className="flex gap-4">
                          <div className="relative flex-1">
                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                            <Input value={profileData.phone || '尚未绑定'} disabled className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border-none opacity-60 font-medium italic" />
                          </div>
                          <Button 
                            type="button" 
                            variant="secondary" 
                            className="h-14 px-6 rounded-2xl font-bold transition-all hover:bg-primary hover:text-white"
                            onClick={() => { setBindType('phone'); setBindValue(profileData.phone); setIsBindModalOpen(true); }}
                          >
                            {profileData.phone ? '更换' : '绑定'}
                          </Button>
                        </div>
                      </div>
                    </div>


                    <div className="space-y-4">
                      <Label htmlFor="bio" className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">个人简介</Label>
                      <Textarea 
                        id="bio" 
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="在此分享您的技术格言或个人介绍..." 
                        className="min-h-[160px] rounded-3xl bg-white dark:bg-zinc-800 border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none focus:ring-2 focus:ring-primary/20 resize-none p-6 text-base font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto min-w-[200px] h-14 rounded-2xl font-black text-lg bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-900/10 dark:shadow-none">
                      {loading && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
                      保存更新
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            {/* 安全设置 */}
            <TabsContent value="security" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="p-8 md:p-10 rounded-[32px] border-none shadow-[0_8px_40px_rgba(0,0,0,0.03)] dark:bg-zinc-900/50">
                <div className="mb-12 p-8 rounded-3xl bg-red-500/5 border border-red-500/10 flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-red-500 mb-2">更改登录密码</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">如果您怀疑账户存在安全风险，请立即修改密码。密码需包含至少 8 位字符，且建议包含字母、数字和特殊符号。</p>
                  </div>
                </div>

                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    if (!securityData.oldPassword || !securityData.newPassword) {
                      setError('请填写密码');
                      return;
                    }
                    if (securityData.newPassword !== securityData.confirmPassword) {
                      setError('两次输入的密码不一致');
                      return;
                    }
                    if (captchaInput.toLowerCase() !== captchaAnswer.toLowerCase()) {
                      setError('图形验证码错误');
                      return;
                    }
                    submitRealPasswordChange();
                  }} 
                  className="space-y-10 max-w-xl"
                >

                  <div className="space-y-4">
                    <Label className="font-bold ml-1">当前访问密码</Label>
                    <Input 
                      type="password"
                      value={securityData.oldPassword}
                      onChange={(e) => setSecurityData({...securityData, oldPassword: e.target.value})}
                      placeholder="验证当前身份" 
                      className="h-14 rounded-2xl bg-white dark:bg-zinc-800 border-none shadow-sm font-medium"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="font-bold ml-1">新密码</Label>
                    <Input 
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      placeholder="设置高强度新密码" 
                      className="h-14 rounded-2xl bg-white dark:bg-zinc-800 border-none shadow-sm font-medium"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="font-bold ml-1">确认新密码</Label>
                    <Input 
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      placeholder="重复输入以确认" 
                      className="h-14 rounded-2xl bg-white dark:bg-zinc-800 border-none shadow-sm font-medium"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/40">
                    <Label className="font-black text-sm uppercase tracking-widest text-muted-foreground/70">安全验证</Label>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/40">
                      <GraphicCaptcha onCaptchaChange={handleCaptchaChange} length={4} width={140} height={40} className="shrink-0" />
                      <div className="flex-1 w-full space-y-2">
                        <Input
                          placeholder="输入上方验证码"
                          value={captchaInput}
                          autoComplete="off"
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          className="h-12 rounded-xl bg-white dark:bg-zinc-800 border-none shadow-sm text-center font-bold tracking-[0.3em]"
                        />
                        <p className="text-[10px] text-center text-muted-foreground font-medium italic">点击图片可刷新验证码</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">

                    <Button type="submit" size="lg" variant="destructive" disabled={loading} className="w-full sm:w-auto px-12 h-14 rounded-2xl font-black text-lg transition-transform hover:scale-[1.02]">
                      重置账户密码
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            {/* 账号绑定 */}
            <TabsContent value="binding" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <Card className="p-8 md:p-10 rounded-[32px] border-none shadow-[0_8px_40px_rgba(0,0,0,0.03)] dark:bg-zinc-900/50">
                <div className="flex justify-between items-center mb-10">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black">第三方账号联通</h3>
                    <p className="text-muted-foreground font-medium">绑定第三方应用以便实现快速登录和社交同步</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {oauthPlatforms.map((platform) => (
                    <div 
                      key={platform.id}
                      className="flex items-center justify-between p-6 rounded-[28px] bg-white dark:bg-zinc-800 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-none group border border-transparent hover:border-border/50"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl ${platform.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-500 overflow-hidden p-2`}>
                          <Image
                            src={platform.iconSrc}
                            alt={platform.name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-lg font-black">{platform.name}</p>
                          <div className="flex items-center gap-2">
                             {platform.connected ? (
                               <>
                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                 <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">已成功连接</span>
                               </>
                             ) : (
                               <span className="text-xs font-bold text-muted-foreground/60">尚未授权绑定</span>
                             )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={platform.connected ? "outline" : "secondary"}
                        className={`rounded-xl px-8 h-12 font-black transition-all ${platform.connected ? 'border-border/60 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20' : 'bg-zinc-100 dark:bg-zinc-700 hover:bg-primary hover:text-white'}`}
                      >
                        {platform.connected ? '解除绑定' : '立即开始'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* 偏好设置 */}
            <TabsContent value="preferences" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="p-8 md:p-10 rounded-[32px] border-none shadow-[0_8px_40px_rgba(0,0,0,0.03)] dark:bg-zinc-900/50 divide-y divide-border/40">
                <div className="pb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                  <div className="space-y-2">
                    <h4 className="text-xl font-black">显示语言</h4>
                    <p className="text-sm text-muted-foreground font-medium">配置 Latexia 平台在全球范围内展示的语言文字</p>
                  </div>
                  <div className="min-w-[200px]">
                    <Select defaultValue={user.locale || "zh-CN"}>
                      <SelectTrigger className="h-14 rounded-2xl border-none shadow-sm bg-zinc-100 dark:bg-zinc-800 font-bold px-6">
                        <SelectValue placeholder="全局语言" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                        <SelectItem value="zh-CN" className="font-bold py-3">简体中文 (Mainland)</SelectItem>
                        <SelectItem value="zh-TW" className="font-bold py-3">繁體中文 (HK/TW)</SelectItem>
                        <SelectItem value="en-US" className="font-bold py-3">English (US)</SelectItem>
                        <SelectItem value="ja-JP" className="font-bold py-3">日本語 (Japan)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                  <div className="space-y-2">
                    <h4 className="text-xl font-black">外观风格</h4>
                    <p className="text-sm text-muted-foreground font-medium">动态调整系统的视觉明亮程度与沉浸感</p>
                  </div>
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 p-2 rounded-[24px] gap-2 border border-border/10">
                    {[
                      { id: 'system', label: '跟随系统', icon: Laptop },
                      { id: 'light', label: '极致亮色', icon: Sun },
                      { id: 'dark', label: '纯粹深色', icon: Moon },
                    ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setTheme(item.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-black rounded-2xl transition-all duration-300 ${theme === item.id ? 'bg-white dark:bg-zinc-700 text-primary shadow-xl shadow-black/5' : 'text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-zinc-700/40'}`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="flex justify-center pt-6 opacity-30 hover:opacity-100 transition-opacity">
                <Button variant="ghost" className="text-muted-foreground font-bold flex items-center gap-2">
                   <LogOut className="w-4 h-4" />
                   注销此设备上的所有同步记录
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* 绑定/更换 弹窗 */}
      <Dialog open={isBindModalOpen} onOpenChange={setIsBindModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[32px] p-8 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {profileData[bindType] ? '更换' : '绑定'}{bindType === 'email' ? '邮箱' : '手机号'}
            </DialogTitle>
            <DialogDescription className="font-medium pt-2">
              完成后，您可以使用该{bindType === 'email' ? '邮箱' : '手机号'}进行登录及找回密码。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="font-bold">{bindType === 'email' ? '新邮箱地址' : '新手机号码'}</Label>
              <Input 
                placeholder={`请输入有效的${bindType === 'email' ? '邮箱' : '手机号'}`} 
                value={bindValue}
                onChange={(e) => setBindValue(e.target.value)}
                className="h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none font-medium"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-border/10">
              <Label className="font-bold text-sm text-muted-foreground">安全验证</Label>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                <GraphicCaptcha onCaptchaChange={handleCaptchaChange} length={4} width={120} height={40} className="shrink-0" />
                <Input
                  placeholder="输入验证码"
                  value={captchaInput}
                  autoComplete="off"
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="h-12 rounded-xl bg-white dark:bg-zinc-800 border-none shadow-sm text-center font-bold tracking-[0.2em]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-bold">验证码</Label>
              <div className="flex gap-3">
                <Input 
                  placeholder="6位数字" 
                  value={bindCode}
                  onChange={(e) => setBindCode(e.target.value)}
                  className="h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none font-medium"
                  maxLength={6}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={bindCountdown > 0 || loading}
                  className="h-14 px-6 rounded-2xl font-bold shrink-0"
                  onClick={() => {
                    if (captchaInput.toLowerCase() !== captchaAnswer.toLowerCase()) {
                      setError('图形验证码错误');
                      return;
                    }
                    submitSendBindCode();
                  }}
                >

                  {bindCountdown > 0 ? `${bindCountdown}s` : '获取验证码'}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start gap-4">
              <Button 
                type="button" 
                className="flex-1 h-14 rounded-2xl font-black text-[16px]"
                onClick={() => {
                  if (captchaInput.toLowerCase() !== captchaAnswer.toLowerCase()) {
                    setError('图形验证码错误');
                    return;
                  }
                  handleFinalBind();
                }}
                disabled={loading}
              >

              {loading && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
              确认提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


