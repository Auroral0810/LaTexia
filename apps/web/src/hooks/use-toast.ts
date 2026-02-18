
import { useState, useEffect, useCallback } from 'react';

// Simple event bus for toast
type ToastType = 'success' | 'error' | 'info';

interface ToastEvent {
  id: number;
  message: string;
  type: ToastType;
}

let listeners: ((toast: ToastEvent) => void)[] = [];
let toastId = 0;

function emitToast(message: string, type: ToastType = 'info') {
  const event: ToastEvent = { id: ++toastId, message, type };
  listeners.forEach(listener => listener(event));
}

export function toast(message: string, type: ToastType = 'info') {
  emitToast(message, type);
}

toast.success = (message: string) => emitToast(message, 'success');
toast.error = (message: string) => emitToast(message, 'error');

export function useToast() {
  const [toasts, setToasts] = useState<ToastEvent[]>([]);

  useEffect(() => {
    const handler = (event: ToastEvent) => {
      setToasts(prev => [...prev, event]);
      // Auto dismiss
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== event.id));
      }, 3000);
    };

    listeners.push(handler);
    return () => {
      listeners = listeners.filter(l => l !== handler);
    };
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, removeToast };
}
