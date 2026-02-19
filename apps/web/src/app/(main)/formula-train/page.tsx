'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Button } from '@latexia/ui/components/ui/button';
import { Input } from '@latexia/ui/components/ui/input';
import { Label } from '@latexia/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@latexia/ui/components/ui/select';
import { CheckCircle2, XCircle, SkipForward, Timer, Loader2, Trophy, ArrowRight, Keyboard, Info } from 'lucide-react';

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
  // 更加激进的归一化：移除所有空白字符，因为 LaTeX 数学模式中大部分空格均不影响语义
  // 这样可以处理 \log_a b 与 \log_ab 的差异
  return s.replace(/\s+/g, '').trim();
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
      <div className="text-xl py-4 transition-all duration-300">
        <BlockMath math={math} />
      </div>
    );
  } catch {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-destructive font-medium">
        <Info className="w-4 h-4" />
        <span>LaTeX 语法错误，无法渲染</span>
      </div>
    );
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
  
  // 答题统计
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isConfirmingStop, setIsConfirmingStop] = useState(false);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [difficultyStats, setDifficultyStats] = useState({ easy: 0, medium: 0, hard: 0 });

  const currentQuestion = pool[currentIndex];
  const totalQuestions = pool.length;
  const isLastQuestion = totalQuestions > 0 && currentIndex >= totalQuestions - 1;

  // 用于无限模式的加载状态
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const startSession = async (randomMode = false) => {
    setLoading(true);
    setFetchError('');
    setIsRandomMode(randomMode);
    try {
      // 随机模式默认一次拉取 50 道，后续自动补充
      const limit = randomMode ? '50' : String(questionCount);
      const params = new URLSearchParams({ limit });
      
      if (!randomMode && difficulty !== 'all') params.set('difficulty', difficulty);
      
      const res = await fetch(`${API_URL}/api/formula-exercises/random?${params.toString()}`);
      const json = await res.json();
      if (!json.success || !json.data?.length) {
        setFetchError('暂无题目数据，请稍后再试');
        setLoading(false);
        return;
      }

      let questions = json.data;
      if (randomMode) {
        questions = [...questions].sort(() => Math.random() - 0.5);
      }

      setPool(questions);
      setCurrentIndex(0);
      setUserInput('');
      setResult(null);
      setErrorHint('');
      setScore(0);
      setShowSummary(false);
      setIsConfirmingStop(false);
      setSessionStartTime(Date.now());
      setDifficultyStats({ easy: 0, medium: 0, hard: 0 });
      setRemainingSeconds(randomMode ? null : (timeLimitEnabled ? timeLimitSeconds : null));
      setStarted(true);
    } catch {
      setFetchError('获取题目失败，请检查网络或稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreQuestions = async () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const res = await fetch(`${API_URL}/api/formula-exercises/random?limit=20`);
      const json = await res.json();
      if (json.success && json.data?.length) {
        const newQuestions = [...json.data].sort(() => Math.random() - 0.5);
        setPool(prev => [...prev, ...newQuestions]);
      }
    } catch (e) {
      console.error('Failed to fetch more questions', e);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0 || result !== null || isConfirmingStop) return;
    const t = setInterval(() => {
      setRemainingSeconds((s) => {
        if (s === 1) {
          handleSkip(); // 倒计时结束自动跳过
          return 0;
        }
        return s === null ? null : Math.max(0, s - 1);
      });
    }, 1000);
    return () => clearInterval(t);
  }, [remainingSeconds, currentIndex, result, isConfirmingStop]);

  const handleSubmit = useCallback(() => {
    if (!currentQuestion || result !== null) return;
    const expected = normalizeLatex(currentQuestion.latex);
    const actual = normalizeLatex(userInput);
    const isCorrect = expected === actual;
    
    // 更新难度统计
    const diff = currentQuestion.difficulty as 'easy' | 'medium' | 'hard';
    if (isCorrect) {
      setDifficultyStats(prev => ({ ...prev, [diff]: prev[diff] + 1 }));
    }

    if (isCorrect) {
      setResult('correct');
      setScore(s => s + 1);
      setErrorHint('');
    } else {
       setResult('wrong');
       const idx = findFirstDiffIndex(expected, actual);
       if (idx >= 0) {
         // 注意：错误提示时展示带空格的原始 latex 比较友好
         const rawExpected = currentQuestion.latex;
         const seg = rawExpected.slice(Math.max(0, idx - 8), idx + 20);
         setErrorHint(`从「…${seg}…」附近不匹配。正确：${rawExpected}`);
       } else {
         setErrorHint(`正确答案：${currentQuestion.latex}`);
       }
    }

    fetch(`${API_URL}/api/formula-exercises/${currentQuestion.id}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correct: isCorrect }),
    }).catch(() => {});
  }, [currentQuestion, userInput, result]);

  const handleNext = useCallback(() => {
    // 随机模式下：如果剩余题目不足 5 道，提前拉取下一批
    if (isRandomMode && totalQuestions - currentIndex <= 5) {
      fetchMoreQuestions();
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setUserInput('');
      setResult(null);
      setErrorHint('');
      setRemainingSeconds(isRandomMode ? null : (timeLimitEnabled ? timeLimitSeconds : null));
    } else if (!isRandomMode) {
      // 非随机模式才会在最后一题结束
      stopSession();
    }
  }, [currentIndex, totalQuestions, timeLimitEnabled, timeLimitSeconds, isRandomMode]);

  const handleSkip = useCallback(() => {
    if (result !== null) return;
    setErrorHint(`正确答案：${currentQuestion?.latex ?? ''}`);
    setResult('wrong');
  }, [currentQuestion, result]);

  const stopSession = () => {
    if (sessionStartTime) {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
    }
    setShowSummary(true);
    setIsConfirmingStop(false);
  };

  // 快捷键支持
  useEffect(() => {
    if (!started || !currentQuestion || showSummary || isConfirmingStop) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          if (result === null) handleSubmit();
        } else if (result !== null) {
          e.preventDefault();
          handleNext();
        }
      } else if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (result === null) handleSkip();
      } else if (e.key === 'Escape') {
        setIsConfirmingStop(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [started, currentQuestion, result, handleSubmit, handleSkip, handleNext, showSummary, isConfirmingStop]);

  // 渲染设置页面
  if (!started) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-background to-muted/20 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-heading font-bold tracking-tight">公式极限训练</h1>
            <p className="text-muted-foreground text-lg">
              挑战你的 LaTeX 输入速度与准确度，即时反馈，高效进阶。
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -tr-4 -mt-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="grid gap-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">训练难度</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-background/50 border-border/50 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部难度</SelectItem>
                      <SelectItem value="easy">简单 (基础符号)</SelectItem>
                      <SelectItem value="medium">中等 (复杂公式)</SelectItem>
                      <SelectItem value="hard">困难 (多层嵌套)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">题目数量</Label>
                  <Select value={String(questionCount)} onValueChange={(v) => setQuestionCount(Number(v))}>
                    <SelectTrigger className="bg-background/50 border-border/50 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 50].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} 道题目</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="timelimit" className="text-sm font-bold">每题限时挑战</Label>
                    <p className="text-xs text-muted-foreground">开启后未在规定时间内提交将视为错误</p>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${timeLimitEnabled ? 'bg-primary' : 'bg-input'}`} onClick={() => setTimeLimitEnabled(!timeLimitEnabled)}>
                    <span className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${timeLimitEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
                
                {timeLimitEnabled && (
                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input
                      type="range"
                      min={10}
                      max={180}
                      step={10}
                      value={timeLimitSeconds}
                      onChange={(e) => setTimeLimitSeconds(Number(e.target.value))}
                      className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-sm font-mono font-bold text-primary w-12 text-center">{timeLimitSeconds}s</span>
                  </div>
                )}
              </div>

              {fetchError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 flex items-center gap-3 text-sm text-destructive animate-pulse">
                  <XCircle className="w-5 h-5 shrink-0" />
                  {fetchError}
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={() => startSession(false)} className="flex-1 h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={loading}>
                  {loading && !isRandomMode ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />正在生成...</> : <><Trophy className="w-5 h-5 mr-2" />限时挑战</>}
                </Button>
                <Button variant="outline" onClick={() => startSession(true)} className="flex-1 h-12 rounded-2xl text-base font-bold border-primary/20 text-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={loading}>
                  {loading && isRandomMode ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />正在生成...</> : <><SkipForward className="w-5 h-5 mr-2" />随机练习</>}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-8 text-muted-foreground/60">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Keyboard className="w-4 h-4" />
              <span>快捷键提交</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Timer className="w-4 h-4" />
              <span>精确定时</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>语法校验</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 训练结算页面
  if (showSummary) {
    const accuracy = Math.round((score / totalQuestions) * 100);
    const formatDuration = (s: number) => {
      const m = Math.floor(s / 60);
      const rs = s % 60;
      return m > 0 ? `${m}分${rs}秒` : `${rs}秒`;
    };

    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-background overflow-y-auto">
        <div className="w-full max-w-2xl space-y-8 animate-in zoom-in-95 duration-500 py-12">
           <div className="text-center space-y-4">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-2 border-4 border-background shadow-xl">
                 <Trophy className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold">{isRandomMode ? '随机练习停止' : '限时挑战完成！'}</h1>
              <p className="text-muted-foreground">已完成 {currentIndex + (result !== null ? 1 : 0)} 道题目 {isRandomMode && '(随机无限模式)'}</p>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-2xl border border-border/50 text-center space-y-1 shadow-sm">
                 <span className="text-xs text-muted-foreground font-medium">正确数量</span>
                 <p className="text-2xl font-bold text-primary">{score}</p>
              </div>
              <div className="bg-card p-4 rounded-2xl border border-border/50 text-center space-y-1 shadow-sm">
                 <span className="text-xs text-muted-foreground font-medium">准确率</span>
                 <p className={`text-2xl font-bold ${accuracy >= 80 ? 'text-green-500' : accuracy >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{accuracy || 0}%</p>
              </div>
              <div className="bg-card p-4 rounded-2xl border border-border/50 text-center space-y-1 shadow-sm">
                 <span className="text-xs text-muted-foreground font-medium">练习时长</span>
                 <p className="text-2xl font-bold">{formatDuration(sessionDuration)}</p>
              </div>
              {/* 随机模式下不展示“题目总数”，因为是无限的 */}
              {!isRandomMode && (
                <div className="bg-card p-4 rounded-2xl border border-border/50 text-center space-y-1 shadow-sm">
                   <span className="text-xs text-muted-foreground font-medium">题目总数</span>
                   <p className="text-2xl font-bold">{totalQuestions}</p>
                </div>
              )}
           </div>

           {/* 难度分布统计 */}
           <div className="bg-card/50 backdrop-blur-sm p-6 rounded-3xl border border-border/50 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground text-center">难度正确分布</h3>
              <div className="grid grid-cols-3 gap-8">
                 <div className="space-y-2 text-center">
                    <div className="text-xs font-bold text-green-500 uppercase">简单</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(difficultyStats.easy / Math.max(1, score)) * 100}%` }} />
                    </div>
                    <div className="text-lg font-mono font-bold">{difficultyStats.easy}</div>
                 </div>
                 <div className="space-y-2 text-center">
                    <div className="text-xs font-bold text-yellow-500 uppercase">中等</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: `${(difficultyStats.medium / Math.max(1, score)) * 100}%` }} />
                    </div>
                    <div className="text-lg font-mono font-bold">{difficultyStats.medium}</div>
                 </div>
                 <div className="space-y-2 text-center">
                    <div className="text-xs font-bold text-red-500 uppercase">困难</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${(difficultyStats.hard / Math.max(1, score)) * 100}%` }} />
                    </div>
                    <div className="text-lg font-mono font-bold">{difficultyStats.hard}</div>
                 </div>
              </div>
           </div>

           <div className="flex gap-4 p-2">
              <Button onClick={() => startSession(isRandomMode)} className="flex-1 h-12 rounded-2xl font-bold">再次挑战</Button>
              <Button variant="outline" onClick={() => setStarted(false)} className="flex-1 h-12 rounded-2xl font-bold">返回设置</Button>
           </div>
        </div>
      </div>
    );
  }

  // 渲染正在训练
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col relative overflow-hidden">
      {/* 顶部进度条 - 随机模式下显示无穷符号或动态效果 */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-muted/30">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
          style={{ width: isRandomMode ? '100%' : `${((currentIndex + (result !== null ? 1 : 0)) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="container max-w-4xl py-12 flex-1 flex flex-col gap-8">
        {/* 顶部状态 */}
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-card border border-border/50 flex items-center justify-center font-bold text-sm shadow-sm">
                {currentIndex + 1}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold truncate max-w-[200px]">{currentQuestion.title || '随机练习题'}</p>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">{currentQuestion.difficulty}</span>
                   <div className="h-1 w-1 rounded-full bg-muted-foreground/30"></div>
                   <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">{currentQuestion.category}</span>
                </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              {remainingSeconds !== null && (
                <div className={`flex items-center gap-2 h-10 px-4 rounded-xl border transition-colors ${remainingSeconds <= 10 ? 'bg-destructive/10 border-destructive/20 text-destructive animate-pulse' : 'bg-card border-border/50 text-muted-foreground'}`}>
                   <Timer className="w-4 h-4" />
                   <span className="text-sm font-mono font-bold">{remainingSeconds}s</span>
                </div>
              )}
              <div className="h-10 px-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2 group">
                 <Trophy className="w-4 h-4 text-primary" />
                 <span className="text-sm font-bold text-primary">{score}</span>
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl text-muted-foreground" onClick={() => setIsConfirmingStop(true)}>
                <XCircle className="w-5 h-5" />
              </Button>
           </div>
        </div>

        {/* 核心训练区域 */}
        <div className="grid gap-6">
           <div className="bg-card/50 backdrop-blur-sm rounded-[2rem] border border-border/50 overflow-hidden shadow-xl">
              <div className="bg-muted/30 p-8 flex flex-col items-center justify-center min-h-[160px] relative">
                 <div className="absolute top-4 left-6 py-1 px-3 bg-background/50 backdrop-blur-sm rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-wider border border-border/50">
                    Target Formula
                 </div>
                 <div className="transform scale-125 transition-transform duration-500 py-4">
                    <BlockMath math={currentQuestion.latex} />
                 </div>
              </div>

              <div className="p-8 space-y-6">
                 <div className="relative group">
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="开始输入 LaTeX 代码..."
                      spellCheck={false}
                      className={`w-full min-h-[120px] bg-background/50 rounded-2xl border-2 p-6 text-lg font-mono transition-all duration-300 focus:outline-none placeholder:text-muted-foreground/40 resize-none ${
                        result === 'correct' ? 'border-green-500/50 bg-green-500/5' : 
                        result === 'wrong' ? 'border-destructive/50 bg-destructive/5' : 
                        'border-border/50 focus:border-primary shadow-inner'
                      }`}
                      disabled={result !== null}
                      autoFocus
                    />
                    
                    {result === null && (
                      <div className="absolute bottom-4 right-4 text-[10px] items-center gap-1 text-muted-foreground/40 hidden md:flex">
                        <kbd className="px-1 py-0.5 rounded bg-muted border border-border/50">Ctrl</kbd>
                        <span>+</span>
                        <kbd className="px-1 py-0.5 rounded bg-muted border border-border/50">Enter</kbd>
                        <span className="ml-1">提交</span>
                      </div>
                    )}
                 </div>

                 {/* 实时预览 */}
                 <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                       <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">实时预览</Label>
                       {result === 'wrong' && (
                         <div className="text-xs text-destructive flex items-center gap-1 font-bold animate-in slide-in-from-right-2">
                           <XCircle className="w-3 h-3" />
                           需要修正
                         </div>
                       )}
                    </div>
                    <div className={`min-h-[80px] rounded-2xl border bg-muted/20 flex flex-col items-center justify-center transition-all ${result === 'wrong' ? 'border-destructive/30' : 'border-border/30'}`}>
                       {userInput.trim() ? (
                         <LatexPreview math={userInput.trim()} />
                       ) : (
                         <span className="text-muted-foreground/30 text-sm font-medium">输入后将在此显示预览</span>
                       )}
                    </div>
                 </div>

                 {/* 反馈提示 */}
                 {result !== null && (
                   <div className={`p-4 rounded-xl border animate-in slide-in-from-bottom-2 duration-300 ${result === 'correct' ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                      <div className="flex gap-3">
                         {result === 'correct' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                         <div className="space-y-1">
                            <p className="font-bold text-sm">{result === 'correct' ? '干得漂亮！公式匹配完美' : '出错了'}</p>
                            {errorHint && <p className="text-xs opacity-80 leading-relaxed font-mono break-all">{errorHint}</p>}
                         </div>
                      </div>
                   </div>
                 )}

                 {/* 操作按钮 */}
                 <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-3">
                       {result === null ? (
                         <>
                           <Button onClick={handleSubmit} size="lg" className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20">
                             提交答案
                           </Button>
                           <Button variant="ghost" onClick={handleSkip} className="rounded-xl text-muted-foreground font-bold hover:bg-muted/50">
                             跳过此题
                           </Button>
                         </>
                       ) : (
                         <Button onClick={handleNext} size="lg" disabled={isRandomMode && isFetchingMore && isLastQuestion} className={`rounded-xl px-10 font-bold shadow-lg shadow-primary/20 group ${result === 'correct' ? 'bg-primary' : 'bg-muted hover:bg-muted/80 text-foreground'}`}>
                            {isRandomMode ? (isFetchingMore && isLastQuestion ? '加载中...' : '下一题') : (isLastQuestion ? '查看总结' : '下一题')}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                         </Button>
                       )}
                    </div>

                    <div className="hidden lg:flex flex-col items-end gap-1.5 opacity-40">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold">
                          <SkipForward className="w-3 h-3" />
                          <span>跳过快捷键：Ctrl + S</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] font-bold">
                          <Keyboard className="w-3 h-3" />
                          <span>确认或下一题：Enter</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 退出确认 Overlay */}
      {isConfirmingStop && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="w-full max-w-sm bg-card rounded-[2rem] border border-border/50 p-8 shadow-2xl text-center space-y-6">
              <div className="inline-flex p-4 rounded-2xl bg-destructive/10 text-destructive">
                <Info className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">停止训练？</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">停止后将直接进入结算页面，且无法恢复当前进度。</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="destructive" className="h-12 rounded-2xl font-bold" onClick={stopSession}>确认停止</Button>
                <Button variant="ghost" className="h-12 rounded-2xl font-medium" onClick={() => setIsConfirmingStop(false)}>继续练习</Button>
              </div>
           </div>
        </div>
      )}

      {/* 装饰性背景 */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
    </div>
  );
}
