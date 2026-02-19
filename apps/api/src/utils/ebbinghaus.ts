/**
 * 艾宾浩斯记忆曲线复习阶段间隔（天）
 * 阶段 1: 1天后
 * 阶段 2: 2天后
 * 阶段 3: 4天后
 * 阶段 4: 7天后
 * 阶段 5: 15天后
 * 阶段 6: 30天后
 */
const EBBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30];

/**
 * 根据阶段获取下次复习日期
 */
export function getNextReviewDate(stage: number): Date {
  const now = new Date();
  // 阶段从 1 开始，对应索引 stage - 1
  const daysToAdd = EBBINGHAUS_INTERVALS[Math.min(stage - 1, EBBINGHAUS_INTERVALS.length - 1)];
  
  const nextDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return nextDate;
}

/**
 * 获取总阶段数
 */
export const MAX_REVIEW_STAGE = EBBINGHAUS_INTERVALS.length;
