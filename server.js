const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFile } = require("child_process");
const { URL } = require("url");
const express = require("express");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const sharp = require("sharp");
const { GoogleGenAI } = require("@google/genai");
const OpenAI = require("openai");
let cmsModule = null;
function cms() {
  if (!cmsModule) {
    cmsModule = require("./admin/cms-store");
  }
  return cmsModule;
}
const seo = require("./lib/seo-config");
const chatLocalKnowledge = require("./lib/chat-local-knowledge");
const appMode = require("./lib/app-mode");
const cmsPublish = require("./lib/cms-publish");

function parseEnvLine(line) {
  const trimmed = String(line || "").trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const equalsIndex = trimmed.indexOf("=");
  if (equalsIndex <= 0) return null;
  const key = trimmed.slice(0, equalsIndex).trim();
  let value = trimmed.slice(equalsIndex + 1).trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return null;
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return { key, value };
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  fs.readFileSync(filePath, "utf8").split(/\r?\n/).forEach((line) => {
    const parsed = parseEnvLine(line);
    if (!parsed || process.env[parsed.key]) return;
    process.env[parsed.key] = parsed.value;
  });
}

function envValue(names, fallback) {
  for (const name of names) {
    const value = process.env[name];
    if (value && String(value).trim()) {
      return String(value).trim();
    }
  }
  return fallback;
}

function jsString(value) {
  return "\"" + String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029") + "\"";
}

const rootDir = __dirname;
const siteDir = rootDir;
const pageTemplateDir = path.resolve(rootDir, "lib", "page-templates");
const adminDataDir = process.env.VERCEL
  ? path.join("/tmp", "smarttech-admin-data")
  : path.resolve(rootDir, "admin", "data");
const adminAlbumFile = path.resolve(adminDataDir, "album.json");
const adminSettingsFile = path.resolve(adminDataDir, "settings.json");
const adminRequestLogFile = path.resolve(adminDataDir, "requests.jsonl");
const adminAlbumUploadDir = path.resolve(siteDir, "img", "admin-album");
const adminSessionCookie = "smarttech_admin";
const adminSessionTtlMs = 8 * 60 * 60 * 1000;
const adminUploadMaxBytes = 7 * 1024 * 1024;
const adminAllowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const defaultAdminPassword = "SmartTech@2026";

loadEnvFile(path.resolve(rootDir, ".env"));
loadEnvFile(path.resolve(rootDir, ".env.local"));

