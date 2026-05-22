const fs = require('fs');
let content = fs.readFileSync('src/components/CartView.tsx', 'utf8');

// Ensure useUIStore is imported
if (!content.includes('useUIStore')) {
  content = content.replace('import { useCartStore } from "../store/useCartStore";', 'import { useCartStore } from "../store/useCartStore";\nimport { useUIStore } from "../store/useUIStore";');
}

// Add showDialog destructuring
if (!content.includes('const { showDialog } = useUIStore();')) {
  content = content.replace('const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();', 'const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();\n  const { showDialog } = useUIStore();');
}

content = content.replace(/alert\((`[^`]+`|"[^"]+")\)/g, "showDialog({ title: 'Notice', message: $1 })");

fs.writeFileSync('src/components/CartView.tsx', content);
