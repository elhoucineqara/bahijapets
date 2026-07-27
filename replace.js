const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replacements
  content = content.replace(/Bahija\s*<span className=\{styles\.goldText\}>\s*Store\s*<\/span>/g, 'Qara<span className={styles.goldText}>Pets</span>');
  content = content.replace(/Bahija\s*<span className=\{styles\.gradientText\}>\s*Store\s*<\/span>/g, 'Qara<span className={styles.gradientText}>Pets</span>');
  content = content.replace(/Bahija Store/g, 'QaraPets');
  content = content.replace(/BahijaStore/g, 'QaraPets');
  content = content.replace(/Bahija Admin/g, 'QaraPets Admin');
  content = content.replace(/bahijastore\.vercel\.app/g, 'qarapets.vercel.app');
  content = content.replace(/bahijastore\.com/g, 'qarapets.com');
  content = content.replace(/Bahija/g, 'Qara');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(srcDir);
console.log('Replacement complete.');
