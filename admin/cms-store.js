const fs = require("fs");
const path = require("path");

const isVercel = Boolean(process.env.VERCEL);
const configuredDataRoot = process.env.SMARTTECH_CMS_DATA_DIR || process.env.CMS_DATA_DIR || "";
const localDataRoot = configuredDataRoot
  ? path.resolve(configuredDataRoot)
  : path.resolve(__dirname, "data");
const runtimeDataRoot = isVercel
  ? path.join("/tmp", "smarttech-admin-data")
  : localDataRoot;

const cmsDir = path.join(runtimeDataRoot, "cms");
const bundledCmsDir = path.join(localDataRoot, "cms");
const manifestFile = path.join(cmsDir, "manifest.json");
const bundledManifestFile = path.join(bundledCmsDir, "manifest.json");

const COLLECTIONS = {
  contacts: {
    id: "contacts",
    label: "Contacts",
    labelHy: "Կապ",
    description: "Email, phones, address and social links shown across the site.",
    merge: "object",
    maxBytes: 14000
  },
  company: {
    id: "company",
    label: "Company",
    labelHy: "Ընկերություն",
    description: "Hero texts, tagline, stats and about blocks on the homepage.",
    merge: "object",
    maxBytes: 48000
  },
  services: {
    id: "services",
    label: "Services",
    labelHy: "Ծառայություններ",
    description: "Partial updates by service id (title, lead, tags, image paths).",
    merge: "arrayById",
    idField: "id",
    maxBytes: 220000
  },
  projects: {
    id: "projects",
    label: "Projects",
    labelHy: "Նախագծեր",
    description: "Partial updates by project id (title, works, images, status).",
    merge: "arrayById",
    idField: "id",
    maxBytes: 320000
  },
  projectSettings: {
    id: "projectSettings",
    label: "Project settings",
    labelHy: "Project settings",
    description: "Featured project, active project order and completed gallery images.",
    merge: "object",
    maxBytes: 24000
  },
  team: {
    id: "team",
    label: "Team",
    labelHy: "Team",
    description: "Partial updates by team member id, including titles, bios, images and certificates.",
    merge: "arrayById",
    idField: "id",
    maxBytes: 420000
  },
  partners: {
    id: "partners",
    label: "Partners",
    labelHy: "Partners",
    description: "Client and technology partner logo lists.",
    merge: "object",
    maxBytes: 180000
  },
  navigation: {
    id: "navigation",
    label: "Navigation",
    labelHy: "Navigation",
    description: "Top navigation items and optional child links.",
    merge: "replace",
    maxBytes: 64000
  },
  seoLandings: {
    id: "seoLandings",
    label: "SEO landing pages",
    labelHy: "SEO landing pages",
    description: "SEO landing page content used by landing routes.",
    merge: "replace",
    maxBytes: 520000
  },
  seoArticles: {
    id: "seoArticles",
    label: "Blog articles",
    labelHy: "Blog articles",
    description: "Blog article metadata and article body sections.",
    merge: "replace",
    maxBytes: 640000
  },
  locales: {
    id: "locales",
    label: "Translations",
    labelHy: "Թարգմանություններ",
    description: "Deep partial updates for hy / en / ru locale dictionaries.",
    merge: "deepLocales",
    maxBytes: 520000
  }
};

function ensureCmsDir() {
  try {
    fs.mkdirSync(cmsDir, { recursive: true });
    return true;
  } catch (error) {
    if (error && (error.code === "EROFS" || error.code === "EACCES")) {
      return false;
    }
    throw error;
  }
}

function collectionFile(id) {
  const meta = COLLECTIONS[id];
  if (!meta) {
    const error = new Error("Unknown CMS collection");
    error.statusCode = 404;
    throw error;
  }
  return path.join(cmsDir, id + ".json");
}

function collectionReadPath(id) {
  collectionFile(id);
  const runtimePath = path.join(cmsDir, id + ".json");
  const bundledPath = path.join(bundledCmsDir, id + ".json");
  if (fs.existsSync(runtimePath)) return runtimePath;
  if (fs.existsSync(bundledPath)) return bundledPath;
  return null;
}

