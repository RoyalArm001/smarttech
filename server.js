const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { URL } = require("url");
const express = require("express");
const rateLimit = require("express-rate-limit");
const { GoogleGenAI } = require("@google/genai");

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
const webDir = path.resolve(rootDir, "web");

loadEnvFile(path.resolve(rootDir, ".env"));
loadEnvFile(path.resolve(rootDir, ".env.local"));

const app = express();
const requestedPort = Number(process.env.WEB_PORT || process.env.PORT || 3000);
const defaultPort = Number.isNaN(requestedPort) ? 3000 : requestedPort;
const geminiModel = envValue(["GEMINI_MODEL", "GOOGLE_GEMINI_MODEL"], "gemini-2.5-flash");
const geminiApiKey = envValue(["GEMINI_API_KEY", "GOOGLE_GEMINI_API_KEY", "GOOGLE_API_KEY"], "");
const chatRateLimitMessage = "Համակարգը ծանրաբեռնված է, խնդրում ենք փորձել 1 րոպեից:";
const chatFallbackMessage = "Կներեք, այս պահին չաթը չի կարող պատասխանել։ Խնդրում ենք փորձել քիչ անց։";
const chatSystemInstruction = [
  "Դու հանդիսանում ես \"SmartTech LLC\" (սմարթ տեք) ընկերության պաշտոնական, բարեհամբույր և պրոֆեսիոնալ AI օգնականը:",
  "Քո պաշտոնական վեբկայքն է՝ http://www.smarttechllc.am/։ Քո գլխավոր նպատակն է կայքի այցելուներին արագ, հստակ և օգտակար տեղեկատվություն տրամադրել ընկերության ապրանքների, ՏՏ լուծումների և ծառայությունների մասին:",
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
  "You are the official, friendly and professional AI assistant of SmartTech LLC (Smart Tech), website: http://www.smarttechllc.am/.",
  "Supported languages are only Armenian, English and Russian. Reply in the same supported language used by the visitor. If the visitor uses another language, politely ask them to write in Armenian, English or Russian.",
  "Keep every answer human, warm and direct. Use at most 2-3 short sentences. Ask only one clear follow-up question when needed, and never ask more than 10 questions during one chat.",
  "Do not answer unrelated requests. If the topic is not SmartTech, IT equipment, engineering systems, security systems or services, politely refuse in the user's language.",
  "Site pages you know: Home, Services, Projects, Request, Partners, Team, About, Contact, Licenses, Help, FAQ, Terms, Privacy and Disclaimer.",
  "Company summary: SmartTech LLC designs, supplies, installs, configures and maintains engineering, security, network, electrical and smart building systems for business, residential, hotel, office, retail and production spaces.",
  "Core services on the website: systems design, equipment supply, installation, automation cabinet assembly, commissioning and programming, control/interface development, video surveillance, fire and security systems, network installation, electrical installation, building automation and smart systems, audio systems, Wacker systems installation and powder coating.",
  "Security systems: IP cameras, NVR/DVR recorders, remote monitoring, alarm systems, fire alarm, evacuation notification, intercoms, doorphones and access control. SmartTech works with Hikvision and other leading brands.",
  "IT and network solutions: servers, SAN/NAS storage, switches, routers, firewalls, Wi-Fi, structured cabling, racks, patch panels, server setup, IT audit and IT outsourcing.",
  "Electrical and automation solutions: power networks, lighting, distribution boards, BMS, access control logic, controllers, automation cabinets, programming, testing and user handover.",
  "Projects visible on the website include Abovyan 5/5 Hotel, Amiryan Business Center, Eria Hotel, Dalan Technopark, Wyndham Grand Tsaghkadzor, Only One residential complex, Bedeck Davtashen, Pallada Tsaghkadzor, ULS Data Center, ACBA Bank Sebastia 80, Evocabank, Movenpick Hotel and Wildberries.",
  "Current in-progress projects: Dalan Technopark, Abovyan 5/5 Hotel, Wyndham Grand Tsaghkadzor, Only One Residential Complex, Bedeck Davtashen Residential Complex and Wildberries. All other listed projects are completed.",
  "Contact details: email info@smarttechllc.am, phones +37477424643 and +37496424643, address 10 Vazgen Sargsyan St, Yerevan. For price, order or quotation questions, ask for a phone/email or suggest contacting the specialists.",
  "For project brief questions, collect only practical details: required service, object type, city/address, approximate size, deadline, contact person and phone/email."
].join("\n");
let geminiClient = null;

const pageShellAliases = {
  help: "about.html",
  faq: "about.html",
  licenses: "about.html",
  terms: "about.html",
  privacy: "about.html",
  disclaimer: "about.html"
};

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
  ".ico": "image/x-icon"
};

app.disable("x-powered-by");

if (process.env.SMARTTECH_TRUST_PROXY) {
  app.set("trust proxy", process.env.SMARTTECH_TRUST_PROXY);
}

function getGeminiClient() {
  if (!geminiApiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  }
  return geminiClient;
}

