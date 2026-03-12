const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(full)) {
      let content = fs.readFileSync(full, 'utf-8');
      const newContent = content.replace(/("[^\"]+?)@[0-9][^\"]*(")/g, '$1$2');
      if (newContent !== content) {
        fs.writeFileSync(full, newContent);
        console.log('Patched', full);
      }
    }
  }
}

walk(path.resolve(process.cwd(), 'src'));
