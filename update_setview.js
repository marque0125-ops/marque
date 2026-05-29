const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'AccessoriesView.tsx',
  'account/AuthPanel.tsx',
  'CartView.tsx',
  'account/Dashboard.tsx',
  'HomeView.tsx',
  'PdpView.tsx',
  'ShopView.tsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join('g:', 'carsite', 'src', 'components', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('next/navigation')) {
    content = content.replace('import React', 'import { useRouter } from "next/navigation";\nimport React');
  }

  // Remove setView from useUIStore extraction
  content = content.replace(/,\s*setView\b/g, '');
  content = content.replace(/\bsetView,\s*/g, '');

  // Add useRouter hook
  // Find where useUIStore is called and inject useRouter after it
  content = content.replace(/(const {[^}]+} = useUIStore\(\);)/, '$1\n  const router = useRouter();');

  // Replace setView('shop') with router.push('/shop')
  content = content.replace(/setView\('home'\)/g, "router.push('/')");
  content = content.replace(/setView\('([^']+)'\)/g, "router.push('/$1')");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
});
