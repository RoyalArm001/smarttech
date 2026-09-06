(function (site) {
  var pages = ["home", "services", "projects", "album", "chat", "request", "partners", "team", "about", "contact", "member", "profile", "login", "licenses", "help", "faq", "terms", "privacy", "disclaimer", "landing", "blog", "article"];
  var landingSlugs = [
    "cctv-installation-yerevan",
    "fire-alarm-systems-yerevan",
    "electrical-installation-yerevan",
    "access-control-yerevan",
    "security-systems-yerevan"
  ];
  var entryLoader = null;
  var shouldHideEntryLoaderAfterRender = false;
  var firstRenderDone = false;
  var chatUi = null;
  var chatLanguage = null;
  var chatTypingTimer = null;
  var chatHistory = [];
  var chatHistoryLimit = 40;
  var chatQuestionLimit = 10;
  var chatUserQuestionCount = 0;
  var chatLimitReached = false;
  var chatPageStorageKey = "smarttech.chatPage.v1";
  var chatPageProfileKey = "smarttech.chatPage.profile.v1";
  var chatPageClientIdKey = "smarttech.chatPage.clientId";
  var chatPageWordLimit = 8000;
  var chatPageQuestionLimit = 35;
  var chatPageBlockMs = 2 * 24 * 60 * 60 * 1000;
  var chatSurveyState = null;
  var chatLatestSurveyPayload = null;
  var chatBriefPayloads = new WeakMap();
  var chatRequestsInFlight = new Set();
  var backToTopUi = null;
  var licenseViewerUi = null;
  var licenseViewerReady = false;
  var licenseViewerScale = 1;
  var licenseViewerDrag = null;
  var routeTransition = null;
  var routeTransitionTimer = null;
  var uiSettingsStorageKey = "smarttech.uiSettings";
  var onlineLangStorageKey = "smarttech.onlineLang.v3";
  var metricsVisitSessionKey = "smarttech.metrics.visitSession";
  var staticMetricsStorageKey = "smarttech.metrics.staticVisits";
  var firebaseAuthSessionKey = "smarttech.firebase.anonymousAuth";
  var chatDismissedSessionKey = "smarttech.chat.dismissed";
  var chatQuestionSessionKey = "smarttech.quickChat.questions";
  var manualThemeStorageKey = "smarttech.theme";
  var adminAlbumSignature = "";
  var adminAlbumLoading = false;
  var onlineTranslateScriptLoaded = false;
  var googleUiCleanupTimer = null;
  var languageOutsideClickHandler = null;
  var menuOutsideClickHandler = null;
  var menuEscHandler = null;
  var menuResizeHandler = null;
  var closeSiteMenuHandler = null;
  var closeLanguageSwitchersHandler = null;
  var autoThemeTimer = null;
  var imageFallbackBound = false;
  var searchClickHandler = null;
  var searchOutsideHandler = null;
  var searchKeyHandler = null;
  var searchPanelClickHandler = null;
  var firebaseAuthTokenPromise = null;
  var uiSettings = readUiSettings();

  var googleAnalyticsMeasurementId = "G-1SC80R2NZE";
  var DISABLE_GOOGLE_TRANSLATE = true; // Set to true to disable Google Translate widget for faster performance

  function runtimeConfig() {
    return window.SmartTechRuntimeConfig || {};
  }

  function cmsApiBaseUrl() {
    return String(runtimeConfig().cmsApiBaseUrl || "").replace(/\/+$/g, "");
  }

  function cmsApiUrl(path) {
    var base = cmsApiBaseUrl();
    return base ? base + path : path;
  }

  function cmsFetchCredentials() {
    return cmsApiBaseUrl() ? "omit" : "same-origin";
  }

  function isAdminAlbumImagePath(value) {
    try {
      var url = new URL(String(value || ""), window.location.origin);
      return /^\/img\/admin-album\/[A-Za-z0-9._-]+\.webp$/i.test(url.pathname);
    } catch (error) {
      return false;
    }
  }

  function cmsAssetUrl(value) {
    var image = String(value || "");
    if (!image || /^https?:\/\//i.test(image)) return image;
    var base = cmsApiBaseUrl();
    return base && image.charAt(0) === "/" ? base + image : image;
  }

  /* Mobile Bottom Navigation (must be defined early, before first render) */
  var mobileBottomNav = null;
  var mobileBottomNavEventsBound = false;
  var bottomNavTabs = [
    {
      id: "home",
      type: "link",
      route: "home",
      labelKey: "nav.home",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.8 10.8 12 4l8.2 6.8V20a1 1 0 0 1-1 1h-4.6v-5.4H9.4V21H4.8a1 1 0 0 1-1-1v-9.2Z"></path></svg>'
    },
    {
      id: "request",
      type: "link",
      route: "request",
      labelKey: "common.proposal",
      labels: { hy: "Պատվիրել", en: "Order", ru: "Заказать" },
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.8h12a1.4 1.4 0 0 1 1.4 1.4v13L17 17.7H6a1.4 1.4 0 0 1-1.4-1.4V6.2A1.4 1.4 0 0 1 6 4.8Z"></path><path d="M8 9h8M8 12.5h5.6"></path></svg>'
    },
    {
      id: "menu",
      type: "button",
      action: "menu",
      labels: { hy: "Մենյու", en: "Menu", ru: "Меню" },
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"></path></svg>'
    },
    {
      id: "chat",
      type: "button",
      action: "chat",
      labels: { hy: "Արագ չատ", en: "Quick chat", ru: "Быстрый чат" },
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 6.4A6.8 6.8 0 0 1 12 4h1.2a6.4 6.4 0 0 1 6.4 6.4v.5a6.4 6.4 0 0 1-6.4 6.4H11l-4.2 2.4.8-3.7a6.7 6.7 0 0 1-2.4-5.1v-.5Z"></path><path d="m15.8 6.8.5 1.1 1.1.5-1.1.5-.5 1.1-.5-1.1-1.1-.5 1.1-.5.5-1.1ZM10 10h3.8M10 13h5.5"></path></svg>'
    },
    {
      id: "team",
      type: "link",
      route: "team",
      activeRoutes: ["team", "member"],
      labelKey: "nav.team",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7.2" cy="8.3" r="2.45"></circle><path d="M4.1 17.6c0-1.95 1.4-3.55 3.1-3.55s3.1 1.6 3.1 3.55H4.1Z"></path><circle cx="16.8" cy="8.3" r="2.45"></circle><path d="M13.7 17.6c0-1.95 1.4-3.55 3.1-3.55s3.1 1.6 3.1 3.55h-6.2Z"></path><circle cx="12" cy="9.7" r="2.85"></circle><path d="M6.9 20c0-2.75 2.25-5 5.1-5s5.1 2.25 5.1 5H6.9Z"></path></svg>'
    },
  ];

  function bottomNavLabel(tab) {
    var language = site.i18n && site.i18n.language ? site.i18n.language : "hy";
    if (tab.labels) {
      return tab.labels[language] || tab.labels.en || tab.labels.hy || tab.id;
    }
    if (tab.labelKey) {
      var translated = site.i18n.get(tab.labelKey, "");
      if (translated) return translated;
    }
    return tab.id;
  }

  function renderMobileBottomNavItems(nav) {
    var list = nav.querySelector(".bottom-nav-list");
    if (!list) return;

    list.innerHTML = bottomNavTabs.map(function (tab) {
      var label = bottomNavLabel(tab);
      var className = "bottom-nav-item bottom-nav-" + tab.id;
      var icon = '<span class="bottom-nav-icon">' + (tab.icon || "") + "</span>";
      var text = '<span class="bottom-nav-label">' + site.utils.escapeHtml(label) + "</span>";

      if (tab.type === "button") {
        return '<button class="' + className + '" type="button" data-bottom-action="' + tab.action + '" aria-label="' + site.utils.escapeHtml(label) + '">' + icon + text + "</button>";
      }

      return '<a class="' + className + '" href="' + site.utils.escapeHtml(site.utils.pageUrl(tab.route || tab.id)) + '" data-route="' + site.utils.escapeHtml(tab.route || tab.id) + '" aria-label="' + site.utils.escapeHtml(label) + '">' + icon + text + "</a>";
    }).join("");
  }

  function createMobileBottomNav() {
    if (mobileBottomNav) {
      renderMobileBottomNavItems(mobileBottomNav);
      return mobileBottomNav;
    }

    mobileBottomNav = document.createElement("nav");
    mobileBottomNav.className = "mobile-bottom-nav";
    mobileBottomNav.setAttribute("aria-label", "Mobile navigation");

    var list = document.createElement("div");
    list.className = "bottom-nav-list";

    mobileBottomNav.appendChild(list);
    document.body.appendChild(mobileBottomNav);
    renderMobileBottomNavItems(mobileBottomNav);

    return mobileBottomNav;
  }

  function updateMobileBottomNavActive() {
    if (!mobileBottomNav) return;

    var current = currentRoute().page || "home";
    if (current === "index") current = "home";
    if (current === "service") current = "services";
    if (current === "project") current = "projects";
    if (current === "member") current = "team";

    var items = mobileBottomNav.querySelectorAll(".bottom-nav-item");
    var menuOpen = document.body.classList.contains("is-menu-open");
    var chatOpen = document.body.classList.contains("is-chat-open");

    items.forEach(function (item) {
      var action = item.getAttribute("data-bottom-action") || "";
      var route = item.getAttribute("data-route") || "";
      var tab = bottomNavTabs.filter(function (entry) {
        return (entry.action && entry.action === action) || (entry.route && entry.route === route);
      })[0];
      var activeRoutes = tab && tab.activeRoutes ? tab.activeRoutes : [route];
      var isActive = action === "menu"
        ? menuOpen
        : action === "chat"
          ? chatOpen
          : !menuOpen && !chatOpen && activeRoutes.indexOf(current) >= 0;
      item.classList.toggle("is-active", isActive);
    });
  }

  function setupMobileBottomNav() {
    var nav = createMobileBottomNav();
    if (!mobileBottomNavEventsBound) {
      mobileBottomNavEventsBound = true;
      nav.addEventListener("click", function (event) {
        var actionButton = event.target.closest("[data-bottom-action]");
        if (!actionButton) {
          if (event.target.closest("a")) {
            setChatOpen(false);
          }
          return;
        }

        var action = actionButton.getAttribute("data-bottom-action") || "";
        event.preventDefault();

        if (action === "menu") {
          setChatOpen(false);
          var menuToggle = document.querySelector(".nav-toggle");
          if (menuToggle) menuToggle.click();
          window.setTimeout(updateMobileBottomNavActive, 40);
          return;
        }

        if (action === "chat") {
          var openMenuToggle = document.querySelector(".nav-panel.is-open") ? document.querySelector(".nav-toggle") : null;
          if (openMenuToggle) openMenuToggle.click();
          setChatDismissed(false);
          if (chatLimitReached || chatUserQuestionCount >= chatQuestionLimit) {
            redirectToFullChatPage();
          } else {
            setChatOpen(true);
          }
          updateMobileBottomNavActive();
        }
      });
    }
    updateMobileBottomNavActive();
  }

  function initializeGoogleAnalytics() {
    if (!/^G-[A-Z0-9]+$/i.test(googleAnalyticsMeasurementId) || googleAnalyticsMeasurementId === "G-XXXXXXXXXX") return;
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

      if (parts.length === 1 && landingSlugs.indexOf(parts[0]) >= 0) {
        return { page: "landing", id: parts[0] };
      }

      if (parts[0] === "blog" && parts.length === 1) {
        return { page: "blog", id: "" };
      }

      if (parts[0] === "blog" && parts.length === 2) {
        return { page: "article", id: parts[1] };
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
        site.sections.home()
      ].join("");
    }

    if (page === "services") return site.sections.services();
    if (page === "service") return site.sections.serviceDetail(currentRoute().id);
    if (page === "projects") return site.sections.projects();
    if (page === "album") return site.sections.album();
    if (page === "chat") return site.sections.chatPage();
    if (page === "project") return site.sections.projectDetail(currentRoute().id);
    if (page === "request") return site.sections.request();
    if (page === "member") return site.sections.memberDetail(currentRoute().id);
    if (page === "partners") return site.sections.partners();
    if (page === "team") return site.sections.team();
    if (page === "about") return site.sections.about();
    if (page === "contact") return site.sections.contact();
    if (page === "licenses") return site.sections.about();
    if (page === "help" || page === "faq" || page === "terms" || page === "privacy" || page === "disclaimer") {
      return infoPageMarkup(page);
    }
    if (page === "landing") return site.sections.landingPage(currentRoute().id);
    if (page === "blog") return site.sections.blogIndex();
    if (page === "article") return site.sections.articlePage(currentRoute().id);

    return site.sections.hero();
  }

  function infoPageMarkup(page) {
    var e = site.utils.escapeHtml;
    var content = infoPageCopy(page);
    var items = content.items.map(function (item) {
      return '<li><strong>' + e(item.title) + '</strong><span>' + e(item.text) + '</span></li>';
    }).join("");

    return [
      site.sections.pageHero({
        eyebrow: content.eyebrow,
        title: content.title,
        text: content.text,
        image: site.content.company.heroImages[1],
        tone: "about"
      }),
      '<section class="section info-page-section">',
        '<div class="container">',
          '<div class="info-page-panel">',
            '<ul class="info-page-list">' + items + '</ul>',
          '</div>',
        '</div>',
      '</section>'
    ].join("");
  }

  function infoPageCopy(page) {
    var dictionaries = {
      hy: {
        help: {
          eyebrow: "Օգնություն",
          title: "Ինչպես օգտվել կայքից",
          text: "Արագ գտեք ծառայությունները, նախագծերը և կապի տվյալները։",
          items: [
            { title: "Ծառայություններ", text: "Ծառայությունների էջում կարող եք տեսնել հիմնական ուղղությունները և յուրաքանչյուր համակարգի նկարագրությունը։" },
            { title: "Հայտ", text: "Հայտի էջը բացում է պատրաստ նամակ՝ ձեր ընտրած համակարգերով և կոնտակտային տվյալներով։" },
            { title: "Կապ", text: "Եթե պետք է արագ պատասխան, օգտվեք հեռախոսից, email-ից կամ կոնտակտային էջից։" }
          ]
        },
        faq: {
          eyebrow: "FAQ",
          title: "Հաճախ տրվող հարցեր",
          text: "Կարճ պատասխաններ Smart Tech-ի ծառայությունների մասին։",
          items: [
            { title: "Արդյո՞ք կատարում եք չափագրում", text: "Այո, նախնական քննարկումից հետո կարող ենք կազմակերպել մասնագետի այց և տեխնիկական առաջարկ։" },
            { title: "Ինչքա՞ն է տևում տեղադրումը", text: "Փոքր աշխատանքները սովորաբար տևում են մի քանի օր, իսկ մեծ նախագծերը գնահատվում են ըստ ծավալի։" },
            { title: "Կատարո՞ւմ եք սպասարկում", text: "Այո, սպասարկում ենք տեղադրված համակարգերը և օգնում ենք կարգաբերման կամ վերանորոգման հարցերում։" }
          ]
        },
        terms: {
          eyebrow: "Պայմաններ",
          title: "Օգտագործման պայմաններ",
          text: "Այս էջը նկարագրում է կայքի տեղեկատվական օգտագործման հիմնական պայմանները։",
          items: [
            { title: "Տեղեկատվական բնույթ", text: "Կայքի բովանդակությունը ներկայացված է ընդհանուր տեղեկատվության համար և չի համարվում վերջնական կոմերցիոն առաջարկ։" },
            { title: "Գները և ժամկետները", text: "Գները, ապրանքների հասանելիությունը և ժամկետները հաստատվում են անհատական քննարկումից հետո։" },
            { title: "Կապի ձևեր", text: "Հայտերը ուղարկվում են email-ի կամ հեռախոսային կապի միջոցով։" }
          ]
        },
        privacy: {
          eyebrow: "Գաղտնիություն",
          title: "Գաղտնիության քաղաքականություն",
          text: "Մենք օգտագործում ենք միայն անհրաժեշտ կոնտակտային տվյալները՝ հարցումներին պատասխանելու համար։",
          items: [
            { title: "Տվյալների նպատակ", text: "Անունը, հեռախոսը, email-ը և հաղորդագրությունը օգտագործվում են ձեզ հետ կապ հաստատելու համար։" },
            { title: "Այցելությունների հաշվիչ", text: "Կայքը կարող է պահպանել միայն ընդհանուր այցելությունների թիվը՝ առանց անձնական տվյալների։" },
            { title: "Երրորդ կողմեր", text: "Մենք չենք վաճառում կամ փոխանցում ձեր կոնտակտային տվյալները գովազդային նպատակներով։" }
          ]
        },
        disclaimer: {
          eyebrow: "Նշում",
          title: "Պատասխանատվության սահմանափակում",
          text: "Կայքում ներկայացված նյութերը կարող են թարմացվել առանց նախնական ծանուցման։",
          items: [
            { title: "Նկարներ", text: "Նկարները կարող են լինել նախագծերի, ծառայությունների կամ թեմատիկ ներկայացման համար։" },
            { title: "Տեխնիկական լուծումներ", text: "Վերջնական լուծումը ընտրվում է օբյեկտի ուսումնասիրությունից և պահանջների ճշտումից հետո։" },
            { title: "Թարմացումներ", text: "Կայքի բովանդակությունը կարող է փոխվել՝ ծառայությունները և նախագծերը ճիշտ ներկայացնելու համար։" }
          ]
        }
      },
      en: {
        help: {
          eyebrow: "Help",
          title: "How to use the website",
          text: "Quickly find services, projects and contact details.",
          items: [
            { title: "Services", text: "The services page shows the main directions and descriptions for each system." },
            { title: "Request", text: "The request page opens a prepared email with your selected systems and contact details." },
            { title: "Contact", text: "For a quick response, use phone, email or the contact page." }
          ]
        },
        faq: {
          eyebrow: "FAQ",
          title: "Frequently asked questions",
          text: "Short answers about Smart Tech services.",
          items: [
            { title: "Do you provide site surveys?", text: "Yes, after an initial discussion we can arrange a specialist visit and technical proposal." },
            { title: "How long does installation take?", text: "Small works usually take a few days; larger projects are estimated by scope." },
            { title: "Do you provide maintenance?", text: "Yes, we maintain installed systems and help with setup or repair." }
          ]
        },
        terms: {
          eyebrow: "Terms",
          title: "Terms and rules",
          text: "This page describes the basic terms for using the website information.",
          items: [
            { title: "Informational content", text: "Website content is for general information and is not a final commercial offer." },
            { title: "Prices and timing", text: "Prices, availability and timing are confirmed after an individual discussion." },
            { title: "Communication", text: "Requests are sent by email or phone contact." }
          ]
        },
        privacy: {
          eyebrow: "Privacy",
          title: "Privacy policy",
          text: "We use only the contact details needed to answer requests.",
          items: [
            { title: "Purpose", text: "Name, phone, email and message are used to contact you about your request." },
            { title: "Visit counter", text: "The website may store only the total visit count without personal data." },
            { title: "Third parties", text: "We do not sell or transfer your contact details for advertising purposes." }
          ]
        },
        disclaimer: {
          eyebrow: "Disclaimer",
          title: "Disclaimer",
          text: "Materials on the website may be updated without prior notice.",
          items: [
            { title: "Images", text: "Images may represent projects, services or thematic examples." },
            { title: "Technical solutions", text: "The final solution is selected after site review and requirements clarification." },
            { title: "Updates", text: "Website content may change to better present services and projects." }
          ]
        }
      },
      ru: {
        help: {
          eyebrow: "Помощь",
          title: "Как пользоваться сайтом",
          text: "Быстро найдите услуги, проекты и контакты.",
          items: [
            { title: "Услуги", text: "На странице услуг показаны основные направления и описание каждой системы." },
            { title: "Заявка", text: "Страница заявки открывает готовое письмо с выбранными системами и контактными данными." },
            { title: "Контакты", text: "Для быстрого ответа используйте телефон, email или страницу контактов." }
          ]
        },
        faq: {
          eyebrow: "FAQ",
          title: "Частые вопросы",
          text: "Короткие ответы об услугах Smart Tech.",
          items: [
            { title: "Делаете ли вы замер?", text: "Да, после первичного обсуждения можем организовать визит специалиста и техническое предложение." },
            { title: "Сколько длится монтаж?", text: "Небольшие работы обычно занимают несколько дней, крупные проекты оцениваются по объему." },
            { title: "Есть ли обслуживание?", text: "Да, мы обслуживаем установленные системы и помогаем с настройкой или ремонтом." }
          ]
        },
        terms: {
          eyebrow: "Условия",
          title: "Условия и правила",
          text: "Эта страница описывает основные условия использования информации на сайте.",
          items: [
            { title: "Информационный характер", text: "Контент сайта представлен для общей информации и не является финальным коммерческим предложением." },
            { title: "Цены и сроки", text: "Цены, наличие и сроки подтверждаются после индивидуального обсуждения." },
            { title: "Связь", text: "Заявки отправляются через email или телефонный контакт." }
          ]
        },
        privacy: {
          eyebrow: "Конфиденциальность",
          title: "Политика конфиденциальности",
          text: "Мы используем только контактные данные, необходимые для ответа на запросы.",
          items: [
            { title: "Цель", text: "Имя, телефон, email и сообщение используются для связи по вашей заявке." },
            { title: "Счетчик посещений", text: "Сайт может хранить только общий счетчик посещений без персональных данных." },
            { title: "Третьи стороны", text: "Мы не продаем и не передаем ваши контактные данные для рекламы." }
          ]
        },
        disclaimer: {
          eyebrow: "Примечание",
          title: "Ограничение ответственности",
          text: "Материалы сайта могут обновляться без предварительного уведомления.",
          items: [
            { title: "Изображения", text: "Изображения могут относиться к проектам, услугам или тематическим примерам." },
            { title: "Технические решения", text: "Финальное решение выбирается после изучения объекта и уточнения требований." },
            { title: "Обновления", text: "Контент сайта может меняться для более точного представления услуг и проектов." }
          ]
        }
      }
    };

    var language = site.i18n.language;
    var dictionary = dictionaries[language] || dictionaries.en;
    return dictionary[page] || dictionaries.en.help;
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

  function setupImageFallbacks(root) {
    var scope = root || document;
    scope.querySelectorAll("img").forEach(function (image) {
      if (!image.getAttribute("data-fallback-src")) {
        image.setAttribute("data-fallback-src", "/img/smart-tech.png");
      }
    });

    scope.querySelectorAll("img[data-src].is-deferred-src:not([src])").forEach(function (image) {
      var deferredSrc = image.getAttribute("data-src");
      if (!deferredSrc) return;
      image.src = deferredSrc;
      image.removeAttribute("data-src");
    });

    if (imageFallbackBound) return;
    imageFallbackBound = true;
    document.addEventListener("error", function (event) {
      var image = event.target;
      if (!image || image.tagName !== "IMG") return;
      var fallback = image.getAttribute("data-fallback-src") || "/img/smart-tech.png";
      if (image.getAttribute("src") === fallback || image.src.indexOf(fallback) >= 0) return;
      image.src = fallback;
    }, true);
  }

  function normalizeAdminAlbumPhoto(item) {
    item = item || {};
    var image = String(item.image || "");
    if (!isAdminAlbumImagePath(image)) {
      return null;
    }
    return {
      id: String(item.id || ""),
      section: item.section === "current" ? "current" : "completed",
      image: cmsAssetUrl(image),
      title: String(item.title || "Smart Tech").slice(0, 90),
      caption: String(item.caption || item.title || "Smart Tech").slice(0, 150),
      status: String(item.status || "").slice(0, 70),
      createdAt: String(item.createdAt || "")
    };
  }

  function loadAdminAlbumPhotosIfNeeded() {
    if (currentRoute().page !== "album" || adminAlbumLoading || typeof window.fetch !== "function") return;
    adminAlbumLoading = true;

    window.fetch(cmsApiUrl("/api/album"), {
      cache: "no-store",
      credentials: cmsFetchCredentials()
    })
      .then(function (response) {
        return response.ok ? response.json() : { photos: [] };
      })
      .then(function (payload) {
        var photos = ((payload && payload.photos) || [])
          .map(normalizeAdminAlbumPhoto)
          .filter(Boolean);
        var signature = JSON.stringify(photos);
        if (signature === adminAlbumSignature) return;

        adminAlbumSignature = signature;
        site.content.adminAlbumPhotos = photos;
        if (currentRoute().page === "album") {
          render();
        }
      })
      .catch(function () {})
      .finally(function () {
        adminAlbumLoading = false;
      });
  }

  var projectsCarouselCleanup = null;
  function setupProjectsCarousel() {
    if (projectsCarouselCleanup) projectsCarouselCleanup();
    projectsCarouselCleanup = null;
    var root = document.querySelector('[data-current-projects-carousel]');
    if (!root) return;
    var slides = Array.from(root.querySelectorAll('[data-current-project-slide]'));
    var dots = root.querySelectorAll('[data-carousel-dot]');
    var meter = root.querySelector('[data-carousel-meter]');
    var index = 0, timer = null;
    var delay = Number(root.dataset.interval) || 6500;
    function stop() { window.clearTimeout(timer); root.classList.add('is-paused'); }
    function start() {
      stop();
      if (!root.isConnected || slides.length < 2 || document.hidden || root.matches(':hover') || root.contains(document.activeElement) || !uiSettings.motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      root.classList.remove('is-paused');
      if (meter) { meter.classList.remove('is-running'); void meter.offsetWidth; meter.classList.add('is-running'); }
      timer = window.setTimeout(function () { show(index + 1); }, delay);
    }
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
        slide.setAttribute('aria-hidden', String(i !== index));
        slide.inert = i !== index;
      });
      dots.forEach(function (dot) {
        var active = Number(dot.dataset.carouselDot) === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', String(active));
      });
      root.querySelector('[data-carousel-progress]').textContent = (index + 1) + ' / ' + slides.length;
      start();
    }
    root.querySelector('[data-carousel-prev]').onclick = function () { show(index - 1); };
    root.querySelector('[data-carousel-next]').onclick = function () { show(index + 1); };
    dots.forEach(function (dot) { dot.onclick = function () { show(Number(dot.dataset.carouselDot)); }; });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', function () { window.setTimeout(start, 0); });
    document.addEventListener('visibilitychange', start);
    projectsCarouselCleanup = function () { stop(); document.removeEventListener('visibilitychange', start); };
    show(0);
  }

  function render() {
    var page = currentRoute().page;
    var oldStickyDock = document.querySelector(".sticky-contact-dock");
    if (oldStickyDock && oldStickyDock.parentNode) {
      oldStickyDock.parentNode.removeChild(oldStickyDock);
    }
    var main = document.getElementById("site-main");
    var preferredLang = activeUiLanguage();
    if (site.i18n.language !== preferredLang) {
      site.i18n.setLanguage(preferredLang);
    }
    applyUiSettings();
    if (firstRenderDone) runRouteTransition();
    document.body.classList.remove("is-menu-open");
    document.body.classList.toggle("is-chat-page", page === "chat");
    document.documentElement.lang = preferredLang;
    document.getElementById("site-header").innerHTML = site.sections.header();
    if (page !== "profile" && page !== "login") {
      main.innerHTML = pageMarkup(page);
    }
    animateRoute(main, page);
    document.getElementById("site-footer").innerHTML = site.sections.footer();
    applyTranslationBoundaries(page);
    setupImageFallbacks(document);
    setupNavigation();
    setupLanguageSwitcher();
    setupThemeToggle();
    setupSearch();
    setupPwaInstallButton();
    setupLicenseViewer();
    if (!DISABLE_GOOGLE_TRANSLATE) enforceHiddenGoogleTranslateUi();
    setupContactForm();
    setupRequestBuilder();
    setupReveal();
    setupRevealSlides();
    setupHomeServiceStream();
    setupProjectsCarousel();
    setupFooterYear();
    setupAutoChat();
    setupChatPage();
    setupBackToTop();
    setupMobileBottomNav();
    updateMobileBottomNavActive();
    setupMetricsAutomation();
    initializeGoogleAnalytics();
    trackGoogleAnalyticsPageView();
    loadAdminAlbumPhotosIfNeeded();
    resetScroll();

    if (!firstRenderDone) {
      firstRenderDone = true;
      if (shouldHideEntryLoaderAfterRender) {
        window.setTimeout(hideEntryLoader, 240);
      }
    }
  }

  function animateRoute(main, page) {
    if (!main) return;
    main.className = "route-shell route-" + page;
    main.classList.remove("route-enter");
    void main.offsetWidth;
    if (firstRenderDone) main.classList.add("route-enter");
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

    function setNavGroupExpanded(group, expand) {
      var expandButton = group.querySelector(".nav-expand-btn");
      var submenu = group.querySelector(".nav-submenu");
      if (!expandButton || !submenu) return;
      expandButton.setAttribute("aria-expanded", String(expand));
      group.classList.toggle("is-expanded", expand);
      submenu.hidden = !expand;
      submenu.setAttribute("aria-hidden", String(!expand));
    }

    function collapseNavSubmenus() {
      panel.querySelectorAll(".nav-item.has-children").forEach(function (group) {
        setNavGroupExpanded(group, false);
      });
    }

    function syncNavSubmenusOnOpen() {
      var groups = panel.querySelectorAll(".nav-item.has-children");
      var activeGroup = null;

      groups.forEach(function (group) {
        if (group.classList.contains("is-route-active")) {
          activeGroup = group;
        }
      });

      groups.forEach(function (group) {
        setNavGroupExpanded(group, group === activeGroup);
      });
    }

    panel.querySelectorAll(".nav-item.has-children").forEach(function (group) {
      var expandButton = group.querySelector(".nav-expand-btn");
      if (!expandButton) return;

      expandButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var willExpand = !group.classList.contains("is-expanded");

        panel.querySelectorAll(".nav-item.has-children").forEach(function (other) {
          if (other !== group) {
            setNavGroupExpanded(other, false);
          }
        });

        setNavGroupExpanded(group, willExpand);
      });
    });

    function setMenuState(isOpen, restoreFocus) {
      panel.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("is-menu-open", isOpen);
      if (mobileBottomNav) {
        updateMobileBottomNavActive();
      }
      syncMobileMenuGeometry();
      toggle.setAttribute("aria-expanded", String(isOpen));
      panel.setAttribute("aria-hidden", String(!isOpen));
      if (isOpen) {
        syncNavSubmenusOnOpen();
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
        collapseNavSubmenus();
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
        if (typeof closeLanguageSwitchersHandler === "function") {
          closeLanguageSwitchersHandler();
        }
        setMenuState(true, false);
      }
    });

    closeSiteMenuHandler = function (restoreFocus) {
      if (!panel.classList.contains("is-open")) return;
      closeMenu(restoreFocus);
    };

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        closeMenu(false);
      });
    }

    var mobileMenuClose = panel.querySelector("[data-mobile-menu-close]");
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", function () {
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

    function closeAllLanguageSwitchers() {
      switchers.forEach(function (switcher) {
        switcher.classList.remove("is-open");
        var langToggle = switcher.querySelector("[data-language-toggle]");
        if (langToggle) {
          langToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    closeLanguageSwitchersHandler = closeAllLanguageSwitchers;

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
        if (typeof closeSiteMenuHandler === "function") {
          closeSiteMenuHandler(false);
        }
        closeAllLanguageSwitchers();

        var cycle = ["hy", "ru", "en"];
        var current = normalizeLanguageCode(getOnlineLanguage());
        var index = cycle.indexOf(current);
        var next = cycle[(index >= 0 ? index + 1 : 0) % cycle.length];
        applyOnlineLanguage(next);
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

  function setupThemeToggle() {
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;

    // Set initial icon based on current theme
    updateThemeToggleIcon();

    btn.addEventListener("click", function () {
      toggleTheme();
    });

    // Keep icon in sync if theme changes from elsewhere (rare)
    btn.setAttribute("aria-label", "Toggle day/night mode");
  }

  function ensureLicenseViewer() {
    if (licenseViewerUi) return licenseViewerUi;

    var host = document.createElement("div");
    host.className = "license-lightbox";
    host.hidden = true;
    host.innerHTML = '' +
      '<button class="license-lightbox-backdrop" type="button" aria-label="Փակել" data-license-close></button>' +
      '<section class="license-lightbox-panel" role="dialog" aria-modal="true" aria-label="Լիցենզիայի դիտում">' +
        '<header class="license-lightbox-head">' +
          '<strong class="license-lightbox-title"></strong>' +
          '<div class="license-lightbox-actions">' +
            '<button class="license-lightbox-button" type="button" aria-label="Փոքրացնել" data-license-zoom-out>-</button>' +
            '<button class="license-lightbox-button license-lightbox-scale" type="button" aria-label="Վերականգնել չափը" data-license-zoom-reset>100%</button>' +
            '<button class="license-lightbox-button" type="button" aria-label="Մեծացնել" data-license-zoom-in>+</button>' +
            '<a class="license-lightbox-button license-lightbox-open" href="javascript:void(0)" target="_blank" rel="noopener">Բացել</a>' +
            '<button class="license-lightbox-button license-lightbox-close" type="button" aria-label="Փակել" data-license-close>&times;</button>' +
          '</div>' +
        '</header>' +
        '<div class="license-lightbox-stage" data-license-stage>' +
          '<div class="license-lightbox-canvas">' +
            '<img class="license-lightbox-image" alt="" data-license-image>' +
          '</div>' +
        '</div>' +
      '</section>';
    document.body.appendChild(host);

    licenseViewerUi = {
      root: host,
      stage: host.querySelector("[data-license-stage]"),
      image: host.querySelector("[data-license-image]"),
      title: host.querySelector(".license-lightbox-title"),
      scale: host.querySelector(".license-lightbox-scale"),
      open: host.querySelector(".license-lightbox-open")
    };

    host.querySelectorAll("[data-license-close]").forEach(function (button) {
      button.addEventListener("click", closeLicenseViewer);
    });

    host.querySelector("[data-license-zoom-in]").addEventListener("click", function () {
      setLicenseViewerScale(licenseViewerScale + 0.25);
    });

    host.querySelector("[data-license-zoom-out]").addEventListener("click", function () {
      setLicenseViewerScale(licenseViewerScale - 0.25);
    });

    host.querySelector("[data-license-zoom-reset]").addEventListener("click", function () {
      setLicenseViewerScale(1);
    });

    licenseViewerUi.stage.addEventListener("wheel", function (event) {
      if (!licenseViewerUi.root.classList.contains("is-open")) return;
      if (!event.ctrlKey && licenseViewerScale <= 1) return;
      event.preventDefault();
      setLicenseViewerScale(licenseViewerScale + (event.deltaY > 0 ? -0.18 : 0.18));
    }, { passive: false });

    licenseViewerUi.stage.addEventListener("pointerdown", function (event) {
      if (licenseViewerScale <= 1) return;
      licenseViewerDrag = {
        x: event.clientX,
        y: event.clientY,
        left: licenseViewerUi.stage.scrollLeft,
        top: licenseViewerUi.stage.scrollTop
      };
      licenseViewerUi.stage.classList.add("is-dragging");
      licenseViewerUi.stage.setPointerCapture(event.pointerId);
    });

    licenseViewerUi.stage.addEventListener("pointermove", function (event) {
      if (!licenseViewerDrag) return;
      licenseViewerUi.stage.scrollLeft = licenseViewerDrag.left - (event.clientX - licenseViewerDrag.x);
      licenseViewerUi.stage.scrollTop = licenseViewerDrag.top - (event.clientY - licenseViewerDrag.y);
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(function (eventName) {
      licenseViewerUi.stage.addEventListener(eventName, function () {
        licenseViewerDrag = null;
        licenseViewerUi.stage.classList.remove("is-dragging");
      });
    });

    window.addEventListener("resize", function () {
      if (licenseViewerUi && licenseViewerUi.root.classList.contains("is-open")) {
        setLicenseViewerScale(licenseViewerScale);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (!licenseViewerUi || !licenseViewerUi.root.classList.contains("is-open")) return;
      if (event.key === "Escape" || event.key === "Esc") {
        closeLicenseViewer();
      } else if (event.key === "+" || event.key === "=") {
        setLicenseViewerScale(licenseViewerScale + 0.25);
      } else if (event.key === "-") {
        setLicenseViewerScale(licenseViewerScale - 0.25);
      } else if (event.key === "0") {
        setLicenseViewerScale(1);
      }
    });

    return licenseViewerUi;
  }

  function centerLicenseViewerImage() {
    if (!licenseViewerUi) return;
    var stage = licenseViewerUi.stage;
    stage.scrollLeft = Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2);
    stage.scrollTop = Math.max(0, (stage.scrollHeight - stage.clientHeight) / 2);
  }

  function setLicenseViewerScale(scale) {
    var ui = ensureLicenseViewer();
    var image = ui.image;
    var naturalWidth = image.naturalWidth || 1200;
    var naturalHeight = image.naturalHeight || 850;
    var stageRect = ui.stage.getBoundingClientRect();
    var maxWidth = Math.max(280, stageRect.width - 48);
    var maxHeight = Math.max(220, stageRect.height - 48);
    var ratio = naturalWidth / Math.max(1, naturalHeight);
    var fitWidth = Math.min(naturalWidth, maxWidth, maxHeight * ratio);

    licenseViewerScale = Math.max(1, Math.min(4, scale));
    image.style.width = Math.round(fitWidth * licenseViewerScale) + "px";
    image.style.height = "auto";
    ui.scale.textContent = Math.round(licenseViewerScale * 100) + "%";
    ui.stage.classList.toggle("is-zoomed", licenseViewerScale > 1.01);

    window.setTimeout(centerLicenseViewerImage, 0);
  }

  function openLicenseViewer(link) {
    var ui = ensureLicenseViewer();
    var imageUrl = link.getAttribute("href");
    var title = link.getAttribute("data-license-title") || link.textContent || "Լիցենզիա";
    if (!imageUrl) return;

    ui.title.textContent = title;
    ui.open.href = imageUrl;
    ui.image.removeAttribute("src");
    ui.image.alt = title;
    licenseViewerScale = 1;
    ui.scale.textContent = "100%";
    ui.stage.classList.remove("is-zoomed");
    ui.root.hidden = false;
    document.body.classList.add("is-license-lightbox-open");

    ui.image.onload = function () {
      setLicenseViewerScale(1);
    };
    ui.image.src = imageUrl;

    window.requestAnimationFrame(function () {
      ui.root.classList.add("is-open");
    });
  }

  function closeLicenseViewer() {
    if (!licenseViewerUi) return;
    licenseViewerUi.root.classList.remove("is-open");
    document.body.classList.remove("is-license-lightbox-open");
    window.setTimeout(function () {
      if (licenseViewerUi && !licenseViewerUi.root.classList.contains("is-open")) {
        licenseViewerUi.root.hidden = true;
      }
    }, 180);
  }

  function setupLicenseViewer() {
    if (licenseViewerReady) return;
    licenseViewerReady = true;
    document.addEventListener("click", function (event) {
      var target = event.target && event.target.closest ? event.target.closest("[data-license-viewer]") : null;
      if (!target) return;
      event.preventDefault();
      openLicenseViewer(target);
    });
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
    var requestMenus = Array.prototype.slice.call(form.querySelectorAll("[data-request-menu]"));
    var scopePanels = Array.prototype.slice.call(form.querySelectorAll("[data-request-scope-panel]"));
    var scopedBlocks = Array.prototype.slice.call(form.querySelectorAll("[data-scope-show]"));
    var visitInput = form.querySelector("[data-request-visit]");
    var quantityInputsBySystem = {};
    var optionInputsBySystem = {};
    var brandInputsBySystem = {};
    var summaryFrame = null;
    var currentRequestStep = 0;

    try {
      var briefRaw = window.sessionStorage.getItem("smarttech.chat.brief");
      if (briefRaw) {
        var briefData = JSON.parse(briefRaw);
        var notesField = form.querySelector('[name="notes"]');
        if (notesField && briefData && briefData.summary && !String(notesField.value || "").trim()) {
          notesField.value = briefData.summary;
        }
      }
    } catch (error) {
      // Ignore invalid brief payload.
    }

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

    function menuCounterCopy() {
      var dictionaries = {
        hy: { none: "Ոչինչ ընտրված չէ", selected: "ընտրված" },
        en: { none: "Nothing selected", selected: "selected" },
        ru: { none: "Ничего не выбрано", selected: "выбрано" }
      };
      return dictionaries[activeUiLanguage()] || dictionaries.en || dictionaries.hy;
    }

    function setRequestMenuOpen(menu, isOpen) {
      if (!menu) return;
      var toggle = menu.querySelector("[data-request-menu-toggle]");
      var panel = menu.querySelector("[data-request-menu-panel]");
      if (!toggle || !panel || toggle.disabled) {
        isOpen = false;
      }

      if (isOpen) {
        requestMenus.forEach(function (otherMenu) {
          if (otherMenu !== menu) {
            setRequestMenuOpen(otherMenu, false);
          }
        });
      }

      menu.classList.toggle("is-open", !!isOpen);
      if (toggle) {
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
      if (panel) {
        panel.hidden = !isOpen;
      }
    }

    function updateRequestMenus() {
      var labels = menuCounterCopy();
      requestMenus.forEach(function (menu) {
        var toggle = menu.querySelector("[data-request-menu-toggle]");
        var count = menu.querySelector("[data-request-menu-count]");
        var inputs = Array.prototype.slice.call(menu.querySelectorAll("input[type='checkbox']"));
        var selected = inputs.filter(function (input) {
          return input.checked;
        }).length;
        var isDisabled = !inputs.length || inputs.every(function (input) {
          return input.disabled;
        });

        menu.classList.toggle("has-selection", selected > 0);
        menu.classList.toggle("is-disabled", isDisabled);
        if (toggle) {
          toggle.disabled = isDisabled;
        }
        if (count) {
          count.textContent = selected > 0 ? selected + " " + labels.selected : labels.none;
        }
        if (isDisabled) {
          setRequestMenuOpen(menu, false);
        }
      });
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

      updateRequestMenus();
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
      var truncationNotes = {
        hy: "Ամբողջական հայտը պահված է ներբեռնված TXT ֆայլում։ Եթե չի ներբեռնվել, օգտվեք TXT կոճակից հայտի էջում։",
        en: "Full request is saved in the downloaded TXT file. If it did not download, use the TXT download button on the request page.",
        ru: "Полная заявка сохранена в загруженном TXT файле. Если файл не загрузился, используйте кнопку TXT на странице заявки."
      };
      var lang = activeUiLanguage();
      var note = truncationNotes[lang] || truncationNotes.en;
      return text.slice(0, 1400) + "\n\n" + note;
    }

    form.addEventListener("click", function (event) {
      var menuToggle = event.target.closest("[data-request-menu-toggle]");
      var menuConfirm = event.target.closest("[data-request-menu-confirm]");
      var go = event.target.closest("[data-request-go]");
      var next = event.target.closest("[data-request-next]");
      var prev = event.target.closest("[data-request-prev]");

      if (menuToggle) {
        event.preventDefault();
        var menu = menuToggle.closest("[data-request-menu]");
        setRequestMenuOpen(menu, !(menu && menu.classList.contains("is-open")));
        return;
      }

      if (menuConfirm) {
        event.preventDefault();
        setRequestMenuOpen(menuConfirm.closest("[data-request-menu]"), false);
        updateSummary();
        return;
      }

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

    form.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        requestMenus.forEach(function (menu) {
          setRequestMenuOpen(menu, false);
        });
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
    var statusFadeTimer = null;
    var contactUnlockTimer = null;

    function feedbackText(key, vars) {
      vars = vars || {};
      var messages = {
        hy: {
          sending: "Ուղարկվում է...",
          success: "Հարցումը հաջողությամբ ուղարկվեց։",
          cooldown: "Հաջորդ հաղորդագրությունը կարող եք ուղարկել 2 ժամ հետո։",
          blocked: "Հաջորդ հարցումը կարող եք ուղարկել {time} հետո։",
          fallback: "Չհաջողվեց ուղարկել։ Փորձեք կրկին կամ կապվեք հեռախոսով / WhatsApp / Viber։",
          error: "Չհաջողվեց ուղարկել։ Փորձեք կրկին կամ կապվեք հեռախոսով։",
          deliveryFailed: "Հարցումը գրանցվեց, բայց նամակը չհասավ։ Խնդրում ենք զանգել կամ գրել WhatsApp/Viber-ով։"
        },
        en: {
          sending: "Sending request...",
          success: "Request sent successfully.",
          cooldown: "You can send the next message in 2 hours.",
          blocked: "You can send the next request in {time}.",
          fallback: "Could not send the request. Please try again or contact us by phone / WhatsApp / Viber.",
          error: "Could not send the request. Please try again or call us.",
          deliveryFailed: "We received your request, but the email did not go through. Please call or message us on WhatsApp/Viber."
        },
        ru: {
          sending: "Отправляем заявку...",
          success: "Заявка успешно отправлена.",
          cooldown: "Следующее сообщение можно отправить через 2 часа.",
          blocked: "Следующую заявку можно отправить через {time}.",
          fallback: "Не удалось отправить заявку. Попробуйте еще раз или свяжитесь по телефону / WhatsApp / Viber.",
          error: "Не удалось отправить заявку. Попробуйте еще раз или позвоните нам.",
          deliveryFailed: "Заявка принята, но письмо не отправилось. Пожалуйста, позвоните или напишите в WhatsApp/Viber."
        }
      };
      var lang = activeUiLanguage();
      var text = (messages[lang] && messages[lang][key]) || messages.en[key] || messages.hy[key] || "";
      return text.replace("{time}", vars.time || "");
    }

    function clearContactStatus() {
      if (statusFadeTimer) {
        window.clearTimeout(statusFadeTimer);
        statusFadeTimer = null;
      }
      status.textContent = "";
      status.classList.remove("is-success", "is-fading-out", "has-multiline");
    }

    function showContactStatus(lines, isSuccess, autoHide) {
      if (statusFadeTimer) {
        window.clearTimeout(statusFadeTimer);
        statusFadeTimer = null;
      }
      status.classList.remove("is-fading-out");
      status.classList.toggle("has-multiline", Array.isArray(lines) && lines.length > 1);
      status.textContent = Array.isArray(lines) ? lines.join("\n") : String(lines || "");
      status.classList.toggle("is-success", !!isSuccess);
      if (!autoHide || !status.textContent) return;
      statusFadeTimer = window.setTimeout(function () {
        status.classList.add("is-fading-out");
        window.setTimeout(function () {
          clearContactStatus();
        }, 520);
      }, 8000);
    }

    function lockContactForm() {
      form.classList.add("is-submitted-success");
      if (submitButton) submitButton.disabled = true;
    }

    function unlockContactForm() {
      form.classList.remove("is-submitted-success");
      if (submitButton) submitButton.disabled = false;
      clearContactStatus();
    }

    function scheduleContactUnlock() {
      if (contactUnlockTimer) {
        window.clearTimeout(contactUnlockTimer);
        contactUnlockTimer = null;
      }
      var lockState = site.utils.getContactSubmitLockState();
      if (!lockState.locked) {
        unlockContactForm();
        return;
      }
      lockContactForm();
      contactUnlockTimer = window.setTimeout(function () {
        unlockContactForm();
      }, lockState.remainingMs + 60);
    }

    function setBusy(isBusy) {
      if (submitButton && !form.classList.contains("is-submitted-success")) {
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
        message: String(data.get("message") || "").trim(),
        website: String(data.get("website") || "").trim()
      };
    }

    scheduleContactUnlock();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (form.classList.contains("is-submitting")) return;
      var payload = payloadFromForm();
      if (!payload.name || payload.name.length < 2 || !payload.phone || !payload.message || payload.website) {
        showContactStatus(feedbackText("error"), false, true);
        return;
      }
      if (String(payload.phone).replace(/\D/g, "").length < 8) {
        showContactStatus(feedbackText("error"), false, true);
        return;
      }
      if (payload.message.length < 10) {
        showContactStatus(feedbackText("error"), false, true);
        return;
      }

      var lockState = site.utils.getContactSubmitLockState();
      if (lockState.locked) {
        var remaining = site.utils.formatContactCooldown(lockState.remainingMs, activeUiLanguage());
        showContactStatus(feedbackText("blocked", { time: remaining }), true, true);
        lockContactForm();
        scheduleContactUnlock();
        return;
      }

      if (!form.reportValidity()) return;
      var requestPayload = payload;

      setBusy(true);
      showContactStatus(feedbackText("sending"), false, false);

      window.fetch("/api/contact", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload)
      })
        .then(function (response) {
          return response.json().catch(function () {
            return {};
          }).then(function (data) {
            if (!response.ok) {
              throw new Error((data && data.error) || "Submit failed");
            }
            if (!data || data.saved !== true) {
              throw new Error("Message was not saved");
            }
            return data;
          });
        })
        .then(function (data) {
          site.utils.setContactSubmitLock();
          showContactStatus([
            feedbackText("success"),
            feedbackText("cooldown")
          ], true, true);
          lockContactForm();
          scheduleContactUnlock();
          site.utils.showSubmitSuccessCelebration(submitButton || status);
          form.reset();
        })
        .catch(function (error) {
          showContactStatus(feedbackText("error"), false, false);
        })
        .then(function () {
          setBusy(false);
        });
    });
  }

  function setupHomeServiceStream() {
    var timeline = document.querySelector(".home-service-timeline--desktop");
    var items = document.querySelectorAll(".home-service-stream .home-service-reveal");
    if (!items.length) return;

    function revealItem(item) {
      var delay = Number(item.getAttribute("data-reveal-delay") || 0);
      window.setTimeout(function () {
        item.classList.add("is-visible");
        if (!timeline) return;
        var posts = timeline.querySelectorAll(".home-service-post");
        if (!posts.length) return;
        var index = Number(item.getAttribute("data-spine-index"));
        if (!Number.isFinite(index)) {
          index = Array.prototype.indexOf.call(posts, item);
        }
        var progress = Math.min(100, ((index + 1) / posts.length) * 100);
        var current = Number.parseFloat(timeline.style.getPropertyValue("--spine-progress")) || 0;
        if (progress > current) {
          timeline.style.setProperty("--spine-progress", progress + "%");
        }
      }, delay);
    }

    function activateSpine() {
      if (!timeline || timeline.classList.contains("is-spine-live")) return;
      timeline.classList.add("is-spine-live");
    }

    if (timeline) {
      if (!uiSettings.motion || !("IntersectionObserver" in window)) {
        activateSpine();
      } else {
        var timelineObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            activateSpine();
            timelineObserver.unobserve(entry.target);
          });
        }, { threshold: 0.02, rootMargin: "0px 0px 12% 0px" });
        timelineObserver.observe(timeline);
        window.requestAnimationFrame(function () {
          var rect = timeline.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) activateSpine();
        });
      }
    }

    if (!uiSettings.motion || !("IntersectionObserver" in window)) {
      items.forEach(revealItem);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealItem(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setupRevealSlides() {
    var items = Array.prototype.filter.call(document.querySelectorAll(".reveal-slide"), function (item) {
      return !item.closest(".home-service-stream");
    });
    if (!items.length) return;

    function revealItem(item) {
      var delay = Number(item.getAttribute("data-reveal-delay") || 0);
      window.setTimeout(function () {
        item.classList.add("is-visible");
      }, delay);
    }

    if (!uiSettings.motion || !("IntersectionObserver" in window)) {
      items.forEach(revealItem);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealItem(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!uiSettings.motion || !("IntersectionObserver" in window)) {
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
    }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });

    items.forEach(function (item) {
      if (item.closest(".home-service-stream")) return;
      var scopedParent = item.closest(".home-overview, .section-head, .home-contact-cta, .hero-grid");
      var scopedItems = scopedParent
        ? scopedParent.querySelectorAll(".reveal")
        : [item];
      var scopedIndex = Array.prototype.indexOf.call(scopedItems, item);
      var delay = Number(item.getAttribute("data-reveal-delay"));
      if (!Number.isFinite(delay)) {
        delay = Math.min(Math.max(scopedIndex, 0) * 70, 280);
      }
      item.style.transitionDelay = delay + "ms";
      observer.observe(item);
    });
  }

  function setupFooterYear() {
    var year = document.getElementById("footer-year");
    if (year) {
      year.textContent = "\u00a9 " + new Date().getFullYear() + " Smart Tech LLC";
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

  function firebaseMetricsUrl(authTokenOverride) {
    var config = window.SmartTechRuntimeConfig || {};
    var databaseUrl = String(config.firebaseDatabaseUrl || "").trim().replace(/\/+$/g, "");
    var statsPath = String(config.firebaseStatsPath || "").trim().replace(/^\/+|\/+$/g, "");
    var authToken = String(authTokenOverride || config.firebaseAuthToken || "").trim();
    if (!databaseUrl || !statsPath) return "";

    var encodedPath = statsPath.split("/").filter(Boolean).map(function (part) {
      return encodeURIComponent(part);
    }).join("/");

    return databaseUrl + "/" + encodedPath + ".json" + (authToken ? "?auth=" + encodeURIComponent(authToken) : "");
  }

  function firebaseApiKey() {
    var config = window.SmartTechRuntimeConfig || {};
    return String(config.firebaseApiKey || "").trim();
  }

  function readCachedFirebaseAuthToken() {
    try {
      var cached = JSON.parse(window.sessionStorage.getItem(firebaseAuthSessionKey) || "null");
      if (cached && cached.idToken && Number(cached.expiresAt) > Date.now() + 60000) {
        return cached.idToken;
      }
    } catch (error) {
      return "";
    }
    return "";
  }

  function cacheFirebaseAuthToken(idToken, expiresIn) {
    if (!idToken) return;
    try {
      var seconds = Math.max(60, Number(expiresIn || 3600));
      window.sessionStorage.setItem(firebaseAuthSessionKey, JSON.stringify({
        idToken: idToken,
        expiresAt: Date.now() + seconds * 1000
      }));
    } catch (error) {
      // Auth caching is optional.
    }
  }

  function firebaseAnonymousAuthToken() {
    if (!window.fetch) return Promise.resolve("");

    var cached = readCachedFirebaseAuthToken();
    if (cached) return Promise.resolve(cached);

    if (firebaseAuthTokenPromise) return firebaseAuthTokenPromise;

    var apiKey = firebaseApiKey();
    if (!apiKey) return Promise.resolve("");

    firebaseAuthTokenPromise = fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + encodeURIComponent(apiKey), {
      method: "POST",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: "{\"returnSecureToken\":true}"
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Could not create anonymous Firebase session");
      }
      return response.json();
    }).then(function (data) {
      var idToken = String(data && data.idToken || "").trim();
      if (!idToken) return "";
      cacheFirebaseAuthToken(idToken, data.expiresIn);
      return idToken;
    }).catch(function () {
      return "";
    });

    return firebaseAuthTokenPromise;
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
          return firebaseAnonymousAuthToken().then(function (authToken) {
            var authedUrl = authToken ? firebaseMetricsUrl(authToken) : "";
            if (!authedUrl) return visits;
            return writeFirebaseVisits(authedUrl, visits + 1).catch(function () {
              return visits;
            });
          });
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

  function getManualTheme() {
    try {
      return window.localStorage.getItem(manualThemeStorageKey);
    } catch (error) {
      return null;
    }
  }

  function setManualTheme(theme) {
    try {
      if (theme === "light" || theme === "dark") {
        window.localStorage.setItem(manualThemeStorageKey, theme);
      }
    } catch (error) {}
  }

  function clearManualTheme() {
    try {
      window.localStorage.removeItem(manualThemeStorageKey);
    } catch (error) {}
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
      applyCurrentTheme();
    }, wait);
  }

  function applyTheme(theme, fromAuto) {
    if (theme !== "dark" && theme !== "light") {
      theme = "light";
    }

    document.body.classList.toggle("ui-theme-dark", theme === "dark");
    document.body.classList.toggle("ui-theme-light", theme !== "dark");
    document.documentElement.setAttribute("data-theme", theme);

    var themeColor = theme === "dark" ? "#101417" : "#f6f8f7";
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.setAttribute("content", themeColor);
    });

    var statusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (statusBar) {
      statusBar.setAttribute("content", theme === "dark" ? "black-translucent" : "default");
    }

    updateThemeToggleIcon();

    try {
      var zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (zone) {
        document.documentElement.setAttribute("data-timezone", zone);
      }
    } catch (error) {
      // Theme still works even without timezone metadata.
    }

    // Only schedule auto updates when we are in pure auto mode
    if (fromAuto) {
      scheduleAutoThemeUpdate(new Date());
    } else {
      // User has manual preference — stop any scheduled auto switch
      if (autoThemeTimer) {
        window.clearTimeout(autoThemeTimer);
        autoThemeTimer = null;
      }
    }
  }

  function applyCurrentTheme() {
    var manual = getManualTheme();
    if (manual === "light" || manual === "dark") {
      applyTheme(manual, false);
      return;
    }
    // No manual preference → use auto (time based)
    var now = new Date();
    var theme = detectAutoTheme(now);
    applyTheme(theme, true);
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    var next = current === "dark" ? "light" : "dark";

    setManualTheme(next);
    applyTheme(next, false);

    // Update button icon immediately if present
    updateThemeToggleIcon();
  }

  function updateThemeToggleIcon() {
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;

    var isDark = document.documentElement.getAttribute("data-theme") === "dark";

    btn.innerHTML = isDark
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  }

  function applyUiSettings() {
    uiSettings.compact = false;
    uiSettings.motion = true;
    document.body.classList.remove("ui-compact", "ui-reduced-motion");
    persistUiSettings();
    applyCurrentTheme();
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
    try {
      var queryLanguage = new URLSearchParams(window.location.search).get("lang");
      if (queryLanguage) {
        return normalizeLanguageCode(queryLanguage);
      }
      if (site.i18n && site.i18n.language) {
        return normalizeLanguageCode(site.i18n.language);
      }
      return normalizeLanguageCode(window.localStorage.getItem(onlineLangStorageKey) || "hy");
    } catch (error) {
      return normalizeLanguageCode(site.i18n && site.i18n.language ? site.i18n.language : "hy");
    }
  }

  function applyOnlineLanguage(lang) {
    var nextLang = normalizeLanguageCode(lang || "hy");
    writeTranslateCookie(nextLang);
    try {
      window.localStorage.setItem(onlineLangStorageKey, nextLang);
    } catch (error) {
      // Page still updates with cookie.
    }
    if (site.i18n && typeof site.i18n.setLanguage === "function") {
      site.i18n.setLanguage(nextLang);
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
      includedLanguages: "hy,ru,en",
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
    if (lang.indexOf("ru") === 0) return "ru";
    if (lang.indexOf("en") === 0) return "en";
    return "hy";
  }

  function activeUiLanguage() {
    return normalizeLanguageCode(getOnlineLanguage());
  }

  function normalizeChatLanguageCode(language) {
    var lang = normalizeLanguageCode(language);
    return lang === "en" || lang === "ru" ? lang : "hy";
  }

  function activeChatLanguage() {
    return normalizeChatLanguageCode(getOnlineLanguage());
  }

  function isQuickChatQuotaError(error) {
    if (!error) return false;
    if (error.status === 429) return true;
    var reply = String(error.reply || error.message || "");
    return /10 հարց|10 question|10 вопрос|ծանրաբեռնված|rate limit|too many requests/i.test(reply);
  }

  function readQuickChatQuestionCount() {
    try {
      var stored = Number(window.sessionStorage.getItem(chatQuestionSessionKey));
      return Number.isFinite(stored) && stored > 0 ? stored : 0;
    } catch (error) {
      return 0;
    }
  }

  function writeQuickChatQuestionCount() {
    try {
      window.sessionStorage.setItem(chatQuestionSessionKey, String(chatUserQuestionCount));
    } catch (error) {
      /* ignore */
    }
  }

  function redirectToFullChatPage() {
    if (currentRoute().page === "chat") return;
    setChatOpen(false);
    try {
      window.sessionStorage.setItem("smarttech.chat.redirectFromQuick", "1");
    } catch (error) {
      /* ignore */
    }
    if (window.location.protocol === "file:") {
      window.location.hash = "chat";
      return;
    }
    var chatUrl = site.utils.pageUrl("chat");
    if (window.location.pathname.replace(/\/+$/g, "") !== chatUrl.replace(/\/+$/g, "")) {
      window.location.href = chatUrl;
    }
  }

  function chatDictionary(language) {
    var contacts = site.content.contacts || {};
    var emailText = contacts.email || "info@smarttechllc.am";
    var contactPage = site.utils.pageUrl("contact");
    var dictionaries = {
      hy: {
        title: "Արագ չատ",
        subtitle: "SmartTech-ի օգնականը ձեզ հետ է",
        quickLabel: "Արագ հարցեր",
        statusLabel: "Ակտիվ · մինչև 10 հարց",
        openLabel: "Բացել չատը",
        closeLabel: "Փակել չատը",
        hideLabel: "Թաքցնել չատը",
        inputPlaceholder: "Գրեք ձեր հարցը...",
        sendLabel: "Ուղարկել",
        busyLabel: "Սպասեք",
        networkError: "Չհաջողվեց կապվել AI օգնականի հետ։ Փորձեք մի փոքր ուշ։",
        limitReached: "Արագ չատի սահմանաչափը լրացել է։ Շարունակում ենք ամբողջական չատ էջում…",
        limitButton: "Չատ էջ",
        fullChatLabel: "Բացել չատ էջը",
        typing: "գրում է...",
        pageIntro: "Բարև{greetingName}, ես Smart Tech-ի AI օգնականն եմ։\nԿարող եմ օգնել տեսահսկման, ցանցի, հրդեհային, մուտքի վերահսկման, էլեկտրամոնտաժի և ավտոմատացման հարցերում։ Գրեք ինչ է պետք, կամ սեղմեք +՝ նախագծի բրիֆի համար։",
        profilePanelEyebrow: "Smart Tech AI",
        profilePanelTitle: "Նախքան շարունակելը",
        profilePanelLead: "Լրացրեք տվյալները մեկ անգամ՝ և անմիջապես կարող եք հարցնել։",
        profilePanelSubmit: "Շարունակել չատը",
        profilePurposeLabel: "Ինչու եք գրում",
        profilePurposeCustom: "Իմ տարբերակը",
        profileComplete: "Շնորհակալություն, {name}։ Նկարագրեք ձեր խնդիրը կամ հարցրեք մեր ծառայությունների մասին։",
        profileInvalidName: "Խնդրում ենք գրել առնվազն 2 նիշ։",
        profileInvalidEmail: "Խնդրում ենք գրել վավեր էլ. հասցե, օրինակ՝ name@example.com",
        profileInvalidPhone: "Խնդրում ենք գրել վավեր հեռախոսահամար (առնվազն 6 թվանշան)։",
        profileQuestions: [
          { id: "firstName", label: "Անուն", question: "Ինչպե՞ս դիմենք ձեզ։ Գրեք ձեր անունը։" },
          { id: "lastName", label: "Ազգանուն", question: "Գրեք ազգանունը։" },
          { id: "email", label: "Էլ. փոստ", question: "Ինչ էլ. հասցեով կապվենք ձեզ հետ։" },
          { id: "phone", label: "Հեռախոս", question: "Գրեք հեռախոսահամարը։" },
          {
            id: "purpose",
            label: "Նպատակ",
            question: "Ինչո՞վ կարող ենք օգնել։ Ընտրեք կամ գրեք ձեր տարբերակը։",
            options: ["Տեսահսկում", "Գին և հաշվարկ", "Ժամկետներ", "Ծառայություններ", "Նախագծի բրիֆ", "Կապ մասնագետի հետ", "Այլ"]
          }
        ],
        greeting: "Բարև։ Ես SmartTech-ի արագ օգնականն եմ։ Գրեք ինչ է պետք, կամ սեղմեք «Նախագծի բրիֆ»՝ արագ հարցերով հայտ հավաքելու համար։",
        quickIntents: [
          { id: "survey", label: "Նախագծի բրիֆ" },
          { id: "services", label: "Ծառայություններ" },
          { id: "price", label: "Գների հարց" },
          { id: "timeline", label: "Ժամկետներ" },
          { id: "contact", label: "Կապ մեզ հետ" }
        ],
        surveyIntro: "Հավաքենք նախագծի տվյալները՝ ծառայությունը, օբյեկտը, հասցեն, աշխատանքի ծավալը և ցանկալի ժամկետը։ Վերջում կտեսնեք ամփոփումը և ինքներդ կուղարկեք այն։",
        surveyChoiceHint: "Ընտրեք պատասխանը",
        surveyQuestions: [
          {
            id: "service",
            label: "Ծառայություն",
            question: "Ի՞նչ լուծում է պետք։",
            options: ["Տեսահսկում", "Ցանց / Wi-Fi", "Հրդեհային", "Մուտքի վերահսկում", "Էլեկտրամոնտաժ", "Ավտոմատացում"]
          },
          {
            id: "facility",
            label: "Օբյեկտ",
            question: "Ի՞նչ օբյեկտ է։",
            options: ["Բնակարան", "Գրասենյակ", "Խանութ", "Հյուրանոց", "Պահեստ", "Արտադրամաս"]
          },
          {
            id: "location",
            label: "Վայր",
            question: "Ո՞ր քաղաքում կամ բնակավայրում է օբյեկտը։ Կարող եք նշել նաև թաղամասը կամ հասցեն։"
          },
          {
            id: "size",
            label: "Ծավալ",
            question: "Ի՞նչ ծավալի աշխատանք է պետք՝ մոտավոր մակերեսը, հարկերի կամ սարքերի քանակը։ Օրինակ՝ 200 մ² գրասենյակ, 8 տեսախցիկ։ Եթե դեռ չգիտեք, գրեք «Պետք է չափագրում»։"
          },
          {
            id: "timeline",
            label: "Ժամկետ",
            question: "Ե՞րբ եք ուզում սկսել։",
            options: ["Հնարավորինս շուտ", "1 շաբաթից", "2–4 շաբաթից", "Մեկ ամսից կամ ավելի ուշ", "Դեռ որոշված չէ"]
          },
          {
            id: "contact",
            label: "Կապ",
            question: "Ո՞ւմ հետ կապվենք։ Գրեք անուն և հեռախոս կամ էլ. հասցե։"
          }
        ],
        surveySummary: "Ստուգեք նախագծի ամփոփումը՝ նախքան ուղարկելը։",
        surveyReminder: "Շնորհակալություն։ Սեղմեք «Ուղարկել Smart Tech-ին»՝ բրիֆը ուղարկելու համար։",
        submitRequestLabel: "Ուղարկել Smart Tech-ին",
        openRequestLabel: "Լրացնել հայտի էջում",
        surveyMailLabel: "Բացել email հավելվածը",
        surveySubmittedLabel: "Հայտն ուղարկվել է Smart Tech-ի թիմին։ Պատասխանի համար կօգտագործվեն ձեր նշած կոնտակտները։",
        surveySubmitBlockedLabel: "Դուք արդեն ուղարկել եք հայտ։ Խնդրում ենք սպասել մի փոքր և կրկին փորձել։",
        surveySubmitError: "Ուղարկումը չի հաստատվել։ Տվյալները մնացել են ամփոփման մեջ․ փորձեք կրկին կամ բացեք էլ․ փոստի հավելվածը։",
        reminderStatus: "Բրիֆը պահպանված է",
        replies: {
          services: "Մենք առաջարկում ենք տեսահսկման, հրդեհային ու ազդանշանային համակարգեր, ցանցային լուծումներ, էլեկտրական և ավտոմատացման աշխատանքներ.",
          price: "Ճշգրիտ գինը կախված է օբյեկտից և աշխատանքի ծավալից. կիսվեք համառոտ բրիֆով, և թիմը կպատրաստի հաշվարկը.",
          timeline: "Ժամկետը կախված է աշխատանքի ծավալից, սարքավորումների առկայությունից և օբյեկտի պատրաստ լինելուց։ Ի՞նչ աշխատանք եք նախատեսում և ե՞րբ եք ցանկանում սկսել։",
          contact: "Կարող եք գրել {email}-ին կամ բացել մեր կապի էջը՝ {contactPage}:",
          fallback: "Շնորհակալություն. գրեք խնդիրը 1-2 նախադասությամբ, և մեր թիմը շուտով կկապվի ձեզ հետ."
        }
      },
      en: {
        title: "Quick Chat",
        subtitle: "SmartTech assistant is here",
        quickLabel: "Quick questions",
        statusLabel: "Online · up to 10 questions",
        openLabel: "Open chat",
        closeLabel: "Close chat",
        hideLabel: "Hide chat",
        inputPlaceholder: "Type your question...",
        sendLabel: "Send",
        busyLabel: "Wait",
        networkError: "Could not reach the AI assistant. Please try again shortly.",
        limitReached: "Quick chat limit reached. Opening the full chat page…",
        limitButton: "Chat page",
        fullChatLabel: "Open chat page",
        typing: "typing...",
        pageIntro: "Hi{greetingName}, I'm Smart Tech's AI assistant.\nI can help with CCTV, networks, fire alarm, access control, electrical works and automation. Tell me what you need, or tap + for a project brief.",
        profilePanelEyebrow: "Smart Tech AI",
        profilePanelTitle: "Before we start",
        profilePanelLead: "Fill in your details once, then ask your question right away.",
        profilePanelSubmit: "Continue to chat",
        profilePurposeLabel: "Why are you here",
        profilePurposeCustom: "My own reason",
        profileComplete: "Thank you, {name}. You can ask your question now.",
        profileInvalidName: "Please enter at least 2 characters.",
        profileInvalidEmail: "Please enter a valid email, e.g. name@example.com",
        profileInvalidPhone: "Please enter a valid phone number (at least 6 digits).",
        profileQuestions: [
          { id: "firstName", label: "First name", question: "What is your first name?" },
          { id: "lastName", label: "Last name", question: "What is your last name?" },
          { id: "email", label: "Email", question: "What email should we use to contact you?" },
          { id: "phone", label: "Phone", question: "What is your phone number?" },
          {
            id: "purpose",
            label: "Purpose",
            question: "What do you need help with? Pick an option or type your own.",
            options: ["CCTV", "Pricing / estimate", "Timeline", "Services", "Project brief", "Contact specialist", "Other"]
          }
        ],
        greeting: "Hi. I am SmartTech's quick assistant. Tell me what you need, or tap Project brief to assemble a request with quick questions.",
        quickIntents: [
          { id: "survey", label: "Project brief" },
          { id: "services", label: "Services" },
          { id: "price", label: "Pricing" },
          { id: "timeline", label: "Timeline" },
          { id: "contact", label: "Contact" }
        ],
        surveyIntro: "Great. Let's assemble your project brief in 6 quick steps. Pick an answer or type your own.",
        surveyChoiceHint: "Pick an answer",
        surveyQuestions: [
          {
            id: "service",
            label: "Service",
            question: "What solution do you need?",
            options: ["CCTV", "Network / Wi-Fi", "Fire alarm", "Access control", "Electrical works", "Automation"]
          },
          {
            id: "facility",
            label: "Object",
            question: "What type of place is it?",
            options: ["Apartment", "Office", "Shop", "Hotel", "Warehouse", "Production site"]
          },
          {
            id: "location",
            label: "Location",
            question: "Which city or town is the site in? Include the district or address if known."
          },
          {
            id: "size",
            label: "Scope",
            question: "What is the approximate floor area, number of floors or devices? For example, a 200 m² office or 8 cameras. If unsure, write 'Site survey needed'."
          },
          {
            id: "timeline",
            label: "Timing",
            question: "When should work start?",
            options: ["Urgent", "1 week", "2-4 weeks", "1+ month", "Not sure yet"]
          },
          {
            id: "contact",
            label: "Contact",
            question: "Who should we contact? Share name and phone or email."
          }
        ],
        surveySummary: "Here is your assembled project brief:",
        surveyReminder: "Thank you. Tap Send to Smart Tech to submit your brief.",
        submitRequestLabel: "Send to Smart Tech",
        openRequestLabel: "Open request page",
        surveyMailLabel: "Open email app",
        surveySubmittedLabel: "Request sent successfully. Our team will follow up soon.",
        surveySubmitBlockedLabel: "You already sent a request. Please wait a moment before trying again.",
        surveySubmitError: "Could not submit. Try email or the request page.",
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
        title: "Быстрый чат",
        subtitle: "Ассистент SmartTech на связи",
        quickLabel: "Быстрые вопросы",
        statusLabel: "Онлайн · до 10 вопросов",
        openLabel: "Открыть чат",
        closeLabel: "Закрыть чат",
        hideLabel: "Скрыть чат",
        inputPlaceholder: "Напишите вопрос...",
        sendLabel: "Отправить",
        busyLabel: "Ждите",
        networkError: "Не удалось связаться с AI-ассистентом. Попробуйте немного позже.",
        limitReached: "Лимит быстрого чата исчерпан. Открываем полную страницу чата…",
        limitButton: "Страница чата",
        fullChatLabel: "Открыть страницу чата",
        typing: "печатает...",
        pageIntro: "Здравствуйте{greetingName}, я AI-ассистент Smart Tech.\nМогу помочь с видеонаблюдением, сетями, пожарной сигнализацией, контролем доступа, электромонтажом и автоматизацией. Напишите, что нужно, или нажмите + для брифа проекта.",
        profilePanelEyebrow: "Smart Tech AI",
        profilePanelTitle: "Перед началом",
        profilePanelLead: "Заполните данные один раз — и сразу можно задавать вопрос.",
        profilePanelSubmit: "Перейти в чат",
        profilePurposeLabel: "Зачем вы здесь",
        profilePurposeCustom: "Свой вариант",
        profileComplete: "Спасибо, {name}. Теперь можете задать вопрос.",
        profileInvalidName: "Введите минимум 2 символа.",
        profileInvalidEmail: "Введите корректный email, например name@example.com",
        profileInvalidPhone: "Введите корректный номер телефона (минимум 6 цифр).",
        profileQuestions: [
          { id: "firstName", label: "Имя", question: "Как вас зовут? Напишите имя." },
          { id: "lastName", label: "Фамилия", question: "Напишите фамилию." },
          { id: "email", label: "Email", question: "На какой email связаться с вами?" },
          { id: "phone", label: "Телефон", question: "Напишите номер телефона." },
          {
            id: "purpose",
            label: "Цель",
            question: "С чем можем помочь? Выберите вариант или напишите свой.",
            options: ["Видеонаблюдение", "Стоимость / расчет", "Сроки", "Услуги", "Бриф проекта", "Связь со специалистом", "Другое"]
          }
        ],
        greeting: "Здравствуйте. Я быстрый ассистент SmartTech. Напишите, что нужно, или нажмите «Бриф проекта», чтобы быстро собрать заявку.",
        quickIntents: [
          { id: "survey", label: "Бриф проекта" },
          { id: "services", label: "Услуги" },
          { id: "price", label: "Стоимость" },
          { id: "timeline", label: "Сроки" },
          { id: "contact", label: "Контакты" }
        ],
        surveyIntro: "Хорошо. Соберем бриф проекта в 6 быстрых шагов. Выберите ответ или напишите свой вариант.",
        surveyChoiceHint: "Выберите ответ",
        surveyQuestions: [
          {
            id: "service",
            label: "Услуга",
            question: "Какое решение нужно?",
            options: ["Видеонаблюдение", "Сеть / Wi-Fi", "Пожарная сигнализация", "Контроль доступа", "Электромонтаж", "Автоматизация"]
          },
          {
            id: "facility",
            label: "Объект",
            question: "Какой это объект?",
            options: ["Квартира", "Офис", "Магазин", "Гостиница", "Склад", "Производство"]
          },
          {
            id: "location",
            label: "Локация",
            question: "В каком городе или населенном пункте находится объект? Укажите район или адрес, если известен."
          },
          {
            id: "size",
            label: "Объем",
            question: "Какова примерная площадь, количество этажей или устройств? Например, офис 200 м² или 8 камер. Если не знаете, напишите «Нужен осмотр»."
          },
          {
            id: "timeline",
            label: "Срок",
            question: "Когда начать работу?",
            options: ["Срочно", "1 неделя", "2-4 недели", "1+ месяц", "Пока не знаю"]
          },
          {
            id: "contact",
            label: "Контакт",
            question: "С кем связаться? Напишите имя и телефон или email."
          }
        ],
        surveySummary: "Вот собранный бриф проекта:",
        surveyReminder: "Спасибо. Нажмите «Отправить Smart Tech», чтобы отправить бриф.",
        submitRequestLabel: "Отправить Smart Tech",
        openRequestLabel: "Открыть страницу заявки",
        surveyMailLabel: "Открыть почтовое приложение",
        surveySubmittedLabel: "Заявка успешно отправлена. Команда скоро свяжется с вами.",
        surveySubmitBlockedLabel: "Вы уже отправили заявку. Подождите немного и попробуйте снова.",
        surveySubmitError: "Не удалось отправить. Попробуйте email или страницу заявки.",
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

    var activeLanguage = normalizeChatLanguageCode(language);
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
      hideLabel: base.hideLabel,
      inputPlaceholder: base.inputPlaceholder,
      sendLabel: base.sendLabel,
      busyLabel: base.busyLabel || "Սպասեք",
      networkError: base.networkError || "Չհաջողվեց կապվել AI օգնականի հետ։ Խնդրում ենք փորձել քիչ անց։",
      typing: base.typing,
      pageIntro: base.pageIntro || base.greeting,
      profilePanelEyebrow: base.profilePanelEyebrow,
      profilePanelTitle: base.profilePanelTitle,
      profilePanelLead: base.profilePanelLead,
      profilePanelSubmit: base.profilePanelSubmit,
      profilePurposeLabel: base.profilePurposeLabel,
      profilePurposeCustom: base.profilePurposeCustom,
      profileComplete: base.profileComplete,
      profileInvalidName: base.profileInvalidName,
      profileInvalidEmail: base.profileInvalidEmail,
      profileInvalidPhone: base.profileInvalidPhone,
      profileQuestions: base.profileQuestions,
      greeting: translateTemplate(base.greeting, vars),
      quickIntents: simpleQuickIntents(activeLanguage),
      surveyIntro: base.surveyIntro,
      surveyChoiceHint: base.surveyChoiceHint,
      surveyQuestions: base.surveyQuestions,
      surveySummary: base.surveySummary,
      surveyReminder: base.surveyReminder,
      submitRequestLabel: base.submitRequestLabel,
      openRequestLabel: base.openRequestLabel,
      surveyMailLabel: base.surveyMailLabel,
      surveySubmittedLabel: base.surveySubmittedLabel,
      surveySubmitBlockedLabel: base.surveySubmitBlockedLabel,
      surveySubmitError: base.surveySubmitError,
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

    var lang = normalizeChatLanguageCode(language);
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

  function chatTopicHint(text) {
    var normalized = String(text || "").toLowerCase();
    if (/cctv|camera|cameras|nvr|dvr|տեսահսկ|տեսախց|видеонаб|камер/.test(normalized)) {
      return "cctv";
    }
    return "";
  }

  function simpleQuickIntents(language) {
    var lang = normalizeChatLanguageCode(language);
    var questions = {
      hy: [
        { id: "survey", label: "Նախագծի բրիֆ" },
        { id: "services", label: "Ի՞նչ ծառայություններ ունեք" },
        { id: "cctv", label: "Տեսահսկում եմ ուզում" },
        { id: "price", label: "Ինչպե՞ս ստանալ գին" },
        { id: "timeline", label: "Որքա՞ն է տևում" },
        { id: "contact", label: "Կապ մասնագետի հետ" }
      ],
      en: [
        { id: "survey", label: "Project brief" },
        { id: "services", label: "What services do you offer?" },
        { id: "cctv", label: "I need CCTV" },
        { id: "price", label: "How to get a price?" },
        { id: "timeline", label: "How long does it take?" },
        { id: "contact", label: "Contact a specialist" }
      ],
      ru: [
        { id: "survey", label: "Бриф проекта" },
        { id: "services", label: "Какие услуги есть?" },
        { id: "cctv", label: "Нужно видеонаблюдение" },
        { id: "price", label: "Как получить цену?" },
        { id: "timeline", label: "Сколько длится монтаж?" },
        { id: "contact", label: "Связаться со специалистом" }
      ]
    };
    return questions[lang] || questions.hy;
  }

  function isLocalChatIntent(intent) {
    return ["services", "cctv", "price", "timeline", "contact"].indexOf(intent) >= 0;
  }

  function cctvQuickReply(language) {
    var replies = {
      hy: "Տեսահսկման համար նախ պետք է պարզել՝ քանի գոտի եք ուզում վերահսկել, ներսում/դրսում է տեղադրումը, քանի օր արխիվ է պետք և արդյոք հեռախոսով դիտում եք ուզում։ Եթե գրեք օբյեկտի տեսակը ու մոտավոր տեսախցիկների քանակը, կօգնեմ կազմել ճիշտ բրիֆ։",
      en: "For CCTV we first need the zones, indoor/outdoor points, archive duration and whether mobile remote viewing is needed. Share the object type and approximate camera count, and I will help prepare the right brief.",
      ru: "Для видеонаблюдения сначала нужны зоны, точки внутри/снаружи, срок архива и нужен ли просмотр с телефона. Напишите тип объекта и примерное количество камер, и я помогу собрать правильный бриф."
    };
    return replies[normalizeChatLanguageCode(language)] || replies.hy;
  }

  function chatReplyForIntent(intent, copy, language) {
    if (copy && copy.replies && copy.replies[intent]) return copy.replies[intent];
    if (intent === "cctv") return cctvQuickReply(language);
    return (copy && copy.replies && copy.replies.fallback) || "";
  }

  function getActiveSurveyQuestion(copy, state) {
    if (!state || !copy || !copy.surveyQuestions) return null;
    return copy.surveyQuestions[state.step] || null;
  }

  function buildChatSurveySummary(copy, answers) {
    var lines = [copy.surveySummary];
    copy.surveyQuestions.forEach(function (question) {
      lines.push("• " + question.label + ": " + (answers[question.id] || "—"));
    });
    lines.push(copy.surveyReminder);
    return lines.join("\n");
  }

  function buildChatSurveyPayload(copy, answers, source) {
    return {
      source: source || "chat",
      language: activeChatLanguage(),
      page: window.location.pathname + window.location.search,
      contact: answers.contact || "",
      answers: answers,
      summary: buildChatSurveySummary(copy, answers)
    };
  }

  function storeChatSurveyBrief(payload) {
    try {
      window.sessionStorage.setItem("smarttech.chat.brief", JSON.stringify(payload));
    } catch (error) {
      // Storage may be unavailable in private mode.
    }
  }

  function renderSurveyOptionBar(container, question, copy, onPick, optionClass) {
    if (!container) return;
    container.innerHTML = "";
    if (!question || !question.options || !question.options.length) {
      container.hidden = true;
      return;
    }

    container.hidden = false;
    var hint = document.createElement("p");
    hint.className = "chat-survey-hint";
    hint.textContent = copy.surveyChoiceHint || "";
    container.appendChild(hint);

    var grid = document.createElement("div");
    grid.className = "chat-survey-options";
    question.options.forEach(function (option) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = optionClass || "chat-survey-option";
      button.textContent = option;
      button.addEventListener("click", function () {
        onPick(option);
      });
      grid.appendChild(button);
    });
    container.appendChild(grid);
  }

  function submitChatSurveyPayload(payload, copy, statusNode, submitButton) {
    if (!payload) return Promise.reject(new Error("Missing payload"));
    var fingerprint = JSON.stringify(payload);
    if (chatRequestsInFlight.has(fingerprint)) return Promise.resolve();

    var guard = site.utils.requestSubmitCheck(payload);
    if (!guard.allowed) {
      var blockedMessage = copy.surveySubmitBlockedLabel || copy.surveySubmittedLabel || "Request already sent.";
      if (statusNode) {
        statusNode.textContent = blockedMessage;
        statusNode.classList.remove("is-success");
      }
      var actionsWrap = submitButton ? submitButton.closest(".auto-chat-brief-actions, .chat-page-brief-actions") : null;
      if (actionsWrap) actionsWrap.classList.remove("is-submitted-success");
      if (submitButton) submitButton.disabled = guard.reason === "duplicate";
      return Promise.resolve(blockedMessage);
    }

    chatRequestsInFlight.add(fingerprint);
    if (submitButton) submitButton.disabled = true;
    var controller = new AbortController();
    var sendTimeout = window.setTimeout(function () { controller.abort(); }, 25000);
    if (statusNode) {
      statusNode.textContent = (copy.submitRequestLabel || "Submit") + "...";
      statusNode.classList.remove("is-success");
    }

    return window.fetch("/api/request", {
      signal: controller.signal,
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({}, payload, { _trap: "" }))
    }).then(function (response) {
      return response.json().catch(function () {
        return {};
      }).then(function (data) {
        if (!response.ok || data.ok !== true || data.emailSent !== true) {
          throw new Error(data.error || "Submit failed");
        }
        return data;
      });
    }).then(function () {
      var message = copy.surveySubmittedLabel || "Request received.";
      site.utils.recordRequestSubmit(payload);
      if (statusNode) {
        statusNode.textContent = message;
        statusNode.classList.add("is-success");
      }
      var actionsWrap = submitButton ? submitButton.closest(".auto-chat-brief-actions, .chat-page-brief-actions") : null;
      if (actionsWrap) actionsWrap.classList.add("is-submitted-success");
      site.utils.showSubmitSuccessCelebration(submitButton || statusNode);
      return message;
    }).catch(function () {
      if (submitButton) submitButton.disabled = false;
      if (statusNode) {
        statusNode.textContent = copy.surveySubmitError || "Submit failed.";
        statusNode.classList.remove("is-success");
      }
      throw new Error("submit failed");
    }).finally(function () { window.clearTimeout(sendTimeout); chatRequestsInFlight.delete(fingerprint); });
  }

  function appendChatBriefActions(container, summaryText, payload, copy, classPrefix) {
    var prefix = classPrefix || "auto-chat";
    var recipient = (site.content.contacts && site.content.contacts.email) || "info@smarttechllc.am";
    storeChatSurveyBrief(payload);

    var actions = document.createElement("span");
    actions.className = prefix + "-brief-actions";
    actions.innerHTML =
      '<button class="' + prefix + '-submit-action" type="button" data-chat-submit-request>' +
        site.utils.escapeHtml(copy.submitRequestLabel || "Submit request") +
      "</button>" +
      '<a class="' + prefix + '-open-request-action" href="' + site.utils.escapeHtml(site.utils.pageUrl("request")) + '">' +
        site.utils.escapeHtml(copy.openRequestLabel || "Open request page") +
      "</a>" +
      '<a class="' + prefix + '-mail-action" href="' +
        site.utils.escapeHtml(site.utils.mailTo(recipient, "Smart Tech project request", summaryText)) +
      '">' + site.utils.escapeHtml(copy.surveyMailLabel || "Send by email") + "</a>" +
      '<small class="' + prefix + '-submit-status" data-chat-submit-status></small>';

    container.appendChild(actions);
    chatBriefPayloads.set(actions.querySelector('[data-chat-submit-request]'), payload);
  }

  function startChatSurvey(copy) {
    chatSurveyState = { step: 0, answers: {} };
    chatLatestSurveyPayload = null;
    appendChatMessage("bot", copy.surveyIntro);
    window.setTimeout(function () {
      showAutoChatSurveyQuestion(copy);
    }, 420);
  }

  function clearAutoChatSurveyOptions() {
    if (chatUi && chatUi.surveyOptions) {
      chatUi.surveyOptions.hidden = true;
      chatUi.surveyOptions.innerHTML = "";
    }
  }

  function showAutoChatSurveyQuestion(copy) {
    var question = getActiveSurveyQuestion(copy, chatSurveyState);
    if (!question || !chatUi) return;
    appendChatMessage("bot", question.question);
    renderSurveyOptionBar(chatUi.surveyOptions, question, copy, function (option) {
      if (chatUi.root.classList.contains("is-busy")) return;
      handleChatRequest(option, "fallback", copy);
    }, "auto-chat-survey-option");
  }

  function completeChatSurvey(copy) {
    clearAutoChatSurveyOptions();
    var answers = chatSurveyState ? chatSurveyState.answers : {};
    var summaryText = buildChatSurveySummary(copy, answers);
    var payload = buildChatSurveyPayload(copy, answers, "chat-widget");
    chatLatestSurveyPayload = payload;

    if (chatUi && chatUi.messages) {
      var item = document.createElement("div");
      item.className = "auto-chat-message auto-chat-message-bot auto-chat-message-brief";
      var text = document.createElement("span");
      text.textContent = summaryText;
      protectBrandText(text);
      item.appendChild(text);
      appendChatBriefActions(item, summaryText, payload, copy, "auto-chat");
      chatUi.messages.appendChild(item);
      chatUi.messages.scrollTop = chatUi.messages.scrollHeight;
      pushChatHistory("bot", summaryText);
    }

    chatSurveyState = null;

    try {
      window.sessionStorage.setItem("smarttech.chat.survey.completed", "1");
    } catch (error) {
      // Storage may be unavailable in private mode.
    }
  }

  function surveyAnswerError(question, value) {
    if (!question || question.id !== 'contact') return '';
    if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(value) || /\+?\d[\d\s().-]{5,}\d/.test(value)) return '';
    return { hy: 'Նշեք նաև հեռախոսահամար կամ վավեր էլ․ հասցե, որպեսզի կարողանանք կապվել ձեզ հետ։', en: 'Please include a phone number or valid email so we can contact you.', ru: 'Добавьте номер телефона или корректный email, чтобы мы могли связаться с вами.' }[activeChatLanguage()] || 'Please include a phone number or email.';
  }

  function handleChatSurvey(messageText, copy) {
    if (!chatSurveyState || !copy || !copy.surveyQuestions) return false;
    var current = copy.surveyQuestions[chatSurveyState.step];
    if (!current) return false;

    var validationError = surveyAnswerError(current, messageText);
    if (validationError) { appendChatMessage('bot', validationError); return true; }
    chatSurveyState.answers[current.id] = messageText;
    chatSurveyState.step += 1;
    clearAutoChatSurveyOptions();

    var typingEl;
    if (chatSurveyState.step >= copy.surveyQuestions.length) {
      typingEl = showTyping(copy);
      chatTypingTimer = window.setTimeout(function () {
        removeTyping(typingEl);
        completeChatSurvey(copy);
      }, 620);
    } else {
      typingEl = showTyping(copy);
      chatTypingTimer = window.setTimeout(function () {
        removeTyping(typingEl);
        showAutoChatSurveyQuestion(copy);
      }, 620);
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
    if (mobileBottomNav) {
      updateMobileBottomNavActive();
    }

    if (isOpen) {
      chatUi.panel.hidden = false;
      window.requestAnimationFrame(function () {
        if (chatUi) {
          chatUi.root.classList.add("is-open");
          if (mobileBottomNav) updateMobileBottomNavActive();
        }
      });
      window.setTimeout(function () {
        chatUi.input.focus();
      }, 60);
      return;
    }

    chatUi.root.classList.remove("is-open");
    document.body.classList.remove("is-chat-open");
    if (mobileBottomNav) {
      updateMobileBottomNavActive();
    }
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
    var dots = document.createElement("span");
    dots.className = "auto-chat-typing-dots";
    dots.innerHTML = "<span></span><span></span><span></span>";
    typingEl.appendChild(dots);
    typingEl.setAttribute("data-translate-id", "chat-typing");
    chatUi.messages.appendChild(typingEl);
    chatUi.messages.scrollTop = chatUi.messages.scrollHeight;
    return typingEl;
  }

  function removeTyping(typingEl) {
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }
  }

  function setChatBusy(isBusy, copy) {
    if (!chatUi) return;
    chatUi.root.classList.toggle("is-busy", !!isBusy);
    chatUi.input.disabled = !!isBusy || chatLimitReached;
    chatUi.send.disabled = !!isBusy || chatLimitReached;
    chatUi.send.textContent = chatLimitReached ? (copy.limitButton || copy.sendLabel) : isBusy ? (copy.busyLabel || copy.typing) : copy.sendLabel;
    if (chatUi.quickActions) {
      chatUi.quickActions.querySelectorAll("button").forEach(function (button) {
        button.disabled = !!isBusy || chatLimitReached;
      });
    }
    if (chatUi.surveyOptions) {
      chatUi.surveyOptions.querySelectorAll("button").forEach(function (button) {
        button.disabled = !!isBusy || chatLimitReached;
      });
    }
  }

  function setChatLimitReached(copy) {
    chatLimitReached = true;
    if (chatUi) {
      chatUi.root.classList.add("is-limit-reached");
      chatUi.input.disabled = true;
      chatUi.send.disabled = true;
      chatUi.send.textContent = copy.limitButton || copy.sendLabel;
    }
    redirectToFullChatPage();
  }

  function finishChatTurnIfLimited(copy) {
    if (chatUserQuestionCount < chatQuestionLimit || chatLimitReached) return;
    setChatLimitReached(copy);
  }

  function compactChatHistory() {
    return chatHistory.slice(-6).map(function (entry) {
      return {
        role: entry.role === "user" ? "user" : "bot",
        text: String(entry.text || "").slice(0, 360)
      };
    });
  }

  function requestAiChat(messageText, copy, historySnapshot) {
    return window.fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messageText,
        history: historySnapshot,
        page: window.location.pathname + window.location.search
      })
    }).then(function (response) {
      return response.json().catch(function () {
        return {};
      }).then(function (data) {
        if (!response.ok) {
          var error = new Error(data.reply || copy.networkError);
          error.reply = data.reply || copy.networkError;
          error.status = response.status;
          throw error;
        }
        return data;
      });
    });
  }

  function refreshQuickButtons(copy) {
    if (!chatUi || !chatUi.quickActions) return;
    chatUi.quickActions.innerHTML = "";
    copy.quickIntents.forEach(function (item) {
      var button = document.createElement("button");
      button.className = "auto-chat-quick" + (item.id === "survey" ? " auto-chat-quick-primary" : "");
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
      appendChatMessage("bot", chatReplyForIntent(intent, copy, activeChatLanguage()));
    }, 680);
  }

  function handleChatRequest(messageText, intent, copy) {
    if (chatUi && chatUi.root.classList.contains("is-busy")) return;
    if (chatLimitReached || chatUserQuestionCount >= chatQuestionLimit) {
      setChatLimitReached(copy);
      return;
    }

    var historySnapshot = compactChatHistory();
    chatUserQuestionCount += 1;
    writeQuickChatQuestionCount();
    appendChatMessage("user", messageText);

    if (chatSurveyState && handleChatSurvey(messageText, copy)) {
      finishChatTurnIfLimited(copy);
      return;
    }

    if (intent === "survey") {
      startChatSurvey(copy);
      finishChatTurnIfLimited(copy);
      return;
    }

    if (isLocalChatIntent(intent)) {
      respondByIntent(intent, copy);
      finishChatTurnIfLimited(copy);
      return;
    }

    if (chatTypingTimer) {
      window.clearTimeout(chatTypingTimer);
      chatTypingTimer = null;
    }

    var typingEl = showTyping(copy);
    setChatBusy(true, copy);

    requestAiChat(messageText, copy, historySnapshot)
      .then(function (data) {
        removeTyping(typingEl);
        appendChatMessage("bot", data.reply || copy.replies[intent] || copy.replies.fallback);
      })
      .catch(function (error) {
        removeTyping(typingEl);
        if (isQuickChatQuotaError(error)) {
          setChatLimitReached(copy);
          return;
        }
        appendChatMessage("bot", (error && error.reply) || chatReplyForIntent(intent, copy, activeChatLanguage()) || copy.networkError);
      })
      .then(function () {
        setChatBusy(false, copy);
        finishChatTurnIfLimited(copy);
      });
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
          '<a class="auto-chat-fullpage" href="' + site.utils.escapeHtml(site.utils.pageUrl("chat")) + '"></a>' +
          '<button class="auto-chat-close" type="button" aria-label="Close chat">&times;</button>' +
        "</header>" +
        '<div class="auto-chat-messages" aria-live="polite"></div>' +
        '<div class="auto-chat-survey-options" data-chat-survey-options hidden></div>' +
        '<div class="auto-chat-quick-wrap">' +
          '<p class="auto-chat-quick-label"></p>' +
          '<div class="auto-chat-quick-actions"></div>' +
        "</div>" +
        '<form class="auto-chat-form">' +
          '<input class="auto-chat-input" type="text" autocomplete="off" maxlength="700">' +
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
      fullPage: host.querySelector(".auto-chat-fullpage"),
      messages: host.querySelector(".auto-chat-messages"),
      surveyOptions: host.querySelector("[data-chat-survey-options]"),
      quickActions: host.querySelector(".auto-chat-quick-actions"),
      form: host.querySelector(".auto-chat-form"),
      input: host.querySelector(".auto-chat-input"),
      send: host.querySelector(".auto-chat-send")
    };

    ui.trigger.addEventListener("click", function () {
      if (chatLimitReached || chatUserQuestionCount >= chatQuestionLimit) {
        redirectToFullChatPage();
        return;
      }
      setChatOpen(!ui.root.classList.contains("is-open"));
    });

    ui.close.addEventListener("click", function () {
      setChatOpen(false);
    });

    if (ui.fullPage) {
      ui.fullPage.addEventListener("click", function (event) {
        if (chatLimitReached || chatUserQuestionCount >= chatQuestionLimit) {
          event.preventDefault();
          redirectToFullChatPage();
        }
      });
    }

    ui.dismiss.addEventListener("click", function () {
      setChatDismissed(true);
    });

    if (ui.quickActions) {
      ui.quickActions.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-intent]");
        if (!button) return;
        var lang = activeChatLanguage();
        var copy = chatDictionary(lang);
        var intent = button.getAttribute("data-intent") || "fallback";
        handleChatRequest(button.textContent || "", intent, copy);
      });
    }

    if (ui.messages) {
      ui.messages.addEventListener("click", function (event) {
        var submitButton = event.target.closest("[data-chat-submit-request]");
        if (!submitButton || !chatBriefPayloads.has(submitButton)) return;
        var card = submitButton.closest(".auto-chat-message-brief");
        var statusNode = card ? card.querySelector("[data-chat-submit-status]") : null;
        var lang = activeChatLanguage();
        var copy = chatDictionary(lang);
        submitChatSurveyPayload(chatBriefPayloads.get(submitButton), copy, statusNode, submitButton)
          .catch(function () {});
      });
    }

    ui.form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = String(ui.input.value || "").trim();
      if (!value) return;
      ui.input.value = "";
      var lang = activeChatLanguage();
      var copy = chatDictionary(lang);
      handleChatRequest(value, chatTopicHint(value) || chatIntent(value, lang), copy);
    });

    return ui;
  }

  function setupAutoChat() {
    if (currentRoute().page === "chat") {
      if (chatUi && chatUi.root) {
        chatUi.root.hidden = true;
      }
      return;
    }

    if (!chatUi) {
      chatUi = buildChatUi();
      chatUserQuestionCount = readQuickChatQuestionCount();
      chatLimitReached = chatUserQuestionCount >= chatQuestionLimit;
    }
    if (chatUi.root) {
      chatUi.root.hidden = false;
    }

    var lang = activeChatLanguage();
    var copy = chatDictionary(lang);
    chatUi.title.textContent = copy.title;
    chatUi.subtitle.textContent = copy.subtitle;
    var reminderFlag = false;
    try {
      reminderFlag = window.sessionStorage.getItem("smarttech.chat.survey.completed") === "1";
    } catch (error) {
      reminderFlag = false;
    }
    chatUi.statusText.textContent = copy.statusLabel + (reminderFlag && copy.reminderStatus ? " - " + copy.reminderStatus : "");
    if (chatUi.quickLabel) {
      chatUi.quickLabel.textContent = copy.quickLabel;
    }
    chatUi.triggerText.textContent = copy.title;
    chatUi.trigger.setAttribute("aria-label", copy.openLabel);
    chatUi.close.setAttribute("aria-label", copy.closeLabel);
    if (chatUi.fullPage) {
      chatUi.fullPage.setAttribute("aria-label", copy.fullChatLabel || copy.openLabel);
      chatUi.fullPage.setAttribute("title", copy.fullChatLabel || copy.openLabel);
    }
    if (chatUi.dismiss) {
      chatUi.dismiss.setAttribute("aria-label", copy.hideLabel || copy.closeLabel);
    }
    chatUi.input.setAttribute("placeholder", copy.inputPlaceholder);
    chatUi.input.setAttribute("aria-label", copy.inputPlaceholder);
    chatUi.send.textContent = copy.sendLabel;
    refreshQuickButtons(copy);

    if (chatLanguage !== lang) {
      chatLanguage = lang;
      chatHistory = [];
      chatUserQuestionCount = readQuickChatQuestionCount();
      chatLimitReached = chatUserQuestionCount >= chatQuestionLimit;
      if (chatUi) {
        chatUi.root.classList.remove("is-limit-reached");
        chatUi.input.disabled = false;
        chatUi.send.disabled = false;
      }
      if (chatTypingTimer) {
        window.clearTimeout(chatTypingTimer);
        chatTypingTimer = null;
      }
    }

    renderChatHistory(copy);
    if (chatLimitReached || chatUserQuestionCount >= chatQuestionLimit) {
      chatLimitReached = true;
      if (chatUi) {
        chatUi.root.classList.add("is-limit-reached");
      }
    }
    setChatDismissed(isChatDismissed());
  }

  function chatPageClientId() {
    try {
      var existing = window.localStorage.getItem(chatPageClientIdKey);
      if (existing) return existing;
      var nextId = "cp_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
      window.localStorage.setItem(chatPageClientIdKey, nextId);
      return nextId;
    } catch (error) {
      return "cp_anon";
    }
  }

  function countChatWords(text) {
    return String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;
  }

  function countChatMessagesWords(entries) {
    if (!Array.isArray(entries)) return 0;
    return entries.reduce(function (sum, entry) {
      return sum + countChatWords(entry && entry.text);
    }, 0);
  }

  function chatPageLimitCopy(language) {
    var lang = normalizeChatLanguageCode(language);
    var copies = {
      hy: {
        saved: "Պահված զրույց · մոտ {used}/{limit} բառ",
        cleared: "Զրույցի սահմանը լցվեց, պատմությունը ավտոմատ մաքրվեց։ Կարող եք նորից սկսել։",
        blocked: "Չատը ժամանակավորապես կասեցված է 2 օրով՝ չափից շատ հարցերի պատճառով։",
        blockedUntil: "Չատը կասեցված է մինչև {date}։"
      },
      en: {
        saved: "Saved chat · about {used}/{limit} words",
        cleared: "The chat memory limit was reached and the history was cleared automatically. You can start again.",
        blocked: "Chat is temporarily paused for 2 days because of too many questions.",
        blockedUntil: "Chat is paused until {date}."
      },
      ru: {
        saved: "Сохраненный чат · около {used}/{limit} слов",
        cleared: "Лимит памяти чата заполнен, история была автоматически очищена. Можно начать заново.",
        blocked: "Чат временно остановлен на 2 дня из-за слишком большого числа вопросов.",
        blockedUntil: "Чат остановлен до {date}."
      }
    };
    return copies[lang] || copies.hy;
  }

  function loadChatPageState() {
    try {
      var raw = window.localStorage.getItem(chatPageStorageKey);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      parsed.messages = Array.isArray(parsed.messages) ? parsed.messages : [];
      parsed.questionCount = Math.max(0, Number(parsed.questionCount) || 0);
      parsed.wordCount = Math.max(0, Number(parsed.wordCount) || countChatMessagesWords(parsed.messages));
      parsed.blockedUntil = Number(parsed.blockedUntil) || 0;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function saveChatPageState(state) {
    try {
      window.localStorage.setItem(chatPageStorageKey, JSON.stringify(state));
    } catch (error) {
      return false;
    }
    return true;
  }

  function clearChatPageState() {
    try {
      window.localStorage.removeItem(chatPageStorageKey);
    } catch (error) {
      return false;
    }
    return true;
  }

  function loadChatPageProfile() {
    try {
      var raw = window.localStorage.getItem(chatPageProfileKey);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function saveChatPageProfile(profile) {
    try {
      window.localStorage.setItem(chatPageProfileKey, JSON.stringify(profile));
      return true;
    } catch (error) {
      return false;
    }
  }

  function isChatPageProfileComplete(profile) {
    if (!profile || typeof profile !== "object") return false;
    return ["firstName", "lastName", "email", "phone", "purpose"].every(function (key) {
      return String(profile[key] || "").trim().length > 0;
    });
  }

  function getChatPageProfileLabels(copy) {
    var labels = {};
    (copy.profileQuestions || []).forEach(function (question) {
      labels[question.id] = question.label || question.id;
    });
    return labels;
  }

  function getChatPageProfilePurposeOptions(copy) {
    var purposeQuestion = (copy.profileQuestions || []).find(function (question) {
      return question.id === "purpose";
    });
    return purposeQuestion && purposeQuestion.options ? purposeQuestion.options.slice() : [];
  }

  function validateChatPageProfileAnswer(questionId, value, copy) {
    var text = String(value || "").trim();
    if (questionId === "firstName" || questionId === "lastName") {
      if (text.length < 2) return copy.profileInvalidName;
      return "";
    }
    if (questionId === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return copy.profileInvalidEmail;
      return "";
    }
    if (questionId === "phone") {
      var digits = text.replace(/\D/g, "");
      if (digits.length < 6) return copy.profileInvalidPhone;
      return "";
    }
    if (questionId === "purpose") {
      if (!text) return copy.profileInvalidName;
      return "";
    }
    return text ? "" : copy.profileInvalidName;
  }

  function setupChatPage() {
    var root = document.querySelector("[data-chat-page]");
    if (!root) return;

    var messages = root.querySelector("[data-chat-page-messages]");
    var form = root.querySelector("[data-chat-page-form]");
    var input = root.querySelector("[data-chat-page-input]");
    var send = root.querySelector("[data-chat-page-send]");
    var status = root.querySelector("[data-chat-page-status]");
    var limitNote = root.querySelector("[data-chat-page-limit]");
    var quick = root.querySelector("[data-chat-page-quick]");
    var surveyOptions = root.querySelector("[data-chat-page-survey-options]");
    var history = [];
    var copy = chatDictionary(activeChatLanguage());
    var limitCopy = chatPageLimitCopy(activeChatLanguage());
    var pageSurveyState = null;
    var userProfile = loadChatPageProfile();
    var profileIntakeActive = !isChatPageProfileComplete(userProfile);
    var profileLayer = root.querySelector("[data-chat-page-profile]");
    var profileForm = root.querySelector("[data-chat-page-profile-form]");
    var profileError = root.querySelector("[data-chat-page-profile-error]");
    var profilePurposeOptions = root.querySelector("[data-chat-page-profile-purpose-options]");
    var profilePurposeCustom = root.querySelector("[data-chat-page-profile-purpose-custom]");
    var userBadge = root.querySelector("[data-chat-page-user-badge]");
    var userBadgeName = root.querySelector("[data-chat-page-user-name]");
    var userBadgeAvatar = root.querySelector("[data-chat-page-user-avatar]");
    var selectedPurpose = "";
    var latestSurveyPayload = null;
    var busy = false;
    var pageBlocked = false;
    var pageSession = loadChatPageState() || {
      version: 1,
      updatedAt: Date.now(),
      questionCount: 0,
      wordCount: 0,
      blockedUntil: 0,
      chatHistoryStart: 0,
      messages: []
    };
    if (!profileIntakeActive && isChatPageProfileComplete(userProfile) && !pageSession.chatHistoryStart) {
      pageSession.chatHistoryStart = pageSession.messages.length;
    }

    function append(role, text, typing) {
      var item = document.createElement("div");
      item.className = "chat-page-message chat-page-message-" + role + (typing ? " is-typing" : "");
      if (typing) {
        var liveAnim = site.sections.chatLiveAnimation
          ? site.sections.chatLiveAnimation("chat-live-animation-inline")
          : "";
        item.innerHTML =
          '<div class="chat-page-typing-row">' +
            liveAnim +
            '<span class="chat-page-typing-text">' + site.utils.escapeHtml(text) + "</span>" +
          "</div>";
      } else {
        item.textContent = text;
      }
      messages.appendChild(item);
      if (role === "user") {
        root.classList.add("has-conversation");
      }
      var scroll = root.querySelector(".chat-page-scroll");
      if (scroll) {
        scroll.scrollTop = scroll.scrollHeight;
      } else {
        messages.scrollTop = messages.scrollHeight;
      }
      return item;
    }

    function pageHistory() {
      return history.slice(-8).map(function (entry) {
        return {
          role: entry.role === "user" ? "user" : "bot",
          text: String(entry.text || "").slice(0, 360)
        };
      });
    }

    function formatBlockedDate(timestamp) {
      try {
        return new Date(timestamp).toLocaleString(activeChatLanguage() === "hy" ? "hy-AM" : activeChatLanguage());
      } catch (error) {
        return new Date(timestamp).toLocaleString();
      }
    }

    function updateLimitFooter() {
      if (!limitNote) return;
      if (pageBlocked) {
        if (pageSession.blockedUntil > Date.now()) {
          limitNote.textContent = limitCopy.blockedUntil.replace("{date}", formatBlockedDate(pageSession.blockedUntil));
        } else {
          limitNote.textContent = limitCopy.blocked;
        }
        return;
      }
      var used = countChatMessagesWords(history);
      limitNote.textContent = limitCopy.saved
        .replace("{used}", String(used))
        .replace("{limit}", String(chatPageWordLimit));
    }

    function persistPageSession() {
      pageSession.messages = history.map(function (entry) {
        return {
          role: entry.role === "user" ? "user" : "bot",
          text: String(entry.text || "").slice(0, 1200)
        };
      });
      pageSession.wordCount = countChatMessagesWords(pageSession.messages);
      pageSession.questionCount = pageSession.messages.filter(function (entry) {
        return entry.role === "user";
      }).length;
      pageSession.updatedAt = Date.now();
      saveChatPageState(pageSession);
      updateLimitFooter();
    }

    function resetPageSession(notifyText) {
      history = [];
      pageSession.messages = [];
      pageSession.wordCount = 0;
      pageSession.questionCount = 0;
      pageSession.updatedAt = Date.now();
      if (messages) {
        messages.querySelectorAll(".chat-page-message:not(.chat-page-message-intro)").forEach(function (node) {
          node.parentNode.removeChild(node);
        });
      }
      root.classList.remove("has-conversation");
      saveChatPageState(pageSession);
      updateLimitFooter();
      if (notifyText) {
        append("bot", notifyText);
        history.push({ role: "bot", text: notifyText });
        persistPageSession();
      }
    }

    function setPageBlocked(reasonText, blockedUntil) {
      pageBlocked = true;
      pageSession.blockedUntil = blockedUntil || (Date.now() + chatPageBlockMs);
      root.classList.add("is-blocked");
      if (input) input.disabled = true;
      if (send) send.disabled = true;
      if (quick) {
        quick.querySelectorAll("button").forEach(function (button) {
          button.disabled = true;
        });
      }
      saveChatPageState(pageSession);
      updateLimitFooter();
      if (reasonText) {
        append("bot", reasonText);
        history.push({ role: "bot", text: reasonText });
        persistPageSession();
      }
    }

    function ensurePageCanSend() {
      if (pageSession.blockedUntil > Date.now()) {
        if (!pageBlocked) {
          setPageBlocked(limitCopy.blocked, pageSession.blockedUntil);
        }
        return false;
      }
      if (pageSession.blockedUntil && pageSession.blockedUntil <= Date.now()) {
        pageSession.blockedUntil = 0;
        pageBlocked = false;
        root.classList.remove("is-blocked");
        if (input) input.disabled = false;
        if (send) send.disabled = false;
        saveChatPageState(pageSession);
      }
      return !pageBlocked;
    }

    function trackPageUserMessage() {
      var totalWords = countChatMessagesWords(history);
      if (totalWords > chatPageWordLimit) {
        resetPageSession(limitCopy.cleared);
        return false;
      }
      var historyStart = Math.max(0, Number(pageSession.chatHistoryStart) || 0);
      var userCount = history.slice(historyStart).filter(function (entry) {
        return entry.role === "user";
      }).length;
      if (userCount > chatPageQuestionLimit) {
        setPageBlocked(limitCopy.blocked, Date.now() + chatPageBlockMs);
        return false;
      }
      return true;
    }

    function restorePageSession() {
      if (!pageSession.messages.length) return false;
      pageSession.messages.forEach(function (entry) {
        if (entry.role === "user") {
          append("user", entry.text);
        } else {
          append("bot", entry.text);
        }
        history.push({ role: entry.role === "user" ? "user" : "bot", text: entry.text });
      });
      updateLimitFooter();
      return true;
    }

    function setBusy(next) {
      busy = next;
      root.classList.toggle("is-busy", busy);
      if (input) input.disabled = busy;
      if (send) send.disabled = busy;
      if (quick) {
        quick.querySelectorAll("button").forEach(function (button) {
          button.disabled = busy;
        });
      }
      if (surveyOptions) {
        surveyOptions.querySelectorAll("button").forEach(function (button) {
          button.disabled = busy;
        });
      }
      if (status) {
        status.textContent = busy ? (status.getAttribute("data-typing-label") || "") : "";
      }
    }

    function clearPageSurveyOptions() {
      if (!surveyOptions) return;
      surveyOptions.hidden = true;
      surveyOptions.innerHTML = "";
    }

    function setProfileFormError(message) {
      if (!profileError) return;
      var text = String(message || "").trim();
      profileError.hidden = !text;
      profileError.textContent = text;
    }

    function profileFieldLabel(id) {
      var labels = getChatPageProfileLabels(copy);
      return labels[id] || id;
    }

    function updateUserBadge() {
      if (!userBadge || !userProfile || !isChatPageProfileComplete(userProfile)) {
        if (userBadge) userBadge.hidden = true;
        return;
      }
      var fullName = [userProfile.firstName, userProfile.lastName].filter(Boolean).join(" ").trim();
      var displayName = fullName || userProfile.firstName || "";
      if (userBadgeName) userBadgeName.textContent = displayName;
      if (userBadgeAvatar) {
        userBadgeAvatar.textContent = String(displayName || "S").charAt(0).toUpperCase();
      }
      userBadge.hidden = !displayName;
      root.classList.toggle("has-user-badge", !userBadge.hidden);
    }

    function personalizeWelcomeTitle() {
      var welcomeTitle = root.querySelector(".chat-page-welcome h1");
      if (!welcomeTitle || !userProfile || !userProfile.firstName) return;
      var lang = activeChatLanguage();
      welcomeTitle.textContent = lang === "hy"
        ? "Բարև, " + userProfile.firstName
        : (lang === "ru" ? "Здравствуйте, " : "Hi, ") + userProfile.firstName;
    }

    function initProfilePanelCopy() {
      var eyebrow = root.querySelector("[data-chat-page-profile-eyebrow]");
      var title = root.querySelector("[data-chat-page-profile-title]");
      var lead = root.querySelector("[data-chat-page-profile-lead]");
      var submit = root.querySelector("[data-chat-page-profile-submit]");
      var purposeLabel = root.querySelector("[data-chat-page-profile-purpose-label]");
      if (eyebrow) eyebrow.textContent = copy.profilePanelEyebrow || "Smart Tech AI";
      if (title) title.textContent = copy.profilePanelTitle || "";
      if (lead) lead.textContent = copy.profilePanelLead || "";
      if (submit) submit.textContent = copy.profilePanelSubmit || "";
      if (purposeLabel) purposeLabel.textContent = copy.profilePurposeLabel || "";
      var labelFirst = root.querySelector("[data-chat-page-profile-label-first]");
      var labelLast = root.querySelector("[data-chat-page-profile-label-last]");
      var labelEmail = root.querySelector("[data-chat-page-profile-label-email]");
      var labelPhone = root.querySelector("[data-chat-page-profile-label-phone]");
      if (labelFirst) labelFirst.textContent = profileFieldLabel("firstName");
      if (labelLast) labelLast.textContent = profileFieldLabel("lastName");
      if (labelEmail) labelEmail.textContent = profileFieldLabel("email");
      if (labelPhone) labelPhone.textContent = profileFieldLabel("phone");
    }

    function renderProfilePurposeOptions() {
      if (!profilePurposeOptions) return;
      profilePurposeOptions.innerHTML = "";
      selectedPurpose = "";
      getChatPageProfilePurposeOptions(copy).forEach(function (option) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "chat-page-profile-purpose-btn";
        button.textContent = option;
        button.addEventListener("click", function () {
          selectedPurpose = option;
          profilePurposeOptions.querySelectorAll(".chat-page-profile-purpose-btn").forEach(function (node) {
            node.classList.toggle("is-active", node === button);
          });
          if (profilePurposeCustom) {
            var isCustomPurpose = ["Այլ", "Other", "Другое"].indexOf(option) >= 0;
            profilePurposeCustom.hidden = !isCustomPurpose;
            if (!isCustomPurpose) {
              profilePurposeCustom.value = "";
            } else {
              profilePurposeCustom.placeholder = copy.profilePurposeCustom || "";
              profilePurposeCustom.focus();
            }
          }
          setProfileFormError("");
        });
        profilePurposeOptions.appendChild(button);
      });
    }

    function openProfilePanel() {
      profileIntakeActive = true;
      initProfilePanelCopy();
      renderProfilePurposeOptions();
      setProfileFormError("");
      if (profileForm) profileForm.reset();
      if (profileLayer) {
        profileLayer.hidden = false;
        window.requestAnimationFrame(function () {
          root.classList.add("is-profile-open");
        });
      }
      updateProfileUi();
      var firstInput = root.querySelector("[data-chat-page-profile-first]");
      if (firstInput) window.setTimeout(function () { firstInput.focus(); }, 180);
    }

    function closeProfilePanel() {
      if (profileLayer) profileLayer.hidden = true;
      root.classList.remove("is-profile-open");
    }

    function updateProfileUi() {
      root.classList.toggle("is-profile-intake", profileIntakeActive);
      if (quick) quick.hidden = profileIntakeActive;
      var surveyAddon = root.querySelector('[data-chat-page-intent="survey"]');
      if (surveyAddon) surveyAddon.hidden = profileIntakeActive;
      if (input) input.disabled = profileIntakeActive || busy || pageBlocked;
      if (send) send.disabled = profileIntakeActive || busy || pageBlocked;
    }

    function completeProfileIntake(answers) {
      userProfile = {
        firstName: String(answers.firstName || "").trim(),
        lastName: String(answers.lastName || "").trim(),
        email: String(answers.email || "").trim(),
        phone: String(answers.phone || "").trim(),
        purpose: String(answers.purpose || "").trim(),
        completedAt: Date.now()
      };
      saveChatPageProfile(userProfile);
      profileIntakeActive = false;
      pageSession.chatHistoryStart = history.length;
      closeProfilePanel();
      updateProfileUi();
      updateUserBadge();
      personalizeWelcomeTitle();
      playPageWelcome();
    }

    function handleProfileFormSubmit(event) {
      if (event) event.preventDefault();
      if (!profileForm || busy) return;

      var formData = new FormData(profileForm);
      var answers = {
        firstName: String(formData.get("firstName") || "").trim(),
        lastName: String(formData.get("lastName") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        purpose: selectedPurpose
      };
      var customPurpose = String(formData.get("purposeCustom") || "").trim();
      if (!answers.purpose && customPurpose) answers.purpose = customPurpose;
      if (["Այլ", "Other", "Другое"].indexOf(answers.purpose) >= 0) {
        answers.purpose = customPurpose || answers.purpose;
      }

      var validationError =
        validateChatPageProfileAnswer("firstName", answers.firstName, copy) ||
        validateChatPageProfileAnswer("lastName", answers.lastName, copy) ||
        validateChatPageProfileAnswer("email", answers.email, copy) ||
        validateChatPageProfileAnswer("phone", answers.phone, copy) ||
        validateChatPageProfileAnswer("purpose", answers.purpose, copy);

      if (validationError) {
        setProfileFormError(validationError);
        return;
      }

      setProfileFormError("");
      completeProfileIntake(answers);
    }

    function startProfileIntake() {
      openProfilePanel();
    }

    function showPageSurveyQuestion() {
      var question = getActiveSurveyQuestion(copy, pageSurveyState);
      if (question && question.id === 'contact' && pageSurveyState.answers.contact) {
        completePageSurvey();
        return;
      }
      if (!question) return;
      append("bot", question.question);
      history.push({ role: "bot", text: question.question });
      persistPageSession();
      renderSurveyOptionBar(surveyOptions, question, copy, function (option) {
        sendMessage(option);
      }, "chat-page-survey-option");
    }

    function refreshPageQuickButtons() {
      if (!quick) return;
      quick.innerHTML = "";
      simpleQuickIntents(activeChatLanguage()).forEach(function (item) {
        var button = document.createElement("button");
        button.className = "chat-page-chip chat-page-quick-btn" + (item.id === "survey" ? " chat-page-quick-btn-primary" : "");
        button.type = "button";
        button.setAttribute("data-chat-page-intent", item.id);
        button.textContent = item.label;
        quick.appendChild(button);
      });
    }

    function surveyMailLabel() {
      return copy.surveyMailLabel || "Send by email";
    }

    function surveySubmitLabel() {
      return copy.submitRequestLabel || "Submit request";
    }

    function surveySubmittedLabel(id) {
      var base = copy.surveySubmittedLabel || "Request received.";
      return id ? base + " #" + String(id).slice(0, 8) : base;
    }

    function surveySubmitErrorLabel() {
      return copy.surveySubmitError || "Could not submit the request.";
    }

    function appendSurveySummary(summaryText, payload) {
      var item = document.createElement("div");
      item.className = "chat-page-message chat-page-message-bot chat-page-message-brief";
      var text = document.createElement("span");
      text.textContent = summaryText;
      item.appendChild(text);
      appendChatBriefActions(item, summaryText, payload, copy, "chat-page");
      messages.appendChild(item);
      messages.scrollTop = messages.scrollHeight;
      history.push({ role: "bot", text: summaryText });
      latestSurveyPayload = payload || null;
      persistPageSession();
    }

    function startPageSurvey() {
      pageSurveyState = { step: 0, answers: {} };
      if (userProfile && isChatPageProfileComplete(userProfile)) {
        pageSurveyState.answers.contact = [userProfile.firstName, userProfile.lastName, userProfile.phone, userProfile.email].filter(Boolean).join(' · ');
      }
      latestSurveyPayload = null;
      append("bot", copy.surveyIntro);
      history.push({ role: "bot", text: copy.surveyIntro });
      persistPageSession();
      setBusy(true);
      var typing = append("bot", status && status.getAttribute("data-typing-label") || copy.typing || "...", true);
      window.setTimeout(function () {
        if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
        setBusy(false);
        showPageSurveyQuestion();
        if (input) input.focus();
      }, 520);
    }

    function completePageSurvey() {
      clearPageSurveyOptions();
      var answers = pageSurveyState ? pageSurveyState.answers : {};
      var summaryText = buildChatSurveySummary(copy, answers);
      var payload = buildChatSurveyPayload(copy, answers, "chat-page");
      pageSurveyState = null;
      appendSurveySummary(summaryText, payload);
    }

    function submitLatestSurvey(button) {
      var selectedPayload = chatBriefPayloads.get(button);
      if (!selectedPayload || busy) return;
      var card = button.closest(".chat-page-message-brief");
      var submitStatus = card ? card.querySelector("[data-chat-submit-status]") : null;
      submitChatSurveyPayload(selectedPayload, copy, submitStatus, button)
        .catch(function () {});
    }

    function handlePageSurveyAnswer(message) {
      if (!pageSurveyState || !copy.surveyQuestions || !copy.surveyQuestions.length) return false;
      var current = copy.surveyQuestions[pageSurveyState.step];
      if (!current) return false;

      var validationError = surveyAnswerError(current, message);
      if (validationError) { append('bot', validationError); return true; }
      pageSurveyState.answers[current.id] = message;
      pageSurveyState.step += 1;
      clearPageSurveyOptions();
      setBusy(true);
      var typing = append("bot", status && status.getAttribute("data-typing-label") || copy.typing || "...", true);

      window.setTimeout(function () {
        if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
        if (pageSurveyState && pageSurveyState.step >= copy.surveyQuestions.length) {
          completePageSurvey();
        } else if (pageSurveyState) {
          showPageSurveyQuestion();
        }
        setBusy(false);
        if (input) input.focus();
      }, 560);

      return true;
    }

    function appendPageIntentReply(intent) {
      setBusy(true);
      var typing = append("bot", status && status.getAttribute("data-typing-label") || copy.typing || "...", true);

      window.setTimeout(function () {
        if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
        var reply = chatReplyForIntent(intent, copy, activeChatLanguage());
        append("bot", reply);
        history.push({ role: "bot", text: reply });
        setBusy(false);
        if (input) input.focus();
      }, 420);
    }

    function sendMessage(text, forcedIntent) {
      var message = String(text || "").trim();
      if (!message || busy) return;

      if (profileIntakeActive) return;

      if (!ensurePageCanSend()) return;

      var historySnapshot = pageHistory();
      append("user", message);
      history.push({ role: "user", text: message });
      if (!trackPageUserMessage()) {
        persistPageSession();
        return;
      }
      persistPageSession();

      if (handlePageSurveyAnswer(message)) {
        return;
      }

      var intent = forcedIntent || chatTopicHint(message) || chatIntent(message, activeChatLanguage());

      if (intent === "survey") {
        startPageSurvey();
        return;
      }

      setBusy(true);

      var typing = append("bot", status && status.getAttribute("data-typing-label") || "...", true);
      window.fetch("/api/chat-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          page: window.location.pathname,
          history: historySnapshot,
          language: activeChatLanguage(),
          clientId: chatPageClientId(),
          userProfile: userProfile || null
        })
      })
        .then(function (response) {
          return response.json().then(function (data) {
            if (!response.ok) {
              var error = new Error(data.reply || data.error || "");
              error.reply = data.reply || data.error || "";
              throw error;
            }
            return data;
          });
        })
        .then(function (data) {
          if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
          var reply = data.reply || "Խնդրում ենք հարցը գրել մի փոքր ավելի հստակ։";
          append("bot", reply);
          history.push({ role: "bot", text: reply });
          if (countChatMessagesWords(history) > chatPageWordLimit) {
            resetPageSession(limitCopy.cleared);
            return;
          }
          persistPageSession();
        })
        .catch(function (error) {
          if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
          var failReply = (error && error.reply) || chatReplyForIntent(intent, copy, activeChatLanguage()) || copy.networkError;
          if (error && error.reply && /2 օր|2 day|2 дня/i.test(String(error.reply))) {
            setPageBlocked(failReply, Date.now() + chatPageBlockMs);
            return;
          }
          append("bot", failReply || "Համակարգը ծանրաբեռնված է, խնդրում ենք փորձել 1 րոպեից։");
          persistPageSession();
        })
        .then(function () {
          setBusy(false);
          if (input) input.focus();
        });
    }

    function playPageWelcome() {
      var introEl = messages ? messages.querySelector("[data-chat-page-intro]") : null;
      var greetingName = userProfile && userProfile.firstName
        ? (activeChatLanguage() === "hy" ? ", " + userProfile.firstName : " " + userProfile.firstName)
        : "";
      var introText = translateTemplate(String(copy.pageIntro || copy.greeting || "").trim(), {
        greetingName: greetingName
      });
      if (!introEl || !introText) return;

      function finishWelcome() {
        introEl.textContent = introText;
        history.push({ role: "bot", text: introText });
        persistPageSession();
        setBusy(false);
        if (input) input.focus();
      }

      if (!uiSettings.motion) {
        finishWelcome();
        return;
      }

      introEl.textContent = "";
      setBusy(true);
      var typingEl = append("bot", status && status.getAttribute("data-typing-label") || copy.typing || "...", true);

      window.setTimeout(function () {
        if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);

        var index = 0;
        function typeNext() {
          if (index >= introText.length) {
            history.push({ role: "bot", text: introText });
            persistPageSession();
            setBusy(false);
            if (input) input.focus();
            return;
          }

          var char = introText.charAt(index);
          introEl.textContent += char;
          index += 1;

          var scroll = root.querySelector(".chat-page-scroll");
          if (scroll) scroll.scrollTop = scroll.scrollHeight;

          var delay = char === "\n" ? 320 : (char === " " || char === "…" ? 28 : 20);
          window.setTimeout(typeNext, delay);
        }

        typeNext();
      }, 680);
    }

    if (quick) {
      refreshPageQuickButtons();
    }
    initProfilePanelCopy();
    if (profileForm) {
      profileForm.addEventListener("submit", handleProfileFormSubmit);
    }
    updateUserBadge();
    if (isChatPageProfileComplete(userProfile)) {
      personalizeWelcomeTitle();
    }
    updateProfileUi();

    if (pageSession.blockedUntil > Date.now()) {
      restorePageSession();
      pageBlocked = true;
      root.classList.add("is-blocked");
      if (input) input.disabled = true;
      if (send) send.disabled = true;
    } else if (profileIntakeActive) {
      if (pageSession.messages.length) {
        resetPageSession();
      }
      startProfileIntake();
    } else if (restorePageSession()) {
      var introEl = messages ? messages.querySelector("[data-chat-page-intro]") : null;
      if (introEl) {
        introEl.textContent = "";
      }
    } else {
      playPageWelcome();
    }

    updateLimitFooter();

    root.addEventListener("click", function (event) {
      var button = event.target.closest("[data-chat-page-question], [data-chat-page-intent]");
      if (!button || busy || profileIntakeActive) return;
      var intent = button.getAttribute("data-chat-page-intent") || "";
      if (intent) {
        sendMessage(button.getAttribute("aria-label") || button.textContent || "", intent);
        return;
      }
      if (button.hasAttribute("data-chat-page-question")) {
        sendMessage(button.getAttribute("data-chat-page-question") || button.textContent, "");
      }
    });

    if (messages) {
      messages.addEventListener("click", function (event) {
        var submitButton = event.target.closest("[data-chat-page-submit-request], [data-chat-submit-request]");
        if (!submitButton) return;
        submitLatestSurvey(submitButton);
      });
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var value = input ? input.value : "";
        if (input) input.value = "";
        sendMessage(value);
      });
    }
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

  function loadCmsContent() {
    if (window.location.protocol === "file:" || typeof window.fetch !== "function") {
      return Promise.resolve(false);
    }

    var controller = new AbortController();
    var timeout = window.setTimeout(function () { controller.abort(); }, 10000);
    return window.fetch(cmsApiUrl("/api/content"), {
      cache: "no-store",
      signal: controller.signal,
      credentials: cmsFetchCredentials()
    }).then(function (response) {
      return response.ok ? response.json() : null;
    }).then(function (payload) {
      if (payload && site.cms && typeof site.cms.apply === "function") {
        site.cms.apply(payload);
      }
      return true;
    }).catch(function () {
      return false;
    }).finally(function () { window.clearTimeout(timeout); });
  }

  function bootSite() {
    if (window.location.protocol === "file:") {
      if (!window.location.hash) {
        window.location.hash = "home";
      } else {
        render();
      }
      return;
    }
    render();
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("popstate", render);

  applyCurrentTheme();
  document.getElementById("site-header").innerHTML = site.sections.header();
  setupNavigation();
  setupThemeToggle();
  setupLanguageSwitcher();

  loadCmsContent().finally(bootSite);

  // Make sure PWA button appears if prompt was captured before first render finished
  setupPwaInstallButton();

  // PWA Install button (icon only, next to language switcher in topbar)
  var pwaDeferredPrompt = null;

  function setupPwaInstallButton() {
    var slot = document.querySelector("[data-pwa-install-slot]");
    if (!slot) return;

    // Already installed or no prompt available yet
    if (!pwaDeferredPrompt) {
      slot.hidden = true;
      return;
    }

    // Create beautiful icon-only button if not present
    var btn = slot.querySelector(".pwa-install-btn-header");
    if (!btn) {
      btn = document.createElement("button");
      btn.className = "pwa-install-btn-header";
      btn.setAttribute("aria-label", "Install Smart Tech app");
      btn.setAttribute("title", "Install Smart Tech");
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4v10.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path><path d="m7.8 10 4.2 4.2 4.2-4.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.4 16.8v1.4A1.8 1.8 0 0 0 7.2 20h9.6a1.8 1.8 0 0 0 1.8-1.8v-1.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
      btn.addEventListener("click", function () {
        if (!pwaDeferredPrompt) return;
        pwaDeferredPrompt.prompt();
        pwaDeferredPrompt.userChoice.then(function () {
          slot.hidden = true;
          pwaDeferredPrompt = null;
        });
      });
      slot.appendChild(btn);
    }

    slot.hidden = false;
  }

  function isLocalDevHost() {
    var host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    if (isLocalDevHost()) return;
    e.preventDefault();
    pwaDeferredPrompt = e;
    setupPwaInstallButton(); // show immediately if header already rendered
  });

  // Hide in standalone mode
  if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
    var slot = document.querySelector("[data-pwa-install-slot]");
    if (slot) slot.hidden = true;
  }

  /* ========================================
     Topbar Search
  ======================================== */
  var searchPanel = null;
  var searchIndexBuilt = false;
  var searchIndex = [];
  var searchDelegatedAttached = false;

  function buildSearchIndex() {
    if (searchIndexBuilt) return searchIndex;
    searchIndex = [];

    var nav = site.i18n.get("nav", {});
    var pages = [
      { id: "home", label: nav.home || "Գլխավոր" },
      { id: "services", label: nav.services || "Ծառայություններ" },
      { id: "projects", label: nav.projects || "Նախագծեր" },
      { id: "album", label: nav.projectsAlbum || "???????????? ?????" },
      { id: "chat", label: nav.chat || "\u0041\u0049 \u0585\u0563\u0576\u0561\u056F\u0561\u0576" },
      { id: "request", label: nav.request || "Հայտ" },
      { id: "team", label: nav.team || "Մեր թիմը" },
      { id: "about", label: nav.about || "Մեր մասին" },
      { id: "contact", label: nav.contact || "Կապ" },
      { id: "partners", label: nav.partners || "Հաճախորդներ" }
    ];
    pages.forEach(function (p) {
      searchIndex.push({
        type: "page",
        title: p.label,
        url: site.utils.pageUrl(p.id),
        keywords: (p.label || "").toLowerCase()
      });
    });

    if (site.content && site.content.services) {
      site.content.services.forEach(function (s) {
        searchIndex.push({
          type: "service",
          title: s.title,
          desc: s.lead || "",
          url: site.utils.pageUrl("services"),
          keywords: ((s.title || "") + " " + (s.lead || "")).toLowerCase()
        });
      });
    }

    if (site.content && site.content.projects) {
      site.content.projects.forEach(function (p) {
        searchIndex.push({
          type: "project",
          title: p.title,
          desc: (p.works || []).join(" "),
          url: site.utils.pageUrl("projects"),
          keywords: ((p.title || "") + " " + (p.works || []).join(" ")).toLowerCase()
        });
      });
    }

    if (site.content && site.content.team) {
      site.content.team.forEach(function (t) {
        searchIndex.push({
          type: "team",
          title: t.title || t.name || "",
          desc: t.text || "",
          url: site.utils.pageUrl("team"),
          keywords: ((t.title || "") + " " + (t.text || "")).toLowerCase()
        });
      });
    }

    searchIndexBuilt = true;
    return searchIndex;
  }

  function searchMatches(item, q) {
    if (!q) return false;
    var text = (item.title + " " + (item.desc || "") + " " + (item.keywords || "")).toLowerCase();
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length <= 1) return text.includes(q.toLowerCase());
    return words.every(function (w) {
      return text.includes(w);
    });
  }

  function createSearchPanel() {
    var panel = document.createElement("div");
    panel.className = "site-search";
    panel.innerHTML = `
      <div class="site-search-inner">
        <div class="site-search-input-wrap">
          <input type="text" class="site-search-input" placeholder="${site.i18n.get('common.searchPlaceholder', 'Search services, projects...')}" aria-label="${site.i18n.get('common.searchAria', 'Search')}">
        </div>
        <div class="site-search-results"></div>
      </div>
    `;
    return panel;
  }

  function renderSearchResults(results, container, query) {
    container.innerHTML = "";

    if (!results.length) {
      container.innerHTML = '<div class="site-search-empty">' + site.i18n.get('common.searchNoResults', 'Nothing found') + '</div>';
      return;
    }

    var grouped = {};
    results.forEach(function (item) {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item);
    });

    var typeLabels = {
      page: site.i18n.get('common.searchGroupPages', 'Pages'),
      service: site.i18n.get('common.searchGroupServices', 'Services'),
      project: site.i18n.get('common.searchGroupProjects', 'Projects'),
      team: site.i18n.get('common.searchGroupTeam', 'Team')
    };

    Object.keys(grouped).forEach(function (type) {
      var groupEl = document.createElement("div");
      groupEl.className = "site-search-result-group";

      var title = document.createElement("div");
      title.className = "site-search-result-group-title";
      title.textContent = typeLabels[type] || type;
      groupEl.appendChild(title);

      grouped[type].forEach(function (item) {
        var a = document.createElement("a");
        a.className = "site-search-result-item";
        a.href = item.url;

        a.innerHTML = `
          <div class="site-search-result-title">${item.title}</div>
          ${item.desc ? `<div class="site-search-result-desc">${item.desc}</div>` : ""}
        `;

        a.addEventListener("click", function (e) {
          // Close panel
          if (searchPanel) {
            searchPanel.classList.remove("is-open");
          }
          // Let normal navigation happen
        });

        groupEl.appendChild(a);
      });

      container.appendChild(groupEl);
    });
  }

  function setupSearch() {
    // Ensure panel exists (created once)
    if (!searchPanel) {
      searchPanel = createSearchPanel();
      document.body.appendChild(searchPanel);
    }

    var input = searchPanel.querySelector(".site-search-input");
    var results = searchPanel.querySelector(".site-search-results");

    function closeSearch() {
      if (!searchPanel) return;
      searchPanel.classList.remove("is-open");
      if (input) input.value = "";
      if (results) results.innerHTML = "";
    }

    function openSearch() {
      if (!searchPanel) return;
      searchPanel.classList.add("is-open");
      setTimeout(function () {
        if (input) {
          input.focus();
          try { input.select(); } catch (e) {}
        }
      }, 40);
      buildSearchIndex();
    }

    // Attach delegated listener only once (robust against header re-renders)
    if (!searchDelegatedAttached) {
      searchDelegatedAttached = true;

      // Delegated click for any future [data-search-trigger]
      document.addEventListener("click", function (e) {
        var trigger = e.target.closest("[data-search-trigger]");
        if (!trigger) return;

        e.stopPropagation();
        e.preventDefault();

        if (searchPanel && searchPanel.classList.contains("is-open")) {
          closeSearch();
        } else {
          openSearch();
        }
      }, true);

      // Outside click to close (capture)
      document.addEventListener("click", function (e) {
        if (searchPanel && searchPanel.classList.contains("is-open")) {
          if (!searchPanel.contains(e.target) && !e.target.closest("[data-search-trigger]")) {
            closeSearch();
          }
        }
      }, true);

      // Escape key
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && searchPanel && searchPanel.classList.contains("is-open")) {
          closeSearch();
        }
      });

      // Prevent panel from closing when clicking inside it
      searchPanel.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      // Live search typing
      if (input) {
        input.addEventListener("input", function () {
          var q = (this.value || "").trim();
          if (!q) {
            results.innerHTML = "";
            return;
          }
          var index = buildSearchIndex();
          var filtered = index.filter(function (item) {
            return searchMatches(item, q);
          }).slice(0, 12);
          renderSearchResults(filtered, results, q);
        });
      }
    }
  }
})(window.SmartTech);
