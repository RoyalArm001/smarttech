(function (site) {
  site.sections.pageHero = function pageHero(options) {
    var e = site.utils.escapeHtml;
    var config = options || {};
    var image = config.image || site.content.company.heroImages[0];
    var tone = config.tone || "default";
    var eyebrowKey = config.eyebrowKey ? ' data-i18n-key="' + e(config.eyebrowKey) + '"' : "";
    var titleKey = config.titleKey ? ' data-i18n-key="' + e(config.titleKey) + '"' : "";
    var textKey = config.textKey ? ' data-i18n-key="' + e(config.textKey) + '"' : "";
    var actionKey = config.actionKey ? ' data-i18n-key="' + e(config.actionKey) + '"' : "";
    var action = config.href && config.action ? '' +
      '<a class="button button-light page-hero-action" href="' + e(config.href) + '"' + actionKey + '>' + e(config.action) + '</a>' :
      "";

    return '' +
      '<section class="page-hero page-hero-' + e(tone) + '" style="--page-hero-image: url(' + e(image) + ')">' +
        '<div class="page-hero-overlay">' +
          '<div class="container page-hero-grid">' +
            '<div class="page-hero-copy reveal">' +
              '<span class="eyebrow"' + eyebrowKey + '>' + e(config.eyebrow || "") + '</span>' +
              '<h1' + titleKey + '>' + e(config.title || "") + '</h1>' +
              '<p' + textKey + '>' + e(config.text || "") + '</p>' +
              action +
            '</div>' +
            '<div class="page-hero-visual reveal" aria-hidden="true">' +
              '<span class="trace trace-a"></span>' +
              '<span class="trace trace-b"></span>' +
              '<span class="trace trace-c"></span>' +
              '<span class="node node-a"></span>' +
              '<span class="node node-b"></span>' +
              '<span class="node node-c"></span>' +
              '<span class="node node-d"></span>' +
              '<span class="panel-line line-a"></span>' +
              '<span class="panel-line line-b"></span>' +
              '<span class="panel-line line-c"></span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
