import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../web/src/data');

function fixMarkdownFiles() {
  const allEntries = fs.readdirSync(DATA_DIR);
  const dirs = allEntries.filter(d => {
    const stat = fs.statSync(path.join(DATA_DIR, d));
    return stat.isDirectory() && d.startsWith('ch');
  });

  let modifiedCount = 0;

  for (const dir of dirs) {
    const files = fs.readdirSync(path.join(DATA_DIR, dir)).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(DATA_DIR, dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Ensure empty line before ```
      let newContent = content.replace(/([^\n])\n```/g, '$1\n\n```');
      
      // Ensure empty line after ``` if the next line is not empty and not EOF
      newContent = newContent.replace(/```\n([^\n])/g, '```\n\n$1');

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Fixed: ${dir}/${file}`);
        modifiedCount++;
      }
    }
  }

  console.log(`Fixed ${modifiedCount} files in total.`);
}

fixMarkdownFiles();
