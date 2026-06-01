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

    var employeeGroups = site.i18n.get("home.employeeGroups", []);
    var fallbackGroups = [
      {
        label: site.i18n.get("home.employeeFallback.core", "Core engineering"),
        value: Math.max(site.content.team.length, 4)
      },
      {
        label: site.i18n.get("home.employeeFallback.field", "Field operations"),
        value: Math.max(site.content.team.length * 2, 8)
      },
      {
        label: site.i18n.get("home.employeeFallback.support", "Support and QA"),
        value: Math.max(site.content.team.length, 5)
      }
    ];
    if (!employeeGroups || !employeeGroups.length) {
      employeeGroups = fallbackGroups;
    }

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

    // Show only services starting from the 7th one on the homepage.
    // The first 6 stay only on the dedicated /services page.
    var allServicesOnHome = site.content.services.slice(6).map(function (service) {
      var text = site.i18n.service(service);
      return "" +
        '<a class="home-service-card reveal" href="' + e(site.utils.pageUrl("service", service.id)) + '">' +
          '<img src="' + e(service.image) + '" alt="' + e(text.title) + '" loading="lazy">' +
          "<strong>" + e(text.title) + "</strong>" +
          "<span>" + e(text.lead) + "</span>" +
        "</a>";
    }).join("");

    var homeProjects = site.content.projects.map(function (project) {
      var text = site.i18n.project(project);
      var works = (text.works || project.works || []).slice(0, 3).map(function (work) {
        return "<li>" + e(work) + "</li>";
      }).join("");
      return "" +
        '<a class="home-bottom-project-card reveal" href="' + e(site.utils.pageUrl("project", project.id)) + '">' +
          '<span class="home-bottom-project-image">' +
            '<img src="' + e(project.images[0]) + '" alt="' + e(text.title) + '" loading="eager" onerror="this.style.opacity=0;this.parentElement.classList.add(\'is-broken\');">' +
          "</span>" +
          '<span class="home-bottom-project-copy">' +
            "<strong>" + e(text.title) + "</strong>" +
            '<ul>' + works + "</ul>" +
          "</span>" +
        "</a>";
    }).join("");

    var partnerLogos = (site.content.partners || []).slice(0, 8).map(function (partner) {
      return "" +
        '<a class="home-partner-logo reveal" href="' + e(site.utils.pageUrl("partners")) + '" aria-label="' + e(partner.name) + '">' +
          '<img src="' + e(partner.logo) + '" alt="' + e(partner.name) + '" loading="lazy">' +
        "</a>";
    }).join("");

    var certificateDocuments = site.content.company.licenseDocuments || [];
    var featuredCertificates = certificateDocuments.slice(0, 2);
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

    function renderHomeTeamCard(member, extraClass) {
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
            '<span class="home-team-department">' + e(member.department || "Team") + "</span>" +
            "<strong>" + e(title) + "</strong>" +
            "<em>" + e(text) + "</em>" +
          "</span>" +
        "</a>";
    }

    var directorCard = director ? renderHomeTeamCard(director, "home-team-director") : "";
    var managerGroups = specialists.filter(isManager).map(function (manager) {
      return {
        manager: manager,
        reports: specialists.filter(function (member) {
          return !isManager(member) && member.managerId === manager.id;
        }).sort(sortTeamMembers)
      };
    }).sort(function (a, b) {
      return sortTeamMembers(a.manager, b.manager);
    });
    var usedReports = {};
    managerGroups.forEach(function (group) {
      group.reports.forEach(function (member) {
        usedReports[member.id] = true;
      });
    });
    var unassignedReports = specialists.filter(function (member) {
      return !isManager(member) && !usedReports[member.id];
    });
    if (unassignedReports.length && managerGroups.length) {
      managerGroups[0].reports = managerGroups[0].reports.concat(unassignedReports);
    }

    var managerCards = managerGroups.map(function (group) {
      var reports = group.reports.map(function (member) {
        return '<span class="home-team-report-node">' + renderHomeTeamCard(member, "home-team-specialist") + "</span>";
      }).join("");
      var hasReports = Boolean(reports);

      return "" +
        '<article class="home-team-group ' + (hasReports ? "has-reports" : "is-solo") + ' reveal" style="--team-color: ' + e(group.manager.color) + '">' +
          renderHomeTeamCard(group.manager, "home-team-manager") +
          (hasReports ? '<span class="home-team-branch" aria-hidden="true"></span><div class="home-team-grid">' + reports + "</div>" : "") +
        "</article>";
    }).join("");

    return "" +
      '<div id="top"></div>' +
      '<section class="section home-overview" id="services">' +
        '<div class="container home-overview-grid">' +
          '<div class="home-overview-copy reveal">' +
            '<span class="eyebrow">' + e(site.i18n.get("home.servicesEyebrow")) + "</span>" +
            '<h2 class="section-title">' + e(site.i18n.get("home.servicesTitle")) + "</h2>" +
            '<p>' + e(site.i18n.get("home.servicesText")) + "</p>" +
            '<a class="button button-primary" href="' + e(site.utils.pageUrl("services")) + '">' + e(site.i18n.get("common.viewServices")) + "</a>" +
          "</div>" +
          '<div class="home-service-list">' + allServicesOnHome + "</div>" +
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
      '<section class="section home-partners-strip" id="partners">' +
        '<div class="container">' +
          '<div class="section-head compact-head">' +
            "<div>" +
              '<span class="eyebrow">' + e(site.i18n.get("partnersPage.eyebrow")) + "</span>" +
              '<h2 class="section-title">' + e(site.i18n.get("home.partnersTitle", site.i18n.get("partnersPage.eyebrow", "Գործընկերները"))) + "</h2>" +
            "</div>" +
            '<a class="button" href="' + e(site.utils.pageUrl("partners")) + '">' + e(site.i18n.get("common.learnMore", "View more")) + "</a>" +
          "</div>" +
          '<div class="home-partner-grid">' + partnerLogos + "</div>" +
        "</div>" +
      "</section>" +
      '<section class="home-contact-cta" id="contact">' +
        '<div class="container home-contact-inner reveal">' +
          "<div>" +
            "<h2>" + e(site.i18n.get("home.contactTitle")) + "</h2>" +
            "<p>" + e(site.i18n.get("home.contactText")) + "</p>" +
          "</div>" +
          '<a class="button button-primary" href="' + e(site.utils.pageUrl("request")) + '">' + e(site.i18n.get("common.proposal", site.i18n.get("common.consultation"))) + "</a>" +
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
      '<section class="section home-team-showcase" id="about">' +
        '<div class="container">' +
          '<div class="section-head compact-head">' +
            "<div>" +
              '<span class="eyebrow">' + e(site.i18n.get("teamPage.eyebrow", "Team")) + "</span>" +
              '<h2 class="section-title">' + e(site.i18n.get("teamPage.title", "Our team")) + "</h2>" +
              '<p class="home-team-intro">' + e(site.i18n.get("teamPage.managementText", "Direction comes first, then responsible managers, with specialists grouped directly under each direction.")) + "</p>" +
            "</div>" +
            '<a class="button" href="' + e(site.utils.pageUrl("team")) + '">' + e(site.i18n.get("common.learnMore", "View team")) + "</a>" +
          "</div>" +
          '<div class="home-team-org" aria-label="' + e(site.i18n.get("teamPage.managementTitle", "Team structure")) + '">' +
            '<div class="home-team-lead">' + directorCard + "</div>" +
            '<span class="home-team-line" aria-hidden="true"></span>' +
            '<div class="home-team-manager-grid">' + managerCards + "</div>" +
          '</div>' +
        "</div>" +
      "</section>" +
      '<section class="section home-certificates-section">' +
        '<div class="container">' +
          '<div class="section-head compact-head">' +
            "<div>" +
              '<span class="eyebrow">Լիցենզիաներ</span>' +
              '<h2 class="section-title">Լիցենզիաներ և սերտիֆիկատներ</h2>' +
            "</div>" +
          "</div>" +
          '<div class="home-certificate-grid">' + certificateCards + "</div>" +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
