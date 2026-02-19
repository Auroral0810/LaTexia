'use client';

import React, { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Button } from '@latexia/ui/components/ui/button';
import { Input } from '@latexia/ui/components/ui/input';
import { Label } from '@latexia/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@latexia/ui/components/ui/select';
import { CheckCircle2, XCircle, SkipForward, Timer } from 'lucide-react';

// 模拟题目数据（后续接入数据库）
const MOCK_FORMULAS: { id: string; latex: string; difficulty: 'easy' | 'medium' | 'hard' }[] = [
  { id: '1', latex: 'E = mc^2', difficulty: 'easy' },
  { id: '2', latex: '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}', difficulty: 'easy' },
  { id: '3', latex: '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}', difficulty: 'medium' },
  { id: '4', latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}', difficulty: 'medium' },
  { id: '5', latex: '\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}', difficulty: 'hard' },
  { id: '6', latex: '\\alpha + \\beta = \\gamma', difficulty: 'easy' },
  { id: '7', latex: '\\binom{n}{k} = \\frac{n!}{k!(n-k)!}', difficulty: 'medium' },
  { id: '8', latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', difficulty: 'medium' },
  { id: '9', latex: 'x = \\frac{-b}{2a}', difficulty: 'easy' },
  { id: '10', latex: '\\vec{F} = m\\vec{a}', difficulty: 'easy' },
];

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

  const [pool, setPool] = useState<typeof MOCK_FORMULAS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [errorHint, setErrorHint] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const currentQuestion = pool[currentIndex];
  const totalQuestions = pool.length;
  const isLastQuestion = totalQuestions > 0 && currentIndex >= totalQuestions - 1;

  // 根据难度筛选并打乱题目
  const startSession = () => {
    let list = [...MOCK_FORMULAS];
    if (difficulty !== 'all') {
      list = list.filter((f) => f.difficulty === difficulty);
    }
    if (list.length === 0) list = [...MOCK_FORMULAS];
    const count = Math.min(questionCount, list.length);
    const shuffled = list.sort(() => Math.random() - 0.5).slice(0, count);
    setPool(shuffled);
    setCurrentIndex(0);
    setUserInput('');
    setResult(null);
    setErrorHint('');
    setRemainingSeconds(timeLimitEnabled ? timeLimitSeconds : null);
    setStarted(true);
  };

  // 倒计时
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;
    const t = setInterval(() => {
      setRemainingSeconds((s) => (s === null ? null : Math.max(0, s - 1)));
    }, 1000);
    return () => clearInterval(t);
  }, [remainingSeconds, currentIndex]);

  const handleSubmit = () => {
    if (!currentQuestion) return;
    const expected = normalizeLatex(currentQuestion.latex);
    const actual = normalizeLatex(userInput);
    if (expected === actual) {
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
  };

  const handleNext = () => {
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
  };

  const handleSkip = () => {
    setErrorHint(`正确答案：${currentQuestion?.latex ?? ''}`);
    setResult('wrong');
  };

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
          <Button onClick={startSession} className="w-full" size="lg">
            开始练习
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

          <div className="flex flex-wrap gap-2 pt-2">
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
        </div>
      </div>
    </div>
  );
}
