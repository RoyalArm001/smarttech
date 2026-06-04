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
          var childLabel = child.label || site.i18n.get(child.labelKey || "", child.labelKey || "");
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
          headerLanguageSwitcher +
          themeToggle +
          '<div class="header-install-slot" data-pwa-install-slot hidden></div>' +
        '</div>' +
      '</div>';
  };
})(window.SmartTech);
