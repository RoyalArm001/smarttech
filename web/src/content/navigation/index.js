(function (site) {
  var featuredServiceIds = [
    "video-surveillance",
    "fire-security",
    "networks",
    "electrical",
    "automation",
    "systems-design",
    "equipment-supply",
    "installation",
    "powder-coating"
  ];

  var navLabelFallbacks = {
    "nav.servicesAll": { hy: "Բոլոր ծառայությունները", en: "All services", ru: "Все услуги" },
    "nav.projectsAll": { hy: "Բոլորը", en: "All", ru: "Все" },
    "nav.projectsCurrent": { hy: "Ընթացիկ", en: "In progress", ru: "Текущие" },
    "nav.projectsCompleted": { hy: "Ավարտված", en: "Completed", ru: "Завершённые" },
    "nav.projectsGallery": { hy: "Լուսանկարներ", en: "Photos", ru: "Фото" },
    "nav.projectsAlbum": { hy: "Աշխատանքների ալբոմ", en: "Work album", ru: "Альбом работ" },
    "nav.teamAll": { hy: "Թիմի էջ", en: "Team page", ru: "Страница команды" },
    "nav.teamMembers": { hy: "Մասնագետներ", en: "Specialists", ru: "Специалисты" }
  };

  function navLabel(labelKey) {
    var text = site.i18n && typeof site.i18n.get === "function"
      ? site.i18n.get(labelKey, "")
      : "";
    if (text) return text;
    var fallbacks = navLabelFallbacks[labelKey] || {};
    var language = (site.i18n && site.i18n.language) || "hy";
    return fallbacks[language] || fallbacks.hy || "";
  }

  function navItem(href, labelKey) {
    return {
      href: href,
      labelKey: labelKey,
      label: navLabel(labelKey)
    };
  }

  site.content.navigation = [
    { href: "#top" },
    { href: "#services", submenu: true },
    { href: "#projects", submenu: true },
    { href: "#team", submenu: true },
    { href: "#partners" },
    { href: "#about" },
    { href: "#contact" }
  ];

  site.content.buildNavChildren = function buildNavChildren(route) {
    if (route === "services") {
      var serviceById = {};
      (site.content.services || []).forEach(function (service) {
        serviceById[service.id] = service;
      });
      var items = [
        navItem(site.utils.pageUrl("services"), "nav.servicesAll")
      ];
      featuredServiceIds.forEach(function (id) {
        var service = serviceById[id];
        if (!service) return;
        items.push({
          href: site.utils.pageUrl("service", id),
          label: site.i18n.service(service).title
        });
      });
      return items;
    }

    if (route === "projects") {
      return [
        navItem(site.utils.pageUrl("projects"), "nav.projectsAll"),
        navItem(site.utils.pageUrl("projects") + "#current-projects", "nav.projectsCurrent"),
        navItem(site.utils.pageUrl("projects") + "#completed-projects", "nav.projectsCompleted"),
        navItem(site.utils.pageUrl("projects") + "#projects-gallery", "nav.projectsGallery"),
        navItem(site.utils.pageUrl("album"), "nav.projectsAlbum")
      ];
    }

    if (route === "team") {
      return [
        navItem(site.utils.pageUrl("team"), "nav.teamAll"),
        navItem(site.utils.pageUrl("team") + "#team-content", "nav.teamMembers")
      ];
    }

    return [];
  };
})(window.SmartTech);
