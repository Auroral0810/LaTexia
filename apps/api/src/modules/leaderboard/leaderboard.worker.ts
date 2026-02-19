import { refreshSnapshots } from './leaderboard.service';

/**
 * 排行榜后台任务
 */
export function startLeaderboardWorker() {
  console.log('[Leaderboard Worker] Started.');

  // 每 30 分钟刷新一次今日和全站榜单
  // 注意：在实际生产环境中，建议使用更成熟的 Cron 库或外部触发
  const REFRESH_INTERVAL = 30 * 60 * 1000;

  // 立即执行一次
  refreshSnapshots().catch(err => console.error('[Leaderboard Worker] Initial refresh failed:', err));

  const intervalId = setInterval(async () => {
    try {
      await refreshSnapshots();
    } catch (err) {
      console.error('[Leaderboard Worker] Periodic refresh failed:', err);
    }
  }, REFRESH_INTERVAL);

  return () => clearInterval(intervalId);
}
