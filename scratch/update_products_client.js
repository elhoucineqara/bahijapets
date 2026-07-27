const fs = require('fs');
const path = require('path');

const clientPath = path.join(__dirname, '../src/app/products/ProductsClient.js');
let content = fs.readFileSync(clientPath, 'utf8');

// Update props
content = content.replace(
  /export default function ProductsClient\(\{ initialProducts, categories \}\) \{/,
  "export default function ProductsClient({ initialProducts, categories = [], subcategories = [] }) {"
);

// Update rendering of the categories menu
// Before:
// categories.filter(c => !c.parentSlug).map(parentCat => (
// ...
// categories.filter(c => c.parentSlug === parentCat.slug).map(subCat => (

content = content.replace(/categories\.filter\(c => !c\.parentSlug\)/g, 'categories');
content = content.replace(/categories\.filter\(c => c\.parentSlug === parentCat\.slug\)/g, 'subcategories.filter(s => s.parentSlug === parentCat.slug)');
content = content.replace(/categories\.filter\(c => c\.parentSlug && !categories\.find\(p => p\.slug === c\.parentSlug\)\)/g, 'subcategories.filter(s => !categories.find(p => p.slug === s.parentSlug))');

fs.writeFileSync(clientPath, content, 'utf8');
console.log('Updated ProductsClient.js');
