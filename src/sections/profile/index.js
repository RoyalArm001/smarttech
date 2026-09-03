(function () {
  "use strict";

  var loginView = document.getElementById("profile-login-view");
  var loginForm = document.getElementById("profile-login-form");
  var loginError = document.getElementById("login-error");
  var saveEmailBtn = document.getElementById("save-password-btn");
  var publicView = document.getElementById("profile-public-view");
  var editView = document.getElementById("profile-edit-view");
  var editForm = document.getElementById("profile-edit-form");
  var editStatus = document.getElementById("edit-status");
  var logoutButton = document.getElementById("profile-logout-btn");
  var pictureFile = document.getElementById("edit-picture-file");
  var savedEmailKey = "smarttech.saved-email.v1";

  function savedEmail() {
    try { return String(localStorage.getItem(savedEmailKey) || ""); } catch (error) { return ""; }
  }

  function setSavedEmail(enabled) {
    if (!saveEmailBtn) return;
    saveEmailBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
    saveEmailBtn.classList.toggle("is-enabled", enabled);
    var label = saveEmailBtn.querySelector(".save-password-label");
    if (label) label.textContent = enabled ? "Էլ․ հասցեն հիշվում է" : "Հիշել էլ․ հասցեն";
  }

  function showOnly(view) {
    document.body.classList.toggle("profile-edit-mode", view === "edit");
    document.body.classList.toggle("profile-public-mode", view === "public");
    if (loginView) loginView.hidden = view !== "login";
    if (editView) editView.hidden = view !== "edit";
    if (publicView) publicView.hidden = view !== "public";
  }

  function requestJson(url, options) {
    options = options || {};
    var headers = Object.assign({ Accept: "application/json" }, options.headers || {});
    if (options.body && typeof options.body !== "string") {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.body);
    }
    return fetch(url, Object.assign({}, options, { headers: headers, credentials: "same-origin", cache: "no-store" }))
      .then(function (response) {
        return response.text().then(function (text) {
          var payload = {};
          try { payload = text ? JSON.parse(text) : {}; } catch (error) { payload = {}; }
          if (!response.ok) throw new Error(payload.error || "Հարցումը չհաջողվեց");
          return payload;
        });
      });
  }

  function updateAvatar(url, name) {
    var image = document.getElementById("profile-avatar-preview");
    var fallback = document.getElementById("profile-avatar-fallback");
    if (image) {
      image.hidden = !url;
      if (url) image.src = url;
    }
    if (fallback) {
      fallback.hidden = !!url;
      fallback.textContent = String(name || "ST").split(/\s+/).map(function (part) { return part.charAt(0); }).join("").slice(0, 2).toUpperCase() || "ST";
    }
  }

  function fillProfile(profile) {
    var fullName = profile.full_name || profile.username || "Աշխատակից";
    document.getElementById("edit-full-name").value = profile.full_name || "";
    document.getElementById("edit-username").value = profile.username || "";
    document.getElementById("edit-email").value = profile.email || "";
    document.getElementById("edit-phone").value = profile.phone || "";
    document.getElementById("edit-picture").value = profile.avatar_url || "";
    document.getElementById("edit-message").value = profile.bio || "";
    document.getElementById("edit-new-password").value = "";
    document.getElementById("profile-heading-name").textContent = fullName;
    var publicLink = document.getElementById("profile-public-link");
    if (publicLink) {
      publicLink.href = profile.username ? "/profile/" + encodeURIComponent(profile.username) : "#";
      publicLink.hidden = !profile.username;
    }
    var adminLink = document.getElementById("profile-admin-btn");
    if (adminLink) adminLink.hidden = profile.role !== "admin";
    updateAvatar(profile.avatar_url, fullName);
  }

  function loadPrivateProfile() {
    return requestJson("/api/profile").then(function (payload) {
      if (!payload.profile || payload.profile.is_active === false) throw new Error("Profile is not active");
      fillProfile(payload.profile);
      showOnly("edit");
    });
  }

  function checkSession() {
    return requestJson("/api/auth/session").then(function (payload) {
      if (!payload.authenticated) {
        showOnly("login");
        return;
      }
      return loadPrivateProfile();
    }).catch(function () { showOnly("login"); });
  }

  function loadPublicProfile(username) {
    showOnly("public");
    return requestJson("/api/profile/public/" + encodeURIComponent(username)).then(function (payload) {
      var profile = payload.profile || {};
      var name = document.getElementById("public-profile-name");
      var usernameNode = document.getElementById("public-profile-username");
      var bio = document.getElementById("public-profile-bio");
      var picture = document.getElementById("public-profile-picture");
      var email = document.getElementById("public-profile-email");
      if (name) name.textContent = profile.full_name || profile.username || "Smart Tech";
      if (usernameNode) usernameNode.textContent = profile.username ? "@" + profile.username : "";
      if (bio) bio.textContent = profile.bio || "";
      if (picture) { picture.hidden = !profile.avatar_url; if (profile.avatar_url) picture.src = profile.avatar_url; }
      if (email) { email.hidden = !profile.email; email.href = profile.email ? "mailto:" + profile.email : "#"; email.textContent = profile.email || ""; }
    }).catch(function (error) {
      if (publicView) publicView.innerHTML = '<p class="error-msg">' + String(error.message || "Profile not found") + '</p>';
    });
  }

  function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || "")); };
      reader.onerror = function () { reject(new Error("Նկարը չհաջողվեց կարդալ")); };
      reader.readAsDataURL(file);
    });
  }

  if (loginForm) {
    var emailField = document.getElementById("login-email");
    var passwordField = document.getElementById("login-password");
    var rememberedEmail = savedEmail();
    if (rememberedEmail) { emailField.value = rememberedEmail; setSavedEmail(true); }

    if (saveEmailBtn) saveEmailBtn.addEventListener("click", function () {
      var enabled = saveEmailBtn.getAttribute("aria-pressed") === "true";
      if (enabled) { localStorage.removeItem(savedEmailKey); setSavedEmail(false); return; }
      var email = String(emailField.value || "").trim();
      if (!email) { loginError.textContent = "Նախ լրացրեք էլ․ հասցեն"; return; }
      localStorage.setItem(savedEmailKey, email);
      setSavedEmail(true);
    });

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = String(emailField.value || "").trim();
      var password = String(passwordField.value || "");
      loginError.textContent = "";
      if (!email || !password) { loginError.textContent = "Էլ․ հասցեն և գաղտնաբառը պարտադիր են"; return; }
      if (saveEmailBtn && saveEmailBtn.getAttribute("aria-pressed") === "true") localStorage.setItem(savedEmailKey, email);

      requestJson("/api/admin/login", { method: "POST", body: { email: email, password: password } })
        .then(function () { window.location.assign("/admin"); })
        .catch(function () {
          return requestJson("/api/auth/login", { method: "POST", body: { email: email, password: password } })
            .then(function () { window.location.assign("/profile"); });
        })
        .catch(function (error) { loginError.textContent = error.message || "Մուտք գործելը հնարավոր չէ"; });
    });
  }

  if (pictureFile) pictureFile.addEventListener("change", function () {
    var file = pictureFile.files && pictureFile.files[0];
    if (!file) return;
    if (file.size > 7 * 1024 * 1024) { editStatus.textContent = "Նկարը պետք է լինի մինչև 7MB"; return; }
    editStatus.textContent = "Նկարը բեռնվում է...";
    fileToDataUrl(file).then(function (dataUrl) {
      return requestJson("/api/profile/avatar", { method: "POST", body: { file: { name: file.name, mime: file.type, data: dataUrl } } });
    }).then(function (payload) {
      document.getElementById("edit-picture").value = payload.url || "";
      updateAvatar(payload.url, document.getElementById("edit-full-name").value);
      editStatus.textContent = "Նկարը բեռնված է։ Սեղմեք «Պահպանել»։";
    }).catch(function (error) { editStatus.textContent = error.message; });
  });

  if (editForm) editForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var payload = {
      full_name: document.getElementById("edit-full-name").value.trim(),
      username: document.getElementById("edit-username").value.trim(),
      phone: document.getElementById("edit-phone").value.trim(),
      picture: document.getElementById("edit-picture").value.trim(),
      message: document.getElementById("edit-message").value.trim(),
      newPassword: document.getElementById("edit-new-password").value
    };
    editStatus.textContent = "Պահպանվում է...";
    requestJson("/api/profile", { method: "PUT", body: payload }).then(function (result) {
      fillProfile(result.profile || payload);
      editStatus.textContent = "Փոփոխությունները պահպանված են։";
    }).catch(function (error) { editStatus.textContent = error.message; });
  });

  if (logoutButton) logoutButton.addEventListener("click", function () {
    requestJson("/api/auth/logout", { method: "POST" }).catch(function () {}).then(function () { window.location.assign("/login"); });
  });

  var publicMatch = window.location.pathname.match(/^\/profile\/([^/]+)\/?$/i);
  if (publicMatch) loadPublicProfile(publicMatch[1]);
  else checkSession();
})();
