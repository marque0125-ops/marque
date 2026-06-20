const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

// The regex will match `id: "p1"`, `"id": "p2"`, etc.
let idMatch = /(["']?)id\1\s*:\s*["']p(\d+)["']/g;

let count = 0;
let newContent = content.replace(idMatch, (match, quote, num) => {
    count++;
    return `${quote || ''}id${quote || ''}: "p${count}"`;
});

// Update variants
let vCount = 0;
newContent = newContent.replace(/(["']?)id\1\s*:\s*["']v\d+-1["']/g, (match, quote) => {
    vCount++;
    return `${quote || ''}id${quote || ''}: "v${vCount}-1"`;
});

// Update SKUs
let skuCount = 0;
newContent = newContent.replace(/(["']?)sku\1\s*:\s*["']SKU-\d+["']/g, (match, quote) => {
    skuCount++;
    return `${quote || ''}sku${quote || ''}: "SKU-${skuCount}"`;
});

// Update SKU-STDs
let skuStdCount = 0;
newContent = newContent.replace(/(["']?)sku\1\s*:\s*["']SKU-\d+-STD["']/g, (match, quote) => {
    skuStdCount++;
    return `${quote || ''}sku${quote || ''}: "SKU-${skuStdCount}-STD"`;
});

fs.writeFileSync('src/data/mockData.ts', newContent);
console.log('Fixed IDs. Products:', count, 'Variants:', vCount);
