const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  '../src/app/api/subcategories/route.js',
  '../src/app/api/subcategories/[id]/route.js'
];

filesToUpdate.forEach(relativePath => {
  const absolutePath = path.join(__dirname, relativePath);
  if (fs.existsSync(absolutePath)) {
    let content = fs.readFileSync(absolutePath, 'utf8');
    
    // Replace collection names and variable names
    content = content.replace(/categories/g, 'subcategories');
    content = content.replace(/Categories/g, 'Subcategories');
    content = content.replace(/category/g, 'subcategory');
    content = content.replace(/Category/g, 'Subcategory');
    
    // We don't want to delete subcategories when a subcategory is deleted (that logic was for parent categories)
    if (relativePath.includes('[id]')) {
      content = content.replace(/\/\/ Also delete any subcategories of this category[\s\S]*?await db\.collection\("subcategories"\)\.deleteMany\({ parentSlug: id }\);/, '');
    }

    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Updated ${relativePath}`);
  } else {
    console.warn(`File not found: ${absolutePath}`);
  }
});

// Also let's clean up api/categories since it should no longer delete subcategories (they are in a different collection now)
const catRouteId = path.join(__dirname, '../src/app/api/categories/[id]/route.js');
if (fs.existsSync(catRouteId)) {
  let content = fs.readFileSync(catRouteId, 'utf8');
  content = content.replace(/await db\.collection\("categories"\)\.deleteMany\(\{ parentSlug: id \}\);/, 'await db.collection("subcategories").deleteMany({ parentSlug: id });');
  fs.writeFileSync(catRouteId, content, 'utf8');
  console.log('Updated categories/[id] deletion logic.');
}

