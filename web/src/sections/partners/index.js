(function (site) {
  function partnersCopy() {
    var dictionaries = {
      hy: {
        clientsTitle: "Հաճախորդներ և վստահած կառույցներ",
        clientsText: "Կայքում պահում ենք այն բրենդները, որոնց օբյեկտներում Smart Tech-ը կատարել է նախագծում, տեղադրում կամ սպասարկում։",
        techTitle: "Սարքավորումների արտադրող գործընկերներ",
        techText: "PDF ներկայացման գործընկերների բաժնից ավելացված տեխնոլոգիական բրենդներ՝ անվտանգության, BMS, էլեկտրամոնտաժի, աուդիո և կապի համակարգերի համար։"
      },
      en: {
        clientsTitle: "Clients and trusted organizations",
        clientsText: "The site keeps the brands whose facilities include Smart Tech design, installation or support work.",
        techTitle: "Equipment manufacturer partners",
        techText: "Technology brands added from the partner section of the PDF presentation for security, BMS, electrical, audio and communication systems."
      },
      ru: {
        clientsTitle: "Клиенты и доверившие нам объекты",
        clientsText: "На сайте сохранены бренды, на объектах которых Smart Tech выполнял проектирование, монтаж или обслуживание.",
        techTitle: "Партнеры-производители оборудования",
        techText: "Технологические бренды из раздела партнеров PDF-презентации для систем безопасности, BMS, электромонтажа, аудио и связи."
      },
      be: {
        clientsTitle: "Кліенты і арганізацыі, якія нам даверылі",
        clientsText: "На сайце захаваны брэнды, на аб'ектах якіх Smart Tech выконваў праектаванне, мантаж або абслугоўванне.",
        techTitle: "Партнёры-вытворцы абсталявання",
        techText: "Тэхналагічныя брэнды з раздзела партнёраў PDF-прэзентацыі для бяспекі, BMS, электрамантажу, аўдыё і сувязі."
      },
      fr: {
        clientsTitle: "Clients et organisations de confiance",
        clientsText: "Le site conserve les marques dont les sites ont bénéficié de la conception, de l'installation ou du support Smart Tech.",
        techTitle: "Partenaires fabricants d'équipements",
        techText: "Marques technologiques ajoutées depuis la section partenaires de la présentation PDF pour la sécurité, le BMS, l'électricité, l'audio et les communications."
      },
      ka: {
        clientsTitle: "კლიენტები და სანდო ორგანიზაციები",
        clientsText: "საიტზე შენახულია ბრენდები, რომელთა ობიექტებზე Smart Tech-მა შეასრულა პროექტირება, მონტაჟი ან მხარდაჭერა.",
        techTitle: "აღჭურვილობის მწარმოებელი პარტნიორები",
        techText: "PDF პრეზენტაციის პარტნიორების ნაწილიდან დამატებული ტექნოლოგიური ბრენდები უსაფრთხოების, BMS-ის, ელექტრო, აუდიო და საკომუნიკაციო სისტემებისთვის."
      }
    };

    return dictionaries[site.i18n.language] || dictionaries.hy;
  }

  site.sections.partners = function partners() {
    var e = site.utils.escapeHtml;
    var copy = partnersCopy();

    function logoGrid(items, extraClass) {
      return items.map(function (partner) {
        return '' +
          '<div class="partner-logo ' + e(extraClass || "") + ' reveal">' +
            '<img src="' + e(partner.logo) + '" alt="' + e(partner.name) + '" loading="lazy">' +
          '</div>';
      }).join("");
    }

    var logos = logoGrid(site.content.partners || [], "");
    var technologyLogos = logoGrid(site.content.technologyPartners || [], "partner-logo-tech");

    var technologyBlock = technologyLogos ? (
      '<div class="partner-group partner-group-spaced">' +
        '<div class="partner-group-head reveal">' +
          '<h2>' + e(copy.techTitle) + '</h2>' +
          '<p>' + e(copy.techText) + '</p>' +
        '</div>' +
        '<div class="partners-grid partners-grid-tech">' + technologyLogos + '</div>' +
      '</div>'
    ) : "";

    var clientsBlock = logos ? (
      '<div class="partner-group">' +
        '<div class="partner-group-head reveal">' +
          '<h2>' + e(copy.clientsTitle) + '</h2>' +
          '<p>' + e(copy.clientsText) + '</p>' +
        '</div>' +
        '<div class="partners-grid">' + logos + '</div>' +
      '</div>'
    ) : "";

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
          clientsBlock +
          technologyBlock +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
