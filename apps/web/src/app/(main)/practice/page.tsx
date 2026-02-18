import Link from 'next/link';

export const metadata = {
  title: '题库练习',
  description: '在线 LaTeX 练习题库',
};

export default function PracticePage() {
  const categories = [
    { name: '基础语法', count: 42, level: '入门', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { name: '数学公式', count: 86, level: '进阶', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { name: '表格与列表', count: 35, level: '入门', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { name: '图片与浮动体', count: 28, level: '进阶', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { name: '参考文献', count: 24, level: '进阶', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { name: '自定义命令', count: 31, level: '高级', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    { name: '模板与排版', count: 19, level: '高级', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    { name: 'Beamer 演示文稿', count: 22, level: '高级', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="container py-8 animate-slide-up">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">题库练习</h1>
        <p className="mt-2 text-muted-foreground">选择一个分类开始练习，巩固你的 LaTeX 技能</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/practice/${encodeURIComponent(cat.name)}`}
            className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cat.color}`}>
                {cat.level}
              </span>
              <span className="text-xs text-muted-foreground">{cat.count} 题</span>
            </div>
            <h3 className="font-semibold group-hover:text-primary transition-colors">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
