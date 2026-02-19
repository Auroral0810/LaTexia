'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { getProfile, updateProfile, changePassword } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from "@latexia/ui/components/ui/input";
import { Label } from "@latexia/ui/components/ui/label";
import { Button } from "@latexia/ui/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@latexia/ui/components/ui/tabs";
import { Textarea } from "@latexia/ui/components/ui/textarea";
import { User, Shield, Sliders, CheckCircle2, AlertCircle, Camera, Loader2 } from 'lucide-react';
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
        setUserData(res.data.user);
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-5xl py-12 px-4 md:px-6">
        <div className="space-y-1 mb-10">
          <h1 className="text-3xl font-bold tracking-tight">账号设置</h1>
          <p className="text-muted-foreground">管理您的个人资料、安全设置和偏好</p>
        </div>

        <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8">
          <TabsList className="flex md:flex-col h-auto bg-transparent p-0 gap-1 shrink-0 md:w-48 overflow-x-auto md:overflow-visible no-scrollbar">
            <TabsTrigger 
              value="profile" 
              className="justify-start gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-accent data-[state=active]:shadow-none transition-all"
            >
              <User className="w-4 h-4" />
              个人资料
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="justify-start gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-accent data-[state=active]:shadow-none transition-all"
            >
              <Shield className="w-4 h-4" />
              安全设置
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              className="justify-start gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-accent data-[state=active]:shadow-none transition-all"
            >
              <Sliders className="w-4 h-4" />
              偏好设置
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0">
            {/* 提示信息 */}
            {success && (
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-xl border border-green-500/20 mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </div>
            )}
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl border border-destructive/20 mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <TabsContent value="profile" className="mt-0 space-y-6">
              <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center p-6 rounded-2xl border bg-card/50">
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-primary/50 transition-colors">
                      <Image
                        src={profileData.avatarUrl || '/images/default.jpg'}
                        alt={user.username}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <button 
                      type="button"
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-not-allowed"
                      title="暂不支持上传"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">个人头像</h3>
                    <p className="text-sm text-muted-foreground">更改显示在个人中心的头像图片</p>
                    <p className="text-[10px] text-primary/60 font-medium bg-primary/10 px-2 py-0.5 rounded inline-block">后续版本将支持本地上传</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">用户名</Label>
                    <Input 
                      id="username" 
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      placeholder="您的用户名" 
                      className="max-w-md"
                    />
                    <p className="text-xs text-muted-foreground">这是您的唯一标识，出现在排行榜和个人主页上</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 opacity-60">
                      <Label>邮箱地址</Label>
                      <Input value={user.email || '未绑定'} disabled className="bg-muted/50" />
                      <p className="text-[10px] text-muted-foreground">当前仅支持单向注册绑定</p>
                    </div>
                    <div className="space-y-2 opacity-60">
                      <Label>手机号码</Label>
                      <Input value={user.phone || '未绑定'} disabled className="bg-muted/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">个人简介</Label>
                    <Textarea 
                      id="bio" 
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="介绍一下你自己..." 
                      className="min-h-[120px] max-w-2xl resize-none"
                    />
                    <p className="text-xs text-muted-foreground">字数控制在 200 字以内</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto px-12">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    保存修改
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-6">
              <form onSubmit={handleChangePassword} className="space-y-8 animate-in fade-in duration-500">
                <div className="p-6 rounded-2xl border bg-destructive/5 border-destructive/10">
                  <h3 className="font-semibold text-lg text-destructive mb-2">修改登录密码</h3>
                  <p className="text-sm text-muted-foreground">定期更换密码可以提高账户安全性。修改成功后，您在其他设备上的登录状态将被注销。</p>
                </div>

                <div className="grid gap-6 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">当前密码</Label>
                    <Input 
                      id="oldPassword" 
                      type="password"
                      value={securityData.oldPassword}
                      onChange={(e) => setSecurityData({...securityData, oldPassword: e.target.value})}
                      placeholder="请输入原密码" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">新密码</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      placeholder="至少 8 位包含字母和数字" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">确认新密码</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      placeholder="再次输入新密码" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" size="lg" variant="destructive" disabled={loading} className="w-full sm:w-auto px-12">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    更新密码
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="preferences" className="mt-0 space-y-6">
               <div className="p-6 rounded-2xl border bg-accent/30 space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">语言设置</h4>
                      <p className="text-sm text-muted-foreground">选择界面显示的语言</p>
                    </div>
                    <select className="bg-background border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 ring-primary">
                      <option>简体中文</option>
                      <option>English</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/50 pt-6">
                    <div>
                      <h4 className="font-medium">默认主题</h4>
                      <p className="text-sm text-muted-foreground">选择跟随系统或固定主题</p>
                    </div>
                    <div className="flex bg-muted p-1 rounded-lg gap-1">
                      <button className="px-3 py-1 text-xs font-medium rounded-md bg-white dark:bg-zinc-800 shadow-sm">系统</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-md">亮色</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-md">深色</button>
                    </div>
                  </div>
               </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
