(function (site) {
  var pages = ["home", "services", "projects", "request", "partners", "team", "about", "contact", "member"];
  var entryLoader = null;
  var shouldHideEntryLoaderAfterRender = false;
  var firstRenderDone = false;
  var chatUi = null;
  var chatLanguage = null;
  var chatTypingTimer = null;
  var chatHistory = [];
  var chatHistoryLimit = 40;
  var chatSurveyState = null;
  var backToTopUi = null;
  var routeTransition = null;
  var routeTransitionTimer = null;
  var uiSettingsStorageKey = "smarttech.uiSettings";
  var onlineLangStorageKey = "smarttech.onlineLang";
  var metricsVisitSessionKey = "smarttech.metrics.visitSession";
  var staticMetricsStorageKey = "smarttech.metrics.staticVisits";
  var chatDismissedSessionKey = "smarttech.chat.dismissed";
  var onlineTranslateScriptLoaded = false;
  var googleUiCleanupTimer = null;
  var languageOutsideClickHandler = null;
  var menuOutsideClickHandler = null;
  var menuEscHandler = null;
  var menuResizeHandler = null;
  var autoThemeTimer = null;
  var uiSettings = readUiSettings();

  var googleAnalyticsMeasurementId = "G-XXXXXXXXXX"; // Replace with your GA4 measurement ID
  var DISABLE_GOOGLE_TRANSLATE = true; // Set to true to disable Google Translate widget for faster performance


  function initializeGoogleAnalytics() {
    if (!googleAnalyticsMeasurementId || googleAnalyticsMeasurementId.indexOf("G-") !== 0) return;
    if (window.googleAnalyticsInitialized) return;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(googleAnalyticsMeasurementId);
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", googleAnalyticsMeasurementId, { page_path: window.location.pathname + window.location.search });
    window.googleAnalyticsInitialized = true;
  }

  function trackGoogleAnalyticsPageView() {
    if (!googleAnalyticsMeasurementId || typeof window.gtag !== "function") return;
    window.gtag("config", googleAnalyticsMeasurementId, { page_path: window.location.pathname + window.location.search });
  }

  function normalizePageName(page) {
    var normalized = String(page || "").toLowerCase();
    if (!normalized || normalized === "index") return "home";
    if (normalized === "our-jobs" || normalized === "ourjobs") return "projects";
    return normalized;
  }

  function currentRoute() {
    function routeFromParts(parts, fallbackId) {
      var page = normalizePageName(parts[0] || "home");
      var id = fallbackId || parts[1] || "";

      if (page === "service" || page === "project" || page === "member") {
        return { page: page, id: id };
      }

      return { page: pages.indexOf(page) >= 0 ? page : "home", id: "" };
    }

    if (window.location.protocol === "file:") {
      var hash = (window.location.hash || "#home").replace("#", "");
      var parts = hash.split("/").filter(Boolean);
      return routeFromParts(parts, "");
    } else {
      var params = new URLSearchParams(window.location.search);
      var id = params.get("id") || "";
      var parts = window.location.pathname
        .replace(/\/+$/g, "")
        .split("/")
        .filter(Boolean);

      if (parts[0] === "pages") {
        parts.shift();
      }

      var last = parts[parts.length - 1] || "";
      if (last.indexOf(".") >= 0) {
        parts[parts.length - 1] = last.split(".")[0];
      }

      if (parts[parts.length - 1] === "index") {
        parts.pop();
      }

      return routeFromParts(parts, id);
    }
  }

  function pageMarkup(page) {
    if (page === "home") {
      return [
        site.sections.hero(),
        site.sections.trustBar(),
        site.sections.home()
      ].join("");
    }

    if (page === "services") return site.sections.services();
    if (page === "service") return site.sections.serviceDetail(currentRoute().id);
    if (page === "projects") return site.sections.projects();
    if (page === "project") return site.sections.projectDetail(currentRoute().id);
    if (page === "request") return site.sections.request();
    if (page === "member") return site.sections.memberDetail(currentRoute().id);
    if (page === "partners") return site.sections.partners();
    if (page === "team") return site.sections.team();
    if (page === "about") return site.sections.about();
    if (page === "contact") return site.sections.contact();

    return site.sections.hero();
  }

  function hasNoTranslateAncestor(node) {
    var element = node && (node.nodeType === 1 ? node : node.parentElement);
    return !!(element && element.closest(".notranslate, [translate='no'], [data-no-translate]"));
  }

  function protectBrandText(root) {
    if (!root || !document.createTreeWalker) return;

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || hasNoTranslateAncestor(parent)) return NodeFilter.FILTER_REJECT;
        if (/^(SCRIPT|STYLE|TEXTAREA|TITLE|NOSCRIPT)$/i.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return /Smart\s+Tech|SMART\s+TECH/i.test(node.nodeValue || "")
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(function (node) {
      var text = node.nodeValue || "";
      var parts = text.split(/(Smart\s+Tech(?:\s+LLC)?|SMART\s+TECH(?:\s+LLC)?)/g);
      if (parts.length < 2) return;

      var fragment = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (!part) return;
        if (/^(Smart\s+Tech(?:\s+LLC)?|SMART\s+TECH(?:\s+LLC)?)$/i.test(part)) {
          var span = document.createElement("span");
          span.className = "notranslate";
          span.setAttribute("translate", "no");
          span.setAttribute("lang", "en");
          span.setAttribute("data-no-translate", "brand");
          span.textContent = part;
          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      if (node.parentNode) {
        node.parentNode.replaceChild(fragment, node);
      }
    });
  }

  function elementHasDirectText(element) {
    return Array.prototype.some.call(element.childNodes, function (node) {
      return node.nodeType === 3 && /\S/.test(node.nodeValue || "");
    });
  }

  function assignTranslationIds(root, page) {
    if (!root) return;
    var counter = 0;
    var selector = [
      "h1", "h2", "h3", "h4", "p", "span", "strong", "small", "em",
      "a", "button", "label", "li", "figcaption"
    ].join(",");

    root.querySelectorAll(selector).forEach(function (element) {
      if (hasNoTranslateAncestor(element)) return;
      if (!elementHasDirectText(element)) return;
      if (!/\S/.test(element.textContent || "")) return;
      if (element.matches("[aria-hidden='true'], .visually-hidden")) return;
      counter += 1;
      element.setAttribute("translate", "yes");
      if (!element.hasAttribute("data-translate-id")) {
        element.setAttribute("data-translate-id", page + "-" + String(counter).padStart(3, "0"));
      }
    });
  }

  function applyTranslationBoundaries(page) {
    protectBrandText(document.body);
    assignTranslationIds(document.getElementById("site-main"), page);
    assignTranslationIds(document.getElementById("site-footer"), "footer");
  }

  function render() {
    var page = currentRoute().page;
    var main = document.getElementById("site-main");
    var preferredLang = activeUiLanguage();
    if (site.i18n.language !== preferredLang) {
      site.i18n.setLanguage(preferredLang);
    }
    applyUiSettings();
    runRouteTransition();
    document.body.classList.remove("is-menu-open");
    document.documentElement.lang = preferredLang;
    document.getElementById("site-header").innerHTML = site.sections.header();
    main.innerHTML = pageMarkup(page);
    animateRoute(main, page);
    document.getElementById("site-footer").innerHTML = site.sections.footer();
    applyTranslationBoundaries(page);
    setupNavigation();
    setupLanguageSwitcher();
    if (!DISABLE_GOOGLE_TRANSLATE) enforceHiddenGoogleTranslateUi();
    setupContactForm();
    setupRequestBuilder();
    setupReveal();
    setupFooterYear();
    setupAutoChat();
    setupBackToTop();
    setupMetricsAutomation();
    initializeGoogleAnalytics();
    trackGoogleAnalyticsPageView();
    resetScroll();

    if (!firstRenderDone) {
      firstRenderDone = true;
      if (shouldHideEntryLoaderAfterRender) {
        window.setTimeout(hideEntryLoader, 980);
      }
    }
  }

  function animateRoute(main, page) {
    if (!main) return;
    main.className = "route-shell route-" + page;
    main.classList.remove("route-enter");
    void main.offsetWidth;
    main.classList.add("route-enter");
  }

  function ensureRouteTransition() {
    if (routeTransition && routeTransition.parentNode) return routeTransition;
    routeTransition = document.createElement("div");
    routeTransition.className = "route-transition";
    routeTransition.setAttribute("aria-hidden", "true");
    document.body.appendChild(routeTransition);
    return routeTransition;
  }

  function runRouteTransition() {
    if (!uiSettings.motion) {
      if (routeTransition) {
        routeTransition.classList.remove("is-active");
      }
      return;
    }

    var transition = ensureRouteTransition();
    transition.classList.remove("is-active");
    void transition.offsetWidth;
    transition.classList.add("is-active");

    if (routeTransitionTimer) {
      window.clearTimeout(routeTransitionTimer);
    }

    routeTransitionTimer = window.setTimeout(function () {
      if (routeTransition) {
        routeTransition.classList.remove("is-active");
      }
      routeTransitionTimer = null;
    }, 980);
  }

  function shouldShowEntryLoader(page) {
    if (page !== "home") return false;
    try {
      return window.sessionStorage.getItem("smarttech.loader.seen") !== "1";
    } catch (error) {
      return true;
    }
  }

  function createEntryLoader() {
    var host = document.createElement("div");
    host.className = "entry-loader";
    host.setAttribute("role", "status");
    host.setAttribute("aria-live", "polite");
    host.innerHTML = '' +
      '<div class="entry-loader-core">' +
        '<div class="entry-loader-brand">' +
          '<strong class="entry-loader-word notranslate" translate="no" lang="en" data-no-translate="brand">SMART TECH</strong>' +
          '<span class="entry-loader-subtitle notranslate" translate="no" lang="en" data-no-translate="loader">Professional security systems & engineering</span>' +
        '</div>' +
        '<div class="entry-loader-spinner" aria-hidden="true">' +
          '<span></span><span></span><span></span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(host);
    document.body.classList.add("is-entry-loading");
    return host;
  }

  function setupEntryLoader() {
    var page = currentRoute().page;
    if (!shouldShowEntryLoader(page)) return;
    entryLoader = createEntryLoader();
    shouldHideEntryLoaderAfterRender = true;
  }

  function hideEntryLoader() {
    if (!entryLoader) return;

    try {
      window.sessionStorage.setItem("smarttech.loader.seen", "1");
    } catch (error) {
      // Loader still works without storage permissions.
    }

    entryLoader.classList.add("is-hidden");
    document.body.classList.remove("is-entry-loading");

    window.setTimeout(function () {
      if (entryLoader && entryLoader.parentNode) {
        entryLoader.parentNode.removeChild(entryLoader);
      }
      entryLoader = null;
    }, 700);
  }

  function resetScroll() {
    window.requestAnimationFrame(function () {
      window.scrollTo(0, 0);
    });
  }

  function setupNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.querySelector(".nav-panel");
    var backdrop = document.querySelector(".nav-backdrop");
    if (!toggle || !panel) return;

    if (menuResizeHandler) {
      window.removeEventListener("resize", menuResizeHandler);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", menuResizeHandler);
        window.visualViewport.removeEventListener("scroll", menuResizeHandler);
      }
      menuResizeHandler = null;
    }

    if (menuOutsideClickHandler) {
      document.removeEventListener("click", menuOutsideClickHandler, true);
      menuOutsideClickHandler = null;
    }

    if (menuEscHandler) {
      document.removeEventListener("keydown", menuEscHandler);
      menuEscHandler = null;
    }

    var menuGeometryFrame = 0;

    function syncMobileMenuGeometry() {
      var header = document.getElementById("site-header");
      if (!header || !document.documentElement || !header.getBoundingClientRect) return;

      var rect = header.getBoundingClientRect();
      var height = Math.max(60, Math.ceil(rect.height));
      var bottom = Math.max(height, Math.ceil(rect.bottom));
      document.documentElement.style.setProperty("--smarttech-header-height", height + "px");
      document.documentElement.style.setProperty("--smarttech-header-bottom", bottom + "px");
    }

    function scheduleMobileMenuGeometrySync(event) {
      if (!panel.classList.contains("is-open")) return;
      if (menuGeometryFrame) return;

      menuGeometryFrame = window.requestAnimationFrame(function () {
        menuGeometryFrame = 0;
        syncMobileMenuGeometry();
      });
    }

    menuResizeHandler = scheduleMobileMenuGeometrySync;
    window.addEventListener("resize", menuResizeHandler, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", menuResizeHandler, { passive: true });
      window.visualViewport.addEventListener("scroll", menuResizeHandler, { passive: true });
    }
    syncMobileMenuGeometry();

    function setMenuState(isOpen, restoreFocus) {
      panel.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("is-menu-open", isOpen);
      syncMobileMenuGeometry();
      toggle.setAttribute("aria-expanded", String(isOpen));
      panel.setAttribute("aria-hidden", String(!isOpen));
      if (isOpen) {
        window.requestAnimationFrame(syncMobileMenuGeometry);
        panel.scrollTop = 0;
        if (menuEscHandler) {
          document.removeEventListener("keydown", menuEscHandler);
        }
        menuEscHandler = function (event) {
          if (event.key === "Escape" || event.key === "Esc") {
            closeMenu();
          }
        };
        document.addEventListener("keydown", menuEscHandler);

        if (menuOutsideClickHandler) {
          document.removeEventListener("click", menuOutsideClickHandler, true);
        }
        window.setTimeout(function () {
          if (!panel.classList.contains("is-open")) return;
          menuOutsideClickHandler = function (event) {
            if (panel.contains(event.target) || toggle.contains(event.target)) return;
            closeMenu(false);
          };
          document.addEventListener("click", menuOutsideClickHandler, true);
        }, 0);
      } else {
        if (menuEscHandler) {
          document.removeEventListener("keydown", menuEscHandler);
          menuEscHandler = null;
        }
        if (menuOutsideClickHandler) {
          document.removeEventListener("click", menuOutsideClickHandler, true);
          menuOutsideClickHandler = null;
        }
        if (restoreFocus !== false && document.contains(toggle)) {
          toggle.focus();
        }
      }
    }

    function closeMenu(restoreFocus) {
      setMenuState(false, restoreFocus);
    }

    toggle.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) {
        closeMenu(false);
      } else {
        setMenuState(true, false);
      }
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        closeMenu(false);
      });
    }

    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeMenu(false);
      }
    });

    panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape" || event.key === "Esc") {
        closeMenu();
      }
    });
  }

  function setupLanguageSwitcher() {
    var switchers = document.querySelectorAll("[data-language-switcher]");
    if (!switchers.length) return;

    loadOnlineTranslate();
    var activeLang = normalizeLanguageCode(getOnlineLanguage());

    switchers.forEach(function (switcher) {
      var toggle = switcher.querySelector("[data-language-toggle]");
      var menu = switcher.querySelector("[data-language-menu]");
      var buttons = switcher.querySelectorAll("[data-online-lang]");
      var currentFlag = switcher.querySelector("[data-language-current-flag]");
      var currentCode = switcher.querySelector("[data-language-current-code]");
      if (!toggle || !menu || !buttons.length) return;

      function closeMenu() {
        switcher.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }

      function syncCurrent(button) {
        if (!button) return;
        var flag = button.querySelector(".language-flag");
        var code = button.querySelector(".language-code");
        if (currentFlag && flag) {
          currentFlag.innerHTML = flag.innerHTML;
        }
        if (currentCode && code) {
          currentCode.textContent = code.textContent;
        }
      }

      var selected = null;
      buttons.forEach(function (button) {
        var lang = normalizeLanguageCode(button.getAttribute("data-online-lang") || "hy");
        var isActive = lang === activeLang;
        button.classList.toggle("is-active", isActive);
        if (!selected && isActive) {
          selected = button;
        }

        button.addEventListener("click", function () {
          closeMenu();
          applyOnlineLanguage(lang);
        });
      });

      syncCurrent(selected || buttons[0]);

      toggle.addEventListener("click", function (event) {
        event.preventDefault();
        var isOpen = switcher.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      switcher.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          closeMenu();
          toggle.focus();
        }
      });
    });

    if (languageOutsideClickHandler) {
      document.removeEventListener("click", languageOutsideClickHandler, true);
    }

    languageOutsideClickHandler = function (event) {
      switchers.forEach(function (switcher) {
        if (!switcher.contains(event.target)) {
          var toggle = switcher.querySelector("[data-language-toggle]");
          switcher.classList.remove("is-open");
          if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
          }
        }
      });
    };

    document.addEventListener("click", languageOutsideClickHandler, true);
  }

  function setupRequestBuilder() {
    var form = document.getElementById("request-builder-form");
    var summary = document.getElementById("request-summary");
    if (!form || !summary) return;

    var status = document.getElementById("request-status");
    var downloadButton = document.getElementById("request-download");
    var projectButton = document.getElementById("request-project-submit");
    var recipient = (site.content.contacts && site.content.contacts.email) || "info@smarttechllc.am";
    var requestSteps = Array.prototype.slice.call(form.querySelectorAll("[data-request-step]"));
    var requestStepButtons = Array.prototype.slice.call(form.querySelectorAll("[data-request-go]"));
    var requestTypeInputs = Array.prototype.slice.call(form.querySelectorAll("input[name='requestType']"));
    var systemInputs = Array.prototype.slice.call(form.querySelectorAll("[data-request-system]"));
    var maintenanceInputs = Array.prototype.slice.call(form.querySelectorAll("[data-request-maintenance]"));
    var specialistInputs = Array.prototype.slice.call(form.querySelectorAll("[data-request-specialist]"));
    var scopePanels = Array.prototype.slice.call(form.querySelectorAll("[data-request-scope-panel]"));
    var scopedBlocks = Array.prototype.slice.call(form.querySelectorAll("[data-scope-show]"));
    var visitInput = form.querySelector("[data-request-visit]");
    var quantityInputsBySystem = {};
    var optionInputsBySystem = {};
    var brandInputsBySystem = {};
    var summaryFrame = null;
    var currentRequestStep = 0;

    Array.prototype.forEach.call(form.querySelectorAll("[data-request-qty]"), function (input) {
      quantityInputsBySystem[input.getAttribute("data-request-qty")] = input;
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-request-option]"), function (input) {
      var id = input.getAttribute("data-system-id") || "";
      if (!optionInputsBySystem[id]) optionInputsBySystem[id] = [];
      optionInputsBySystem[id].push(input);
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-request-brand]"), function (input) {
      var id = input.getAttribute("data-system-id") || "";
      if (!brandInputsBySystem[id]) brandInputsBySystem[id] = [];
      brandInputsBySystem[id].push(input);
    });

    function copy() {
      var dictionaries = {
        hy: {
          title: "Smart Tech համակարգի հայտ",
          requestType: "Հայտի տեսակ",
          contact: "Կոնտակտ",
          name: "Անուն / ընկերություն",
          phone: "Հեռախոս",
          email: "Email",
          object: "Օբյեկտ",
          objectType: "Օբյեկտի տեսակ",
          area: "Մակերես / սենյակներ",
          address: "Հասցե",
          deadline: "Ժամկետ",
          systems: "Ընտրված համակարգեր",
          components: "Սարքեր / աշխատանքներ",
          brands: "Ֆիրմաներ / մոդելներ",
          visit: "Այցելություն եւ չափագրում",
          visitNeeded: "Մասնագետի այցելություն",
          visitDate: "Ցանկալի օր",
          visitTime: "Ցանկալի ժամ",
          visitAccess: "Այցի նշումներ",
          specialists: "Ընտրված մասնագետներ",
          maintenance: "Սպասարկման կարիքներ",
          notes: "Նշումներ",
          yes: "Այո",
          no: "Ոչ",
          empty: "Չի լրացվել",
          noSystems: "Համակարգեր դեռ ընտրված չեն",
          noComponents: "Սարք կամ աշխատանք ընտրված չէ",
          noBrands: "Ֆիրմա կամ մոդել ընտրված չէ",
          noSpecialists: "Կոնկրետ մասնագետ ընտրված չէ, թիմը կորոշի ըստ նախագծի",
          noMaintenance: "Սպասարկման աշխատանքներ դեռ ընտրված չեն",
          subject: "Smart Tech համակարգի հայտ",
          projectSubject: "Smart Tech նոր նախագծի հայտ",
          projectRequest: "Նոր նախագծի հայտ / պետք է չափագրում",
          readyTitle: "Հայտը պատրաստվում է ավտոմատ",
          readyText: "Ընտրեք համակարգերը եւ սեղմեք ուղարկել։ Նամակի տեքստը կկազմվի ավտոմատ։",
          sendingTitle: "Պատրաստվում է նամակը",
          sendingText: "Mail ծրագիրը կբացվի արդեն հավաքված վերնագրով եւ տեքստով։",
          mailStatus: "Mail ծրագիրը բացվեց պատրաստ նամակով։ Եթե չի բացվել, ներբեռնեք TXT ֆայլը եւ ուղարկեք email-ով։",
          downloadStatus: "TXT ֆայլը պատրաստ է։"
        },
        en: {
          title: "Smart Tech system request",
          requestType: "Request type",
          contact: "Contact",
          name: "Name / company",
          phone: "Phone",
          email: "Email",
          object: "Facility",
          objectType: "Facility type",
          area: "Area / rooms",
          address: "Address",
          deadline: "Deadline",
          systems: "Selected systems",
          components: "Devices / tasks",
          brands: "Brands / models",
          visit: "Visit and measurement",
          visitNeeded: "Specialist visit",
          visitDate: "Preferred date",
          visitTime: "Preferred time",
          visitAccess: "Visit notes",
          specialists: "Selected specialists",
          maintenance: "Service needs",
          notes: "Notes",
          yes: "Yes",
          no: "No",
          empty: "Not filled",
          noSystems: "No systems selected yet",
          noComponents: "No device or task selected",
          noBrands: "No brand or model selected",
          noSpecialists: "No specific specialist selected, the team will choose by project",
          noMaintenance: "No service tasks selected yet",
          subject: "Smart Tech system request",
          projectSubject: "Smart Tech new project request",
          projectRequest: "New project request / measurement needed",
          readyTitle: "Request will be built automatically",
          readyText: "Choose the systems and send. The email text will be generated automatically.",
          sendingTitle: "Preparing the email",
          sendingText: "The mail app will open with the prepared subject and message.",
          mailStatus: "The mail app opened with a prepared message. If it did not open, download the TXT file and send it by email.",
          downloadStatus: "TXT file is ready."
        },
        ru: {
          title: "Заявка на систему Smart Tech",
          requestType: "Тип заявки",
          contact: "Контакт",
          name: "Имя / компания",
          phone: "Телефон",
          email: "Email",
          object: "Объект",
          objectType: "Тип объекта",
          area: "Площадь / комнаты",
          address: "Адрес",
          deadline: "Срок",
          systems: "Выбранные системы",
          components: "Устройства / работы",
          brands: "Фирмы / модели",
          visit: "Визит и замер",
          visitNeeded: "Визит специалиста",
          visitDate: "Желаемая дата",
          visitTime: "Желаемое время",
          visitAccess: "Примечания для визита",
          specialists: "Выбранные специалисты",
          maintenance: "Сервисные задачи",
          notes: "Примечания",
          yes: "Да",
          no: "Нет",
          empty: "Не заполнено",
          noSystems: "Системы пока не выбраны",
          noComponents: "Устройство или работа не выбраны",
          noBrands: "Фирма или модель не выбрана",
          noSpecialists: "Конкретный специалист не выбран, команда определит по проекту",
          noMaintenance: "Сервисные работы пока не выбраны",
          subject: "Заявка на систему Smart Tech",
          projectSubject: "Новая проектная заявка Smart Tech",
          projectRequest: "Новая проектная заявка / нужен замер",
          readyTitle: "Заявка будет собрана автоматически",
          readyText: "Выберите системы и отправьте. Текст письма сформируется автоматически.",
          sendingTitle: "Готовим письмо",
          sendingText: "Почта откроется с подготовленной темой и текстом.",
          mailStatus: "Почта открылась с готовым письмом. Если не открылась, скачайте TXT файл и отправьте его по email.",
          downloadStatus: "TXT файл готов."
        },
        be: {
          title: "Заяўка на сістэму Smart Tech",
          requestType: "Тып заяўкі",
          contact: "Кантакт",
          name: "Імя / кампанія",
          phone: "Тэлефон",
          email: "Email",
          object: "Аб'ект",
          objectType: "Тып аб'екта",
          area: "Плошча / пакоі",
          address: "Адрас",
          deadline: "Тэрмін",
          systems: "Выбраныя сістэмы",
          components: "Прылады / работы",
          brands: "Брэнды / мадэлі",
          visit: "Візіт і замер",
          visitNeeded: "Візіт спецыяліста",
          visitDate: "Жаданая дата",
          visitTime: "Жаданы час",
          visitAccess: "Нататкі для візіту",
          specialists: "Выбраныя спецыялісты",
          maintenance: "Патрэбы ў сэрвісе",
          notes: "Нататкі",
          yes: "Так",
          no: "Не",
          empty: "Не запоўнена",
          noSystems: "Сістэмы яшчэ не выбраны",
          noComponents: "Прылада або работа не выбрана",
          noBrands: "Брэнд або мадэль не выбраны",
          noSpecialists: "Канкрэтны спецыяліст не выбраны, каманда вызначыць паводле праекта",
          noMaintenance: "Сэрвісныя работы яшчэ не выбраны",
          subject: "Заяўка на сістэму Smart Tech",
          projectSubject: "Новая праектная заяўка Smart Tech",
          projectRequest: "Новая праектная заяўка / патрэбны замер",
          readyTitle: "Заяўка будзе сабрана аўтаматычна",
          readyText: "Выберыце сістэмы і націсніце адправіць. Тэкст ліста будзе сфарміраваны аўтаматычна.",
          sendingTitle: "Рыхтуем ліст",
          sendingText: "Пошта адкрыецца з падрыхтаванай тэмай і тэкстам.",
          mailStatus: "Пошта адкрылася з гатовым лістом. Калі не адкрылася, спампуйце TXT-файл і адпраўце яго па email.",
          downloadStatus: "TXT-файл гатовы."
        },
        fr: {
          title: "Demande de système Smart Tech",
          requestType: "Type de demande",
          contact: "Contact",
          name: "Nom / entreprise",
          phone: "Téléphone",
          email: "Email",
          object: "Site",
          objectType: "Type de site",
          area: "Surface / pièces",
          address: "Adresse",
          deadline: "Délai",
          systems: "Systèmes sélectionnés",
          components: "Équipements / tâches",
          brands: "Marques / modèles",
          visit: "Visite et mesure",
          visitNeeded: "Visite d'un spécialiste",
          visitDate: "Date souhaitée",
          visitTime: "Heure souhaitée",
          visitAccess: "Notes de visite",
          specialists: "Spécialistes sélectionnés",
          maintenance: "Besoins de service",
          notes: "Notes",
          yes: "Oui",
          no: "Non",
          empty: "Non renseigné",
          noSystems: "Aucun système sélectionné",
          noComponents: "Aucun équipement ou travail sélectionné",
          noBrands: "Aucune marque ou modèle sélectionné",
          noSpecialists: "Aucun spécialiste précis sélectionné, l'équipe décidera selon le projet",
          noMaintenance: "Aucune tâche de service sélectionnée",
          subject: "Demande de système Smart Tech",
          projectSubject: "Nouvelle demande de projet Smart Tech",
          projectRequest: "Nouvelle demande de projet / mesure nécessaire",
          readyTitle: "La demande sera préparée automatiquement",
          readyText: "Choisissez les systèmes et envoyez. Le texte de l'e-mail sera généré automatiquement.",
          sendingTitle: "Préparation de l'e-mail",
          sendingText: "L'application e-mail s'ouvrira avec le sujet et le message préparés.",
          mailStatus: "L'application e-mail s'est ouverte avec un message prêt. Sinon, téléchargez le fichier TXT et envoyez-le par e-mail.",
          downloadStatus: "Le fichier TXT est prêt."
        },
        ka: {
          title: "Smart Tech სისტემის განაცხადი",
          requestType: "განაცხადის ტიპი",
          contact: "კონტაქტი",
          name: "სახელი / კომპანია",
          phone: "ტელეფონი",
          email: "Email",
          object: "ობიექტი",
          objectType: "ობიექტის ტიპი",
          area: "ფართობი / ოთახები",
          address: "მისამართი",
          deadline: "ვადა",
          systems: "არჩეული სისტემები",
          components: "მოწყობილობები / სამუშაოები",
          brands: "ბრენდები / მოდელები",
          visit: "ვიზიტი და აზომვა",
          visitNeeded: "სპეციალისტის ვიზიტი",
          visitDate: "სასურველი თარიღი",
          visitTime: "სასურველი დრო",
          visitAccess: "ვიზიტის შენიშვნები",
          specialists: "არჩეული სპეციალისტები",
          maintenance: "სერვისის საჭიროებები",
          notes: "შენიშვნები",
          yes: "დიახ",
          no: "არა",
          empty: "არ არის შევსებული",
          noSystems: "სისტემები ჯერ არ არის არჩეული",
          noComponents: "მოწყობილობა ან სამუშაო არ არის არჩეული",
          noBrands: "ბრენდი ან მოდელი არ არის არჩეული",
          noSpecialists: "კონკრეტული სპეციალისტი არ არის არჩეული, გუნდი გადაწყვეტს პროექტის მიხედვით",
          noMaintenance: "სერვისის სამუშაოები ჯერ არ არის არჩეული",
          subject: "Smart Tech სისტემის განაცხადი",
          projectSubject: "Smart Tech-ის ახალი პროექტის განაცხადი",
          projectRequest: "ახალი პროექტის განაცხადი / საჭიროა აზომვა",
          readyTitle: "განაცხადი ავტომატურად მომზადდება",
          readyText: "აირჩიეთ სისტემები და დააჭირეთ გაგზავნას. წერილის ტექსტი ავტომატურად შეიქმნება.",
          sendingTitle: "წერილი მზადდება",
          sendingText: "ელფოსტის აპი გაიხსნება მომზადებული სათაურითა და ტექსტით.",
          mailStatus: "ელფოსტის აპი გაიხსნა მომზადებული წერილით. თუ არ გაიხსნა, ჩამოტვირთეთ TXT ფაილი და გააგზავნეთ email-ით.",
          downloadStatus: "TXT ფაილი მზად არის."
        }
      };
      return dictionaries[activeUiLanguage()] || dictionaries.en || dictionaries.hy;
    }

    function value(name) {
      var field = form.elements[name];
      return field ? String(field.value || "").trim() : "";
    }

    function checkedRadioValue(name) {
      var field = form.querySelector("input[name='" + name + "']:checked");
      return field ? String(field.value || "").trim() : "";
    }

    function checkedRequestKind() {
      var field = form.querySelector("input[name='requestType']:checked");
      return field ? String(field.getAttribute("data-request-kind") || "sale") : "sale";
    }

    function selectedSystems() {
      var labels = copy();
      return systemInputs.filter(function (checkbox) {
        return checkbox.checked;
      }).map(function (checkbox) {
        var qty = quantityInputsBySystem[checkbox.value];
        var amount = qty && qty.value ? String(qty.value).trim() : "1";
        var unit = checkbox.getAttribute("data-unit") || "";
        var title = checkbox.getAttribute("data-title") || checkbox.value;
        var components = (optionInputsBySystem[checkbox.value] || []).filter(function (option) {
          return option.checked;
        }).map(function (option) {
          return option.value;
        });
        var brands = (brandInputsBySystem[checkbox.value] || []).filter(function (brand) {
          return brand.checked;
        }).map(function (brand) {
          return brand.value;
        });
        return "- " + title + ": " + amount + (unit ? " " + unit : "") +
          "\n  " + labels.components + ": " + (components.length ? components.join(", ") : labels.noComponents) +
          "\n  " + labels.brands + ": " + (brands.length ? brands.join(", ") : labels.noBrands);
      });
    }

    function selectedSystemTitles() {
      return systemInputs.filter(function (checkbox) {
        return checkbox.checked;
      }).map(function (checkbox) {
        return checkbox.getAttribute("data-title") || checkbox.value;
      });
    }

    function selectedMaintenance() {
      return maintenanceInputs.filter(function (checkbox) {
        return checkbox.checked;
      }).map(function (checkbox) {
        return "- " + (checkbox.getAttribute("data-title") || checkbox.value);
      });
    }

    function selectedSpecialists() {
      return specialistInputs.filter(function (checkbox) {
        return checkbox.checked;
      }).map(function (checkbox) {
        return "- " + (checkbox.getAttribute("data-title") || checkbox.value);
      });
    }

    function isVisitNeeded() {
      return !!(visitInput && visitInput.checked);
    }

    function updateQuantityState() {
      systemInputs.forEach(function (checkbox) {
        var card = checkbox.closest(".request-system-card");
        if (card) {
          card.classList.toggle("is-selected", checkbox.checked);
        }
        var qty = quantityInputsBySystem[checkbox.value];
        if (qty) {
          qty.disabled = !checkbox.checked;
        }
        (optionInputsBySystem[checkbox.value] || []).forEach(function (option) {
          option.disabled = !checkbox.checked;
          if (!checkbox.checked) {
            option.checked = false;
          }
        });
        (brandInputsBySystem[checkbox.value] || []).forEach(function (brand) {
          brand.disabled = !checkbox.checked;
          if (!checkbox.checked) {
            brand.checked = false;
          }
        });
      });

      requestTypeInputs.forEach(function (input) {
        var card = input.closest(".request-choice");
        if (card) card.classList.toggle("is-selected", input.checked);
      });

      maintenanceInputs.forEach(function (input) {
        var card = input.closest(".request-check");
        if (card) card.classList.toggle("is-selected", input.checked);
      });

      specialistInputs.forEach(function (input) {
        var card = input.closest(".request-specialist-chip");
        if (card) card.classList.toggle("is-selected", input.checked);
      });

      if (visitInput) {
        var visitCard = visitInput.closest(".request-visit-toggle");
        if (visitCard) visitCard.classList.toggle("is-selected", visitInput.checked);
      }
    }

    function syncRequestScope() {
      var kind = checkedRequestKind();
      scopePanels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.getAttribute("data-request-scope-panel") === kind);
      });
      scopedBlocks.forEach(function (panel) {
        var allowed = String(panel.getAttribute("data-scope-show") || "").split(/\s+/);
        panel.hidden = allowed.indexOf(kind) < 0;
      });

      if (visitInput && kind === "audit") {
        visitInput.checked = true;
      } else if (visitInput) {
        visitInput.checked = false;
      }

      if (kind !== "service") {
        maintenanceInputs.forEach(function (checkbox) {
          checkbox.checked = false;
        });
      }
      if (kind !== "audit") {
        specialistInputs.forEach(function (checkbox) {
          checkbox.checked = false;
        });
      }
      if (kind === "audit") {
        systemInputs.forEach(function (checkbox) {
          checkbox.checked = false;
        });
      }
    }

    function setRequestStep(step, shouldScroll) {
      var maxStep = requestSteps.length ? requestSteps.length - 1 : 0;
      currentRequestStep = Math.max(0, Math.min(step, maxStep));

      requestSteps.forEach(function (section) {
        var sectionStep = Number(section.getAttribute("data-request-step") || 0);
        section.classList.toggle("is-active", sectionStep === currentRequestStep);
      });

      requestStepButtons.forEach(function (button) {
        var buttonStep = Number(button.getAttribute("data-request-go") || 0);
        button.classList.toggle("is-active", buttonStep === currentRequestStep);
        button.classList.toggle("is-complete", buttonStep < currentRequestStep);
        button.setAttribute("aria-current", buttonStep === currentRequestStep ? "step" : "false");
      });

      form.setAttribute("data-current-step", String(currentRequestStep));

      if (shouldScroll !== false && window.matchMedia && window.matchMedia("(max-width: 900px)").matches) {
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function line(label, text, fallback) {
      return label + ": " + (text || fallback);
    }

    function buildSummary(mode) {
      var labels = copy();
      var systems = selectedSystems();
      var maintenance = selectedMaintenance();
      var specialists = selectedSpecialists();
      var fallback = labels.empty;
      var projectMode = mode === "project";

      return [
        labels.title,
        "",
        line(labels.requestType, projectMode ? labels.projectRequest : checkedRadioValue("requestType"), fallback),
        "",
        labels.contact + ":",
        line("  " + labels.name, value("clientName"), fallback),
        line("  " + labels.phone, value("clientPhone"), fallback),
        line("  " + labels.email, value("clientEmail"), fallback),
        "",
        labels.object + ":",
        line("  " + labels.objectType, value("objectType"), fallback),
        line("  " + labels.area, value("objectArea"), fallback),
        line("  " + labels.address, value("objectAddress"), fallback),
        line("  " + labels.deadline, value("deadline"), fallback),
        "",
        labels.visit + ":",
        line("  " + labels.visitNeeded, (isVisitNeeded() || projectMode) ? labels.yes : labels.no, fallback),
        line("  " + labels.visitDate, value("visitDate"), fallback),
        line("  " + labels.visitTime, value("visitTime"), fallback),
        line("  " + labels.visitAccess, value("visitAccess"), fallback),
        labels.specialists + ":",
        specialists.length ? specialists.join("\n") : "- " + labels.noSpecialists,
        "",
        labels.systems + ":",
        systems.length ? systems.join("\n") : "- " + labels.noSystems,
        "",
        labels.maintenance + ":",
        maintenance.length ? maintenance.join("\n") : "- " + labels.noMaintenance,
        "",
        labels.notes + ":",
        value("notes") || fallback
      ].join("\n");
    }

    function updateSummary(mode) {
      updateQuantityState();
      summary.value = buildSummary(mode);
    }

    function scheduleSummaryUpdate() {
      if (summaryFrame) return;
      var raf = window.requestAnimationFrame || function (callback) {
        return window.setTimeout(callback, 16);
      };
      summaryFrame = raf(function () {
        summaryFrame = null;
        updateSummary();
      });
    }

    function setStatus(text) {
      if (status) {
        status.textContent = text || "";
      }
    }

    function setSubmitState(mode) {
      var labels = copy();
      var state = document.getElementById("request-submit-state");
      var title = document.getElementById("request-submit-title");
      var text = document.getElementById("request-submit-text");
      var isSending = mode === "sending";

      form.classList.toggle("is-sending", isSending);
      if (state) {
        state.classList.toggle("is-sending", isSending);
      }
      if (title) {
        title.textContent = isSending ? labels.sendingTitle : labels.readyTitle;
      }
      if (text) {
        text.textContent = isSending ? labels.sendingText : labels.readyText;
      }
    }

    function emailSubject(labels, mode) {
      var parts = [];
      var type = checkedRadioValue("requestType");
      var objectType = value("objectType");
      var systems = selectedSystemTitles();
      var base = mode === "project" ? labels.projectSubject : labels.subject;
      if (type) parts.push(type);
      if (objectType) parts.push(objectType);
      if ((isVisitNeeded() || mode === "project") && parts.indexOf(labels.visit) < 0) {
        parts.push(labels.visit);
      }
      if (systems.length) parts.push(systems.slice(0, 2).join(", "));
      return base + (parts.length ? " - " + parts.join(" / ") : "");
    }

    function downloadSummaryFile() {
      if (!window.Blob || !window.URL || !window.URL.createObjectURL) {
        return false;
      }

      var file = new Blob([summary.value], { type: "text/plain;charset=utf-8" });
      var link = document.createElement("a");
      var date = new Date().toISOString().slice(0, 10);
      link.href = window.URL.createObjectURL(file);
      link.download = "smarttech-request-" + date + ".txt";
      document.body.appendChild(link);
      link.click();
      window.setTimeout(function () {
        window.URL.revokeObjectURL(link.href);
        link.remove();
      }, 0);
      return true;
    }

    function safeMailBody(fullText) {
      var text = String(fullText || "");
      var maxMailBodyLength = 1800;
      if (text.length <= maxMailBodyLength) {
        return text;
      }

      downloadSummaryFile();
      return text.slice(0, 1400) +
        "\n\nFull request is saved in the downloaded TXT file. If it did not download, use the TXT download button on the request page.";
    }

    form.addEventListener("click", function (event) {
      var go = event.target.closest("[data-request-go]");
      var next = event.target.closest("[data-request-next]");
      var prev = event.target.closest("[data-request-prev]");

      if (go) {
        setRequestStep(Number(go.getAttribute("data-request-go") || 0));
      }
      if (next) {
        setRequestStep(currentRequestStep + 1);
      }
      if (prev) {
        setRequestStep(currentRequestStep - 1);
      }
    });

    form.addEventListener("input", function () {
      scheduleSummaryUpdate();
    });

    form.addEventListener("change", function (event) {
      var target = event.target;
      var shouldSyncScope = target && (
        target.name === "requestType" ||
        target.hasAttribute("data-request-system") ||
        target.hasAttribute("data-request-maintenance") ||
        target.hasAttribute("data-request-specialist") ||
        target.hasAttribute("data-request-visit")
      );

      if (shouldSyncScope) {
        syncRequestScope();
      }
      if (target && target.name === "requestType") {
        setRequestStep(1);
      }
      updateSummary();
    });

    function openPreparedMail(mode) {
      updateSummary(mode);
      var labels = copy();
      var subject = emailSubject(labels, mode);
      setSubmitState("sending");
      window.location.href = site.utils.mailTo(recipient, subject, safeMailBody(summary.value));
      setStatus(labels.mailStatus);
      window.setTimeout(function () {
        setSubmitState("ready");
      }, 1800);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      openPreparedMail("regular");
    });

    if (projectButton) {
      projectButton.addEventListener("click", function () {
        openPreparedMail("project");
      });
    }

    if (downloadButton) {
      downloadButton.addEventListener("click", function () {
        updateSummary();
        setSubmitState("ready");

        if (!downloadSummaryFile()) {
          setStatus(copy().mailStatus);
          return;
        }
        setStatus(copy().downloadStatus);
      });
    }

    form.addEventListener("reset", function () {
      window.setTimeout(function () {
        syncRequestScope();
        setRequestStep(0, false);
        updateSummary();
        setStatus("");
        setSubmitState("ready");
      }, 0);
    });

    syncRequestScope();
    setRequestStep(0, false);
    updateSummary();
    setSubmitState("ready");
  }

  function setupContactForm() {
    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");
    if (!form || !status) return;
    var submitButton = form.querySelector("button[type='submit']");

    function feedbackText(key) {
      var messages = {
        hy: {
          sending: "Ուղարկվում է...",
          success: "Հարցումը ստացանք։ Մեր թիմը կապ կհաստատի ձեզ հետ։",
          fallback: "Եթե պատուհանը չբացվեց, գրեք մեզ էլ․ փոստով կամ WhatsApp/Viber-ով։",
          error: "Չհաջողվեց ուղարկել։ Փորձեք կրկին կամ կապվեք հեռախոսով։"
        },
        en: {
          sending: "Sending request...",
          success: "Request received. Our team will contact you soon.",
          fallback: "If the email window did not open, contact us by email, WhatsApp or Viber.",
          error: "Could not send the request. Please try again or call us."
        },
        ru: {
          sending: "Отправляем заявку...",
          success: "Заявка получена. Наша команда скоро свяжется с вами.",
          fallback: "Если окно почты не открылось, напишите нам на email, WhatsApp или Viber.",
          error: "Не удалось отправить заявку. Попробуйте еще раз или позвоните нам."
        },
        be: {
          sending: "Адпраўляем заяўку...",
          success: "Заяўка атрымана. Наша каманда хутка звяжацца з вамі.",
          fallback: "Калі паштовае акно не адкрылася, напішыце нам на email, WhatsApp або Viber.",
          error: "Не ўдалося адправіць заяўку. Паспрабуйце яшчэ раз або патэлефануйце нам."
        },
        fr: {
          sending: "Envoi de la demande...",
          success: "Demande reçue. Notre équipe vous contactera bientôt.",
          fallback: "Si la fenêtre e-mail ne s'est pas ouverte, contactez-nous par e-mail, WhatsApp ou Viber.",
          error: "Impossible d'envoyer la demande. Réessayez ou appelez-nous."
        },
        ka: {
          sending: "განაცხადი იგზავნება...",
          success: "განაცხადი მიღებულია. ჩვენი გუნდი მალე დაგიკავშირდებათ.",
          fallback: "თუ ელფოსტის ფანჯარა არ გაიხსნა, მოგვწერეთ email-ით, WhatsApp-ით ან Viber-ით.",
          error: "განაცხადის გაგზავნა ვერ მოხერხდა. სცადეთ თავიდან ან დაგვირეკეთ."
        }
      };
      var lang = activeUiLanguage();
      return (messages[lang] && messages[lang][key]) || messages.en[key] || messages.hy[key] || "";
    }

    function setBusy(isBusy) {
      if (submitButton) {
        submitButton.disabled = isBusy;
      }
      form.classList.toggle("is-submitting", isBusy);
    }

    function payloadFromForm() {
      var data = new FormData(form);
      return {
        name: String(data.get("name") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        email: String(data.get("email") || "").trim(),
        message: String(data.get("message") || "").trim()
      };
    }

    function openEmailFallback(payload) {
      var body = [
        "Name: " + payload.name,
        "Phone: " + payload.phone,
        "Email: " + payload.email,
        "",
        "Message:",
        payload.message
      ].join("\n");
      window.location.href = site.utils.mailTo(site.content.contacts.email, "New consultation request from Smart Tech website", body);
      status.textContent = feedbackText("fallback");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var payload = payloadFromForm();

      status.textContent = feedbackText("sending");
      setBusy(true);
      setBusy(false);
      openEmailFallback(payload);
    });
  }

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    items.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index * 78, 540) + "ms";
      observer.observe(item);
    });
  }

  function setupFooterYear() {
    var year = document.getElementById("footer-year");
    if (year) {
      year.textContent = "(c) " + new Date().getFullYear() + " Smart Tech LLC";
    }
  }

  function shouldRecordVisitThisSession() {
    try {
      if (window.sessionStorage.getItem(metricsVisitSessionKey) === "1") {
        return false;
      }
      window.sessionStorage.setItem(metricsVisitSessionKey, "1");
      return true;
    } catch (error) {
      return true;
    }
  }

  function setMetricValue(metricName, value) {
    var target = document.querySelector('[data-metric-item="' + metricName + '"] [data-metric-value]');
    if (!target) return;

    var numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
      target.textContent = String(value == null ? "" : value);
      return;
    }

    target.textContent = numberValue.toLocaleString("en-US");
  }

  function setupStaticMetricsFallback(recordVisit) {
    var visits = 0;

    try {
      visits = Math.max(0, Math.floor(Number(window.localStorage.getItem(staticMetricsStorageKey) || 0)));
      if (recordVisit) {
        visits += 1;
        window.localStorage.setItem(staticMetricsStorageKey, String(visits));
      }
    } catch (error) {
      visits = recordVisit ? 1 : 0;
    }

    setMetricValue("visits", visits);
    setMetricValue("projects", (site.content.projects || []).length || 0);
  }

  function firebaseMetricsUrl() {
    var config = window.SmartTechRuntimeConfig || {};
    var databaseUrl = String(config.firebaseDatabaseUrl || "").trim().replace(/\/+$/g, "");
    var statsPath = String(config.firebaseStatsPath || "").trim().replace(/^\/+|\/+$/g, "");
    var authToken = String(config.firebaseAuthToken || "").trim();
    if (!databaseUrl || !statsPath) return "";

    var encodedPath = statsPath.split("/").filter(Boolean).map(function (part) {
      return encodeURIComponent(part);
    }).join("/");

    return databaseUrl + "/" + encodedPath + ".json" + (authToken ? "?auth=" + encodeURIComponent(authToken) : "");
  }

  function parseFirebaseCounter(text) {
    var value = Number(String(text || "").replace(/^"|"$/g, ""));
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  }

  function readFirebaseVisits(url) {
    return fetch(url, {
      method: "GET",
      cache: "no-store"
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Could not read Firebase counter");
      }
      return response.text();
    }).then(parseFirebaseCounter);
  }

  function writeFirebaseVisits(url, visits) {
    return fetch(url, {
      method: "PUT",
      cache: "no-store",
      headers: { "content-type": "text/plain; charset=UTF-8" },
      body: String(Math.max(0, Math.floor(visits || 0)))
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Could not write Firebase counter");
      }
      return visits;
    });
  }

  function setupFirebaseMetrics(recordVisit) {
    var url = firebaseMetricsUrl();
    if (!url || !window.fetch) return false;

    readFirebaseVisits(url)
      .then(function (visits) {
        setMetricValue("visits", visits);
        if (!recordVisit) return visits;
        return writeFirebaseVisits(url, visits + 1).catch(function () {
          return visits;
        });
      })
      .then(function (visits) {
        setMetricValue("visits", visits);
      })
      .catch(function () {
        setupStaticMetricsFallback(recordVisit);
      });

    return true;
  }

  function setupMetricsAutomation() {
    var hasMetrics = document.querySelector("[data-metric-item]");
    if (!hasMetrics) return;

    setMetricValue("projects", (site.content.projects || []).length || 0);
    var recordVisit = shouldRecordVisitThisSession();
    if (!setupFirebaseMetrics(recordVisit)) {
      setupStaticMetricsFallback(recordVisit);
    }
  }

  function readUiSettings() {
    return { compact: false, motion: true };
  }

  function persistUiSettings() {
    try {
      window.localStorage.removeItem(uiSettingsStorageKey);
    } catch (error) {
      // UI settings are no longer user-facing.
    }
  }

  function detectAutoTheme(now) {
    var date = now || new Date();
    var hour = date.getHours();
    return hour >= 19 || hour < 7 ? "dark" : "light";
  }

  function nextThemeSwitch(now) {
    var date = new Date((now || new Date()).getTime());
    var hour = date.getHours();

    if (hour < 7) {
      date.setHours(7, 0, 0, 0);
      return date;
    }

    if (hour < 19) {
      date.setHours(19, 0, 0, 0);
      return date;
    }

    date.setDate(date.getDate() + 1);
    date.setHours(7, 0, 0, 0);
    return date;
  }

  function scheduleAutoThemeUpdate(now) {
    if (autoThemeTimer) {
      window.clearTimeout(autoThemeTimer);
      autoThemeTimer = null;
    }

    var current = now || new Date();
    var next = nextThemeSwitch(current);
    var wait = Math.max(60000, next.getTime() - current.getTime() + 1200);

    autoThemeTimer = window.setTimeout(function () {
      applyAutoTheme();
    }, wait);
  }

  function applyAutoTheme() {
    var now = new Date();
    var theme = detectAutoTheme(now);

    document.body.classList.toggle("ui-theme-dark", theme === "dark");
    document.body.classList.toggle("ui-theme-light", theme !== "dark");
    document.documentElement.setAttribute("data-theme", theme);

    try {
      var zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (zone) {
        document.documentElement.setAttribute("data-timezone", zone);
      }
    } catch (error) {
      // Theme still works even without timezone metadata.
    }

    scheduleAutoThemeUpdate(now);
  }

  function applyUiSettings() {
    uiSettings.compact = false;
    uiSettings.motion = true;
    document.body.classList.remove("ui-compact", "ui-reduced-motion");
    persistUiSettings();
    applyAutoTheme();
  }

  function ensureTranslateHost() {
    var host = document.getElementById("smarttech-google-translate");
    if (host) return host;
    host = document.createElement("div");
    host.id = "smarttech-google-translate";
    host.setAttribute("aria-hidden", "true");
    document.body.appendChild(host);
    return host;
  }

  function readCookie(name) {
    var search = name + "=";
    var cookieItems = document.cookie.split(";");
    for (var i = 0; i < cookieItems.length; i += 1) {
      var value = cookieItems[i].trim();
      if (value.indexOf(search) === 0) {
        return value.slice(search.length);
      }
    }
    return "";
  }

  function writeTranslateCookie(lang) {
    var value = "/hy/" + lang;
    var base = "googtrans=" + value + ";path=/";
    document.cookie = base;
    var hostname = window.location.hostname || "";
    if (hostname.indexOf(".") > 0) {
      document.cookie = base + ";domain=" + hostname;
    }
  }

  function getOnlineLanguage() {
    var cookieValue = decodeURIComponent(readCookie("googtrans") || "");
    if (cookieValue.indexOf("/hy/") === 0) {
      return cookieValue.split("/")[2] || "hy";
    }
    try {
      return window.localStorage.getItem(onlineLangStorageKey) || "hy";
    } catch (error) {
      return "hy";
    }
  }

  function applyOnlineLanguage(lang) {
    var nextLang = lang || "hy";
    writeTranslateCookie(nextLang);
    try {
      window.localStorage.setItem(onlineLangStorageKey, nextLang);
    } catch (error) {
      // Page still updates with cookie.
    }
    window.location.reload();
  }

  function enforceHiddenGoogleTranslateUi() {
    var html = document.documentElement;
    var body = document.body;
    if (html) {
      html.style.top = "0px";
      html.style.marginTop = "0px";
    }
    if (body) {
      body.style.top = "0px";
      body.style.marginTop = "0px";
    }

    var selectors = [
      "#smarttech-google-translate",
      "#smarttech-google-translate *",
      "body > .skiptranslate",
      "body > .skiptranslate > iframe.skiptranslate",
      "iframe.skiptranslate",
      "iframe.goog-te-banner-frame.skiptranslate",
      "iframe[src*='translate.google']",
      "iframe[src*='translate.googleapis']",
      "#goog-gt-tt",
      "#goog-gt-vt",
      ".goog-te-balloon-frame",
      ".goog-te-gadget",
      ".goog-te-gadget *",
      ".goog-te-combo",
      ".goog-te-menu-frame",
      ".goog-te-menu-frame *",
      ".goog-tooltip"
    ];

    var combinedSelector = selectors.join(", ");
    document.querySelectorAll(combinedSelector).forEach(function (node) {
      if (node.id !== "smarttech-google-translate") {
        node.style.display = "none";
      }
      node.style.width = "0px";
      node.style.height = "0px";
      node.style.maxWidth = "0px";
      node.style.maxHeight = "0px";
      node.style.overflow = "hidden";
      node.style.opacity = "0";
      node.style.visibility = "hidden";
      node.style.pointerEvents = "none";
    });
  }

  function scheduleTranslateUiCleanup() {
    enforceHiddenGoogleTranslateUi();
    if (googleUiCleanupTimer) return;

    var pass = 0;
    googleUiCleanupTimer = window.setInterval(function () {
      pass += 1;
      enforceHiddenGoogleTranslateUi();
      if (pass >= 18) {
        window.clearInterval(googleUiCleanupTimer);
        googleUiCleanupTimer = null;
      }
    }, 300);
  }

  function initGoogleTranslate() {
    if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) return;
    ensureTranslateHost();
    scheduleTranslateUiCleanup();
    new window.google.translate.TranslateElement({
      pageLanguage: "hy",
      includedLanguages: "hy,ru,en,be,fr,ka",
      autoDisplay: false,
      multilanguagePage: true
    }, "smarttech-google-translate");
    scheduleTranslateUiCleanup();
  }

  function loadOnlineTranslate() {
    // Disabled Google Translate integration for faster site performance.
    if (DISABLE_GOOGLE_TRANSLATE) return;
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      initGoogleTranslate();
      return;
    }
    if (onlineTranslateScriptLoaded) return;

    onlineTranslateScriptLoaded = true;
    window.googleTranslateElementInit = function () {
      initGoogleTranslate();
    };

    var script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }

  function translateTemplate(template, vars) {
    return String(template || "").replace(/\{([^}]+)\}/g, function (_, key) {
      return vars[key] != null ? String(vars[key]) : "";
    });
  }

  function normalizeLanguageCode(language) {
    var lang = String(language || "").toLowerCase();
    if (lang.indexOf("be") === 0) return "be";
    if (lang.indexOf("fr") === 0) return "fr";
    if (lang.indexOf("ka") === 0) return "ka";
    if (lang.indexOf("ru") === 0) return "ru";
    if (lang.indexOf("en") === 0) return "en";
    return "hy";
  }

  function activeUiLanguage() {
    return normalizeLanguageCode(getOnlineLanguage());
  }

  function chatDictionary(language) {
    var contacts = site.content.contacts || {};
    var emailText = contacts.email || "info@smarttechllc.am";
    var contactPage = site.utils.pageUrl("contact");
    var dictionaries = {
      hy: {
        title: "Ավտո չատ",
        subtitle: "Արագ պատասխաններ Smart Tech-ից",
        quickLabel: "Արագ հարցեր",
        statusLabel: "Ակտիվ",
        openLabel: "Բացել չատը",
        closeLabel: "Փակել չատը",
        hideLabel: "Թաքցնել չատը",
        inputPlaceholder: "Գրեք հարցը...",
        sendLabel: "Ուղարկել",
        typing: "գրում է...",
        greeting: "Բարև, ես Smart Tech-ի վիրտուալ օգնականն եմ։ Կօգնեմ ծառայությունների, գների, ժամկետների և կապի հարցերով։",
        quickIntents: [
          { id: "services", label: "Ծառայություններ" },
          { id: "price", label: "Գների հարց" },
          { id: "timeline", label: "Ժամկետներ" },
          { id: "contact", label: "Կապ մեզ հետ" },
          { id: "survey", label: "Նախագծի բրիֆ" }
        ],
        surveyIntro: "Եկեք գրանցենք մի քանի հիմնական մանրամասներ, որպեսզի մեր թիմը արագ կապվի ձեզ հետ։",
        surveyQuestions: [
          { id: "service", label: "Ծառայություն", question: "Ո՞ր Smart Tech ծառայության կարիքն ունեք (օրինակ՝ տեսահսկում, ազդանշանային համակարգ, ավտոմատացում)։" },
          { id: "facility", label: "Օբյեկտ", question: "Ի՞նչ տեսակի օբյեկտ պետք է չափագրենք։" },
          { id: "timeline", label: "Ժամկետներ", question: "Ե՞րբ կցանկանայիք սկսել ձեր նախագիծը։" }
        ],
        surveySummary: "Ահա գրանցված մանրամասները:",
        surveyReminder: "Ձեր բրիֆը պահպանվել է, և մեր թիմը շուտով կկապվի ձեզ հետ:",
        reminderStatus: "Բրիֆը պահպանված է",
        replies: {
          services: "Մենք առաջարկում ենք տեսահսկման, հրդեհային ու ազդանշանային համակարգեր, ցանցային լուծումներ, էլեկտրական և ավտոմատացման աշխատանքներ.",
          price: "Ճշգրիտ գինը կախված է օբյեկտից և աշխատանքի ծավալից. կիսվեք համառոտ բրիֆով, և թիմը կպատրաստի հաշվարկը.",
          timeline: "Փոքր նախագծերը սովորաբար ավարտվում են 3-7 օրվա ընթացքում, միջինները՝ 1-3 շաբաթի մեջ. վերջնական ժամկետը հաստատվում է զննման փուլից հետո.",
          contact: "Կարող եք գրել {email}-ին կամ բացել մեր կապի էջը՝ {contactPage}:",
          fallback: "Շնորհակալություն. գրեք խնդիրը 1-2 նախադասությամբ, և մեր թիմը շուտով կկապվի ձեզ հետ."
        }
      },
      en: {
        title: "Auto Chat",
        subtitle: "Fast Smart Tech answers",
        quickLabel: "Quick questions",
        statusLabel: "Online",
        openLabel: "Open chat",
        closeLabel: "Close chat",
        hideLabel: "Hide chat",
        inputPlaceholder: "Type your question...",
        sendLabel: "Send",
        typing: "typing...",
        greeting: "Hi, I am Smart Tech virtual assistant. I can help with services, pricing, timeline and contacts.",
        quickIntents: [
          { id: "services", label: "Services" },
          { id: "price", label: "Pricing" },
          { id: "timeline", label: "Timeline" },
          { id: "contact", label: "Contact" },
          { id: "survey", label: "Project brief" }
        ],
        surveyIntro: "Let's capture a few key details so our team can follow up quickly.",
        surveyQuestions: [
          { id: "service", label: "Service", question: "Which Smart Tech service do you need? (e.g. surveillance, alarm, automation)" },
          { id: "facility", label: "Facility", question: "What type of location should we survey?" },
          { id: "timeline", label: "Timeline", question: "When would you like your project to start?" }
        ],
        surveySummary: "Here is what we have recorded:",
        surveyReminder: "Your briefing is saved and our team will contact you shortly.",
        reminderStatus: "Brief saved",
        replies: {
          services: "We deliver video surveillance, fire and alarm systems, network solutions, electrical works and automation.",
          price: "Accurate pricing depends on your facility and scope. Share a short brief and our team will prepare an estimate.",
          timeline: "Small projects usually take 3-7 days, medium ones 1-3 weeks. Final timing is confirmed after survey.",
          contact: "You can email {email}, or open our contact page: {contactPage}",
          fallback: "Thanks. Please share your request in 1-2 sentences and our team will follow up quickly."
        }
      },
      ru: {
        title: "Авто чат",
        subtitle: "Быстрые ответы Smart Tech",
        quickLabel: "Быстрые вопросы",
        statusLabel: "Онлайн",
        openLabel: "Открыть чат",
        closeLabel: "Закрыть чат",
        hideLabel: "Скрыть чат",
        inputPlaceholder: "Напишите вопрос...",
        sendLabel: "Отправить",
        typing: "печатает...",
        greeting: "Здравствуйте, я виртуальный помощник Smart Tech. Помогу по услугам, стоимости, срокам и контактам.",
        quickIntents: [
          { id: "services", label: "Услуги" },
          { id: "price", label: "Стоимость" },
          { id: "timeline", label: "Сроки" },
          { id: "contact", label: "Контакты" },
          { id: "survey", label: "Бриф проекта" }
        ],
        surveyIntro: "Давайте запишем несколько ключевых деталей, чтобы наша команда могла быстро связаться с вами.",
        surveyQuestions: [
          { id: "service", label: "Услуга", question: "Какая услуга Smart Tech вам необходима? (например, видеонаблюдение, сигнализация, автоматизация)" },
          { id: "facility", label: "Объект", question: "Какой тип объекта необходимо обследовать?" },
          { id: "timeline", label: "Сроки", question: "Когда вы хотите начать проект?" }
        ],
        surveySummary: "Вот детали, которые мы записали:",
        surveyReminder: "Ваш бриф сохранен, наша команда скоро свяжется с вами.",
        reminderStatus: "Бриф сохранен",
        replies: {
          services: "Мы выполняем видеонаблюдение, пожарные и охранные системы, сетевые решения, электромонтаж и автоматизацию.",
          price: "Точная стоимость зависит от объекта и объема задач. Отправьте краткое описание, и команда подготовит расчет.",
          timeline: "Небольшие проекты обычно занимают 3-7 дней, средние — 1-3 недели. Финальный срок подтверждаем после обследования.",
          contact: "Можно написать на {email}, или открыть страницу контактов: {contactPage}",
          fallback: "Спасибо. Опишите задачу в 1-2 предложениях, и команда свяжется с вами в ближайшее время."
        }
      }
    };

    var activeLanguage = normalizeLanguageCode(language);
    var base = dictionaries[activeLanguage] || dictionaries.en || dictionaries.hy;
    var vars = {
      email: emailText,
      contactPage: contactPage
    };
    var replies = {};
    Object.keys(base.replies).forEach(function (key) {
      replies[key] = translateTemplate(base.replies[key], vars);
    });

    return {
      title: base.title,
      subtitle: base.subtitle,
      quickLabel: base.quickLabel,
      statusLabel: base.statusLabel,
      openLabel: base.openLabel,
      closeLabel: base.closeLabel,
      inputPlaceholder: base.inputPlaceholder,
      sendLabel: base.sendLabel,
      typing: base.typing,
      greeting: translateTemplate(base.greeting, vars),
      quickIntents: base.quickIntents,
      surveyIntro: base.surveyIntro,
      surveyQuestions: base.surveyQuestions,
      surveySummary: base.surveySummary,
      surveyReminder: base.surveyReminder,
      reminderStatus: base.reminderStatus,
      replies: replies
    };
  }

  function chatIntent(text, language) {
    var normalized = String(text || "").toLowerCase().trim();
    if (!normalized) return "fallback";

    var byLanguage = {
      hy: {
        services: ["ծառայ", "համակարգ", "տեսահսկ", "ահազանգ", "հրդեհ", "ցանց"],
        price: ["գին", "արժեք", "բյուջե", "հաշվարկ"],
        timeline: ["ժամկետ", "օր", "շաբաթ", "երբ"],
        contact: ["կապ", "զանգ", "հեռախոս", "նամակ", "էլ", "փոստ", "email"],
        survey: ["բրիֆ", "հարցում", "նախագիծ", "չափագրում", "հայտ"]
      },
      ru: {
        services: ["услуг", "сервис", "систем", "видео", "пожар", "охран"],
        price: ["стоим", "цена", "бюджет", "расчет"],
        timeline: ["срок", "дней", "недел", "когда", "время"],
        contact: ["контакт", "телефон", "звон", "почт", "email"],
        survey: ["опрос", "бриф", "заявка", "проект", "контакт"]
      },
      en: {
        services: ["service", "services", "solution", "system", "surveillance", "alarm"],
        price: ["price", "pricing", "cost", "budget", "estimate"],
        timeline: ["time", "timeline", "when", "days", "week", "deadline"],
        contact: ["contact", "call", "phone", "email", "message"],
        survey: ["survey", "quote", "brief", "project", "questionnaire", "request", "proposal"]
      }
    };

    var lang = normalizeLanguageCode(language);
    var set = byLanguage[lang] || byLanguage.en;
    var fallbackSet = byLanguage.en;
    var intents = ["services", "price", "timeline", "contact", "survey"];
    var scores = { services: 0, price: 0, timeline: 0, contact: 0, survey: 0 };

    intents.forEach(function (intent) {
      var words = (set[intent] || []).concat(fallbackSet[intent] || []);
      words.forEach(function (word) {
        if (normalized.indexOf(word) >= 0) {
          scores[intent] += 1;
        }
      });
    });

    var bestIntent = "fallback";
    var bestScore = 0;
    intents.forEach(function (intent) {
      if (scores[intent] > bestScore) {
        bestScore = scores[intent];
        bestIntent = intent;
      }
    });

    return bestScore > 0 ? bestIntent : "fallback";
  }

  function startChatSurvey(copy) {
    chatSurveyState = { step: 0, answers: {} };
    appendChatMessage("bot", copy.surveyIntro);
    window.setTimeout(function () {
      appendChatMessage("bot", copy.surveyQuestions[0].question);
    }, 480);
  }

  function completeChatSurvey(copy) {
    var summary = [copy.surveySummary];
    copy.surveyQuestions.forEach(function (question) {
      var answer = chatSurveyState.answers[question.id] || "—";
      summary.push("• " + question.label + ": " + answer);
    });
    summary.push(copy.surveyReminder);
    appendChatMessage("bot", summary.join("\n"));
    chatSurveyState = null;

    try {
      window.sessionStorage.setItem("smarttech.chat.survey.completed", "1");
    } catch (error) {
      // Storage may be unavailable in private mode.
    }
  }

  function handleChatSurvey(messageText, copy) {
    if (!chatSurveyState || !copy || !copy.surveyQuestions) return false;
    var current = copy.surveyQuestions[chatSurveyState.step];
    if (!current) return false;

    chatSurveyState.answers[current.id] = messageText;
    chatSurveyState.step += 1;

    if (chatSurveyState.step >= copy.surveyQuestions.length) {
      var typingEl = showTyping(copy);
      chatTypingTimer = window.setTimeout(function () {
        if (typingEl && typingEl.parentNode) {
          typingEl.parentNode.removeChild(typingEl);
        }
        completeChatSurvey(copy);
      }, 700);
    } else {
      var nextQuestion = copy.surveyQuestions[chatSurveyState.step].question;
      var typingEl = showTyping(copy);
      chatTypingTimer = window.setTimeout(function () {
        if (typingEl && typingEl.parentNode) {
          typingEl.parentNode.removeChild(typingEl);
        }
        appendChatMessage("bot", nextQuestion);
      }, 700);
    }

    return true;
  }

  function pushChatHistory(role, text) {
    chatHistory.push({ role: role, text: text });
    if (chatHistory.length > chatHistoryLimit) {
      chatHistory = chatHistory.slice(chatHistory.length - chatHistoryLimit);
    }
  }

  function appendChatMessage(role, text, options) {
    if (!chatUi || !chatUi.messages) return;
    var config = options || {};
    var item = document.createElement("div");
    item.className = "auto-chat-message auto-chat-message-" + role;
    item.textContent = text;
    protectBrandText(item);
    chatUi.messages.appendChild(item);
    chatUi.messages.scrollTop = chatUi.messages.scrollHeight;

    if (!config.skipHistory) {
      pushChatHistory(role, text);
    }
  }

  function isChatDismissed() {
    try {
      return window.sessionStorage.getItem(chatDismissedSessionKey) === "1";
    } catch (error) {
      return false;
    }
  }

  function setChatDismissed(isDismissed) {
    if (!chatUi) return;

    try {
      if (isDismissed) {
        window.sessionStorage.setItem(chatDismissedSessionKey, "1");
      } else {
        window.sessionStorage.removeItem(chatDismissedSessionKey);
      }
    } catch (error) {
      // Session storage is best-effort.
    }

    if (isDismissed) {
      setChatOpen(false);
    }
    chatUi.root.classList.toggle("is-dismissed", !!isDismissed);
  }

  function setChatOpen(isOpen) {
    if (!chatUi) return;
    if (isOpen && chatUi.root.classList.contains("is-dismissed")) return;
    chatUi.trigger.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("is-chat-open", !!isOpen);

    if (isOpen) {
      chatUi.panel.hidden = false;
      window.requestAnimationFrame(function () {
        if (chatUi) {
          chatUi.root.classList.add("is-open");
        }
      });
      window.setTimeout(function () {
        chatUi.input.focus();
      }, 60);
      return;
    }

    chatUi.root.classList.remove("is-open");
    document.body.classList.remove("is-chat-open");
    window.setTimeout(function () {
      if (chatUi && !chatUi.root.classList.contains("is-open")) {
        chatUi.panel.hidden = true;
      }
    }, 260);
  }

  function showTyping(copy) {
    if (!chatUi) return null;
    var typingEl = document.createElement("div");
    typingEl.className = "auto-chat-message auto-chat-message-bot is-typing";
    typingEl.textContent = copy.typing;
    typingEl.setAttribute("data-translate-id", "chat-typing");
    chatUi.messages.appendChild(typingEl);
    chatUi.messages.scrollTop = chatUi.messages.scrollHeight;
    return typingEl;
  }

  function refreshQuickButtons(copy) {
    if (!chatUi || !chatUi.quickActions) return;
    chatUi.quickActions.innerHTML = "";
    copy.quickIntents.forEach(function (item) {
      var button = document.createElement("button");
      button.className = "auto-chat-quick";
      button.type = "button";
      button.setAttribute("data-intent", item.id);
      button.setAttribute("data-translate-id", "chat-quick-" + item.id);
      button.setAttribute("translate", "yes");
      button.textContent = item.label;
      chatUi.quickActions.appendChild(button);
    });
  }

  function renderChatHistory(copy) {
    if (!chatUi) return;
    chatUi.messages.innerHTML = "";

    if (!chatHistory.length) {
      appendChatMessage("bot", copy.greeting);
      return;
    }

    chatHistory.forEach(function (entry) {
      appendChatMessage(entry.role, entry.text, { skipHistory: true });
    });
  }

  function respondByIntent(intent, copy) {
    if (chatTypingTimer) {
      window.clearTimeout(chatTypingTimer);
      chatTypingTimer = null;
    }
    var typingEl = showTyping(copy);
    chatTypingTimer = window.setTimeout(function () {
      if (typingEl && typingEl.parentNode) {
        typingEl.parentNode.removeChild(typingEl);
      }
      appendChatMessage("bot", copy.replies[intent] || copy.replies.fallback);
    }, 680);
  }

  function handleChatRequest(messageText, intent, copy) {
    appendChatMessage("user", messageText);

    if (chatSurveyState && handleChatSurvey(messageText, copy)) {
      return;
    }

    if (intent === "survey") {
      startChatSurvey(copy);
      return;
    }

    respondByIntent(intent, copy);
  }

  function buildChatUi() {
    var host = document.createElement("div");
    host.className = "auto-chat-shell";
    host.innerHTML = '' +
      '<div class="auto-chat-controls">' +
        '<button class="auto-chat-trigger" type="button" aria-expanded="false">' +
          '<span class="auto-chat-trigger-icon" aria-hidden="true">ST</span>' +
          '<span class="auto-chat-trigger-text"></span>' +
        "</button>" +
        '<button class="auto-chat-dismiss" type="button" aria-label="Hide chat">&times;</button>' +
      "</div>" +
      '<section class="auto-chat-panel" hidden>' +
        '<header class="auto-chat-head">' +
          '<div class="auto-chat-head-copy">' +
            '<p class="auto-chat-status"><span class="auto-chat-status-dot"></span><span class="auto-chat-status-text"></span></p>' +
            '<h3 class="auto-chat-title"></h3>' +
            '<p class="auto-chat-subtitle"></p>' +
          "</div>" +
          '<button class="auto-chat-close" type="button" aria-label="Close chat">&times;</button>' +
        "</header>" +
        '<div class="auto-chat-messages" aria-live="polite"></div>' +
        '<p class="auto-chat-quick-label"></p>' +
        '<div class="auto-chat-actions"></div>' +
        '<form class="auto-chat-form">' +
          '<input class="auto-chat-input" type="text" autocomplete="off">' +
          '<button class="auto-chat-send" type="submit"></button>' +
        "</form>" +
      "</section>";
    document.body.appendChild(host);

    var ui = {
      root: host,
      trigger: host.querySelector(".auto-chat-trigger"),
      dismiss: host.querySelector(".auto-chat-dismiss"),
      triggerText: host.querySelector(".auto-chat-trigger-text"),
      panel: host.querySelector(".auto-chat-panel"),
      title: host.querySelector(".auto-chat-title"),
      subtitle: host.querySelector(".auto-chat-subtitle"),
      statusText: host.querySelector(".auto-chat-status-text"),
      quickLabel: host.querySelector(".auto-chat-quick-label"),
      close: host.querySelector(".auto-chat-close"),
      messages: host.querySelector(".auto-chat-messages"),
      quickActions: host.querySelector(".auto-chat-actions"),
      form: host.querySelector(".auto-chat-form"),
      input: host.querySelector(".auto-chat-input"),
      send: host.querySelector(".auto-chat-send")
    };

    ui.trigger.addEventListener("click", function () {
      setChatOpen(!ui.root.classList.contains("is-open"));
    });

    ui.close.addEventListener("click", function () {
      setChatOpen(false);
    });

    ui.dismiss.addEventListener("click", function () {
      setChatDismissed(true);
    });

    ui.quickActions.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-intent]");
      if (!button) return;
      var lang = activeUiLanguage();
      var copy = chatDictionary(lang);
      var intent = button.getAttribute("data-intent") || "fallback";
      handleChatRequest(button.textContent || "", intent, copy);
    });

    ui.form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = String(ui.input.value || "").trim();
      if (!value) return;
      ui.input.value = "";
      var lang = activeUiLanguage();
      var copy = chatDictionary(lang);
      handleChatRequest(value, chatIntent(value, lang), copy);
    });

    return ui;
  }

  function setupAutoChat() {
    if (!chatUi) {
      chatUi = buildChatUi();
    }

    var lang = activeUiLanguage();
    var copy = chatDictionary(lang);
    chatUi.title.textContent = copy.title;
    chatUi.subtitle.textContent = copy.subtitle;
    var reminderFlag = false;
    try {
      reminderFlag = window.sessionStorage.getItem("smarttech.chat.survey.completed") === "1";
    } catch (error) {
      reminderFlag = false;
    }
    chatUi.statusText.textContent = copy.statusLabel + (reminderFlag && copy.reminderStatus ? " • " + copy.reminderStatus : "");
    chatUi.quickLabel.textContent = copy.quickLabel;
    chatUi.triggerText.textContent = copy.title;
    chatUi.trigger.setAttribute("aria-label", copy.openLabel);
    chatUi.close.setAttribute("aria-label", copy.closeLabel);
    if (chatUi.dismiss) {
      chatUi.dismiss.setAttribute("aria-label", copy.hideLabel || copy.closeLabel);
    }
    chatUi.input.setAttribute("placeholder", copy.inputPlaceholder);
    chatUi.send.textContent = copy.sendLabel;
    refreshQuickButtons(copy);

    if (chatLanguage !== lang) {
      chatLanguage = lang;
      chatHistory = [];
      if (chatTypingTimer) {
        window.clearTimeout(chatTypingTimer);
        chatTypingTimer = null;
      }
    }

    renderChatHistory(copy);
    setChatDismissed(isChatDismissed());
  }

  function buildBackToTopUi() {
    var button = document.createElement("button");
    button.className = "back-to-top-button";
    button.type = "button";
    button.setAttribute("aria-label", "Back to top");
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5 5 12l1.6 1.6 4.3-4.3V20h2.2V9.3l4.3 4.3L19 12l-7-7Z" fill="currentColor"/></svg>';
    document.body.appendChild(button);

    button.addEventListener("click", function () {
      var behavior = uiSettings.motion ? "smooth" : "auto";
      try {
        window.scrollTo({ top: 0, behavior: behavior });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    });

    window.addEventListener("scroll", function () {
      button.classList.toggle("is-visible", window.scrollY > 520);
    }, { passive: true });

    button.classList.toggle("is-visible", window.scrollY > 520);
    return button;
  }

  function setupBackToTop() {
    if (!backToTopUi) {
      backToTopUi = buildBackToTopUi();
    }
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("popstate", render);

  setupEntryLoader();

  if (window.location.protocol === "file:") {
    if (!window.location.hash) {
      window.location.hash = "home";
    } else {
      render();
    }
  } else {
    render();
  }
})(window.SmartTech);
