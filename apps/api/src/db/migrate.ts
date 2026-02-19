import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

async function main() {
  console.log('🚀 开始数据库迁移...');
  console.log(`📦 连接: ${connectionString!.replace(/:[^:@]+@/, ':****@')}`);

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  try {
    await migrate(db, {
      migrationsFolder: path.resolve(__dirname, './migrations'),
    });
    console.log('✅ 数据库迁移完成！');
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
