import * as fs from 'fs';
import * as path from 'path';

/**
 * 全面修复 Markdown 文件中的格式问题：
 * 1. 移除 HTML 容器（<div>, <strong>, <em> 等）
 * 2. 确保代码块前后有空行
 * 3. 确保 $$ 数学块前后有空行，且 $$ 独占一行
 * 4. 确保 --- 分隔线前后有空行
 * 5. 检查 $$ 是否配对
 */

const DATA_DIR = path.resolve(__dirname, '../../../apps/web/src/data');

function fixMarkdownFile(filePath: string): { modified: boolean; unbalanced: boolean } {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // 1. 先进行 HTML 标签的基础清理
  content = content.replace(/<div[^>]*>/g, '\n\n');
  content = content.replace(/<\/div>/g, '\n\n');
  content = content.replace(/<strong>/g, '**').replace(/<\/strong>/g, '**');
  content = content.replace(/<em>/g, '*').replace(/<\/em>/g, '*');

  let lines = content.split('\n');
  let result: string[] = [];
  let modified = false;
  let inCodeBlock = false;
  let dollarCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 处理代码块状态
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    // 处理 $$ 分行逻辑
    // 只有在非代码块中才统计和拆分 $$
    
    // 如果一行是 "$$...$$" (单行数学公式)，不需要拆分，但要记 2 个
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length >= 4) {
      dollarCount += 2;
      
      const prevLine = result.length > 0 ? result[result.length - 1] : '';
      if (!prevLine.match(/^\s*$/)) {
        result.push('');
        modified = true;
      }
      result.push(line);
      
      const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
      if (nextLine.trim() !== '') {
        result.push('');
        modified = true;
      }
      continue;
    }

    // 如果一行以 $$ 开头但没闭合 (多行数学开始)
    if (trimmed.startsWith('$$') && !trimmed.endsWith('$$')) {
      dollarCount++;
      const prevLine = result.length > 0 ? result[result.length - 1] : '';
      if (!prevLine.match(/^\s*$/)) {
        result.push('');
        modified = true;
      }
      
      if (trimmed.length > 2) {
        result.push('$$');
        result.push(trimmed.substring(2).trim());
        modified = true;
      } else {
        result.push('$$');
      }
      continue;
    }

    // 如果一行以 $$ 结尾但不是开头 (多行数学结束)
    if (trimmed.endsWith('$$') && !trimmed.startsWith('$$')) {
      dollarCount++;
      if (trimmed.length > 2) {
        result.push(trimmed.substring(0, trimmed.length - 2).trim());
        result.push('$$');
        modified = true;
      } else {
        result.push('$$');
      }

      const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
      if (nextLine.trim() !== '') {
        result.push('');
        modified = true;
      }
      continue;
    }

    // 如果一行就是 $$
    if (trimmed === '$$') {
      dollarCount++;
      const prevLine = result.length > 0 ? result[result.length - 1] : '';
      if (!prevLine.match(/^\s*$/)) {
        result.push('');
        modified = true;
      }
      result.push('$$');
      
      const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
      if (nextLine.trim() !== '') {
        result.push('');
        modified = true;
      }
      continue;
    }

    // 普通行，也要检查 --- 和 ##
    const prevLine = result.length > 0 ? result[result.length - 1] : '';
    const needsBlankBefore = (
      (trimmed === '---' && !prevLine.match(/^\s*$/)) ||
      (trimmed.match(/^#{1,6}\s/) && i > 0 && !prevLine.match(/^\s*$/))
    );

    if (needsBlankBefore && result.length > 0) {
      result.push('');
      modified = true;
    }

    result.push(line);

    const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
    const needsBlankAfter = (
      (trimmed === '---' && nextLine.trim() !== '')
    );

    if (needsBlankAfter && nextLine.trim() !== '') {
      result.push('');
      modified = true;
    }
  }

  // 去重空行
  let finalLines: string[] = [];
  let emptyCount = 0;
  for (const line of result) {
    if (line.trim() === '') {
      emptyCount++;
      if (emptyCount <= 1) finalLines.push(line);
    } else {
      emptyCount = 0;
      finalLines.push(line);
    }
  }

  let finalContent = finalLines.join('\n');
  if (originalContent !== finalContent) {
    fs.writeFileSync(filePath, finalContent, 'utf-8');
    return { modified: true, unbalanced: dollarCount % 2 !== 0 };
  }
  
  return { modified: false, unbalanced: dollarCount % 2 !== 0 };
}

const dirs = fs.readdirSync(DATA_DIR).filter(d => 
  fs.statSync(path.join(DATA_DIR, d)).isDirectory() && d.startsWith('ch')
);

let totalModified = 0;
let unbalancedFiles = [];

for (const dir of dirs) {
  const dirPath = path.join(DATA_DIR, dir);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const result = fixMarkdownFile(filePath);
    if (result.modified) {
      console.log(`Fixed: ${dir}/${file}`);
      totalModified++;
    }
    if (result.unbalanced) {
      unbalancedFiles.push(`${dir}/${file}`);
    }
  }
}

console.log(`\nTotal files modified: ${totalModified}`);
if (unbalancedFiles.length > 0) {
  console.log(`\nWARNING: Unbalanced $$ found in:\n- ${unbalancedFiles.join('\n- ')}`);
}
