const fs = require('fs');

function processFile(path, replaces) {
  let content = fs.readFileSync(path, 'utf8');

  // Add useUIStore import if missing
  if (!content.includes('useUIStore')) {
    content = content.replace(/(import .* from ['"]..\/..\/store\/.*['"];)/, "$1\nimport { useUIStore } from \"../../store/useUIStore\";");
  }

  // Inject showDialog into the main component
  const compMatch = content.match(/export function (\w+)\(\) {/);
  if (compMatch && !content.includes('showDialog')) {
    content = content.replace(/(export function \w+\(\) {)/, "$1\n  const { showDialog } = useUIStore();");
  }

  // Apply replaces
  replaces.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  fs.writeFileSync(path, content);
}

// 1. InventoryTab
processFile('src/components/admin/InventoryTab.tsx', [
  {
    from: /alert\("Failed to upload images. Please try again."\);/,
    to: "showDialog({ title: 'Upload Failed', message: 'Failed to upload images. Please try again.' });"
  },
  {
    from: /alert\("Failed to upload video. Please try again."\);/,
    to: "showDialog({ title: 'Upload Failed', message: 'Failed to upload video. Please try again.' });"
  },
  {
    from: /alert\("Failed to upload image. Please try again."\);/,
    to: "showDialog({ title: 'Upload Failed', message: 'Failed to upload image. Please try again.' });"
  },
  {
    from: /if \(!formName \|\| !formSku \|\| formPrice <= 0\) return alert\("Please fill in Name, SKU, and a valid Price."\);/,
    to: "if (!formName || !formSku || formPrice <= 0) return showDialog({ title: 'Validation Error', message: 'Please fill in Name, SKU, and a valid Price.' });"
  },
  {
    from: /if \(isEdit\) \{ updateProduct\(productData\); alert\(`Success: \$\{formName\} updated!`\); \}/,
    to: "if (isEdit) { updateProduct(productData); showDialog({ title: 'Success', message: `Success: ${formName} updated!` }); }"
  },
  {
    from: /else \{ addProduct\(productData\); alert\(`Success: \$\{formName\} added!`\); \}/,
    to: "else { addProduct(productData); showDialog({ title: 'Success', message: `Success: ${formName} added!` }); }"
  },
  {
    from: /if \(confirm\(`CRITICAL DELETION: Remove \$\{name\}\?`\)\) \{ deleteProduct\(id\); alert\(`Deleted \$\{name\}.`\); \}/,
    to: `showDialog({ type: 'confirm', title: 'Delete Product', message: \`CRITICAL DELETION: Remove \${name}?\`, onConfirm: () => { deleteProduct(id); showDialog({ title: 'Success', message: \`Deleted \${name}.\` }); } });`
  }
]);

// 2. CategoriesTab
processFile('src/components/admin/CategoriesTab.tsx', [
  {
    from: /alert\("Failed to upload image. Please try again."\);/,
    to: "showDialog({ title: 'Upload Failed', message: 'Failed to upload image. Please try again.' });"
  },
  {
    from: /if \(!formId \|\| !formName \|\| !formImage\) return alert\("Please fill in all fields."\);/,
    to: "if (!formId || !formName || !formImage) return showDialog({ title: 'Validation Error', message: 'Please fill in all fields.' });"
  },
  {
    from: /return alert\("A category with this ID already exists."\);/,
    to: "return showDialog({ title: 'Error', message: 'A category with this ID already exists.' });"
  },
  {
    from: /alert\(`Success: \$\{formName\} category updated!`\);/,
    to: "showDialog({ title: 'Success', message: `Success: ${formName} category updated!` });"
  },
  {
    from: /alert\(`Success: \$\{formName\} category added!`\);/,
    to: "showDialog({ title: 'Success', message: `Success: ${formName} category added!` });"
  },
  {
    from: /alert\(`Cannot delete \$\{name\}. There are \$\{activeProducts\.length\} product\(s\) assigned to this category. Reassign them first.`\);/,
    to: "showDialog({ title: 'Cannot Delete', message: `Cannot delete ${name}. There are ${activeProducts.length} product(s) assigned to this category. Reassign them first.` });"
  },
  {
    from: /if \(confirm\(`CRITICAL DELETION: Remove Category "\\\$\{name\}"\?`\)\) \{\n      deleteCategory\(id\);\n      alert\(`Deleted \$\{name\}.`\);\n    \}/,
    to: "showDialog({ type: 'confirm', title: 'Delete Category', message: `CRITICAL DELETION: Remove Category \"${name}\"?`, onConfirm: () => { deleteCategory(id); showDialog({ title: 'Success', message: `Deleted ${name}.` }); } });"
  }
]);

// 3. BlogTab
processFile('src/components/admin/BlogTab.tsx', [
  {
    from: /alert\("Failed to upload image. Please try again."\);/,
    to: "showDialog({ title: 'Upload Failed', message: 'Failed to upload image. Please try again.' });"
  },
  {
    from: /alert\("Please fill all required fields \(Title, Content, Category\)"\);/,
    to: "showDialog({ title: 'Validation Error', message: 'Please fill all required fields (Title, Content, Category)' });"
  },
  {
    from: /if \(confirm\("Are you sure you want to delete this article\?"\)\) \{\n      deleteArticle\(id\);\n    \}/,
    to: "showDialog({ type: 'confirm', title: 'Delete Article', message: 'Are you sure you want to delete this article?', onConfirm: () => deleteArticle(id) });"
  }
]);

// 4. BannersTab
processFile('src/components/admin/BannersTab.tsx', [
  {
    from: /alert\("Failed to upload image. Please try again."\);/,
    to: "showDialog({ title: 'Upload Failed', message: 'Failed to upload image. Please try again.' });"
  },
  {
    from: /alert\("Please provide an image."\);/,
    to: "showDialog({ title: 'Validation Error', message: 'Please provide an image.' });"
  },
  {
    from: /alert\(`Banner \$\{isEditing \? 'updated' : 'added'\} successfully!`\);/,
    to: "showDialog({ title: 'Success', message: `Banner ${isEditing ? 'updated' : 'added'} successfully!` });"
  },
  {
    from: /if \(confirm\("Are you sure you want to remove this banner slide\?"\)\) \{\n      removeHeroBanner\(id\);\n    \}/,
    to: "showDialog({ type: 'confirm', title: 'Remove Banner', message: 'Are you sure you want to remove this banner slide?', onConfirm: () => removeHeroBanner(id) });"
  }
]);

// 5. AnalyticsTab
processFile('src/components/admin/AnalyticsTab.tsx', [
  {
    from: /alert\("Announcement ticker text cannot be empty!"\);/,
    to: "showDialog({ title: 'Validation Error', message: 'Announcement ticker text cannot be empty!' });"
  },
  {
    from: /alert\("Ticker content broadcasted successfully! Marquee updated on all pages."\);/,
    to: "showDialog({ title: 'Success', message: 'Ticker content broadcasted successfully! Marquee updated on all pages.' });"
  }
]);

console.log("Replacements complete!");
