const fs = require("fs");
const http = require("http");
const path = require("path");
const { execFile } = require("child_process");
const { URL } = require("url");

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

const requestedPort = Number(process.env.WEB_PORT || process.env.PORT || 3000);
const defaultPort = Number.isNaN(requestedPort) ? 3000 : requestedPort;
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
  const server = http.createServer(serveWeb);

  server.listen(portToUse, () => {
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
