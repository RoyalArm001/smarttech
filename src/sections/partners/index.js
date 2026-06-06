(function (site) {
  function partnersCopy() {
    var dictionaries = {
      hy: {
        clientsTitle: "Կազմակերպություններ, որոնց մատուցել ենք ծառայություններ",
        clientsText: "Այստեղ նշված են ընկերություններ և կառույցներ, որոնց օբյեկտներում Smart Tech-ը կատարել է նախագծում, մոնտաժ, կարգաբերում կամ տեխնիկական սպասարկում։",
        techTitle: "Կիրառված սարքավորումների բրենդներ",
        techText: "Սրանք արտադրող բրենդներ են, որոնց սարքավորումներով իրականացվել են անվտանգության, BMS, կապի, էլեկտրամոնտաժի և աուդիո լուծումներ։"
      },
      en: {
        clientsTitle: "Organizations we have served",
        clientsText: "These are companies and facilities where Smart Tech has provided design, installation, setup or technical support services.",
        techTitle: "Equipment brands used in our solutions",
        techText: "These manufacturer brands are used in security, BMS, communication, electrical and audio system projects delivered by Smart Tech."
      },
      ru: {
        clientsTitle: "Организации, которым мы предоставляли услуги",
        clientsText: "Здесь указаны компании и объекты, где Smart Tech выполняла проектирование, монтаж, настройку или техническое обслуживание.",
        techTitle: "Бренды оборудования, применяемые в решениях",
        techText: "Это производители оборудования для систем безопасности, BMS, связи, электромонтажа и аудио, с которыми реализовывались решения Smart Tech."
      },
      be: {
        clientsTitle: "Арганізацыі, якім мы аказвалі паслугі",
        clientsText: "Тут пазначаны кампаніі і аб'екты, дзе Smart Tech выконваў праектаванне, мантаж, наладку або тэхнічнае абслугоўванне.",
        techTitle: "Брэнды абсталявання, выкарыстаныя ў рашэннях",
        techText: "Гэтыя вытворцы выкарыстоўваюцца ў праектах бяспекі, BMS, сувязі, электрамантажу і аўдыё."
      },
      fr: {
        clientsTitle: "Organisations auxquelles nous avons fourni des services",
        clientsText: "Ces entreprises et sites ont bénéficié des services de conception, d'installation, de configuration ou de support technique de Smart Tech.",
        techTitle: "Marques d'équipements utilisées dans nos solutions",
        techText: "Ces fabricants sont utilisés dans les projets de sécurité, BMS, communication, électricité et audio livrés par Smart Tech."
      }
    };

    return site.i18n.pickLanguageDictionary(dictionaries);
  }

  site.sections.partners = function partners() {
    var e = site.utils.escapeHtml;
    var copy = partnersCopy();

    function logoGrid(items, extraClass) {
      return items.map(function (partner) {
        return "" +
          '<div class="partner-logo ' + e(extraClass || "") + ' reveal">' +
            '<img src="' + e(partner.logo) + '" alt="' + e(partner.name) + '" loading="lazy">' +
          "</div>";
      }).join("");
    }

    var technologyLogos = logoGrid(site.content.technologyPartners || [], "partner-logo-tech");

    var technologyBlock = technologyLogos ? (
      '<div class="partner-group partner-group-spaced">' +
        '<div class="partner-group-head reveal">' +
          "<h2>" + e(copy.techTitle) + "</h2>" +
          "<p>" + e(copy.techText) + "</p>" +
        "</div>" +
        '<div class="partners-grid partners-grid-tech">' + technologyLogos + "</div>" +
      "</div>"
    ) : "";

    return "" +
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
          technologyBlock +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
