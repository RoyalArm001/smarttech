const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const rootDir = path.resolve(__dirname, "..");
const outDir = path.join(rootDir, "img", "partners", "technology");

const generatedLogos = {
  "asus.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 96"><text x="0" y="68" font-family="Arial, sans-serif" font-size="64" font-weight="800" font-style="italic" fill="#00529b">ASUS</text></svg>',
  "hp.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="58" fill="#0096d6"/><text x="64" y="78" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="800" font-style="italic" fill="#ffffff">hp</text></svg>',
  "dell.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#007db8">DELL</text></svg>',
  "lenovo.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#e2231a">Lenovo</text></svg>',
  "msi.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="68" font-weight="900" fill="#ff0000">msi</text></svg>',
  "intel.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#0071c5">intel</text></svg>',
  "amd.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#ed1c24">AMD</text></svg>',
  "samsung.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="58" font-weight="800" fill="#1428a0">SAMSUNG</text></svg>',
  "acer.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#83b81a">acer</text></svg>',
  "lg.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 96"><circle cx="42" cy="48" r="34" fill="none" stroke="#a50034" stroke-width="8"/><text x="78" y="66" font-family="Arial, sans-serif" font-size="48" font-weight="800" fill="#6b6b6b">LG</text></svg>',
  "apc.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#009530">APC</text></svg>',
  "synology.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="#2f6db5">Synology</text></svg>',
  "qnap.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="#0e4f8b">QNAP</text></svg>',
  "supermicro.png": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 96"><text x="0" y="72" font-family="Arial, sans-serif" font-size="52" font-weight="800" fill="#00539b">Supermicro</text></svg>'
};

const fixBlackBackground = [
  "akuvox.png",
  "jbl.png",
  "2n.png",
  "paradox.png"
];

async function writeGeneratedLogo(fileName, markup) {
  const target = path.join(outDir, fileName);
  const temp = target + ".tmp";
  await sharp(Buffer.from(markup), { density: 220 })
    .resize({ width: 420, height: 160, fit: "inside" })
    .png()
    .toFile(temp);
  fs.renameSync(temp, target);
  await stripNearBlackBackground(fileName);
  console.log("Generated PNG:", fileName);
}

async function stripNearBlackBackground(fileName) {
  const target = path.join(outDir, fileName);
  if (!fs.existsSync(target)) {
    console.warn("Missing:", fileName);
    return;
  }

  const image = sharp(target).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 72 && g < 72 && b < 72) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels
    }
  })
    .png()
    .toFile(target + ".tmp");

  fs.renameSync(target + ".tmp", target);
  console.log("Fixed background:", fileName);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const fileName of fixBlackBackground) {
    await stripNearBlackBackground(fileName);
  }

  for (const [fileName, markup] of Object.entries(generatedLogos)) {
    await writeGeneratedLogo(fileName, markup);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