function cleanChatText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function detectChatLanguage(text) {
  const value = String(text || "");
  if (/[Ա-Ֆա-ֆև]/.test(value)) return "Armenian";
  if (/[А-Яа-яЁё]/.test(value)) return "Russian";
  if (/[A-Za-z]/.test(value)) return "English";
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

function isGeminiRateLimitError(error) {
  const status = error && (error.status || error.code || error.statusCode);
  const message = String((error && error.message) || "");
  return [429, 503].indexOf(Number(status)) >= 0 || message.indexOf("429") >= 0 || message.indexOf("503") >= 0 || /rate|quota|exhausted|overload|unavailable/i.test(message);
}

function chatLimiterHandler(request, response) {
  response.status(429).json({ reply: chatRateLimitMessage });
}

const chatUserLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
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

app.post("/api/chat", chatUserLimiter, chatGlobalLimiter, express.json({ limit: "8kb" }), async (request, response) => {
  const message = cleanChatText(request.body && request.body.message, 700);
  const pagePath = cleanChatText(request.body && request.body.page, 120);
  const replyLanguage = detectChatLanguage(message);

  if (!message) {
    response.status(400).json({ reply: "Խնդրում ենք գրել հարցը։" });
    return;
  }

  const client = getGeminiClient();
  if (!client) {
    response.status(503).json({ reply: "AI չաթը դեռ կարգավորված չէ։ Խնդրում ենք ավելացնել GEMINI_API_KEY server-ի .env ֆայլում։" });
    return;
  }

  try {
    const contents = normalizeChatHistory(request.body && request.body.history);
    contents.push({
      role: "user",
      parts: [{
        text: [
          "Current site page: " + (pagePath || "/"),
          "Detected visitor language: " + replyLanguage + ". Reply only in this language unless it is not Armenian, English or Russian.",
          "Visitor message: " + message
        ].join("\n")
      }]
    });

    const geminiResponse = await client.models.generateContent({
      model: geminiModel,
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

    const reply = cleanChatText(geminiResponse.text, 900) || "Կարո՞ղ եք հարցը մի փոքր ավելի հստակ գրել։";
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
  serveWeb(request, response);
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

  var relative = normalized === "" || normalized === "home" || normalized === "index"
    ? "pages/index.html"
    : normalized;
  var target = path.resolve(webDir, relative);
  if (target !== webDir && !target.startsWith(webDir + path.sep)) {
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

function sendStatic(response, targetPath) {
  fs.readFile(targetPath, (error, file) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }
    response.writeHead(200, {
      "content-type": mimeTypes[path.extname(targetPath).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(file);
  });
}

function resolveStaticTarget(targetInfo) {
  const relative = targetInfo.relative.replace(/\\/g, "/");
  const direct = targetInfo.target;
  const candidates = [direct];

  if (!path.extname(direct)) {
    candidates.push(direct + ".html");
  }

  const pageRelative = relative.startsWith("pages/") ? relative.slice("pages/".length) : relative;
  const aliasedPage = pageShellAliases[pageRelative.replace(/\.html$/i, "")];
  if (aliasedPage) {
    candidates.push(path.resolve(webDir, "pages", aliasedPage));
  }
  const pageTarget = path.resolve(webDir, "pages", pageRelative);
  candidates.push(pageTarget);
  if (!path.extname(pageTarget)) {
    candidates.push(pageTarget + ".html");
  }

  for (const candidate of candidates) {
    if ((candidate === webDir || candidate.startsWith(webDir + path.sep)) && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return direct;
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
    const databaseUrl = envValue([
      "SMARTTECH_FIREBASE_DATABASE_URL", "FIREBASE_DATABASE_URL",
      "VITE_FIREBASE_DATABASE_URL", "NEXT_PUBLIC_FIREBASE_DATABASE_URL"
    ], "https://jermukguide-f64ef-default-rtdb.firebaseio.com");

    const statsPath = envValue([
      "SMARTTECH_FIREBASE_STATS_PATH", "FIREBASE_STATS_PATH",
      "VITE_FIREBASE_STATS_PATH", "NEXT_PUBLIC_FIREBASE_STATS_PATH"
    ], "BlogID_201588890086708935/PostID_WebsiteStats");

    const apiKey = envValue([
      "SMARTTECH_FIREBASE_API_KEY", "FIREBASE_API_KEY",
      "VITE_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_API_KEY"
    ], "");

    const authToken = envValue([
      "SMARTTECH_FIREBASE_AUTH_TOKEN", "FIREBASE_AUTH_TOKEN",
      "VITE_FIREBASE_AUTH_TOKEN", "NEXT_PUBLIC_FIREBASE_AUTH_TOKEN"
    ], "");

    const configContent = [
      "(function (window) {",
      "  window.SmartTechRuntimeConfig = Object.assign({}, window.SmartTechRuntimeConfig, {",
      "    firebaseDatabaseUrl: " + jsString(databaseUrl) + ",",
      "    firebaseStatsPath: " + jsString(statsPath) + ",",
      "    firebaseApiKey: " + jsString(apiKey) + ",",
      "    firebaseAuthToken: " + jsString(authToken),
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
    console.log("Smart Tech web server is running:");
    console.log("  Web: " + localUrl);
    openBrowser(localUrl);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn("Port " + portToUse + " is already in use.");
      if (portToUse < 3010) {
        console.log("Trying next available port...");
        startServer(portToUse + 1);
        return;
      }
    }
    console.error(error);
    process.exit(1);
  });
}

startServer(defaultPort);
