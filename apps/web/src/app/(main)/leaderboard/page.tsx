export const metadata = {
  title: '排行榜',
  description: 'LaTeX 练习排行榜',
};

export default function LeaderboardPage() {
  const mockData = [
    { rank: 1, name: 'LaTeX_Master', score: 9820, solved: 342, streak: 45 },
    { rank: 2, name: 'Formula_Pro', score: 8650, solved: 298, streak: 32 },
    { rank: 3, name: 'Math_Wizard', score: 7430, solved: 256, streak: 28 },
    { rank: 4, name: 'TeX_Lover', score: 6890, solved: 231, streak: 21 },
    { rank: 5, name: 'Academic_Writer', score: 5720, solved: 198, streak: 15 },
    { rank: 6, name: 'Typesetter', score: 4560, solved: 167, streak: 12 },
    { rank: 7, name: 'Paper_Crafter', score: 3980, solved: 142, streak: 9 },
    { rank: 8, name: 'Equation_Hero', score: 3210, solved: 118, streak: 7 },
  ];

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-amber-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-700';
    return 'text-muted-foreground';
  };

  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="container py-8 animate-slide-up">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">排行榜</h1>
        <p className="mt-2 text-muted-foreground">与全球 LaTeX 学习者一较高下</p>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4 w-16">排名</th>
              <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">用户</th>
              <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4 hidden sm:table-cell">已解决</th>
              <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4 hidden md:table-cell">连续天数</th>
              <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">积分</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((user) => (
              <tr key={user.rank} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4">
                  <span className={`text-lg font-bold ${getMedalColor(user.rank)}`}>
                    {getMedal(user.rank)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {user.name[0]}
                    </div>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>
                </td>
                <td className="text-right py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">{user.solved}</td>
                <td className="text-right py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{user.streak} 天</td>
                <td className="text-right py-3 px-4 text-sm font-semibold">{user.score.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
