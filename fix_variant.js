const fs = require('fs');
let code = fs.readFileSync('src/components/admin/InventoryTab.tsx', 'utf8');

// 1. Fix handleAddVariant
code = code.replace(
  `  const handleAddVariant = () => {
    if (!newVarColor && !newVarBattery) return;
    const newV = {
      id: \`var-\${Date.now()}\`, name: \`\${newVarColor} (\${newVarBattery})\`,
      sku: \`\${formSku}-\${newVarColor.toUpperCase()}-\${newVarBattery.replace(/\\s+/g, "").toUpperCase()}\`,
      stockQty: newVarStock, attributes: { color: newVarColor, battery: newVarBattery }, imageUrl: newVarImageUrl
    };
    setFormVariants([...formVariants, newV]);
  };`,
  `  const handleAddVariant = () => {
    if (!newVarColor && !newVarBattery) return;
    const newV = {
      id: \`var-\${Date.now()}\`, name: \`\${newVarColor} (\${newVarBattery})\`,
      sku: \`\${formSku}-\${newVarColor.toUpperCase()}-\${newVarBattery.replace(/\\s+/g, "").toUpperCase()}\`,
      stockQty: newVarStock, attributes: { color: newVarColor, battery: newVarBattery }, imageUrl: newVarImageUrl
    };
    setFormVariants([...formVariants, newV]);
    setNewVarColor("");
    setNewVarBattery("");
    setNewVarImageUrl("");
    setNewVarStock(10);
    const fileInput = document.getElementById('variant-file-input');
    if (fileInput) fileInput.value = '';
  };`
);

// 2. Add id="variant-file-input" to the file input
code = code.replace(
  `<input\n                    type="file"\n                    accept="image/*"\n                    onChange={handleVariantImageUpload}`,
  `<input\n                    id="variant-file-input"\n                    type="file"\n                    accept="image/*"\n                    onChange={handleVariantImageUpload}`
);

// 3. Fix the "Image Loaded" logic
code = code.replace(
  `{newVarImageUrl && newVarImageUrl.startsWith("data:image") && (
                    <span className="text-[10px] text-brand-orange font-bold uppercase">Image Loaded</span>
                  )}`,
  `{newVarImageUrl && (
                    <span className="text-[10px] text-brand-orange font-bold uppercase shrink-0">Image Loaded</span>
                  )}`
);

// 4. Add the image thumbnail to the mapped variants list
code = code.replace(
  `<div><span className="font-bold text-white block">{v.name}</span><span className="text-[8px] text-brand-orange">Stock: {v.stockQty}</span></div>`,
  `<div className="flex items-center gap-3">
                      {v.imageUrl && (
                        <img src={v.imageUrl} alt={v.name} className="w-8 h-8 object-cover rounded border border-brand-border" />
                      )}
                      <div>
                        <span className="font-bold text-white block text-xs">{v.name}</span>
                        <span className="text-[9px] text-brand-orange uppercase font-bold tracking-wider">Stock: {v.stockQty}</span>
                      </div>
                    </div>`
);

// 5. Update the parent div class for the variant list item
code = code.replace(
  `className="p-2 border border-brand-border bg-slate-900 flex justify-between rounded"`,
  `className="p-2 border border-brand-border bg-slate-900 flex items-center justify-between rounded"`
);

// 6. Update the Trash button inside the variant map
code = code.replace(
  `className="text-red-500"><Trash2 className="h-3 w-3" /></button>`,
  `className="text-red-500 hover:text-red-400 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>`
);

fs.writeFileSync('src/components/admin/InventoryTab.tsx', code);
console.log("Fix complete");