const app = express();
const requestedPort = Number(
  appMode.isAdmin()
    ? (process.env.ADMIN_PORT || process.env.PORT || 3001)
    : (process.env.WEB_PORT || process.env.PORT || 3000)
);
const defaultPort = Number.isNaN(requestedPort) ? (appMode.isAdmin() ? 3001 : 3000) : requestedPort;
const defaultGeminiModel = envValue(["GEMINI_MODEL", "GOOGLE_GEMINI_MODEL"], "gemini-2.5-flash");
const defaultGeminiApiKey = envValue(["GEMINI_API_KEY", "GOOGLE_GEMINI_API_KEY", "GOOGLE_API_KEY"], "");
const defaultOpenAiModel = envValue(["OPENAI_MODEL", "CHATGPT_MODEL"], "gpt-5.4-mini");
const defaultOpenAiApiKey = envValue(["OPENAI_API_KEY", "CHATGPT_API_KEY"], "");
const defaultRequestEmailTo = envValue(["REQUEST_EMAIL_TO", "SMARTTECH_REQUEST_EMAIL"], "support@smarttechllc.am");
const defaultRequestEmailFrom = envValue(["REQUEST_EMAIL_FROM", "SMARTTECH_REQUEST_EMAIL_FROM"], "Smart Tech <order@smarttechllc.am>");
const defaultResendApiKey = envValue(["RESEND_API_KEY"], "");
const defaultSmtpHost = envValue(["SMTP_HOST", "MAIL_HOST"], "");
const defaultSmtpPort = Number(envValue(["SMTP_PORT", "MAIL_PORT"], "465"));
const defaultSmtpSecure = envValue(["SMTP_SECURE", "MAIL_SECURE"], "true") !== "false";
const defaultSmtpUser = envValue(["SMTP_USER", "MAIL_USER", "SMTP_EMAIL"], "");
const defaultSmtpPass = envValue(["SMTP_PASS", "MAIL_PASS", "SMTP_PASSWORD"], "");
const chatRateLimitMessage = "Համակարգը ծանրաբեռնված է, խնդրում ենք փորձել 1 րոպեից։";
const chatPageBlockMessage = "Չատը ժամանակավորապես կասեցված է 2 օրով՝ չափից շատ հարցերի պատճառով։";
const chatOpenAIQuotaMessage = "ChatGPT-ը հասանելի չէ՝ OpenAI հաշվի բալانسը սպառված է։ Ավելացրեք վճարում platform.openai.com/settings/billing-ում, ապա նորից փորձեք։";
const chatOpenAINotConfiguredMessage = "ChatGPT-ը դեռ միացված չէ։ Ավելացրեք OPENAI_API_KEY server-ի .env կամ Vercel Environment Variables-ում։";
const chatOpenAIDeveloperInstruction = [
  "Դու Smart Tech AI-ն ես՝ Smart Tech LLC-ի պաշտոնական խելացի օգնականը (https://smarttechllc.am/).",
  "",
  "Քո դերն է խելացի, մարդկային և գեղեցիկ կերպով ուղղակի պատասխանել հարցին։",
  "Մի սկսիր անմիջապես առաջարկներով, գնահարումով կամ «թողեք հեռախոսահամար»-ով, եթե հաճախորդը ինքը չի խնդրել պատվեր կամ գնահարում։",
  "Նախ պատասխանիր հարցին, ապա՝ միայն անհրաժեշտության դեպքում՝ մեկ կարճ հարց կամ հաջորդ քայլ։",
  "Մի օգտագործիր անգլերեն «ask» բառը։ Փոխարենը գրիր «գրեք», «պատասխանեք», «ասեք» կամ համարժեք բնական ձևակերպում օգտատիրոջ լեզվով։",
  "",
  "Եթե հաճախորդը ուզում է նախագիծ հավաքել, բրիֆ կազմել կամ հարցաշար անցնել՝ սկսիր խորհրդատվությունից և հարցեր տուր հերթականությամբ, մեկ-մեկ։ Մի տուր կոնտակտային տվյալներ, եթե հաճախորդը ինքը չի խնդրել։",
  "",
  "Կարող ես խոսել միայն այս թեմաներից՝ տեսահսկում, հրդեհային/ահազանգային համակարգեր, մուտքի վերահսկում, դոմոֆոն, ցանցեր, IT, էլեկտրամոնտաժ, ավտոմատացում, smart home, աուդիո, ինժեներական նախագծում, սարքավորումների մատակարարում։",
  "Եթե հարցը դուրս է այս սահմաններից, քաղաքավարի մերժիր և ասա, որ դու Smart Tech AI ես։",
  "",
  "Լեզուներ՝ հայերեն, անգլերեն, ռուսերեն։ Պատասխանիր օգտատիրոջ լեզվով։",
  "Մի հորինիր գներ, ժամկետներ, պահեստ կամ իրավական երաշխիքներ։",
  "Եթե տեղեկություն չունես, ասա՝ «Խնդրում եմ կապ հաստատել մեր մասնագետների հետ»։",
  "",
  "Կոնտակտներ՝ +374 77 424 643, +374 96 424 643, info@smarttechllc.am, support@smarttechllc.am, Երևան, Վազգեն Սարգսյան 10։"
].join("\n");
const chatFallbackMessage = "Կներեք, այս պահին չաթը չի կարող պատասխանել։ Խնդրում ենք փորձել քիչ անց։";
const chatSystemInstruction = [
  "Դու հանդիսանում ես \"SmartTech LLC\" (սմարթ տեք) ընկերության պաշտոնական, բարեհամբույր և պրոֆեսիոնալ AI օգնականը:",
  "Քո պաշտոնական վեբկայքն է՝ https://smarttechllc.am/։ Քո գլխավոր նպատակն է կայքի այցելուներին արագ, հստակ և օգտակար տեղեկատվություն տրամադրել ընկերության ապրանքների, ՏՏ լուծումների և ծառայությունների մասին:",
  "Մեր գիտելիքների բազան. SmartTech LLC-ն զբաղվում է համակարգչային, սերվերային և ցանցային տեխնիկայի ներմուծմամբ, մեծածախ ու մանրածախ վաճառքով, համակարգային ինտեգրմամբ և ՏՏ աուդիտով:",
  "Սերվերային համակարգեր. առաջարկում ենք բարձրակարգ սերվերներ, տվյալների պահպանման համակարգեր (SAN, NAS) և կառավարման լուծումներ խոշոր ու միջին բիզնեսների համար:",
  "Ցանցային սարքավորումներ. կոմուտատորներ (Switches), երթուղիչներ (Routers), անվտանգության պատնեշներ (Firewalls) և անլար ցանցային լուծումներ:",
  "Անվտանգության և տեսահսկման համակարգեր. պրոֆեսիոնալ IP տեսախցիկներ, NVR ձայնագրիչներ, դոմոֆոններ, ինտերկոմ համակարգեր և մուտքի հսկման համակարգեր (Access Control): SmartTech LLC-ն Hikvision և այլ առաջատար բրենդների պաշտոնական գործընկեր/մատակարար է:",
  "ՏՏ ծառայություններ. ցանցային ենթակառուցվածքների նախագծում և մոնտաժ, սերվերների կարգավորում, ՏՏ աուդիտ և ընկերությունների տեխնիկական սպասարկում (IT outsourcing):",
  "Բազմալեզվություն. պատասխանիր ճիշտ այն լեզվով, որով քեզ դիմել է օգտատերը՝ հայերեն, անգլերեն, ռուսերեն կամ այլ լեզու:",
  "Արագություն և կարճություն. պատասխանիր շատ կարճ ու կոնկրետ՝ առավելագույնը 2-3 նախադասություն, առանց երկար նախաբանների:",
  "Գներ և պատվերներ. կոնկրետ գնային առաջարկների, գնացուցակների կամ պատվերների դեպքում քաղաքավարի խնդրիր օգտատիրոջը թողնել հեռախոսահամար կամ էլ. հասցե, կամ առաջարկիր կապվել մասնագետների հետ:",
  "Թեմայից շեղում. եթե հարցը կապ չունի ՏՏ ոլորտի, սարքավորումների կամ SmartTech-ի հետ, քաղաքավարի մերժիր նույն լեզվով: Հայերեն օրինակ՝ «Ներողություն, ես SmartTech-ի AI օգնականն եմ և կարող եմ պատասխանել միայն մեր ծառայություններին ու ՏՏ սարքավորումներին վերաբերող հարցերին:»"
].join(" ");
const chatSystemInstructionV2 = [
  "You are the official, friendly and professional AI assistant of SmartTech LLC (Smart Tech), website: https://smarttechllc.am/.",
  "Supported languages are only Armenian, English and Russian. Reply in the same supported language used by the visitor. If the visitor uses another language, politely ask them to write in Armenian, English or Russian.",
  "Keep every answer human, warm and direct. Use at most 2-3 short sentences. Ask only one clear follow-up question when needed, and never ask more than 10 questions during one chat.",
  "Do not answer unrelated requests. If the topic is not SmartTech, IT equipment, engineering systems, security systems or services, politely refuse in the user's language.",
  "Site pages you know: Home, Services, Projects, Work Album, AI assistant page, Request, Partners, Team, About, Contact, Licenses, Help, FAQ, Terms, Privacy and Disclaimer.",
  "Company summary: SmartTech LLC designs, supplies, installs, configures and maintains engineering, security, network, electrical, low-current and smart building systems for business, residential, hotel, office, retail and production spaces.",
  "Main workflow: consultation, object survey/measurement, technical brief, equipment selection, commercial offer, supply, installation, commissioning/programming, user handover and maintenance.",
  "Core services: system design, equipment supply, installation, automation cabinet assembly, commissioning and programming, control/interface development, video surveillance, fire and security systems, network installation, electrical installation, building automation/BMS, smart systems, audio systems and powder coating.",
  "Video surveillance knowledge: IP cameras, analog/HDCVI/TVI where needed, indoor/outdoor cameras, PTZ, varifocal lenses, IR/ColorVu/AcuSense style analytics, NVR/DVR, HDD archive sizing, PoE switches, UPS, monitors, remote viewing, mobile app access, motion alerts and network security.",
  "For CCTV questions ask for object type, indoor/outdoor zones, approximate camera count or area, required archive duration, night vision needs, internet availability and whether remote viewing is needed.",
  "Security and alarm systems: motion sensors, door/window contacts, smoke/heat detectors, sirens, keypads, GSM/Wi-Fi/LAN modules, mobile notifications, security zones, panic buttons and maintenance.",
  "Fire safety systems: fire alarm panels, smoke/heat/manual call points, sirens, evacuation voice notification, cable routes, zoning, commissioning and handover. Do not claim legal certification unless explicitly provided; recommend specialist review.",
  "Access control and intercom: controllers, card/biometric readers, magnetic/electric locks, exit buttons, door closers, turnstiles, visitor logic, staff cards, IP intercoms, apartment monitors, mobile app door opening and event logs.",
  "IT and network solutions: structured cabling, UTP/fiber, racks, patch panels, switches, routers, firewalls, Wi-Fi coverage, access points, VLANs, UPS, server setup, SAN/NAS storage, IT audit and IT outsourcing.",
  "Electrical and automation: power lines, lighting, sockets, grounding, distribution boards, circuit breakers, load balancing, automation cabinets, BMS, KNX-style modules, sensors, relays, HVAC/lighting integration, dashboards, scenario programming and testing.",
  "Audio systems: public address, voice evacuation, background music, zone controllers, amplifiers, microphones, conference audio and speaker placement.",
  "Powder coating: surface preparation, cleaning, powder application, curing, RAL/NCS colors, protective coatings and quality control.",
  "Brands and technology families that may be relevant: Hikvision, Dahua, Uniview, Axis, Hanwha, Bosch, Ajax, DSC, Paradox, Satel, Honeywell, ZKTeco, Suprema, HID, Akuvox, BAS-IP, 2N, Cisco, MikroTik, UniFi, Aruba, TP-Link Omada, Schneider Electric, ABB, Legrand, Eaton, Siemens, KNX, HDL, Zennio, Crestron, Control4, Yamaha, Bosch Audio, TOA and JBL Professional. Mention brands as examples, not guaranteed stock.",
  "Projects visible on the website include Abovyan 5/5 Hotel, Amiryan Business Center, Eria Hotel, Dalan Technopark, Wyndham Grand Tsaghkadzor, Only One residential complex, Bedeck Davtashen, Pallada Tsaghkadzor, ULS Data Center, ACBA Bank Sebastia 80, Evocabank, Movenpick Hotel and Wildberries.",
  "Current in-progress projects: Dalan Technopark, Abovyan 5/5 Hotel, Wyndham Grand Tsaghkadzor, Only One Residential Complex, Bedeck Davtashen Residential Complex and Pallada Tsaghkadzor. Wildberries and all other listed projects are completed.",
  "Contact details: general email info@smarttechllc.am, request/support email support@smarttechllc.am, phones +37477424643 and +37496424643, address 10 Vazgen Sargsyan St, Yerevan.",
  "Company facts: operating since 2012, 100+ completed projects, 88 engineering and technical staff, licensed design and installation of engineering systems.",
  "Smart Tech delivers end-to-end: survey/measurement, design, equipment supply, installation, commissioning, programming, client training and maintenance.",
  "Residential complexes and hotels often need combined CCTV, access control, intercom, Wi-Fi, fire alarm, public address and BMS in one coordinated project.",
  "For domophones and intercom: IP intercom panels, apartment monitors, mobile app door opening, video calls and event logs.",
  "Powder coating and metal finishing is also available for protective coatings and custom RAL/NCS colors.",
  "Do not invent exact prices, stock, deadlines, legal guarantees or engineering calculations. For price questions explain that cost depends on object survey, equipment class, cable routes, camera/device count, archive duration and deadlines.",
  "When a visitor wants a quote, order, request, application or project brief, collect a short questionnaire one question at a time: required service, object type, city/address, approximate scope or device count, deadline, contact person and phone/email. After collecting enough details, summarize the brief and tell them SmartTech can follow up by phone/email.",
  "If the visitor gives several details at once, do not repeat them; ask only the next missing practical detail.",
  "If the visitor asks what is needed, give a compact checklist and then ask one qualifying question.",
  "For maintenance questions explain that useful details are installed system type, brand/model if known, fault symptoms, object address, access time and whether the issue is urgent.",
  "For troubleshooting questions give safe first checks only: power, network/internet, recorder status, camera/sensor indicator, app login and recent changes. Do not instruct users to open electrical panels or bypass safety systems.",
  "For equipment selection questions compare practical classes: budget/basic, business/reliable and advanced/analytics. Explain tradeoffs in reliability, archive duration, night image quality, remote access and expandability.",
  "For network/Wi-Fi questions ask about area, walls/floors, user count, internet speed, existing router/switches, required guest network and coverage dead zones.",
  "For electrical questions ask for load type, approximate power, cable route, panel location, grounding, drawings and deadline; recommend site survey before final estimate.",
  "For hotels, offices and residential complexes mention that integrated systems can combine CCTV, access control, intercom, Wi-Fi, fire alarm, public address and BMS into one coordinated project.",
  "Prefer answers with this structure when useful: short direct answer, 3-5 item checklist, then one next question.",
  "Use Armenian terms naturally when replying in Armenian: տեսահսկում, հրդեհային ազդանշան, մուտքի վերահսկում, ցանց, էլեկտրամոնտաժ, ավտոմատացում, չափագրում, գնային առաջարկ."
].join("\n");
let geminiClient = null;
let openaiClient = null;
let smtpTransporter = null;

const seoLandings = require("./lib/seo-landings");
const seoArticles = require("./lib/seo-articles");

const pageShellAliases = {
  help: "about.html",
  faq: "about.html",
  licenses: "about.html",
  terms: "about.html",
  privacy: "about.html",
  disclaimer: "about.html",
  blog: "blog.html",
  landing: "landing.html",
  article: "article.html"
};

