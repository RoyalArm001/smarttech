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
  var resumeDraft = {};
  var resumeLanguage = "hy";
  var resumeSections = { experience: "Աշխատանքային փորձ", education: "Կրթություն", skills: "Հմտություններ", certifications: "Վկայականներ", languages: "Լեզուներ", portfolio: "Իմ ստեղծած կայքերը", about: "Իմ մասին" };

  function node(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function languageButtons(container, value, onChange, languages) {
    var bar = node("div", "profile-resume-languages");
    var names = { hy: "Հայերեն", en: "English", ru: "Русский" };
    languages.forEach(function (language) {
      var button = node("button", "btn btn-secondary", names[language]);
      button.type = "button";
      button.setAttribute("aria-pressed", String(value === language));
      button.addEventListener("click", function () { onChange(language); });
      bar.appendChild(button);
    });
    container.appendChild(bar);
  }

  function renderResumeEditor() {
    var container = document.getElementById("edit-profile-resume");
    if (!container) return;
    container.replaceChildren();
    languageButtons(container, resumeLanguage, function (language) { resumeLanguage = language; renderResumeEditor(); }, ["hy", "en", "ru"]);
    var sections = resumeDraft[resumeLanguage] || [];
    Object.keys(resumeSections).forEach(function (key) {
      var section = sections.find(function (item) { return item.key === key; });
      var details = node("details", "profile-resume-edit-section");
      details.appendChild(node("summary", "", (section && section.title || resumeSections[key]) + " · " + (section ? section.items.length : 0)));
      function ensureSection() {
        if (!section) {
          if (!resumeDraft[resumeLanguage]) resumeDraft[resumeLanguage] = [];
          section = { key: key, title: resumeSections[key], items: [] };
          resumeDraft[resumeLanguage].push(section);
        }
      }
      var titleLabel = node("label", "", "Բաժնի վերնագիր");
      var titleInput = node("input"); titleInput.value = section ? section.title : resumeSections[key]; titleInput.maxLength = 100;
      titleInput.addEventListener("input", function () { ensureSection(); section.title = titleInput.value; });
      titleLabel.appendChild(titleInput); details.appendChild(titleLabel);
      var entries = node("div");
      function addEntry(item) {
        var card = node("div", "profile-resume-edit-entry");
        [["title", "Անվանում", 200], ["subtitle", "Կազմակերպություն / ժամանակահատված", 300], ["description", "Նկարագրություն", 1500], ["url", "Հղում (ոչ պարտադիր)", 600]].forEach(function (field) {
          var label = node("label", "", field[1]);
          var input = node(field[0] === "description" ? "textarea" : "input");
          if (field[0] === "url") input.type = "url";
          input.value = item[field[0]] || ""; input.maxLength = field[2];
          input.addEventListener("input", function () { item[field[0]] = input.value; });
          label.appendChild(input); card.appendChild(label);
        });
        var remove = node("button", "btn btn-secondary", "Հեռացնել գրառումը"); remove.type = "button";
        remove.addEventListener("click", function () { section.items.splice(section.items.indexOf(item), 1); card.remove(); });
        card.appendChild(remove); entries.appendChild(card);
      }
      if (section) section.items.forEach(addEntry);
      details.appendChild(entries);
      var add = node("button", "btn btn-secondary", "+ Ավելացնել գրառում"); add.type = "button";
      add.addEventListener("click", function () { ensureSection(); if (section.items.length >= 30) return; var item = { title: "", subtitle: "", description: "", url: "" }; section.items.push(item); addEntry(item); });
      details.appendChild(add); container.appendChild(details);
    });
  }

  function renderPublicResume(resume, language) {
    var container = document.getElementById("public-profile-resume");
    if (!container) return;
    container.replaceChildren();
    var languages = ["hy", "en", "ru"].filter(function (key) { return Array.isArray(resume[key]) && resume[key].some(function (section) { return section.items.length; }); });
    if (!languages.length) return;
    language = languages.includes(language) ? language : languages[0];
    languageButtons(container, language, function (next) { renderPublicResume(resume, next); }, languages);
    var grid = node("div", "profile-resume-grid"); grid.lang = language;
    resume[language].forEach(function (section) {
      if (!section.items.length) return;
      var card = node("section", "profile-resume-card");
      card.appendChild(node("h2", "", section.title));
      section.items.forEach(function (item) {
        var entry = node("article", "profile-resume-entry");
        entry.appendChild(node("h3", "", item.title));
        if (item.subtitle) entry.appendChild(node("p", "profile-resume-meta", item.subtitle));
        if (item.description) entry.appendChild(node("p", "", item.description));
        if (item.url) {
          try {
            var url = new URL(item.url);
            if (/^https?:$/.test(url.protocol) && !url.username && !url.password) {
              var link = node("a", "", url.hostname + " ↗"); link.href = url.href; link.target = "_blank"; link.rel = "noopener noreferrer"; entry.appendChild(link);
            }
          } catch (error) {}
        }
        card.appendChild(entry);
      });
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

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
          if (!response.ok) {
            var err = "Հարցումը չհաջողվեց";
            if (typeof payload.error === "string") err = payload.error;
            else if (payload.error && typeof payload.error.message === "string") err = payload.error.message;
            else if (typeof payload.message === "string") err = payload.message;
            throw new Error(err);
          }
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
    resumeDraft = JSON.parse(JSON.stringify(profile.resume || {}));
    renderResumeEditor();
    var fullName = profile.full_name || profile.username || "Աշխատակից";
    document.getElementById("edit-full-name").value = profile.full_name || "";
    document.getElementById("edit-username").value = profile.username || "";
    document.getElementById("edit-email").value = profile.email || "";
    document.getElementById("edit-phone").value = profile.phone || "";
    document.getElementById("edit-website").value = profile.website || "";
    editForm.querySelectorAll('[data-profile-social]').forEach(function (input) { input.value = (profile.social_links || {})[input.dataset.profileSocial] || ""; });
    document.getElementById("edit-picture").value = profile.avatar_url || "";
    document.getElementById("edit-message").value = profile.bio || "";
    document.getElementById("edit-new-password").value = "";
    document.getElementById("profile-heading-name").textContent = fullName;
    if (profile.position !== undefined || !document.getElementById("edit-position").value) {
      document.getElementById("edit-position").value = profile.position || "Հաստիքը նշված չէ";
      document.getElementById("profile-heading-position").textContent = [profile.position, profile.department].filter(Boolean).join(" · ");
    }
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
      if (payload.profile && (String(payload.profile.role || "").toLowerCase() === "admin" || String(payload.profile.email || "").toLowerCase() === "admin@smarttechllc.am")) {
        window.location.replace("/admin");
        return;
      }
      fillProfile(payload.profile);
      showOnly("edit");
    });
  }

  function checkSession() {
    // Նախ ստուգել admin session - եթե admin ա, անմիջապես redirect /admin
    return requestJson("/api/admin/session").then(function (adminPayload) {
      if (adminPayload && adminPayload.authenticated) {
        window.location.replace("/admin");
        return;
      }
      // Admin session չկա, ստուգել user session
      return requestJson("/api/auth/session").then(function (payload) {
        if (!payload.authenticated) {
          showOnly("login");
          return;
        }
        if (payload.user && (String(payload.user.role || "").toLowerCase() === "admin" || String(payload.user.email || "").toLowerCase() === "admin@smarttechllc.am")) {
          window.location.replace("/admin");
          return;
        }
        return loadPrivateProfile();
      }).catch(function () { showOnly("login"); });
    }).catch(function () {
      // /api/admin/session fail, fallback to user session check
      return requestJson("/api/auth/session").then(function (payload) {
        if (!payload.authenticated) {
          showOnly("login");
          return;
        }
        if (payload.user && (String(payload.user.role || "").toLowerCase() === "admin" || String(payload.user.email || "").toLowerCase() === "admin@smarttechllc.am")) {
          window.location.replace("/admin");
          return;
        }
        return loadPrivateProfile();
      }).catch(function () { showOnly("login"); });
    });
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
      document.title = (profile.full_name || profile.username || "Profile") + " | Smart Tech";
      if (usernameNode) usernameNode.textContent = profile.username ? "@" + profile.username : "";
      if (bio) bio.textContent = profile.bio || "";
      if (picture) { picture.hidden = !profile.avatar_url; if (profile.avatar_url) picture.src = profile.avatar_url; }
      if (email) { email.hidden = !profile.email; email.href = profile.email ? "mailto:" + profile.email : "#"; email.textContent = profile.email || ""; }
      var links = document.getElementById('public-profile-links');
      links.replaceChildren();
      var labels = { website: 'Կայք', facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', telegram: 'Telegram', github: 'GitHub', youtube: 'YouTube', whatsapp: 'WhatsApp' };
      // Trusted SVG markup only; profile URLs never become HTML.
      var icons = {
        website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a19 19 0 0 1 0 18 19 19 0 0 1 0-18Z"/>',
        facebook: '<path d="M14 21v-8h3l.5-4H14V7c0-1 .5-1.5 1.5-1.5H18V2h-3c-3 0-5 2-5 5v2H7v4h3v8Z" fill="currentColor" stroke="none"/>',
        instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
        linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m4 0v-7m0 3a3 3 0 0 1 6 0v4"/><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/>',
        telegram: '<path d="m21 3-4 18-6-5-3 3 1-6 9-7-12 8-4-2Z"/>',
        github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1-.3-1.7-1-2 3-.3 6-1.5 6-6a5 5 0 0 0-1.5-3.5A5 5 0 0 0 18 3s-1.5-.5-4 1a14 14 0 0 0-4 0C7.5 2.5 6 3 6 3a5 5 0 0 0-.5 3.5A5 5 0 0 0 4 10c0 4.5 3 5.7 6 6-.7.3-1 1-1 2v4"/>',
        youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none"/>',
        whatsapp: '<path d="m3 21 1.5-5A9 9 0 1 1 3 11.5c0 1.6.5 3.1 1.5 4.5M3 21l5-1.5"/><path d="M8 7c-2 3 2 7 5 9 2 1 4 0 4-2l-3-1-1 1c-2-1-3-2-4-4l1-1Z"/>'
      };
      var urls = Object.assign({}, profile.social_links, { website: profile.website });
      Object.keys(labels).forEach(function (key) {
        try {
          var url = new URL(urls[key]);
          if (!/^https?:$/.test(url.protocol)) return;
          var anchor = document.createElement('a');
          anchor.href = url.href; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
          anchor.setAttribute('aria-label', labels[key]); anchor.title = labels[key];
          anchor.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + icons[key] + '</svg>';
          links.appendChild(anchor);
        } catch (error) {}
      });
      renderPublicResume(profile.resume || {}, "hy");
    }).catch(function (error) {
      if (publicView) publicView.replaceChildren(node("p", "error-msg", error.message || "Profile not found"));
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
            .then(function (payload) {
              if (payload && payload.user && (String(payload.user.role || "").toLowerCase() === "admin" || String(payload.user.email || "").toLowerCase() === "admin@smarttechllc.am")) {
                window.location.assign("/admin");
              } else {
                window.location.assign("/profile");
              }
            });
        })
        .catch(function (error) { loginError.textContent = error.message || "Մուտք գործելը հնարավոր չէ"; });
    });
  }

  if (pictureFile) pictureFile.addEventListener("change", function () {
    var file = pictureFile.files && pictureFile.files[0];
    if (!file) return;
    if (file.size > 7 * 1024 * 1024) { editStatus.textContent = "Նկարը պետք է լինի մինչև 7MB"; return; }
    editStatus.textContent = "Նկարը բեռնվում է...";
    pictureFile.disabled = true;
    editForm.querySelector('[type="submit"]').disabled = true;
    fileToDataUrl(file).then(function (dataUrl) {
      return requestJson("/api/profile/avatar", { method: "POST", body: { file: { name: file.name, mime: file.type, data: dataUrl } } });
    }).then(function (payload) {
      document.getElementById("edit-picture").value = payload.url || "";
      updateAvatar(payload.url, document.getElementById("edit-full-name").value);
      editStatus.textContent = "Նկարը բեռնված է։ Սեղմեք «Պահպանել»։";
    }).catch(function (error) { editStatus.textContent = error.message; }).finally(function () {
      pictureFile.disabled = false;
      pictureFile.value = "";
      editForm.querySelector('[type="submit"]').disabled = false;
    });
  });

  if (editForm) editForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var payload = {
      resume: resumeDraft,
      full_name: document.getElementById("edit-full-name").value.trim(),
      username: document.getElementById("edit-username").value.trim(),
      phone: document.getElementById("edit-phone").value.trim(),
      website: document.getElementById("edit-website").value.trim(),
      social_links: Array.from(editForm.querySelectorAll('[data-profile-social]')).reduce(function (links, input) { links[input.dataset.profileSocial] = input.value.trim(); return links; }, {}),
      picture: document.getElementById("edit-picture").value.trim(),
      message: document.getElementById("edit-message").value.trim(),
      newPassword: document.getElementById("edit-new-password").value
    };
    editStatus.textContent = "Պահպանվում է...";
    requestJson("/api/profile", { method: "PUT", body: payload }).then(function (result) {
      fillProfile(result.profile || payload);
      try { localStorage.setItem('smarttech.cms.updated', String(Date.now())); } catch (error) {}
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
