import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Zap, BookOpen, Search, CheckCircle2, Trophy, Cloud } from 'lucide-react';

const FeatureIcon = ({ name }: { name: string }) => {
  const icons: Record<string, any> = {
    Zap, BookOpen, Search, CheckCircle2, Trophy, Cloud
  };
  const Icon = icons[name];
  return Icon ? <Icon className="w-6 h-6" /> : null;
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <Header />

      <main className="flex-1">
        {/* --- 1. Hero Section --- */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40">
          {/* 背景光效 */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-50 animate-pulse-ring" />
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[80px]" />
          </div>

          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* 左侧文案 */}
              <div className="text-center lg:text-left animate-slide-in-left">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse mr-2"></span>
                  <span className="text-xs font-medium text-primary">v1.0 正式发布</span>
                </div>
                
                <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1] mb-6">
                  让学术写作 <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-400 to-blue-500 animate-shimmer bg-[length:200%_auto]">
                    优雅且高效
                  </span>
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                  面向未来的 LaTeX 学习训练平台。从基础语法到复杂排版，
                  通过实时交互式练习，像玩游戏一样掌握学术写作。
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                  >
                    开始免费练习
                  </Link>
                  <Link
                    href="/learn"
                    className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all hover:-translate-y-0.5"
                  >
                    <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                    </svg>
                    观看演示
                  </Link>
                </div>
                
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    永久免费开源
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    无需配置环境
                  </div>
                </div>
              </div>

              {/* 右侧演示窗口 */}
              <div className="relative animate-slide-in-right hidden lg:block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur opacity-20"></div>
                <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="mx-auto text-xs font-mono text-muted-foreground opacity-70">
                      demo.tex
                    </div>
                  </div>
                  <div className="grid grid-cols-2 h-[400px]">
                    {/* 编辑器模拟 */}
                    <div className="p-4 font-mono text-sm leading-relaxed text-muted-foreground/80 border-r border-border/50 bg-background/50">
                      <div className="flex gap-4">
                        <span className="text-muted-foreground/30 select-none">1</span>
                        <span><span className="text-blue-500">\documentclass</span>{'{article}'}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground/30 select-none">2</span>
                        <span><span className="text-blue-500">\usepackage</span>{'{amsmath}'}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground/30 select-none">3</span>
                        <span><span className="text-blue-500">\begin</span>{'{document}'}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground/30 select-none">4</span>
                        <span>  Hello, <span className="text-primary font-bold">\LaTeX</span>!</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground/30 select-none">5</span>
                        <span>  The quadratic formula is:</span>
                      </div>
                      <div className="flex gap-4 bg-primary/10 -mx-4 px-4 border-l-2 border-primary">
                        <span className="text-muted-foreground/30 select-none">6</span>
                        <span>  $$x = <span className="text-purple-500">\frac</span>{`{-b \\pm \\sqrt{b^2-4ac}}{2a}`}$$</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground/30 select-none">7</span>
                        <span><span className="text-blue-500">\end</span>{'{document}'}</span>
                      </div>
                      <div className="mt-4 animate-pulse h-4 w-2 bg-primary"></div>
                    </div>
                    {/* 预览模拟 */}
                    <div className="p-8 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center text-foreground">
                      <p className="mb-6 font-serif text-lg">Hello, <span className="italic font-bold">L<span className="uppercase text-[0.7em] align-[0.2em] -ml-[0.36em] -mr-[0.15em]">a</span>T<span className="uppercase text-[0.7em] align-[-0.2em] -ml-[0.16em] -mr-[0.1em]">e</span>X</span>!</p>
                      <p className="mb-4 font-serif">The quadratic formula is:</p>
                      <div className="text-2xl font-serif">
                        {/* 这里可以用图片或者 SVG 模拟公式，为了简单直接用文字模拟一下排版 */}
                        <div className="flex items-center gap-2">
                           <span className="italic">x</span> = 
                           <div className="flex flex-col items-center">
                             <span className="border-b border-foreground px-1 mb-1">-b ± √<span className="border-t border-foreground inline-block">b²-4ac</span></span>
                             <span>2a</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. Brand Trust Bar --- */}
        <section className="border-y border-border/40 bg-muted/30">
          <div className="container py-10">
            <p className="text-center text-sm font-medium text-muted-foreground mb-8">
              基于业界顶尖开源技术构建
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {/* KaTeX Logo */}
              <div className="group flex items-center gap-2 cursor-default select-none transition-transform hover:scale-110">
                <span className="font-serif text-2xl font-bold tracking-tight">
                  K<span className="uppercase text-lg align-top -ml-0.5 mt-0.5 inline-block">A</span>T<span className="uppercase text-lg align-bottom -ml-0.5 mb-0 inline-block">E</span>X
                </span>
              </div>

              {/* Overleaf Logo - SVG Path */}
              <div className="group flex items-center gap-2 cursor-default select-none transition-transform hover:scale-110">
                 <svg role="img" viewBox="0 0 24 24" className="w-8 h-8 text-green-700 dark:text-green-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                   <title>Overleaf</title>
                   <path d="M22.3515.7484C19.1109-.5101 7.365-.982 7.3452 6.0266c-3.4272 2.194-5.6967 5.768-5.6967 9.598a8.373 8.373 0 0 0 13.1225 6.898 8.373 8.373 0 0 0-1.7668-14.7194c-.6062-.2339-1.9234-.6481-2.9753-.559-1.5007.9544-3.3308 2.9155-4.1949 4.8693 2.5894-3.082 7.5046-2.425 9.1937 1.2287 1.6892 3.6538-.9944 7.8237-5.0198 7.7998a5.4995 5.4995 0 0 1-4.1949-1.9328c-1.485-1.7483-1.8678-3.6444-1.5615-5.4975 1.057-6.4947 8.759-10.1894 14.486-11.6094-1.8677.989-5.2373 2.6134-7.5948 4.3837C18.015 9.1382 19.1308 3.345 22.3515.7484z"/>
                 </svg>
                 <span className="font-bold text-xl">Overleaf</span>
              </div>

              {/* TeX Live - Text Based */}
              <div className="group flex items-center gap-2 cursor-default select-none transition-transform hover:scale-110">
                <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-600/20">TL</div>
                <span className="font-bold text-xl text-blue-700 dark:text-blue-400">TeX Live</span>
              </div>

              {/* CTAN - Text Based */}
              <div className="group flex items-center gap-2 cursor-default select-none transition-transform hover:scale-110">
                <svg className="w-8 h-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-bold text-xl">CTAN</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. Feature Grid --- */}
        <section className="py-24 lg:py-32">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl font-bold sm:text-4xl mb-4">
                为效率而生的现代体验
              </h2>
              <p className="text-lg text-muted-foreground">
                告别枯燥的文档阅读，拥抱这一代交互式学习工具
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  iconName: 'Zap',
                  color: 'text-yellow-500',
                  title: '实时编译预览',
                  desc: '基于 WebAssembly 的极速编译引擎，键入即所得，无需等待服务器响应。'
                },
                {
                  iconName: 'BookOpen',
                  color: 'text-blue-500',
                  title: '结构化教程',
                  desc: '精心编排的知识图谱，从文档结构到高级宏定义，循序渐进掌握 LaTeX。'
                },
                {
                  iconName: 'Search',
                  color: 'text-purple-500',
                  title: '智能符号检索',
                  desc: '集成 10000+ 数学符号，支持模糊搜索、手写识别（Coming Soon）。'
                },
                {
                  iconName: 'CheckCircle2',
                  color: 'text-orange-500',
                  title: '自动纠错反馈',
                  desc: '智能语法分析，即时标记错误代码并提供修复建议，新手友好。'
                },
                {
                  iconName: 'Trophy',
                  color: 'text-teal-500',
                  title: '游戏化练习',
                  desc: '通过挑战赛、每日一题积攒积分，点亮技能树，让学习不再枯燥。'
                },
                {
                  iconName: 'Cloud',
                  color: 'text-red-500',
                  title: '云端同步',
                  desc: '所有代码与练习进度自动保存至云端，多设备无缝切换。'
                },
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`mb-6 w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${feature.color}`}>
                     <FeatureIcon name={feature.iconName} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 4. Stats Section --- */}
        <section className="py-20 bg-primary/5 border-y border-border/40">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/40">
              {[
                { val: '3,000+', label: 'LaTeX 符号' },
                { val: '500+', label: '练习题库' },
                { val: '15+', label: '推荐资源' },
                { val: '99%', label: '好评率' },
              ].map((stat, i) => (
                <div key={i} className="p-4">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 animate-count-up" style={{ animationDelay: `${i * 100}ms` }}>
                    {stat.val}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 5. Testimonials (Redesigned) --- */}
        <section className="py-24 lg:py-32 bg-slate-50 dark:bg-black/20 relative overflow-hidden">
           {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="container relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl font-bold sm:text-4xl mb-4">
                深受学术界与开发者信赖
              </h2>
              <p className="text-lg text-muted-foreground">
                来自全球顶尖高校与科技公司的用户评价
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { 
                  name: 'Dr. Zhang', 
                  role: '数学系教授 @ Tsinghua Univ.', 
                  content: '终于有一个能让学生快速上手的 LaTeX 平台了。界面非常现代，实时预览功能极大地降低了教学成本。',
                  avatarColor: 'bg-blue-500'
                },
                { 
                  name: 'Li Ming', 
                  role: '计算机科学博士生', 
                  content: '公式速查功能帮了大忙，写论文时再也不用翻厚厚的 PDF 手册了。智能纠错也挽救了我的毕业论文！',
                  avatarColor: 'bg-emerald-500' 
                },
                { 
                  name: 'Sarah Jenkins', 
                  role: '技术文档工程师', 
                  content: '练习模式非常有创意，把枯燥的语法点变成了有趣的小挑战。这是这一代人学习排版工具的最佳方式。',
                  avatarColor: 'bg-orange-500'
                }
              ].map((item, i) => (
                <div key={i} className="group relative bg-background border border-border rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute top-6 right-8 text-6xl text-primary/10 font-serif leading-none select-none">”</div>
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className={`w-12 h-12 rounded-full ${item.avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-md`}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{item.name}</div>
                      <div className="text-xs font-mono text-muted-foreground">{item.role}</div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed relative z-10">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 6. Final CTA (Redesigned) --- */}
        <section className="relative py-32 overflow-hidden m-4 lg:m-8 rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal-600 to-blue-700">
             {/* Dynamic Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
               <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
               <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
               <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
            </div>
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
          
          <div className="container relative z-10 text-center text-white">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 drop-shadow-sm">
              准备好重新定义<br/>你的学术写作体验了吗？
            </h2>
            <p className="text-blue-50 text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              加入数千名研究者、学生和工程师的行列，<br className="hidden sm:block"/>
              体验更智能、更优雅的 LaTeX 写作方式。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link href="/register" className="group relative h-14 px-8 rounded-full bg-white text-primary font-bold text-lg flex items-center justify-center overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95">
                <span className="relative z-10 flex items-center gap-2">
                  立即免费注册 
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <a href="https://github.com/Auroral0810/LaTexia" target="_blank" className="h-14 px-8 rounded-full border border-white/30 bg-white/10 text-white font-medium text-lg flex items-center justify-center hover:bg-white/20 hover:border-white/50 transition-all backdrop-blur-md">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  GitHub Star
                </span>
              </a>
            </div>
            
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-blue-100/60 font-medium tracking-wide uppercase">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 无需信用卡</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 永久免费计划</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 随时导出源码</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
