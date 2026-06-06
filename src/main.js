(function (site) {
  var pages = ["home", "services", "projects", "album", "chat", "request", "partners", "team", "about", "contact", "member", "licenses", "help", "faq", "terms", "privacy", "disclaimer"];
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
  var chatSurveyState = null;
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
      id: "profile",
      type: "link",
      route: "team",
      activeRoutes: ["team", "member"],
      labels: { hy: "Պրոֆիլ", en: "Profile", ru: "Профиль" },
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12.2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="M4.8 20.2a7.2 7.2 0 0 1 14.4 0"></path></svg>'
    }
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
          setChatOpen(true);
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
    if (!/^\/img\/admin-album\/[A-Za-z0-9._-]+\.webp$/i.test(image)) {
      return null;
    }
    return {
      id: String(item.id || ""),
      section: item.section === "current" ? "current" : "completed",
      image: image,
      title: String(item.title || "Smart Tech").slice(0, 90),
      caption: String(item.caption || item.title || "Smart Tech").slice(0, 150),
      status: String(item.status || "").slice(0, 70),
      createdAt: String(item.createdAt || "")
    };
  }

  function loadAdminAlbumPhotosIfNeeded() {
    if (currentRoute().page !== "album" || adminAlbumLoading || typeof window.fetch !== "function") return;
    adminAlbumLoading = true;

    window.fetch("/api/album", {
      cache: "no-store",
      credentials: "same-origin"
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
        var opening = !switcher.classList.contains("is-open");
        if (opening) {
          if (typeof closeSiteMenuHandler === "function") {
            closeSiteMenuHandler(false);
          }
          closeAllLanguageSwitchers();
        }
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

      setBusy(true);
      openEmailFallback(payload);
      setTimeout(function () {
        setBusy(false);
      }, 500);
    });
  }

  function setupRevealSlides() {
    var items = document.querySelectorAll(".reveal-slide");
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
        limitReached: "Այս արագ չաթում արդեն օգտագործվել է 10 հարց։ Շարունակելու համար թողեք հեռախոսահամար կամ գրեք info@smarttechllc.am։",
        limitButton: "Ավարտված",
        typing: "գրում է...",
        greeting: "Բարև։ Ես SmartTech-ի արագ օգնականն եմ։ Գրեք ինչ լուծում է պետք՝ տեսահսկում, ցանց, հրդեհային, մուտքի հսկում, էլեկտրամոնտաժ կամ ավտոմատացում։",
        quickIntents: [
          { id: "services", label: "Ծառայություններ" },
          { id: "price", label: "Գների հարց" },
          { id: "timeline", label: "Ժամկետներ" },
          { id: "contact", label: "Կապ մեզ հետ" },
          { id: "survey", label: "Նախագծի բրիֆ" }
        ],
        surveyIntro: "Լավ, հավաքենք կարճ բրիֆ՝ մեր մասնագետը արագ կողմնորոշվի։",
        surveyQuestions: [
          { id: "service", label: "Ծառայություն", question: "Ի՞նչ լուծում է պետք՝ տեսահսկում, ցանց, հրդեհային, մուտքի հսկում, էլեկտրամոնտաժ, թե այլ բան։" },
          { id: "facility", label: "Օբյեկտ", question: "Ի՞նչ օբյեկտ է՝ բնակարան, գրասենյակ, խանութ, հյուրանոց, պահեստ, թե արտադրամաս։" },
          { id: "location", label: "Վայր", question: "Ո՞ր քաղաքում կամ հասցեի մոտ է օբյեկտը։" },
          { id: "size", label: "Ծավալ", question: "Մոտավորապես ինչ չափ է աշխատանքը՝ տարածք, հարկեր կամ սարքերի քանակ։" },
          { id: "timeline", label: "Ժամկետ", question: "Ե՞րբ եք ուզում սկսել կամ ավարտել աշխատանքը։" },
          { id: "contact", label: "Կապ", question: "Ո՞ւմ հետ կապվենք։ Գրեք անուն և հեռախոս կամ էլ. հասցե։" }
        ],
        surveySummary: "Ահա գրանցված մանրամասները:",
        surveyReminder: "Շնորհակալություն։ Տվյալները բավարար են նախնական կապի համար։",
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
        limitReached: "This quick chat has reached the 10-question limit. To continue, leave your phone number or write to info@smarttechllc.am.",
        limitButton: "Done",
        typing: "typing...",
        greeting: "Hi. I am SmartTech's quick assistant. Tell me what you need: CCTV, network, fire alarm, access control, electrical works or automation.",
        quickIntents: [
          { id: "services", label: "Services" },
          { id: "price", label: "Pricing" },
          { id: "timeline", label: "Timeline" },
          { id: "contact", label: "Contact" },
          { id: "survey", label: "Project brief" }
        ],
        surveyIntro: "Great, let's collect a short brief so our specialist can understand the request quickly.",
        surveyQuestions: [
          { id: "service", label: "Service", question: "What solution do you need: CCTV, network, fire alarm, access control, electrical works, automation or something else?" },
          { id: "facility", label: "Object", question: "What type of place is it: apartment, office, shop, hotel, warehouse or production site?" },
          { id: "location", label: "Location", question: "Which city or approximate address is the object in?" },
          { id: "size", label: "Scope", question: "What is the approximate scope: area, floors or number of devices?" },
          { id: "timeline", label: "Timing", question: "When would you like to start or finish the work?" },
          { id: "contact", label: "Contact", question: "Who should we contact? Please share a name and phone or email." }
        ],
        surveySummary: "Here is what we have recorded:",
        surveyReminder: "Thank you. This is enough for an initial follow-up.",
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
        limitReached: "В этом быстром чате уже использовано 10 вопросов. Чтобы продолжить, оставьте телефон или напишите на info@smarttechllc.am.",
        limitButton: "Готово",
        typing: "печатает...",
        greeting: "Здравствуйте. Я быстрый ассистент SmartTech. Напишите, что нужно: видеонаблюдение, сеть, пожарная сигнализация, контроль доступа, электромонтаж или автоматизация.",
        quickIntents: [
          { id: "services", label: "Услуги" },
          { id: "price", label: "Стоимость" },
          { id: "timeline", label: "Сроки" },
          { id: "contact", label: "Контакты" },
          { id: "survey", label: "Бриф проекта" }
        ],
        surveyIntro: "Хорошо, соберем короткий бриф, чтобы специалист быстро понял задачу.",
        surveyQuestions: [
          { id: "service", label: "Услуга", question: "Какое решение нужно: видеонаблюдение, сеть, пожарная сигнализация, контроль доступа, электромонтаж, автоматизация или другое?" },
          { id: "facility", label: "Объект", question: "Какой это объект: квартира, офис, магазин, гостиница, склад или производство?" },
          { id: "location", label: "Локация", question: "В каком городе или примерно по какому адресу находится объект?" },
          { id: "size", label: "Объем", question: "Какой примерный объем: площадь, этажи или количество устройств?" },
          { id: "timeline", label: "Срок", question: "Когда хотите начать или завершить работу?" },
          { id: "contact", label: "Контакт", question: "С кем связаться? Напишите имя и телефон или email." }
        ],
        surveySummary: "Вот детали, которые мы записали:",
        surveyReminder: "Спасибо. Этого достаточно для первичной связи.",
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
      greeting: translateTemplate(base.greeting, vars),
      quickIntents: simpleQuickIntents(activeLanguage),
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
        { id: "services", label: "Ի՞նչ ծառայություններ ունեք" },
        { id: "cctv", label: "Տեսահսկում եմ ուզում" },
        { id: "price", label: "Ինչպե՞ս ստանալ գին" },
        { id: "timeline", label: "Որքա՞ն է տևում" },
        { id: "contact", label: "Կապ մասնագետի հետ" },
        { id: "survey", label: "Լրացնել բրիֆ" }
      ],
      en: [
        { id: "services", label: "What services do you offer?" },
        { id: "cctv", label: "I need CCTV" },
        { id: "price", label: "How to get a price?" },
        { id: "timeline", label: "How long does it take?" },
        { id: "contact", label: "Contact a specialist" },
        { id: "survey", label: "Fill project brief" }
      ],
      ru: [
        { id: "services", label: "Какие услуги есть?" },
        { id: "cctv", label: "Нужно видеонаблюдение" },
        { id: "price", label: "Как получить цену?" },
        { id: "timeline", label: "Сколько длится монтаж?" },
        { id: "contact", label: "Связаться со специалистом" },
        { id: "survey", label: "Заполнить бриф" }
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

    var typingEl;
    if (chatSurveyState.step >= copy.surveyQuestions.length) {
      typingEl = showTyping(copy);
      chatTypingTimer = window.setTimeout(function () {
        if (typingEl && typingEl.parentNode) {
          typingEl.parentNode.removeChild(typingEl);
        }
        completeChatSurvey(copy);
      }, 700);
    } else {
      var nextQuestion = copy.surveyQuestions[chatSurveyState.step].question;
      typingEl = showTyping(copy);
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
  }

  function setChatLimitReached(copy) {
    chatLimitReached = true;
    if (!chatUi) return;
    chatUi.root.classList.add("is-limit-reached");
    chatUi.input.disabled = true;
    chatUi.send.disabled = true;
    chatUi.send.textContent = copy.limitButton || copy.sendLabel;
  }

  function finishChatTurnIfLimited(copy) {
    if (chatUserQuestionCount < chatQuestionLimit || chatLimitReached) return;
    window.setTimeout(function () {
      appendChatMessage("bot", copy.limitReached);
      setChatLimitReached(copy);
    }, 760);
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
      appendChatMessage("bot", chatReplyForIntent(intent, copy, activeChatLanguage()));
    }, 680);
  }

  function handleChatRequest(messageText, intent, copy) {
    if (chatUi && chatUi.root.classList.contains("is-busy")) return;
    if (chatLimitReached || chatUserQuestionCount >= chatQuestionLimit) {
      appendChatMessage("bot", copy.limitReached, { skipHistory: true });
      setChatLimitReached(copy);
      return;
    }

    var historySnapshot = compactChatHistory();
    chatUserQuestionCount += 1;
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
        appendChatMessage("bot", chatReplyForIntent(intent, copy, activeChatLanguage()) || copy.networkError);
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
          '<button class="auto-chat-close" type="button" aria-label="Close chat">&times;</button>' +
        "</header>" +
        '<div class="auto-chat-messages" aria-live="polite"></div>' +
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
      messages: host.querySelector(".auto-chat-messages"),
      quickActions: host.querySelector(".auto-chat-quick-actions"),
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
      chatUserQuestionCount = 0;
      chatLimitReached = false;
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
    if (chatLimitReached) {
      setChatLimitReached(copy);
    }
    setChatDismissed(isChatDismissed());
  }

  function setupChatPage() {
    var root = document.querySelector("[data-chat-page]");
    if (!root) return;

    var messages = root.querySelector("[data-chat-page-messages]");
    var form = root.querySelector("[data-chat-page-form]");
    var input = root.querySelector("[data-chat-page-input]");
    var send = root.querySelector("[data-chat-page-send]");
    var status = root.querySelector("[data-chat-page-status]");
    var quick = root.querySelector("[data-chat-page-quick]");
    var history = [];
    var copy = chatDictionary(activeChatLanguage());
    var pageSurveyState = null;
    var latestSurveyPayload = null;
    var busy = false;

    function append(role, text, typing) {
      var item = document.createElement("div");
      item.className = "chat-page-message chat-page-message-" + role + (typing ? " is-typing" : "");
      if (typing) {
        item.innerHTML = '<span>' + site.utils.escapeHtml(text) + '</span><span class="chat-page-typing-dots"><span></span><span></span><span></span></span>';
      } else {
        item.textContent = text;
      }
      messages.appendChild(item);
      messages.scrollTop = messages.scrollHeight;
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
      if (status) {
        status.textContent = busy ? (status.getAttribute("data-typing-label") || "") : "";
      }
    }

    function refreshPageQuickButtons() {
      if (!quick) return;
      quick.innerHTML = "";
      simpleQuickIntents(activeChatLanguage()).forEach(function (item) {
        var button = document.createElement("button");
        button.className = "chat-page-quick-btn";
        button.type = "button";
        button.setAttribute("data-chat-page-intent", item.id);
        button.textContent = item.label;
        quick.appendChild(button);
      });
    }

    function surveyMailLabel() {
      var lang = activeChatLanguage();
      if (lang === "en") return "Send this request";
      if (lang === "ru") return "Отправить заявку";
      return "Ուղարկել հայտը";
    }

    function surveySubmitLabel() {
      return "Submit request";
    }

    function surveySubmittedLabel(id) {
      var suffix = id ? " #" + String(id).slice(0, 8) : "";
      return "Request submitted" + suffix + ". Our team can follow up by phone or email.";
    }

    function surveySubmitErrorLabel() {
      return "Could not submit the request. Please use the email fallback.";
    }

    function appendSurveySummary(summaryText, payload) {
      var item = document.createElement("div");
      item.className = "chat-page-message chat-page-message-bot chat-page-message-brief";
      var recipient = (site.content.contacts && site.content.contacts.email) || "info@smarttechllc.am";
      item.innerHTML = '<span>' + site.utils.escapeHtml(summaryText) + '</span>' +
        '<span class="chat-page-brief-actions">' +
          '<button class="chat-page-submit-action" type="button" data-chat-page-submit-request>' + site.utils.escapeHtml(surveySubmitLabel()) + '</button>' +
          '<a class="chat-page-mail-action" href="' + site.utils.escapeHtml(site.utils.mailTo(recipient, "Smart Tech project request", summaryText)) + '">' +
            site.utils.escapeHtml(surveyMailLabel()) +
          "</a>" +
        "</span>" +
        '<small class="chat-page-submit-status" data-chat-page-submit-status></small>';
      messages.appendChild(item);
      messages.scrollTop = messages.scrollHeight;
      history.push({ role: "bot", text: summaryText });
      latestSurveyPayload = payload || null;
    }

    function startPageSurvey() {
      pageSurveyState = { step: 0, answers: {} };
      append("bot", copy.surveyIntro);
      history.push({ role: "bot", text: copy.surveyIntro });
      setBusy(true);
      var typing = append("bot", status && status.getAttribute("data-typing-label") || copy.typing || "...", true);
      window.setTimeout(function () {
        if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
        var firstQuestion = copy.surveyQuestions && copy.surveyQuestions[0] ? copy.surveyQuestions[0].question : "";
        if (firstQuestion) {
          append("bot", firstQuestion);
          history.push({ role: "bot", text: firstQuestion });
        }
        setBusy(false);
        if (input) input.focus();
      }, 560);
    }

    function completePageSurvey() {
      var summary = [copy.surveySummary];
      var answers = {};
      (copy.surveyQuestions || []).forEach(function (question) {
        var answer = pageSurveyState.answers[question.id] || "-";
        answers[question.id] = answer;
        summary.push("- " + question.label + ": " + answer);
      });
      summary.push(copy.surveyReminder);
      var summaryText = summary.join("\n");
      var payload = {
        source: "chat",
        language: activeChatLanguage(),
        page: window.location.pathname + window.location.search,
        contact: answers.contact || "",
        answers: answers,
        summary: summaryText
      };
      pageSurveyState = null;
      appendSurveySummary(summaryText, payload);
    }

    function submitLatestSurvey(button) {
      if (!latestSurveyPayload || busy) return;
      var card = button.closest(".chat-page-message-brief");
      var submitStatus = card ? card.querySelector("[data-chat-page-submit-status]") : null;
      button.disabled = true;
      if (submitStatus) submitStatus.textContent = surveySubmitLabel() + "...";

      window.fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(latestSurveyPayload)
      })
        .then(function (response) {
          return response.json().catch(function () {
            return {};
          }).then(function (data) {
            if (!response.ok) {
              throw new Error(data.error || "Submit failed");
            }
            return data;
          });
        })
        .then(function (data) {
          var message = surveySubmittedLabel(data.id);
          if (submitStatus) submitStatus.textContent = message;
          append("bot", message);
          history.push({ role: "bot", text: message });
        })
        .catch(function () {
          button.disabled = false;
          if (submitStatus) submitStatus.textContent = surveySubmitErrorLabel();
        });
    }

    function handlePageSurveyAnswer(message) {
      if (!pageSurveyState || !copy.surveyQuestions || !copy.surveyQuestions.length) return false;
      var current = copy.surveyQuestions[pageSurveyState.step];
      if (!current) return false;

      pageSurveyState.answers[current.id] = message;
      pageSurveyState.step += 1;
      setBusy(true);
      var typing = append("bot", status && status.getAttribute("data-typing-label") || copy.typing || "...", true);

      window.setTimeout(function () {
        if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
        if (pageSurveyState && pageSurveyState.step >= copy.surveyQuestions.length) {
          completePageSurvey();
        } else if (pageSurveyState) {
          var nextQuestion = copy.surveyQuestions[pageSurveyState.step].question;
          append("bot", nextQuestion);
          history.push({ role: "bot", text: nextQuestion });
        }
        setBusy(false);
        if (input) input.focus();
      }, 620);

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

      var historySnapshot = pageHistory();
      append("user", message);
      history.push({ role: "user", text: message });

      if (handlePageSurveyAnswer(message)) {
        return;
      }

      var intent = forcedIntent || chatTopicHint(message) || chatIntent(message, activeChatLanguage());

      if (intent === "survey") {
        startPageSurvey();
        return;
      }

      if (isLocalChatIntent(intent)) {
        appendPageIntentReply(intent);
        return;
      }

      setBusy(true);

      var typing = append("bot", status && status.getAttribute("data-typing-label") || "...", true);
      window.fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          page: window.location.pathname,
          history: historySnapshot
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
        })
        .catch(function (error) {
          if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
          error.reply = chatReplyForIntent(intent, copy, activeChatLanguage()) || copy.networkError;
          append("bot", error.reply || "Համակարգը ծանրաբեռնված է, խնդրում ենք փորձել 1 րոպեից։");
        })
        .then(function () {
          setBusy(false);
          if (input) input.focus();
        });
    }

    if (quick) {
      refreshPageQuickButtons();
      quick.addEventListener("click", function (event) {
        var button = event.target.closest("[data-chat-page-question], [data-chat-page-intent]");
        if (!button) return;
        var intent = button.getAttribute("data-chat-page-intent") || "";
        if (intent === "survey") {
          sendMessage(button.textContent || "Project brief", intent);
          return;
        }
        sendMessage(button.getAttribute("data-chat-page-question") || button.textContent, intent);
      });
    }

    if (messages) {
      messages.addEventListener("click", function (event) {
        var submitButton = event.target.closest("[data-chat-page-submit-request]");
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

    return window.fetch("/api/content", {
      cache: "no-store",
      credentials: "same-origin"
    }).then(function (response) {
      return response.ok ? response.json() : null;
    }).then(function (payload) {
      if (payload && site.cms && typeof site.cms.apply === "function") {
        site.cms.apply(payload);
      }
      return true;
    }).catch(function () {
      return false;
    });
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

  setupEntryLoader();

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

  window.addEventListener("beforeinstallprompt", function (e) {
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
