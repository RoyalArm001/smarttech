(function (site) {
  function getMemberById(id) {
    return site.content.team.find(function (member) {
      return member.id === id;
    });
  }

  function socialIcon(type) {
    var icons = {
      phone: '<path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.3 21 3 12.7 3 2.5c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1l-2.1 2.2Z" fill="currentColor"/>',
      facebook: '<path d="M13.5 21v-7h2.4l.4-2.9h-2.8V9.3c0-.8.3-1.4 1.5-1.4h1.4V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8.2V14h2.3v7h3Z" fill="currentColor"/>',
      instagram: '<path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 2.8a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Zm0 2a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm4.4-3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" fill="currentColor"/>',
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
    if (text.indexOf("phone") >= 0 || text.indexOf("tel:") >= 0 || text.indexOf("call") >= 0 || text.indexOf("viber") >= 0) return "phone";
    if (text.indexOf("facebook") >= 0 || text.indexOf("fb.") >= 0) return "facebook";
    if (text.indexOf("instagram") >= 0 || text.indexOf("insta") >= 0) return "instagram";
    if (text.indexOf("whatsapp") >= 0) return "whatsapp";
    if (text.indexOf("telegram") >= 0 || text.indexOf("t.me") >= 0) return "telegram";
    if (text.indexOf("mail") >= 0 || text.indexOf("@") >= 0) return "email";
    if (text.indexOf("linkedin") >= 0) return "linkedin";
    if (text.indexOf("github") >= 0) return "github";
    return "link";
  }

  function emailHref(email) {
    return "mailto:" + String(email || "").replace(/[\r\n\s]/g, "");
  }

  function memberEmail(member) {
    return (member && member.email) || (site.content.contacts && site.content.contacts.email) || "";
  }

  var TEAM_TELEGRAM_HREF = "https://t.me/smarttechllc";

  function phoneHref(phone) {
    return "tel:" + String(phone || "").replace(/[\s()-]/g, "");
  }

  function findContactSocial(keyword) {
    var socials = (site.content.contacts && site.content.contacts.socials) || [];
    for (var i = 0; i < socials.length; i += 1) {
      var item = socials[i];
      var text = String((item && (item.label || item.href)) || "").toLowerCase();
      if (text.indexOf(keyword) >= 0) return item;
    }
    return null;
  }

  function teamCallNumber() {
    var whatsapp = findContactSocial("whatsapp");
    if (whatsapp && whatsapp.href) {
      var match = String(whatsapp.href).match(/\+?\d[\d\s()-]{6,}/);
      if (match) return match[0].replace(/[\s()-]/g, "");
    }
    var phones = (site.content.contacts && site.content.contacts.phones) || [];
    return phones.length ? phones[phones.length - 1].number : "";
  }

  function teamContactItems() {
    var items = [];
    var facebook = findContactSocial("facebook");
    var instagram = findContactSocial("instagram");
    var whatsapp = findContactSocial("whatsapp");

    if (facebook) items.push({ label: "Facebook", href: facebook.href, type: "facebook" });
    if (instagram) items.push({ label: "Instagram", href: instagram.href, type: "instagram" });
    if (TEAM_TELEGRAM_HREF) items.push({ label: "Telegram", href: TEAM_TELEGRAM_HREF, type: "telegram" });
    if (whatsapp) items.push({ label: "WhatsApp", href: whatsapp.href, type: "whatsapp" });

    var callNumber = teamCallNumber();
    if (callNumber) items.push({ label: "Call", href: phoneHref(callNumber), type: "phone" });

    return items;
  }

  function renderSocialLinks(items, email, className, phone) {
    var e = site.utils.escapeHtml;
    var links = [];
    var linkClass = className || "member-social-link";

    function socialLabel(type, fallback) {
      return site.i18n.get("teamDetail.social" + type.charAt(0).toUpperCase() + type.slice(1), fallback);
    }

    if (phone) {
      links.push({ label: socialLabel("phone", "Call"), href: phoneHref(phone), type: "phone" });
    }

    if (email) {
      links.push({ label: socialLabel("email", "Email"), href: emailHref(email), type: "email" });
    }

    (items || []).forEach(function (item) {
      links.push(item);
    });

    if (!links.length) return "";

    return links.map(function (item) {
      var type = socialType(item);
      var label = item.label;
      if (type === "phone") label = socialLabel("phone", label);
      if (type === "linkedin") label = socialLabel("linkedin", label);
      if (type === "telegram") label = socialLabel("telegram", label);
      if (type === "github") label = socialLabel("github", label);
      if (type === "email") label = socialLabel("email", label);
      var external = /^mailto:|^tel:/i.test(item.href) ? "" : ' target="_blank" rel="noreferrer"';
      return '' +
        '<a class="' + e(linkClass) + " " + e(linkClass + "-" + type) + '" href="' + e(item.href) + '"' + external + ' aria-label="' + e(label) + '">' +
          socialIcon(type) +
          "<span>" + e(label) + "</span>" +
        "</a>";
    }).join("");
  }

  function renderWorkInfo(items) {
    var e = site.utils.escapeHtml;
    if (!items || !items.length) return "";

    return items.map(function (item, index) {
      return "" +
        "<li>" +
          "<span>" + e(String(index + 1).padStart(2, "0")) + "</span>" +
          "<p>" + e(item) + "</p>" +
        "</li>";
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

  function teamDepartmentRank(member) {
    var ranks = {
      Management: 0,
      ProjectManagement: 1,
      IT: 2,
      Security: 3,
      Electrical: 4,
      Technical: 5,
      Automation: 6,
      BMS: 7,
      Audio: 8
    };
    return ranks[member.department] === undefined ? 20 : ranks[member.department];
  }

  function sortTeamMembers(a, b) {
    var rankDiff = teamRoleRank(a) - teamRoleRank(b);
    if (rankDiff) return rankDiff;

    if (a.roleLevel === "manager" || a.roleLevel === "lead") {
      var departmentDiff = teamDepartmentRank(a) - teamDepartmentRank(b);
      if (departmentDiff) return departmentDiff;
    }

    var orderA = Number(a.order);
    var orderB = Number(b.order);
    if (!isNaN(orderA) || !isNaN(orderB)) {
      return (isNaN(orderA) ? 999 : orderA) - (isNaN(orderB) ? 999 : orderB);
    }
    return String(a.id || "").localeCompare(String(b.id || ""));
  }

  function orderedTeamMembers() {
    return (site.content.team || []).slice().sort(sortTeamMembers);
  }

  function isManager(member) {
    return member && member.id !== "director" && (member.roleLevel === "manager" || member.roleLevel === "lead");
  }

  function englishTeamCopy(member) {
    var locale = site.content.locales && site.content.locales.en;
    var team = (locale && locale.team) || {};
    return (member && team[member.id]) || {};
  }

  function englishTeamDepartment(department) {
    var locale = site.content.locales && site.content.locales.en;
    var departments = (locale && locale.teamDepartments) || {};
    return departments[department] || department || "Team";
  }

  function teamDisplayMember(member) {
    var localized = site.i18n.teamMember(member);
    var english = englishTeamCopy(member);
    var merged = Object.assign({}, localized);

    merged.title = english.title || member.title;
    merged.level = english.level || localized.level || member.level;
    merged.department = englishTeamDepartment(member.department);

    return merged;
  }

  function englishTeamRoleLabel(member) {
    var title = englishTeamCopy(member).title || "";

    if (/project manager/i.test(title)) return "Project Manager";
    if (/department manager/i.test(title)) return "Department Manager";
    return member && member.roleLevel === "lead" ? "Direction Lead" : "Manager";
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
    var localized = teamDisplayMember(member);
    var title = localized.title || member.title;
    var profileUrl = site.utils.pageUrl("member", member.id);
    var contactLinks = renderSocialLinks(teamContactItems(), "", "team-social-link", "");

    return "" +
      '<article class="team-card ' + e(extraClass || "") + ' reveal" style="--team-color: ' + e(member.color) + '">' +
        '<a class="team-card-profile" href="' + e(profileUrl) + '">' +
          '<div class="team-photo-wrap">' +
            '<img class="team-photo" src="' + e(member.image) + '" alt="' + e(title) + '" loading="lazy">' +
            '<div class="team-mark">' + e(member.accent) + "</div>" +
          "</div>" +
          '<div class="team-card-copy">' +
            '<span class="team-department">' + e(localized.department || site.i18n.teamDepartment(member.department)) + "</span>" +
            "<h3>" + e(title) + "</h3>" +
            '<span class="team-card-action">' + e(site.i18n.get("common.learnMore", "View profile")) + "</span>" +
          "</div>" +
        "</a>" +
        (contactLinks ? '<div class="team-card-links">' + contactLinks + "</div>" : "") +
      "</article>";
  }

  function renderDirectorOrgChart(member) {
    var e = site.utils.escapeHtml;
    if (!member || member.id !== "director") return "";
    var directorTitle = teamDisplayMember(member).title || member.title;
    var groups = getTeamStructure(member).map(function (group) {
      var manager = group.manager;
      var managerText = teamDisplayMember(manager);
      var reportNodes = group.reports.map(function (item) {
        var localized = teamDisplayMember(item);
        return "" +
          '<a class="member-org-node" href="' + e(site.utils.pageUrl("member", item.id)) + '" style="--team-color: ' + e(item.color) + '">' +
            '<span>' + e(item.accent) + "</span>" +
            "<strong>" + e(localized.title || item.title) + "</strong>" +
            "<small>" + e(englishTeamDepartment(item.department)) + "</small>" +
          "</a>";
      }).join("");

      return "" +
        '<div class="member-org-group">' +
          '<a class="member-org-node member-org-manager" href="' + e(site.utils.pageUrl("member", manager.id)) + '" style="--team-color: ' + e(manager.color) + '">' +
            '<span>' + e(manager.accent) + "</span>" +
            "<strong>" + e(managerText.title || manager.title) + "</strong>" +
            "<small>" + e(englishTeamDepartment(manager.department)) + "</small>" +
          "</a>" +
          '<div class="member-org-child-grid">' + reportNodes + "</div>" +
        "</div>";
    }).join("");

    if (!groups) {
      groups = site.content.team.filter(function (item) {
        return item.id !== member.id;
      }).map(function (item) {
      var localized = teamDisplayMember(item);
      return "" +
        '<a class="member-org-node" href="' + e(site.utils.pageUrl("member", item.id)) + '" style="--team-color: ' + e(item.color) + '">' +
          '<span>' + e(item.accent) + "</span>" +
          "<strong>" + e(localized.title || item.title) + "</strong>" +
          "<small>" + e(englishTeamDepartment(item.department)) + "</small>" +
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
    var roleLabel = englishTeamRoleLabel(group.manager);
    var reports = group.reports.map(function (member) {
      return '<div class="team-report-node">' + renderTeamCard(member, "team-card-specialist") + "</div>";
    }).join("");
    var reportGridClass = "team-report-grid" + (group.reports.length ? " has-reports report-count-" + group.reports.length : " is-empty");
    var reportCaption = group.reports.length
      ? '<p class="team-manager-caption">' +
          e(site.i18n.get("teamPage.reportsTitle", "Specialists")) +
          " · " + e(String(group.reports.length)) +
        "</p>"
      : "";
    if (group.reports.length) {
      reportCaption = '<p class="team-manager-caption">Specialists &middot; ' + e(String(group.reports.length)) + "</p>";
    }
    var reportBranch = group.reports.length ? '<div class="team-report-branch" aria-hidden="true"></div>' : "";
    var reportGrid = reports ? '<div class="' + e(reportGridClass) + '">' + reports + "</div>" : "";

    return "" +
      '<article class="team-manager-column reveal" style="--team-color: ' + e(group.manager.color) + '">' +
        '<div class="team-manager-meta">' +
          '<span class="team-department-chip">' + e(englishTeamDepartment(group.manager.department)) + "</span>" +
          '<span class="team-role-chip">' + e(roleLabel) + "</span>" +
        "</div>" +
        '<div class="team-manager-head">' + renderTeamCard(group.manager, "team-card-manager") + "</div>" +
        reportCaption +
        reportBranch +
        reportGrid +
      "</article>";
  }

  function renderTeamStats(members, director) {
    var e = site.utils.escapeHtml;
    var managers = members.filter(isManager);
    var specialists = members.filter(function (member) {
      return member.roleLevel === "specialist";
    });
    var departments = {};
    managers.forEach(function (member) {
      if (member.department) departments[member.department] = true;
    });

    var stats = [
      { value: String(Object.keys(departments).length), label: site.i18n.get("teamPage.statsDepartments", "Departments") },
      { value: String(managers.length), label: site.i18n.get("teamPage.statsManagers", "Managers / PMs") },
      { value: String(specialists.length), label: site.i18n.get("teamPage.statsSpecialists", "Specialists") },
      { value: String(members.length + (director ? 1 : 0)), label: site.i18n.get("teamPage.statsTotal", "Team members") }
    ];

    return stats.map(function (item) {
      return "" +
        '<div class="team-stat-card">' +
          "<strong>" + e(item.value) + "</strong>" +
          "<span>" + e(item.label) + "</span>" +
        "</div>";
    }).join("");
  }

  function renderTeamDepartmentsGrid(director) {
    var groups = getTeamStructure(director).sort(function (a, b) {
      return sortTeamMembers(a.manager, b.manager);
    });
    return groups.map(renderTeamManagerGroup).join("");
  }

  function renderItWorkflow(member) {
    var e = site.utils.escapeHtml;
    if (member.department !== "IT") return "";

    var steps = site.i18n.get("teamDetail.itWorkflowSteps", [
      "Network audit",
      "Architecture",
      "Deployment",
      "Monitoring"
    ]).map(function (step, index) {
      return '<span><strong>' + e("0" + (index + 1)) + "</strong>" + e(step) + "</span>";
    }).join("");

    return "" +
      '<article class="member-info-card member-it-card reveal">' +
        '<div>' +
          '<span class="eyebrow">' + e(site.i18n.get("teamPage.itEyebrow", "IT")) + "</span>" +
          "<h2>" + e(site.i18n.get("teamDetail.itWorkflowTitle", "IT workflow")) + "</h2>" +
        "</div>" +
        '<div class="member-it-flow">' + steps + "</div>" +
      "</article>";
  }

  function teamUnitCopy() {
    var units = ["project", "it", "technical", "security", "electrical", "automation", "bms", "audio"];
    var copy = {};
    units.forEach(function (key) {
      var path = "teamPage." + key;
      copy[key] = {
        eyebrow: site.i18n.get(path + "Eyebrow", key.toUpperCase()),
        title: site.i18n.get(path + "Title", ""),
        text: site.i18n.get(path + "Text", "")
      };
    });
    return copy;
  }

  function renderTeamUnitLink(member) {
    var e = site.utils.escapeHtml;
    var localized = teamDisplayMember(member);
    return "" +
      '<a class="team-unit-link" href="' + e(site.utils.pageUrl("member", member.id)) + '" style="--team-color: ' + e(member.color) + '">' +
        "<span>" + e(member.accent) + "</span>" +
        "<strong>" + e(localized.title || member.title) + "</strong>" +
      "</a>";
  }

  function renderTeamUnitPanel(key, members, copy) {
    var e = site.utils.escapeHtml;
    var unitCopy = copy[key];
    if (!unitCopy || !members.length) return "";
    return "" +
      '<div class="team-unit-panel team-unit-panel-' + e(key) + ' reveal">' +
        "<div>" +
          '<span class="eyebrow">' + e(unitCopy.eyebrow) + "</span>" +
          "<h2>" + e(unitCopy.title) + "</h2>" +
          "<p>" + e(unitCopy.text) + "</p>" +
        "</div>" +
        '<div class="team-unit-grid">' + members.map(renderTeamUnitLink).join("") + "</div>" +
      "</div>";
  }

  function renderAllDepartmentPanels(members, copy) {
    var departmentMap = [
      { key: "project", department: "ProjectManagement" },
      { key: "it", department: "IT" },
      { key: "technical", department: "Technical" },
      { key: "security", department: "Security" },
      { key: "electrical", department: "Electrical" },
      { key: "automation", department: "Automation" },
      { key: "bms", department: "BMS" },
      { key: "audio", department: "Audio" }
    ];
    return departmentMap.map(function (item) {
      return renderTeamUnitPanel(item.key, members.filter(function (member) {
        return member.department === item.department;
      }), copy);
    }).join("");
  }

  function memberDetailLabels() {
    return site.i18n.pickLanguageDictionary({
      hy: {
        storyEyebrow: "Դերի նկարագիր",
        storyTitle: "Ինչ դեր ունի այս ուղղությունը",
        focusLabel: "Ուղղություն",
        roleLabel: "Դեր",
        qualityLabel: "Որակի մոտեցում",
        qualityText: "Հստակ պլանավորում, մաքուր իրականացում և վերջնական ստուգում",
        responsibilitiesTitle: "Ինչ է իրականացնում",
        certificatesIntro: "Մասնագիտական պատրաստվածությունն ու սերտիֆիկատները լրացնում են գործնական փորձը։"
      },
      en: {
        storyEyebrow: "Role overview",
        storyTitle: "How this role supports projects",
        focusLabel: "Direction",
        roleLabel: "Role",
        qualityLabel: "Quality approach",
        qualityText: "Clear planning, clean execution and final verification",
        responsibilitiesTitle: "Core responsibilities",
        certificatesIntro: "Professional preparation and certificates support hands-on project experience."
      },
      ru: {
        storyEyebrow: "Описание роли",
        storyTitle: "Как эта роль поддерживает проекты",
        focusLabel: "Направление",
        roleLabel: "Роль",
        qualityLabel: "Подход к качеству",
        qualityText: "Четкое планирование, аккуратная реализация и финальная проверка",
        responsibilitiesTitle: "Основные задачи",
        certificatesIntro: "Профессиональная подготовка и сертификаты дополняют практический опыт."
      }
    }, site.i18n.language || "hy");
  }

  function memberDepartmentFocus(member) {
    var language = site.i18n.language || "hy";
    var focusMap = {
      hy: {
        Management: "ընկերության ընդհանուր կառավարումը, որակի վերահսկումը և հաճախորդների հետ վստահելի աշխատանքը",
        ProjectManagement: "նախագծերի պլանավորումը, ժամկետների պահպանումը և թիմերի համաժամեցումը",
        IT: "ցանցային ենթակառուցվածքների, սերվերային կապերի և հեռահար հասանելիության կայուն աշխատանքը",
        Security: "անվտանգության, տեսահսկման և ազդարարման համակարգերի հուսալի իրականացումը",
        Electrical: "էլեկտրական գծերի, վահանների և լուսավորության անվտանգ մոնտաժը",
        Technical: "թույլ հոսանքի, մալուխային և տեխնիկական տեղադրման աշխատանքների ճշգրիտ իրականացումը",
        Automation: "կառավարման վահանների, սենսորների և ավտոմատ սցենարների ճիշտ աշխատանքը",
        BMS: "BMS ինտեգրումը՝ HVAC, լուսավորություն և անվտանգություն մեկ կառավարման տրամաբանության մեջ",
        Audio: "աուդիո ծածկույթը, public address համակարգերը և ձայնային հարմարավետությունը"
      },
      en: {
        Management: "company-wide management, quality control and reliable client communication",
        ProjectManagement: "project planning, deadline control and coordination between delivery teams",
        IT: "stable network infrastructure, server connectivity and secure remote access",
        Security: "reliable delivery of security, CCTV, access control and alarm systems",
        Electrical: "safe installation of electrical lines, panels, lighting and cable routes",
        Technical: "accurate low-voltage, cabling and technical installation works",
        Automation: "control panels, sensors and automation scenarios working as designed",
        BMS: "BMS integration of HVAC, lighting and security into one control logic",
        Audio: "audio coverage, public address systems and comfortable sound experience"
      },
      ru: {
        Management: "общее управление компанией, контроль качества и надежная коммуникация с клиентами",
        ProjectManagement: "планирование проектов, контроль сроков и координацию команд",
        IT: "стабильную сетевую инфраструктуру, серверные подключения и безопасный удаленный доступ",
        Security: "надежную реализацию систем безопасности, видеонаблюдения, доступа и сигнализации",
        Electrical: "безопасный монтаж электрических линий, щитов, освещения и кабельных трасс",
        Technical: "точные слаботочные, кабельные и технические монтажные работы",
        Automation: "корректную работу шкафов управления, датчиков и автоматизированных сценариев",
        BMS: "интеграцию BMS: HVAC, освещение и безопасность в единой логике управления",
        Audio: "звуковое покрытие, public address и комфортное аудио для объекта"
      }
    };
    var selected = focusMap[language] || focusMap.hy;
    return selected[member.department] || selected.ProjectManagement;
  }

  function memberStoryParagraphs(member, title) {
    var language = site.i18n.language || "hy";
    var focus = memberDepartmentFocus(member);
    var department = englishTeamDepartment(member.department);
    var role = englishTeamRoleLabel(member);

    if (member.id === "director") {
      return site.i18n.pickLanguageDictionary({
        hy: [
          "Այս էջը ներկայացնում է SmartTech-ի ընդհանուր ղեկավարումը՝ այն կետը, որտեղ տեխնիկական թիմերը, նախագծերի որակը և հաճախորդի սպասումները միավորվում են մեկ հստակ աշխատանքի մեջ։",
          "Գլխավոր ուշադրությունը " + focus + " է, որպեսզի յուրաքանչյուր օբյեկտ ստանա վստահելի, ժամանակին և վերահսկվող իրականացում։"
        ],
        en: [
          "This page presents SmartTech's general leadership — the point where technical teams, project quality and client expectations are aligned into one clear delivery process.",
          "The main focus is " + focus + ", so every facility receives reliable, on-time and controlled implementation."
        ],
        ru: [
          "Эта страница показывает общее руководство SmartTech — точку, где технические команды, качество проектов и ожидания клиента соединяются в понятный процесс реализации.",
          "Основной фокус — " + focus + ", чтобы каждый объект получил надежное, своевременное и контролируемое выполнение."
        ]
      }, language);
    }

    if (member.roleLevel === "manager" || member.roleLevel === "lead") {
      return site.i18n.pickLanguageDictionary({
        hy: [
          title + " դերը պատասխանատու է " + focus + " կազմակերպելու և վերահսկելու համար։ Այս էջը ցույց է տալիս, թե ինչպես է տվյալ ուղղությունը կապում նախագծի պահանջները, թիմային աշխատանքը և վերջնական հանձնումը։",
          "Աշխատանքի հիմնական նպատակը պատվիրատուի խնդիրը պարզ տեխնիկական պլանի վերածելն է, ապա այն հասցնել ավարտուն, ստուգված և օգտագործման պատրաստ վիճակի։"
        ],
        en: [
          "The " + title + " role is responsible for organizing and controlling " + focus + ". This page shows how the direction connects project requirements, teamwork and final handover.",
          "The goal is to turn the client's need into a clear technical plan, then bring it to a finished, tested and ready-to-use state."
        ],
        ru: [
          "Роль " + title + " отвечает за организацию и контроль направления: " + focus + ". Эта страница показывает, как направление связывает требования проекта, работу команды и финальную сдачу.",
          "Главная цель — превратить задачу клиента в понятный технический план и довести его до завершенного, проверенного и готового к работе состояния."
        ]
      }, language);
    }

    return site.i18n.pickLanguageDictionary({
      hy: [
        title + " դերը կենտրոնացած է " + department + " ուղղության գործնական և տեխնիկական աշխատանքի վրա։ Մասնագետը ապահովում է, որ տեղադրված համակարգերը լինեն ճիշտ միացված, կարգավորված և պատրաստ կայուն շահագործման։",
        "Աշխատանքը կարևոր է հատկապես օբյեկտի վերջնական որակի համար․ յուրաքանչյուր կապ, սարքավորում և կարգավորում պետք է համապատասխանի նախագծի տրամաբանությանը։"
      ],
      en: [
        "The " + title + " role focuses on practical and technical work within the " + department + " direction. The specialist ensures that installed systems are connected, configured and ready for stable operation.",
        "This work is essential for final project quality: every connection, device and setting must match the project's technical logic."
      ],
      ru: [
        "Роль " + title + " сосредоточена на практической и технической работе в направлении " + department + ". Специалист обеспечивает правильное подключение, настройку и готовность систем к стабильной эксплуатации.",
        "Эта работа важна для финального качества объекта: каждое подключение, устройство и настройка должны соответствовать технической логике проекта."
      ]
    }, language);
  }

  function renderMemberStoryCard(member, title) {
    var e = site.utils.escapeHtml;
    var labels = memberDetailLabels();
    var paragraphs = memberStoryParagraphs(member, title).map(function (paragraph) {
      return "<p>" + e(paragraph) + "</p>";
    }).join("");

    return "" +
      '<article class="member-info-card member-story-card reveal" style="--team-color: ' + e(member.color) + '">' +
        '<div class="member-story-head">' +
          '<span class="eyebrow">' + e(labels.storyEyebrow) + "</span>" +
          "<h2>" + e(labels.storyTitle) + "</h2>" +
        "</div>" +
        '<div class="member-story-copy">' + paragraphs + "</div>" +
        '<div class="member-focus-grid">' +
          '<div><span>' + e(labels.focusLabel) + "</span><strong>" + e(englishTeamDepartment(member.department)) + "</strong></div>" +
          '<div><span>' + e(labels.roleLabel) + "</span><strong>" + e(englishTeamRoleLabel(member)) + "</strong></div>" +
          '<div><span>' + e(labels.qualityLabel) + "</span><strong>" + e(labels.qualityText) + "</strong></div>" +
        "</div>" +
      "</article>";
  }

  function teamPageLabels() {
    return site.i18n.pickLanguageDictionary({
      hy: {
        overviewEyebrow: "Թիմի քարտեզ",
        overviewTitle: "Մեկ էջում՝ ղեկավարումը, բաժինները և պատասխանատուները",
        overviewText: "Թիմը ներկայացված է պարզ կառուցվածքով, որպեսզի արագ երևա՝ ով որ ուղղության համար է պատասխանատու և ով է իրականացնում աշխատանքը։",
        directorLabel: "Ընդհանուր ղեկավարում",
        managersLabel: "Պատասխանատուներ",
        specialistsLabel: "Մասնագետներ",
        profile: "Բացել պրոֆիլը",
        people: "մարդ",
        empty: "Այս բաժնում մասնագետներ դեռ նշված չեն։"
      },
      en: {
        overviewEyebrow: "Team map",
        overviewTitle: "Leadership, departments and responsible people in one clear view",
        overviewText: "The team is shown as a clean directory so visitors can quickly understand who leads each direction and who delivers the work.",
        directorLabel: "General leadership",
        managersLabel: "Responsible leads",
        specialistsLabel: "Specialists",
        profile: "Open profile",
        people: "people",
        empty: "No specialists are listed for this department yet."
      },
      ru: {
        overviewEyebrow: "Карта команды",
        overviewTitle: "Руководство, отделы и ответственные в одном понятном виде",
        overviewText: "Команда показана как простой каталог, чтобы посетитель быстро видел, кто отвечает за направление и кто выполняет работу.",
        directorLabel: "Общее руководство",
        managersLabel: "Ответственные",
        specialistsLabel: "Специалисты",
        profile: "Открыть профиль",
        people: "чел.",
        empty: "В этом отделе специалисты пока не указаны."
      }
    }, site.i18n.language || "hy");
  }

  function departmentOrderValue(department) {
    var ranks = {
      ProjectManagement: 1,
      IT: 2,
      Security: 3,
      Electrical: 4,
      Technical: 5,
      Automation: 6,
      BMS: 7,
      Audio: 8
    };
    return ranks[department] || 20;
  }

  function humanDepartmentLabel(department) {
    var key = String(department || "Team").trim();
    var translated = site.i18n.teamDepartment(key);
    var labels = site.i18n.pickLanguageDictionary({
      hy: {
        Management: "Ընդհանուր ղեկավարում",
        ProjectManagement: "Նախագծերի կառավարում",
        IT: "IT",
        Security: "Անվտանգության համակարգեր",
        Electrical: "Էլեկտրամոնտաժ",
        Technical: "Տեխնիկական աշխատանքներ",
        Automation: "Ավտոմատացում",
        BMS: "BMS",
        Audio: "Աուդիո համակարգեր",
        Team: "Թիմ"
      },
      en: {
        Management: "Management",
        ProjectManagement: "Project Management",
        IT: "IT",
        Security: "Security Systems",
        Electrical: "Electrical Works",
        Technical: "Technical Works",
        Automation: "Automation",
        BMS: "BMS",
        Audio: "Audio Systems",
        Team: "Team"
      },
      ru: {
        Management: "Общее руководство",
        ProjectManagement: "Управление проектами",
        IT: "IT",
        Security: "Системы безопасности",
        Electrical: "Электромонтаж",
        Technical: "Технические работы",
        Automation: "Автоматизация",
        BMS: "BMS",
        Audio: "Аудиосистемы",
        Team: "Команда"
      }
    });

    if (translated && translated !== key) return translated;
    return labels[key] || key.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  function localizedTeamMember(member) {
    var localized = site.i18n.teamMember(member);
    return Object.assign({}, member, localized, {
      title: localized.title || member.title,
      text: localized.text || member.text,
      department: humanDepartmentLabel(member.department)
    });
  }

  function renderTeamDirectoryCard(member, variant, labels) {
    var e = site.utils.escapeHtml;
    var person = localizedTeamMember(member);
    var roleLabel = member.roleLevel === "specialist"
      ? labels.specialistsLabel
      : member.id === "director"
        ? labels.directorLabel
        : labels.managersLabel;
    var departmentLabel = person.department || humanDepartmentLabel(member.department);
    var cardTitle = person.cardTitle || person.title || member.title;
    var metaLabel = person.cardMeta || (departmentLabel === roleLabel
      ? departmentLabel
      : departmentLabel + " / " + roleLabel);
    var extraClass = variant ? " team-person-" + variant : "";

    return "" +
      '<a class="team-person-card' + extraClass + ' reveal" href="' + e(site.utils.pageUrl("member", member.id)) + '" style="--team-color: ' + e(member.color) + '">' +
        '<span class="team-person-photo">' +
          '<img src="' + e(member.image) + '" alt="' + e(person.title) + '" loading="lazy" decoding="async">' +
          '<em>' + e(member.accent) + "</em>" +
        "</span>" +
        '<span class="team-person-copy">' +
          '<small>' + e(metaLabel) + "</small>" +
          '<strong>' + e(cardTitle) + "</strong>" +
          '<span>' + e(person.text || "") + "</span>" +
          '<b>' + e(labels.profile) + "</b>" +
        "</span>" +
      "</a>";
  }

  function teamDepartmentGroups(members) {
    var grouped = {};
    members.forEach(function (member) {
      var key = member.department || "Team";
      if (!grouped[key]) {
        grouped[key] = {
          key: key,
          color: member.color || "#0aa896",
          members: []
        };
      }
      if (member.roleLevel === "manager" || member.roleLevel === "lead") {
        grouped[key].color = member.color || grouped[key].color;
      }
      grouped[key].members.push(member);
    });

    return Object.keys(grouped).map(function (key) {
      var group = grouped[key];
      group.members = group.members.sort(sortTeamMembers);
      group.managers = group.members.filter(isManager);
      group.specialists = group.members.filter(function (member) {
        return !isManager(member);
      });
      return group;
    }).sort(function (a, b) {
      return departmentOrderValue(a.key) - departmentOrderValue(b.key);
    });
  }

  function renderDepartmentBlock(group, labels) {
    var e = site.utils.escapeHtml;
    var departmentTitle = humanDepartmentLabel(group.key);
    var count = group.members.length;
    var managerCards = group.managers.map(function (member) {
      return renderTeamDirectoryCard(member, "lead", labels);
    }).join("");
    var specialistCards = group.specialists.map(function (member) {
      return renderTeamDirectoryCard(member, "compact", labels);
    }).join("");

    return "" +
      '<article class="team-directory-group reveal" style="--team-color: ' + e(group.color || "#0aa896") + '">' +
        '<header class="team-directory-head">' +
          '<div>' +
            '<span class="eyebrow">' + e(departmentTitle) + "</span>" +
            "<h2>" + e(departmentTitle) + "</h2>" +
          "</div>" +
          '<strong>' + e(String(count)) + ' <span>' + e(labels.people) + "</span></strong>" +
        "</header>" +
        (managerCards ? (
          '<div class="team-directory-lane">' +
            '<p>' + e(labels.managersLabel) + "</p>" +
            '<div class="team-directory-grid team-directory-grid-leads">' + managerCards + "</div>" +
          "</div>"
        ) : "") +
        '<div class="team-directory-lane">' +
          '<p>' + e(labels.specialistsLabel) + "</p>" +
          (specialistCards
            ? '<div class="team-directory-grid team-directory-grid-compact">' + specialistCards + "</div>"
            : '<div class="team-directory-empty">' + e(labels.empty) + "</div>") +
        "</div>" +
      "</article>";
  }

  site.sections.team = function team() {
    var e = site.utils.escapeHtml;
    var director = getMemberById("director") || site.content.team[0];
    var members = orderedTeamMembers().filter(function (member) {
      return !director || member.id !== director.id;
    });
    var labels = teamPageLabels();
    var departmentBlocks = teamDepartmentGroups(members).map(function (group) {
      return renderDepartmentBlock(group, labels);
    }).join("");
    var statsMarkup = renderTeamStats(members, director);
    var directorCard = director ? renderTeamDirectoryCard(director, "director", labels) : "";

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
          '<div class="team-directory-shell">' +
            '<div class="team-directory-intro reveal">' +
              '<span class="eyebrow">' + e(labels.overviewEyebrow) + "</span>" +
              "<h2>" + e(labels.overviewTitle) + "</h2>" +
              "<p>" + e(labels.overviewText) + "</p>" +
            "</div>" +
            '<div class="team-directory-top">' +
              '<div class="team-directory-lead">' + directorCard + "</div>" +
              '<div class="team-directory-stats reveal">' + statsMarkup + "</div>" +
            "</div>" +
            '<div class="team-directory-stack">' + departmentBlocks + "</div>" +
          "</div>" +
        "</div>" +
      "</section>";
  };

  site.sections.memberDetail = function memberDetail(id) {
    var e = site.utils.escapeHtml;
    var member = getMemberById(id);
    if (!member) return site.sections.team();

    var localized = site.i18n.teamMember(member);
    var display = teamDisplayMember(member);
    var title = display.title || member.title;
    var description = localized.text || member.text;
    var detailLabels = memberDetailLabels();
    var workItems = localized.workInfo || member.workInfo || [];
    var levelLabel = site.i18n.get("teamDetail.level", "Level");
    var expLabel = site.i18n.get("teamDetail.experience", "Experience");
    var socialLabel = site.i18n.get("teamDetail.socials", "Social networks");
    var certLabel = site.i18n.get("teamDetail.certificates", "Certificates");
    var profileClass = member.id === "director"
      ? "member-profile-card member-profile-director"
      : "member-profile-card member-profile-person";

    return "" +
      site.sections.pageHero({
        eyebrow: site.i18n.get("teamPage.eyebrow"),
        eyebrowKey: "teamPage.eyebrow",
        title: title,
        text: description,
        textKey: "team." + member.id + ".text",
        image: member.image,
        tone: "team"
      }) +
      '<section class="section team-member-section">' +
        '<div class="container team-member-grid">' +
          '<aside class="' + e(profileClass) + ' reveal" style="--team-color: ' + e(member.color) + '">' +
            '<a class="member-back" href="' + e(site.utils.pageUrl("team")) + '">&lt; ' + e(site.i18n.get("detail.back", "Back")) + "</a>" +
            '<div class="member-photo-wrap">' +
              '<img class="member-photo" src="' + e(member.image) + '" alt="' + e(title) + '" loading="lazy">' +
              '<span class="member-accent">' + e(member.accent) + "</span>" +
            "</div>" +
            '<h1 class="member-name">' + e(title) + "</h1>" +
            '<p class="member-role">' + e(description) + "</p>" +
            '<div class="member-meta">' +
              '<span><strong>' + e(levelLabel) + ":</strong> " + e(display.level || localized.level || member.level || "Senior") + "</span>" +
              '<span><strong>' + e(expLabel) + ":</strong> " + e(localized.experience || member.experience || "8 years") + "</span>" +
            "</div>" +
            '<div class="member-social-block">' +
              '<h3>' + e(socialLabel) + "</h3>" +
              '<div class="member-social-links">' + renderSocialLinks(teamContactItems(), "", "member-social-link", "") + "</div>" +
            "</div>" +
          "</aside>" +
          '<div class="member-content">' +
            renderMemberStoryCard(member, title) +
            '<article class="member-info-card reveal">' +
              "<h2>" + e(detailLabels.responsibilitiesTitle) + "</h2>" +
              '<ul class="member-work-list">' + renderWorkInfo(workItems) + "</ul>" +
            "</article>" +
            renderDirectorOrgChart(member) +
            renderItWorkflow(member) +
            renderWorkGallery(member.workImages || []) +
            '<article class="member-info-card reveal">' +
              "<h2>" + e(certLabel) + "</h2>" +
              '<p class="member-cert-intro">' + e(detailLabels.certificatesIntro) + "</p>" +
              '<div class="member-cert-grid">' + renderCertificates(localized.certificates || member.certificates || []) + "</div>" +
            "</article>" +
          "</div>" +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
