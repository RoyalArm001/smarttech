(function (site) {
  site.sections.partners = function partners() {
    var e = site.utils.escapeHtml;
    var logos = site.content.partners.map(function (partner) {
      return '' +
        '<div class="partner-logo reveal">' +
          '<img src="' + e(partner.logo) + '" alt="' + e(partner.name) + '" loading="lazy">' +
        '</div>';
    }).join("");

    return '' +
      site.sections.pageHero({
        eyebrow: site.i18n.get("partnersPage.eyebrow"),
        eyebrowKey: "partnersPage.eyebrow",
        title: site.i18n.get("partnersPage.title"),
        titleKey: "partnersPage.title",
        text: site.i18n.get("partnersPage.text"),
        textKey: "partnersPage.text",
        image: site.content.company.heroImages[1],
        tone: "partners"
      }) +
      '<section id="partners-content" class="section partners-section">' +
        '<div class="container">' +
          '<div class="partners-grid">' + logos + '</div>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
