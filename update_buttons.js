const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('g:/carsite/src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Look for text-black inside class strings that also contain bg-brand-orange
    let regex = /className=[\"\{\`][^\>]*bg-brand-orange[^\>]*[\"\}\`]/g;
    
    content = content.replace(regex, (match) => {
      // Only replace if it has text-black and doesn't already have sm:text-black
      if (match.includes('text-black') && !match.includes('sm:text-black')) {
        // replace exactly word boundary text-black
        return match.replace(/\btext-black\b/g, 'text-white sm:text-black');
      }
      return match;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
