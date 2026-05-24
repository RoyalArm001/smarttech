(function (site) {
  function getMemberById(id) {
    return site.content.team.find(function (member) {
      return member.id === id;
    });
  }

  function renderSocialLinks(items) {
    var e = site.utils.escapeHtml;
    if (!items || !items.length) return "";

    return items.map(function (item) {
      return '<a href="' + e(item.href) + '" target="_blank" rel="noreferrer">' + e(item.label) + "</a>";
    }).join("");
  }

  function renderWorkInfo(items) {
    var e = site.utils.escapeHtml;
    if (!items || !items.length) return "";

    return items.map(function (item) {
      return "<li>" + e(item) + "</li>";
    }).join("");
  }

  function renderCertificates(items) {
    var e = site.utils.escapeHtml;
    if (!items || !items.length) return "";

    return items.map(function (item, index) {
      return "" +
        '<figure class="member-cert-card reveal">' +
          '<img src="' + e(item.image) + '" alt="' + e(item.title) + " " + (index + 1) + '" loading="lazy">' +
          "<figcaption>" + e(item.title) + "</figcaption>" +
        "</figure>";
    }).join("");
  }

  function teamRoleRank(member) {
    var ranks = {
      director: 0,
      manager: 1,
      lead: 2,
      specialist: 3
    };
    return ranks[member.roleLevel] === undefined ? 4 : ranks[member.roleLevel];
  }

  function sortTeamMembers(a, b) {
    var orderA = Number(a.order);
    var orderB = Number(b.order);
    if (!isNaN(orderA) || !isNaN(orderB)) {
      return (isNaN(orderA) ? 999 : orderA) - (isNaN(orderB) ? 999 : orderB);
    }
    return teamRoleRank(a) - teamRoleRank(b);
  }

  function orderedTeamMembers() {
    return (site.content.team || []).slice().sort(sortTeamMembers);
  }

  function isManager(member) {
    return member && member.id !== "director" && (member.roleLevel === "manager" || member.roleLevel === "lead");
  }

  function getTeamStructure(director) {
    var members = orderedTeamMembers();
    var managerGroups = members.filter(isManager).map(function (manager) {
      return {
        manager: manager,
        reports: members.filter(function (member) {
          return member.managerId === manager.id && !isManager(member);
        })
      };
    });

    var used = {};
    managerGroups.forEach(function (group) {
      used[group.manager.id] = true;
      group.reports.forEach(function (member) {
        used[member.id] = true;
      });
    });

    var floatingReports = members.filter(function (member) {
      return (!director || member.id !== director.id) && !used[member.id] && !isManager(member);
    });

    if (floatingReports.length && managerGroups.length) {
      managerGroups[0].reports = managerGroups[0].reports.concat(floatingReports);
    }

    return managerGroups;
  }

  function renderTeamCard(member, extraClass) {
    var e = site.utils.escapeHtml;
    var localized = site.i18n.teamMember(member);
    var title = localized.title || member.title;
    var description = localized.text || member.text;
    var profileUrl = site.utils.pageUrl("member", member.id);

    return "" +
      '<a class="team-card ' + e(extraClass || "") + ' reveal" href="' + e(profileUrl) + '" style="--team-color: ' + e(member.color) + '">' +
        '<div class="team-photo-wrap">' +
          '<img class="team-photo" src="' + e(member.image) + '" alt="' + e(title) + '" loading="lazy">' +
          '<div class="team-mark">' + e(member.accent) + "</div>" +
        "</div>" +
        '<div class="team-card-copy">' +
          '<span class="team-department">' + e(member.department || "Team") + "</span>" +
          "<h3>" + e(title) + "</h3>" +
          "<p>" + e(description) + "</p>" +
          '<span class="team-card-action">' + e(site.i18n.get("common.learnMore", "View profile")) + "</span>" +
        "</div>" +
      "</a>";
  }

  function renderDirectorOrgChart(member) {
    var e = site.utils.escapeHtml;
    if (!member || member.id !== "director") return "";
    var directorTitle = site.i18n.teamMember(member).title || member.title;
    var groups = getTeamStructure(member).map(function (group) {
      var manager = group.manager;
      var managerText = site.i18n.teamMember(manager);
      var reportNodes = group.reports.map(function (item) {
        var localized = site.i18n.teamMember(item);
        return "" +
          '<a class="member-org-node" href="' + e(site.utils.pageUrl("member", item.id)) + '" style="--team-color: ' + e(item.color) + '">' +
            '<span>' + e(item.accent) + "</span>" +
            "<strong>" + e(localized.title || item.title) + "</strong>" +
            "<small>" + e(item.department || "") + "</small>" +
          "</a>";
      }).join("");

      if (!reportNodes) {
        reportNodes = '<p class="member-org-empty">' + e(site.i18n.get("teamPage.noReports", "This direction is coordinated by project scope.")) + "</p>";
      }

      return "" +
        '<div class="member-org-group">' +
          '<a class="member-org-node member-org-manager" href="' + e(site.utils.pageUrl("member", manager.id)) + '" style="--team-color: ' + e(manager.color) + '">' +
            '<span>' + e(manager.accent) + "</span>" +
            "<strong>" + e(managerText.title || manager.title) + "</strong>" +
            "<small>" + e(manager.department || "") + "</small>" +
          "</a>" +
          '<div class="member-org-child-grid">' + reportNodes + "</div>" +
        "</div>";
    }).join("");

    if (!groups) {
      groups = site.content.team.filter(function (item) {
        return item.id !== member.id;
      }).map(function (item) {
      var localized = site.i18n.teamMember(item);
      return "" +
        '<a class="member-org-node" href="' + e(site.utils.pageUrl("member", item.id)) + '" style="--team-color: ' + e(item.color) + '">' +
          '<span>' + e(item.accent) + "</span>" +
          "<strong>" + e(localized.title || item.title) + "</strong>" +
          "<small>" + e(item.department || "") + "</small>" +
        "</a>";
      }).join("");
    }

    return "" +
      '<article class="member-info-card member-org-card reveal">' +
        '<div class="member-org-head">' +
          '<span class="eyebrow">' + e(site.i18n.get("teamDetail.structureEyebrow", "Structure")) + "</span>" +
          "<h2>" + e(site.i18n.get("teamDetail.structureTitle", "Team structure")) + "</h2>" +
        "</div>" +
        '<div class="member-org-chart">' +
          '<div class="member-org-director" style="--team-color: ' + e(member.color) + '">' +
            "<span>" + e(member.accent) + "</span>" +
            "<strong>" + e(directorTitle) + "</strong>" +
          "</div>" +
          '<div class="member-org-line"></div>' +
          '<div class="member-org-grid member-org-groups">' + groups + "</div>" +
        "</div>" +
      "</article>";
  }

  function renderTeamManagerGroup(group) {
    var e = site.utils.escapeHtml;
    var reports = group.reports.map(function (member) {
      return renderTeamCard(member, "team-card-specialist");
    }).join("");

    if (!reports) {
      reports = '<p class="team-report-empty">' + e(site.i18n.get("teamPage.noReports", "This direction is coordinated by project scope.")) + "</p>";
    }

    return "" +
      '<article class="team-manager-column reveal">' +
        '<div class="team-manager-head">' + renderTeamCard(group.manager, "team-card-manager") + "</div>" +
        '<div class="team-report-branch" aria-hidden="true"></div>' +
        '<div class="team-report-grid">' + reports + "</div>" +
      "</article>";
  }

  function renderItWorkflow(member) {
    var e = site.utils.escapeHtml;
    if (member.department !== "IT") return "";

    var steps = [
      "Network audit",
      "Architecture",
      "Deployment",
      "Monitoring"
    ].map(function (step, index) {
      return '<span><strong>' + e("0" + (index + 1)) + "</strong>" + e(step) + "</span>";
    }).join("");

    return "" +
      '<article class="member-info-card member-it-card reveal">' +
        '<div>' +
          '<span class="eyebrow">IT</span>' +
          "<h2>" + e(site.i18n.get("teamDetail.itWorkflowTitle", "IT workflow")) + "</h2>" +
        "</div>" +
        '<div class="member-it-flow">' + steps + "</div>" +
      "</article>";
  }

  site.sections.team = function team() {
    var e = site.utils.escapeHtml;
    var director = getMemberById("director") || site.content.team[0];
    var groups = getTeamStructure(director);
    var specialists = orderedTeamMembers().filter(function (member) {
      return !director || member.id !== director.id;
    });
    var managerGroups = groups.map(function (group) {
      return renderTeamManagerGroup(group);
    }).join("");
    var itCards = specialists.filter(function (member) {
      return member.department === "IT";
    }).map(function (member) {
      var localized = site.i18n.teamMember(member);
      return "" +
        '<a class="team-unit-link" href="' + e(site.utils.pageUrl("member", member.id)) + '" style="--team-color: ' + e(member.color) + '">' +
          "<span>" + e(member.accent) + "</span>" +
          "<strong>" + e(localized.title || member.title) + "</strong>" +
        "</a>";
    }).join("");

    return "" +
      site.sections.pageHero({
        eyebrow: site.i18n.get("teamPage.eyebrow"),
        eyebrowKey: "teamPage.eyebrow",
        title: site.i18n.get("teamPage.title"),
        titleKey: "teamPage.title",
        text: site.i18n.get("teamPage.text"),
        textKey: "teamPage.text",
        image: site.content.company.heroImages[0],
        tone: "team"
      }) +
      '<section id="team-content" class="section team-section">' +
        '<div class="container">' +
          '<div class="team-org-overview">' +
            renderTeamCard(director, "team-card-director") +
            '<div class="team-org-drop" aria-hidden="true"></div>' +
            '<div class="team-structure-head reveal">' +
              '<span class="eyebrow">' + e(site.i18n.get("teamPage.managementEyebrow", "Management")) + "</span>" +
              "<h2>" + e(site.i18n.get("teamPage.managementTitle", "General team management")) + "</h2>" +
              "<p>" + e(site.i18n.get("teamPage.managementText", "Managers are shown first, and each direction's specialists are grouped directly below their responsible manager.")) + "</p>" +
            "</div>" +
            '<div class="team-management-grid">' + managerGroups + "</div>" +
          "</div>" +
          '<div class="team-unit-panel reveal">' +
            "<div>" +
              '<span class="eyebrow">IT</span>' +
              "<h2>" + e(site.i18n.get("teamPage.itTitle", "IT Department")) + "</h2>" +
              "<p>" + e(site.i18n.get("teamPage.itText", "Network engineering and IT project delivery work as a separate technical unit.")) + "</p>" +
            "</div>" +
            '<div class="team-unit-grid">' + itCards + "</div>" +
          "</div>" +
        "</div>" +
      "</section>";
  };

  site.sections.memberDetail = function memberDetail(id) {
    var e = site.utils.escapeHtml;
    var member = getMemberById(id);
    if (!member) return site.sections.team();

    var localized = site.i18n.teamMember(member);
    var title = localized.title || member.title;
    var description = localized.text || member.text;
    var levelLabel = site.i18n.get("teamDetail.level", "Level");
    var expLabel = site.i18n.get("teamDetail.experience", "Experience");
    var workLabel = site.i18n.get("teamDetail.workInfo", "Work information");
    var socialLabel = site.i18n.get("teamDetail.socials", "Social networks");
    var certLabel = site.i18n.get("teamDetail.certificates", "Certificates");

    return "" +
      site.sections.pageHero({
        eyebrow: site.i18n.get("teamPage.eyebrow"),
        eyebrowKey: "teamPage.eyebrow",
        title: title,
        titleKey: "team." + member.id + ".title",
        text: description,
        textKey: "team." + member.id + ".text",
        image: member.coverImage || member.image,
        tone: "team"
      }) +
      '<section class="section team-member-section">' +
        '<div class="container team-member-grid">' +
          '<aside class="member-profile-card reveal" style="--team-color: ' + e(member.color) + '">' +
            '<a class="member-back" href="' + e(site.utils.pageUrl("team")) + '">&lt; ' + e(site.i18n.get("detail.back", "Back")) + "</a>" +
            '<div class="member-photo-wrap">' +
              '<img class="member-photo" src="' + e(member.image) + '" alt="' + e(title) + '" loading="lazy">' +
              '<span class="member-accent">' + e(member.accent) + "</span>" +
            "</div>" +
            '<h1 class="member-name">' + e(title) + "</h1>" +
            '<p class="member-role">' + e(description) + "</p>" +
            '<div class="member-meta">' +
              '<span><strong>' + e(levelLabel) + ":</strong> " + e(member.level || "Senior") + "</span>" +
              '<span><strong>' + e(expLabel) + ":</strong> " + e(member.experience || "8 years") + "</span>" +
            "</div>" +
            '<div class="member-social-block">' +
              '<h3>' + e(socialLabel) + "</h3>" +
              '<div class="member-social-links">' + renderSocialLinks(member.socials || []) + "</div>" +
            "</div>" +
          "</aside>" +
          '<div class="member-content">' +
            '<article class="member-info-card reveal">' +
              "<h2>" + e(workLabel) + "</h2>" +
              '<ul class="member-work-list">' + renderWorkInfo(member.workInfo || []) + "</ul>" +
            "</article>" +
            renderDirectorOrgChart(member) +
            renderItWorkflow(member) +
            '<article class="member-info-card reveal">' +
              "<h2>" + e(certLabel) + "</h2>" +
              '<div class="member-cert-grid">' + renderCertificates(member.certificates || []) + "</div>" +
            "</article>" +
          "</div>" +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
