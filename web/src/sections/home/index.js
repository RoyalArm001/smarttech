(function (site) {
  site.sections.home = function home() {
    var e = site.utils.escapeHtml;
    var defaultInsights = {
      eyebrow: "Team capacity",
      title: "Specialist distribution",
      text: "Dedicated leads and engineers keep delivery stable across design, installation and maintenance.",
      chartTitle: "Employee count by direction",
      totalLabel: "active specialists"
    };

    var departmentLabels = site.i18n.pickLanguageDictionary({
      hy: {
        IT: "IT և ցանցեր",
        Security: "Անվտանգություն",
        Technical: "Տեխնիկական համակարգեր",
        ProjectManagement: "Նախագծերի կառավարում",
        Automation: "Ավտոմատացում",
        BMS: "BMS նախագծում",
        Electrical: "Էլեկտրամոնտաժ",
        Audio: "Աուդիո համակարգեր",
        Management: "Կառավարում"
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
    var departmentCounts = {};
    (site.content.team || []).forEach(function (member) {
      if (!member || member.id === "director") return;
      var key = member.department || "Team";
      departmentCounts[key] = (departmentCounts[key] || 0) + 1;
    });
    var employeeGroups = Object.keys(departmentCounts).map(function (department) {
      return {
        label: departmentLabels[department] || department,
        value: departmentCounts[department]
      };
    }).sort(function (a, b) {
      return b.value - a.value;
    });

    var maxGroupValue = employeeGroups.reduce(function (max, item) {
      var value = Number(item.value) || 0;
      return value > max ? value : max;
    }, 0);

    var totalEmployees = employeeGroups.reduce(function (sum, item) {
      return sum + (Number(item.value) || 0);
    }, 0);

    var employeeBars = employeeGroups.map(function (group) {
      var value = Number(group.value) || 0;
      var percent = maxGroupValue > 0 ? Math.max(10, Math.round((value / maxGroupValue) * 100)) : 0;
      return "" +
        '<div class="home-bar-row">' +
          '<div class="home-bar-meta">' +
            "<span>" + e(group.label) + "</span>" +
            "<strong>" + e(value) + "</strong>" +
          "</div>" +
          '<div class="home-bar-track"><span style="width:' + e(percent) + '%"></span></div>' +
        "</div>";
    }).join("");

    var featuredServices = (site.content.services || []).slice();


    var mobileHomeFeaturedCount = 3;

    function serviceImageAttrs(options) {
      return site.utils.imageLoadingAttrs(options || { loading: "lazy" });
    }

    function renderHomeServicePost(service, index) {
      var text = site.i18n.service(service);
      var layoutClass = index % 2 === 0 ? "is-media-left" : "is-media-right";
      var mediaEnter = layoutClass === "is-media-left" ? "from-side-left" : "from-side-right";
      var bodyEnter = layoutClass === "is-media-left" ? "from-side-right" : "from-side-left";
      var order = String(index + 1).padStart(2, "0");
      var benefits = (text.tags || service.tags || []).slice(0, 3);
      var benefitsHtml = benefits.map(function (benefit) {
        return "<li>" + e(benefit) + "</li>";
      }).join("");
      return "" +
        '<article class="home-service-post ' + layoutClass + '">' +
          '<a class="home-service-post-shell" href="' + e(site.utils.pageUrl("service", service.id)) + '">' +
            '<span class="home-service-post-media reveal-slide ' + mediaEnter + '" data-reveal-delay="0">' +
              '<img src="' + e(service.image) + '" alt="' + e(text.title) + '" ' + serviceImageAttrs({ loading: "lazy", fetchpriority: "low", width: 640, height: 400 }) + ">" +
              '<span class="home-service-post-chip">' + e(order) + "</span>" +
            "</span>" +
            '<span class="home-service-post-body reveal-slide ' + bodyEnter + '" data-reveal-delay="180">' +
              '<span class="home-service-post-kicker">' + e(site.i18n.get("home.servicesBenefitsTitle", "Your benefits")) + "</span>" +
              "<h3>" + e(text.title) + "</h3>" +
              '<p class="home-service-post-lead">' + e(text.lead) + "</p>" +
              (benefitsHtml ? '<ul class="home-service-post-benefits">' + benefitsHtml + "</ul>" : "") +
              '<span class="home-service-post-cta">' + e(site.i18n.get("home.servicesExplore", site.i18n.get("common.learnMore"))) + "</span>" +
            "</span>" +
          "</a>" +
        "</article>";
    }

    function renderHomeServiceCatalogCard(service, index) {
      var text = site.i18n.service(service);
      var tag = (text.tags || service.tags || [])[0] || "";
      var order = String(index + 1).padStart(2, "0");
      var extraClass = service.id === "powder-coating" ? " is-powder" : "";

      return "" +
        '<a class="home-service-catalog-card reveal' + extraClass + '" href="' + e(site.utils.pageUrl("service", service.id)) + '">' +
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

    var allServicesOnHomeDesktop = featuredServices.map(renderHomeServicePost).join("");
    var mobileFeaturedServices = featuredServices.slice(0, mobileHomeFeaturedCount);
    var mobileCatalogServices = featuredServices.slice(mobileHomeFeaturedCount);
    var mobileFeaturedHtml = mobileFeaturedServices.map(renderHomeServicePost).join("");
    var mobileCatalogHtml = mobileCatalogServices.map(function (service, index) {
      return renderHomeServiceCatalogCard(service, mobileHomeFeaturedCount + index);
    }).join("");
    var mobileCatalogSection = mobileCatalogServices.length
      ? '<section class="home-service-catalog reveal">' +
          '<div class="home-service-catalog-head">' +
            '<span class="eyebrow">' + e(site.i18n.get("home.servicesCatalogEyebrow", "Catalog")) + "</span>" +
            "<h3>" + e(site.i18n.get("home.servicesCatalogTitle", "More services")) + "</h3>" +
            "<p>" + e(site.i18n.get("home.servicesCatalogText", "Tap a card to open the full service page.")) + "</p>" +
          "</div>" +
          '<div class="home-service-catalog-grid">' + mobileCatalogHtml + "</div>" +
        "</section>"
      : "";
    var allServicesOnHome =
      '<div class="home-service-stream home-service-stream--desktop">' + allServicesOnHomeDesktop + "</div>" +
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

    var homeClientLogos = (site.content.partners || []).slice(0, 5).map(function (partner) {
      return "" +
        '<a class="home-partner-logo reveal" href="' + e(site.utils.pageUrl("partners")) + '" aria-label="' + e(partner.name) + '">' +
          '<img src="' + e(partner.logo) + '" alt="' + e(partner.name) + '" loading="lazy" decoding="async">' +
        "</a>";
    }).join("");

    var homeClientsSection = homeClientLogos ? "" +
      '<section class="section home-partners-strip" id="partners">' +
        '<div class="container">' +
          '<div class="section-head compact-head">' +
            "<div>" +
              '<span class="eyebrow">' + e(site.i18n.get("home.servedClientsEyebrow", "Մատուցված ծառայություններ")) + "</span>" +
              '<h2 class="section-title">' + e(site.i18n.get("home.servedClientsTitle", "Որոշ կազմակերպություններ, որոնց սպասարկել ենք")) + "</h2>" +
              '<p class="section-copy">' + e(site.i18n.get("home.servedClientsText", "Սրանք գործընկերներ չեն․ ներկայացված են մի քանի կազմակերպություններ, որոնց օբյեկտներում Smart Tech-ը ծառայություններ է մատուցել։")) + "</p>" +
            "</div>" +
            '<a class="button" href="' + e(site.utils.pageUrl("partners")) + '">' + e(site.i18n.get("home.servedClientsButton", "Տեսնել բոլորը")) + "</a>" +
          "</div>" +
          '<div class="home-partner-grid">' + homeClientLogos + "</div>" +
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
      var title = localized.title || member.title;
      var text = localized.text || member.text;

      return "" +
        '<a class="home-team-card ' + e(extraClass || "") + ' reveal" href="' + e(site.utils.pageUrl("member", member.id)) + '" style="--team-color: ' + e(member.color) + '">' +
          '<span class="home-team-photo">' +
            '<img src="' + e(member.image) + '" alt="' + e(title) + '" loading="lazy">' +
            '<small>' + e(member.accent) + "</small>" +
          "</span>" +
          '<span class="home-team-copy">' +
            '<span class="home-team-department">' + e(localized.department || site.i18n.teamDepartment(member.department)) + "</span>" +
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
          '<div class="home-overview-intro reveal">' +
            '<span class="eyebrow">' + e(site.i18n.get("home.servicesEyebrow")) + "</span>" +
            '<h2 class="section-title">' + e(site.i18n.get("home.servicesTitle")) + "</h2>" +
            '<p>' + e(site.i18n.get("home.servicesText")) + "</p>" +
            '<a class="button button-primary" href="' + e(site.utils.pageUrl("services")) + '" data-i18n-key="common.viewServices">' + e(site.i18n.get("common.viewServices")) + "</a>" +
          "</div>" +
          '<div class="home-service-stream">' + allServicesOnHome + "</div>" +
        "</div>" +
      "</section>" +
      '<section class="section home-insights">' +
        '<div class="container home-insights-grid">' +
          '<div class="home-insights-copy reveal">' +
            '<span class="eyebrow">' + e(site.i18n.get("home.insightsEyebrow", defaultInsights.eyebrow)) + "</span>" +
            '<h2 class="section-title">' + e(site.i18n.get("home.insightsTitle", defaultInsights.title)) + "</h2>" +
            '<p>' + e(site.i18n.get("home.insightsText", defaultInsights.text)) + "</p>" +
            '<div class="home-people-total">' +
              "<strong>" + e(site.i18n.get("home.employeeTotalDisplay", String(totalEmployees) + "+")) + "</strong>" +
              "<span>" + e(site.i18n.get("home.employeeTotalLabel", defaultInsights.totalLabel)) + "</span>" +
            "</div>" +
          "</div>" +
          '<div class="home-insights-panel reveal">' +
            "<h3>" + e(site.i18n.get("home.chartTitle", defaultInsights.chartTitle)) + "</h3>" +
            '<div class="home-bar-list">' + employeeBars + "</div>" +
            '<div class="home-schematic" aria-hidden="true">' +
              '<span class="scheme-line line-a"></span>' +
              '<span class="scheme-line line-b"></span>' +
              '<span class="scheme-line line-c"></span>' +
              '<span class="scheme-node node-a"></span>' +
              '<span class="scheme-node node-b"></span>' +
              '<span class="scheme-node node-c"></span>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>" +
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
      homeClientsSection +
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
