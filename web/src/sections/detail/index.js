(function (site) {
  function galleryMarkup(images, title) {
    var e = site.utils.escapeHtml;
    return images.map(function (image, index) {
      return '<img src="' + e(image) + '" alt="' + e(title) + ' ' + (index + 1) + '" loading="lazy" decoding="async">';
    }).join("");
  }

  function localTitle(item) {
    if (!item || !item.title) return "";
    if (typeof item.title === "string") return item.title;
    return item.title[site.i18n.language] || item.title.hy || item.title.en || "";
  }

  function systemGalleryMarkup(items) {
    var e = site.utils.escapeHtml;
    if (!items || !items.length) return "";

    return items.map(function (item, index) {
      var title = localTitle(item);
      return "" +
        '<figure class="detail-system-card">' +
          '<img src="' + e(item.image) + '" alt="' + e(title || ("System " + (index + 1))) + '" loading="lazy" decoding="async">' +
          "<figcaption>" + e(title) + "</figcaption>" +
        "</figure>";
    }).join("");
  }

  function tagMarkup(items) {
    var e = site.utils.escapeHtml;
    return items.map(function (item) {
      return '<span>' + e(item) + '</span>';
    }).join("");
  }

  function detailShell(type, id, data, title, lead, chips, images, backHref, systemItems) {
    var e = site.utils.escapeHtml;
    var heroImage = images[0] || data.image || "";
    var systemGallery = systemGalleryMarkup(systemItems || []);

    return "" +
      '<section class="detail-page">' +
        '<div class="detail-hero" style="--detail-image: url(' + e(heroImage) + ')">' +
          '<div class="container detail-hero-inner reveal">' +
            '<a class="detail-back" href="' + e(backHref) + '">&lt; ' + e(site.i18n.get("detail.back")) + "</a>" +
            '<span class="eyebrow">' + e(type) + "</span>" +
            "<h1>" + e(title) + "</h1>" +
            "<p>" + e(lead) + "</p>" +
            '<div class="tag-row detail-tags">' + tagMarkup(chips) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="container detail-body">' +
          '<div class="section-head">' +
            "<div>" +
              '<span class="eyebrow">' + e(site.i18n.get("detail.galleryEyebrow")) + "</span>" +
              '<h2 class="section-title">' + e(site.i18n.get("detail.galleryTitle")) + "</h2>" +
            "</div>" +
            '<p class="section-copy">' + e(site.i18n.get("detail.galleryText")) + "</p>" +
          "</div>" +
          '<div class="detail-gallery reveal">' + galleryMarkup(images, title) + "</div>" +
          (systemGallery ? (
            '<div class="section-head detail-system-head">' +
              "<div>" +
                '<span class="eyebrow">' + e(site.i18n.get("detail.systemGalleryEyebrow", "Systems")) + "</span>" +
                '<h2 class="section-title">' + e(site.i18n.get("detail.systemGalleryTitle", "Installed system visuals")) + "</h2>" +
              "</div>" +
              '<p class="section-copy">' + e(site.i18n.get("detail.systemGalleryText", "")) + "</p>" +
            "</div>" +
            '<div class="detail-system-grid reveal">' + systemGallery + "</div>"
          ) : "") +
          '<div class="detail-cta reveal">' +
            "<div>" +
              "<h2>" + e(site.i18n.get("detail.ctaTitle")) + "</h2>" +
              "<p>" + e(site.i18n.get("detail.ctaText")) + "</p>" +
            "</div>" +
            '<a class="button button-primary" href="' + e(site.utils.pageUrl("contact")) + '">' + e(site.i18n.get("common.consultation")) + "</a>" +
          "</div>" +
        "</div>" +
      "</section>";
  }

  site.sections.serviceDetail = function serviceDetail(id) {
    var service = site.content.services.find(function (item) {
      return item.id === id;
    });
    if (!service) return site.sections.services();

    var text = site.i18n.service(service);
    var images = service.gallery && service.gallery.length ? service.gallery : [service.image];
    return detailShell(
      site.i18n.get("detail.serviceType"),
      id,
      service,
      text.title,
      text.lead,
      text.tags || [],
      images,
      site.utils.pageUrl("services"),
      []
    );
  };

  site.sections.projectDetail = function projectDetail(id) {
    var project = site.content.projects.find(function (item) {
      return item.id === id;
    });
    if (!project) return site.sections.projects();

    var text = site.i18n.project(project);
    return detailShell(
      site.i18n.get("detail.projectType"),
      id,
      project,
      text.title,
      site.i18n.get("detail.projectLead"),
      text.works || [],
      project.images || [],
      site.utils.pageUrl("projects"),
      project.systemImages || []
    );
  };
})(window.SmartTech);
