import dotenv from 'dotenv';
import path from 'path';

// 加载根目录 .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

/**
 * 类型安全的环境变量集中管理
 */
export const env = {
  // 应用
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),

  // 数据库
  DATABASE_URL: process.env.DATABASE_URL!,

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'latexia-access-secret-dev',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'latexia-refresh-secret-dev',
  JWT_ACCESS_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',

  // 邮件
  MAIL_HOST: process.env.MAIL_HOST || '',
  MAIL_PORT: parseInt(process.env.MAIL_PORT || '465', 10),
  MAIL_USERNAME: process.env.MAIL_USERNAME || '',
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
  MAIL_FROM: process.env.MAIL_FROM || '',
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME || 'Latexia',
  MAIL_USE_SSL: process.env.MAIL_USE_SSL === 'true',

  // 短信（暂为模拟）
  SMS_PROVIDER: process.env.SMS_PROVIDER || 'mock',
} as const;
