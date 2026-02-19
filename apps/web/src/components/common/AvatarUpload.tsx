'use client';

import { useState, useRef } from 'react';
import { Button } from '@latexia/ui/components/ui/button';
import { Camera, Loader2, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { uploadAvatar } from '@/lib/auth';
import { useAuthStore } from '@/store/auth.store';
import { toast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userId: string;
  onSuccess?: (newUrl: string) => void;
}

export function AvatarUpload({ currentAvatar, userId, onSuccess }: AvatarUploadProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 校验文件类型和大小
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('图片大小不能超过 2MB');
      return;
    }

    // 创建本地预览
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setLoading(true);
    try {
      const res = await uploadAvatar(userId, file);
      if (res.success && res.data?.avatarUrl) {
        const newUrl = res.data.avatarUrl;
        // 只有服务端成功后，才通知父组件
        onSuccess?.(newUrl);
        toast.success('预览应用成功，请点击下方保存按钮');
      } else {
        toast.error(res.message || '上传失败');
        setPreviewUrl(null); // 失败则回退
      }
    } catch (err) {
      toast.error('网络错误，上传失败');
      setPreviewUrl(null);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="relative group">
      <div 
        onClick={() => !loading && fileInputRef.current?.click()}
        className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-xl bg-muted relative cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-300"
      >
        <Image
          src={previewUrl || currentAvatar || '/images/default.jpg'}
          alt="Avatar"
          fill
          className="object-cover"
        />

        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
           {!loading && <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />}
        </div>

        {loading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
        title="更换头像"
      >
        <Camera className="w-5 h-5" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}

