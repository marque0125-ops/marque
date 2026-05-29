const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Match something like:
      // import HomeView from '../../components/HomeView';
      // or import { HomeView } from ...
      
      let viewNameMatch = content.match(/import\s+(?:{\s*)?([A-Za-z0-9_]+)(?:\s*})?\s+from\s+['"](?:\.\.\/)+components\/([A-Za-z0-9_]+)['"]/);
      
      if (viewNameMatch) {
        let viewName = viewNameMatch[1];
        let moduleName = viewNameMatch[2];
        
        let newContent = content.replace(viewNameMatch[0], `import dynamic from 'next/dynamic';\nconst ${viewName} = dynamic(() => import('${viewNameMatch[0].match(/from\s+['"]([^'"]+)['"]/)[1]}'), { ssr: false });`);
        
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated dynamic import in ' + fullPath);
      }
    }
  }
}

processDir('./src/app');
