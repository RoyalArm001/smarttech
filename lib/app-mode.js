function normalizeMode(value) {
  const mode = String(value || "").trim().toLowerCase();
  if (mode === "admin" || mode === "web" || mode === "all") return mode;
  return "";
}

function currentMode() {
  const explicit = normalizeMode(process.env.SMARTTECH_APP_MODE);
  if (explicit) return explicit;
  return "all";
}

const mode = currentMode();

module.exports = {
  mode: mode,
  isAdmin: function () {
    return mode === "admin";
  },
  isWeb: function () {
    return mode === "web";
  },
  isCombined: function () {
    return mode === "all";
  },
  isAdminEnabled: function () {
    return mode === "admin" || mode === "all";
  },
  isWebEnabled: function () {
    return mode === "web" || mode === "all";
  },
  webOrigin: function () {
    return String(process.env.SMARTTECH_WEB_ORIGIN || "http://localhost:3000").replace(/\/+$/g, "");
  }
};