seoLandings.landingPages.forEach(function (landing) {
  pageShellAliases[landing.slug] = "landing.html";
});

seoArticles.articles.forEach(function (article) {
  pageShellAliases["blog/" + article.slug] = "article.html";
});

function writeSeoBundles() {
  const bundle = [
    "(function (window) {",
    "  window.SmartTechSeoLandings = " + JSON.stringify(seoLandings.landingPages) + ";",
    "  window.SmartTechSeoArticles = " + JSON.stringify(seoArticles.articles) + ";",
    "  window.SmartTechSeoDistricts = " + JSON.stringify(seoLandings.yerevanDistricts) + ";",
    "})(window);",
    ""
  ].join("\n");
  const bundlePath = path.resolve(rootDir, "src/content/seo-bundles.js");
  fs.mkdirSync(path.dirname(bundlePath), { recursive: true });
  fs.writeFileSync(bundlePath, bundle);
}

writeSeoBundles();

function resolvePagesDir() {
  const primary = path.resolve(siteDir, "pages");
  if (fs.existsSync(primary)) {
    return primary;
  }
  if (fs.existsSync(pageTemplateDir)) {
    return pageTemplateDir;
  }
  return primary;
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

app.disable("x-powered-by");

if (process.env.VERCEL || process.env.SMARTTECH_TRUST_PROXY) {
  app.set("trust proxy", process.env.SMARTTECH_TRUST_PROXY || 1);
}

const adminSessions = new Map();
let geminiClientApiKey = "";

const defaultFirebaseDatabaseUrl = envValue([
  "SMARTTECH_FIREBASE_DATABASE_URL", "FIREBASE_DATABASE_URL",
  "VITE_FIREBASE_DATABASE_URL", "NEXT_PUBLIC_FIREBASE_DATABASE_URL"
], "https://jermukguide-f64ef-default-rtdb.firebaseio.com");

const defaultFirebaseStatsPath = envValue([
  "SMARTTECH_FIREBASE_STATS_PATH", "FIREBASE_STATS_PATH",
  "VITE_FIREBASE_STATS_PATH", "NEXT_PUBLIC_FIREBASE_STATS_PATH"
], "BlogID_201588890086708935/PostID_WebsiteStats");

const defaultFirebaseApiKey = envValue([
  "SMARTTECH_FIREBASE_API_KEY", "FIREBASE_API_KEY",
  "VITE_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_API_KEY"
], "");

const defaultFirebaseAuthToken = envValue([
  "SMARTTECH_FIREBASE_AUTH_TOKEN", "FIREBASE_AUTH_TOKEN",
  "VITE_FIREBASE_AUTH_TOKEN", "NEXT_PUBLIC_FIREBASE_AUTH_TOKEN"
], "");

function ensureAdminDataDir() {
  try {
    fs.mkdirSync(adminDataDir, { recursive: true });
    return true;
  } catch (error) {
    if (error && (error.code === "EROFS" || error.code === "EACCES")) {
      return false;
    }
    throw error;
  }
}

function readJsonFile(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch (error) {
    console.warn("Invalid admin JSON file:", path.basename(filePath), error && error.message);
    return fallback;
  }
}

function writeJsonFile(filePath, payload) {
  if (!ensureAdminDataDir()) {
    const error = new Error("Admin storage is read-only in this environment");
    error.statusCode = 503;
    throw error;
  }
  const tempPath = filePath + "." + process.pid + ".tmp";
  fs.writeFileSync(tempPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  fs.renameSync(tempPath, filePath);
}

function readAdminSettings() {
  return readJsonFile(adminSettingsFile, {});
}

function writeAdminSettings(settings) {
  writeJsonFile(adminSettingsFile, settings || {});
}

function settingValue(settings, key, fallback) {
  const value = settings && settings[key];
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return fallback;
}

function runtimeGeminiModel(settings) {
  return settingValue(settings || readAdminSettings(), "geminiModel", defaultGeminiModel);
}

function runtimeGeminiApiKey(settings) {
  return settingValue(settings || readAdminSettings(), "geminiApiKey", defaultGeminiApiKey);
}

function runtimeFirebaseConfig(settings) {
  const source = settings || readAdminSettings();
  return {
    databaseUrl: settingValue(source, "firebaseDatabaseUrl", defaultFirebaseDatabaseUrl),
    statsPath: settingValue(source, "firebaseStatsPath", defaultFirebaseStatsPath),
    apiKey: settingValue(source, "firebaseApiKey", defaultFirebaseApiKey),
    authToken: settingValue(source, "firebaseAuthToken", defaultFirebaseAuthToken)
  };
}

function getGeminiClient() {
  const apiKey = runtimeGeminiApiKey();
  if (!apiKey) return null;
  if (!geminiClient || geminiClientApiKey !== apiKey) {
    geminiClientApiKey = apiKey;
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

function getOpenAIClient() {
  if (!defaultOpenAiApiKey) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: defaultOpenAiApiKey });
  }
  return openaiClient;
}

function openAITextParts(text) {
  return [{ type: "text", text: String(text || "") }];
}

function extractOpenAIReplyContent(content) {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((part) => (part && part.text) || "").join("");
  }
  return String(content);
}

function cleanChatText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function formatChatUserProfile(profile) {
  if (!profile || typeof profile !== "object") return "";
  const firstName = cleanChatText(profile.firstName, 80);
  const lastName = cleanChatText(profile.lastName, 80);
  const email = cleanChatText(profile.email, 120);
  const phone = cleanChatText(profile.phone, 40);
  const purpose = cleanChatText(profile.purpose, 160);
  if (!firstName && !lastName && !email && !phone && !purpose) return "";
  return [
    "Visitor profile:",
    firstName || lastName ? "Name: " + [firstName, lastName].filter(Boolean).join(" ") : "",
    email ? "Email: " + email : "",
    phone ? "Phone: " + phone : "",
    purpose ? "Purpose: " + purpose : ""
  ].filter(Boolean).join("\n");
}

function cleanAdminText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanRequestText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function sanitizeEmailHeader(value, maxLength) {
  return cleanRequestText(String(value || "").replace(/[\r\n]/g, " "), maxLength);
}

function extractReplyToEmail(contact) {
  const value = sanitizeEmailHeader(contact, 240);
  const match = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (!match) return undefined;
  const email = match[0].toLowerCase();
  if (email.length > 120 || /[\r\n]/.test(email)) return undefined;
  return email;
}

function countDigits(value) {
  return String(value || "").replace(/\D/g, "").length;
}

const allowedRequestSources = {
  "contact-page": true,
  "chat-page": true,
  "chat-widget": true,
  chat: true
};

const allowedRequestLanguages = {
  hy: true,
  en: true,
  ru: true
};

function isLocalDevHost(host) {
  const normalized = String(host || "").split(":")[0].toLowerCase();
  return normalized === "localhost" || normalized === "127.0.0.1";
}

function trustedRequestHosts() {
  return envValue(["REQUEST_TRUSTED_HOSTS"], "smarttechllc.am,www.smarttechllc.am")
    .split(",")
    .map(function (item) { return item.trim().toLowerCase(); })
    .filter(Boolean);
}

function hostAllowedForRequests(hostname) {
  const host = String(hostname || "").toLowerCase();
  if (!host) return false;
  if (isLocalDevHost(host)) return true;
  return trustedRequestHosts().some(function (trusted) {
    return host === trusted || host.endsWith("." + trusted);
  });
}

