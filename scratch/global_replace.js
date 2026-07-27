const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  '../src/components/AdminPanel.js',
  '../src/app/HomeClient.js',
  '../src/app/products/ProductsClient.js',
  '../src/app/catalog/[slug]/page.js',
  '../src/app/product/[id]/page.js',
  '../src/lib/seedProducts.js'
];

filesToUpdate.forEach(relativePath => {
  const absolutePath = path.join(__dirname, relativePath);
  if (fs.existsSync(absolutePath)) {
    let content = fs.readFileSync(absolutePath, 'utf8');
    
    // Replace API routes
    content = content.replace(/\/api\/catalogs/g, '/api/categories');
    
    // Replace variables (case sensitive)
    content = content.replace(/catalogs/g, 'categories');
    content = content.replace(/Catalogs/g, 'Categories');
    content = content.replace(/catalogSlug/g, 'categorySlug');
    content = content.replace(/catalogName/g, 'categoryName');
    
    // Handle the word 'catalog' to 'category' (careful with exact matches so we don't break stuff)
    content = content.replace(/\bcatalog\b/g, 'category');
    content = content.replace(/\bCatalog\b/g, 'Category');

    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Updated ${relativePath}`);
  } else {
    console.warn(`File not found: ${absolutePath}`);
  }
});
