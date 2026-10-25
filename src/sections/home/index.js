(function (site) {
  site.sections.home = function home() {
    var e = site.utils.escapeHtml;

    var departmentLabels = site.i18n.pickLanguageDictionary({
      hy: {
        IT: "IT և ցանցեր",
        Security: "Անվտանգություն",
        Technical: "Տեխնիկական համակարգեր",
        ProjectManagement: "Նախագծերի ղեկավարում",
        Automation: "Ավտոմատացում",
        BMS: "BMS նախագծում",
        Electrical: "Էլեկտրամոնտաժ",
        Audio: "Աուդիո համակարգեր",
        Management: "Ղեկավարում"
      },
      en: {
        IT: "IT and networks",
        Security: "Security systems",
        Technical: "Technical systems",
        ProjectManagement: "Project management",
        Automation: "Automation",
        BMS: "BMS design",
        Electrical: "Electrical works",
        Audio: "Audio systems",
        Management: "Management"
      },
      ru: {
        IT: "IT и сети",
        Security: "Системы безопасности",
        Technical: "Технические системы",
        ProjectManagement: "Управление проектами",
        Automation: "Автоматизация",
        BMS: "Проектирование BMS",
        Electrical: "Электромонтаж",
        Audio: "Аудиосистемы",
        Management: "Управление"
      }
    });

    var featuredServices = (site.content.services || []).filter(function (s) { return s.id !== "full-design"; });


    var mobileHomeFeaturedCount = 3;

    var homeServicePostCopy = site.i18n.pickLanguageDictionary({
      hy: {
        "systems-design": {
          lead: "Նախագիծ և հաշվարկ՝ սարքավորման ճիշտ ընտրությամբ։",
          benefits: ["Նախագիծ", "Հաշվարկ"]
        },
        "equipment-supply": {
          lead: "Սարքավորումների ընտրություն և մատակարարում՝ ճիշտ ժամկետով։",
          benefits: ["Ընտրություն", "Մատակարարում"]
        },
        installation: {
          lead: "Մաքուր տեղադրում, փորձարկում և պատրաստ համակարգ։",
          benefits: ["Տեղադրում", "Փորձարկում"]
        },
        "automation-cabinets": {
          lead: "Պահարանների հավաքում և նախնական կարգավորում՝ ըստ նախագծի։",
          benefits: ["Հավաքում", "Կարգաբերում"]
        },
        "commissioning-programming": {
          lead: "Ծրագրավորում, գործարկում և համակարգի կայուն հանձնում։",
          benefits: ["Ծրագրավորում", "Գործարկում"]
        },
        interfaces: {
          lead: "Պարզ կառավարման էկրաններ՝ մոնիթորինգի և արագ արձագանքի համար։",
          benefits: ["Dashboard", "Մոնիթորինգ"]
        },
        "video-surveillance": {
          lead: "Տեսախցիկներ, արխիվ և հեռահար դիտում՝ հստակ տեսադաշտով։",
          benefits: ["Տեսադաշտ", "Արխիվ"]
        },
        "fire-security": {
          lead: "Հրդեհային ազդարարում և անվտանգ սցենարներ՝ ըստ օբյեկտի։",
          benefits: ["Ազդարարում", "Անվտանգություն"]
        },
        networks: {
          lead: "Կայուն LAN, Wi-Fi և rack լուծումներ՝ ընդլայնման պաշարով։",
          benefits: ["LAN/Wi-Fi", "Rack"]
        },
        electrical: {
          lead: "Էլեկտրական գծեր, վահաններ և սնուցում՝ մաքուր կատարումով։",
          benefits: ["Վահաններ", "Սնուցում"]
        },
        automation: {
          lead: "Smart/BMS կառավարում՝ լույսի, կլիմայի և մուտքի համար։",
          benefits: ["BMS", "Smart"]
        },
        "engineering-monitoring": {
          lead: "24/7 մոնիթորինգ և ահազանգեր՝ SMS, email կամ Telegram-ով։",
          benefits: ["24/7", "Ահազանգ"]
        },
        "full-design": {
          lead: "Ամբողջական նախագիծ՝ սարքերի դասավորությամբ և հաշվարկներով։",
          benefits: ["Լուծում", "Հաշվարկ"]
        },
        "audio-systems": {
          lead: "PA, ֆոնային և կոնֆերանսային աուդիո՝ ճիշտ ձայնով։",
          benefits: ["PA", "Կարգաբերում"]
        },
        "powder-coating": {
          lead: "Մետաղական դետալների պաշտպանիչ և մաքուր փոշեներկում։",
          benefits: ["Ծածկույթ", "Որակ"]
        }
      },
      en: {
        "systems-design": {
          lead: "Design and calculation with the right equipment selection.",
          benefits: ["Design", "Calculation"]
        },
        "equipment-supply": {
          lead: "Equipment selection and supply with clear timing.",
          benefits: ["Selection", "Supply"]
        },
        installation: {
          lead: "Clean installation, testing and a ready-to-use system.",
          benefits: ["Install", "Testing"]
        },
        "automation-cabinets": {
          lead: "Control cabinet assembly and pre-setup by project.",
          benefits: ["Assembly", "Setup"]
        },
        "commissioning-programming": {
          lead: "Programming, commissioning and stable system handover.",
          benefits: ["Programming", "Launch"]
        },
        interfaces: {
          lead: "Clear control screens for monitoring and quick response.",
          benefits: ["Dashboard", "Monitoring"]
        },
        "video-surveillance": {
          lead: "Cameras, archive and remote viewing with clear coverage.",
          benefits: ["Coverage", "Archive"]
        },
        "fire-security": {
          lead: "Fire alarm and safety scenarios tailored to the site.",
          benefits: ["Alarm", "Safety"]
        },
        networks: {
          lead: "Stable LAN, Wi-Fi and rack solutions with room to scale.",
          benefits: ["LAN/Wi-Fi", "Rack"]
        },
        electrical: {
          lead: "Electrical lines, panels and power supply with clean execution.",
          benefits: ["Panels", "Power"]
        },
        automation: {
          lead: "Smart/BMS control for light, climate and access.",
          benefits: ["BMS", "Smart"]
        },
        "engineering-monitoring": {
          lead: "24/7 monitoring and alerts by SMS, email or Telegram.",
          benefits: ["24/7", "Alerts"]
        },
        "full-design": {
          lead: "Complete design with device layout and calculations.",
          benefits: ["Solution", "Calculation"]
        },
        "audio-systems": {
          lead: "PA, background and conference audio with tuned sound.",
          benefits: ["PA", "Tuning"]
        },
        "powder-coating": {
          lead: "Protective powder coating for clean metal details.",
          benefits: ["Coating", "Quality"]
        }
      },
      ru: {
        "systems-design": {
          lead: "Проект и расчет с точным подбором оборудования.",
          benefits: ["Проект", "Расчет"]
        },
        "equipment-supply": {
          lead: "Подбор и поставка оборудования с понятными сроками.",
          benefits: ["Подбор", "Поставка"]
        },
        installation: {
          lead: "Аккуратный монтаж, тестирование и готовая система.",
          benefits: ["Монтаж", "Тестирование"]
        },
        "automation-cabinets": {
          lead: "Сборка шкафов и предварительная настройка по проекту.",
          benefits: ["Сборка", "Настройка"]
        },
        "commissioning-programming": {
          lead: "Программирование, запуск и стабильная сдача системы.",
          benefits: ["Программирование", "Запуск"]
        },
        interfaces: {
          lead: "Понятные экраны управления для мониторинга и реакции.",
          benefits: ["Dashboard", "Мониторинг"]
        },
        "video-surveillance": {
          lead: "Камеры, архив и удаленный просмотр с четким обзором.",
          benefits: ["Обзор", "Архив"]
        },
        "fire-security": {
          lead: "Пожарная сигнализация и сценарии безопасности под объект.",
          benefits: ["Сигнал", "Безопасность"]
        },
        networks: {
          lead: "Стабильные LAN, Wi-Fi и rack-решения с запасом роста.",
          benefits: ["LAN/Wi-Fi", "Rack"]
        },
        electrical: {
          lead: "Электролинии, щиты и питание с аккуратным исполнением.",
          benefits: ["Щиты", "Питание"]
        },
        automation: {
          lead: "Smart/BMS управление светом, климатом и доступом.",
          benefits: ["BMS", "Smart"]
        },
        "engineering-monitoring": {
          lead: "Мониторинг 24/7 и оповещения через SMS, email или Telegram.",
          benefits: ["24/7", "Оповещения"]
        },
        "full-design": {
          lead: "Полный проект с расстановкой оборудования и расчетами.",
          benefits: ["Решение", "Расчет"]
        },
        "audio-systems": {
          lead: "PA, фоновое и конференц-аудио с точной настройкой.",
          benefits: ["PA", "Настройка"]
        },
        "powder-coating": {
          lead: "Защитная порошковая покраска металлических деталей.",
          benefits: ["Покрытие", "Качество"]
        }
      }
    });

    function serviceImageAttrs(options) {
      return site.utils.imageLoadingAttrs(options || { loading: "lazy" });
    }

    function concisePostLead(value, maxLength) {
      var text = String(value || "").replace(/\s+/g, " ").trim();
      var limit = maxLength || 118;
      if (text.length <= limit) return text;
      var slice = text.slice(0, limit);
      var sentenceEnd = Math.max(slice.lastIndexOf("։"), slice.lastIndexOf("."));
      if (sentenceEnd > 54) return slice.slice(0, sentenceEnd + 1);
      var wordEnd = slice.lastIndexOf(" ");
      if (wordEnd > 54) slice = slice.slice(0, wordEnd);
      return slice.replace(/[,:;.\u0589-]+$/g, "") + "...";
    }

    function compactPostBenefits(value, fallback) {
      var source = Array.isArray(value) && value.length ? value : fallback;
      return (Array.isArray(source) ? source : []).filter(Boolean).slice(0, 2);
    }

    function serviceHomePostCopy(service, text, layout) {
      var copy = homeServicePostCopy[service.id] || {};
      var lead = copy.lead || text.homeLead || service.homeLead || concisePostLead(text.lead, layout === "vertical" ? 76 : 82);
      var benefits = compactPostBenefits(copy.benefits, text.homeBenefits || service.homeBenefits || text.tags || service.tags || []);

      return {
        lead: String(lead || "").replace(/\s+/g, " ").trim(),
        benefits: benefits
      };
    }

    var categoryOrder = ["security", "engineering", "networks", "electrical"];
    var serviceCategories = {
      "video-surveillance": "security",
      "fire-security": "security",
      "engineering-monitoring": "security",
      "systems-design": "engineering",
      automation: "engineering",
      "automation-cabinets": "engineering",
      "commissioning-programming": "engineering",
      interfaces: "engineering",
      networks: "networks",
      "equipment-supply": "networks",
      electrical: "electrical",
      installation: "electrical",
      "audio-systems": "electrical",
      "powder-coating": "electrical"
    };

    var filterCategories = {
      hy: [
        { key: "all", label: "Բոլորը" },
        { key: "security", label: "Անվտանգություն" },
        { key: "engineering", label: "Նախագծում և BMS" },
        { key: "networks", label: "Ցանցեր և IT" },
        { key: "electrical", label: "Էլեկտրամոնտաժ" }
      ],
      en: [
        { key: "all", label: "All" },
        { key: "security", label: "Security" },
        { key: "engineering", label: "Design and BMS" },
        { key: "networks", label: "Networks and IT" },
        { key: "electrical", label: "Electrical" }
      ],
      ru: [
        { key: "all", label: "Все" },
        { key: "security", label: "Безопасность" },
        { key: "engineering", label: "Проект и BMS" },
        { key: "networks", label: "Сети и IT" },
        { key: "electrical", label: "Электромонтаж" }
      ]
    };

    var currentCategories = filterCategories[site.i18n.language] || filterCategories.hy;
    var filterBarHtml = '<div class="home-services-filter-bar" role="tablist" aria-label="Services filter">' +
      currentCategories.map(function (cat) {
        return '<button type="button" class="home-services-filter-btn' + (cat.key === "all" ? " is-active" : "") + '" data-filter="' + e(cat.key) + '">' + e(cat.label) + '</button>';
      }).join("") +
    '</div>';

    var sortedServices = featuredServices.slice().sort(function (a, b) {
      var catA = serviceCategories[a.id] || "engineering";
      var catB = serviceCategories[b.id] || "engineering";
      var diff = categoryOrder.indexOf(catA) - categoryOrder.indexOf(catB);
      if (diff !== 0) return diff;
      var keys = Object.keys(serviceCategories);
      return keys.indexOf(a.id) - keys.indexOf(b.id);
    });

    var modernCardsHtml = sortedServices.map(function (service, index) {
      var text = site.i18n.service(service);
      var postCopy = serviceHomePostCopy(service, text, "grid");
      var catKey = serviceCategories[service.id] || "engineering";
      var catObj = currentCategories.find(function (c) { return c.key === catKey; });
      var catLabel = catObj && catObj.key !== "all" ? catObj.label : "";

      return "" +
        '<article class="home-service-card reveal" data-service-id="' + e(service.id) + '" data-category="' + e(catKey) + '">' +
          '<a class="home-service-card-inner" href="' + e(site.utils.pageUrl("service", service.id)) + '">' +
            '<div class="home-service-media-wrap">' +
              '<img src="' + e(service.image) + '" alt="' + e(text.title) + '" loading="' + (index < 3 ? "eager" : "lazy") + '" width="600" height="380" decoding="async">' +
              '<div class="home-service-media-overlay"></div>' +
              (catLabel ? '<span class="home-service-cat-badge">' + e(catLabel) + '</span>' : '') +
            '</div>' +
            '<div class="home-service-card-body">' +
              '<h3 class="home-service-card-title">' + e(text.title) + '</h3>' +
              '<p class="home-service-card-lead">' + e(postCopy.lead) + '</p>' +
              '<div class="home-service-card-bottom">' +
                '<span class="home-service-card-cta" aria-hidden="true">' +
                  '<span>' + e(site.i18n.get("common.learnMore", "Տեսնել ավելին")) + '</span>' +
                  '<span class="home-service-card-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
                '</span>' +
              '</div>' +
            '</div>' +
          '</a>' +
        '</article>';
    }).join("");

    var allServicesOnHome = "" +
      filterBarHtml +
      '<div class="home-services-modern-grid">' + modernCardsHtml + '</div>';

    if (!site._homeFilterBound && typeof document !== "undefined") {
      site._homeFilterBound = true;
      document.addEventListener("click", function (event) {
        var btn = event.target.closest(".home-services-filter-btn");
        if (!btn) return;
        var filter = btn.getAttribute("data-filter");
        var bar = btn.closest(".home-services-filter-bar");
        if (bar) {
          bar.querySelectorAll(".home-services-filter-btn").forEach(function (b) {
            b.classList.remove("is-active");
          });
          btn.classList.add("is-active");
        }
        var grid = document.querySelector(".home-services-modern-grid");
        if (grid) {
          grid.querySelectorAll(".home-service-card").forEach(function (card) {
            var cat = card.getAttribute("data-category");
            if (filter === "all" || cat === filter) {
              card.classList.remove("is-hidden");
            } else {
              card.classList.add("is-hidden");
            }
          });
        }
      });
    }

    var homeProjects = site.content.projects.map(function (project) {
      var text = site.i18n.project(project);
      var statusLabels = project.statusLabels || {};
      var statusText = statusLabels[site.i18n.language] || statusLabels.en || statusLabels.hy || "";
      var stageBadge = site.projectBadgeStage ? site.projectBadgeStage(project, site.i18n.language) : (site.projectStages ? site.projectStages.badgeStage(project, site.i18n.language) : "");
      var badgeText = (project.status === "current" && stageBadge) ? stageBadge : statusText;
      var stageNote = site.projectStages ? site.projectStages.label(project, site.i18n.language) : "";
      var showPhaseNote = stageNote && stageNote !== badgeText;
      var works = (text.works || project.works || []).slice(0, 3).map(function (work) {
        return "<li>" + e(work) + "</li>";
      }).join("");
      return "" +
        '<a class="home-bottom-project-card reveal" href="' + e(site.utils.pageUrl("project", project.id)) + '">' +
          '<span class="project-status-badge is-' + e(project.status || "completed") + '">' + e(badgeText) + "</span>" +
          '<span class="home-bottom-project-image">' +
            '<img src="' + e(project.images[0]) + '" alt="' + e(text.title) + '" ' + serviceImageAttrs({ loading: "lazy", fetchpriority: "low", width: 480, height: 300 }) + ' onerror="this.style.opacity=0;this.parentElement.classList.add(\'is-broken\');">' +
          "</span>" +
          '<span class="home-bottom-project-copy">' +
            "<strong>" + e(text.title) + "</strong>" +
            (showPhaseNote ? '<span class="project-phase-note">' + e(stageNote) + '</span>' : '') +
            '<ul>' + works + "</ul>" +
          "</span>" +
        "</a>";
    }).join("");

    var featuredBrandNames = ["Hikvision", "Huawei", "Schneider Electric", "Siemens", "Honeywell", "Eaton"];
    var homeTechPartners = featuredBrandNames.map(function (name) {
      return (site.content.technologyPartners || []).find(function (partner) {
        return partner.name === name;
      });
    }).filter(Boolean);
    if (!homeTechPartners.length) {
      homeTechPartners = (site.content.technologyPartners || []).slice(0, 6);
    }

    var marqueePartners = (site.content.technologyPartners || []).length
      ? site.content.technologyPartners
      : homeTechPartners;

    function homePartnerLogoMarkup(partner) {
      return "" +
        '<a class="home-partner-logo" href="' + e(site.utils.pageUrl("partners")) + '" aria-label="' + e(partner.name) + '">' +
          '<img src="' + e(partner.logo) + '" alt="' + e(partner.name) + '" loading="lazy" decoding="async">' +
        "</a>";
    }

    var homeTechLogos = marqueePartners.map(homePartnerLogoMarkup).join("");
    var homeTechLogosLoop = homeTechLogos;

    var homeClientsSection = homeTechLogos ? "" +
      '<section class="section home-partners-strip" id="partners">' +
        '<div class="container">' +
          '<div class="section-head compact-head">' +
            "<div>" +
              '<span class="eyebrow">' + e(site.i18n.get("home.servedClientsEyebrow", "Սարքավորումների բրենդներ")) + "</span>" +
              '<h2 class="section-title">' + e(site.i18n.get("home.servedClientsTitle", "Բրենդներ, որոնց հետ աշխատում ենք")) + "</h2>" +
              '<p class="section-copy">' + e(site.i18n.get("home.servedClientsText", "Մեր նախագծերում կիրառված արտադրողներ՝ տեսահսկում, անվտանգություն, BMS, ցանց և աուդիո լուծումների համար։")) + "</p>" +
            "</div>" +
            '<a class="button" href="' + e(site.utils.pageUrl("partners")) + '">' + e(site.i18n.get("home.servedClientsButton", "Տեսնել բոլորը")) + "</a>" +
          "</div>" +
        "</div>" +
        '<div class="home-partner-marquee" data-home-partner-marquee>' +
          '<div class="home-partner-marquee-track">' +
            '<div class="home-partner-marquee-group">' + homeTechLogos + "</div>" +
            '<div class="home-partner-marquee-group" aria-hidden="true">' + homeTechLogosLoop + "</div>" +
          "</div>" +
        "</div>" +
      "</section>" : "";

    var certificateDocuments = site.i18n.get("home.featuredLicenses", site.content.company.licenseDocuments || []);
    var featuredCertificates = certificateDocuments.slice(0, 3);
    var certificateCards = featuredCertificates.map(function (item) {
      return "" +
        '<a class="home-certificate-card home-certificate-card-featured reveal" href="' + e(item.image) + '" data-license-viewer data-license-title="' + e(item.title) + '">' +
          '<img src="' + e(item.thumb || item.image) + '" alt="' + e(item.alt || item.title) + '" loading="lazy" decoding="async">' +
          '<span>' + e(item.title) + '</span>' +
        "</a>";
    }).join("");

    var director = (site.content.team || []).find(function (member) {
      return member.id === "director";
    }) || (site.content.team || [])[0];
    function teamRoleRank(member) {
      var ranks = { manager: 0, lead: 1, specialist: 2 };
      return ranks[member.roleLevel] === undefined ? 3 : ranks[member.roleLevel];
    }
    function sortTeamMembers(a, b) {
      var orderA = Number(a.order);
      var orderB = Number(b.order);
      if (!isNaN(orderA) || !isNaN(orderB)) {
        return (isNaN(orderA) ? 999 : orderA) - (isNaN(orderB) ? 999 : orderB);
      }
      return teamRoleRank(a) - teamRoleRank(b);
    }
    function isManager(member) {
      return member && member.id !== "director" && (member.roleLevel === "manager" || member.roleLevel === "lead");
    }
    var specialists = (site.content.team || []).filter(function (member) {
      return !director || member.id !== director.id;
    }).sort(sortTeamMembers);

    function renderHomeTeamCard(member, extraClass, showText) {
      var localized = site.i18n.teamMember(member);
      var title = localized.cardTitle || localized.title || member.title;
      var text = localized.text || member.text;
      var department = departmentLabels[member.department] || localized.department || site.i18n.teamDepartment(member.department);

      return "" +
        '<a class="home-team-card ' + e(extraClass || "") + ' reveal" href="' + e(site.utils.pageUrl("member", member.id)) + '" style="--team-color: ' + e(member.color) + '">' +
          '<span class="home-team-photo">' +
            '<img src="' + e(member.image) + '" alt="' + e(title) + '" loading="lazy">' +
            '<small>' + e(member.accent) + "</small>" +
          "</span>" +
          '<span class="home-team-copy">' +
            '<span class="home-team-department">' + e(department) + "</span>" +
            "<strong>" + e(title) + "</strong>" +
            (showText ? "<em>" + e(text) + "</em>" : "") +
          "</span>" +
        "</a>";
    }

    var directorCard = director ? renderHomeTeamCard(director, "home-team-director", true) : "";
    var featuredTeamMembers = specialists.filter(isManager).slice(0, 3);
    if (featuredTeamMembers.length < 3) {
      specialists.forEach(function (member) {
        var alreadyFeatured = featuredTeamMembers.some(function (featuredMember) {
          return featuredMember.id === member.id;
        });
        if (!alreadyFeatured && featuredTeamMembers.length < 3) {
          featuredTeamMembers.push(member);
        }
      });
    }
    var teamPreviewCards = featuredTeamMembers.map(function (member) {
      return renderHomeTeamCard(member, "home-team-preview-card", false);
    }).join("");

    return "" +
      '<section class="section home-overview" id="services">' +
        '<div class="container">' +
          '<div class="section-head compact-head home-overview-head reveal">' +
            "<div>" +
              '<span class="eyebrow">' + e(site.i18n.get("home.servicesEyebrow")) + "</span>" +
              '<h2 class="section-title">' + e(site.i18n.get("home.servicesTitle")) + "</h2>" +
              '<p class="section-copy">' + e(site.i18n.get("home.servicesText")) + "</p>" +
            "</div>" +
            '<a class="button button-primary" href="' + e(site.utils.pageUrl("services")) + '" data-i18n-key="common.viewServices">' + e(site.i18n.get("common.viewServices")) + "</a>" +
          "</div>" +
          allServicesOnHome +
        "</div>" +
      "</section>" +
      homeClientsSection +
      '<section class="home-contact-cta" id="contact">' +
        '<div class="container home-contact-inner reveal">' +
          "<div>" +
            "<h2>" + e(site.i18n.get("home.contactTitle")) + "</h2>" +
            "<p>" + e(site.i18n.get("home.contactText")) + "</p>" +
          "</div>" +
          '<a class="button button-primary" href="' + e(site.utils.pageUrl("request")) + '">' + e(site.i18n.get("common.requestSurvey", site.i18n.get("common.proposal", site.i18n.get("common.consultation")))) + "</a>" +
        "</div>" +
      "</section>" +
      '<section class="section home-projects-showcase" id="projects">' +
        '<div class="container">' +
          '<div class="section-head compact-head">' +
            "<div>" +
              '<span class="eyebrow">' + e(site.i18n.get("home.projectsEyebrow")) + "</span>" +
              '<h2 class="section-title">' + e(site.i18n.get("home.projectsTitle")) + "</h2>" +
            "</div>" +
            '<a class="button" href="' + e(site.utils.pageUrl("projects")) + '">' + e(site.i18n.get("common.viewProjects")) + "</a>" +
          "</div>" +
          '<div class="home-bottom-project-grid">' + homeProjects + "</div>" +
        "</div>" +
      "</section>" +
      '<section class="section home-certificates-section">' +
        '<div class="container">' +
          '<div class="section-head compact-head">' +
            "<div>" +
              '<span class="eyebrow">' + e(site.i18n.get("home.licensesEyebrow", "Licenses")) + '</span>' +
              '<h2 class="section-title">' + e(site.i18n.get("home.licensesTitle", "Licenses and certificates")) + '</h2>' +
            "</div>" +
          "</div>" +
          '<div class="home-certificate-grid">' + certificateCards + "</div>" +
        "</div>" +
      "</section>" +
      '<section class="section home-team-showcase" id="about">' +
        '<div class="container">' +
          '<div class="section-head compact-head">' +
            "<div>" +
              '<span class="eyebrow">' + e(site.i18n.get("teamPage.eyebrow", "Team")) + "</span>" +
              '<h2 class="section-title">' + e(site.i18n.get("teamPage.title", "Our team")) + "</h2>" +
              '<p class="home-team-intro">' + e(site.i18n.get("teamPage.text", "Project management, IT infrastructure and engineering systems are coordinated by dedicated specialists.")) + "</p>" +
            "</div>" +
            '<a class="button" href="' + e(site.utils.pageUrl("team")) + '">' + e(site.i18n.get("common.learnMore", "View team")) + "</a>" +
          "</div>" +
          '<div class="home-team-org home-team-preview" aria-label="' + e(site.i18n.get("teamPage.title", "Our team")) + '">' +
            '<div class="home-team-lead">' +
              directorCard +
            "</div>" +
            '<div class="home-team-preview-grid">' + teamPreviewCards + "</div>" +
          '</div>' +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
