const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../src/app/api/categories');
const dest = path.join(__dirname, '../src/app/api/subcategories');

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    const elements = fs.readdirSync(from);
    for (const element of elements) {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isDirectory()) {
            copyFolderSync(fromPath, toPath);
        } else {
            fs.copyFileSync(fromPath, toPath);
        }
    }
}

if (fs.existsSync(src)) {
    copyFolderSync(src, dest);
    console.log("Copied categories to subcategories API");
}
