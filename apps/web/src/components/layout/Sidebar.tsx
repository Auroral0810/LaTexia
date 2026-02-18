import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <div className="h-full py-6 pr-6 lg:py-8">
        <div className="w-full">
          <div className="pb-4">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
              学习
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              <Link href="/practice" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">
                题库练习
              </Link>
              <Link href="/learn" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">
                系统教程
              </Link>
              <Link href="/symbols" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">
                符号查询
              </Link>
            </div>
          </div>
          <div className="pb-4">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
              竞技
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              <Link href="/leaderboard" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">
                排行榜
              </Link>
              <Link href="/contest" className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">
                比赛大厅
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
