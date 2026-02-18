import Link from 'next/link';

export const metadata = {
  title: '比赛大厅',
  description: 'LaTeX 限时挑战赛',
};

export default function ContestPage() {
  const contests = [
    { id: 1, title: '每周挑战 #12', status: 'active', participants: 128, endTime: '2 天后结束', difficulty: '中等' },
    { id: 2, title: '数学公式马拉松', status: 'upcoming', participants: 0, endTime: '3 天后开始', difficulty: '困难' },
    { id: 3, title: '新手友好赛', status: 'upcoming', participants: 0, endTime: '5 天后开始', difficulty: '简单' },
  ];

  const pastContests = [
    { id: 101, title: '每周挑战 #11', participants: 256, winner: 'LaTeX_Master' },
    { id: 102, title: '期末突击赛', participants: 189, winner: 'Formula_Pro' },
    { id: 103, title: '每周挑战 #10', participants: 203, winner: 'Math_Wizard' },
  ];

  return (
    <div className="container py-8 animate-slide-up">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">比赛大厅</h1>
        <p className="mt-2 text-muted-foreground">参加限时挑战，检验你的 LaTeX 实力</p>
      </div>

      {/* 进行中/即将开始 */}
      <h2 className="font-semibold text-lg mb-4">🔥 当前比赛</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {contests.map((contest) => (
          <div
            key={contest.id}
            className="rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                contest.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}>
                {contest.status === 'active' ? '进行中' : '即将开始'}
              </span>
              <span className="text-xs text-muted-foreground">{contest.difficulty}</span>
            </div>
            <h3 className="font-semibold mb-2">{contest.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{contest.endTime}</p>
            {contest.status === 'active' ? (
              <Link
                href={`/contest/${contest.id}`}
                className="inline-flex w-full h-9 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                参加比赛
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex w-full h-9 items-center justify-center rounded-lg bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed"
              >
                即将开放
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 历史比赛 */}
      <h2 className="font-semibold text-lg mb-4">📋 历史比赛</h2>
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">比赛名称</th>
              <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4 hidden sm:table-cell">参与人数</th>
              <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">冠军</th>
            </tr>
          </thead>
          <tbody>
            {pastContests.map((c) => (
              <tr key={c.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-sm font-medium">{c.title}</td>
                <td className="text-right py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">{c.participants} 人</td>
                <td className="text-right py-3 px-4 text-sm text-primary font-medium">🏆 {c.winner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
