const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const snapshotFile = path.resolve(rootDir, "src", "content", "published", "site-snapshot.json");
const emptyCms = { version: 1, updatedAt: null, collections: {} };
const emptyAlbum = { photos: [] };

function ensureDir() {
  fs.mkdirSync(path.dirname(snapshotFile), { recursive: true });
}

function readSnapshot() {
  try {
    if (!fs.existsSync(snapshotFile)) return null;
    return JSON.parse(fs.readFileSync(snapshotFile, "utf8"));
  } catch (error) {
    console.warn("Published CMS snapshot is invalid:", error && error.message);
    return null;
  }
}

function readCmsPayload() {
  const snapshot = readSnapshot();
  if (snapshot && snapshot.cms && typeof snapshot.cms === "object") {
    return snapshot.cms;
  }
  return emptyCms;
}

function readAlbumPayload() {
  const snapshot = readSnapshot();
  if (snapshot && snapshot.album && typeof snapshot.album === "object") {
    return snapshot.album;
  }
  return emptyAlbum;
}

function writeSnapshot(cmsPayload, albumPayload) {
  ensureDir();
  const snapshot = {
    publishedAt: new Date().toISOString(),
    cms: cmsPayload || emptyCms,
    album: albumPayload || emptyAlbum
  };
  fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
  return snapshot;
}

module.exports = {
  snapshotFile: snapshotFile,
  readSnapshot: readSnapshot,
  readCmsPayload: readCmsPayload,
  readAlbumPayload: readAlbumPayload,
  writeSnapshot: writeSnapshot
};
