const fs = require("fs");
const path = require("path");

const teamPath = path.join(__dirname, "..", "src", "content", "team", "index.js");
const manifestPath = path.join(__dirname, "..", "src", "assets", "team", "certificates", "members", "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
let src = fs.readFileSync(teamPath, "utf8");

Object.keys(manifest).forEach(function (id) {
  const certs = manifest[id].map(function (c) {
    return '        { title: "' + c.title.replace(/"/g, '\\"') + '", image: "' + c.image + '" }';
  }).join(",\n");
  const re = new RegExp('(id: "' + id + '"[\\s\\S]*?certificates: \\[)[\\s\\S]*?(\\n      \\])');
  if (!re.test(src)) {
    console.error("Missing member:", id);
    process.exitCode = 1;
    return;
  }
  src = src.replace(re, "$1\n" + certs + "$2");
});

fs.writeFileSync(teamPath, src);
console.log("Updated", teamPath);
