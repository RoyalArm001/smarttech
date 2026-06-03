(function (site) {
  function businessCopy() {
    var dictionaries = {
      hy: {
        eyebrow: "Բիզնեսի ամբողջական հնարավորություններ",
        title: "Ցույց ենք տալիս ոչ թե մեկ ծառայություն, այլ ամբողջ համակարգային կարողությունը",
        text: "Smart Tech-ը կարող է վերցնել օբյեկտը գաղափարից մինչեւ հանձնում՝ ուսումնասիրություն, նախագծում, սարքավորումների ընտրություն, մոնտաժ, ծրագրավորում, փաստաթղթավորում եւ սպասարկում։",
        request: "Հավաքել նոր նախագծի հայտ",
        audit: "Պատվիրել չափագրում",
        groupsTitle: "Ինչ կարող ենք անել",
        marketsTitle: "Որ օբյեկտների համար",
        brandsTitle: "Ֆիրմաներ եւ տեխնոլոգիաներ",
        flowTitle: "Աշխատանքի փուլերը",
        groups: [
          { title: "Նախագծում եւ խորհրդատվություն", items: ["օբյեկտի ուսումնասիրություն", "չափագրում եւ ռիսկերի գնահատում", "տեխնիկական առաջադրանք", "բյուջեի նախնական հաշվարկ", "սարքավորումների ճիշտ դասավորում"] },
          { title: "Անվտանգության համակարգեր", items: ["տեսահսկում եւ հեռահար դիտում", "alarm անվտանգություն", "հրդեհային ազդարարում", "տարհանման համակարգեր", "մուտքի վերահսկում", "դոմոֆոններ եւ դռների ավտոմատացում"] },
          { title: "IT ցանցեր եւ կապ", items: ["LAN եւ structured cabling", "Wi-Fi ծածկույթ", "rack եւ patch panel", "switch/router/firewall", "VPN եւ հեռահար մուտք", "մոնիթորինգ եւ troubleshooting"] },
          { title: "Էլեկտրամոնտաժ", items: ["մալուխային ուղիներ", "բաշխիչ վահաններ", "լուսավորություն", "սնուցման գծեր", "պաշտպանիչ ավտոմատներ", "UPS եւ պահուստային սնուցում"] },
          { title: "BMS եւ ավտոմատացում", items: ["շենքի կառավարման logic", "սցենարային կառավարում", "HVAC / lighting ինտեգրում", "սենսորներ եւ controller-ներ", "smart control", "մոնիթորինգ dashboard"] },
          { title: "Աուդիո եւ ծանուցում", items: ["public address", "ֆոնային երաժշտություն", "ձայնային ծանուցում", "կոնֆերանսային աուդիո", "միկրոֆոններ եւ zone control", "ձայնի կարգաբերում"] },
          { title: "Մատակարարում եւ տեղադրում", items: ["ֆիրմաների ընտրություն", "սարքավորումների գնում", "մալուխավորում", "մոնտաժ", "ծրագրավորում", "օգտագործման հանձնում"] },
          { title: "Սպասարկում", items: ["պլանային սպասարկում", "անսարքության հայտնաբերում", "վերածրագրավորում", "համակարգերի ընդլայնում", "փաստաթղթավորում", "երաշխիքային աջակցություն"] }
        ],
        markets: ["բնակելի համալիրներ", "բիզնես կենտրոններ", "հյուրանոցներ", "ռեստորաններ եւ սրահներ", "պահեստներ", "արտադրամասեր", "խանութներ", "գրասենյակներ", "կրթական եւ բժշկական տարածքներ"],
        brands: ["ABB", "JUNG", "Huawei", "Eaton", "Schneider Electric", "HDL", "Zennio", "Extron", "Yealink", "BEG", "Yamaha", "Hikvision", "Zyxel", "Gira", "Beckhoff", "Carrier", "Siemens", "Legrand", "Honeywell", "Helvar", "Interra", "Sharp", "WAGO", "OBO Bettermann", "Polycom", "Phoenix Contact", "iRidium mobile", "VOLA", "Ekinex", "Schrack Seconet"],
        flow: [
          { step: "01", title: "Ուսումնասիրություն", text: "Հասկանում ենք տարածքը, խնդիրները, ռիսկերը եւ սպասվող ծանրաբեռնվածությունը։" },
          { step: "02", title: "Նախագիծ", text: "Կազմում ենք լուծման սխեման, սարքերի ցանկը, գոտիները եւ մալուխային ուղիները։" },
          { step: "03", title: "Մոնտաժ", text: "Իրականացնում ենք մաքուր տեղադրում՝ հաշվի առնելով օբյեկտի ռիթմը։" },
          { step: "04", title: "Ծրագրավորում", text: "Կարգաբերում ենք սարքերը, օգտատերերը, ծանուցումները եւ հեռահար հասանելիությունը։" },
          { step: "05", title: "Հանձնում", text: "Թեստավորում ենք, փաստաթղթավորում եւ ապահովում հետագա սպասարկումը։" }
        ]
      },
      en: {
        eyebrow: "Full business capability",
        title: "We show the whole system capability, not only single services",
        text: "Smart Tech can take a facility from idea to delivery: survey, design, equipment selection, installation, programming, documentation and maintenance.",
        request: "Build a new project request",
        audit: "Request measurement",
        groupsTitle: "What we can do",
        marketsTitle: "Facility types",
        brandsTitle: "Brands and technologies",
        flowTitle: "Delivery flow",
        groups: [
          { title: "Design and consulting", items: ["site survey", "measurement and risk review", "technical brief", "initial budgeting", "equipment placement"] },
          { title: "Security systems", items: ["video surveillance", "alarm security", "fire alarm", "evacuation systems", "access control", "intercom and door automation"] },
          { title: "IT networks", items: ["LAN and structured cabling", "Wi-Fi coverage", "rack and patch panels", "switch/router/firewall", "VPN and remote access", "monitoring and troubleshooting"] },
          { title: "Electrical works", items: ["cable routes", "distribution panels", "lighting", "power lines", "protection automats", "UPS and backup power"] },
          { title: "BMS and automation", items: ["building management logic", "scenario control", "HVAC / lighting integration", "sensors and controllers", "smart control", "monitoring dashboard"] },
          { title: "Audio and notification", items: ["public address", "background music", "voice alerts", "conference audio", "microphones and zone control", "sound tuning"] },
          { title: "Supply and installation", items: ["brand selection", "equipment purchase", "cabling", "installation", "programming", "handover"] },
          { title: "Maintenance", items: ["scheduled service", "fault diagnostics", "reprogramming", "system expansion", "documentation", "warranty support"] }
        ],
        markets: ["residential complexes", "business centers", "hotels", "restaurants and showrooms", "warehouses", "production facilities", "stores", "offices", "education and medical spaces"],
        brands: ["ABB", "JUNG", "Huawei", "Eaton", "Schneider Electric", "HDL", "Zennio", "Extron", "Yealink", "BEG", "Yamaha", "Hikvision", "Zyxel", "Gira", "Beckhoff", "Carrier", "Siemens", "Legrand", "Honeywell", "Helvar", "Interra", "Sharp", "WAGO", "OBO Bettermann", "Polycom", "Phoenix Contact", "iRidium mobile", "VOLA", "Ekinex", "Schrack Seconet"],
        flow: [
          { step: "01", title: "Survey", text: "We understand the facility, risks, problems and expected load." },
          { step: "02", title: "Design", text: "We prepare the solution scheme, device list, zones and cable routes." },
          { step: "03", title: "Installation", text: "We deliver clean installation around the facility workflow." },
          { step: "04", title: "Programming", text: "We configure devices, users, alerts and remote access." },
          { step: "05", title: "Handover", text: "We test, document and support future maintenance." }
        ]
      },
      ru: {
        eyebrow: "Полные возможности для бизнеса",
        title: "Показываем всю системную возможность, а не одну услугу",
        text: "Smart Tech может вести объект от идеи до сдачи: обследование, проектирование, подбор оборудования, монтаж, программирование, документация и обслуживание.",
        request: "Собрать новую проектную заявку",
        audit: "Заказать замер",
        groupsTitle: "Что мы можем сделать",
        marketsTitle: "Для каких объектов",
        brandsTitle: "Фирмы и технологии",
        flowTitle: "Этапы работы",
        groups: [
          { title: "Проектирование и консультация", items: ["обследование объекта", "замер и оценка рисков", "техническое задание", "первичный расчет бюджета", "расположение оборудования"] },
          { title: "Системы безопасности", items: ["видеонаблюдение", "alarm безопасность", "пожарная сигнализация", "системы эвакуации", "контроль доступа", "домофоны и автоматизация дверей"] },
          { title: "IT сети и связь", items: ["LAN и structured cabling", "Wi-Fi покрытие", "rack и patch panel", "switch/router/firewall", "VPN и удаленный доступ", "мониторинг и troubleshooting"] },
          { title: "Электромонтаж", items: ["кабельные трассы", "распределительные щиты", "освещение", "линии питания", "защитные автоматы", "UPS и резервное питание"] },
          { title: "BMS и автоматизация", items: ["логика управления зданием", "сценарное управление", "интеграция HVAC / lighting", "сенсоры и контроллеры", "smart control", "monitoring dashboard"] },
          { title: "Аудио и оповещение", items: ["public address", "фоновая музыка", "голосовые оповещения", "конференц-аудио", "микрофоны и zone control", "настройка звука"] },
          { title: "Поставка и монтаж", items: ["выбор брендов", "закупка оборудования", "каблирование", "монтаж", "программирование", "сдача в эксплуатацию"] },
          { title: "Обслуживание", items: ["плановый сервис", "диагностика неисправностей", "перепрограммирование", "расширение систем", "документация", "гарантийная поддержка"] }
        ],
        markets: ["жилые комплексы", "бизнес-центры", "отели", "рестораны и салоны", "склады", "производства", "магазины", "офисы", "образовательные и медицинские пространства"],
        brands: ["ABB", "JUNG", "Huawei", "Eaton", "Schneider Electric", "HDL", "Zennio", "Extron", "Yealink", "BEG", "Yamaha", "Hikvision", "Zyxel", "Gira", "Beckhoff", "Carrier", "Siemens", "Legrand", "Honeywell", "Helvar", "Interra", "Sharp", "WAGO", "OBO Bettermann", "Polycom", "Phoenix Contact", "iRidium mobile", "VOLA", "Ekinex", "Schrack Seconet"],
        flow: [
          { step: "01", title: "Обследование", text: "Понимаем объект, риски, задачи и ожидаемую нагрузку." },
          { step: "02", title: "Проект", text: "Готовим схему решения, список устройств, зоны и кабельные трассы." },
          { step: "03", title: "Монтаж", text: "Выполняем аккуратный монтаж с учетом режима объекта." },
          { step: "04", title: "Настройка", text: "Настраиваем устройства, пользователей, уведомления и удаленный доступ." },
          { step: "05", title: "Сдача", text: "Тестируем, документируем и обеспечиваем дальнейший сервис." }
        ]
      }
    };

    return site.i18n.pickLanguageDictionary(dictionaries);
  }

  function businessShowcase() {
    var e = site.utils.escapeHtml;
    var copy = businessCopy();
    var groups = copy.groups.map(function (group) {
      var items = group.items.map(function (item) {
        return "<li>" + e(item) + "</li>";
      }).join("");

      return "" +
        '<article class="capability-card reveal">' +
          "<h3>" + e(group.title) + "</h3>" +
          "<ul>" + items + "</ul>" +
        "</article>";
    }).join("");

    var markets = copy.markets.map(function (item) {
      return '<span>' + e(item) + '</span>';
    }).join("");

    var brands = copy.brands.map(function (item) {
      return '<span class="notranslate" translate="no">' + e(item) + '</span>';
    }).join("");

    var flow = copy.flow.map(function (item) {
      return "" +
        '<article class="business-flow-card reveal">' +
          "<span>" + e(item.step) + "</span>" +
          "<strong>" + e(item.title) + "</strong>" +
          "<p>" + e(item.text) + "</p>" +
        "</article>";
    }).join("");

    return "" +
      '<section class="section services-business-section">' +
        '<div class="container">' +
          '<div class="services-business-hero reveal">' +
            '<span class="eyebrow">' + e(copy.eyebrow) + "</span>" +
            "<h2>" + e(copy.title) + "</h2>" +
            "<p>" + e(copy.text) + "</p>" +
            '<div class="button-row">' +
              '<a class="button button-primary" href="' + e(site.utils.pageUrl("request")) + '">' + e(copy.request) + "</a>" +
              '<a class="button" href="' + e(site.utils.pageUrl("request")) + '">' + e(copy.audit) + "</a>" +
            "</div>" +
          "</div>" +
          '<div class="business-block reveal">' +
            "<h2>" + e(copy.groupsTitle) + "</h2>" +
            '<div class="capability-grid">' + groups + "</div>" +
          "</div>" +
          '<div class="business-split">' +
            '<div class="business-block reveal">' +
              "<h2>" + e(copy.marketsTitle) + "</h2>" +
              '<div class="business-chip-grid">' + markets + "</div>" +
            "</div>" +
            '<div class="business-block reveal">' +
              "<h2>" + e(copy.brandsTitle) + "</h2>" +
              '<div class="business-brand-cloud">' + brands + "</div>" +
            "</div>" +
          "</div>" +
          '<div class="business-block reveal">' +
            "<h2>" + e(copy.flowTitle) + "</h2>" +
            '<div class="business-flow">' + flow + "</div>" +
          "</div>" +
        "</div>" +
      "</section>";
  }

  function serviceGroups(language) {
    var dictionaries = {
      hy: [
        {
          title: "Հիմնական համակարգային ծառայություններ",
          badge: "Հիմնական",
          text: "Անվտանգություն, էլեկտրամոնտաժ, ցանցեր և ավտոմատացում՝ օբյեկտի առօրյա աշխատանքի համար։",
          ids: ["video-surveillance", "fire-security", "networks", "electrical", "automation", "audio-systems"]
        },
        {
          title: "Իրականացման փուլային ծառայություններ",
          badge: "Փուլային",
          text: "Այս ծառայությունները ապահովում են ամբողջ ցիկլը՝ նախագծումից մինչև գործարկում։",
          ids: ["systems-design", "full-design", "equipment-supply", "installation", "automation-cabinets", "commissioning-programming", "interfaces"]
        },
        {
          title: "Լրացուցիչ ուղղություններ",
          badge: "Լրացուցիչ",
          text: "Սպասարկման և նիշային արտադրական ծառայություններ հատուկ պահանջների համար։",
          ids: ["wacker", "powder-coating"]
        }
      ],
      en: [
        {
          title: "Core engineering services",
          badge: "Core",
          text: "Security, electrical, network and automation systems for stable daily facility operations.",
          ids: ["video-surveillance", "fire-security", "networks", "electrical", "automation", "audio-systems"]
        },
        {
          title: "Delivery-stage services",
          badge: "Delivery",
          text: "These services complete the full cycle from design and supply to commissioning.",
          ids: ["systems-design", "full-design", "equipment-supply", "installation", "automation-cabinets", "commissioning-programming", "interfaces"]
        },
        {
          title: "Additional directions",
          badge: "Additional",
          text: "Specialized support and production-related services for specific requests.",
          ids: ["wacker", "powder-coating"]
        }
      ],
      ru: [
        {
          title: "Ключевые инженерные услуги",
          badge: "Основное",
          text: "Системы безопасности, электромонтаж, сети и автоматизация для стабильной ежедневной работы объекта.",
          ids: ["video-surveillance", "fire-security", "networks", "electrical", "automation", "audio-systems"]
        },
        {
          title: "Услуги по этапам реализации",
          badge: "Этапы",
          text: "Эти услуги закрывают полный цикл: от проектирования и поставки до пусконаладки.",
          ids: ["systems-design", "full-design", "equipment-supply", "installation", "automation-cabinets", "commissioning-programming", "interfaces"]
        },
        {
          title: "Дополнительные направления",
          badge: "Дополнительно",
          text: "Нишевые сервисные и производственные работы под отдельные задачи.",
          ids: ["wacker", "powder-coating"]
        }
      ]
    };
    return site.i18n.pickLanguageDictionary(dictionaries, language);
  }

  site.sections.services = function services() {
    var e = site.utils.escapeHtml;
    var language = site.i18n.language || "hy";
    var groups = serviceGroups(language);
    var serviceById = {};
    site.content.services.forEach(function (service) {
      serviceById[service.id] = service;
    });

    var groupedCards = groups.map(function (group) {
      var cards = group.ids.map(function (id) {
        var service = serviceById[id];
        if (!service) return "";
        var text = site.i18n.service(service);
        var tags = (text.tags || []).slice(0, 3).map(function (tag) {
          return '<span>' + e(tag) + '</span>';
        }).join("");

        return '' +
          '<a class="service-card reveal" id="service-' + e(service.id) + '" href="' + e(site.utils.pageUrl("service", service.id)) + '">' +
            '<img src="' + e(service.image) + '" alt="' + e(text.title) + '" loading="lazy">' +
            '<div class="service-card-body">' +
              '<span class="service-group-badge">' + e(group.badge || group.title) + '</span>' +
              '<h3>' + e(text.title) + '</h3>' +
              '<p>' + e(text.lead) + '</p>' +
              '<div class="tag-row">' + tags + '</div>' +
              '<strong class="card-more">' + e(site.i18n.get("common.learnMore")) + '</strong>' +
            '</div>' +
          '</a>';
      }).join("");

      if (!cards) return "";
      return '' +
        '<section class="services-group-block">' +
          '<div class="services-group-head reveal">' +
            '<h2>' + e(group.title) + '</h2>' +
            '<p>' + e(group.text) + '</p>' +
          '</div>' +
          '<div class="services-grid">' + cards + '</div>' +
        '</section>';
    }).join("");

    return '' +
      site.sections.pageHero({
        eyebrow: site.i18n.get("servicesPage.eyebrow"),
        eyebrowKey: "servicesPage.eyebrow",
        title: site.i18n.get("servicesPage.title"),
        titleKey: "servicesPage.title",
        text: site.i18n.get("servicesPage.text"),
        textKey: "servicesPage.text",
        action: site.i18n.get("common.requestSurvey", site.i18n.get("common.proposal")),
        actionKey: "common.requestSurvey",
        href: site.utils.pageUrl("request"),
        image: site.content.services[2] ? site.content.services[2].image : site.content.services[0].image,
        tone: "services"
      }) +
      '<section id="services-content" class="section services-section">' +
        '<div class="container">' +
          '<div class="services-groups">' + groupedCards + '</div>' +
        '</div>' +
      '</section>' +
      businessShowcase();
  };
})(window.SmartTech);
