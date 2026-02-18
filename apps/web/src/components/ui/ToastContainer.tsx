
'use client';

import { useToast } from '@/hooks/use-toast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@latexia/ui/lib/utils';
import { Button } from '@latexia/ui/components/ui/button';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-bottom-5 fade-in duration-300 min-w-[300px]",
            toast.type === 'success' && "bg-background border-green-200 text-green-800 dark:text-green-300",
            toast.type === 'error' && "bg-background border-red-200 text-red-800 dark:text-red-300",
            toast.type === 'info' && "bg-background border-border text-foreground"
          )}
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
          
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 -mr-2 hover:bg-black/5 dark:hover:bg-white/10" 
            onClick={() => removeToast(toast.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
