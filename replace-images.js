const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'web');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.json')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(directoryPath);
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace "/images/" or "images/" where it's not already preceded by smarttechllc.am
    // We use a regex with negative lookbehind if supported, but simpler is to replace it generally
    // then fix up any double replacements.
    
    content = content.replace(/(["'])\/?images\//g, '$1https://www.smarttechllc.am/images/');
    content = content.replace(/url\(['"]?\/?images\//g, 'url(https://www.smarttechllc.am/images/');
    content = content.replace(/url\(['"]?https:\/\/smarttechllc\.am\/https:\/\/smarttechllc\.am\//g, 'url(https://smarttechllc.am/');
    content = content.replace(/https:\/\/smarttechllc\.am\/https:\/\/smarttechllc\.am\//g, 'https://smarttechllc.am/');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log("Updated: " + file);
    }
});

console.log(`Updated images in ${changedFiles} files.`);
