const fs = require('fs');
const path = require('path');

const headerPath = path.join('g:', 'carsite', 'src', 'components', 'Header.tsx');
let headerContent = fs.readFileSync(headerPath, 'utf8');

// Import Link and useRouter
headerContent = headerContent.replace('import Image from "next/image";', 'import Image from "next/image";\nimport Link from "next/link";\nimport { useRouter, usePathname } from "next/navigation";');

// Inside Header component, get router and pathname
headerContent = headerContent.replace('const { isAuthenticated, userEmail } = useAuthStore();', 'const { isAuthenticated, userEmail } = useAuthStore();\n  const router = useRouter();\n  const pathname = usePathname();');

// Remove currentView and setView from useUIStore
headerContent = headerContent.replace('currentView,', '');
headerContent = headerContent.replace('setView,', '');

// Update handleBrandClick
headerContent = headerContent.replace("setView('shop');", "router.push('/shop');");
// Update handleSearchSubmit
headerContent = headerContent.replace("setView('shop');", "router.push('/shop');");

// Function to replace buttons with Links for simple navigations
function replaceButtonWithLink(content, viewName, href) {
  // We need to replace onClick={() => { setSelectedProduct(null); setView('X'); }}
  // with <Link href="/X"> and change <button to <Link
  
  // This is tricky with regex because of multi-line. We will just use regex to match the button elements manually
  // Or simpler, replace setView('...') with router.push('...') everywhere!
  return content.replace(/setView\('([^']+)'\)/g, "router.push('/$1')");
}

headerContent = replaceButtonWithLink(headerContent);
// fix router.push('/home') to router.push('/')
headerContent = headerContent.replace(/router\.push\('\/home'\)/g, "router.push('/')");

// Replace active state logic: currentView === 'X' -> pathname === '/X'
headerContent = headerContent.replace(/currentView === 'home'/g, "pathname === '/'");
headerContent = headerContent.replace(/currentView === '([a-zA-Z]+)'/g, "pathname === '/$1'");

fs.writeFileSync(headerPath, headerContent, 'utf8');

const footerPath = path.join('g:', 'carsite', 'src', 'components', 'Footer.tsx');
let footerContent = fs.readFileSync(footerPath, 'utf8');

// Import Link
if (!footerContent.includes('next/link')) {
  footerContent = footerContent.replace('import React', 'import Link from "next/link";\nimport React');
}
footerContent = footerContent.replace('import { useUIStore } from "../store/useUIStore";', '');
footerContent = footerContent.replace('const { setView } = useUIStore();', '');

// footer uses <button onClick={() => setView('X')} className="...">Text</button>
// Replace <button onClick={() => setView('X')} with <Link href="/X"
footerContent = footerContent.replace(/<button onClick=\{\(\) => setView\('([^']+)'\)\}/g, (match, view) => {
  const href = view === 'home' ? '/' : `/${view}`;
  return `<Link href="${href}"`;
});
// Replace matching </button> with </Link> (this might replace all buttons, let's just do it manually)
// Only replace the ones that were changed to Link.
footerContent = footerContent.replace(/<\/button>/g, (match, offset, fullString) => {
  // If the preceding tag was <Link, it should be </Link>.
  // We'll just replace all </button> with </Link> if we only had setView buttons
  return match; // We'll fix this in the regex below instead
});

// Better approach for footer:
// Find all <button ... onClick={() => setView('...')} ... >...</button>
footerContent = footerContent.replace(/<button\s+onClick=\{\(\) => setView\('([^']+)'\)\}([\s\S]*?)<\/button>/g, (match, view, inner) => {
  const href = view === 'home' ? '/' : `/${view}`;
  return `<Link href="${href}"${inner}</Link>`;
});


fs.writeFileSync(footerPath, footerContent, 'utf8');

console.log('Header and Footer updated');
