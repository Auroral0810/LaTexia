import Link from 'next/link';

interface Resource {
  id: number;
  name: string;
  url: string;
  description: string;
  level: string;
  isOfficial: boolean;
  category: 'tutorial' | 'reference' | 'tool' | 'community';
}

const resources: Resource[] = [
  {
    id: 1,
    name: 'Overleaf Learn LaTeX',
    url: 'https://www.overleaf.com/learn',
    description: '最受欢迎的在线 LaTeX 编辑器 + 完整教程库，从“30分钟入门”到表格、图表、参考文献等高级主题，全部支持一键在 Overleaf 中编辑运行。',
    level: '入门到高级',
    isOfficial: false,
    category: 'tutorial'
  },
  {
    id: 2,
    name: 'Learn LaTeX (learnlatex.org)',
    url: 'https://www.learnlatex.org/en/',
    description: 'LaTeX 项目团队成员亲自编写的 16 节短课，内容精炼、可直接在线编辑示例，安装+基础+结构一步步教。',
    level: '入门',
    isOfficial: true,
    category: 'tutorial'
  },
  {
    id: 3,
    name: 'LaTeX-Tutorial.com',
    url: 'https://latex-tutorial.com/',
    description: '简洁清晰的步步教程，配完整代码示例，专为科研论文/报告设计，适合快速上手。',
    level: '入门 / 进阶',
    isOfficial: false,
    category: 'tutorial'
  },
  {
    id: 4,
    name: 'UseOctree Learn LaTeX',
    url: 'https://www.useoctree.com/learn/latex',
    description: '2025 年更新的完整初学者教程，覆盖文档结构、数学公式、表格、引用等，界面现代。',
    level: '入门',
    isOfficial: false,
    category: 'tutorial'
  },
  {
    id: 5,
    name: 'Javatpoint LaTeX Tutorial',
    url: 'https://www.javatpoint.com/latex-tutorial',
    description: '结构化教程 + 大量示例代码，适合有编程基础的初学者，包含环境搭建和常用命令。',
    level: '入门',
    isOfficial: false,
    category: 'tutorial'
  },
  {
    id: 6,
    name: 'LaTeX Wikibooks',
    url: 'https://en.wikibooks.org/wiki/LaTeX',
    description: '开放式维基百科风格的全面手册，从零基础到高级宏、自定义样式，几乎所有主题都有。',
    level: '入门到高级',
    isOfficial: false,
    category: 'reference'
  },
  {
    id: 7,
    name: 'Getting to Grips with LaTeX',
    url: 'http://www.andy-roberts.net/writing/latex',
    description: '经典免费教程，内容平衡，适合从入门过渡到进阶的科研写作。',
    level: '入门到进阶',
    isOfficial: false,
    category: 'tutorial'
  },
  {
    id: 8,
    name: 'The LaTeX Project 官方文档',
    url: 'https://www.latex-project.org/help/documentation/',
    description: 'LaTeX 核心团队维护的官方参考文档、发布说明和进阶指南。',
    level: '进阶到高级',
    isOfficial: true,
    category: 'reference'
  },
  {
    id: 9,
    name: 'TeX Users Group (TUG)',
    url: 'https://www.tug.org/',
    description: 'TeX/LaTeX 官方用户组织，提供资源链接、会议资料、新闻和进一步学习路径。',
    level: '所有层次',
    isOfficial: true,
    category: 'community'
  },
  {
    id: 10,
    name: 'CTAN - 综合 TeX 档案网',
    url: 'https://www.ctan.org/',
    description: '所有 LaTeX 包的中央仓库，可搜索包名、下载文档，是进阶必备工具站。',
    level: '高级',
    isOfficial: true,
    category: 'tool'
  },
  {
    id: 11,
    name: 'TeX - LaTeX Stack Exchange',
    url: 'https://tex.stackexchange.com/',
    description: '全球最大的 LaTeX 问答社区，搜任何问题几乎都有答案，包含高级宏、排版技巧。',
    level: '进阶到高级',
    isOfficial: false,
    category: 'community'
  },
  {
    id: 12,
    name: 'Detexify',
    url: 'https://detexify.kirelabs.org/',
    description: '“手画符号找命令”神器，画出符号就能得到 LaTeX 代码 + 所需包，学习符号最快方式。',
    level: '所有层次',
    isOfficial: false,
    category: 'tool'
  },
  {
    id: 13,
    name: 'TeXample.net',
    url: 'https://www.texample.net/',
    description: '海量 LaTeX 示例库（尤其是 TikZ/PGF 绘图），适合想做复杂图表/海报的进阶用户。',
    level: '进阶到高级',
    isOfficial: false,
    category: 'reference'
  },
  {
    id: 14,
    name: 'Harvard Library LaTeX Resources',
    url: 'https://guides.library.harvard.edu/overleaf/latex',
    description: '顶尖大学图书馆整理的资源合集，包含模板、符号列表、进阶链接，质量极高。',
    level: '入门到进阶',
    isOfficial: false,
    category: 'reference'
  },
  {
    id: 15,
    name: 'The Not So Short Introduction',
    url: 'https://tobi.oetiker.ch/lshort/',
    description: '经典“不太短的 LaTeX 介绍”（lshort）官方托管站点，PDF + 更新链接，进阶必读。',
    level: '入门到进阶',
    isOfficial: false,
    category: 'tutorial'
  },
];

export const metadata = {
  title: '学习资源 | Latexia',
  description: '精选的 LaTeX 学习网站、工具和社区资源。',
};

export default function ToolsPage() {
  return (
    <div className="container py-10 animate-slide-up">
      {/* 头部 */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
          学习资源 <span className="text-primary">Center</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          我们为你精选了全球最优质的 LaTeX 学习站点、官方文档和社区工具，助你从入门到精通。
        </p>
      </div>

      {/* 分类切换器 (未来可扩展) */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {['全部', '系统教程', '参考手册', '实用工具', '技术社区'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              tab === '全部'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 资源网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col h-full rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 shadow-sm"
          >
            {/* 官方标签 */}
            {res.isOfficial && (
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                Official
              </div>
            )}

            <div className="mb-4">
              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-primary mb-2 px-2 py-0.5 rounded-md bg-primary/5">
                {res.category === 'tutorial' && '📚 教程'}
                {res.category === 'reference' && '📖 参考'}
                {res.category === 'tool' && '🔧 工具'}
                {res.category === 'community' && '👥 社区'}
              </div>
              <h3 className="font-heading text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                {res.name}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground flex-1 mb-6 leading-relaxed">
              {res.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {res.level}
              </span>
              <div className="flex items-center text-primary font-semibold text-sm gap-1 group-hover:translate-x-1 transition-transform">
                立即访问
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* 底部建议 */}
      <div className="mt-20 p-8 rounded-3xl bg-muted/50 border border-border/50 text-center max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-2">有更好的资源推荐？</h2>
        <p className="text-muted-foreground text-sm mb-6">
          如果你发现了一些质量极高的 LaTeX 学习站点、工具或开源项目，欢迎反馈给我们，我们会不断丰富这个列表。
        </p>
        <Link
          href="/about"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
        >
          联系我们
        </Link>
      </div>
    </div>
  );
}
