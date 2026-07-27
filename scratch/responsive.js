const fs = require('fs');
const path = require('path');

// 1. Update home.module.css
const homePath = path.join(__dirname, '../src/app/home.module.css');
let homeCss = fs.readFileSync(homePath, 'utf8');

// Update Grid configurations
homeCss = homeCss.replace(/minmax\(300px, 1fr\)/g, 'minmax(min(280px, 100%), 1fr)');
homeCss = homeCss.replace(/minmax\(250px, 1fr\)/g, 'minmax(min(220px, 100%), 1fr)');
homeCss = homeCss.replace(/minmax\(280px, 1fr\)/g, 'minmax(min(250px, 100%), 1fr)');
homeCss = homeCss.replace(/minmax\(200px, 1fr\)/g, 'minmax(min(180px, 100%), 1fr)');

fs.writeFileSync(homePath, homeCss, 'utf8');

// 2. Update globals.css
const globalsPath = path.join(__dirname, '../src/app/globals.css');
let globalsCss = fs.readFileSync(globalsPath, 'utf8');

// Ensure tables can overflow horizontally
if (!globalsCss.includes('.table-responsive')) {
  globalsCss += `\n
/* Responsive Tables */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .admin-card {
    padding: 16px;
  }
  .category-table-container {
    overflow-x: auto;
    width: 100%;
  }
  .products-table {
    min-width: 600px; /* Force scroll on small screens instead of crushing content */
  }
}
`;
}
fs.writeFileSync(globalsPath, globalsCss, 'utf8');

// 3. Update Navbar.module.css
const navPath = path.join(__dirname, '../src/components/Navbar.module.css');
let navCss = fs.readFileSync(navPath, 'utf8');
if (!navCss.includes('max-width: 576px')) {
  navCss += `\n
@media (max-width: 576px) {
  .navbar {
    flex-wrap: wrap;
    gap: 8px;
  }
  .navSearchBar {
    order: 3;
    width: 100%;
    margin-top: 8px;
  }
  .brandLogoImg {
    height: 48px; /* Slightly smaller on very small screens */
  }
  .brandName {
    font-size: 1.1rem;
  }
}
`;
}
fs.writeFileSync(navPath, navCss, 'utf8');

// 4. Update Footer.module.css
const footerPath = path.join(__dirname, '../src/components/Footer.module.css');
let footerCss = fs.readFileSync(footerPath, 'utf8');
if (!footerCss.includes('grid-template-columns: 1fr;')) {
  footerCss += `\n
@media (max-width: 992px) {
  .footerContent {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}

@media (max-width: 576px) {
  .footerContent {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .brandLogoImgFooter {
    height: 40px;
  }
}
`;
}
fs.writeFileSync(footerPath, footerCss, 'utf8');

console.log("Responsive CSS applied successfully.");
