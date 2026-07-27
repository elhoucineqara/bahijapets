const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, '../src/components/AdminPanel.js');
let content = fs.readFileSync(adminPath, 'utf8');

// Replace Category parentSlug select
content = content.replace(
  /<select[\s\n]*name="parentSlug"[\s\n]*value=\{catFormData\.parentSlug\}[\s\n]*onChange=\{handleCatInputChange\}[\s\n]*className="form-input"[\s\n]*style=\{\{.*?\}\}[\s\n]*>[\s\n]*<option value="">None \(Main Category\)<\/option>[\s\n]*\{categories\.map\(parentCat => \([\s\n]*<option key=\{parentCat\.slug\} value=\{parentCat\.slug\}>\{parentCat\.name\}<\/option>[\s\n]*\)\}[\s\n]*<\/select>/m,
  `<CustomSelect 
                    options={[
                      { value: '', label: 'None (Main Category)' },
                      ...categories.map(c => ({ value: c.slug, label: c.name }))
                    ]}
                    value={catFormData.parentSlug}
                    onChange={(val) => setCatFormData({ ...catFormData, parentSlug: val })}
                    className="form-input"
                  />`
);

// Replace Product categorySlug select
content = content.replace(
  /<select[\s\n]*name="categorySlug"[\s\n]*className="form-control"[\s\n]*value=\{formData\.categorySlug \|\| ''\}[\s\n]*onChange=\{handleInputChange\}[\s\n]*>[\s\n]*<option value="">Select a Category\.\.\.<\/option>[\s\n]*\{categories\.map\(c => \([\s\n]*<option key=\{c\.slug\} value=\{c\.slug\}>\{c\.name\}<\/option>[\s\n]*\)\}[\s\n]*<\/select>/m,
  `<CustomSelect 
                        options={[
                          { value: '', label: 'Select a Category...' },
                          ...categories.map(c => ({ value: c.slug, label: c.name }))
                        ]}
                        value={formData.categorySlug || ''}
                        onChange={(val) => setFormData({ ...formData, categorySlug: val })}
                      />`
);

// Replace Product subcategorySlug select
content = content.replace(
  /<select[\s\n]*name="subcategorySlug"[\s\n]*className="form-control"[\s\n]*value=\{formData\.subcategorySlug \|\| ''\}[\s\n]*onChange=\{handleInputChange\}[\s\n]*>[\s\n]*<option value="">Select a Subcategory\.\.\.<\/option>[\s\n]*\{subcategories\.filter\(s => s\.parentSlug === formData\.categorySlug\)\.map\(c => \([\s\n]*<option key=\{c\.slug\} value=\{c\.slug\}>\{c\.name\}<\/option>[\s\n]*\)\}[\s\n]*<\/select>/m,
  `<CustomSelect 
                        options={[
                          { value: '', label: 'Select a Subcategory...' },
                          ...subcategories.filter(s => s.parentSlug === formData.categorySlug).map(c => ({ value: c.slug, label: c.name }))
                        ]}
                        value={formData.subcategorySlug || ''}
                        onChange={(val) => setFormData({ ...formData, subcategorySlug: val })}
                      />`
);

fs.writeFileSync(adminPath, content, 'utf8');
console.log("Updated AdminPanel.js selects");