function readManifest() {
  const manifestPath = fs.existsSync(manifestFile)
    ? manifestFile
    : (fs.existsSync(bundledManifestFile) ? bundledManifestFile : null);

  if (!manifestPath) {
    return { version: 1, collections: {} };
  }

  const manifest = readJsonFile(manifestPath, { version: 1, collections: {} });
  manifest.version = 1;
  manifest.collections = manifest.collections && typeof manifest.collections === "object"
    ? manifest.collections
    : {};
  return manifest;
}

function writeManifest(collectionsPatch) {
  const manifest = readManifest();
  manifest.updatedAt = new Date().toISOString();
  manifest.collections = Object.assign({}, manifest.collections, collectionsPatch || {});
  writeJsonFile(manifestFile, manifest);
  return manifest;
}

function readJsonFile(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch (error) {
    console.warn("Invalid CMS JSON file:", path.basename(filePath), error && error.message);
    return fallback;
  }
}

function writeJsonFile(filePath, payload) {
  if (!ensureCmsDir()) {
    const error = new Error("CMS storage is read-only in this environment");
    error.statusCode = 503;
    throw error;
  }
  const tempPath = filePath + "." + process.pid + ".tmp";
  fs.writeFileSync(tempPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  fs.renameSync(tempPath, filePath);
}

function cleanText(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function cleanUrl(value, maxLength) {
  const text = cleanText(value, maxLength);
  if (!text) return "";
  if (/^(https?:\/\/|mailto:|tel:|whatsapp:|viber:)/i.test(text)) return text;
  if (/^\/[^\s]*$/.test(text)) return text;
  if (/^#[^\s]*$/.test(text)) return text;
  return "";
}

function deepMerge(target, source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return source;
  }

  const output = Object.assign({}, target && typeof target === "object" && !Array.isArray(target) ? target : {});
  Object.keys(source).forEach(function (key) {
    const next = source[key];
    if (next && typeof next === "object" && !Array.isArray(next) &&
      output[key] && typeof output[key] === "object" && !Array.isArray(output[key])) {
      output[key] = deepMerge(output[key], next);
    } else if (next !== undefined) {
      output[key] = next;
    }
  });
  return output;
}

function mergeArrayById(baseArray, patches, idField) {
  if (!Array.isArray(patches) || !patches.length) {
    return Array.isArray(baseArray) ? baseArray : [];
  }

  const base = Array.isArray(baseArray) ? baseArray : [];
  const byId = {};
  base.forEach(function (item) {
    if (item && item[idField]) byId[item[idField]] = item;
  });

  patches.forEach(function (patch) {
    if (!patch || !patch[idField]) return;
    byId[patch[idField]] = deepMerge(byId[patch[idField]] || { id: patch[idField] }, patch);
  });

  const seen = {};
  const merged = base.map(function (item) {
    seen[item[idField]] = true;
    return byId[item[idField]] || item;
  });

  patches.forEach(function (patch) {
    if (patch && patch[idField] && !seen[patch[idField]]) {
      merged.push(byId[patch[idField]]);
    }
  });

  return merged;
}

function sanitizeContacts(input) {
  const source = input && typeof input === "object" ? input : {};
  const phones = Array.isArray(source.phones) ? source.phones.slice(0, 8).map(function (phone) {
    return {
      label: cleanText(phone && phone.label, 80),
      number: cleanText(phone && phone.number, 40)
    };
  }).filter(function (phone) {
    return phone.number;
  }) : undefined;

  const socials = Array.isArray(source.socials) ? source.socials.slice(0, 16).map(function (social) {
    return {
      label: cleanText(social && social.label, 60),
      href: cleanUrl(social && social.href, 240)
    };
  }).filter(function (social) {
    return social.href;
  }) : undefined;

  const output = {};
  if (source.email != null) output.email = cleanText(source.email, 120);
  if (source.address != null) output.address = cleanText(source.address, 180);
  if (source.addressHy != null) output.addressHy = cleanText(source.addressHy, 180);
  if (phones && phones.length) output.phones = phones;
  if (socials && socials.length) output.socials = socials;
  if (source.map && typeof source.map === "object") {
    const lat = Number(source.map.lat);
    const lng = Number(source.map.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      output.map = { lat: lat, lng: lng };
    }
  }
  return output;
}

function sanitizeCompany(input) {
  const source = input && typeof input === "object" ? input : {};
  const output = {};
  const textFields = [
    "name", "legalName", "description", "tagline", "heroTitle", "heroLead", "aboutTitle"
  ];
  textFields.forEach(function (key) {
    if (source[key] != null) output[key] = cleanText(source[key], key === "heroLead" ? 600 : 220);
  });

  if (Array.isArray(source.heroImages)) {
    output.heroImages = source.heroImages.slice(0, 6).map(function (item) {
      return cleanUrl(item, 240);
    }).filter(Boolean);
  }

  if (Array.isArray(source.stats)) {
    output.stats = source.stats.slice(0, 8).map(function (item) {
      return {
        value: cleanText(item && item.value, 40),
        label: cleanText(item && item.label, 120)
      };
    }).filter(function (item) {
      return item.value || item.label;
    });
  }

  if (Array.isArray(source.about)) {
    output.about = source.about.slice(0, 8).map(function (item) {
      return cleanText(item, 900);
    }).filter(Boolean);
  }

  if (Array.isArray(source.values)) {
    output.values = source.values.slice(0, 8).map(function (item) {
      return {
        title: cleanText(item && item.title, 120),
        text: cleanText(item && item.text, 500)
      };
    }).filter(function (item) {
      return item.title || item.text;
    });
  }

  return output;
}

function sanitizeStringArray(value, maxItems, maxItemLength) {
  if (!Array.isArray(value)) return undefined;
  return value.slice(0, maxItems).map(function (item) {
    return cleanText(item, maxItemLength);
  }).filter(Boolean);
}

function sanitizeServicePatch(item) {
  if (!item || !item.id) return null;
  const output = { id: cleanText(item.id, 80) };
  if (item.title != null) output.title = cleanText(item.title, 180);
  if (item.lead != null) output.lead = cleanText(item.lead, 900);
  if (item.image != null) output.image = cleanUrl(item.image, 240);
  const tags = sanitizeStringArray(item.tags, 12, 80);
  if (tags && tags.length) output.tags = tags;
  const gallery = sanitizeStringArray(item.gallery, 12, 240);
  if (gallery && gallery.length) output.gallery = gallery;
  return output.id ? output : null;
}

function sanitizeProjectPatch(item) {
  if (!item || !item.id) return null;
  const output = { id: cleanText(item.id, 80) };
  if (item.title != null) output.title = cleanText(item.title, 180);
  const works = sanitizeStringArray(item.works, 16, 220);
  if (works && works.length) output.works = works;
  const images = sanitizeStringArray(item.images, 16, 240);
  if (images && images.length) output.images = images;
  if (item.status != null && (item.status === "current" || item.status === "completed")) {
    output.status = item.status;
  }
  if (item.translations && typeof item.translations === "object") {
    output.translations = {};
    ["en", "ru"].forEach(function (lang) {
      if (!item.translations[lang]) return;
      output.translations[lang] = {
        title: cleanText(item.translations[lang].title, 180),
        works: sanitizeStringArray(item.translations[lang].works, 16, 220)
      };
    });
  }
  return output.id ? output : null;
}

function sanitizeServices(input) {
  if (!Array.isArray(input)) return [];
  return input.map(sanitizeServicePatch).filter(Boolean).slice(0, 80);
}

function sanitizeProjects(input) {
  if (!Array.isArray(input)) return [];
  return input.map(sanitizeProjectPatch).filter(Boolean).slice(0, 120);
}

function sanitizeProjectSettings(input) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const output = {};
  if (source.featuredProjectId != null) {
    output.featuredProjectId = cleanText(source.featuredProjectId, 80);
  }
  const activeProjectIds = sanitizeStringArray(source.activeProjectIds, 80, 80);
  if (activeProjectIds && activeProjectIds.length) output.activeProjectIds = activeProjectIds;
  if (Array.isArray(source.completedGallery)) {
    output.completedGallery = source.completedGallery.slice(0, 40).map(function (item) {
      return cleanUrl(item, 240);
    }).filter(Boolean);
  }
  return output;
}

function sanitizeJsonValue(value, options, depth) {
  const config = Object.assign({
    maxDepth: 8,
    maxArrayItems: 160,
    maxObjectKeys: 120,
    maxStringLength: 1800
  }, options || {});
  const level = depth || 0;

  if (value == null || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") return cleanText(value, config.maxStringLength);
  if (level >= config.maxDepth) return Array.isArray(value) ? [] : {};

  if (Array.isArray(value)) {
    return value.slice(0, config.maxArrayItems).map(function (item) {
      return sanitizeJsonValue(item, config, level + 1);
    });
  }

  if (typeof value === "object") {
    const output = {};
    Object.keys(value).slice(0, config.maxObjectKeys).forEach(function (key) {
      const cleanKey = cleanText(key, 80);
      if (!cleanKey || cleanKey === "__proto__" || cleanKey === "constructor" || cleanKey === "prototype") return;
      output[cleanKey] = sanitizeJsonValue(value[key], config, level + 1);
    });
    return output;
  }

  return null;
}

function sanitizeTeamPatch(item) {
  const output = sanitizeJsonValue(item, {
    maxDepth: 7,
    maxArrayItems: 80,
    maxObjectKeys: 80,
    maxStringLength: 1200
  });
  if (!output || typeof output !== "object" || Array.isArray(output)) return null;
  output.id = cleanText(output.id, 80);
  return output.id ? output : null;
}

function sanitizeTeam(input) {
  if (!Array.isArray(input)) return [];
  return input.map(sanitizeTeamPatch).filter(Boolean).slice(0, 120);
}

function sanitizeLogoList(input, maxItems) {
  if (!Array.isArray(input)) return undefined;
  return input.slice(0, maxItems).map(function (item) {
    return {
      name: cleanText(item && item.name, 120),
      logo: cleanUrl(item && item.logo, 240)
    };
  }).filter(function (item) {
    return item.name && item.logo;
  });
}

function sanitizePartners(input) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const output = {};
  const partners = sanitizeLogoList(source.partners, 120);
  const technologyPartners = sanitizeLogoList(source.technologyPartners, 180);
  if (partners && partners.length) output.partners = partners;
  if (technologyPartners && technologyPartners.length) output.technologyPartners = technologyPartners;
  return output;
}

function sanitizeNavigationItem(item, depth) {
  if (!item || typeof item !== "object" || Array.isArray(item)) return null;
  const output = {};
  const href = cleanUrl(item.href, 240);
  const labelKey = cleanText(item.labelKey, 120);
  const label = cleanText(item.label, 160);
  if (href) output.href = href;
  if (labelKey) output.labelKey = labelKey;
  if (label) output.label = label;
  if (item.submenu != null) output.submenu = !!item.submenu;
  if (item.route != null) output.route = cleanText(item.route, 80);
  if (Array.isArray(item.children) && (depth || 0) < 2) {
    output.children = item.children.slice(0, 24).map(function (child) {
      return sanitizeNavigationItem(child, (depth || 0) + 1);
    }).filter(Boolean);
  }
  return Object.keys(output).length ? output : null;
}

function sanitizeNavigation(input) {
  if (!Array.isArray(input)) return [];
  return input.map(function (item) {
    return sanitizeNavigationItem(item, 0);
  }).filter(Boolean).slice(0, 32);
}

function sanitizeObjectArrayByKey(input, key, maxItems) {
  if (!Array.isArray(input)) return [];
  return input.map(function (item) {
    const output = sanitizeJsonValue(item, {
      maxDepth: 8,
      maxArrayItems: 120,
      maxObjectKeys: 120,
      maxStringLength: 2400
    });
    if (!output || typeof output !== "object" || Array.isArray(output)) return null;
    output[key] = cleanText(output[key], 120);
    return output[key] ? output : null;
  }).filter(Boolean).slice(0, maxItems);
}

function sanitizeLocales(input) {
  const source = input && typeof input === "object" ? input : {};
  const output = {};
  ["hy", "en", "ru"].forEach(function (lang) {
    if (source[lang] && typeof source[lang] === "object" && !Array.isArray(source[lang])) {
      output[lang] = sanitizeJsonValue(source[lang], {
        maxDepth: 10,
        maxArrayItems: 160,
        maxObjectKeys: 160,
        maxStringLength: 2400
      });
    }
  });
  return output;
}

function sanitizeCollection(id, input) {
  if (id === "contacts") return sanitizeContacts(input);
  if (id === "company") return sanitizeCompany(input);
  if (id === "services") return sanitizeServices(input);
  if (id === "projects") return sanitizeProjects(input);
  if (id === "projectSettings") return sanitizeProjectSettings(input);
  if (id === "team") return sanitizeTeam(input);
  if (id === "partners") return sanitizePartners(input);
  if (id === "navigation") return sanitizeNavigation(input);
  if (id === "seoLandings") return sanitizeObjectArrayByKey(input, "slug", 80);
  if (id === "seoArticles") return sanitizeObjectArrayByKey(input, "slug", 160);
  if (id === "locales") return sanitizeLocales(input);
  const error = new Error("Unknown CMS collection");
  error.statusCode = 404;
  throw error;
}

function assertPayloadSize(id, payload) {
  const meta = COLLECTIONS[id];
  const serialized = JSON.stringify(payload);
  if (Buffer.byteLength(serialized, "utf8") > meta.maxBytes) {
    const error = new Error("CMS payload is too large for " + id);
    error.statusCode = 413;
    throw error;
  }
}

function readCollection(id) {
  const filePath = collectionReadPath(id);
  if (!filePath) return null;
  return readJsonFile(filePath, null);
}

function writeCollection(id, input) {
  const sanitized = sanitizeCollection(id, input);
  assertPayloadSize(id, sanitized);

  const filePath = collectionFile(id);
  const isEmpty = Array.isArray(sanitized)
    ? !sanitized.length
    : !sanitized || !Object.keys(sanitized).length;

  if (isEmpty) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    writeManifest({ [id]: null });
    return null;
  }

  writeJsonFile(filePath, sanitized);
  writeManifest({ [id]: new Date().toISOString() });
  return sanitized;
}

