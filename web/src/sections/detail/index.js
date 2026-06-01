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

  function detailGalleryCopy(kind, id) {
    var language = site.i18n.language || "hy";
    var copyByLanguage = {
      hy: {
        project: {
          eyebrow: "Կատարված աշխատանք",
          title: "Ինչ է իրականացվել օբյեկտում",
          text: "Այս հատվածում ներկայացված են իրական օբյեկտի լուսանկարները՝ համակարգերի տեղադրումը, տարածքի մասշտաբը և կատարված աշխատանքի ընդհանուր որակը գնահատելու համար։",
          suggestion: "Եթե ձեր տարածքը նմանատիպ պահանջներ ունի, կարող ենք գնահատել ռիսկերը և առաջարկել համապատասխան համակարգերի կազմ։"
        },
        service: {
          eyebrow: "Կիրառման օրինակներ",
          title: "Ինչպես է լուծումը աշխատում տարածքում",
          text: "Լուսանկարները օգնում են տեսնել, թե ինչ սարքեր և տեղադրման մոտեցումներ են կիրառվում տարբեր միջավայրերում։ Վերջնական կազմը միշտ ընտրվում է տարածքի չափագրումից հետո։",
          suggestion: "Ուղարկեք տարածքի նկարները կամ հատակագիծը, և մենք կառաջարկենք ճիշտ սարքերի դասը, քանակը և տեղադրման կետերը։"
        },
        services: {
          "video-surveillance": {
            eyebrow: "Տեսադաշտեր",
            title: "Տեսախցիկներ, դիտման անկյուններ և իրական վերահսկման կետեր",
            text: "Տեսահսկման համար կարևոր է ոչ միայն տեսախցիկի տեսակը, այլ նաև տեղադրման բարձրությունը, լուսավորությունը, դիտման անկյունը և արխիվի պահանջվող տևողությունը։",
            suggestion: "Առաջարկում ենք սկսել տարածքի տեսադաշտերի քարտեզից, հետո ընտրել outdoor, indoor, PTZ կամ NVR լուծումը։"
          },
          "fire-security": {
            eyebrow: "Անվտանգության սցենար",
            title: "Հրդեհային ազդարարում, տարհանում և ճիշտ գոտիավորում",
            text: "Այս համակարգերում կարևոր է սենսորների ճիշտ տեղաբաշխումը, տարհանման ազդանշանների լսելիությունը և կառավարման վահանակի հստակ տրամաբանությունը։",
            suggestion: "Լավ առաջարկը սկսվում է գոտիների սխեմայից՝ որտեղ են ռիսկային հատվածները, ելքերը և ազդարարման կետերը։"
          },
          networks: {
            eyebrow: "Ցանցային կառուցվածք",
            title: "Մալուխային ուղիներ, rack և կայուն կապ",
            text: "Ցանցային էջերում ցույց ենք տալիս ոչ թե պարզապես սարք, այլ ամբողջ ենթակառուցվածքը՝ մալուխային ուղիներ, switch-եր, rack և Wi-Fi ծածկույթ։",
            suggestion: "Առաջարկում ենք նախ նշել աշխատատեղերի քանակը, Wi-Fi գոտիները և ապագա ընդլայնման պահուստը։"
          },
          electrical: {
            eyebrow: "Էլեկտրական լուծում",
            title: "Մալուխային ուղիներ, լուսավորություն և բաշխիչ վահաններ",
            text: "Էլեկտրամոնտաժի որակը երևում է մանրամասներում՝ ուղիների մաքրություն, վահանի հավաքում, նշագրում և սպասարկման հասանելիություն։",
            suggestion: "Առաջարկը կազմելու համար անհրաժեշտ են բեռների ցանկը, տարածքի պլանը և լուսավորության/սարքավորումների պահանջները։"
          },
          automation: {
            eyebrow: "Ավտոմատացման տրամաբանություն",
            title: "Սցենարներ, կառավարում և համակարգերի ինտեգրում",
            text: "Smart և BMS լուծումներում ամենակարևորը սարքերի կապակցված աշխատանքն է՝ մուտք, լույս, կլիմա, անվտանգություն և հեռահար կառավարում։",
            suggestion: "Սկսեք այն գործողություններից, որոնք ցանկանում եք ավտոմատացնել, հետո կընտրենք controller-ները և կառավարման ինտերֆեյսը։"
          },
          "systems-design": {
            eyebrow: "Նախագծային հիմք",
            title: "Հաշվարկ, սխեմա և համակարգերի ճիշտ դասավորում",
            text: "Նախագծման փուլում որոշվում է համակարգի հուսալիությունը՝ բեռներ, մալուխային ուղիներ, սարքերի դաս, պահուստ և սպասարկման տրամաբանություն։",
            suggestion: "Առաջարկում ենք սկսել տարածքի պլանից և տեխնիկական պահանջներից, որպեսզի լուծումը լինի հաշվարկված, ոչ թե մոտավոր։"
          }
        }
      },
      en: {
        project: {
          eyebrow: "Delivered work",
          title: "What was implemented on site",
          text: "These photos show the real facility, installation quality, system scale and the overall result.",
          suggestion: "If your site has similar needs, we can assess the risks and propose the right system package."
        },
        service: {
          eyebrow: "Application examples",
          title: "How the solution works in a space",
          text: "The visuals show typical devices and installation approaches. The final configuration is selected after a site survey.",
          suggestion: "Send photos or a floor plan, and we will suggest the right device class, quantity and installation points."
        },
        services: {
          "video-surveillance": {
            eyebrow: "Viewing zones",
            title: "Cameras, viewing angles and real monitoring points",
            text: "CCTV quality depends on camera type, mounting height, lighting, viewing angle and archive duration.",
            suggestion: "Start with a coverage map, then choose outdoor, indoor, PTZ and NVR solutions."
          }
        }
      },
      ru: {
        project: {
          eyebrow: "Выполненная работа",
          title: "Что реализовано на объекте",
          text: "Здесь показаны реальные фотографии объекта, качество монтажа, масштаб системы и итоговый результат.",
          suggestion: "Если у вашего объекта похожие задачи, мы оценим риски и предложим подходящий состав систем."
        },
        service: {
          eyebrow: "Примеры применения",
          title: "Как решение работает в пространстве",
          text: "Фотографии показывают типовые устройства и подход к монтажу. Финальная конфигурация подбирается после обследования объекта.",
          suggestion: "Отправьте фото или план помещения, и мы предложим класс устройств, количество и точки установки."
        },
        services: {
          "video-surveillance": {
            eyebrow: "Зоны обзора",
            title: "Камеры, углы обзора и реальные точки контроля",
            text: "Качество видеонаблюдения зависит от типа камеры, высоты монтажа, освещения, угла обзора и глубины архива.",
            suggestion: "Начните с карты обзора, затем подберем outdoor, indoor, PTZ и NVR-решения."
          }
        }
      },
      be: {
        project: {
          eyebrow: "Выкананая праца",
          title: "Што рэалізавана на аб'екце",
          text: "Тут паказаны рэальныя фота аб'екта, якасць мантажу, маштаб сістэмы і вынік.",
          suggestion: "Калі ў вашага аб'екта падобныя задачы, мы ацэнім рызыкі і прапануем адпаведны склад сістэм."
        },
        service: {
          eyebrow: "Прыклады прымянення",
          title: "Як рашэнне працуе ў прасторы",
          text: "Фота паказваюць тыпавыя прылады і падыход да мантажу. Канчатковая канфігурацыя падбіраецца пасля агляду аб'екта.",
          suggestion: "Дашліце фота або план памяшкання, і мы прапануем клас прылад, колькасць і пункты ўстаноўкі."
        },
        services: {}
      },
      fr: {
        project: {
          eyebrow: "Travail réalisé",
          title: "Ce qui a été installé sur le site",
          text: "Ces photos montrent le site réel, la qualité d'installation, l'échelle du système et le résultat final.",
          suggestion: "Si votre site a des besoins similaires, nous pouvons évaluer les risques et proposer la bonne configuration."
        },
        service: {
          eyebrow: "Exemples d'application",
          title: "Comment la solution fonctionne dans l'espace",
          text: "Les visuels montrent les équipements et les approches d'installation typiques. La configuration finale se choisit après audit du site.",
          suggestion: "Envoyez des photos ou un plan, et nous proposerons le type d'équipement, la quantité et les points d'installation."
        },
        services: {}
      },
      ka: {
        project: {
          eyebrow: "შესრულებული სამუშაო",
          title: "რა განხორციელდა ობიექტზე",
          text: "აქ ჩანს რეალური ობიექტის ფოტოები, მონტაჟის ხარისხი, სისტემის მასშტაბი და საბოლოო შედეგი.",
          suggestion: "თუ თქვენს ობიექტსაც მსგავსი ამოცანები აქვს, შევაფასებთ რისკებს და შემოგთავაზებთ შესაბამის სისტემებს."
        },
        service: {
          eyebrow: "გამოყენების მაგალითები",
          title: "როგორ მუშაობს გადაწყვეტა სივრცეში",
          text: "ფოტოები აჩვენებს ტიპურ მოწყობილობებსა და მონტაჟის მიდგომებს. საბოლოო კონფიგურაცია შეირჩევა ობიექტის დათვალიერების შემდეგ.",
          suggestion: "გამოგვიგზავნეთ ფოტოები ან გეგმა და შემოგთავაზებთ მოწყობილობის კლასს, რაოდენობასა და მონტაჟის წერტილებს."
        },
        services: {}
      }
    };
    var languageCopy = copyByLanguage[language] || copyByLanguage.hy;
    var fallbackCopy = copyByLanguage.hy;
    var base = languageCopy[kind] || fallbackCopy[kind] || fallbackCopy.service;
    var serviceSpecific = kind === "service" && languageCopy.services && languageCopy.services[id];
    var fallbackSpecific = kind === "service" && fallbackCopy.services && fallbackCopy.services[id];
    return Object.assign({}, base, fallbackSpecific || {}, serviceSpecific || {});
  }

  function videoSurveillanceShowcaseMarkup() {
    var e = site.utils.escapeHtml;
    var language = site.i18n.language || "hy";
    var copyByLanguage = {
      hy: {
        eyebrow: "CCTV լուծումներ",
        title: "Տեսահսկում՝ ճիշտ սարքով, ճիշտ տեսադաշտով",
        text: "Ընտրում ենք տեսախցիկը ոչ թե միայն megapixel-ով, այլ տարածքի լույսով, հեռավորությամբ, արխիվի պահանջով և հեռահար մոնիթորինգի հարմարությամբ։",
        brandsTitle: "Աշխատում ենք պրոֆեսիոնալ դասի բրենդների հետ",
        galleryTitle: "Սարքեր ըստ տարածքի",
        cards: [
          { title: "Դրսի տարածքներ", text: "Bullet և turret տեսախցիկներ՝ մուտքեր, բակեր, կայանատեղիներ ու պարագիծ վերահսկելու համար։", image: "/img/cctv/outdoor-bullet.jpg" },
          { title: "Ներսի սրահներ", text: "Dome տեսախցիկներ՝ գրասենյակ, խանութ, հյուրանոց կամ բնակելի շենքի ընդհանուր տարածքներ։", image: "/img/cctv/indoor-dome.jpg" },
          { title: "Մեծ տարածք / PTZ", text: "Շարժվող և zoom ունեցող լուծումներ՝ պահեստների, արտադրամասերի ու բաց տարածքների համար։", image: "/img/cctv/ptz-camera.jpg" },
          { title: "Արխիվ և դիտարկում", text: "NVR/DVR, PoE ցանց, HDD պահեստավորում, հեռահար դիտում և motion alerts մեկ համակարգում։", image: "/img/cctv/monitoring-room.jpg" }
        ],
        specs: ["տեսադաշտի քարտեզ", "գիշերային տեսանելիություն", "PoE ցանց", "NVR/DVR արխիվ", "հեռահար դիտում", "շարժման ծանուցումներ"]
      },
      en: {
        eyebrow: "CCTV solutions",
        title: "Surveillance with the right device and field of view",
        text: "We choose cameras by lighting, distance, archive needs and remote monitoring comfort, not megapixels alone.",
        brandsTitle: "Professional-grade brands we integrate",
        galleryTitle: "Devices by area",
        cards: [
          { title: "Outdoor areas", text: "Bullet and turret cameras for entrances, yards, parking areas and perimeter control.", image: "/img/cctv/outdoor-bullet.jpg" },
          { title: "Indoor spaces", text: "Dome cameras for offices, stores, hotels and shared residential areas.", image: "/img/cctv/indoor-dome.jpg" },
          { title: "Large area / PTZ", text: "Motorized zoom solutions for warehouses, production and open areas.", image: "/img/cctv/ptz-camera.jpg" },
          { title: "Archive and monitoring", text: "NVR/DVR, PoE network, HDD storage, remote viewing and motion alerts in one system.", image: "/img/cctv/monitoring-room.jpg" }
        ],
        specs: ["view map", "night vision", "PoE network", "NVR/DVR archive", "remote viewing", "motion alerts"]
      }
    };
    var copy = copyByLanguage[language] || copyByLanguage.hy;
    var brands = ["HIKVISION", "Dahua", "AXIS", "Hanwha Vision", "UNV", "Bosch", "Avigilon", "Ubiquiti"];
    var brandMarkup = brands.map(function (brand) {
      return '<span class="cctv-brand-logo notranslate" translate="no">' + e(brand) + "</span>";
    }).join("");
    var cardMarkup = copy.cards.map(function (card, index) {
      return "" +
        '<article class="cctv-device-card cctv-device-card-' + (index + 1) + '">' +
          '<span class="cctv-card-photo" style="background-image: url(&quot;' + e(card.image) + '&quot;)">' +
            '<img src="' + e(card.image) + '" alt="' + e(card.title) + '" loading="lazy" decoding="async">' +
          '</span>' +
          '<div>' +
            '<span>' + e(String(index + 1).padStart(2, "0")) + "</span>" +
            "<h3>" + e(card.title) + "</h3>" +
            "<p>" + e(card.text) + "</p>" +
          "</div>" +
        "</article>";
    }).join("");
    var specMarkup = copy.specs.map(function (item) {
      return '<span>' + e(item) + '</span>';
    }).join("");

    return "" +
      '<section class="cctv-showcase reveal">' +
        '<div class="cctv-showcase-head">' +
          '<span class="eyebrow">' + e(copy.eyebrow) + "</span>" +
          "<h2>" + e(copy.title) + "</h2>" +
          "<p>" + e(copy.text) + "</p>" +
        "</div>" +
        '<div class="cctv-brand-panel">' +
          "<h3>" + e(copy.brandsTitle) + "</h3>" +
          '<div class="cctv-brand-wall">' + brandMarkup + "</div>" +
        "</div>" +
        '<div class="cctv-device-head">' +
          "<h3>" + e(copy.galleryTitle) + "</h3>" +
          '<div class="cctv-specs">' + specMarkup + "</div>" +
        "</div>" +
        '<div class="cctv-device-grid">' + cardMarkup + "</div>" +
      "</section>";
  }

  function detailShell(kind, type, id, data, title, lead, chips, images, backHref, systemItems) {
    var e = site.utils.escapeHtml;
    var heroImage = images[0] || data.image || "";
    var systemGallery = systemGalleryMarkup(systemItems || []);
    var serviceShowcase = id === "video-surveillance" ? videoSurveillanceShowcaseMarkup() : "";
    var galleryCopy = detailGalleryCopy(kind, id);

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
              '<span class="eyebrow">' + e(galleryCopy.eyebrow) + "</span>" +
              '<h2 class="section-title">' + e(galleryCopy.title) + "</h2>" +
            "</div>" +
            '<p class="section-copy">' + e(galleryCopy.text) + "</p>" +
          "</div>" +
          '<div class="detail-gallery reveal">' + galleryMarkup(images, title) + "</div>" +
          '<aside class="detail-gallery-suggestion reveal">' +
            '<span>' + e(galleryCopy.eyebrow) + "</span>" +
            '<p>' + e(galleryCopy.suggestion) + "</p>" +
            '<a href="' + e(site.utils.pageUrl("request")) + '">' + e(site.i18n.get("common.proposal", "Request")) + "</a>" +
          "</aside>" +
          serviceShowcase +
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
      "service",
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
      "project",
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
