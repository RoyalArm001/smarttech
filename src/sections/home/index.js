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

    var featuredServices = (site.content.services || []).slice();


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

    function renderHomeServicePost(service, index, options) {
      var opts = options || {};
      var text = site.i18n.service(service);
      var postCopy = serviceHomePostCopy(service, text, opts.layout);
      var layoutClass = opts.layout === "vertical"
        ? "is-card-vertical"
        : (index % 2 === 0 ? "is-media-left" : "is-media-right");
      var order = String(index + 1).padStart(2, "0");
      var benefits = postCopy.benefits;
      var benefitsHtml = benefits.map(function (benefit) {
        return "<li>" + e(benefit) + "</li>";
      }).join("");
      var lead = postCopy.lead;
      var imageLoading = index < 2 ? "eager" : "lazy";
      var imagePriority = index < 2 ? "high" : "low";
      var shellMarkup = "" +
        '<a class="home-service-post-shell" href="' + e(site.utils.pageUrl("service", service.id)) + '">' +
          '<span class="home-service-post-media">' +
            '<img src="' + e(service.image) + '" alt="' + e(text.title) + '" ' + serviceImageAttrs({ loading: imageLoading, fetchpriority: imagePriority, width: 640, height: 400 }) + ">" +
            '<span class="home-service-post-chip">' + e(order) + "</span>" +
          "</span>" +
          '<span class="home-service-post-body">' +
            '<span class="home-service-post-kicker">' + e(site.i18n.get("home.servicesBenefitsTitle", "Your benefits")) + "</span>" +
            "<h3>" + e(text.title) + "</h3>" +
            '<p class="home-service-post-lead">' + e(lead) + "</p>" +
            (benefitsHtml ? '<ul class="home-service-post-benefits">' + benefitsHtml + "</ul>" : "") +
            '<span class="home-service-post-cta">' + e(site.i18n.get("home.servicesExplore", site.i18n.get("common.learnMore"))) + "</span>" +
          "</span>" +
        "</a>";

      if (opts.layout === "zigzag") {
        var spineNode = '<span class="home-service-spine-node" aria-hidden="true"><span class="home-service-spine-pulse"></span></span>';
        var spacer = '<span class="home-service-post-spacer" aria-hidden="true"></span>';
        var rowMarkup = layoutClass === "is-media-right"
          ? spacer + spineNode + shellMarkup
          : shellMarkup + spineNode + spacer;
        return "" +
          '<article class="home-service-post home-service-reveal ' + layoutClass + '" data-service-id="' + e(service.id) + '" data-reveal-delay="' + e(String(Math.min(index * 80, 320))) + '" data-spine-index="' + e(String(index)) + '">' +
            '<div class="home-service-post-row">' + rowMarkup + "</div>" +
          "</article>";
      }

      return "" +
        '<article class="home-service-post home-service-reveal ' + layoutClass + '" data-service-id="' + e(service.id) + '" data-reveal-delay="' + e(String(Math.min(index * 70, 280))) + '">' +
          shellMarkup +
        "</article>";
    }

    function renderHomeServiceCatalogCard(service, index) {
      var text = site.i18n.service(service);
      var tag = (text.tags || service.tags || [])[0] || "";
      var order = String(index + 1).padStart(2, "0");
      var extraClass = service.id === "powder-coating" ? " is-powder" : "";

      return "" +
        '<a class="home-service-catalog-card home-service-reveal' + extraClass + '" href="' + e(site.utils.pageUrl("service", service.id)) + '" data-reveal-delay="' + e(String(Math.min(index * 50, 200))) + '">' +
          '<span class="home-service-catalog-media">' +
            '<img data-src="' + e(service.image) + '" alt="' + e(text.title) + '" ' + serviceImageAttrs({ fetchpriority: "low", width: 320, height: 256, className: "is-deferred-src" }) + ">" +
            '<span class="home-service-catalog-index">' + e(order) + "</span>" +
          "</span>" +
          '<span class="home-service-catalog-body">' +
            (tag ? '<span class="home-service-catalog-tag">' + e(tag) + "</span>" : "") +
            "<strong>" + e(text.title) + "</strong>" +
            '<span class="home-service-catalog-arrow" aria-hidden="true">→</span>' +
          "</span>" +
        "</a>";
    }

    var allServicesOnHomeDesktop = featuredServices.map(function (service, index) {
      return renderHomeServicePost(service, index, { layout: "zigzag" });
    }).join("");
    var mobileFeaturedServices = featuredServices.slice(0, mobileHomeFeaturedCount);
    var mobileCatalogServices = featuredServices.slice(mobileHomeFeaturedCount);
    var mobileFeaturedHtml = mobileFeaturedServices.map(function (service, index) {
      return renderHomeServicePost(service, index, { layout: "vertical" });
    }).join("");
    var mobileCatalogHtml = mobileCatalogServices.map(function (service, index) {
      return renderHomeServiceCatalogCard(service, mobileHomeFeaturedCount + index);
    }).join("");
    var mobileCatalogSection = mobileCatalogServices.length
      ? '<section class="home-service-catalog">' +
          '<div class="home-service-catalog-head">' +
            '<span class="eyebrow">' + e(site.i18n.get("home.servicesCatalogEyebrow", "Catalog")) + "</span>" +
            "<h3>" + e(site.i18n.get("home.servicesCatalogTitle", "More services")) + "</h3>" +
            "<p>" + e(site.i18n.get("home.servicesCatalogText", "Tap a card to open the full service page.")) + "</p>" +
          "</div>" +
          '<div class="home-service-catalog-grid">' + mobileCatalogHtml + "</div>" +
        "</section>"
      : "";
    var allServicesOnHome =
      '<div class="home-service-timeline home-service-timeline--desktop">' +
        '<div class="home-service-spine-rail" aria-hidden="true">' +
          '<svg class="home-service-spine-svg" viewBox="0 0 100 1000" preserveAspectRatio="none">' +
            '<defs>' +
              '<linearGradient id="homeServiceSpineGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                '<stop offset="0%" stop-color="#38d6a8" stop-opacity="0.15" />' +
                '<stop offset="45%" stop-color="#0aa896" stop-opacity="0.85" />' +
                '<stop offset="100%" stop-color="#4a84ff" stop-opacity="0.35" />' +
              "</linearGradient>" +
            "</defs>" +
            '<path class="home-service-spine-track" d="M50 0 V1000" />' +
            '<path class="home-service-spine-flow" d="M50 0 V1000" />' +
          "</svg>" +
        "</div>" +
        '<div class="home-service-stream home-service-stream--desktop">' + allServicesOnHomeDesktop + "</div>" +
      "</div>" +
      '<div class="home-service-stream home-service-stream--mobile">' +
        '<div class="home-service-stream-featured">' + mobileFeaturedHtml + "</div>" +
        mobileCatalogSection +
      "</div>";

    var homeProjects = site.content.projects.map(function (project) {
      var text = site.i18n.project(project);
      var statusLabels = project.statusLabels || {};
      var statusText = statusLabels[site.i18n.language] || statusLabels.en || statusLabels.hy || "";
      var works = (text.works || project.works || []).slice(0, 3).map(function (work) {
        return "<li>" + e(work) + "</li>";
      }).join("");
      return "" +
        '<a class="home-bottom-project-card reveal" href="' + e(site.utils.pageUrl("project", project.id)) + '">' +
          '<span class="project-status-badge is-' + e(project.status || "completed") + '">' + e(statusText) + "</span>" +
          '<span class="home-bottom-project-image">' +
            '<img src="' + e(project.images[0]) + '" alt="' + e(text.title) + '" ' + serviceImageAttrs({ loading: "lazy", fetchpriority: "low", width: 480, height: 300 }) + ' onerror="this.style.opacity=0;this.parentElement.classList.add(\'is-broken\');">' +
          "</span>" +
          '<span class="home-bottom-project-copy">' +
            "<strong>" + e(text.title) + "</strong>" +
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