function deleteCollection(id) {
  collectionFile(id);
  const filePath = path.join(cmsDir, id + ".json");
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  writeManifest({ [id]: null });
}

function listCollections() {
  const manifest = readManifest();
  return Object.values(COLLECTIONS).map(function (meta) {
    const stored = readCollection(meta.id);
    const hasData = Array.isArray(stored) ? stored.length > 0 : !!(stored && Object.keys(stored).length);
    return {
      id: meta.id,
      label: meta.label,
      labelHy: meta.labelHy,
      description: meta.description,
      merge: meta.merge,
      hasData: hasData,
      updatedAt: manifest.collections[meta.id] || null
    };
  });
}

function publicPayload() {
  const manifest = readManifest();
  const payload = {
    version: manifest.version || 1,
    updatedAt: manifest.updatedAt || null,
    collections: {}
  };

  Object.keys(COLLECTIONS).forEach(function (id) {
    const stored = readCollection(id);
    const hasData = Array.isArray(stored) ? stored.length > 0 : !!(stored && Object.keys(stored).length);
    if (hasData) payload.collections[id] = stored;
  });

  return payload;
}

function collectionMeta(id) {
  const meta = COLLECTIONS[id];
  if (!meta) {
    const error = new Error("Unknown CMS collection");
    error.statusCode = 404;
    throw error;
  }
  return meta;
}

function emptyCollectionValue(id) {
  if (["services", "projects", "team", "navigation", "seoLandings", "seoArticles"].indexOf(id) >= 0) {
    return [];
  }
  return {};
}

function adminCollectionPayload(id) {
  collectionMeta(id);
  const manifest = readManifest();
  return {
    collection: id,
    meta: collectionMeta(id),
    data: readCollection(id) || emptyCollectionValue(id),
    updatedAt: manifest.collections[id] || null
  };
}

module.exports = {
  COLLECTIONS,
  cmsDir,
  deepMerge,
  mergeArrayById,
  listCollections,
  readCollection,
  writeCollection,
  deleteCollection,
  publicPayload,
  adminCollectionPayload,
  sanitizeCollection
};
