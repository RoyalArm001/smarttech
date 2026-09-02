(function (site) {
  function flagSvg(language) {
    if (language === "ru") {
      return '' +
        '<svg viewBox="0 0 64 40" role="img" aria-hidden="true">' +
          '<rect width="64" height="40" fill="#ffffff"></rect>' +
          '<rect y="13.33" width="64" height="13.33" fill="#1f4fa8"></rect>' +
          '<rect y="26.66" width="64" height="13.34" fill="#c93838"></rect>' +
        '</svg>';
    }

    if (language === "en") {
      return '' +
        '<svg viewBox="0 0 64 40" role="img" aria-hidden="true">' +
          '<rect width="64" height="40" fill="#b22234"></rect>' +
          '<rect y="3" width="64" height="3" fill="#ffffff"></rect>' +
          '<rect y="9" width="64" height="3" fill="#ffffff"></rect>' +
          '<rect y="15" width="64" height="3" fill="#ffffff"></rect>' +
          '<rect y="21" width="64" height="3" fill="#ffffff"></rect>' +
          '<rect y="27" width="64" height="3" fill="#ffffff"></rect>' +
          '<rect y="33" width="64" height="3" fill="#ffffff"></rect>' +
          '<rect width="28" height="21" fill="#3c3b6e"></rect>' +
          '<circle cx="5" cy="4" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="10.5" cy="4" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="16" cy="4" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="21.5" cy="4" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="7.75" cy="8.5" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="13.25" cy="8.5" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="18.75" cy="8.5" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="5" cy="13" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="10.5" cy="13" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="16" cy="13" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="21.5" cy="13" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="7.75" cy="17.5" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="13.25" cy="17.5" r="1.2" fill="#ffffff"></circle>' +
          '<circle cx="18.75" cy="17.5" r="1.2" fill="#ffffff"></circle>' +
        '</svg>';
    }

    return '' +
      '<svg viewBox="0 0 64 40" role="img" aria-hidden="true">' +
        '<rect width="64" height="40" fill="#c93838"></rect>' +
        '<rect y="13.33" width="64" height="13.33" fill="#1f4fa8"></rect>' +
        '<rect y="26.66" width="64" height="13.34" fill="#e39b1f"></rect>' +
      '</svg>';
  }

  function chatPageSvg() {
    return '' +
      '<svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">' +
        '<path d="M7.5 9.25h9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path>' +
        '<path d="M7.5 13.1h5.7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path>' +
        '<path d="M12 21c5.1 0 8.75-3.25 8.75-8.15 0-4.65-3.55-7.85-8.75-7.85s-8.75 3.2-8.75 7.85c0 2.22.82 4.12 2.24 5.53l-.5 2.46c-.08.39.32.71.68.55l2.46-1.1A10.4 10.4 0 0 0 12 21Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>' +
        '<path d="M16.9 4.3c.12-.72.74-1.3 1.5-1.3s1.38.58 1.5 1.3c.74.13 1.3.74 1.3 1.5s-.56 1.37-1.3 1.5c-.12.72-.74 1.3-1.5 1.3s-1.38-.58-1.5-1.3c-.74-.13-1.3-.74-1.3-1.5s.56-1.37 1.3-1.5Z" fill="currentColor" opacity=".28"></path>' +
      '</svg>';
  }

  function profilePageSvg() {
    return '' +
      '<svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="8" r="3.25" fill="none" stroke="currentColor" stroke-width="1.7"></circle>' +
        '<path d="M4.8 20c.55-3.35 3.25-5.35 7.2-5.35s6.65 2 7.2 5.35" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>' +
      '</svg>';
  }

  site.sections.header = function header() {
    var e = site.utils.escapeHtml;
    var company = site.content.company;
    var brandTitle = String(company.name || "Smart Tech").replace(/smat\s*tach/i, "Smart Tech");
    var hasLogo = Boolean(company.logo);
    var brandLogo = hasLogo ? '<img src="' + e(company.logo) + '" alt="Smart Tech logo" loading="lazy" decoding="async">' : "";
    var page = "home";
    if (window.location.protocol === "file:") {
      page = (window.location.hash || "#home").replace("#", "").split("/")[0] || "home";
    } else {
      var parts = window.location.pathname
        .replace(/\/+$/g, "")
        .split("/")
        .filter(Boolean);

      if (parts[0] === "pages") {
        parts.shift();
      }

      page = parts[0] || "home";
      if (page.indexOf(".") >= 0) {
        page = page.split(".")[0];
      }
      if (page === "index" || page === "") page = "home";
    }
    if (page === "our-jobs" || page === "ourjobs") page = "projects";
    if (page === "service") page = "services";
    if (page === "project") page = "projects";
    if (page === "member") page = "team";

    var activeDetailId = "";
    if (window.location.search) {
      try {
        activeDetailId = new URLSearchParams(window.location.search).get("id") || "";
      } catch (error) {
        activeDetailId = "";
      }
    }

    function navRouteFromItem(item) {
      var route = String(item.href || "").replace("#", "");
      if (route === "top" || route === "/top") route = "home";
      return route;
    }

    function isChildNavActive(childHref) {
      if (!childHref) return false;
      var path = window.location.pathname.replace(/\/+$/g, "") || "/";
      var hash = window.location.hash || "";
      var childUrl;
      try {
        childUrl = new URL(childHref, window.location.origin);
      } catch (error) {
        return false;
      }
      var childPath = childUrl.pathname.replace(/\/+$/g, "") || "/";
      var childHash = childUrl.hash || "";
      if (childPath !== path) return false;
      if (childHash) return hash === childHash;
      if (page === "service" || page === "project" || page === "member") {
        return childHref.indexOf("id=" + encodeURIComponent(activeDetailId)) >= 0;
      }
      return path === childPath && !childHash;
    }

    function renderNavItems() {
      var navData = site.content.navigation || [];
      return navData.map(function (item) {
        var route = navRouteFromItem(item);
        var href = site.utils.pageUrl(route);
        var label = item.label || site.i18n.get("nav." + route, route);
        var children = (item.submenu || item.children) && typeof site.content.buildNavChildren === "function"
          ? site.content.buildNavChildren(route) || []
          : [];
        var parentActive = route === page ||
          (page === "service" && route === "services") ||
          (page === "project" && route === "projects") ||
          (page === "album" && route === "projects") ||
          (page === "member" && route === "team");
        var childActive = children.some(function (child) {
          return isChildNavActive(child.href);
        });
        var parentClass = "nav-link notranslate nav-link-parent" +
          (parentActive || childActive ? " is-active" : "");

        if (!children.length) {
          return '<a class="' + parentClass.replace(" nav-link-parent", "") + '" href="' + e(href) + '" translate="no">' + e(label) + "</a>";
        }

        var submenuId = "nav-submenu-" + e(route);
        var sublinks = children.map(function (child) {
          var childLabel = child.label || "";
                    if (!childLabel && child.labelKey && site.i18n && typeof site.i18n.get === "function") {
                      childLabel = site.i18n.get(child.labelKey, "");
                    }
          var subClass = "nav-sublink notranslate" + (isChildNavActive(child.href) ? " is-active" : "");
          return '<a class="' + subClass + '" href="' + e(child.href) + '" translate="no">' + e(childLabel) + "</a>";
        }).join("");

        return "" +
          '<div class="nav-item has-children' + (parentActive || childActive ? " is-route-active" : "") + '" data-nav-item="' + e(route) + '">' +
            '<div class="nav-item-head">' +
              '<a class="' + parentClass + '" href="' + e(href) + '" translate="no">' + e(label) + "</a>" +
              '<button class="nav-expand-btn" type="button" aria-expanded="false" aria-controls="' + submenuId + '" aria-label="' + e(label) + '">' +
                '<span class="nav-expand-icon" aria-hidden="true"></span>' +
              "</button>" +
            "</div>" +
            '<div class="nav-submenu" id="' + submenuId + '" hidden>' + sublinks + "</div>" +
          "</div>";
      }).join("");
    }

    var navItems = renderNavItems();

    var languageButtons = [
      { code: "hy", short: "AM", label: "Armenian" },
      { code: "ru", short: "RU", label: "Russian" },
      { code: "en", short: "EN", label: "English" }
    ].map(function (language) {
      return '' +
        '<button class="language-button notranslate" type="button" data-online-lang="' + e(language.code) + '" aria-label="' + e(language.label) + '" translate="no">' +
          '<span class="language-flag">' + flagSvg(language.code) + "</span>" +
          '<span class="language-code notranslate" aria-hidden="true" translate="no" lang="en">' + e(language.short) + "</span>" +
          '<span class="visually-hidden notranslate" translate="no" lang="en">' + e(language.short) + "</span>" +
        "</button>";
    }).join("");

    function renderLanguageSwitcher(className) {
      return '' +
      '<div class="language-switcher ' + e(className) + ' notranslate" aria-label="Language switcher" translate="no" data-language-switcher>' +
        '<button class="language-toggle notranslate" type="button" aria-label="Language options" aria-expanded="false" translate="no" data-language-toggle>' +
          '<span class="language-toggle-flag" aria-hidden="true" data-language-current-flag>' + flagSvg("hy") + '</span>' +
          '<span class="language-toggle-code notranslate" translate="no" lang="en" data-language-current-code>AM</span>' +
          '<span class="language-toggle-caret" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="language-menu" role="menu" data-language-menu>' + languageButtons + '</div>' +
      "</div>";
    }

    var headerLanguageSwitcher = renderLanguageSwitcher("header-language-switcher");
    var mobileMenuCloseLabel = site.i18n.get("header.mobile.close", "Close menu");

    // Theme toggle (day/night) placed in topbar next to language switcher
    var themeToggle = '<button type="button" class="theme-toggle" data-theme-toggle aria-label="Toggle day/night mode" title="Day / Night mode"></button>';
    var chatLabel = site.i18n.get("nav.chat", "AI assistant");
    var chatPageLink = '' +
      '<a class="chat-page-link' + (page === "chat" ? " is-active" : "") + '" href="' + e(site.utils.pageUrl("chat")) + '" aria-label="' + e(chatLabel) + '" title="' + e(chatLabel) + '">' +
        chatPageSvg() +
      "</a>";
    var profileLabel = site.i18n.get("nav.profile", "Profile");
    var profilePageLink = '' +
      '<a class="profile-page-link' + (page === "profile" ? " is-active" : "") + '" href="' + e(site.utils.pageUrl("profile")) + '" aria-label="' + e(profileLabel) + '" title="' + e(profileLabel) + '">' +
        profilePageSvg() +
      "</a>";

    return '' +
      '<div class="container header-inner">' +
        '<a class="brand ' + (hasLogo ? "" : "brand-no-logo ") + 'notranslate" href="' + e(site.utils.pageUrl("home")) + '" aria-label="Smart Tech home" translate="no">' +
          brandLogo +
          '<span class="brand-title notranslate" translate="no" lang="en">' + e(brandTitle) + '</span>' +
        '</a>' +
        '<button class="nav-backdrop" type="button" aria-label="Close menu"></button>' +
        '<nav id="main-menu-panel" class="nav-panel notranslate" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Main menu" translate="no">' +
          '<div class="mobile-menu-sheet-top">' +
            '<span class="mobile-menu-handle" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="mobile-menu-head ' + (hasLogo ? "" : "mobile-menu-head-no-logo") + '">' +
            brandLogo +
            '<span class="mobile-brand-title notranslate" translate="no" lang="en">' + e(brandTitle) + '</span>' +
            '<button type="button" class="mobile-menu-close" data-mobile-menu-close aria-label="' + e(mobileMenuCloseLabel) + '">' +
              '<span aria-hidden="true"></span>' +
            "</button>" +
            '<p class="mobile-menu-toolbar-title notranslate" translate="no">' + e(site.i18n.get("header.mobile.navigation", "Navigation")) + '</p>' +
          '</div>' +
          '<div class="mobile-menu-section mobile-menu-nav">' +
            '<div class="mobile-nav-list mobile-nav-grid notranslate" translate="no">' + navItems + '</div>' +
          '</div>' +
        '</nav>' +
        '<div class="header-actions">' +
          '<button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-menu-panel">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          profilePageLink +
          chatPageLink +
          headerLanguageSwitcher +
          themeToggle +
          '<div class="header-install-slot" data-pwa-install-slot hidden></div>' +
        '</div>' +
      '</div>';
  };
})(window.SmartTech);