function looksLikeSpamRequest(summary, contact) {
  const text = (summary + " " + contact).toLowerCase();
  if (/(\bviagra\b|\bcasino\b|\bbitcoin\b|\bcrypto\b|\bseo service\b|\bclick here\b)/i.test(text)) {
    return true;
  }
  const links = (summary.match(/https?:\/\//gi) || []).length;
  return links > 3;
}

function jsonResponse(response, status, payload) {
  response.status(status).type("application/json; charset=utf-8").json(payload);
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function randomToken(bytes) {
  return crypto.randomBytes(bytes || 32).toString("hex");
}

function parseCookies(request) {
  const cookies = {};
  String(request.headers.cookie || "").split(";").forEach((item) => {
    const index = item.indexOf("=");
    if (index <= 0) return;
    const key = item.slice(0, index).trim();
    const value = item.slice(index + 1).trim();
    if (!key) return;
    cookies[key] = decodeURIComponent(value);
  });
  return cookies;
}

function isHttpsRequest(request) {
  return request.secure || String(request.headers["x-forwarded-proto"] || "").split(",")[0].trim() === "https";
}

function sessionCookie(token, request) {
  const parts = [
    adminSessionCookie + "=" + encodeURIComponent(token),
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=" + Math.floor(adminSessionTtlMs / 1000)
  ];
  if (isHttpsRequest(request)) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

function clearSessionCookie() {
  return adminSessionCookie + "=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0";
}

function timingSafeStringEquals(actual, expected) {
  const actualHash = crypto.createHash("sha256").update(String(actual || "")).digest();
  const expectedHash = crypto.createHash("sha256").update(String(expected || "")).digest();
  return crypto.timingSafeEqual(actualHash, expectedHash);
}

function configuredAdminPassword() {
  return envValue(["SMARTTECH_ADMIN_PASSWORD", "ADMIN_PASSWORD"], "");
}

function adminPassword() {
  return configuredAdminPassword() || defaultAdminPassword;
}

function adminPasswordUsingDefault() {
  return !configuredAdminPassword();
}

function getAdminSession(request) {
  const cookies = parseCookies(request);
  const token = cookies[adminSessionCookie];
  if (!token) return null;

  const session = adminSessions.get(token);
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    adminSessions.delete(token);
    return null;
  }

  session.expiresAt = Date.now() + adminSessionTtlMs;
  return session;
}

function requireAdmin(request, response, next) {
  const session = getAdminSession(request);
  if (!session) {
    jsonResponse(response, 401, { error: "Unauthorized" });
    return;
  }
  request.adminSession = session;
  next();
}

function requireCsrf(request, response, next) {
  const session = request.adminSession || getAdminSession(request);
  const token = cleanAdminText(request.headers["x-csrf-token"], 160);
  if (!session || !token || token !== session.csrfToken) {
    jsonResponse(response, 403, { error: "CSRF token is invalid" });
    return;
  }
  request.adminSession = session;
  next();
}

function normalizeRequestHost(hostname) {
  return String(hostname || "").split(":")[0].toLowerCase().replace(/^www\./, "");
}

function requestOriginHostsMatch(requestHost, originHost) {
  const req = String(requestHost || "").split(":")[0].toLowerCase();
  const origin = String(originHost || "").split(":")[0].toLowerCase();
  if (!req || !origin) return true;
  if (req === origin) return true;
  if (normalizeRequestHost(req) === normalizeRequestHost(origin)) {
    return hostAllowedForRequests(req) && hostAllowedForRequests(origin);
  }
  if (process.env.VERCEL && process.env.VERCEL_URL) {
    const vercelHost = String(process.env.VERCEL_URL).split(":")[0].toLowerCase();
    if (req === vercelHost || origin === vercelHost) {
      return true;
    }
  }
  return false;
}

function sameOriginGuard(request, response, next) {
  const host = String(request.headers.host || "").split(":")[0].toLowerCase();
  const candidates = [request.headers.origin, request.headers.referer].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const url = new URL(String(candidate));
      const originHost = url.hostname.toLowerCase();
      if (originHost && !requestOriginHostsMatch(host, originHost)) {
        jsonResponse(response, 403, { error: "Cross-origin admin request blocked" });
        return;
      }
    } catch (error) {
      jsonResponse(response, 403, { error: "Invalid request origin" });
      return;
    }
  }

  next();
}

function normalizeAlbumSection(section) {
  return section === "current" ? "current" : "completed";
}

function normalizeAdminImagePath(value) {
  const image = cleanAdminText(value, 180);
  if (!/^\/img\/admin-album\/[A-Za-z0-9._-]+\.webp$/i.test(image)) {
    return "";
  }
  return image;
}

function normalizeAlbumRecord(record) {
  if (!record || typeof record !== "object") return null;
  const image = normalizeAdminImagePath(record.image);
  if (!image) return null;

  const section = normalizeAlbumSection(record.section);
  const title = cleanAdminText(record.title, 90) || "Smart Tech";
  const caption = cleanAdminText(record.caption, 150) || title;
  const status = cleanAdminText(record.status, 70) || (section === "current" ? "Active work" : "Completed work");
  const createdAtValue = cleanAdminText(record.createdAt, 40);
  const createdAt = Number.isNaN(Date.parse(createdAtValue)) ? new Date().toISOString() : new Date(createdAtValue).toISOString();

  return {
    id: /^[a-f0-9-]{12,80}$/i.test(String(record.id || "")) ? String(record.id) : crypto.randomUUID(),
    section,
    image,
    title,
    caption,
    status,
    createdAt
  };
}

function readAlbumStore() {
  const store = readJsonFile(adminAlbumFile, { photos: [] });
  return {
    photos: (Array.isArray(store.photos) ? store.photos : [])
      .map(normalizeAlbumRecord)
      .filter(Boolean)
  };
}

function writeAlbumStore(store) {
  writeJsonFile(adminAlbumFile, {
    photos: (Array.isArray(store.photos) ? store.photos : [])
      .map(normalizeAlbumRecord)
      .filter(Boolean)
  });
}

function liveAlbumPayload() {
  const store = readAlbumStore();
  const photos = store.photos.slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return { photos };
}

function webAlbumPayload() {
  if (appMode.isWeb()) {
    return cmsPublish.readAlbumPayload();
  }
  return liveAlbumPayload();
}

function publicAlbumPayload() {
  return liveAlbumPayload();
}

function publishSiteSnapshot() {
  if (!appMode.isAdminEnabled()) return;
  try {
    cmsPublish.writeSnapshot(cms().publicPayload(), liveAlbumPayload());
  } catch (error) {
    console.warn("CMS publish failed:", error && error.message);
  }
}

function publicCmsPayload() {
  if (appMode.isCombined()) {
    return cms().publicPayload();
  }
  return cmsPublish.readCmsPayload();
}

function uploadedImageFilePath(publicPath) {
  const image = normalizeAdminImagePath(publicPath);
  if (!image) return null;

  const target = path.resolve(siteDir, image.replace(/^\/+/, ""));
  if (target !== adminAlbumUploadDir && !target.startsWith(adminAlbumUploadDir + path.sep)) {
    return null;
  }
  return target;
}

function deleteUploadedImageIfUnused(publicPath, remainingPhotos) {
  const target = uploadedImageFilePath(publicPath);
  if (!target) return;
  const stillUsed = remainingPhotos.some((photo) => photo.image === publicPath);
  if (stillUsed || !fs.existsSync(target)) return;
  fs.unlinkSync(target);
}

async function saveAlbumUpload(upload) {
  const mime = cleanAdminText(upload && upload.mime, 80).toLowerCase();
  const dataUrl = String((upload && upload.data) || "");
  let base64 = dataUrl;
  let detectedMime = mime;
  const dataUrlMatch = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (dataUrlMatch) {
    detectedMime = cleanAdminText(dataUrlMatch[1], 80).toLowerCase();
    base64 = dataUrlMatch[2];
  }

  if (adminAllowedImageTypes.indexOf(detectedMime) < 0 || (mime && mime !== detectedMime)) {
    throw httpError(400, "Only JPG, PNG and WEBP images are allowed");
  }

  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(base64) || base64.length > Math.ceil(adminUploadMaxBytes * 1.38)) {
    throw httpError(400, "Image data is invalid or too large");
  }

  const sourceBuffer = Buffer.from(base64, "base64");
  if (!sourceBuffer.length || sourceBuffer.length > adminUploadMaxBytes) {
    throw httpError(400, "Image size must be 7 MB or less");
  }

  fs.mkdirSync(adminAlbumUploadDir, { recursive: true });
  const fileName = Date.now() + "-" + randomToken(8) + ".webp";
  const target = path.resolve(adminAlbumUploadDir, fileName);
  if (target !== adminAlbumUploadDir && !target.startsWith(adminAlbumUploadDir + path.sep)) {
    throw httpError(400, "Invalid upload target");
  }

  await sharp(sourceBuffer, { failOn: "warning" })
    .rotate()
    .resize({ width: 1600, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(target);

  return "/img/admin-album/" + fileName;
}

function configuredSecurityStatus() {
  return {
    sessionMinutes: Math.floor(adminSessionTtlMs / 60000),
    csrf: true,
    sameOriginGuard: true,
    uploadResize: true,
    uploadMaxMb: Math.floor(adminUploadMaxBytes / (1024 * 1024)),
    allowedImageTypes: adminAllowedImageTypes
  };
}

function adminSettingsPayload() {
  const settings = readAdminSettings();
  const firebase = runtimeFirebaseConfig(settings);
  return {
    settings: {
      geminiModel: runtimeGeminiModel(settings),
      geminiApiKeyConfigured: !!runtimeGeminiApiKey(settings),
      geminiApiKeyFromAdmin: !!settings.geminiApiKey,
      firebaseDatabaseUrl: firebase.databaseUrl,
      firebaseStatsPath: firebase.statsPath,
      firebaseApiKeyConfigured: !!firebase.apiKey,
      firebaseApiKeyFromAdmin: !!settings.firebaseApiKey,
      firebaseAuthTokenConfigured: !!firebase.authToken,
      firebaseAuthTokenFromAdmin: !!settings.firebaseAuthToken
    },
    security: configuredSecurityStatus()
  };
}

function normalizedUrlSetting(value, currentValue) {
  const cleaned = cleanAdminText(value, 280);
  if (!cleaned) return currentValue;
  try {
    const url = new URL(cleaned);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return currentValue;
    }
    return url.toString().replace(/\/+$/g, "");
  } catch (error) {
    return currentValue;
  }
}

function updateAdminSettings(body) {
  const current = readAdminSettings();
  const next = Object.assign({}, current);

  if (Object.prototype.hasOwnProperty.call(body, "geminiModel")) {
    const model = cleanAdminText(body.geminiModel, 90);
    if (/^[A-Za-z0-9_.:-]{3,90}$/.test(model)) {
      next.geminiModel = model;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "firebaseDatabaseUrl")) {
    next.firebaseDatabaseUrl = normalizedUrlSetting(body.firebaseDatabaseUrl, next.firebaseDatabaseUrl || defaultFirebaseDatabaseUrl);
  }

  if (Object.prototype.hasOwnProperty.call(body, "firebaseStatsPath")) {
    const statsPath = cleanAdminText(body.firebaseStatsPath, 180).replace(/^\/+|\/+$/g, "");
    if (statsPath) {
      next.firebaseStatsPath = statsPath;
    }
  }

  [
    "geminiApiKey",
    "firebaseApiKey",
    "firebaseAuthToken"
  ].forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(body, key)) return;
    const value = cleanAdminText(body[key], 500);
    if (value === "__CLEAR__") {
      delete next[key];
    } else if (value) {
      next[key] = value;
    }
  });

  writeAdminSettings(next);
  return adminSettingsPayload();
}

