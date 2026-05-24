(function (site) {
  site.sections.about = function about() {
    var e = site.utils.escapeHtml;
    var company = site.content.company;
    var paragraphItems = site.i18n.get("about.paragraphs", company.about);
    var heroText = paragraphItems.join(" ");
    if (heroText.length > 300) {
      heroText = heroText.slice(0, 300) + "...";
    }

    var paragraphs = paragraphItems.map(function (text) {
      return '<p>' + e(text) + '</p>';
    }).join("");

    var values = site.i18n.get("about.values", company.values).map(function (value) {
      return '' +
        '<article class="value-card reveal">' +
          '<h3>' + e(value.title) + '</h3>' +
          '<p>' + e(value.text) + '</p>' +
        '</article>';
    }).join("");

    var stats = site.i18n.get("stats", company.stats).map(function (stat) {
      return '' +
        '<div class="about-stat">' +
          '<strong>' + e(stat.value) + '</strong>' +
          '<span>' + e(stat.label) + '</span>' +
        '</div>';
    }).join("");

    return '' +
      site.sections.pageHero({
        eyebrow: site.i18n.get("about.eyebrow"),
        eyebrowKey: "about.eyebrow",
        title: site.i18n.get("about.title"),
        titleKey: "about.title",
        text: heroText,
        textKey: "about.paragraphs",
        image: company.heroImages[1],
        tone: "about"
      }) +
      '<section id="about-content" class="section about-section">' +
        '<div class="container about-grid">' +
          '<div class="about-media reveal">' +
            '<img src="' + e(company.heroImages[1]) + '" alt="Smart Tech workspace" loading="lazy">' +
          '</div>' +
          '<div class="about-copy reveal">' +
            paragraphs +
            '<div class="about-proof-grid">' + stats + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="container values-grid">' + values + '</div>' +
      '</section>';
  };
})(window.SmartTech);
