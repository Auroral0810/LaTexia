'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { getProfile, updateProfile, changePassword } from '@/lib/auth';
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
} from "@latexia/ui";
import { User, Shield, Sliders, CheckCircle2, AlertCircle, Camera, Loader2, Link2, Github, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const { user, setUserData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // 个人资料状态
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    avatarUrl: '',
  });

  // 安全状态
  const [securityData, setSecurityData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user]);

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
        setSuccess('个人资料更新成功');
      } else {
        setError(res.message || '更新失败');
      }
    } catch {
      setError('网络错误，请稍后再试');
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
      const res = await changePassword(user.id, {
        oldPassword: securityData.oldPassword,
        newPassword: securityData.newPassword,
      });
      if (res.success) {
        setSuccess('密码修改成功');
        setSecurityData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(res.message || '修改失败');
      }
    } catch {
      setError('网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-5xl py-12 px-4 md:px-6">
        <div className="space-y-1 mb-10">
          <h1 className="text-3xl font-bold tracking-tight">账号设置</h1>
          <p className="text-muted-foreground font-medium">管理您的个人资料、安全设置和偏好</p>
        </div>

        <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-12">
          <TabsList className="flex md:flex-col h-auto bg-transparent p-0 gap-1 shrink-0 md:w-56 overflow-x-auto md:overflow-visible no-scrollbar">
            <TabsTrigger 
              value="profile" 
              className="justify-start gap-3 px-4 py-3.5 rounded-2xl data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all hover:bg-accent/50"
            >
              <User className="w-5 h-5 text-muted-foreground/80 group-data-[state=active]:text-primary" />
              个人资料
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="justify-start gap-3 px-4 py-3.5 rounded-2xl data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all hover:bg-accent/50"
            >
              <Shield className="w-5 h-5 text-muted-foreground/80" />
              安全设置
            </TabsTrigger>
            <TabsTrigger 
              value="binding" 
              className="justify-start gap-3 px-4 py-3.5 rounded-2xl data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all hover:bg-accent/50"
            >
              <Link2 className="w-5 h-5 text-muted-foreground/80" />
              账号绑定
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              className="justify-start gap-3 px-4 py-3.5 rounded-2xl data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all hover:bg-accent/50"
            >
              <Sliders className="w-5 h-5 text-muted-foreground/80" />
              偏好设置
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0">
            {/* 提示信息 */}
            {success && (
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-2xl border border-green-500/20 mb-8 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </div>
            )}
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-2xl border border-destructive/20 mb-8 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <TabsContent value="profile" className="mt-0 space-y-8">
              <form onSubmit={handleUpdateProfile} className="space-y-10 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center p-8 rounded-3xl border border-border/50 bg-card/30">
                  <div className="relative group shrink-0">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-background ring-2 ring-border group-hover:ring-primary/40 transition-all shadow-sm">
                      <Image
                        src={profileData.avatarUrl || '/images/default.jpg'}
                        alt={user.username}
                        width={112}
                        height={112}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <button 
                      type="button"
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-not-allowed"
                      title="暂不支持上传"
                    >
                      <Camera className="w-7 h-7 text-white" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl">个人头像</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">更改显示在个人中心的头像图片。目前支持 Gravatar，后续版本将支持本地上传。</p>
                    <p className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-1 rounded-lg inline-block uppercase tracking-wider">Coming Soon</p>
                  </div>
                </div>

                <div className="grid gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-base font-bold">用户名</Label>
                    <Input 
                      id="username" 
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      placeholder="您的用户名" 
                      className="max-w-md h-11 rounded-xl bg-background border-border/60 focus:border-primary/50 shadow-sm"
                    />
                    <p className="text-xs text-muted-foreground/80">这是您的唯一标识，出现在排行榜和个人主页上</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-base font-bold text-muted-foreground/60">邮箱地址</Label>
                      <Input value={user.email || '未绑定'} disabled className="h-11 rounded-xl bg-muted/30 border-dashed opacity-70" />
                      <p className="text-[11px] text-muted-foreground/60 italic">当前仅支持单向注册绑定</p>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-bold text-muted-foreground/60">手机号码</Label>
                      <Input value={user.phone || '未绑定'} disabled className="h-11 rounded-xl bg-muted/30 border-dashed opacity-70" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-base font-bold">个人简介</Label>
                    <Textarea 
                      id="bio" 
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="介绍一下你自己..." 
                      className="min-h-[140px] max-w-3xl resize-none rounded-2xl bg-background border-border/60 focus:border-primary/50 shadow-sm"
                    />
                    <p className="text-xs text-muted-foreground/80">简短地向大家展示你真实有趣的一面（200 字以内）</p>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto px-16 h-12 rounded-2xl font-bold bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 active:scale-95 transition-all">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    保存修改
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-8">
              <form onSubmit={handleChangePassword} className="space-y-10 animate-in fade-in duration-500">
                <div className="p-8 rounded-3xl border border-destructive/10 bg-destructive/5 space-y-2">
                  <h3 className="font-bold text-xl text-destructive flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    安全设置
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">定期更换密码可以提高账户安全性。修改成功后，您在其他设备上的登录状态将被注销。</p>
                </div>

                <div className="grid gap-6 max-w-md">
                  <div className="space-y-3">
                    <Label htmlFor="oldPassword font-bold">当前密码</Label>
                    <Input 
                      id="oldPassword" 
                      type="password"
                      value={securityData.oldPassword}
                      onChange={(e) => setSecurityData({...securityData, oldPassword: e.target.value})}
                      placeholder="请输入原密码" 
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="newPassword font-bold">新密码</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      placeholder="至少 8 位包含字母和数字" 
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword font-bold">确认新密码</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      placeholder="再次输入新密码" 
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button type="submit" size="lg" variant="destructive" disabled={loading} className="w-full sm:w-auto px-16 h-12 rounded-2xl font-bold shadow-md shadow-destructive/20 active:scale-95 transition-all">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    更新密码
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="binding" className="mt-0 space-y-6">
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="p-8 rounded-3xl border border-border/50 bg-card/30">
                  <h3 className="font-bold text-xl mb-6">第三方账号绑定</h3>
                  <p className="text-sm text-muted-foreground mb-8">绑定后您可以用对应平台的账号直接登录，管理更便捷。</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-background border border-border/40 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center dark:bg-zinc-800">
                          <Github className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-bold">GitHub</p>
                          <p className="text-xs text-muted-foreground">未绑定</p>
                        </div>
                      </div>
                      <Button variant="outline" className="rounded-xl px-6 h-10 font-bold border-primary/20 text-primary hover:bg-primary/5">
                        去绑定
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-2xl bg-background border border-border/40 hover:border-primary/30 transition-colors opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                          <MessageSquare className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold">微信</p>
                          <p className="text-xs text-muted-foreground">暂未开放</p>
                        </div>
                      </div>
                      <Button variant="ghost" disabled className="rounded-xl font-bold">
                        敬请期待
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="mt-0 space-y-6">
               <div className="p-8 rounded-3xl border border-border/50 bg-card/30 space-y-10 animate-in fade-in duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg">语言设置</h4>
                      <p className="text-sm text-muted-foreground">选择您希望在界面上看到的语言</p>
                    </div>
                    <div className="min-w-[180px]">
                      <Select defaultValue="zh-CN">
                        <SelectTrigger className="h-11 rounded-xl shadow-sm bg-background border-border/60">
                          <SelectValue placeholder="选择语言" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="zh-CN">简体中文</SelectItem>
                          <SelectItem value="en-US">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-border/40 pt-10 gap-6">
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg">默认主题</h4>
                      <p className="text-sm text-muted-foreground">选择符合您的界面配色风格</p>
                    </div>
                    <div className="flex bg-accent/20 p-1.5 rounded-2xl gap-1">
                      <button className="px-6 py-2 text-sm font-bold rounded-xl bg-background text-primary shadow-sm ring-1 ring-border/20 transition-all">系统</button>
                      <button className="px-6 py-2 text-sm font-bold rounded-xl text-muted-foreground hover:text-foreground transition-all">亮色</button>
                      <button className="px-6 py-2 text-sm font-bold rounded-xl text-muted-foreground hover:text-foreground transition-all">深色</button>
                    </div>
                  </div>
               </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