function normalizeRequestAnswers(answers) {
  const allowed = ["service", "facility", "location", "size", "timeline", "contact"];
  const normalized = {};
  const source = answers && typeof answers === "object" ? answers : {};
  allowed.forEach((key) => {
    const value = cleanRequestText(source[key], 240);
    if (value) normalized[key] = value;
  });
  return normalized;
}

function assertRequestAllowed(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw httpError(400, "Invalid request");
  }

  if (Object.keys(body).length > 16) {
    throw httpError(400, "Invalid request");
  }

  const trap = cleanRequestText(body._trap || body.website || body.company, 80);
  if (trap) {
    throw httpError(400, "Invalid request");
  }

  const summary = cleanRequestText(body.summary, 2400);
  const contact = cleanRequestText(body.contact || (body.answers && body.answers.contact), 240);
  const source = cleanRequestText(body.source, 40) || "chat";

  if (summary && summary.length < 12) {
    throw httpError(400, "Invalid request");
  }

  if (looksLikeSpamRequest(summary, contact)) {
    throw httpError(400, "Invalid request");
  }

  if (source === "contact-page") {
    if (!summary || summary.length < 20) {
      throw httpError(400, "Invalid request");
    }
    if (countDigits(contact) < 8) {
      throw httpError(400, "Invalid request");
    }
  }
}

function requestJsonGuard(request, response, next) {
  const contentType = String(request.headers["content-type"] || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    jsonResponse(response, 415, { error: "Invalid request" });
    return;
  }
  next();
}

function requestSiteGuard(request, response, next) {
  sameOriginGuard(request, response, function () {
    const host = String(request.headers.host || "").split(":")[0].toLowerCase();
    if (isLocalDevHost(host) && !process.env.VERCEL) {
      next();
      return;
    }

    const referer = String(request.headers.referer || request.headers.origin || "");
    if (!referer) {
      jsonResponse(response, 403, { error: "Invalid request" });
      return;
    }

    try {
      const url = new URL(referer);
      if (!hostAllowedForRequests(url.hostname)) {
        jsonResponse(response, 403, { error: "Invalid request" });
        return;
      }
    } catch (error) {
      jsonResponse(response, 403, { error: "Invalid request" });
      return;
    }

    next();
  });
}

function normalizeRequestPayload(body, request) {
  assertRequestAllowed(body);
  const answers = normalizeRequestAnswers(body.answers);
  const summary = cleanRequestText(body.summary, 2400);
  const contact = cleanRequestText(body.contact || answers.contact, 240);
  const source = cleanRequestText(body.source, 40) || "chat";
  const language = cleanRequestText(body.language, 12) || "hy";
  const page = cleanRequestText(body.page, 160) || "";

  if (!allowedRequestSources[source]) {
    throw httpError(400, "Invalid request");
  }

  if (!allowedRequestLanguages[language]) {
    throw httpError(400, "Invalid request");
  }

  if (page && !/^\/[\w\-./?=&%]*$/i.test(page)) {
    throw httpError(400, "Invalid request");
  }

  if (!summary && !Object.keys(answers).length) {
    throw httpError(400, "Invalid request");
  }

  if (!contact && source === "chat") {
    throw httpError(400, "Invalid request");
  }

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source,
    language,
    page,
    contact,
    summary,
    answers,
    userAgent: cleanRequestText(request.headers["user-agent"], 220),
    ip: cleanRequestText(request.ip || request.socket && request.socket.remoteAddress, 80)
  };
}

function appendRequestLog(entry) {
  if (!ensureAdminDataDir()) return;
  fs.appendFileSync(adminRequestLogFile, JSON.stringify(entry) + "\n", "utf8");
}

function formatRequestEmailBody(entry) {
  const lines = [
    "Smart Tech website request",
    "ID: " + entry.id,
    "Created: " + entry.createdAt,
    "Source: " + entry.source,
    "Language: " + entry.language,
    "Page: " + (entry.page || "/"),
    "Contact: " + (entry.contact || "—"),
    "",
    entry.summary || ""
  ];

  const answerKeys = entry.answers ? Object.keys(entry.answers) : [];
  if (answerKeys.length) {
    lines.push("", "Answers:");
    answerKeys.forEach(function (key) {
      lines.push("- " + key + ": " + entry.answers[key]);
    });
  }

  return lines.join("\n");
}

function smtpConfigured() {
  return !!(defaultSmtpHost && defaultSmtpUser && defaultSmtpPass);
}

function getSmtpTransporter() {
  if (!smtpConfigured()) return null;
  if (!smtpTransporter) {
    const nodemailer = require("nodemailer");
    smtpTransporter = nodemailer.createTransport({
      host: defaultSmtpHost,
      port: Number.isNaN(defaultSmtpPort) ? 465 : defaultSmtpPort,
      secure: defaultSmtpSecure,
      auth: {
        user: defaultSmtpUser,
        pass: defaultSmtpPass
      }
    });
  }
  return smtpTransporter;
}

function requestEmailSubject(entry) {
  return sanitizeEmailHeader("Smart Tech project request #" + String(entry.id).slice(0, 8), 120);
}

async function sendRequestNotificationEmailViaSmtp(entry) {
  const transporter = getSmtpTransporter();
  if (!transporter) return false;

  const replyTo = extractReplyToEmail(entry.contact);
  await transporter.sendMail({
    from: sanitizeEmailHeader(defaultRequestEmailFrom, 160),
    to: sanitizeEmailHeader(defaultRequestEmailTo, 160),
    replyTo: replyTo,
    subject: requestEmailSubject(entry),
    text: formatRequestEmailBody(entry)
  });
  return true;
}

async function sendRequestNotificationEmailViaResend(entry) {
  if (!defaultResendApiKey) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + defaultResendApiKey
    },
    body: JSON.stringify({
      from: sanitizeEmailHeader(defaultRequestEmailFrom, 160),
      to: [sanitizeEmailHeader(defaultRequestEmailTo, 160)],
      subject: requestEmailSubject(entry),
      text: formatRequestEmailBody(entry)
    })
  });

  if (!response.ok) {
    const payload = await response.json().catch(function () {
      return {};
    });
    const error = new Error((payload && payload.message) || "Email delivery failed");
    error.status = response.status;
    throw error;
  }

  return true;
}

async function sendRequestNotificationEmail(entry) {
  if (smtpConfigured()) {
    return sendRequestNotificationEmailViaSmtp(entry);
  }
  if (defaultResendApiKey) {
    return sendRequestNotificationEmailViaResend(entry);
  }
  return false;
}

async function submitPublicRequest(body, request) {
  const entry = normalizeRequestPayload(body, request);
  appendRequestLog(entry);

  let emailSent = false;
  try {
    emailSent = await sendRequestNotificationEmail(entry);
  } catch (error) {
    console.error(
      "Request notification email failed:",
      defaultRequestEmailTo,
      error && (error.status || error.message || error)
    );
  }

  if (!emailSent) {
    console.error(
      "Request saved but email was not delivered to",
      defaultRequestEmailTo + ".",
      smtpConfigured() ? "SMTP send returned false." : "Configure SMTP or RESEND_API_KEY."
    );
    throw httpError(503, "Delivery failed");
  }

  return {
    ok: true,
    emailSent: true
  };
}

function detectChatLanguage(text, fallbackLanguage) {
  const value = String(text || "").trim();
  if (/[Ա-Ֆա-ֆև]/.test(value)) return "Armenian";
  if (/[А-Яа-яЁё]/.test(value)) return "Russian";
  if (/[A-Za-z]/.test(value)) {
    if (value.length <= 8 && fallbackLanguage) {
      return fallbackLanguage;
    }
    return "English";
  }
  return fallbackLanguage || "Armenian";
}

function normalizeChatUiLanguage(language) {
  const code = String(language || "").toLowerCase();
  if (code.indexOf("en") === 0) return "English";
  if (code.indexOf("ru") === 0) return "Russian";
  return "Armenian";
}

function normalizeChatHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-6)
    .map((entry) => {
      const role = entry && entry.role === "user" ? "user" : "model";
      const text = cleanChatText(entry && entry.text, 360);
      if (!text) return null;
      return {
        role,
        parts: [{ text }]
      };
    })
    .filter(Boolean);
}

function normalizeOpenAIChatHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-6)
    .map((entry) => {
      const role = entry && entry.role === "user" ? "user" : "assistant";
      const content = cleanChatText(entry && entry.text, 360);
      if (!content) return null;
      return { role, content: openAITextParts(content) };
    })
    .filter(Boolean);
}

