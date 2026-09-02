(function () {
  let currentProfile = null;

  const loginView = document.getElementById("profile-login-view");
  const editView = document.getElementById("profile-edit-view");
  const loginForm = document.getElementById("profile-login-form");
  const editForm = document.getElementById("profile-edit-form");
  const logoutBtn = document.getElementById("profile-logout-btn");
  const adminBtn = document.getElementById("profile-admin-btn");
  const loginError = document.getElementById("login-error");
  const editStatus = document.getElementById("edit-status");

  function clearSession() {
    currentProfile = null;
  }

  function showView(viewName) {
    if (!loginView || !editView) return;
    if (viewName === "login") {
      loginView.hidden = false;
      editView.hidden = true;
    } else {
      loginView.hidden = true;
      editView.hidden = false;
    }
  }

  function populateProfile(user) {
    const pictureInput = document.getElementById("edit-picture");
    const emailInput = document.getElementById("edit-email");
    const messageInput = document.getElementById("edit-message");
    const userData = user || {};

    if (pictureInput) pictureInput.value = userData.picture || userData.avatar_url || "";
    if (emailInput) emailInput.value = userData.email || "";
    if (messageInput) messageInput.value = userData.message || userData.bio || "";

    if (adminBtn) {
      adminBtn.hidden = String(userData.role || "member").toLowerCase() !== "admin";
    }
  }

  function clearStatus() {
    if (editStatus) {
      editStatus.textContent = "";
      editStatus.style.color = "";
    }
  }

  async function checkAuth() {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "same-origin",
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Session expired");
      }

      const payload = await response.json();
      if (payload && payload.authenticated && payload.user) {
        currentProfile = payload.user;
        populateProfile(payload.user);
        showView("edit");
        return;
      }
    } catch (error) {
      // Ignore and fall back to login state.
    }

    clearSession();
    showView("login");
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (loginError) loginError.textContent = "";

      const emailInput = document.getElementById("login-username") || document.getElementById("login-email");
      const passwordInput = document.getElementById("login-password");
      const email = String((emailInput && emailInput.value) || "").trim();
      const password = String((passwordInput && passwordInput.value) || "");

      if (!email || !password) {
        if (loginError) loginError.textContent = "Էլ. հասցեն և գաղտնաբառը պարտադիր են";
        return;
      }

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload && payload.error ? payload.error : "Login failed");
        }

        if (payload && payload.user) {
          currentProfile = payload.user;
          populateProfile(payload.user);
          showView("edit");
        }
        loginForm.reset();
      } catch (error) {
        if (loginError) loginError.textContent = error && error.message ? error.message : "Մուտք գործելը հնարավոր չէ";
      }
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      clearStatus();
      if (editStatus) {
        editStatus.textContent = "Պահպանվում է...";
      }

      const payload = {
        picture: document.getElementById("edit-picture").value.trim(),
        email: document.getElementById("edit-email").value.trim(),
        message: document.getElementById("edit-message").value.trim()
      };

      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result && result.error ? result.error : "Profile save failed");
        }

        const profile = (result && result.profile) || payload;
        currentProfile = profile;
        populateProfile(profile);

        if (editStatus) {
          editStatus.textContent = "Պահպանված է";
          editStatus.style.color = "#4caf50";
        }
      } catch (error) {
        if (editStatus) {
          editStatus.textContent = error && error.message ? error.message : "Չհաջողվեց պահել";
          editStatus.style.color = "#fca5a5";
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "same-origin"
        });
      } catch (error) {
        // Ignore network errors during logout.
      }
      clearSession();
      showView("login");
      const passwordInput = document.getElementById("login-password");
      if (passwordInput) passwordInput.value = "";
      clearStatus();
    });
  }

  if (loginView && editView) {
    checkAuth();
  }

  // Profile is also a standalone page. Render the shared chrome here so it
  // remains visible even when the generic route renderer is unavailable.
  const sharedSite = window.SmartTech;
  const headerHost = document.getElementById("site-header");
  if (headerHost && !headerHost.innerHTML.trim()) {
    try {
      if (sharedSite && sharedSite.sections && typeof sharedSite.sections.header === "function") {
        headerHost.innerHTML = sharedSite.sections.header();
      }
    } catch (error) {
      // Keep the profile page usable even if an optional content module fails.
    }
    if (!headerHost.innerHTML.trim()) {
      headerHost.innerHTML = '<div class="container header-inner profile-fallback-header"><a class="brand brand-no-logo notranslate" href="/home"><span class="brand-title">Smart Tech</span></a><div class="header-actions"><a class="profile-page-link is-active" href="/profile" aria-label="Profile" title="Profile"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4.8 20c.55-3.35 3.25-5.35 7.2-5.35s6.65 2 7.2 5.35" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></a><a class="chat-page-link" href="/chat" aria-label="AI assistant" title="AI assistant"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 9.25h9M7.5 13.1h5.7M12 21c5.1 0 8.75-3.25 8.75-8.15 0-4.65-3.55-7.85-8.75-7.85s-8.75 3.2-8.75 7.85c0 2.22.82 4.12 2.24 5.53l-.5 2.46c-.08.39.32.71.68.55l2.46-1.1A10.4 10.4 0 0 0 12 21Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a></div></div>';
    }
  }
  const footerHost = document.getElementById("site-footer");
  if (footerHost && sharedSite && sharedSite.sections && typeof sharedSite.sections.footer === "function" && !footerHost.innerHTML.trim()) {
    footerHost.innerHTML = sharedSite.sections.footer();
  }
})();
