'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Button } from '@latexia/ui/components/ui/button';
import { Input } from '@latexia/ui/components/ui/input';
import { Label } from '@latexia/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@latexia/ui/components/ui/select';
import { CheckCircle2, XCircle, SkipForward, Timer, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FormulaExercise {
  id: number;
  title: string;
  latex: string;
  difficulty: string;
  category: string;
  hint?: string | null;
}

function normalizeLatex(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*\\\s*/g, '\\');
}

function findFirstDiffIndex(a: string, b: string): number {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) return i;
  }
  return a.length !== b.length ? len : -1;
}

function LatexPreview({ math }: { math: string }) {
  try {
    return (
      <span className="text-lg">
        <BlockMath math={math} />
      </span>
    );
  } catch {
    return <span className="text-sm text-destructive">LaTeX 语法错误，无法渲染</span>;
  }
}

export default function FormulaTrainPage() {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<string>('all');
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(60);
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const [pool, setPool] = useState<FormulaExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [errorHint, setErrorHint] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const currentQuestion = pool[currentIndex];
  const totalQuestions = pool.length;
  const isLastQuestion = totalQuestions > 0 && currentIndex >= totalQuestions - 1;

  const startSession = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const params = new URLSearchParams({ limit: String(questionCount) });
      if (difficulty !== 'all') params.set('difficulty', difficulty);
      const res = await fetch(`${API_URL}/api/formula-exercises/random?${params.toString()}`);
      const json = await res.json();
      if (!json.success || !json.data?.length) {
        setFetchError('暂无题目数据，请稍后再试');
        setLoading(false);
        return;
      }
      setPool(json.data);
      setCurrentIndex(0);
      setUserInput('');
      setResult(null);
      setErrorHint('');
      setRemainingSeconds(timeLimitEnabled ? timeLimitSeconds : null);
      setStarted(true);
    } catch {
      setFetchError('获取题目失败，请检查网络或稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 倒计时
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;
    const t = setInterval(() => {
      setRemainingSeconds((s) => (s === null ? null : Math.max(0, s - 1)));
    }, 1000);
    return () => clearInterval(t);
  }, [remainingSeconds, currentIndex]);

  const handleSubmit = useCallback(() => {
    if (!currentQuestion) return;
    const expected = normalizeLatex(currentQuestion.latex);
    const actual = normalizeLatex(userInput);
    const isCorrect = expected === actual;
    if (isCorrect) {
      setResult('correct');
      setErrorHint('');
    } else {
      setResult('wrong');
      const idx = findFirstDiffIndex(expected, actual);
      if (idx >= 0) {
        const seg = expected.slice(Math.max(0, idx - 5), idx + 15);
        setErrorHint(`从「…${seg}…」附近与标准答案不一致。正确答案：${expected}`);
      } else {
        setErrorHint(`正确答案：${expected}`);
      }
    }
    fetch(`${API_URL}/api/formula-exercises/${currentQuestion.id}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correct: isCorrect }),
    }).catch(() => {});
  }, [currentQuestion, userInput]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setUserInput('');
      setResult(null);
      setErrorHint('');
      setRemainingSeconds(timeLimitEnabled ? timeLimitSeconds : null);
    } else {
      setStarted(false);
      setPool([]);
    }
  }, [currentIndex, totalQuestions, timeLimitEnabled, timeLimitSeconds]);

  const handleSkip = useCallback(() => {
    setErrorHint(`正确答案：${currentQuestion?.latex ?? ''}`);
    setResult('wrong');
  }, [currentQuestion]);

  // 快捷键：⌘/Ctrl+Enter 提交，提交后 Enter 下一题，⌥/Alt+Enter 跳过
  useEffect(() => {
    if (!started || !currentQuestion) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      const submitMod = e.metaKey || e.ctrlKey;
      if (submitMod) {
        e.preventDefault();
        if (result === null) handleSubmit();
        return;
      }
      if (e.altKey) {
        e.preventDefault();
        if (result === null) handleSkip();
        return;
      }
      if (!e.altKey && result !== null) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [started, currentQuestion, result, handleSubmit, handleSkip, handleNext]);

  if (!started) {
    return (
      <div className="container py-8 max-w-2xl">
        <h1 className="text-2xl font-heading font-bold mb-2">公式训练</h1>
        <p className="text-muted-foreground mb-6">
          随机给出公式，请用 LaTeX 原样输入。无需登录即可练习。
        </p>
        <div className="space-y-6 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <Label>难度</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="easy">简单</SelectItem>
                <SelectItem value="medium">中等</SelectItem>
                <SelectItem value="hard">困难</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="timelimit"
                checked={timeLimitEnabled}
                onChange={(e) => setTimeLimitEnabled(e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="timelimit">每题限时</Label>
            </div>
            {timeLimitEnabled && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={10}
                  max={300}
                  value={timeLimitSeconds}
                  onChange={(e) => setTimeLimitSeconds(Number(e.target.value) || 60)}
                />
                <span className="text-sm text-muted-foreground">秒</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>题目数量</Label>
            <Select value={String(questionCount)} onValueChange={(v) => setQuestionCount(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} 题
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {fetchError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {fetchError}
            </div>
          )}
          <Button onClick={startSession} className="w-full" size="lg" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />加载中…</> : '开始练习'}
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">没有符合条件的题目，请调整难度或题目数量。</p>
        <Button onClick={() => setStarted(false)} className="mt-4">
          返回设置
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          第 {currentIndex + 1} / {totalQuestions} 题
          {currentQuestion.difficulty === 'easy' && ' · 简单'}
          {currentQuestion.difficulty === 'medium' && ' · 中等'}
          {currentQuestion.difficulty === 'hard' && ' · 困难'}
          {currentQuestion.title && ` · ${currentQuestion.title}`}
        </span>
        {remainingSeconds !== null && (
          <span className={`flex items-center gap-1 text-sm ${remainingSeconds <= 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
            <Timer className="w-4 h-4" />
            {remainingSeconds} 秒
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 bg-muted/30">
          <p className="text-sm text-muted-foreground mb-2">请用 LaTeX 原样输入下方公式：</p>
          <div className="min-h-[60px] flex items-center justify-center text-2xl">
            <BlockMath math={currentQuestion.latex} />
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>你的 LaTeX 输入</Label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="例如：E = mc^2"
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              disabled={result !== null}
            />
          </div>

          <div className="space-y-2">
            <Label>实时预览</Label>
            <div className="min-h-[56px] rounded-md border border-border/50 bg-muted/30 p-3 flex items-center justify-center">
              {userInput.trim() ? (
                <LatexPreview math={userInput.trim()} />
              ) : (
                <span className="text-muted-foreground text-sm">输入 LaTeX 后将在此显示预览</span>
              )}
            </div>
          </div>

          {result === 'correct' && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>回答正确！</span>
            </div>
          )}
          {result === 'wrong' && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
              <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="text-sm">{errorHint}</span>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <div className="flex flex-wrap gap-2">
              {result === null && (
                <>
                  <Button onClick={handleSubmit}>提交</Button>
                  <Button variant="outline" onClick={handleSkip}>
                    <SkipForward className="w-4 h-4 mr-1" />
                    跳过
                  </Button>
                </>
              )}
              {(result === 'correct' || result === 'wrong') && (
                <Button onClick={handleNext}>
                  {isLastQuestion ? '完成练习' : '下一题'}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 font-mono text-[10px]">⌘</kbd>/<kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 font-mono text-[10px]">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 font-mono text-[10px]">Enter</kbd> 提交
              {' · '}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 font-mono text-[10px]">Enter</kbd> 下一题
              {' · '}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 font-mono text-[10px]">⌥</kbd>/<kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 font-mono text-[10px]">Alt</kbd>+<kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 font-mono text-[10px]">Enter</kbd> 跳过
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