function isGeminiRateLimitError(error) {
  const status = error && (error.status || error.code || error.statusCode);
  const message = String((error && error.message) || "");
  return [429, 503].indexOf(Number(status)) >= 0 || message.indexOf("429") >= 0 || message.indexOf("503") >= 0 || /rate|quota|exhausted|overload|unavailable/i.test(message);
}

function isOpenAIQuotaError(error) {
  const message = String((error && error.message) || "");
  return /quota|billing|insufficient funds|exceeded your current/i.test(message);
}

function isOpenAIRateLimitError(error) {
  if (isOpenAIQuotaError(error)) return false;
  const status = Number(error && (error.status || error.statusCode));
  const message = String((error && error.message) || "");
  return status === 429 || status === 503 || /rate|exhausted|overload|unavailable/i.test(message);
}

async function generateGeminiChatReply({ message, pagePath, replyLanguage, history, userProfile }) {
  const client = getGeminiClient();
  if (!client) {
    throw httpError(503, "Gemini API key is not configured");
  }

  const profileText = formatChatUserProfile(userProfile);
  const contents = normalizeChatHistory(history);
  contents.push({
    role: "user",
    parts: [{
      text: [
        "Current site page: " + (pagePath || "/"),
        "Detected visitor language: " + replyLanguage + ". Reply only in this language unless it is not Armenian, English or Russian.",
        profileText,
        "Visitor message: " + message
      ].filter(Boolean).join("\n")
    }]
  });

  const geminiResponse = await client.models.generateContent({
    model: runtimeGeminiModel(),
    contents,
    config: {
      systemInstruction: chatSystemInstructionV2,
      thinkingConfig: {
        thinkingBudget: 0
      },
      temperature: 0.2,
      maxOutputTokens: 150
    }
  });

  const reply = cleanChatText(geminiResponse.text, 900);
  return reply || "Կարո՞ղ եք հարցը մի փոքր ավելի հստակ գրել։";
}

async function generateOpenAIChatReply({ message, pagePath, replyLanguage, history, userProfile }) {
  const client = getOpenAIClient();
  if (!client) {
    throw httpError(503, "OpenAI API key is not configured");
  }

  const messages = [
    {
      role: "developer",
      content: openAITextParts(chatOpenAIDeveloperInstruction)
    },
    ...normalizeOpenAIChatHistory(history),
    {
      role: "user",
      content: openAITextParts([
        "Current site page: " + (pagePath || "/"),
        "Detected visitor language: " + replyLanguage + ". Reply only in this language unless it is not Armenian, English or Russian.",
        formatChatUserProfile(userProfile),
        "Visitor message: " + message
      ].filter(Boolean).join("\n"))
    }
  ];

  const completion = await client.chat.completions.create({
    model: defaultOpenAiModel,
    messages,
    response_format: { type: "text" },
    verbosity: "medium",
    reasoning_effort: "medium",
    store: false
  });

  const reply = cleanChatText(
    extractOpenAIReplyContent(
      completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content
    ),
    900
  );
  return reply || "Կարո՞ղ եք հարցը մի փոքր ավելի հստակ գրել։";
}

function chatLimiterHandler(request, response) {
  response.status(429).json({ reply: chatRateLimitMessage });
}

function chatUserLimiterKey(request) {
  return ipKeyGenerator(request);
}

const chatUserLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: chatUserLimiterKey,
  handler: chatLimiterHandler
});

const chatGlobalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 14,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: () => "gemini-chat-global",
  handler: chatLimiterHandler
});

const chatPageGlobalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 14,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: () => "openai-chat-page-global",
  handler: chatLimiterHandler
});

function chatPageClientKey(request) {
  const clientId = cleanChatText(request.body && request.body.clientId, 80);
  if (clientId) return "chat-page:" + clientId;
  return "chat-page-ip:" + ipKeyGenerator(request);
}

const chatPageAbuseLimiter = rateLimit({
  windowMs: 2 * 24 * 60 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: chatPageClientKey,
  handler: (request, response) => {
    response.status(429).json({ reply: chatPageBlockMessage, provider: "system", blocked: true });
  }
});

function adminLimiterHandler(request, response) {
  jsonResponse(response, 429, { error: "Too many requests. Try again in a minute." });
}

const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: adminLimiterHandler
});

const requestSubmitLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: adminLimiterHandler
});

const requestSubmitHourlyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
  handler: adminLimiterHandler
});

const adminLoginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: adminLimiterHandler
});

const adminApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 80,
  standardHeaders: true,
  legacyHeaders: false,
  handler: adminLimiterHandler
});

app.use((request, response, next) => {
  const host = String(request.headers.host || "").split(":")[0].toLowerCase();
  if (host === "www.smarttechllc.am") {
    const target = new URL(request.url, "https://smarttechllc.am");
    response.redirect(301, target.toString());
    return;
  }
  next();
});

