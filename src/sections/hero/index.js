(function (site) {
  site.sections.hero = function hero() {
    var e = site.utils.escapeHtml;
    var company = site.content.company;
    var language = site.i18n.language || "hy";
    var heroActionCopy = site.i18n.pickLanguageDictionary({
      hy: {
        primary: site.i18n.get("common.requestSurvey", "Պատվիրել չափագրում"),
        secondary: site.i18n.get("common.proposal", "Ստանալ կոմերցիոն առաջարկ"),
        panelEyebrow: "Մեր ծառայությունները",
        panelPoints: [
          "Աուդիո համակարգեր և ինտեգրացիա",
          "Տեսահսկման համակարգեր",
          "Հրդեհային ազդարարման ու մուտքի վերահսկում",
          "Ցանցեր, Wi‑Fi և լարանցում",
          "Շենքերի ավտոմատացում և BMS",
          "Էլեկտրամոնտաժային աշխատանքներ",
          "24/7 մոնիթորինգ և սպասարկում"
        ]
      },
      en: {
        primary: site.i18n.get("common.requestSurvey", "Request site survey"),
        secondary: site.i18n.get("common.proposal", "Get commercial proposal"),
        panelEyebrow: "What we do",
        panelPoints: [
          "Audio systems and integration",
          "CCTV and video surveillance",
          "Fire alarm and access control",
          "Networking, Wi‑Fi and cabling",
          "Smart building automation and BMS",
          "Electrical installation works",
          "24/7 monitoring and support"
        ]
      },
      ru: {
        primary: site.i18n.get("common.requestSurvey", "Заказать замер объекта"),
        secondary: site.i18n.get("common.proposal", "Получить коммерческое предложение"),
        panelEyebrow: "Что мы делаем",
        panelPoints: [
          "Аудиосистемы и интеграция",
          "Видеонаблюдение и CCTV",
          "Пожарная сигнализация и контроль доступа",
          "Сети, Wi‑Fi и кабельная разводка",
          "Автоматизация зданий и BMS",
          "Электромонтажные работы",
          "24/7 мониторинг и обслуживание"
        ]
      }
    }, language);
    var heroTitle = site.i18n.get("hero.title");
    var heroTitleMarkup = heroTitle === company.name
      ? '<h1 class="hero-title notranslate" translate="no" lang="en" data-no-translate="brand" data-i18n-key="hero.title">' + e(heroTitle) + '</h1>'
      : '<h1 class="hero-title" data-i18n-key="hero.title">' + e(heroTitle) + '</h1>';
    var panelPoints = heroActionCopy.panelPoints.map(function (item, index) {
      return '<li style="--delay:' + index + '">' + e(item) + "</li>";
    }).join("");

    var heroImage = company.heroImages[0];
    var heroImgAttrs = site.utils.imageLoadingAttrs({
      fetchpriority: "high",
      decoding: "async",
      width: 1600,
      height: 900
    });

    return '' +
      '<section id="top" class="hero">' +
        '<img class="hero-media" src="' + e(heroImage) + '" alt="" ' + heroImgAttrs + '>' +
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
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
