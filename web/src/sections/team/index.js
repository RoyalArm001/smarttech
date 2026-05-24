(function (site) {
  function getMemberById(id) {
    return site.content.team.find(function (member) {
      return member.id === id;
    });
  }

  function socialIcon(type) {
    var icons = {
      email: '<path d="M3 5h18v14H3V5Zm2 3.2 7 5 7-5V7l-7 5-7-5v1.2Z" fill="currentColor"/>',
      linkedin: '<path d="M6.8 9H3.7v11h3.1V9ZM5.3 4a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 5.3 4Zm6.5 5H8.9v11H12v-5.7c0-1.5.7-2.5 2-2.5 1.2 0 1.7.8 1.7 2.5V20h3.1v-6.2c0-3.2-1.6-5-4.2-5-1.4 0-2.3.6-2.8 1.4V9Z" fill="currentColor"/>',
      telegram: '<path d="M21 4.4 18.2 20c-.2 1-1 1.2-1.8.7l-4.1-3-2 2c-.2.2-.5.4-.9.4l.3-4.3 7.8-7c.3-.3-.1-.5-.5-.2l-9.6 6-4.1-1.3c-.9-.3-.9-.9.2-1.3L19.7 3.8c.8-.3 1.5.2 1.3.6Z" fill="currentColor"/>',
      github: '<path d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.1.6-.2.6-.4v-1.5c-2.4.5-2.9-1-2.9-1-.4-.9-.9-1.1-.9-1.1-.8-.5.1-.5.1-.5.8.1 1.3.9 1.3.9.8 1.3 2 1 2.5.8.1-.6.3-1 .5-1.2-1.9-.2-3.9-1-3.9-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9.7-.2 1.4-.3 2.1-.3s1.4.1 2.1.3c1.6-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.5.6.9 1.4.9 2.3 0 3.3-2 4-3.9 4.2.3.3.6.8.6 1.6v2c0 .2.1.5.6.4A8.5 8.5 0 0 0 12 3.5Z" fill="currentColor"/>',
      whatsapp: '<path d="M12 3.5A8.3 8.3 0 0 0 5 16.3L4 20.5l4.3-1.1A8.3 8.3 0 1 0 12 3.5Zm4.8 11.7c-.2.6-1.2 1.1-1.7 1.2-.5.1-1.1.2-3.5-.8-3-1.3-4.9-4.3-5-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.4-.1.6.2.4.8 1.3 1.8 2.1 1.2 1.1 2.2 1.4 2.6 1.6.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 .9c.3.1.5.2.6.4 0 .1 0 .8-.2 1.6Z" fill="currentColor"/>',
      link: '<path d="M10.4 7.5 12 5.9a4 4 0 0 1 5.7 5.7l-2.1 2.1a4 4 0 0 1-5.4.2l1.6-1.6a1.8 1.8 0 0 0 2.2-.2l2.1-2.1a1.8 1.8 0 0 0-2.5-2.5l-1.6 1.6-1.6-1.6Zm3.2 9L12 18.1a4 4 0 0 1-5.7-5.7l2.1-2.1a4 4 0 0 1 5.4-.2l-1.6 1.6a1.8 1.8 0 0 0-2.2.2L7.9 14a1.8 1.8 0 0 0 2.5 2.5l1.6-1.6 1.6 1.6Z" fill="currentColor"/>'
    };

    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (icons[type] || icons.link) + "</svg>";
  }

  function socialType(item) {
    var text = String((item && (item.type || item.label || item.href)) || "").toLowerCase();
    if (text.indexOf("mail") >= 0 || text.indexOf("@") >= 0) return "email";
    if (text.indexOf("linkedin") >= 0) return "linkedin";
    if (text.indexOf("telegram") >= 0 || text.indexOf("t.me") >= 0) return "telegram";
    if (text.indexOf("github") >= 0) return "github";
    if (text.indexOf("whatsapp") >= 0) return "whatsapp";
    return "link";
  }

  function emailHref(email) {
    return "mailto:" + String(email || "").replace(/[\r\n\s]/g, "");
  }

  function memberEmail(member) {
    return (member && member.email) || (site.content.contacts && site.content.contacts.email) || "";
  }

  function renderSocialLinks(items, email, className) {
    var e = site.utils.escapeHtml;
    var links = [];
    var linkClass = className || "member-social-link";

    if (email) {
      links.push({ label: "Email", href: emailHref(email), type: "email" });
    }

    (items || []).forEach(function (item) {
      links.push(item);
    });

    if (!links.length) return "";

    return links.map(function (item) {
      var type = socialType(item);
      var external = /^mailto:|^tel:/i.test(item.href) ? "" : ' target="_blank" rel="noreferrer"';
      return '' +
        '<a class="' + e(linkClass) + " " + e(linkClass + "-" + type) + '" href="' + e(item.href) + '"' + external + ' aria-label="' + e(item.label) + '">' +
          socialIcon(type) +
          "<span>" + e(item.label) + "</span>" +
        "</a>";
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

  function renderWorkGallery(items) {
    var e = site.utils.escapeHtml;
    if (!items || !items.length) return "";

    return "" +
      '<article class="member-info-card member-work-gallery-card reveal">' +
        "<h2>" + e(site.i18n.get("teamDetail.workGallery", "Work photos")) + "</h2>" +
        '<div class="member-work-gallery">' +
          items.map(function (item, index) {
            var title = item.title || ("Work photo " + (index + 1));
            return "" +
              '<figure class="member-work-photo">' +
                '<img src="' + e(item.image) + '" alt="' + e(title) + '" loading="lazy">' +
                "<figcaption>" + e(title) + "</figcaption>" +
              "</figure>";
          }).join("") +
        "</div>" +
      "</article>";
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
    var contactLinks = renderSocialLinks(member.socials || [], memberEmail(member), "team-social-link");

    return "" +
      '<article class="team-card ' + e(extraClass || "") + ' reveal" style="--team-color: ' + e(member.color) + '">' +
        '<a class="team-card-profile" href="' + e(profileUrl) + '">' +
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
        "</a>" +
        (contactLinks ? '<div class="team-card-links">' + contactLinks + "</div>" : "") +
      "</article>";
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
      return '<div class="team-report-node">' + renderTeamCard(member, "team-card-specialist") + "</div>";
    }).join("");
    var reportGridClass = "team-report-grid" + (group.reports.length ? " has-reports report-count-" + group.reports.length : " is-empty");

    if (!reports) {
      reports = '<p class="team-report-empty">' + e(site.i18n.get("teamPage.noReports", "This direction is coordinated by project scope.")) + "</p>";
    }

    return "" +
      '<article class="team-manager-column reveal" style="--team-color: ' + e(group.manager.color) + '">' +
        '<div class="team-manager-head">' + renderTeamCard(group.manager, "team-card-manager") + "</div>" +
        '<div class="team-report-branch" aria-hidden="true"></div>' +
        '<div class="' + e(reportGridClass) + '">' + reports + "</div>" +
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
    var specialists = orderedTeamMembers().filter(function (member) {
      return !director || member.id !== director.id;
    });
    var railCards = specialists.map(function (member) {
      var cardClass = isManager(member) ? "team-card-person team-card-lead" : "team-card-person team-card-worker";
      return '<div class="team-rail-node" style="--team-color: ' + e(member.color) + '">' + renderTeamCard(member, cardClass) + "</div>";
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
            '<div class="team-structure-head reveal">' +
              '<span class="eyebrow">' + e(site.i18n.get("teamPage.managementEyebrow", "Management")) + "</span>" +
              "<h2>" + e(site.i18n.get("teamPage.managementTitle", "General team management")) + "</h2>" +
              "<p>" + e(site.i18n.get("teamPage.managementText", "Managers are shown first, and each direction's specialists are grouped directly below their responsible manager.")) + "</p>" +
            "</div>" +
            '<div class="team-hierarchy team-carousel">' +
              renderTeamCard(director, "team-card-director team-card-featured") +
              '<div class="team-carousel-shell reveal">' +
                '<div class="team-carousel-track">' +
                  '<div class="team-carousel-set">' + railCards + "</div>" +
                  '<div class="team-carousel-set" aria-hidden="true" inert>' + railCards + "</div>" +
                "</div>" +
              "</div>" +
            "</div>" +
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
        image: member.image,
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
              '<div class="member-social-links">' + renderSocialLinks(member.socials || [], memberEmail(member), "member-social-link") + "</div>" +
            "</div>" +
          "</aside>" +
          '<div class="member-content">' +
            '<article class="member-info-card reveal">' +
              "<h2>" + e(workLabel) + "</h2>" +
              '<ul class="member-work-list">' + renderWorkInfo(member.workInfo || []) + "</ul>" +
            "</article>" +
            renderDirectorOrgChart(member) +
            renderItWorkflow(member) +
            renderWorkGallery(member.workImages || []) +
            '<article class="member-info-card reveal">' +
              "<h2>" + e(certLabel) + "</h2>" +
              '<div class="member-cert-grid">' + renderCertificates(member.certificates || []) + "</div>" +
            "</article>" +
          "</div>" +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