app.use((request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Resource-Policy", "same-site");
  if (isHttpsRequest(request)) {
    response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

if (appMode.isWeb()) {
  app.use((request, response, next) => {
    const pathname = String(request.path || "");
    if (pathname === "/admin" || pathname.indexOf("/admin/") === 0 || pathname.indexOf("/api/admin") === 0) {
      response.status(404).json({ error: "Not found" });
      return;
    }
    next();
  });
}

if (appMode.isAdmin()) {
  app.use((request, response, next) => {
    const pathname = String(request.path || "");
    const blockedPublicApi = ["/api/chat", "/api/chat-page", "/api/request", "/api/content", "/api/album", "/api/status"];
    for (const prefix of blockedPublicApi) {
      if (pathname === prefix || pathname.indexOf(prefix + "/") === 0) {
        response.status(404).json({ error: "Not found" });
        return;
      }
    }
    next();
  });
}

app.get("/robots.txt", publicApiLimiter, (request, response) => {
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=3600");
  response.status(200).send(seo.robotsTxt());
});

app.get("/sitemap.xml", publicApiLimiter, (request, response) => {
  response.setHeader("Content-Type", "application/xml; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=3600");
  response.status(200).send(seo.sitemapXml());
});

if (appMode.isWebEnabled()) {
app.get("/api/album", publicApiLimiter, (request, response) => {
  jsonResponse(response, 200, webAlbumPayload());
});

app.get("/api/content", publicApiLimiter, (request, response) => {
  jsonResponse(response, 200, publicCmsPayload());
});

app.get("/api/status", publicApiLimiter, (request, response) => {
  const emailReady = smtpConfigured() || !!defaultResendApiKey;
  jsonResponse(response, 200, {
    runtime: process.env.VERCEL ? "vercel" : "local",
    vercelEnv: process.env.VERCEL_ENV || null,
    email: {
      configured: emailReady,
      smtp: smtpConfigured(),
      resend: !!defaultResendApiKey,
      to: defaultRequestEmailTo,
      from: defaultRequestEmailFrom.replace(/<[^>]+>/g, "").trim() || defaultRequestEmailFrom
    },
    chat: {
      gemini: !!defaultGeminiApiKey,
      openai: !!defaultOpenAiApiKey
    },
    hint: emailReady
      ? "Email env vars are loaded."
      : "Add SMTP_* or RESEND_API_KEY in Vercel → Settings → Environment Variables, then Redeploy."
  });
});

app.post("/api/request", requestSubmitLimiter, requestSubmitHourlyLimiter, express.json({ limit: "10kb" }), requestJsonGuard, requestSiteGuard, async (request, response) => {
  try {
    jsonResponse(response, 201, await submitPublicRequest(request.body || {}, request));
  } catch (error) {
    const status = error.statusCode || 500;
    jsonResponse(response, status, {
      error: status === 400 || status === 403 || status === 415
        ? "Invalid request"
        : status === 503
          ? "Delivery failed"
          : "Request failed"
    });
  }
});
}

if (appMode.isAdminEnabled()) {
app.get("/api/admin/cms", adminApiLimiter, requireAdmin, (request, response) => {
  jsonResponse(response, 200, { collections: cms().listCollections() });
});

app.get("/api/admin/cms/:collection", adminApiLimiter, requireAdmin, (request, response) => {
  try {
    jsonResponse(response, 200, cms().adminCollectionPayload(cleanAdminText(request.params.collection, 40)));
  } catch (error) {
    jsonResponse(response, error.statusCode || 500, { error: error.message || "CMS read failed" });
  }
});

app.put("/api/admin/cms/:collection", adminApiLimiter, express.json({ limit: "640kb" }), sameOriginGuard, requireAdmin, requireCsrf, (request, response) => {
  try {
    const collection = cleanAdminText(request.params.collection, 40);
    const saved = cms().writeCollection(collection, request.body || {});
    publishSiteSnapshot();
    jsonResponse(response, 200, {
      collection: collection,
      data: saved,
      collections: cms().listCollections()
    });
  } catch (error) {
    jsonResponse(response, error.statusCode || 500, { error: error.message || "CMS save failed" });
  }
});

app.delete("/api/admin/cms/:collection", adminApiLimiter, sameOriginGuard, requireAdmin, requireCsrf, (request, response) => {
  try {
    const collection = cleanAdminText(request.params.collection, 40);
    cms().deleteCollection(collection);
    publishSiteSnapshot();
    jsonResponse(response, 200, {
      collection: collection,
      deleted: true,
      collections: cms().listCollections()
    });
  } catch (error) {
    jsonResponse(response, error.statusCode || 500, { error: error.message || "CMS delete failed" });
  }
});

app.get("/api/admin/session", adminApiLimiter, (request, response) => {
  const session = getAdminSession(request);
  if (!session) {
    jsonResponse(response, 200, {
      authenticated: false,
      adminPasswordConfigured: !!adminPassword(),
      adminPasswordUsingDefault: adminPasswordUsingDefault()
    });
    return;
  }

  jsonResponse(response, 200, {
    authenticated: true,
    csrfToken: session.csrfToken,
    expiresAt: new Date(session.expiresAt).toISOString(),
    adminPasswordConfigured: !!adminPassword(),
    adminPasswordUsingDefault: adminPasswordUsingDefault(),
    album: publicAlbumPayload(),
    admin: adminSettingsPayload()
  });
});

app.post("/api/admin/login", adminLoginLimiter, express.json({ limit: "2kb" }), sameOriginGuard, (request, response) => {
  const password = adminPassword();
  if (!password) {
    jsonResponse(response, 503, { error: "Admin password is not configured" });
    return;
  }

  const provided = cleanAdminText(request.body && request.body.password, 400);
  if (!provided || !timingSafeStringEquals(provided, password)) {
    jsonResponse(response, 401, { error: "Invalid admin password" });
    return;
  }

  const token = randomToken(32);
  const session = {
    csrfToken: randomToken(24),
    createdAt: Date.now(),
    expiresAt: Date.now() + adminSessionTtlMs
  };
  adminSessions.set(token, session);
  response.setHeader("Set-Cookie", sessionCookie(token, request));
  jsonResponse(response, 200, {
    authenticated: true,
    csrfToken: session.csrfToken,
    expiresAt: new Date(session.expiresAt).toISOString(),
    album: publicAlbumPayload(),
    admin: adminSettingsPayload()
  });
});

app.post("/api/admin/logout", adminApiLimiter, sameOriginGuard, requireAdmin, requireCsrf, (request, response) => {
  const cookies = parseCookies(request);
  if (cookies[adminSessionCookie]) {
    adminSessions.delete(cookies[adminSessionCookie]);
  }
  response.setHeader("Set-Cookie", clearSessionCookie());
  jsonResponse(response, 200, { authenticated: false });
});

app.get("/api/admin/settings", adminApiLimiter, requireAdmin, (request, response) => {
  jsonResponse(response, 200, adminSettingsPayload());
});

app.put("/api/admin/settings", adminApiLimiter, express.json({ limit: "6kb" }), sameOriginGuard, requireAdmin, requireCsrf, (request, response) => {
  try {
    jsonResponse(response, 200, updateAdminSettings(request.body || {}));
  } catch (error) {
    jsonResponse(response, error.statusCode || 500, { error: error.message || "Settings update failed" });
  }
});

app.get("/api/admin/album", adminApiLimiter, requireAdmin, (request, response) => {
  jsonResponse(response, 200, publicAlbumPayload());
});

app.post("/api/admin/album/images", adminApiLimiter, express.json({ limit: "10mb" }), sameOriginGuard, requireAdmin, requireCsrf, async (request, response) => {
  try {
    const image = await saveAlbumUpload(request.body && request.body.file);
    const section = normalizeAlbumSection(request.body && request.body.section);
    const record = normalizeAlbumRecord({
      id: crypto.randomUUID(),
      section,
      image,
      title: request.body && request.body.title,
      caption: request.body && request.body.caption,
      status: request.body && request.body.status,
      createdAt: new Date().toISOString()
    });

    if (!record) {
      throw httpError(400, "Album record is invalid");
    }

    const store = readAlbumStore();
    store.photos.unshift(record);
    writeAlbumStore(store);
    publishSiteSnapshot();
    jsonResponse(response, 201, { photo: record, album: publicAlbumPayload() });
  } catch (error) {
    jsonResponse(response, error.statusCode || 500, { error: error.message || "Image upload failed" });
  }
});

app.delete("/api/admin/album/images/:id", adminApiLimiter, sameOriginGuard, requireAdmin, requireCsrf, (request, response) => {
  try {
    const id = cleanAdminText(request.params.id, 90);
    const store = readAlbumStore();
    const target = store.photos.find((photo) => photo.id === id);
    if (!target) {
      jsonResponse(response, 404, { error: "Image not found" });
      return;
    }

    const remaining = store.photos.filter((photo) => photo.id !== id);
    writeAlbumStore({ photos: remaining });
    deleteUploadedImageIfUnused(target.image, remaining);
    publishSiteSnapshot();
    jsonResponse(response, 200, { deleted: true, album: publicAlbumPayload() });
  } catch (error) {
    jsonResponse(response, error.statusCode || 500, { error: error.message || "Image delete failed" });
  }
});
}

if (appMode.isWebEnabled()) {
app.post("/api/chat", chatUserLimiter, chatGlobalLimiter, express.json({ limit: "8kb" }), async (request, response) => {
  const message = cleanChatText(request.body && request.body.message, 700);
  const pagePath = cleanChatText(request.body && request.body.page, 120);
  const uiLanguage = normalizeChatUiLanguage(request.body && request.body.language);
  const replyLanguage = detectChatLanguage(message, uiLanguage);

  if (!message) {
    response.status(400).json({ reply: "Խնդրում ենք գրել հարցը։" });
    return;
  }

  if (!getGeminiClient()) {
    response.status(503).json({ reply: "AI չաթը դեռ կարգավորված չէ։ Խնդրում ենք ավելացնել GEMINI_API_KEY server-ի .env ֆայլում։" });
    return;
  }

  try {
    const reply = await generateGeminiChatReply({
      message,
      pagePath,
      replyLanguage,
      history: request.body && request.body.history
    });
    response.json({ reply });
  } catch (error) {
    if (isGeminiRateLimitError(error)) {
      response.status(429).json({ reply: chatRateLimitMessage });
      return;
    }

    console.error("Gemini chat error:", error && (error.status || error.code || error.message || error));
    response.status(500).json({ reply: chatFallbackMessage });
  }
});

app.post("/api/chat-page", chatUserLimiter, chatPageAbuseLimiter, chatPageGlobalLimiter, express.json({ limit: "8kb" }), async (request, response) => {
  const message = cleanChatText(request.body && request.body.message, 700);
  const pagePath = cleanChatText(request.body && request.body.page, 120);
  const uiLanguage = normalizeChatUiLanguage(request.body && request.body.language);
  const replyLanguage = detectChatLanguage(message, uiLanguage);

  if (!message) {
    response.status(400).json({ reply: "Խնդրում ենք գրել հարցը։" });
    return;
  }

  const history = request.body && request.body.history;
  const userProfile = request.body && request.body.userProfile;
  const chatInput = { message, pagePath, replyLanguage, history, userProfile };

  try {
    const localReply = chatLocalKnowledge.matchLocalChatReply(message, replyLanguage, history);
    if (localReply && localReply.reply) {
      response.json({ reply: localReply.reply, provider: "local", topic: localReply.id });
      return;
    }

    if (defaultOpenAiApiKey) {
      try {
        const reply = await generateOpenAIChatReply(chatInput);
        response.json({ reply, provider: "openai" });
        return;
      } catch (openAiError) {
        if (isOpenAIQuotaError(openAiError)) {
          response.status(503).json({ reply: chatOpenAIQuotaMessage, provider: "openai" });
          return;
        }
        if (isOpenAIRateLimitError(openAiError)) {
          response.status(429).json({ reply: chatRateLimitMessage, provider: "openai" });
          return;
        }
        console.error("OpenAI chat-page error:", openAiError && (openAiError.status || openAiError.message || openAiError));
        throw openAiError;
      }
    }

    if (getGeminiClient()) {
      const reply = await generateGeminiChatReply(chatInput);
      response.json({ reply, provider: "gemini", note: "openai_not_configured" });
      return;
    }

    response.status(503).json({ reply: chatOpenAINotConfiguredMessage, provider: "none" });
  } catch (error) {
    if (isOpenAIRateLimitError(error) || isGeminiRateLimitError(error)) {
      response.status(429).json({ reply: chatRateLimitMessage });
      return;
    }

    console.error("Chat-page error:", error && (error.status || error.message || error));
    response.status(500).json({ reply: chatFallbackMessage });
  }
});
}

if (appMode.isAdmin()) {
  app.get("/admin/runtime.js", publicApiLimiter, (request, response) => {
    const content = [
      "(function (window) {",
      "  window.SMARTTECH_WEB_ORIGIN = " + jsString(appMode.webOrigin()) + ";",
      "})(window);",
      ""
    ].join("\n");
    response.setHeader("Content-Type", "application/javascript; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");
    response.status(200).send(content);
  });

  app.post("/api/admin/publish", adminApiLimiter, sameOriginGuard, requireAdmin, requireCsrf, (request, response) => {
    publishSiteSnapshot();
    jsonResponse(response, 200, {
      published: true,
      publishedAt: new Date().toISOString(),
      snapshot: cmsPublish.snapshotFile
    });
  });
}

app.use((error, request, response, next) => {
  if (error && error.type === "entity.parse.failed") {
    response.status(400).json({ reply: "Հարցումը ճիշտ ձևաչափով չէ։" });
    return;
  }
  next(error);
});

app.use((request, response) => {
  if (request.path && request.path.indexOf("/api/") === 0) {
    response.status(404).json({ error: "Not found" });
    return;
  }
  if (appMode.isAdmin()) {
    serveAdmin(request, response);
    return;
  }
  if (appMode.isWebEnabled()) {
    serveWeb(request, response);
    return;
  }
  response.status(404).send("Not found");
});

function safeWebPath(urlPath) {
  var pathname = urlPath.split("?")[0];
  var decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch (error) {
    return null;
  }

  var cleanPath = decoded.replace(/^\/+/g, "").replace(/\/+$/, "");
  var normalized = path.normalize(cleanPath);
  if (normalized === ".") {
    normalized = "";
  }
  if (path.isAbsolute(normalized) || normalized.indexOf("..") === 0) {
    return null;
  }

  if (appMode.isWeb() && (normalized === "admin" || normalized.indexOf("admin/") === 0)) {
    return null;
  }

  var relative = normalized === "" || normalized === "home" || normalized === "index"
    ? "pages/index.html"
    : normalized;
  var target = path.resolve(siteDir, relative);
  if (target !== siteDir && !target.startsWith(siteDir + path.sep)) {
    return null;
  }
  return { relative, target };
}

function extensionlessRedirectLocation(requestUrl) {
  var originalPathname = requestUrl.pathname || "/";
  var pathname = originalPathname.replace(/\/+$/, "") || "/";
  var cleanPath = pathname;

  if (cleanPath.indexOf("/pages/") === 0) {
    cleanPath = "/" + cleanPath.slice("/pages/".length);
  }

  if (cleanPath === "/home" && cleanPath !== originalPathname) {
    return "/home" + requestUrl.search;
  }

  if (cleanPath === "/" || cleanPath === "/home") {
    return null;
  }

  if (cleanPath === "/index" || cleanPath === "/index.html") {
    return "/home" + requestUrl.search;
  }

  if (cleanPath.indexOf(".html") === cleanPath.length - 5) {
    var withoutExtension = cleanPath.slice(0, -5);
    if (withoutExtension === "/index") {
      withoutExtension = "/home";
    }
    return withoutExtension + requestUrl.search;
  }

  if (cleanPath !== originalPathname) {
    return cleanPath + requestUrl.search;
  }

  return null;
}

function stripVercelAnalytics(html) {
  return String(html || "")
    .replace(/[ \t]*<!-- Vercel Web Analytics[^>]*-->\s*/g, "")
    .replace(/[ \t]*<script defer src="\/_vercel\/insights\/script\.js"><\/script>\s*/g, "")
    .replace(/[ \t]*<!-- Vercel Speed Insights[^>]*-->\s*/g, "")
    .replace(/[ \t]*<script defer src="\/_vercel\/speed-insights\/script\.js"><\/script>\s*/g, "");
}

function sendStatic(response, targetPath) {
  const ext = path.extname(targetPath).toLowerCase();
  const isHtml = ext === ".html";
  const stripVercel = isHtml && !process.env.VERCEL_ENV;
  const encoding = stripVercel ? "utf8" : null;

  fs.readFile(targetPath, encoding, (error, file) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }
    const body = stripVercel ? stripVercelAnalytics(file) : file;
    response.writeHead(200, {
      "content-type": mimeTypes[ext] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(body);
  });
}

function resolveStaticTarget(targetInfo) {
  const relative = targetInfo.relative.replace(/\\/g, "/");
  const direct = targetInfo.target;
  const candidates = [direct];
  const pagesDir = resolvePagesDir();

  if (!path.extname(direct)) {
    candidates.push(direct + ".html");
  }

  const pageRelative = relative.startsWith("pages/") ? relative.slice("pages/".length) : relative;
  const pageKey = pageRelative.replace(/\.html$/i, "");
  if (appMode.isAdminEnabled() && pageKey === "admin") {
    candidates.unshift(path.resolve(siteDir, "admin", "index.html"));
  }
  const aliasedPage = pageShellAliases[pageKey];
  if (aliasedPage) {
    candidates.push(path.resolve(pagesDir, aliasedPage));
  }
  const pageTarget = path.resolve(pagesDir, pageRelative);
  candidates.push(pageTarget);
  if (!path.extname(pageTarget)) {
    candidates.push(pageTarget + ".html");
  }

  for (const candidate of candidates) {
    if ((candidate === siteDir || candidate.startsWith(siteDir + path.sep)) && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return direct;
}

function serveAdmin(request, response) {
  const requestUrl = new URL(request.url, "http://localhost");
  const pathname = requestUrl.pathname || "/";

  if (pathname === "/" || pathname === "") {
    response.writeHead(302, { location: "/admin" });
    response.end();
    return;
  }

  if (pathname === "/admin" || pathname === "/admin/") {
    sendStatic(response, path.resolve(siteDir, "admin", "index.html"));
    return;
  }

  if (pathname.indexOf("/admin/") === 0) {
    const asset = pathname.slice("/admin/".length);
    const target = path.resolve(siteDir, "admin", asset);
    if (target.startsWith(path.resolve(siteDir, "admin") + path.sep) && fs.existsSync(target) && fs.statSync(target).isFile()) {
      sendStatic(response, target);
      return;
    }
  }

  const sharedPrefixes = ["/img/", "/src/styles/", "/manifest.json", "/admin/runtime.js"];
  for (const prefix of sharedPrefixes) {
    if (pathname === prefix.replace(/\/$/, "") || pathname.indexOf(prefix) === 0) {
      const relative = pathname.replace(/^\/+/, "");
      const target = path.resolve(siteDir, relative);
      if (target.startsWith(siteDir + path.sep) && fs.existsSync(target)) {
        sendStatic(response, target);
        return;
      }
    }
  }

  response.writeHead(404);
  response.end("Not found");
}

function serveWeb(request, response) {
  const requestUrl = new URL(request.url, "http://localhost");
  const redirectLocation = request.method === "GET" || request.method === "HEAD"
    ? extensionlessRedirectLocation(requestUrl)
    : null;

  if (redirectLocation) {
    response.writeHead(301, { location: redirectLocation });
    response.end();
    return;
  }

  const targetInfo = safeWebPath(requestUrl.pathname);
  if (!targetInfo) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  let target = resolveStaticTarget(targetInfo);

  if (targetInfo.relative.replace(/\\/g, "/") === "src/core/runtime-config.js") {
    const firebaseConfig = runtimeFirebaseConfig();
    const cmsApiBaseUrl = envValue([
      "SMARTTECH_CMS_API_BASE_URL",
      "CMS_API_BASE_URL",
      "VITE_SMARTTECH_CMS_API_BASE_URL",
      "NEXT_PUBLIC_SMARTTECH_CMS_API_BASE_URL"
    ], "");

    const configContent = [
      "(function (window) {",
      "  window.SmartTechRuntimeConfig = Object.assign({}, window.SmartTechRuntimeConfig, {",
      "    firebaseDatabaseUrl: " + jsString(firebaseConfig.databaseUrl) + ",",
      "    firebaseStatsPath: " + jsString(firebaseConfig.statsPath) + ",",
      "    firebaseApiKey: " + jsString(firebaseConfig.apiKey) + ",",
      "    firebaseAuthToken: " + jsString(firebaseConfig.authToken) + ",",
      "    cmsApiBaseUrl: " + jsString(cmsApiBaseUrl),
      "  });",
      "})(window);",
      ""
    ].join("\n");

    response.writeHead(200, {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "no-store"
    });
    response.end(configContent);
    return;
  }

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, "index.html");
  }

  sendStatic(response, target);
}

function openBrowser(url) {
  if (process.env.OPEN_BROWSER !== "1") return;

  var command = "xdg-open";
  var args = [url];

  if (process.platform === "win32") {
    command = "cmd";
    args = ["/c", "start", "", url];
  } else if (process.platform === "darwin") {
    command = "open";
  }

  execFile(command, args, { windowsHide: true }, function () {});
}

function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    const localUrl = "http://localhost:" + portToUse + "/";
    if (appMode.isAdmin()) {
      console.log("Smart Tech admin server is running (isolated):");
      console.log("  Admin: http://localhost:" + portToUse + "/admin");
      console.log("  Public web: " + appMode.webOrigin() + "/");
      console.log("  CMS publishes to: " + cmsPublish.snapshotFile);
      openBrowser("http://localhost:" + portToUse + "/admin");
      return;
    }
    console.log("Smart Tech web server is running:");
    console.log("  Web: " + localUrl);
    openBrowser(localUrl);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn("Port " + portToUse + " is already in use.");
      if (portToUse < 3010) {
        var nextPort = portToUse + 1;
        if (appMode.isWeb()) {
          var reservedAdminPort = Number(process.env.ADMIN_PORT || 3001);
          if (nextPort === reservedAdminPort) {
            nextPort += 1;
          }
        }
        console.log("Trying next available port...");
        startServer(nextPort);
        return;
      }
    }
    console.error(error);
    process.exit(1);
  });
}

if (require.main === module) {
  startServer(defaultPort);
}

module.exports = app;
