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
          },
          "fire-security": {
            eyebrow: "Safety scenario",
            title: "Fire alarm, evacuation and correct zoning",
            text: "These systems depend on sensor placement, evacuation audibility and clear panel logic.",
            suggestion: "A good proposal starts with a zone diagram showing risk areas, exits and notification points."
          },
          networks: {
            eyebrow: "Network structure",
            title: "Cable routes, racks and stable connectivity",
            text: "Network pages show the full infrastructure: cable routes, switches, racks and Wi-Fi coverage.",
            suggestion: "Specify workstation count, Wi-Fi zones and future expansion needs first."
          },
          electrical: {
            eyebrow: "Electrical solution",
            title: "Cable routes, lighting and distribution panels",
            text: "Electrical quality shows in details: clean routes, panel assembly, labeling and service access.",
            suggestion: "We need load list, floor plan and lighting or equipment requirements for a proper proposal."
          },
          automation: {
            eyebrow: "Automation logic",
            title: "Scenarios, control and system integration",
            text: "In smart and BMS solutions, coordinated operation matters: access, lighting, climate, security and remote control.",
            suggestion: "Start with the actions you want automated, then we choose controllers and the control interface."
          },
          "systems-design": {
            eyebrow: "Design foundation",
            title: "Calculations, diagrams and correct system layout",
            text: "At design stage reliability is defined: loads, cable routes, device class, redundancy and maintenance logic.",
            suggestion: "Start with the floor plan and technical requirements so the solution is calculated, not approximate."
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
          },
          "fire-security": {
            eyebrow: "Сценарий безопасности",
            title: "Пожарная сигнализация, эвакуация и правильное зонирование",
            text: "В этих системах важны размещение датчиков, слышимость эвакуации и понятная логика панели управления.",
            suggestion: "Хорошее предложение начинается со схемы зон: рисковые участки, выходы и точки оповещения."
          },
          networks: {
            eyebrow: "Сетевая структура",
            title: "Кабельные трассы, rack и стабильная связь",
            text: "В сетевых блоках показываем не только устройство, а всю инфраструктуру: трассы, switch, rack и Wi-Fi покрытие.",
            suggestion: "Сначала укажите количество рабочих мест, Wi-Fi зоны и запас на будущее расширение."
          },
          electrical: {
            eyebrow: "Электрическое решение",
            title: "Кабельные трассы, освещение и распределительные щиты",
            text: "Качество электромонтажа видно в деталях: чистые трассы, сборка щита, маркировка и доступ для обслуживания.",
            suggestion: "Для расчета нужны перечень нагрузок, план помещения и требования к освещению или оборудованию."
          },
          automation: {
            eyebrow: "Логика автоматизации",
            title: "Сценарии, управление и интеграция систем",
            text: "В smart и BMS решениях важна согласованная работа: доступ, свет, климат, безопасность и удаленное управление.",
            suggestion: "Начните с действий, которые хотите автоматизировать, затем подберем контроллеры и интерфейс."
          },
          "systems-design": {
            eyebrow: "Проектная основа",
            title: "Расчет, схема и правильная компоновка систем",
            text: "На этапе проектирования определяется надежность: нагрузки, трассы, класс устройств, резерв и логика обслуживания.",
            suggestion: "Начните с плана объекта и технических требований, чтобы решение было рассчитано, а не приблизительно."
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
      }
    };
    var languageCopy = site.i18n.pickLanguageDictionary(copyByLanguage, language);
    var fallbackCopy = site.i18n.secondaryLanguageDictionary(copyByLanguage, language);
    var base = languageCopy[kind] || fallbackCopy[kind] || fallbackCopy.service;
    var serviceSpecific = kind === "service" && languageCopy.services && languageCopy.services[id];
    var fallbackSpecific = kind === "service" && !serviceSpecific && fallbackCopy.services && fallbackCopy.services[id];
    return Object.assign({}, base, serviceSpecific || {}, fallbackSpecific || {});
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
      },
      ru: {
        eyebrow: "CCTV-решения",
        title: "Видеонаблюдение с правильной камерой и зоной обзора",
        text: "Мы подбираем камеры по освещению, дистанции, требованиям к архиву и удобству удаленного мониторинга, а не только по мегапикселям.",
        brandsTitle: "Бренды профессионального класса",
        galleryTitle: "Оборудование по зонам объекта",
        cards: [
          { title: "Наружные зоны", text: "Bullet и turret камеры для входов, дворов, парковок и периметра.", image: "/img/cctv/outdoor-bullet.jpg" },
          { title: "Внутренние помещения", text: "Dome камеры для офисов, магазинов, отелей и общих зон жилых зданий.", image: "/img/cctv/indoor-dome.jpg" },
          { title: "Большая площадь / PTZ", text: "Поворотные решения с zoom для складов, производств и открытых площадок.", image: "/img/cctv/ptz-camera.jpg" },
          { title: "Архив и мониторинг", text: "NVR/DVR, PoE-сеть, HDD-архив, удаленный просмотр и уведомления о движении в одной системе.", image: "/img/cctv/monitoring-room.jpg" }
        ],
        specs: ["карта обзора", "ночное видение", "PoE-сеть", "архив NVR/DVR", "удаленный просмотр", "уведомления о движении"]
      }
    };
    var copy = site.i18n.pickLanguageDictionary(copyByLanguage, language);
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

  function perServiceScope(id, language) {
    var dictionaries = {
      hy: {
        "systems-design": {
          includes: ["Օբյեկտի ուսումնասիրություն և տեխնիկական առաջադրանք", "Էլեկտրամատակարարման և թույլ հոսանքի սխեմաներ", "Սարքերի դասավորություն, բեռների և մալուխների հաշվարկ", "Նախագծային փաստաթղթերի փաթեթ"],
          stages: ["Տարածքի ուսումնասիրություն և պահանջների ֆիքսում", "Կոնցեպտ և համակարգերի սխեմա", "Հաշվարկներ, սարքերի ընտրություն և գծագրեր", "Նախագծի համաձայնեցում և հանձնում"],
          result: "Ստանում եք հաշվարկված, համաձայնեցված նախագիծ, որով կարելի է ճշգրիտ գնահատել բյուջեն և սկսել մոնտաժը։"
        },
        "equipment-supply": {
          includes: ["Սարքավորումների ընտրություն ըստ նախագծի", "Բրենդների և մատակարարների համեմատություն", "Համատեղելիության և երաշխիքների ստուգում", "Մատակարարման ժամանակացույց"],
          stages: ["Տեխնիկական պահանջների ճշտում", "Առաջարկների հավաքում և գնագոյացում", "Պատվեր և որակի ստուգում", "Մատակարարում օբյեկտ ժամկետում"],
          result: "Ստանում եք ճիշտ ընտրված, համատեղելի և երաշխիքով սարքավորում՝ առանց ավելորդ ծախսերի և ուշացումների։"
        },
        installation: {
          includes: ["Մալուխային ուղիների և լոտկաների տեղադրում", "Սարքավորումների մոնտաժ և ամրացում", "Կապակցումներ և նշագրում", "Առաջնային փորձարկում"],
          stages: ["Տրասների նշում և պատրաստում", "Մալուխավորում և ուղիների անցկացում", "Սարքերի տեղադրում և միացում", "Ստուգում և մաքրում"],
          result: "Ստանում եք մաքուր, ճշգրիտ և սպասարկելի մոնտաժ՝ պատրաստ ծրագրավորման և գործարկման փուլին։"
        },
        "automation-cabinets": {
          includes: ["Պահարանի կազմ ըստ նախագծի", "Ավտոմատների, ռելեների և controller-ների տեղադրում", "Ներքին մոնտաժ, նշագրում և կապակցում", "Նախնական կարգաբերում և ստուգում"],
          stages: ["Սխեմայի ուսումնասիրություն և կազմի պատրաստում", "Բաղադրիչների տեղադրում պահարանում", "Ներքին էլեկտրական միացումներ և նշագրում", "Թեստ, պիտակավորում և հանձնում"],
          result: "Ստանում եք պատրաստի, ստուգված ավտոմատիկայի պահարան՝ հստակ նշագրմամբ և շահագործման հրահանգով։"
        },
        "commissioning-programming": {
          includes: ["Controller-ների և սարքերի ծրագրավորում", "Համակարգերի համատեղ աշխատանքի կարգաբերում", "Օգտատերերի, սցենարների և ծանուցումների կարգավորում", "Գործարկման փորձարկում"],
          stages: ["Սարքերի ստուգում և կապի հաստատում", "Ծրագրավորում և սցենարների ներդրում", "Համակարգերի համատեղ թեստավորում", "Շահագործման հանձնում և հրահանգավորում"],
          result: "Ստանում եք կայուն աշխատող, համաձայնեցված համակարգ՝ պատրաստ ամենօրյա շահագործման։"
        },
        interfaces: {
          includes: ["Կառավարման ինտերֆեյսի կառուցվածք", "Դիսպետչերիզացիայի էկրաններ և քարտեզներ", "Մոնիթորինգ և ծանուցումների վահանակ", "Հեռահար մուտքի կարգավորում"],
          stages: ["Պահանջների և սցենարների վերլուծություն", "Ինտերֆեյսի դիզայն և կառուցում", "Համակարգերի հետ ինտեգրում", "Թեստ և օգտագործման հրահանգ"],
          result: "Ստանում եք պարզ, հարմարավետ կառավարման ինտերֆեյս՝ արագ արձագանքման և հստակ մոնիթորինգի համար։"
        },
        "video-surveillance": {
          includes: ["IP/HD տեսախցիկներ (bullet, dome, PTZ)", "NVR/DVR և HDD արխիվ", "PoE ցանց և մալուխավորում", "Հեռահար դիտում և շարժման ծանուցումներ"],
          stages: ["Տեսադաշտերի քարտեզ և կետերի որոշում", "Տեսախցիկների մոնտաժ և մալուխավորում", "NVR/DVR կարգաբերում և արխիվ", "Հեռահար մուտքի և ծանուցումների կարգավորում"],
          result: "Ստանում եք հստակ տեսադաշտով, հուսալի արխիվով և հեռահար դիտմամբ տեսահսկման համակարգ։"
        },
        "fire-security": {
          includes: ["Հրդեհային ազդարարման վահանակ", "Ծխի, ջերմության սենսորներ և ձեռքի կոճակներ", "Ձայնային և լուսային տարհանման ազդանշաններ", "Գոտիավորում և սցենարներ"],
          stages: ["Ռիսկերի և գոտիների սխեմա", "Սենսորների և վահանակի մոնտաժ", "Միացում, գոտիավորում և ծրագրավորում", "Փորձարկում և հանձնում"],
          result: "Ստանում եք սերտիֆիկացված, ստուգված հրդեհային անվտանգության համակարգ՝ հստակ տարհանման սցենարով։"
        },
        networks: {
          includes: ["Կառուցվածքային մալուխավորում (պղինձ/օպտիկա)", "Rack պահարան, switch և patch panel", "Wi-Fi access point-եր և ծածկույթ", "Գծերի նշագրում և թեստավորում"],
          stages: ["Աշխատատեղերի և գոտիների պլան", "Մալուխավորում և rack-ի հավաքում", "Ակտիվ սարքերի կարգաբերում", "Թողունակության թեստ և հանձնում"],
          result: "Ստանում եք կայուն, արագ և ընդլայնելի ցանց՝ հուսալի ներքին կապով։"
        },
        electrical: {
          includes: ["Բաշխիչ վահաններ և ավտոմատներ", "Լուսավորության և վարդակների գծեր", "Մալուխային ուղիներ և հողանցում", "Չափումներ և նշագրում"],
          stages: ["Բեռների հաշվարկ և գծերի պլան", "Մալուխավորում և ուղիների մոնտաժ", "Վահանների հավաքում և միացում", "Չափումներ, ստուգում և հանձնում"],
          result: "Ստանում եք անվտանգ, ճիշտ հաշվարկված և սպասարկելի էլեկտրական ենթակառուցվածք։"
        },
        automation: {
          includes: ["BMS controller-ներ և սենսորներ", "Մուտքի, լույսի, կլիմայի ինտեգրում", "Կառավարման սցենարներ", "Մոնիթորինգ dashboard և հեռահար մուտք"],
          stages: ["Ավտոմատացման սցենարների սահմանում", "Controller-ների և սենսորների մոնտաժ", "Ինտեգրում և ծրագրավորում", "Թեստ և օգտագործման հրահանգ"],
          result: "Ստանում եք միասնական, հարմար և վերահսկելի smart կառավարման համակարգ։"
        },
        "full-design": {
          includes: ["Բոլոր ինժեներական համակարգերի համալիր նախագիծ", "Սարքերի դասավորություն և հաշվարկներ", "Ռեզերվներ և ընդլայնման պաշար", "Շահագործման տրամաբանություն և փաստաթղթեր"],
          stages: ["Օբյեկտի համալիր ուսումնասիրություն", "Համակարգերի համատեղ կոնցեպտ", "Հաշվարկներ, գծագրեր և կազմ", "Համաձայնեցում և հանձնում"],
          result: "Ստանում եք միասնական, համաձայնեցված համալիր նախագիծ՝ բոլոր համակարգերը մեկ տրամաբանության մեջ։"
        },
        "audio-systems": {
          includes: ["Բարձրախոսներ և ուժեղացուցիչներ", "Public Address և zone controller", "Միկրոֆոններ և mixer", "Ձայնի կարգաբերում ըստ գոտիների"],
          stages: ["Ակուստիկ գոտիների հաշվարկ", "Բարձրախոսների տեղադրում և մալուխավորում", "Սարքերի միացում և կարգաբերում", "Ձայնի հավասարակշռում և հանձնում"],
          result: "Ստանում եք հավասարակշռված, հստակ լսելի ձայնային համակարգ բոլոր գոտիներում։"
        },
        wacker: {
          includes: ["Տեխնիկական համակարգի բաղադրիչներ", "Ճշգրիտ տեղադրում և ամրացում", "Կարգաբերում ըստ պահանջների", "Փորձարկում և սպասարկման հրահանգ"],
          stages: ["Պահանջների և պայմանների ուսումնասիրություն", "Մոնտաժ և ամրացում", "Կարգաբերում և ստուգում", "Հանձնում և սպասարկում"],
          result: "Ստանում եք ճշգրիտ տեղադրված և կարգաբերված տեխնիկական համակարգ՝ կայուն աշխատանքով։"
        },
        "powder-coating": {
          includes: ["Մակերեսի մաքրում և նախապատրաստում", "Փոշու հավասար ծածկում", "Ջերմային մշակում (պոլիմերացում)", "Որակի և ծածկույթի վերահսկում"],
          stages: ["Դետալների մաքրում և նախապատրաստում", "Փոշեներկի կիրառում", "Ջեռոցում պոլիմերացում", "Որակի ստուգում և փաթեթավորում"],
          result: "Ստանում եք հավասար, դիմացկուն և էսթետիկ ծածկույթ՝ արտադրական որակով։"
        }
      },
      en: {
        "systems-design": {
          includes: ["Site survey and technical brief", "Power supply and low-current schematics", "Device layout, load and cable calculations", "Complete design documentation package"],
          stages: ["Site survey and requirement capture", "Concept and system schematic", "Calculations, device selection and drawings", "Design approval and handover"],
          result: "You get a calculated, approved design that lets you estimate the budget precisely and start installation with confidence."
        },
        "equipment-supply": {
          includes: ["Equipment selection per design", "Brand and supplier comparison", "Compatibility and warranty verification", "Delivery schedule"],
          stages: ["Clarify technical requirements", "Collect offers and pricing", "Order and quality inspection", "On-time delivery to site"],
          result: "You get correctly selected, compatible, warranty-backed equipment without overspending or delays."
        },
        installation: {
          includes: ["Cable trays and route installation", "Device mounting and fixing", "Connections and labeling", "Initial testing"],
          stages: ["Route marking and preparation", "Cabling and route pulling", "Device installation and connection", "Check and cleanup"],
          result: "You get clean, accurate and serviceable installation, ready for the programming and commissioning stage."
        },
        "automation-cabinets": {
          includes: ["Cabinet composition per design", "Mounting of breakers, relays and controllers", "Internal wiring, labeling and connections", "Initial configuration and testing"],
          stages: ["Schematic review and parts preparation", "Component mounting in the cabinet", "Internal electrical wiring and labeling", "Testing, labeling and handover"],
          result: "You get a ready, tested automation cabinet with clear labeling and an operating manual."
        },
        "commissioning-programming": {
          includes: ["Controller and device programming", "Coordinated system operation setup", "Users, scenarios and notifications configuration", "Commissioning test"],
          stages: ["Device check and connectivity confirmation", "Programming and scenario deployment", "Integrated system testing", "Operational handover and instruction"],
          result: "You get a stable, coordinated system ready for daily operation."
        },
        interfaces: {
          includes: ["Control interface structure", "Dispatching screens and maps", "Monitoring and notifications panel", "Remote access configuration"],
          stages: ["Requirement and scenario analysis", "Interface design and build", "Integration with systems", "Testing and usage guide"],
          result: "You get a simple, convenient control interface for fast response and clear monitoring."
        },
        "video-surveillance": {
          includes: ["IP/HD cameras (bullet, dome, PTZ)", "NVR/DVR and HDD archive", "PoE network and cabling", "Remote viewing and motion alerts"],
          stages: ["Coverage map and point selection", "Camera mounting and cabling", "NVR/DVR setup and archive", "Remote access and alerts configuration"],
          result: "You get a surveillance system with clear coverage, reliable archive and remote viewing."
        },
        "fire-security": {
          includes: ["Fire alarm control panel", "Smoke/heat sensors and manual call points", "Audible and visual evacuation signals", "Zoning and scenarios"],
          stages: ["Risk and zone diagram", "Sensor and panel mounting", "Wiring, zoning and programming", "Testing and handover"],
          result: "You get a certified, tested fire safety system with a clear evacuation scenario."
        },
        networks: {
          includes: ["Structured cabling (copper/fiber)", "Rack, switch and patch panel", "Wi-Fi access points and coverage", "Line labeling and testing"],
          stages: ["Workstation and zone plan", "Cabling and rack assembly", "Active equipment configuration", "Throughput test and handover"],
          result: "You get a stable, fast and scalable network with reliable internal connectivity."
        },
        electrical: {
          includes: ["Distribution panels and breakers", "Lighting and socket lines", "Cable routes and grounding", "Measurements and labeling"],
          stages: ["Load calculation and line plan", "Cabling and route installation", "Panel assembly and connection", "Measurements, check and handover"],
          result: "You get a safe, correctly calculated and serviceable electrical infrastructure."
        },
        automation: {
          includes: ["BMS controllers and sensors", "Access, lighting and climate integration", "Control scenarios", "Monitoring dashboard and remote access"],
          stages: ["Automation scenario definition", "Controller and sensor mounting", "Integration and programming", "Testing and usage guide"],
          result: "You get a unified, comfortable and controllable smart management system."
        },
        "full-design": {
          includes: ["Integrated design of all engineering systems", "Device layout and calculations", "Redundancy and expansion reserve", "Operation logic and documentation"],
          stages: ["Complete facility survey", "Joint system concept", "Calculations, drawings and composition", "Approval and handover"],
          result: "You get a unified, approved integrated design with all systems in one logic."
        },
        "audio-systems": {
          includes: ["Speakers and amplifiers", "Public Address and zone controllers", "Microphones and mixer", "Sound tuning by zones"],
          stages: ["Acoustic zone calculation", "Speaker installation and cabling", "Device connection and setup", "Sound balancing and handover"],
          result: "You get a balanced, clearly audible sound system across all zones."
        },
        wacker: {
          includes: ["Technical system components", "Precise installation and fixing", "Configuration per requirements", "Testing and maintenance guide"],
          stages: ["Requirement and condition review", "Installation and fixing", "Configuration and check", "Handover and maintenance"],
          result: "You get a precisely installed and configured technical system with stable operation."
        },
        "powder-coating": {
          includes: ["Surface cleaning and preparation", "Even powder application", "Thermal curing (polymerization)", "Quality and coating control"],
          stages: ["Part cleaning and preparation", "Powder coating application", "Oven curing / polymerization", "Quality check and packaging"],
          result: "You get an even, durable and aesthetic coating with production-level quality."
        }
      },
      ru: {
        "systems-design": {
          includes: ["Обследование объекта и техническое задание", "Схемы электроснабжения и слаботочных систем", "Расположение устройств, расчет нагрузок и кабелей", "Полный пакет проектной документации"],
          stages: ["Обследование объекта и фиксация требований", "Концепция и схема систем", "Расчеты, подбор устройств и чертежи", "Согласование проекта и сдача"],
          result: "Вы получаете рассчитанный и согласованный проект, который позволяет точно оценить бюджет и начать монтаж."
        },
        "equipment-supply": {
          includes: ["Подбор оборудования по проекту", "Сравнение брендов и поставщиков", "Проверка совместимости и гарантий", "График поставки"],
          stages: ["Уточнение технических требований", "Сбор предложений и расчет стоимости", "Заказ и проверка качества", "Поставка на объект в срок"],
          result: "Вы получаете правильно подобранное, совместимое оборудование с гарантией, без лишних затрат и задержек."
        },
        installation: {
          includes: ["Монтаж кабельных трасс и лотков", "Установка и крепление оборудования", "Подключения и маркировка", "Первичное тестирование"],
          stages: ["Разметка и подготовка трасс", "Прокладка кабелей и трасс", "Установка и подключение устройств", "Проверка и уборка"],
          result: "Вы получаете аккуратный, точный и обслуживаемый монтаж, готовый к этапу программирования и пусконаладки."
        },
        "automation-cabinets": {
          includes: ["Состав шкафа по проекту", "Установка автоматов, реле и контроллеров", "Внутренний монтаж, маркировка и подключения", "Первичная настройка и проверка"],
          stages: ["Изучение схемы и подготовка комплектующих", "Монтаж компонентов в шкафу", "Внутренние электрические подключения и маркировка", "Тестирование, маркировка и сдача"],
          result: "Вы получаете готовый, проверенный шкаф автоматики с четкой маркировкой и инструкцией по эксплуатации."
        },
        "commissioning-programming": {
          includes: ["Программирование контроллеров и устройств", "Настройка согласованной работы систем", "Настройка пользователей, сценариев и уведомлений", "Пусконаладочное тестирование"],
          stages: ["Проверка устройств и подтверждение связи", "Программирование и внедрение сценариев", "Совместное тестирование систем", "Сдача в эксплуатацию и инструктаж"],
          result: "Вы получаете стабильно работающую согласованную систему, готовую к ежедневной эксплуатации."
        },
        interfaces: {
          includes: ["Структура интерфейса управления", "Экраны и карты диспетчеризации", "Панель мониторинга и уведомлений", "Настройка удаленного доступа"],
          stages: ["Анализ требований и сценариев", "Дизайн и сборка интерфейса", "Интеграция с системами", "Тестирование и инструкция по использованию"],
          result: "Вы получаете простой и удобный интерфейс управления для быстрого реагирования и понятного мониторинга."
        },
        "video-surveillance": {
          includes: ["IP/HD камеры (bullet, dome, PTZ)", "NVR/DVR и HDD-архив", "PoE-сеть и кабелирование", "Удаленный просмотр и уведомления о движении"],
          stages: ["Карта обзора и выбор точек", "Монтаж камер и кабелирование", "Настройка NVR/DVR и архива", "Настройка удаленного доступа и уведомлений"],
          result: "Вы получаете систему видеонаблюдения с четким обзором, надежным архивом и удаленным просмотром."
        },
        "fire-security": {
          includes: ["Прибор пожарной сигнализации", "Датчики дыма/тепла и ручные извещатели", "Звуковые и световые сигналы эвакуации", "Зонирование и сценарии"],
          stages: ["Схема рисков и зон", "Монтаж датчиков и панели", "Подключение, зонирование и программирование", "Тестирование и сдача"],
          result: "Вы получаете сертифицированную, проверенную систему пожарной безопасности с понятным сценарием эвакуации."
        },
        networks: {
          includes: ["Структурированное кабелирование (медь/оптика)", "Rack-шкаф, switch и patch panel", "Wi-Fi точки доступа и покрытие", "Маркировка и тестирование линий"],
          stages: ["План рабочих мест и зон", "Кабелирование и сборка стойки", "Настройка активного оборудования", "Тест пропускной способности и сдача"],
          result: "Вы получаете стабильную, быструю и расширяемую сеть с надежной внутренней связью."
        },
        electrical: {
          includes: ["Распределительные щиты и автоматы", "Линии освещения и розеток", "Кабельные трассы и заземление", "Замеры и маркировка"],
          stages: ["Расчет нагрузок и план линий", "Кабелирование и монтаж трасс", "Сборка и подключение щитов", "Замеры, проверка и сдача"],
          result: "Вы получаете безопасную, правильно рассчитанную и обслуживаемую электрическую инфраструктуру."
        },
        automation: {
          includes: ["BMS-контроллеры и датчики", "Интеграция доступа, света и климата", "Сценарии управления", "Панель мониторинга и удаленный доступ"],
          stages: ["Определение сценариев автоматизации", "Монтаж контроллеров и датчиков", "Интеграция и программирование", "Тестирование и инструкция по использованию"],
          result: "Вы получаете единую, удобную и управляемую систему smart-управления."
        },
        "full-design": {
          includes: ["Комплексный проект всех инженерных систем", "Расположение устройств и расчеты", "Резерв и запас на расширение", "Логика эксплуатации и документация"],
          stages: ["Комплексное обследование объекта", "Совместная концепция систем", "Расчеты, чертежи и состав", "Согласование и сдача"],
          result: "Вы получаете единый согласованный комплексный проект, где все системы работают в одной логике."
        },
        "audio-systems": {
          includes: ["Динамики и усилители", "Public Address и zone controller", "Микрофоны и микшер", "Настройка звука по зонам"],
          stages: ["Расчет акустических зон", "Установка динамиков и кабелирование", "Подключение и настройка устройств", "Балансировка звука и сдача"],
          result: "Вы получаете сбалансированную, четко слышимую звуковую систему во всех зонах."
        },
        wacker: {
          includes: ["Компоненты технической системы", "Точная установка и крепление", "Настройка под требования", "Тестирование и инструкция по обслуживанию"],
          stages: ["Изучение требований и условий", "Монтаж и крепление", "Настройка и проверка", "Сдача и обслуживание"],
          result: "Вы получаете точно установленную и настроенную техническую систему со стабильной работой."
        },
        "powder-coating": {
          includes: ["Очистка и подготовка поверхности", "Равномерное нанесение порошка", "Термическая обработка (полимеризация)", "Контроль качества и покрытия"],
          stages: ["Очистка и подготовка деталей", "Нанесение порошкового покрытия", "Полимеризация в печи", "Контроль качества и упаковка"],
          result: "Вы получаете ровное, прочное и эстетичное покрытие производственного качества."
        }
      }
    };
    var copy = site.i18n.pickLanguageDictionary(dictionaries, language);
    return copy[id] || null;
  }

  function serviceScopeByCategory(id, tags) {
    var language = site.i18n.language || "hy";
    var perService = perServiceScope(id, language);
    if (perService) {
      return {
        includes: perService.includes.slice(0, 4),
        stages: perService.stages,
        result: perService.result
      };
    }
    var categoryById = {
      "video-surveillance": "security",
      "fire-security": "security",
      automation: "security",
      networks: "network",
      electrical: "electrical",
      "audio-systems": "audio",
      "systems-design": "delivery",
      "full-design": "delivery",
      "equipment-supply": "delivery",
      installation: "delivery",
      "automation-cabinets": "delivery",
      "commissioning-programming": "delivery",
      interfaces: "delivery",
      wacker: "additional",
      "powder-coating": "additional"
    };
    var category = categoryById[id] || "delivery";
    var dictionaries = {
      hy: {
        stages: ["Չափագրում և պահանջների ֆիքսում", "Տեխնիկական կազմ և հաշվարկ", "Տեղադրում / կարգաբերում", "Թեստավորում, հանձնում և սպասարկման պլան"],
        categories: {
          security: {
            includes: ["Ծածկույթի և ռիսկերի քարտեզ", "Սարքերի ճիշտ դաս և տեղաբաշխում", "Ծանուցումների և մոնիտորինգի կարգավորում"],
            result: "Ստանում եք վերահսկելի և հուսալի անվտանգության միջավայր՝ հստակ արձագանքման սցենարներով։"
          },
          network: {
            includes: ["Կառուցվածքային մալուխային պլան", "Rack, switch, Wi-Fi և կապի հանգույցներ", "Կայունության և թողունակության ստուգումներ"],
            result: "Ստանում եք կայուն ներքին կապ և ցանց, որը պատրաստ է ընդլայնման համար։"
          },
          electrical: {
            includes: ["Բեռների և գծերի հաշվարկ", "Վահանների, լուսավորության և ուղիների մոնտաժ", "Չափումներ, նշագրում և անվտանգության ստուգում"],
            result: "Ստանում եք անվտանգ և սպասարկելի էլեկտրական ենթակառուցվածք՝ օբյեկտի ռեժիմին համապատասխան։"
          },
          audio: {
            includes: ["Ակուստիկ գոտիների հաշվարկ", "Բարձրախոսների և սարքավորումների տեղաբաշխում", "Ձայնի կարգաբերում և շահագործման հրահանգավորում"],
            result: "Ստանում եք հավասարակշռված ձայնային միջավայր՝ հստակ լսելիությամբ բոլոր գոտիներում։"
          },
          delivery: {
            includes: ["Նախագիծ, կազմ և տեխնիկական փաստաթղթեր", "Մատակարարում, մոնտաժ և ծրագրավորում", "Գործարկում, ընդունում և սպասարկման շղթա"],
            result: "Ստանում եք ամբողջական իրականացում մեկ պատասխանատու թիմից՝ առանց փուլերի միջև կորուստների։"
          },
          additional: {
            includes: ["Տեխնիկական պահանջների հստակեցում", "Արտադրական/մոնտաժային ճշգրիտ իրականացում", "Վերջնական որակի վերահսկում"],
            result: "Ստանում եք նիշային ծառայություն՝ նույն որակի վերահսկմամբ, ինչ հիմնական ինժեներական նախագծերում։"
          }
        }
      },
      en: {
        stages: ["Survey and requirement capture", "Technical scope and calculation", "Installation / configuration", "Testing, handover and service plan"],
        categories: {
          security: {
            includes: ["Risk and coverage mapping", "Correct device class and placement", "Alert and monitoring configuration"],
            result: "You get a controllable and reliable security environment with clear response scenarios."
          },
          network: {
            includes: ["Structured cabling plan", "Rack, switch, Wi-Fi and network nodes", "Stability and throughput validation"],
            result: "You get stable internal connectivity and a network ready for future expansion."
          },
          electrical: {
            includes: ["Load and circuit calculations", "Panels, lighting and route installation", "Measurements, labeling and safety checks"],
            result: "You get a safe, serviceable electrical infrastructure aligned with facility operations."
          },
          audio: {
            includes: ["Acoustic zoning calculation", "Speaker and equipment placement", "Sound tuning and operation handover"],
            result: "You get balanced sound coverage and clear audibility across all zones."
          },
          delivery: {
            includes: ["Design scope and technical documentation", "Supply, installation and programming", "Commissioning, acceptance and service chain"],
            result: "You get full-cycle delivery from one accountable team without stage handoff gaps."
          },
          additional: {
            includes: ["Clear technical requirement definition", "Precise production or installation execution", "Final quality control before handover"],
            result: "You get specialized services with the same quality control as core engineering projects."
          }
        }
      },
      ru: {
        stages: ["Замер и фиксация требований", "Технический состав и расчет", "Монтаж / настройка", "Тестирование, сдача и сервисный план"],
        categories: {
          security: {
            includes: ["Карта рисков и зон покрытия", "Правильный класс оборудования и размещение", "Настройка оповещений и мониторинга"],
            result: "Вы получаете управляемую и надежную среду безопасности с понятными сценариями реагирования."
          },
          network: {
            includes: ["План структурированной кабельной системы", "Rack, switch, Wi-Fi и узлы связи", "Проверка стабильности и пропускной способности"],
            result: "Вы получаете стабильную внутреннюю связь и сеть, готовую к расширению."
          },
          electrical: {
            includes: ["Расчет нагрузок и линий", "Монтаж щитов, освещения и трасс", "Замеры, маркировка и проверка безопасности"],
            result: "Вы получаете безопасную и удобную в обслуживании электрическую инфраструктуру под режим объекта."
          },
          audio: {
            includes: ["Расчет акустических зон", "Размещение акустики и оборудования", "Настройка звука и инструкции по эксплуатации"],
            result: "Вы получаете сбалансированное звуковое покрытие и четкую слышимость в каждой зоне."
          },
          delivery: {
            includes: ["Проект, состав систем и техдокументация", "Поставка, монтаж и программирование", "Пусконаладка, приемка и сервисная цепочка"],
            result: "Вы получаете реализацию полного цикла от одной ответственной команды без потерь между этапами."
          },
          additional: {
            includes: ["Уточнение технических требований", "Точное производственное или монтажное выполнение", "Финальный контроль качества"],
            result: "Вы получаете нишевую услугу с тем же контролем качества, что и в основных инженерных проектах."
          }
        }
      }
    };
    var copy = site.i18n.pickLanguageDictionary(dictionaries, language);
    var categoryCopy = copy.categories[category] || copy.categories.delivery;
    var tagItems = (tags || []).slice(0, 2).filter(Boolean);
    var mergedIncludes = categoryCopy.includes.concat(tagItems);
    return {
      includes: mergedIncludes.slice(0, 4),
      stages: copy.stages,
      result: categoryCopy.result
    };
  }

  function serviceScopeMarkup(id, tags) {
    var e = site.utils.escapeHtml;
    var copy = serviceScopeByCategory(id, tags);
    var includes = copy.includes.map(function (item) {
      return "<li>" + e(item) + "</li>";
    }).join("");
    var stages = copy.stages.map(function (item, index) {
      return "" +
        '<li>' +
          '<span>' + e(site.i18n.get("detail.serviceStepPrefix", "Step")) + " " + e(index + 1) + "</span>" +
          "<strong>" + e(item) + "</strong>" +
        "</li>";
    }).join("");

    return "" +
      '<section class="detail-scope reveal">' +
        '<div class="section-head detail-scope-head">' +
          "<div>" +
            '<span class="eyebrow">' + e(site.i18n.get("detail.serviceScopeTitle", "Service scope")) + "</span>" +
            '<h2 class="section-title">' + e(site.i18n.get("detail.serviceScopeTitle", "Service scope")) + "</h2>" +
          "</div>" +
          '<p class="section-copy">' + e(site.i18n.get("detail.serviceScopeText", "")) + "</p>" +
        "</div>" +
        '<div class="detail-scope-grid">' +
          '<article>' +
            "<h3>" + e(site.i18n.get("detail.serviceIncludesTitle", "What is included")) + "</h3>" +
            "<ul>" + includes + "</ul>" +
          "</article>" +
          '<article>' +
            "<h3>" + e(site.i18n.get("detail.serviceProcessTitle", "Stages")) + "</h3>" +
            '<ol class="detail-scope-steps">' + stages + "</ol>" +
          "</article>" +
          '<article>' +
            "<h3>" + e(site.i18n.get("detail.serviceResultTitle", "Result")) + "</h3>" +
            "<p>" + e(copy.result) + "</p>" +
            '<a href="' + e(site.utils.pageUrl("request")) + '">' + e(site.i18n.get("common.requestSurvey", site.i18n.get("common.proposal", "Request"))) + "</a>" +
          "</article>" +
        "</div>" +
      "</section>";
  }

  function projectNarrative(project, works) {
    var language = site.i18n.language || "hy";
    var worksPreview = (works || []).slice(0, 2).join(language === "ru" ? ", " : " / ");
    var copyByLanguage = {
      hy: {
        problem: "Օբյեկտը պահանջում էր կայուն և վերահսկելի ինժեներական համակարգեր՝ առօրյա անվտանգ աշխատանքի համար։",
        solutionPrefix: "Իրականացված լուծումներ․ ",
        resultCurrent: "Նախագիծը ընթացքի մեջ է, համակարգերը փուլային կերպով տեղադրվում և կարգավորվում են ըստ օբյեկտի ռեժիմի։",
        resultCompleted: "Համակարգերը հանձնված են շահագործման և ապահովում են օբյեկտի կայուն անվտանգ աշխատանքը։"
      },
      en: {
        problem: "The facility required stable and controllable engineering systems for safe daily operations.",
        solutionPrefix: "Implemented scope: ",
        resultCurrent: "The project is in progress with phased installation and configuration according to facility operations.",
        resultCompleted: "The systems are delivered and support stable, secure daily operation of the facility."
      },
      ru: {
        problem: "Объекту требовались стабильные и управляемые инженерные системы для безопасной ежедневной работы.",
        solutionPrefix: "Реализованное решение: ",
        resultCurrent: "Проект в работе: системы поэтапно монтируются и настраиваются с учетом режима объекта.",
        resultCompleted: "Системы сданы и обеспечивают стабильную и безопасную ежедневную работу объекта."
      }
    };
    var copy = site.i18n.pickLanguageDictionary(copyByLanguage, language);
    return {
      problem: copy.problem,
      solution: copy.solutionPrefix + (worksPreview || "-"),
      result: project.status === "current" ? copy.resultCurrent : copy.resultCompleted
    };
  }

  function projectStoryMarkup(project, works) {
    var e = site.utils.escapeHtml;
    var labels = {
      problem: site.i18n.get("detail.projectStoryProblem", site.i18n.get("projectsPage.storyProblem", "Problem")),
      solution: site.i18n.get("detail.projectStorySolution", site.i18n.get("projectsPage.storySolution", "Solution")),
      result: site.i18n.get("detail.projectStoryResult", site.i18n.get("projectsPage.storyResult", "Result"))
    };
    var story = projectNarrative(project, works);
    return "" +
      '<section class="detail-project-story reveal">' +
        '<div class="section-head">' +
          "<div>" +
            '<span class="eyebrow">' + e(site.i18n.get("detail.projectStoryTitle", "Project card")) + "</span>" +
            '<h2 class="section-title">' +
              e(site.i18n.get("detail.projectStoryProblem", "Problem")) + " -> " +
              e(site.i18n.get("detail.projectStorySolution", "Solution")) + " -> " +
              e(site.i18n.get("detail.projectStoryResult", "Result")) +
            "</h2>" +
          "</div>" +
          '<p class="section-copy">' + e(site.i18n.get("detail.projectStoryText", "")) + "</p>" +
        "</div>" +
        '<div class="detail-project-story-grid">' +
          '<article><h3>' + e(labels.problem) + "</h3><p>" + e(story.problem) + "</p></article>" +
          '<article><h3>' + e(labels.solution) + "</h3><p>" + e(story.solution) + "</p></article>" +
          '<article><h3>' + e(labels.result) + "</h3><p>" + e(story.result) + "</p></article>" +
        "</div>" +
      "</section>";
  }

  function currentProjectBanner(project) {
    if (!project || project.status !== "current") return "";
    var e = site.utils.escapeHtml;
    var language = site.i18n.language || "hy";
    var copyByLanguage = {
      hy: {
        badge: "Ընթացքի մեջ",
        title: "Այս օբյեկտում աշխատանքները ընթացքի մեջ են",
        text: "Ստորև ներկայացված են ֆոտոներ ու ծառայությունների ցանկ, որոնք կատարվում են կամ արդեն ավարտվել են այս նախագծի շրջանակում։",
        stagesTitle: "Փուլեր",
        stages: ["Չափագրում և նախագիծ", "Մատակարարում", "Տեղադրում", "Ծրագրավորում", "Հանձնում"],
        activeLabel: "Ընթացիկ",
        cta: "Հետաքրքրվա՞ծ եք նման լուծումով",
        ctaBtn: "Ստանալ կոմերցիոն առաջարկ"
      },
      en: {
        badge: "In progress",
        title: "Work is currently ongoing at this facility",
        text: "The photos and work scope below reflect what is being installed or has already been completed within this project.",
        stagesTitle: "Stages",
        stages: ["Survey and design", "Supply", "Installation", "Programming", "Handover"],
        activeLabel: "Active",
        cta: "Interested in a similar solution?",
        ctaBtn: "Get a commercial proposal"
      },
      ru: {
        badge: "В работе",
        title: "На этом объекте работы продолжаются",
        text: "Ниже представлены фотографии и перечень работ, которые выполняются или уже завершены в рамках этого проекта.",
        stagesTitle: "Этапы",
        stages: ["Замер и проект", "Поставка", "Монтаж", "Программирование", "Сдача"],
        activeLabel: "Активно",
        cta: "Интересует похожее решение?",
        ctaBtn: "Получить коммерческое предложение"
      }
    };
    var copy = site.i18n.pickLanguageDictionary(copyByLanguage, language);
    var stageItems = copy.stages.map(function (stage, index) {
      var isActive = index === 2;
      return '' +
        '<li class="project-stage-item' + (isActive ? " is-active" : "") + '">' +
          '<span>' + e(String(index + 1).padStart(2, "0")) + '</span>' +
          '<strong>' + e(stage) + '</strong>' +
          (isActive ? '<em>' + e(copy.activeLabel) + '</em>' : '') +
        '</li>';
    }).join("");

    return '' +
      '<div class="current-project-banner reveal">' +
        '<div class="current-project-banner-head">' +
          '<span class="current-project-badge">' + e(copy.badge) + '</span>' +
          '<div>' +
            '<h2>' + e(copy.title) + '</h2>' +
            '<p>' + e(copy.text) + '</p>' +
          '</div>' +
          '<a class="button button-primary" href="' + e(site.utils.pageUrl("request")) + '">' + e(copy.ctaBtn) + '</a>' +
        '</div>' +
        '<div class="project-stages-track">' +
          '<span class="project-stages-label">' + e(copy.stagesTitle) + '</span>' +
          '<ol class="project-stages">' + stageItems + '</ol>' +
        '</div>' +
      '</div>';
  }

  function detailShell(kind, type, id, data, title, lead, chips, images, backHref, systemItems) {
    var e = site.utils.escapeHtml;
    var heroImage = images[0] || data.image || "";
    var systemGallery = systemGalleryMarkup(systemItems || []);
    var serviceShowcase = id === "video-surveillance" ? videoSurveillanceShowcaseMarkup() : "";
    var galleryCopy = detailGalleryCopy(kind, id);
    var serviceScope = kind === "service" ? serviceScopeMarkup(id, chips || []) : "";
    var projectStory = kind === "project" ? projectStoryMarkup(data, chips || []) : "";
    var activeBanner = kind === "project" ? currentProjectBanner(data) : "";

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
          activeBanner +
          projectStory +
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
            '<a href="' + e(site.utils.pageUrl("request")) + '">' + e(site.i18n.get("common.requestSurvey", site.i18n.get("common.proposal", "Request"))) + "</a>" +
          "</aside>" +
          serviceScope +
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
            '<a class="button button-primary" href="' + e(site.utils.pageUrl("request")) + '">' + e(site.i18n.get("common.requestSurvey", site.i18n.get("common.consultation"))) + "</a>" +
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
    var projectLeadKey = project.status === "current" ? "detail.projectLeadCurrent" : "detail.projectLead";
    return detailShell(
      "project",
      site.i18n.get("detail.projectType"),
      id,
      project,
      text.title,
      site.i18n.get(projectLeadKey),
      text.works || [],
      project.images || [],
      site.utils.pageUrl("projects"),
      project.systemImages || []
    );
  };
})(window.SmartTech);
