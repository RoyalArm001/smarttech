(function () {
  "use strict";

  var state = {
    csrfToken: "",
    album: { photos: [] },
    media: [],
    teamOptions: [],
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
    if (hint) hint.textContent = "Մուտք գործեք Supabase-ում գրանցված ադմին հաշվով։";
  }

  function showPanel() {
    byId("admin-login").hidden = true;
    byId("admin-panel").hidden = false;
    byId("admin-logout").hidden = false;
    switchWorkspace("cms");
  }

  function switchWorkspace(name) {
    var cms = byId("admin-workspace-cms");
    var media = byId("admin-workspace-media");
    var album = byId("admin-workspace-album");
    var api = byId("admin-workspace-api");
    var users = byId("admin-workspace-users");
    var messages = byId("admin-workspace-messages");
    var collections = byId("admin-sidebar-collections");
    if (cms) cms.hidden = name !== "cms";
    if (media) media.hidden = name !== "media";
    if (album) album.hidden = name !== "album";
    if (api) api.hidden = name !== "api";
    if (users) users.hidden = name !== "users";
    if (messages) messages.hidden = name !== "messages";
    if (collections) collections.hidden = name !== "cms";

    ["cms", "media", "album", "api", "users", "messages"].forEach(function (tabName) {
      var tab = byId("admin-tab-" + tabName);
      if (tab) tab.classList.toggle("is-active", tabName === name);
    });

    if (name === "messages" && window.SmartTechMessages) window.SmartTechMessages.load();
    if (name === "users") {
      fetchUsers();
    }

    if (name === "media") {
      fetchMedia();
    }

    if (name === "cms" && window.SmartTechAdminCms && typeof window.SmartTechAdminCms.open === "function") {
      window.SmartTechAdminCms.open();
    }

    closeSidebar();
  }

  window.adminSwitchWorkspace = switchWorkspace;

  function setupWorkspaceTabs() {
    document.querySelectorAll("[data-admin-workspace]").forEach(function (button) {
      button.addEventListener("click", function () {
        switchWorkspace(button.getAttribute("data-admin-workspace"));
      });
    });
  }

  function closeSidebar() {
    var sidebar = byId("admin-sidebar");
    var toggle = byId("admin-sidebar-toggle");
    if (sidebar) sidebar.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function setupSidebar() {
    var sidebar = byId("admin-sidebar");
    var toggle = byId("admin-sidebar-toggle");
    if (!sidebar || !toggle) return;
    toggle.addEventListener("click", function () {
      var open = sidebar.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (event) {
      if (window.innerWidth > 820 || !sidebar.classList.contains("is-open")) return;
      if (sidebar.contains(event.target) || toggle.contains(event.target)) return;
      closeSidebar();
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

  function fetchMedia() {
    setStatus("Նկարները բեռնվում են...");
    return requestJson("/api/admin/media")
      .then(function (payload) {
        state.media = payload.assets || [];
        renderMedia(state.media);
        setStatus("");
      })
      .catch(function (error) {
        setStatus("Նկարները չբեռնվեցին․ " + error.message, true);
      });
  }

  function renderMedia(assets) {
    var list = byId("admin-media-list");
    var count = byId("admin-media-count");
    if (count) count.textContent = String((assets || []).length);
    if (!list) return;
    if (!assets || !assets.length) {
      list.innerHTML = '<p class="admin-empty">Storage-ում դեռ նկարներ չկան։</p>';
      return;
    }
    list.innerHTML = assets.map(function (asset) {
      return '' +
        '<article class="admin-media-card">' +
          '<img src="' + escapeHtml(asset.url) + '" alt="' + escapeHtml(asset.title || asset.originalName || "Media") + '" loading="lazy" decoding="async">' +
          '<div class="admin-media-meta">' +
            '<strong>' + escapeHtml(asset.title || asset.originalName || "Նկար") + '</strong>' +
            '<small>' + escapeHtml(asset.bucket + "/" + asset.path) + '</small>' +
            '<div class="admin-media-actions">' +
              '<button type="button" data-copy-media="' + escapeHtml(asset.url) + '">Պատճենել URL</button>' +
              '<button type="button" data-delete-media="' + escapeHtml(asset.id) + '">Ջնջել</button>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join("");
  }

  function setupMedia() {
    var form = byId("admin-media-form");
    var list = byId("admin-media-list");
    var refresh = byId("admin-media-refresh");
    if (refresh) refresh.addEventListener("click", fetchMedia);

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = byId("media-file");
        var file = input && input.files && input.files[0];
        if (!file) return setStatus("Ընտրեք նկարը։", true);
        if (file.size > 7 * 1024 * 1024) return setStatus("Նկարը պետք է լինի մինչև 7MB։", true);
        setBusy(form, true);
        setStatus("Նկարը բեռնվում է Supabase Storage...");
        fileToDataUrl(file)
          .then(function (dataUrl) {
            return requestJson("/api/admin/media/images", {
              method: "POST",
              body: {
                folder: byId("media-folder").value,
                title: byId("media-title").value,
                file: { name: file.name, mime: file.type, data: dataUrl }
              }
            });
          })
          .then(function (payload) {
            if (payload.asset) state.media.unshift(payload.asset);
            renderMedia(state.media);
            form.reset();
            setStatus("Նկարը հաջողությամբ բեռնվեց։");
          })
          .catch(function (error) { setStatus(error.message, true); })
          .finally(function () { setBusy(form, false); });
      });
    }

    if (list) {
      list.addEventListener("click", function (event) {
        var copyButton = event.target.closest("[data-copy-media]");
        if (copyButton) {
          var url = copyButton.getAttribute("data-copy-media") || "";
          navigator.clipboard.writeText(url).then(function () { setStatus("Նկարի URL-ը պատճենված է։"); });
          return;
        }
        var deleteButton = event.target.closest("[data-delete-media]");
        if (!deleteButton) return;
        var id = deleteButton.getAttribute("data-delete-media");
        if (!id || !window.confirm("Ջնջե՞լ այս նկարը Storage-ից։")) return;
        deleteButton.disabled = true;
        requestJson("/api/admin/media/" + encodeURIComponent(id), { method: "DELETE" })
          .then(function () {
            state.media = state.media.filter(function (asset) { return asset.id !== id; });
            renderMedia(state.media);
            setStatus("Նկարը ջնջված է։");
          })
          .catch(function (error) { deleteButton.disabled = false; setStatus(error.message, true); });
      });
    }
  }

  function setupLoginForm() {
    var form = byId("admin-login-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      setBusy(form, true);
      setStatus("Checking Supabase account...");

      requestJson("/api/admin/login", {
        method: "POST",
        body: {
          email: byId("admin-email").value,
          password: byId("admin-password").value
        }
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

  function fetchUsers() {
    Promise.all([
      requestJson("/api/admin/users"),
      requestJson("/api/admin/team-options")
    ])
      .then(function(payloads) {
        state.teamOptions = payloads[1].members || [];
        renderTeamOptions(state.teamOptions);
        renderUsers(payloads[0].users || []);
      })
      .catch(function(err) {
        setStatus("Failed to load users: " + err.message, true);
      });
  }

  function renderTeamOptions(members) {
    var select = byId("user-employee-id");
    if (!select) return;
    var selected = select.value;
    function optionMarkup(member) {
      var label = member.name || member.title || member.id;
      if (member.title && member.title !== label) label += " — " + member.title;
      if (member.account && member.account.email) label += " · login՝ " + member.account.email;
      return '<option value="' + escapeHtml(member.id) + '"' + (selected === member.id ? " selected" : "") + '>' + escapeHtml(label) + '</option>';
    }
    var allMembers = members || [];
    var specialists = allMembers.filter(function (member) { return member.roleLevel === "specialist"; });
    var others = allMembers.filter(function (member) { return member.roleLevel !== "specialist"; });
    select.innerHTML = '<option value="">— Ընտրել մասնագետին —</option>' +
      (specialists.length ? '<optgroup label="Մասնագետներ (' + specialists.length + ')">' + specialists.map(optionMarkup).join("") + '</optgroup>' : "") +
      (others.length ? '<optgroup label="Ղեկավարներ և այլ թիմի անդամներ (' + others.length + ')">' + others.map(optionMarkup).join("") + '</optgroup>' : "");
  }

  function renderUsers(users) {
    var list = byId("admin-users-list");
    if (!list) return;

    if (!users.length) {
      list.innerHTML = "<p>No users found.</p>";
      return;
    }

    var html = users.map(function(u) {
      var ownerNote = u.owner ? " <em>(Owner — պաշտպանված)</em>" : "";
      var actions = u.owner
        ? "<span class='admin-users-protected'>Պաշտպանված հաշիվ</span>"
        : "<button type='button' class='admin-btn-secondary' onclick='window.editUser(\"" + u.id + "\")'>Խմբագրել</button> " +
          "<button type='button' class='admin-btn-secondary admin-btn-danger' onclick='window.deleteUser(\"" + u.id + "\")'>Ջնջել</button>";
      var member = u.teamMember || {};
      var avatar = member.image || u.picture || "";
      return "<article class='admin-user-card'>" +
        (avatar ? "<img src='" + escapeHtml(avatar) + "' alt='' loading='lazy'>" : "<span class='admin-user-avatar'>" + escapeHtml(String(member.name || u.username || "U").charAt(0).toUpperCase()) + "</span>") +
        "<div class='admin-user-main'><div class='admin-user-title'><strong>" + escapeHtml(member.name || u.fullName || u.username) + "</strong>" + ownerNote + "<span>" + escapeHtml(u.role) + "</span></div>" +
        "<p>" + escapeHtml(member.title || "Թիմի անդամը ընտրված չէ") + "</p>" +
        "<small>Login: " + escapeHtml(u.email || "-") + " · Profile: /profile/" + escapeHtml(u.username || "-") + "</small></div>" +
        "<div class='admin-user-actions'>" + actions + "</div>" +
        "</article>";
    }).join("");
    list.innerHTML = html;

    window.allUsers = users;
  }

  window.editUser = function(id) {
    if (!window.allUsers) return;
    var user = window.allUsers.find(function(u) { return u.id === id; });
    if (!user) return;

    byId("user-id").value = user.id;
    byId("user-username").value = user.username || "";
    byId("user-email").value = user.email || "";
    byId("user-role").value = user.role;
    byId("user-employee-id").value = user.employeeId || "";
    byId("user-cancel-btn").hidden = false;
    byId("user-password").required = false;
    window.scrollTo(0, 0);
  };

  window.deleteUser = function(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    requestJson("/api/admin/users/" + id, { method: "DELETE" })
      .then(function(payload) {
        setStatus("User deleted");
        renderUsers(payload.users || []);
      })
      .catch(function(err) {
        setStatus("Failed to delete user: " + err.message, true);
      });
  };

  function setupUsersForm() {
    var form = byId("admin-user-form");
    var cancelBtn = byId("user-cancel-btn");
    var teamSelect = byId("user-employee-id");

    if (!form) return;

    function resetForm() {
      form.reset();
      byId("user-id").value = "";
      cancelBtn.hidden = true;
      byId("user-password").required = true;
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", resetForm);
    }

    if (teamSelect) {
      teamSelect.addEventListener("change", function () {
        var member = state.teamOptions.find(function (item) { return item.id === teamSelect.value; });
        if (!member) return;
        if (!byId("user-id").value && member.roleLevel === "specialist") {
          byId("user-role").value = "member";
        }
        if (!byId("user-username").value.trim()) {
          byId("user-username").value = String(member.id || "").toLowerCase().replace(/[^a-z0-9._-]/g, "-").slice(0, 80);
        }
        if (!byId("user-email").value.trim() && member.email) {
          byId("user-email").value = member.email;
        }
      });
    }

    form.addEventListener("submit", function(e) {
      e.preventDefault();

      var id = byId("user-id").value;
      var body = {
        username: byId("user-username").value.trim(),
        email: byId("user-email").value.trim(),
        role: byId("user-role").value,
        employeeId: byId("user-employee-id").value
      };

      var pw = byId("user-password").value;
      if (pw) body.password = pw;

      if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$/.test(body.username)) {
        setStatus("Username must contain 3-80 latin characters.", true);
        return;
      }
      var isEdit = !!id;
      var endpoint = isEdit ? "/api/admin/users/" + id : "/api/admin/users";
      var method = isEdit ? "PUT" : "POST";

      setBusy(form, true);
      setStatus("Saving user...");

      requestJson(endpoint, {
        method: method,
        body: body
      })
      .then(function(payload) {
        setStatus("User saved successfully.");
        renderUsers(payload.users || []);
        resetForm();
      })
      .catch(function(err) {
        setStatus(err.message, true);
      })
      .finally(function() {
        setBusy(form, false);
      });
    });
  }

  function init() {
    bindWebLinks();
    setupLoginForm();
    setupAlbumForm();
    setupAlbumList();
    setupMedia();
    setupSettingsForm();
    setupUsersForm();
    setupLogout();
    setupWorkspaceTabs();
    setupSidebar();
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
