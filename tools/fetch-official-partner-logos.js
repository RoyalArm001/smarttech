const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const rootDir = path.resolve(__dirname, "..");
const outDir = path.join(rootDir, "img", "partners", "technology");
const userAgent = "SmartTechLogoFetcher/1.0 (https://smarttechllc.am; support@smarttechllc.am)";

const highResThumbs = {
  "asus.png": null,
  "hp.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/1280px-HP_logo_2012.svg.png",
  "dell.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Dell_logo_2016.svg/1280px-Dell_logo_2016.svg.png",
  "lenovo.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/1280px-Lenovo_logo_2015.svg.png",
  "intel.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/1280px-Intel_logo_%282006-2020%29.svg.png",
  "amd.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/1280px-AMD_Logo.svg.png",
  "samsung.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Samsung_logo_wordmark.svg/1280px-Samsung_logo_wordmark.svg.png",
  "acer.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/1280px-Acer_2011.svg.png",
  "lg.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/LG_Electronics_Logo_%28modern%29.svg/1280px-LG_Electronics_Logo_%28modern%29.svg.png",
  "synology.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Synology_Logo.svg/1280px-Synology_Logo.svg.png",
  "qnap.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Qnap_Logo_2004.svg/1280px-Qnap_Logo_2004.svg.png",
  "supermicro.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Super_Micro_Computer_Logo.svg/1280px-Super_Micro_Computer_Logo.svg.png"
};

const directPng = {
  "asus.png": "https://upload.wikimedia.org/wikipedia/commons/d/de/AsusTek-black-logo.png",
  "apc.png": "https://upload.wikimedia.org/wikipedia/commons/e/e8/APC_by_Schneider_Electric.png",
  "msi.png": "https://www.msi.com/images/logo.png",
  "akuvox.png": "https://www.akuvox.com/images/logo.png",
  "2n.png": "https://upload.wikimedia.org/wikipedia/commons/f/fb/2N_logo.png",
  "jbl.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/JBL_logo.svg/1280px-JBL_logo.svg.png"
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": userAgent }
  });
  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function savePng(fileName, buffer) {
  const target = path.join(outDir, fileName);
  const temp = target + ".tmp";
  await sharp(buffer)
    .resize({ width: 520, height: 200, fit: "inside", withoutEnlargement: false })
    .png()
    .toFile(temp);
  fs.renameSync(temp, target);
}

async function recolorBlackToBlue(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] < 20) continue;
    if (data[i] < 40 && data[i + 1] < 40 && data[i + 2] < 40) {
      data[i] = 0;
      data[i + 1] = 83;
      data[i + 2] = 155;
    }
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels }
  }).png().toFile(filePath + ".tmp");
  fs.renameSync(filePath + ".tmp", filePath);
}

async function recolorWhiteToRed(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] < 20) continue;
    if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
      data[i] = 230;
      data[i + 1] = 0;
      data[i + 2] = 18;
    }
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels }
  }).png().toFile(filePath + ".tmp");
  fs.renameSync(filePath + ".tmp", filePath);
}

async function downloadOne(fileName, url) {
  const buffer = await fetchBuffer(url);
  await savePng(fileName, buffer);
  const target = path.join(outDir, fileName);
  if (fileName === "asus.png") await recolorBlackToBlue(target);
  if (fileName === "msi.png") await recolorWhiteToRed(target);
  console.log("OK:", fileName);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  fs.readdirSync(outDir)
    .filter((name) => name.endsWith(".svg") || name.startsWith("t-") || name.endsWith("-test.png"))
    .forEach((name) => fs.unlinkSync(path.join(outDir, name)));

  for (const [fileName, url] of Object.entries(directPng)) {
    try {
      await downloadOne(fileName, url);
    } catch (error) {
      console.error("FAIL:", fileName, error.message);
    }
    await sleep(1400);
  }

  for (const [fileName, url] of Object.entries(highResThumbs)) {
    if (!url) continue;
    try {
      await downloadOne(fileName, url);
    } catch (error) {
      console.error("FAIL:", fileName, error.message);
    }
    await sleep(1400);
  }

  console.log("Finished official partner logo refresh.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
