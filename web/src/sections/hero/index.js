(function (site) {
  site.sections.hero = function hero() {
    var e = site.utils.escapeHtml;
    var company = site.content.company;
    var heroTitle = site.i18n.get("hero.title");
    var heroTitleMarkup = heroTitle === company.name
      ? '<h1 class="notranslate" translate="no" lang="en" data-no-translate="brand" data-i18n-key="hero.title">' + e(heroTitle) + '</h1>'
      : '<h1 data-i18n-key="hero.title">' + e(heroTitle) + '</h1>';

    return '' +
      '<section id="top" class="hero" style="--hero-image: url(' + e(company.heroImages[0]) + ')">' +
        '<div class="hero-overlay">' +
          '<div class="container hero-grid">' +
            '<div class="hero-copy reveal">' +
              '<p class="hero-kicker" data-i18n-key="hero.kicker">' + e(site.i18n.get("hero.kicker")) + '</p>' +
              heroTitleMarkup +
              '<p data-i18n-key="hero.lead">' + e(site.i18n.get("hero.lead")) + '</p>' +
              '<div class="button-row">' +
                '<a class="button button-primary" href="' + e(site.utils.pageUrl("request")) + '" data-i18n-key="common.proposal">' + e(site.i18n.get("common.proposal", site.i18n.get("common.consultation"))) + '</a>' +
                '<a class="button button-light" href="' + e(site.utils.pageUrl("projects")) + '" data-i18n-key="common.viewProjects">' + e(site.i18n.get("common.viewProjects")) + '</a>' +
              '</div>' +
            '</div>' +
            '<div class="hero-panel reveal">' +
              '<span data-i18n-key="trust.title">' + e(site.i18n.get("trust.title")) + '</span>' +
              '<strong class="notranslate" translate="no" lang="en" data-no-translate="brand">' + e(company.name) + '</strong>' +
              '<a href="' + e(site.utils.pageUrl("services")) + '" data-i18n-key="common.viewServices">' + e(site.i18n.get("common.viewServices")) + '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
