import Link from 'next/link';

export const metadata = {
  title: '系统教程',
  description: 'LaTeX 体系化教程',
};

export default function LearnPage() {
  const chapters = [
    { id: 1, title: 'LaTeX 入门', desc: '安装配置、文档结构、基本命令', lessons: 8, duration: '2h', progress: 0 },
    { id: 2, title: '文本排版', desc: '字体、段落、间距、对齐方式', lessons: 6, duration: '1.5h', progress: 0 },
    { id: 3, title: '数学公式基础', desc: '行内公式、行间公式、常用符号', lessons: 10, duration: '3h', progress: 0 },
    { id: 4, title: '高级数学排版', desc: '矩阵、多行公式、定理环境', lessons: 8, duration: '2.5h', progress: 0 },
    { id: 5, title: '表格与列表', desc: 'tabular、enumerate、itemize', lessons: 5, duration: '1h', progress: 0 },
    { id: 6, title: '图片与浮动体', desc: 'figure、includegraphics、caption', lessons: 6, duration: '1.5h', progress: 0 },
    { id: 7, title: '参考文献管理', desc: 'BibTeX、natbib、biblatex', lessons: 5, duration: '1.5h', progress: 0 },
    { id: 8, title: '自定义与宏包', desc: 'newcommand、usepackage、自定义样式', lessons: 7, duration: '2h', progress: 0 },
  ];

  return (
    <div className="container py-8 animate-slide-up">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">系统教程</h1>
        <p className="mt-2 text-muted-foreground">从入门到精通，循序渐进掌握 LaTeX</p>
      </div>

      <div className="space-y-4">
        {chapters.map((ch, i) => (
          <Link
            key={ch.id}
            href={`/learn/${ch.id}`}
            className="group flex items-center gap-6 rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            {/* 章节号 */}
            <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary items-center justify-center font-heading font-bold text-lg">
              {ch.id}
            </div>
            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold group-hover:text-primary transition-colors">{ch.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{ch.desc}</p>
            </div>
            {/* 元数据 */}
            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
              <span>{ch.lessons} 节</span>
              <span className="w-px h-4 bg-border" />
              <span>{ch.duration}</span>
            </div>
            {/* 箭头 */}
            <svg className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
