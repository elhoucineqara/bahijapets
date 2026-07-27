const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, '../src/components/AdminPanel.js');
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Add subcategories to props
content = content.replace(
  /export default function AdminPanel\(\{ products, categories, onRefresh, theme, toggleTheme, initialTab = 'dashboard' \}\) \{/,
  "export default function AdminPanel({ products, categories, subcategories = [], onRefresh, theme, toggleTheme, initialTab = 'dashboard' }) {"
);

// 2. Add subcategorySlug to formData
content = content.replace(
  /categorySlug: '', \/\/ Linked category/,
  "categorySlug: '', \n    subcategorySlug: '',"
);

// 3. Update category form submit
content = content.replace(
  /const res = await fetch\('\/api\/categories', \{[\s\S]*?body: JSON\.stringify\(\{ name, description, parentSlug \}\)[\s\S]*?\}\);/,
  `const endpoint = parentSlug ? '/api/subcategories' : '/api/categories';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, parentSlug })
      });`
);

// 4. Update category delete
content = content.replace(
  /const res = await fetch\(`\/api\/categories\/\$\{id\}`\, \{[\s\S]*?method: 'DELETE',[\s\S]*?\}\);/,
  `
      const isSubcategory = subcategories.some(s => s.slug === id);
      const endpoint = isSubcategory ? \`/api/subcategories/\${id}\` : \`/api/categories/\${id}\`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });`
);

// 5. Update categories tab rendering (it was using categories.filter(c => !c.parentSlug) and c.parentSlug)
// Because we did a global replace, it now says categories.filter(c => !c.parentSlug). 
// Let's replace categories.filter(c => !c.parentSlug) with categories.
content = content.replace(/categories\.filter\(c => !c\.parentSlug\)\.forEach/g, 'categories.forEach');
content = content.replace(/categories\.filter\(c => c\.parentSlug === parent\.slug\)\.forEach/g, 'subcategories.filter(s => s.parentSlug === parent.slug).forEach');
content = content.replace(/categories\.filter\(c => c\.parentSlug && !categories\.find\(p => p\.slug === c\.parentSlug\)\)\.forEach/g, 'subcategories.filter(s => !categories.find(p => p.slug === s.parentSlug)).forEach');

content = content.replace(/categories\.filter\(c => !c\.parentSlug\)\.map/g, 'categories.map');
content = content.replace(/categories\.filter\(c => c\.parentSlug === parentCat\.slug\)\.map/g, 'subcategories.filter(s => s.parentSlug === parentCat.slug).map');

// 6. Fix "Existing Categories ({categories.length})" to include subcategories length
content = content.replace(
  /<h3>Existing Categories \(\{categories\.length\}\)<\/h3>/,
  '<h3>Existing Categories ({categories.length} / Subs: {subcategories.length})</h3>'
);

// 7. Update the map that displays all categories to display subcategories too.
// The list was: categories.map((cat, index) => ...
// I will replace it with a combined array.
content = content.replace(
  /\{categories\.map\(\(cat, index\) => \(/,
  '{[...categories, ...subcategories].map((cat, index) => ('
);
content = content.replace(
  /categories\.find\(c => c\.slug === cat\.parentSlug\)\?\.name/,
  'categories.find(c => c.slug === cat.parentSlug)?.name'
);

// 8. Add Subcategory select to Product Form
// Find category select and add subcategory after it.
const categorySelectCode = `
                        <option value="">Select a Category...</option>
                        {categories.map(c => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>`;
                    
const replaceSelects = `
                        <option value="">Select a Category...</option>
                        {categories.map(c => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Subcategory (Optional)</label>
                      <select 
                        name="subcategorySlug"
                        className="form-control"
                        value={formData.subcategorySlug || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a Subcategory...</option>
                        {subcategories.filter(s => s.parentSlug === formData.categorySlug).map(c => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>`;

content = content.replace(categorySelectCode, replaceSelects);

// 9. Update the initialization logic where default category is set
content = content.replace(
  /categorySlug: categories\[0\]\?\.slug \|\| '',/g,
  "categorySlug: categories[0]?.slug || '', subcategorySlug: '',"
);

content = content.replace(
  /categorySlug: product\.categorySlug \|\| '',/,
  "categorySlug: product.categorySlug || '', subcategorySlug: product.subcategorySlug || '',"
);

fs.writeFileSync(adminPath, content, 'utf8');
console.log('Updated AdminPanel.js');
