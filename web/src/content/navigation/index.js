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
    "powder-coating",
    "wacker"
  ];

  site.content.navigation = [
    { href: "#top" },
    { href: "#services", submenu: true },
    { href: "#projects", submenu: true },
    { href: "#team", submenu: true },
    { href: "#partners" },
    { href: "#about" },
    { href: "#contact" },
    { href: "#request" }
  ];

  site.content.buildNavChildren = function buildNavChildren(route) {
    if (route === "services") {
      var serviceById = {};
      (site.content.services || []).forEach(function (service) {
        serviceById[service.id] = service;
      });
      var items = [
        { href: site.utils.pageUrl("services"), labelKey: "nav.servicesAll" }
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
        { href: site.utils.pageUrl("projects"), labelKey: "nav.projectsAll" },
        { href: site.utils.pageUrl("projects") + "#current-projects", labelKey: "nav.projectsCurrent" },
        { href: site.utils.pageUrl("projects") + "#completed-projects", labelKey: "nav.projectsCompleted" },
        { href: site.utils.pageUrl("projects") + "#projects-gallery", labelKey: "nav.projectsGallery" }
      ];
    }

    if (route === "team") {
      return [
        { href: site.utils.pageUrl("team"), labelKey: "nav.teamAll" },
        { href: site.utils.pageUrl("team") + "#team-content", labelKey: "nav.teamMembers" }
      ];
    }

    return [];
  };
})(window.SmartTech);
