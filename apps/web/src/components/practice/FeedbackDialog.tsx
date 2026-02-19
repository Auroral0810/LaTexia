'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@latexia/ui/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@latexia/ui/components/ui/select';
import { useAuthStore } from '@/store/auth.store';
import { MessageSquarePlus, Send, Loader2 } from 'lucide-react';

interface FeedbackDialogProps {
  problemId: string;
  problemTitle: string;
  trigger?: React.ReactNode;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function FeedbackDialog({ problemId, problemTitle, trigger }: FeedbackDialogProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState('content_error');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.id || '',
        },
        body: JSON.stringify({
          problemId,
          errorType,
          description
        })
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
          setDescription('');
          setErrorType('content_error');
        }, 1500);
      } else {
        // 尝试读取后端返回的错误信息
        try {
          const errData = await res.json();
          alert(errData.message || '提交失败，请稍后重试');
        } catch {
          alert('提交失败，请稍后重试');
        }
      }
    } catch (e) {
      alert('网络错误，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>反馈问题</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-primary" />
            题目问题反馈
          </DialogTitle>
        </DialogHeader>
        
        {success ? (
          <div className="py-8 flex flex-col items-center gap-3 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Send className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-emerald-600">提交成功</h3>
              <p className="text-sm text-muted-foreground">感谢您的反馈，我们会尽快处理！</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50 text-xs text-muted-foreground">
              正在反馈题目：<span className="font-medium text-foreground">{problemTitle}</span>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">问题类型</label>
              <Select value={errorType} onValueChange={setErrorType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content_error">题目内容错误</SelectItem>
                  <SelectItem value="answer_wrong">答案解析错误</SelectItem>
                  <SelectItem value="typo">错别字 / 排版问题</SelectItem>
                  <SelectItem value="other">其他建议</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">问题描述</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="请详细描述您遇到的问题，帮助我们改进..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={loading || !description.trim()}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  提交中...
                </>
              ) : (
                '提交反馈'
              )}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
