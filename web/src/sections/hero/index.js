(function (site) {
  site.sections.hero = function hero() {
    var e = site.utils.escapeHtml;
    var company = site.content.company;
    var language = site.i18n.language || "hy";
    var heroActionCopy = site.i18n.pickLanguageDictionary({
      hy: {
        primary: site.i18n.get("common.requestSurvey", "Պատվիրել չափագրում"),
        secondary: site.i18n.get("common.proposal", "Ստանալ կոմերցիոն առաջարկ"),
        panelEyebrow: "Ինչու ընտրել Smart Tech",
        panelPoints: [
          "Մեկ թիմ՝ նախագծումից մինչև սպասարկում",
          "Լիցենզավորված և փորձառու ինժեներական կազմ",
          "Չափագրում + հաշվարկ + հստակ իրականացում"
        ]
      },
      en: {
        primary: site.i18n.get("common.requestSurvey", "Request site survey"),
        secondary: site.i18n.get("common.proposal", "Get commercial proposal"),
        panelEyebrow: "Why choose Smart Tech",
        panelPoints: [
          "One team from design to maintenance",
          "Licensed and experienced engineering staff",
          "Survey + calculation + clear execution plan"
        ]
      },
      ru: {
        primary: site.i18n.get("common.requestSurvey", "Заказать замер объекта"),
        secondary: site.i18n.get("common.proposal", "Получить коммерческое предложение"),
        panelEyebrow: "Почему выбирают Smart Tech",
        panelPoints: [
          "Одна команда от проекта до сервиса",
          "Лицензированный и опытный инженерный состав",
          "Замер + расчет + понятный план реализации"
        ]
      }
    }, language);
    var heroTitle = site.i18n.get("hero.title");
    var heroTitleMarkup = heroTitle === company.name
      ? '<h1 class="hero-title notranslate" translate="no" lang="en" data-no-translate="brand" data-i18n-key="hero.title">' + e(heroTitle) + '</h1>'
      : '<h1 class="hero-title" data-i18n-key="hero.title">' + e(heroTitle) + '</h1>';
    var panelPoints = heroActionCopy.panelPoints.map(function (item) {
      return "<li>" + e(item) + "</li>";
    }).join("");

    return '' +
      '<section id="top" class="hero" style="--hero-image: url(' + e(company.heroImages[0]) + ')">' +
        '<div class="hero-overlay">' +
          '<div class="container hero-grid">' +
            '<div class="hero-copy reveal">' +
              '<p class="hero-kicker" data-i18n-key="hero.kicker">' + e(site.i18n.get("hero.kicker")) + '</p>' +
              heroTitleMarkup +
              '<p class="hero-lead" data-i18n-key="hero.lead">' + e(site.i18n.get("hero.lead")) + '</p>' +
              '<div class="button-row">' +
                '<a class="button button-primary" href="' + e(site.utils.pageUrl("request")) + '">' + e(heroActionCopy.primary) + '</a>' +
                '<a class="button button-light" href="' + e(site.utils.pageUrl("request")) + '">' + e(heroActionCopy.secondary) + '</a>' +
              '</div>' +
            '</div>' +
            '<div class="hero-panel reveal">' +
              '<span>' + e(heroActionCopy.panelEyebrow) + '</span>' +
              '<strong class="notranslate" translate="no" lang="en" data-no-translate="brand">' + e(company.name) + '</strong>' +
              '<ul class="hero-panel-list">' + panelPoints + '</ul>' +
              '<a href="' + e(site.utils.pageUrl("services")) + '" data-i18n-key="common.viewServices">' + e(site.i18n.get("common.viewServices")) + '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
