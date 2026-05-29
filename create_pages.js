const fs = require('fs');
const path = require('path');

const appDir = path.join('g:', 'carsite', 'src', 'app');

const routes = [
  { path: 'shop', component: 'ShopView' },
  { path: 'accessories', component: 'AccessoriesView' },
  { path: 'cart', component: 'CartView' },
  { path: 'account', component: 'AccountView' },
  { path: 'admin', component: 'AdminView' },
  { path: 'terms', component: 'TermsView' },
  { path: 'shipping', component: 'ShippingView' }
];

routes.forEach(route => {
  const dirPath = path.join(appDir, route.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const pageContent = `import ${route.component} from '../../components/${route.component}';

export default function ${route.component}Page() {
  return <${route.component} />;
}
`;
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), pageContent);
  console.log('Created ' + route.path + '/page.tsx');
});

// Create product/[slug]
const productDir = path.join(appDir, 'product', '[slug]');
if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
}
const pdpContent = `import PdpView from '../../../components/PdpView';

export default function ProductPage({ params }: { params: { slug: string } }) {
  // We will pass the slug to it or let it read from URL later.
  return <PdpView />;
}
`;
fs.writeFileSync(path.join(productDir, 'page.tsx'), pdpContent);
console.log('Created product/[slug]/page.tsx');
