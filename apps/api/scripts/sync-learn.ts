import fs from 'fs';
import path from 'path';
import * as learnService from '../src/modules/learn/learn.service';

const DATA_DIR = path.join(__dirname, '../../web/src/data');

//章节名称映射
const CHAPTER_NAMES: Record<string, string> = {
  'ch1': 'LaTeX 入门',
  'ch2': '文本排版',
  'ch3': '数学公式基础',
  'ch4': '高级数学排版',
  'ch5': '表格与列表',
  'ch6': '图片与浮动体',
  'ch7': '参考文献管理',
  'ch8': '自定义与宏包',
};

async function sync() {
  const allEntries = fs.readdirSync(DATA_DIR);
  const dirs = allEntries.filter(d => {
    const stat = fs.statSync(path.join(DATA_DIR, d));
    return stat.isDirectory() && d.startsWith('ch');
  });
  
  for (const dir of dirs) {

    const chapterSlug = dir;
    const chapterTitle = CHAPTER_NAMES[dir] || dir;
    
    console.log(`Syncing Chapter: ${chapterTitle} (${chapterSlug})...`);
    
    // 1. Upsert Chapter
    const chapter = await learnService.upsertChapter({
      title: chapterTitle,
      slug: chapterSlug,
      sortOrder: parseInt(dir.replace('ch', '')),
      isPublished: true,
      parentId: null,
    });

    if (!chapter) continue;

    // 2. Sync Sections (Files)
    const files = fs.readdirSync(path.join(DATA_DIR, dir)).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(DATA_DIR, dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // 提取标题 (第一个 # 后的内容)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : file;
      
      // 生成 Section Slug (如 01-what-is-latex)
      const sectionSlug = file.replace('.md', '');
      const sortOrderMatch = file.match(/^(\d+)-/);
      const sortOrder = sortOrderMatch ? parseInt(sortOrderMatch[1]) : 0;

      console.log(`  -> Syncing Section: ${title} (${sectionSlug})...`);
      
      await learnService.upsertChapter({
        title,
        slug: sectionSlug,
        content,
        sortOrder,
        parentId: chapter.id,
        isPublished: true,
      });
    }
  }
}

sync()
  .then(() => {
    console.log('Sync completed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
  });
