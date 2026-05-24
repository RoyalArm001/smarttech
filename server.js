const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const rootDir = __dirname;
const webDir = path.resolve(rootDir, "web");
const metricsFile = path.resolve(rootDir, ".smarttech-metrics.dat");
const contactRequestsFile = path.resolve(rootDir, ".smarttech-contact-requests.log");
const projectsSourceFile = path.resolve(webDir, "src", "content", "projects", "index.js");
const requestedPort = Number(process.env.WEB_PORT || process.env.PORT || 3000);
const defaultPort = Number.isNaN(requestedPort) ? 3000 : requestedPort;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
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
  var pathname = requestUrl.pathname.replace(/\/+$/, "") || "/";
  var cleanPath = pathname;

  if (cleanPath.indexOf("/pages/") === 0) {
    cleanPath = "/" + cleanPath.slice("/pages/".length);
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

  if (cleanPath !== pathname) {
    return cleanPath + requestUrl.search;
  }

  return null;
}

function parseJsonBody(request) {
  return new Promise(function (resolve, reject) {
    var body = "";
    request.on("data", function (chunk) {
      body += chunk.toString();
      if (body.length > 1e6) {
        reject(new Error("Request body too large"));
        request.socket.destroy();
      }
    });
    request.on("end", function () {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, body, status) {
  response.writeHead(status || 200, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(body));
}

function sendError(response, status, message) {
  sendJson(response, { error: message || "Server error" }, status || 500);
}

function cleanContactField(value, limit) {
  return String(value || "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, limit || 1000);
}

function saveContactRequest(payload) {
  return new Promise(function (resolve, reject) {
    var line = JSON.stringify(payload) + "\n";
    fs.appendFile(contactRequestsFile, line, "utf8", function (error) {
      if (error) reject(error);
      else resolve();
    });
  });
}

var metricsState = { visits: 0, updatedAt: Date.now() };
var projectsCountCache = { mtimeMs: 0, count: 0 };
var metricsPersistTimer = null;

function loadMetricsState() {
  var defaults = { visits: 0, updatedAt: Date.now() };
  try {
    if (!fs.existsSync(metricsFile)) return defaults;
    var raw = fs.readFileSync(metricsFile, "utf8");
    raw.split(/\r?\n/).forEach(function (line) {
      var parts = line.split("=");
      if (parts.length < 2) return;
      var key = parts[0].trim();
      var value = Number(parts.slice(1).join("=").trim());
      if (!Number.isFinite(value)) return;
      if (key === "visits") defaults.visits = Math.max(0, Math.floor(value));
      if (key === "updatedAt") defaults.updatedAt = Math.max(0, Math.floor(value));
    });
  } catch (error) {
    return defaults;
  }
  return defaults;
}

function persistMetricsState() {
  var body = [
    "visits=" + String(Math.max(0, Math.floor(metricsState.visits || 0))),
    "updatedAt=" + String(Math.max(0, Math.floor(metricsState.updatedAt || Date.now())))
  ].join("\n");

  fs.writeFile(metricsFile, body, function () {});
}

function scheduleMetricsPersist() {
  if (metricsPersistTimer) {
    clearTimeout(metricsPersistTimer);
  }
  metricsPersistTimer = setTimeout(function () {
    metricsPersistTimer = null;
    persistMetricsState();
  }, 120);
}

function readProjectsCount() {
  try {
    var stat = fs.statSync(projectsSourceFile);
    if (projectsCountCache.mtimeMs === stat.mtimeMs && projectsCountCache.count > 0) {
      return projectsCountCache.count;
    }
    var source = fs.readFileSync(projectsSourceFile, "utf8");
    var count = (source.match(/\bid\s*:\s*(?:"[^"]+"|'[^']+')/g) || []).length;
    projectsCountCache = { mtimeMs: stat.mtimeMs, count: count };
    return count;
  } catch (error) {
    return projectsCountCache.count || 0;
  }
}

function metricsPayload() {
  return {
    visits: Math.max(0, Math.floor(metricsState.visits || 0)),
    projects: readProjectsCount(),
    updatedAt: Math.max(0, Math.floor(metricsState.updatedAt || Date.now()))
  };
}

metricsState = loadMetricsState();

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

function serveApi(request, response) {
  var url = new URL(request.url, "http://localhost");
  var pathName = url.pathname;

  if (pathName === "/api/contact" && request.method === "POST") {
    return parseJsonBody(request).then(function (body) {
      var payload = {
        createdAt: new Date().toISOString(),
        name: cleanContactField(body.name, 120),
        phone: cleanContactField(body.phone, 80),
        email: cleanContactField(body.email, 160),
        message: cleanContactField(body.message, 3000),
        source: "website"
      };

      if (!payload.name || !payload.phone || !payload.message) {
        return sendError(response, 400, "Name, phone and message are required.");
      }

      return saveContactRequest(payload).then(function () {
        sendJson(response, { ok: true });
      }).catch(function () {
        sendError(response, 500, "Could not save contact request.");
      });
    }).catch(function () {
      sendError(response, 400, "Invalid JSON body.");
    });
  }

  if (pathName === "/api/contact") {
    return sendError(response, 405, "Method not allowed.");
  }

  if (pathName === "/api/metrics" && request.method === "GET") {
    return sendJson(response, metricsPayload());
  }

  if (pathName === "/api/metrics/visit" && request.method === "POST") {
    metricsState.visits = Math.max(0, Math.floor(metricsState.visits || 0)) + 1;
    metricsState.updatedAt = Date.now();
    scheduleMetricsPersist();
    return sendJson(response, metricsPayload());
  }

  if (pathName === "/api/metrics" || pathName === "/api/metrics/visit") {
    return sendError(response, 405, "Method not allowed.");
  }

  return false;
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

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, "index.html");
  }

  sendStatic(response, target);
}

function startServer(portToUse) {
  const server = http.createServer((request, response) => {
    if (serveApi(request, response) === false) {
      serveWeb(request, response);
    }
  });

  server.listen(portToUse, () => {
    console.log("Smart Tech web server is running:");
    console.log("  Web: http://localhost:" + portToUse + "/");
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
