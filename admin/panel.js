(function () {
  "use strict";

  var state = {
    csrfToken: "",
    album: { photos: [] },
    admin: null
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function webOrigin() {
    return String(window.SMARTTECH_WEB_ORIGIN || "").replace(/\/+$/g, "");
  }

  function webUrl(path) {
    var route = String(path || "/");
    var origin = webOrigin();
    if (!origin) return route;
    return origin + (route.charAt(0) === "/" ? route : "/" + route);
  }

  function bindWebLinks() {
    var home = document.querySelector(".admin-brand");
    var links = document.querySelectorAll('.admin-topnav a[href="/album"], .admin-topnav a[href="/home"]');
    if (home) {
      home.href = webUrl("/home");
      home.target = "_blank";
      home.rel = "noopener noreferrer";
    }
    links.forEach(function (link) {
      link.href = webUrl(link.getAttribute("href") || "/home");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function setStatus(message, isError) {
    var status = byId("admin-status");
    if (!status) return;
    status.textContent = message || "";
    status.classList.toggle("is-error", !!isError);
  }

  window.adminSetStatus = setStatus;
  window.adminRequestJson = requestJson;

  function setBusy(form, busy) {
    if (!form) return;
    Array.prototype.forEach.call(form.querySelectorAll("button, input, select"), function (control) {
      control.disabled = !!busy;
    });
  }

  function requestJson(url, options) {
    options = options || {};
    var headers = Object.assign({ "Accept": "application/json" }, options.headers || {});
    var method = String(options.method || "GET").toUpperCase();

    if (options.body && typeof options.body !== "string") {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.body);
    }

    if (method !== "GET" && state.csrfToken) {
      headers["X-CSRF-Token"] = state.csrfToken;
    }

    return window.fetch(url, Object.assign({}, options, {
      method: method,
      headers: headers,
      credentials: "same-origin",
      cache: "no-store"
    })).then(function (response) {
      return response.text().then(function (text) {
        var payload = {};
        try {
          payload = text ? JSON.parse(text) : {};
        } catch (error) {
          payload = { error: text || "Unexpected response" };
        }
        if (!response.ok) {
          throw new Error(payload.error || "Request failed");
        }
        return payload;
      });
    });
  }

  function showLogin(payload) {
    byId("admin-login").hidden = false;
    byId("admin-panel").hidden = true;
    byId("admin-logout").hidden = true;
    var hint = byId("admin-login-hint");
    if (hint && payload && payload.adminPasswordUsingDefault === true) {
      hint.textContent = "Default password: SmartTech@2026. Change it later by setting SMARTTECH_ADMIN_PASSWORD.";
    } else if (hint && payload && payload.adminPasswordConfigured === false) {
      hint.textContent = "Admin password is not configured on the server. Set SMARTTECH_ADMIN_PASSWORD or ADMIN_PASSWORD.";
    }
  }

  function showPanel() {
    byId("admin-login").hidden = true;
    byId("admin-panel").hidden = false;
    byId("admin-logout").hidden = false;
    switchWorkspace("cms");
  }

  function switchWorkspace(name) {
    var cms = byId("admin-workspace-cms");
    var album = byId("admin-workspace-album");
    var api = byId("admin-workspace-api");
    if (cms) cms.hidden = name !== "cms";
    if (album) album.hidden = name !== "album";
    if (api) api.hidden = name !== "api";

    ["cms", "album", "api"].forEach(function (tabName) {
      var tab = byId("admin-tab-" + tabName);
      if (tab) tab.classList.toggle("is-active", tabName === name);
    });

    if (name === "cms" && window.SmartTechAdminCms && typeof window.SmartTechAdminCms.open === "function") {
      window.SmartTechAdminCms.open();
    }
  }

  function setupWorkspaceTabs() {
    document.querySelectorAll("[data-admin-workspace]").forEach(function (button) {
      button.addEventListener("click", function () {
        switchWorkspace(button.getAttribute("data-admin-workspace"));
      });
    });
  }

  function applySession(payload) {
    state.csrfToken = payload.csrfToken || state.csrfToken || "";
    state.album = payload.album || state.album || { photos: [] };
    state.admin = payload.admin || state.admin || null;

    var expiry = byId("admin-session-expiry");
    if (expiry && payload.expiresAt) {
      expiry.textContent = "Expires " + new Date(payload.expiresAt).toLocaleString();
    }

    renderAlbum(state.album);
    renderAdmin(state.admin);
    showPanel();
  }

  function renderAdmin(admin) {
    if (!admin) return;
    var settings = admin.settings || {};
    var security = admin.security || {};

    byId("settings-gemini-model").value = settings.geminiModel || "";
    byId("settings-firebase-url").value = settings.firebaseDatabaseUrl || "";
    byId("settings-firebase-path").value = settings.firebaseStatsPath || "";

    renderApiState(settings);
    renderSecurity(security);
  }

  function renderApiState(settings) {
    var target = byId("admin-api-state");
    if (!target) return;

    var rows = [
      ["Gemini key", settings.geminiApiKeyConfigured ? "Configured" : "Missing"],
      ["Gemini admin override", settings.geminiApiKeyFromAdmin ? "On" : "Off"],
      ["Firebase key", settings.firebaseApiKeyConfigured ? "Configured" : "Missing"],
      ["Firebase admin override", settings.firebaseApiKeyFromAdmin ? "On" : "Off"],
      ["Firebase auth token", settings.firebaseAuthTokenConfigured ? "Configured" : "Missing"]
    ];

    target.innerHTML = rows.map(function (row) {
      return "<div><span>" + escapeHtml(row[0]) + "</span><strong>" + escapeHtml(row[1]) + "</strong></div>";
    }).join("");
  }

  function renderSecurity(security) {
    var target = byId("admin-security-list");
    if (!target) return;

    var rows = [
      ["Session TTL", String(security.sessionMinutes || 0) + " minutes"],
      ["CSRF", security.csrf ? "Enabled" : "Off"],
      ["Same-origin guard", security.sameOriginGuard ? "Enabled" : "Off"],
      ["Image sanitizer", security.uploadResize ? "Sharp WEBP resize" : "Off"],
      ["Upload limit", String(security.uploadMaxMb || 0) + " MB"],
      ["Allowed types", (security.allowedImageTypes || []).join(", ")]
    ];

    target.innerHTML = rows.map(function (row) {
      return "<li><span>" + escapeHtml(row[0]) + "</span><strong>" + escapeHtml(row[1]) + "</strong></li>";
    }).join("");
  }

  function renderAlbum(album) {
    var target = byId("admin-album-list");
    var count = byId("admin-album-count");
    var photos = (album && album.photos) || [];
    if (count) count.textContent = String(photos.length);
    if (!target) return;

    if (!photos.length) {
      target.innerHTML = '<p class="admin-empty">No uploaded album images yet.</p>';
      return;
    }

    target.innerHTML = photos.map(function (photo) {
      return '' +
        '<article class="admin-photo-card">' +
          '<img src="' + escapeHtml(photo.image) + '" alt="' + escapeHtml(photo.caption || photo.title || "Album image") + '" loading="lazy" decoding="async">' +
          '<div class="admin-photo-meta">' +
            '<small>' + escapeHtml(photo.section === "current" ? "Active" : "Completed") + '</small>' +
            '<strong>' + escapeHtml(photo.title || "Smart Tech") + '</strong>' +
            '<span>' + escapeHtml(photo.caption || "") + '</span>' +
            '<button type="button" data-delete-photo="' + escapeHtml(photo.id) + '">Delete</button>' +
          '</div>' +
        '</article>';
    }).join("");
  }

  function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(String(reader.result || ""));
      };
      reader.onerror = function () {
        reject(new Error("Image read failed"));
      };
      reader.readAsDataURL(file);
    });
  }

  function setupLoginForm() {
    var form = byId("admin-login-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      setBusy(form, true);
      setStatus("Checking password...");

      requestJson("/api/admin/login", {
        method: "POST",
        body: { password: byId("admin-password").value }
      })
        .then(function (payload) {
          byId("admin-password").value = "";
          setStatus("");
          applySession(payload);
        })
        .catch(function (error) {
          setStatus(error.message, true);
        })
        .finally(function () {
          setBusy(form, false);
        });
    });
  }

  function setupAlbumForm() {
    var form = byId("admin-album-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var fileInput = byId("album-file");
      var file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) {
        setStatus("Choose an image first.", true);
        return;
      }
      if (file.size > 7 * 1024 * 1024) {
        setStatus("Image size must be 7 MB or less.", true);
        return;
      }

      setBusy(form, true);
      setStatus("Uploading image...");

      fileToDataUrl(file)
        .then(function (dataUrl) {
          var section = byId("album-section").value;
          return requestJson("/api/admin/album/images", {
            method: "POST",
            body: {
              section: section,
              title: byId("album-title").value,
              caption: byId("album-caption").value,
              status: byId("album-status").value || (section === "current" ? "Active work" : "Completed work"),
              file: {
                name: file.name,
                mime: file.type,
                data: dataUrl
              }
            }
          });
        })
        .then(function (payload) {
          state.album = payload.album || state.album;
          renderAlbum(state.album);
          form.reset();
          setStatus("Image added to the public album.");
        })
        .catch(function (error) {
          setStatus(error.message, true);
        })
        .finally(function () {
          setBusy(form, false);
        });
    });
  }

  function setupAlbumList() {
    var list = byId("admin-album-list");
    if (!list) return;
    list.addEventListener("click", function (event) {
      var button = event.target.closest("[data-delete-photo]");
      if (!button) return;
      var id = button.getAttribute("data-delete-photo");
      if (!id || !window.confirm("Delete this album image?")) return;

      button.disabled = true;
      setStatus("Deleting image...");
      requestJson("/api/admin/album/images/" + encodeURIComponent(id), { method: "DELETE" })
        .then(function (payload) {
          state.album = payload.album || state.album;
          renderAlbum(state.album);
          setStatus("Image deleted.");
        })
        .catch(function (error) {
          button.disabled = false;
          setStatus(error.message, true);
        });
    });
  }

  function setupSettingsForm() {
    var form = byId("admin-settings-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var body = {
        geminiModel: byId("settings-gemini-model").value,
        firebaseDatabaseUrl: byId("settings-firebase-url").value,
        firebaseStatsPath: byId("settings-firebase-path").value
      };

      if (byId("settings-gemini-key").value.trim()) body.geminiApiKey = byId("settings-gemini-key").value.trim();
      if (byId("settings-firebase-key").value.trim()) body.firebaseApiKey = byId("settings-firebase-key").value.trim();
      if (byId("settings-firebase-token").value.trim()) body.firebaseAuthToken = byId("settings-firebase-token").value.trim();
      if (byId("clear-gemini-key").checked) body.geminiApiKey = "__CLEAR__";
      if (byId("clear-firebase-key").checked) body.firebaseApiKey = "__CLEAR__";
      if (byId("clear-firebase-token").checked) body.firebaseAuthToken = "__CLEAR__";

      setBusy(form, true);
      setStatus("Saving API settings...");
      requestJson("/api/admin/settings", {
        method: "PUT",
        body: body
      })
        .then(function (payload) {
          state.admin = payload;
          ["settings-gemini-key", "settings-firebase-key", "settings-firebase-token"].forEach(function (id) {
            byId(id).value = "";
          });
          ["clear-gemini-key", "clear-firebase-key", "clear-firebase-token"].forEach(function (id) {
            byId(id).checked = false;
          });
          renderAdmin(payload);
          setStatus("API settings saved.");
        })
        .catch(function (error) {
          setStatus(error.message, true);
        })
        .finally(function () {
          setBusy(form, false);
        });
    });
  }

  function setupLogout() {
    var button = byId("admin-logout");
    if (!button) return;
    button.addEventListener("click", function () {
      requestJson("/api/admin/logout", { method: "POST" })
        .catch(function () {})
        .finally(function () {
          state.csrfToken = "";
          state.album = { photos: [] };
          state.admin = null;
          setStatus("");
          showLogin();
        });
    });
  }

  function init() {
    bindWebLinks();
    setupLoginForm();
    setupAlbumForm();
    setupAlbumList();
    setupSettingsForm();
    setupLogout();
    setupWorkspaceTabs();
    if (window.SmartTechAdminCms && typeof window.SmartTechAdminCms.init === "function") {
      window.SmartTechAdminCms.init();
    }

    requestJson("/api/admin/session")
      .then(function (payload) {
        if (payload.authenticated) {
          applySession(payload);
        } else {
          showLogin(payload);
        }
      })
      .catch(function (error) {
        setStatus(error.message, true);
        showLogin();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
