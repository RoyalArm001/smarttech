(function (site) {
  function galleryMarkup(images, title, captions) {
    var e = site.utils.escapeHtml;
    return images.map(function (image, index) {
      var caption = (captions && captions[index]) || (title + " " + (index + 1));
      return '' +
        '<figure class="detail-gallery-item">' +
          '<img src="' + e(image) + '" alt="' + e(caption) + '" loading="lazy" decoding="async">' +
          (captions && captions[index]
            ? '<figcaption>' + e(captions[index]) + '</figcaption>'
            : "") +
        '</figure>';
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
          eyebrow: "Կատարված աշխատանքների նկարներ",
          title: "Smart Tech-ի կատարած աշխատանքները օբյեկտում",
          text: "Այստեղ ցուցադրվում են իրական տեխնիկական աշխատանքների լուսանկարները՝ մոնտաժ, սարքավորում, մալուխային համակարգեր, աուդիո և այլ իրականացված լուծումներ, ոչ թե օբյեկտի ընդհանուր տեսքը։",
          suggestion: "Եթե ձեր տարածքում նմանատիպ աշխատանք է պետք, կարող ենք գնահատել օբյեկտը և առաջարկել համապատասխան լուծում։"
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
          "engineering-monitoring": {
            eyebrow: "24/7 վերահսկում",
            title: "Մոնիթորինգ սերվեր՝ օբյեկտի համակարգերի վերահսկման համար",
            text: "Սերվերը 24/7 ստուգում է CCTV, NVR, ցանցը, UPS-ը և անվտանգությունը։ Խնդրի դեպքում ահազանգումը հասնում է SMS, email կամ Telegram-ով։",
            suggestion: "Նշեք օբյեկտի տեսակը, սարքերի քանակը և ցանկալի ահազանգման ալիքները՝ SMS, email, Telegram։"
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
          eyebrow: "Completed work photos",
          title: "Work delivered by Smart Tech on site",
          text: "These photos show real technical work: installation, equipment, cabling, audio and other delivered solutions — not generic views of the building.",
          suggestion: "If your site needs similar work, we can assess the facility and propose the right solution."
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
          "engineering-monitoring": {
            eyebrow: "24/7 supervision",
            title: "Monitoring, alerts and fast response",
            text: "The client sees facility status in real time via SMS, email, app and dashboard. Servers, NVR, network, UPS, CCTV and security systems are supervised continuously; issues are resolved before downtime.",
            suggestion: "Specify which systems matter — CCTV, server, network, fire alarm, access control — and preferred alerts: SMS, email, Telegram."
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
          eyebrow: "Фото выполненных работ",
          title: "Работы Smart Tech на объекте",
          text: "Здесь показаны реальные фотографии технических работ: монтаж, оборудование, кабельные системы, аудио и другие выполненные решения, а не общий вид здания.",
          suggestion: "Если на вашем объекте нужны похожие работы, мы оценим площадку и предложим подходящее решение."
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
          "engineering-monitoring": {
            eyebrow: "Круглосуточный контроль",
            title: "Мониторинг, оповещения и быстрая реакция",
            text: "Клиент видит состояние объекта в реальном времени через SMS, email, приложение и dashboard. Серверы, NVR, сеть, UPS, CCTV и системы безопасности контролируются постоянно; проблемы решаются до простоя.",
            suggestion: "Укажите важные системы — видеонаблюдение, сервер, сеть, пожарная, доступ — и желаемые оповещения: SMS, email, Telegram."
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

  function formatMonitorPrice(value, currencyLabel) {
    var label = currencyLabel || "֏";
    return Number(value).toLocaleString("hy-AM") + " " + label;
  }

  function engineeringMonitoringPageMarkup() {
    var e = site.utils.escapeHtml;
    var language = site.i18n.language || "hy";
    var requestHref = site.utils.pageUrl("request");
    var img = "/img/services/";
    var packages = [
      {
        name: "Starter NOC",
        nodesHy: "մինչև 20", nodesEn: "up to 20", nodesRu: "до 20",
        setup: 390000, server: 528000, os: 180000, monthly: 54000,
        image: img + "commissioning_programming.jpg",
        featuresHy: ["Zabbix + Grafana dashboard", "SMS/Telegram ահազանգում", "CCTV, NVR, UPS, ցանց", "Հեռահար դիտարկում"],
        featuresEn: ["Zabbix + Grafana dashboard", "SMS/Telegram alerts", "CCTV, NVR, UPS, network", "Remote supervision"],
        featuresRu: ["Zabbix + Grafana dashboard", "SMS/Telegram оповещения", "CCTV, NVR, UPS, сеть", "Удаленный контроль"],
        featured: false
      },
      {
        name: "Business NOC",
        nodesHy: "մինչև 60", nodesEn: "up to 60", nodesRu: "до 60",
        setup: 720000, server: 864000, os: 180000, monthly: 114000,
        image: img + "server_rack.jpg",
        featuresHy: ["Starter + SLA արձագանք", "Firewall և BMS ինտեգրացիա", "Backup և event log", "Ամսական health report"],
        featuresEn: ["Starter + SLA response", "Firewall and BMS integration", "Backup and event log", "Monthly health report"],
        featuresRu: ["Starter + SLA реакция", "Firewall и BMS интеграция", "Backup и event log", "Ежемесячный health report"],
        featured: true
      },
      {
        name: "Enterprise NOC",
        nodesHy: "60+", nodesEn: "60+", nodesRu: "60+",
        setup: 1440000, server: 1416000, os: 336000, monthly: 216000,
        image: img + "bms_office.jpg",
        featuresHy: ["Կրկնակի սերվեր / redundancy", "Windows կամ Linux stack", "PRTG/Zabbix enterprise", "Անհատական SLA և NOC"],
        featuresEn: ["Dual server / redundancy", "Windows or Linux stack", "PRTG/Zabbix enterprise", "Custom SLA and NOC"],
        featuresRu: ["Двойной сервер / redundancy", "Windows или Linux stack", "PRTG/Zabbix enterprise", "Индивидуальный SLA и NOC"],
        featured: false
      }
    ];
    var stackRows = [
      { nameHy: "Mini NOC սերվեր (4c / 16GB / 512GB SSD)", nameEn: "Mini NOC server (4c / 16GB / 512GB SSD)", nameRu: "Mini NOC сервер (4c / 16GB / 512GB SSD)", noteHy: "Մինչև 25 հանգույց", noteEn: "Up to 25 nodes", noteRu: "До 25 узлов", price: 528000, image: img + "server_rack.jpg" },
      { nameHy: "Standard NOC սերվեր (8c / 32GB / 1TB RAID)", nameEn: "Standard NOC server (8c / 32GB / 1TB RAID)", nameRu: "Standard NOC сервер (8c / 32GB / 1TB RAID)", noteHy: "Մինչև 80 հանգույց", noteEn: "Up to 80 nodes", noteRu: "До 80 узлов", price: 864000, image: img + "server_rack.jpg" },
      { nameHy: "Linux + Zabbix + Grafana տեղադրում", nameEn: "Linux + Zabbix + Grafana deployment", nameRu: "Linux + Zabbix + Grafana внедрение", noteHy: "Open-source stack", noteEn: "Open-source stack", noteRu: "Open-source stack", price: 180000, image: img + "interfaces_ui.jpg" },
      { nameHy: "Windows Server 2022 + կարգավորում", nameEn: "Windows Server 2022 + setup", nameRu: "Windows Server 2022 + настройка", noteHy: "PRTG / Active Directory", noteEn: "PRTG / Active Directory", noteRu: "PRTG / Active Directory", price: 336000, image: img + "commissioning_programming.jpg" }
    ];
    var copyByLanguage = {
      hy: {
        introEyebrow: "Ինչ է մոնիթորինգը",
        introTitle: "Ձեր օբյեկտի համակարգերի 24/7 վերահսկում",
        introText: "Մոնիթորինգ սերվերը շարունակաբար ստուգում է, արդյոք CCTV, NVR, ցանցը, UPS-ը, սերվերները և անվտանգության համակարգերը աշխատում են։ Խնդրի դեպքում դուք ահազանգում եք ստանում SMS, email կամ Telegram-ով՝ նախքան դադարը կամ մեծ վնասը։",
        whyTitle: "Ինչի համար է",
        whyLead: "Շատ օբյեկտներում խնդիրները նկատվում են ուշ, երբ արդեն վնաս է կամ դադար է առաջացել։",
        whyItems: [
          "Տեսախցիկը կամ NVR-ը անջատված է, բայց դուք դա չեք իմանում",
          "UPS-ը դատարկվում է, արխիվը կորում է, բիզնեսը կանգնում է",
          "Ցանցի խափանումը ազդում է ամբողջ օբյեկտի աշխատանքի վրա",
          "24/7 դաշտային աշխատակից պահելը թանկ և անարդյունավետ է"
        ],
        providesTitle: "Ինչ է ապահովում",
        providesItems: [
          "24/7 ավտոմատ վերահսկում բոլոր կարևոր սարքերի",
          "SMS, email, Telegram և web dashboard ահազանգում",
          "Իրադարձությունների մատյան և օբյեկտի ընդհանուր վիճակ",
          "Ինժեներական արձագանք, troubleshooting և պլանային սպասարձում",
          "Հեռահար դիտարկում առանց օբյեկտ գնալու"
        ],
        systemsTitle: "Ինչ համակարգեր ենք վերահսկում",
        systems: [
          { title: "Տեսահսկում", text: "Տեսախցիկներ, NVR, արխիվ, դիսկի տարածություն", image: img + "server_rack.jpg" },
          { title: "Ցանց և UPS", text: "Switch, router, PoE, UPS լարում և մարտկոց", image: img + "commissioning_programming.jpg" },
          { title: "Սերվերներ", text: "CPU, RAM, դիսկ, ծառայություններ, backup", image: img + "bms_office.jpg" },
          { title: "Անվտանգություն", text: "Հրդեհային, մուտքի վերահսկում, ազդանշան", image: img + "interfaces_ui.jpg" }
        ],
        howTitle: "Ինչպես է աշխատում",
        howSteps: [
          { title: "Ստուգագիծ", text: "Հավաքում ենք սարքերի ցանկը, ցանցի սխեման և ահազանգման կանոնները։" },
          { title: "Տեղադրում", text: "Տեղադրում և կարգավորում ենք մոնիթորինգ սերվերը (Zabbix/PRTG)։" },
          { title: "Ինտեգրացիա", text: "Միացնում ենք CCTV, NVR, UPS, ցանց և անվտանգության համակարգերը։" },
          { title: "24/7 ահազանգում", text: "Խնդրի դեպքում ահազանգումը հասնում է ձեզ, ինժեներն արձագանքում է։" }
        ],
        channelsTitle: "Ահազանգման ալիքներ",
        channels: ["SMS", "Email", "Telegram", "Push հավելված", "Web dashboard", "Իրադարձությունների մատյան"],
        pricingEyebrow: "Գներ",
        pricingTitle: "Մոնիթորինգի փաթեթներ",
        pricingText: "Գները հիմնված են շուկայական միջինների վրա՝ Smart Tech 20% ծառայության մարժայով։ Վերջնական գինը հաստատվում է ստուգագծից հետո։",
        packagesHint: "Մեկ անգամյա ներդրում + ամսական սպասարձում",
        featuredBadge: "Ամենաշատ ընտրված",
        perMonth: "/ամիս",
        monthlyLabel: "Ամսական",
        oneTime: "միանգամյա",
        nodesLabel: "հանգույց",
        cta: "Պատվիրել ստուգագիծ",
        stackTitle: "Սերվեր և ծրագրային ապահովում",
        stackHint: "Առանձին կամ փաթեթի մեջ",
        agendaTitle: "Տեղադրման օրակարգ (≈10 օր)",
        agendaSteps: [
          { day: "1–2", title: "Ստուգագիծ", text: "Հանգույցների ցանկ, ցանցային սխեմա, ահազանգման կանոններ։" },
          { day: "3–5", title: "Սերվեր և OS", text: "Hardware, Linux/Windows, Zabbix կամ PRTG։" },
          { day: "6–8", title: "Ինտեգրացիա", text: "CCTV, NVR, UPS, switch, հրդեհային/մուտքի համակարգեր։" },
          { day: "9–10", title: "Թեստ և գործարկում", text: "Ահազանգումներ, փորձարկում, 24/7 մոնիթորինգի մեկնարկ։" }
        ],
        footnote: "* Գները ներառում են Smart Tech 20% ծառայության մարժան։ SMS և էլեկտրաէներգիայի ծախսերը՝ ըստ փաստացի օգտագործման։"
      },
      en: {
        introEyebrow: "What is monitoring",
        introTitle: "24/7 supervision of your facility systems",
        introText: "A monitoring server continuously checks whether CCTV, NVR, network, UPS, servers and security systems are working. When something fails, you get an alert via SMS, email or Telegram — before downtime or major damage.",
        whyTitle: "Why you need it",
        whyLead: "On many sites, problems are noticed too late — after archive loss, downtime or damage.",
        whyItems: [
          "A camera or NVR is offline but nobody knows",
          "UPS battery drains, archive stops, business is affected",
          "Network failure impacts the whole facility",
          "Keeping on-site staff 24/7 is expensive and inefficient"
        ],
        providesTitle: "What you get",
        providesItems: [
          "24/7 automatic supervision of all critical devices",
          "SMS, email, Telegram and web dashboard alerts",
          "Event log and overall facility health view",
          "Engineering response, troubleshooting and scheduled maintenance",
          "Remote supervision without visiting the site"
        ],
        systemsTitle: "What we monitor",
        systems: [
          { title: "CCTV", text: "Cameras, NVR, archive, disk space", image: img + "server_rack.jpg" },
          { title: "Network and UPS", text: "Switch, router, PoE, UPS voltage and battery", image: img + "commissioning_programming.jpg" },
          { title: "Servers", text: "CPU, RAM, disk, services, backup", image: img + "bms_office.jpg" },
          { title: "Security", text: "Fire alarm, access control, intrusion", image: img + "interfaces_ui.jpg" }
        ],
        howTitle: "How it works",
        howSteps: [
          { title: "Site survey", text: "We list devices, network diagram and alert rules." },
          { title: "Deployment", text: "We install and configure the monitoring server (Zabbix/PRTG)." },
          { title: "Integration", text: "We connect CCTV, NVR, UPS, network and security systems." },
          { title: "24/7 alerts", text: "On issues you are notified and engineers respond." }
        ],
        channelsTitle: "Alert channels",
        channels: ["SMS", "Email", "Telegram", "Push app", "Web dashboard", "Event log"],
        pricingEyebrow: "Pricing",
        pricingTitle: "Monitoring packages",
        pricingText: "Prices are based on typical market rates plus a 20% Smart Tech service margin. Final pricing is confirmed after site survey.",
        packagesHint: "One-time setup + monthly support",
        featuredBadge: "Most popular",
        perMonth: "/month",
        monthlyLabel: "Monthly",
        oneTime: "one-time",
        nodesLabel: "nodes",
        cta: "Request survey",
        stackTitle: "Server and software",
        stackHint: "Standalone or inside a package",
        agendaTitle: "Deployment agenda (≈10 days)",
        agendaSteps: [
          { day: "1–2", title: "Site survey", text: "Node list, network diagram, alert rules." },
          { day: "3–5", title: "Server and OS", text: "Hardware, Linux/Windows, Zabbix or PRTG." },
          { day: "6–8", title: "Integration", text: "CCTV, NVR, UPS, switch, fire/access systems." },
          { day: "9–10", title: "Test and go-live", text: "Alerts, testing, 24/7 monitoring start." }
        ],
        footnote: "* Prices include a 20% Smart Tech service margin. SMS and power costs depend on actual usage."
      },
      ru: {
        introEyebrow: "Что такое мониторинг",
        introTitle: "Круглосуточный контроль систем объекта",
        introText: "Сервер мониторинга постоянно проверяет работу CCTV, NVR, сети, UPS, серверов и систем безопасности. При сбое вы получаете оповещение по SMS, email или Telegram — до простоя или серьезного ущерба.",
        whyTitle: "Зачем это нужно",
        whyLead: "На многих объектах проблемы замечают слишком поздно — когда уже есть простой или потеря архива.",
        whyItems: [
          "Камера или NVR отключены, но об этом не знают",
          "UPS разряжается, архив останавливается, страдает бизнес",
          "Сбой сети влияет на весь объект",
          "Держать дежурного на объекте 24/7 дорого и неэффективно"
        ],
        providesTitle: "Что вы получаете",
        providesItems: [
          "Круглосуточный автоматический контроль всех важных устройств",
          "Оповещения SMS, email, Telegram и web dashboard",
          "Журнал событий и общая картина состояния объекта",
          "Инженерная реакция, troubleshooting и плановое обслуживание",
          "Удаленный контроль без выезда на объект"
        ],
        systemsTitle: "Что контролируем",
        systems: [
          { title: "Видеонаблюдение", text: "Камеры, NVR, архив, дисковое пространство", image: img + "server_rack.jpg" },
          { title: "Сеть и UPS", text: "Switch, router, PoE, напряжение и батарея UPS", image: img + "commissioning_programming.jpg" },
          { title: "Серверы", text: "CPU, RAM, диск, службы, backup", image: img + "bms_office.jpg" },
          { title: "Безопасность", text: "Пожарная, СКУД, охранная сигнализация", image: img + "interfaces_ui.jpg" }
        ],
        howTitle: "Как это работает",
        howSteps: [
          { title: "Обследование", text: "Составляем список устройств, схему сети и правила оповещения." },
          { title: "Внедрение", text: "Устанавливаем и настраиваем сервер мониторинга (Zabbix/PRTG)." },
          { title: "Интеграция", text: "Подключаем CCTV, NVR, UPS, сеть и системы безопасности." },
          { title: "24/7 оповещения", text: "При сбое вы получаете уведомление, инженеры реагируют." }
        ],
        channelsTitle: "Каналы оповещения",
        channels: ["SMS", "Email", "Telegram", "Push-приложение", "Web dashboard", "Журнал событий"],
        pricingEyebrow: "Цены",
        pricingTitle: "Пакеты мониторинга",
        pricingText: "Цены основаны на среднерыночных ставках плюс 20% сервисная маржа Smart Tech. Итоговая цена подтверждается после обследования.",
        packagesHint: "Разовое внедрение + ежемесячная поддержка",
        featuredBadge: "Популярный",
        perMonth: "/мес",
        monthlyLabel: "Ежемесячно",
        oneTime: "разово",
        nodesLabel: "узлов",
        cta: "Заказать обследование",
        stackTitle: "Сервер и ПО",
        stackHint: "Отдельно или в пакете",
        agendaTitle: "График внедрения (≈10 дней)",
        agendaSteps: [
          { day: "1–2", title: "Обследование", text: "Список узлов, схема сети, правила оповещения." },
          { day: "3–5", title: "Сервер и ОС", text: "Hardware, Linux/Windows, Zabbix или PRTG." },
          { day: "6–8", title: "Интеграция", text: "CCTV, NVR, UPS, switch, пожарная/СКУД." },
          { day: "9–10", title: "Тест и запуск", text: "Оповещения, тестирование, старт 24/7 мониторинга." }
        ],
        footnote: "* Цены включают 20% сервисную маржу Smart Tech. Расходы на SMS и электроэнергию — по факту."
      }
    };
    var copy = site.i18n.pickLanguageDictionary(copyByLanguage, language);
    var langKey = language === "en" ? "En" : language === "ru" ? "Ru" : "Hy";

    function checklist(items) {
      return '<ul class="monitor-checklist">' + items.map(function (item) {
        return "<li>" + e(item) + "</li>";
      }).join("") + "</ul>";
    }

    var systemsMarkup = copy.systems.map(function (item) {
      return "" +
        '<article class="monitor-system-card">' +
          '<span class="monitor-system-photo" style="background-image:url(&quot;' + e(item.image) + '&quot;)"></span>' +
          "<div><h3>" + e(item.title) + "</h3><p>" + e(item.text) + "</p></div>" +
        "</article>";
    }).join("");

    var stepsMarkup = copy.howSteps.map(function (step, index) {
      return "" +
        '<li class="monitor-step">' +
          '<span class="monitor-step-num">0' + (index + 1) + "</span>" +
          "<div><strong>" + e(step.title) + "</strong><p>" + e(step.text) + "</p></div>" +
        "</li>";
    }).join("");

    var channelsMarkup = copy.channels.map(function (ch) {
      return '<span class="monitor-channel">' + e(ch) + "</span>";
    }).join("");

    var packageMarkup = packages.map(function (pkg) {
      var total = pkg.setup + pkg.server + pkg.os;
      var nodes = pkg["nodes" + langKey];
      var features = pkg["features" + langKey];
      var featureMarkup = features.map(function (item) {
        return "<li>" + e(item) + "</li>";
      }).join("");
      return "" +
        '<article class="monitor-package' + (pkg.featured ? " monitor-package--featured" : "") + '">' +
          (pkg.featured ? '<span class="monitor-package-badge">' + e(copy.featuredBadge) + "</span>" : "") +
          '<span class="monitor-package-photo" style="background-image:url(&quot;' + e(pkg.image) + '&quot;)"></span>' +
          '<div class="monitor-package-body">' +
            "<h3>" + e(pkg.name) + "</h3>" +
            '<p class="monitor-package-nodes">' + e(nodes) + " " + e(copy.nodesLabel) + "</p>" +
            '<ul class="monitor-package-features">' + featureMarkup + "</ul>" +
            '<div class="monitor-package-prices">' +
              '<div class="monitor-price-row"><span>' + e(copy.oneTime) + "</span><strong>" + e(formatMonitorPrice(total)) + "</strong></div>" +
              '<div class="monitor-price-row monitor-price-row--accent"><span>' + e(copy.monthlyLabel) + "</span><strong>" + e(formatMonitorPrice(pkg.monthly)) + "<em>" + e(copy.perMonth) + "</em></strong></div>" +
            "</div>" +
            '<a class="button button-primary monitor-package-cta" href="' + e(requestHref) + '">' + e(copy.cta) + "</a>" +
          "</div>" +
        "</article>";
    }).join("");

    var stackMarkup = stackRows.map(function (row) {
      return "" +
        '<article class="monitor-stack-row">' +
          '<span class="monitor-stack-thumb" style="background-image:url(&quot;' + e(row.image) + '&quot;)"></span>' +
          "<div>" +
            "<strong>" + e(row["name" + langKey]) + "</strong>" +
            "<span>" + e(row["note" + langKey]) + "</span>" +
          "</div>" +
          '<strong class="monitor-stack-price">' + e(formatMonitorPrice(row.price)) + "</strong>" +
        "</article>";
    }).join("");

    var agendaMarkup = copy.agendaSteps.map(function (step) {
      return "" +
        '<li class="monitor-agenda-step">' +
          '<span class="monitor-agenda-day">' + e(step.day) + "</span>" +
          "<div><strong>" + e(step.title) + "</strong><p>" + e(step.text) + "</p></div>" +
        "</li>";
    }).join("");

    return "" +
      '<div class="monitor-page">' +
        '<section class="monitor-section reveal">' +
          '<div class="monitor-section-head">' +
            '<span class="eyebrow">' + e(copy.introEyebrow) + "</span>" +
            "<h2>" + e(copy.introTitle) + "</h2>" +
            '<p class="monitor-lead">' + e(copy.introText) + "</p>" +
          "</div>" +
        "</section>" +
        '<section class="monitor-section reveal">' +
          '<div class="monitor-dual">' +
            '<div class="monitor-panel">' +
              "<h3>" + e(copy.whyTitle) + "</h3>" +
              "<p>" + e(copy.whyLead) + "</p>" +
              checklist(copy.whyItems) +
            "</div>" +
            '<div class="monitor-panel">' +
              "<h3>" + e(copy.providesTitle) + "</h3>" +
              checklist(copy.providesItems) +
            "</div>" +
          "</div>" +
        "</section>" +
        '<section class="monitor-section reveal">' +
          '<div class="monitor-section-head"><h2>' + e(copy.systemsTitle) + "</h2></div>" +
          '<div class="monitor-systems">' + systemsMarkup + "</div>" +
        "</section>" +
        '<section class="monitor-section reveal">' +
          '<div class="monitor-section-head"><h2>' + e(copy.howTitle) + "</h2></div>" +
          '<ol class="monitor-steps">' + stepsMarkup + "</ol>" +
        "</section>" +
        '<section class="monitor-section reveal">' +
          '<div class="monitor-section-head"><h2>' + e(copy.channelsTitle) + "</h2></div>" +
          '<div class="monitor-channels">' + channelsMarkup + "</div>" +
        "</section>" +
        '<section class="monitor-section monitor-pricing reveal">' +
          '<div class="monitor-section-head">' +
            '<span class="eyebrow">' + e(copy.pricingEyebrow) + "</span>" +
            "<h2>" + e(copy.pricingTitle) + "</h2>" +
            "<p>" + e(copy.pricingText) + "</p>" +
            "<p>" + e(copy.packagesHint) + "</p>" +
          "</div>" +
          '<div class="monitor-packages">' + packageMarkup + "</div>" +
          '<div class="monitor-section-head"><h2>' + e(copy.stackTitle) + "</h2><p>" + e(copy.stackHint) + "</p></div>" +
          '<div class="monitor-stack-list">' + stackMarkup + "</div>" +
          '<div class="monitor-section-head"><h2>' + e(copy.agendaTitle) + "</h2></div>" +
          '<ol class="monitor-agenda-list">' + agendaMarkup + "</ol>" +
          '<p class="monitor-footnote">' + e(copy.footnote) + "</p>" +
        "</section>" +
      "</div>";
  }
  function serviceApproachMarkup(id) {
    if (id === "video-surveillance" || id === "engineering-monitoring") return "";
    var e = site.utils.escapeHtml;
    var language = site.i18n.language || "hy";
    var service = site.content.services.find(function (item) {
      return item.id === id;
    });
    if (!service) return "";
    var scope = perServiceScope(id, language);
    var images = service.gallery && service.gallery.length ? service.gallery : [service.image];
    var header = site.i18n.pickLanguageDictionary({
      hy: {
        eyebrow: "Տեղադրում և կազմ",
        title: "Ինչ ենք տեղադրում և ինչպես ենք աշխատում",
        text: "Յուրաքանչյուր փուլում աշխատում ենք կոնկրետ սարքերի, մալուխային ուղիների և կարգաբերումների վրա, որպեսզի համակարգը հանձնվի կայուն և հասկանալի։"
      },
      en: {
        eyebrow: "Installation and scope",
        title: "What we install and how we deliver",
        text: "At each stage we work on specific devices, cable routes and configuration so the system is handed over stable and clear."
      },
      ru: {
        eyebrow: "Монтаж и состав",
        title: "Что устанавливаем и как выполняем работу",
        text: "На каждом этапе работаем с конкретными устройствами, трассами и настройкой, чтобы система была сдана стабильной и понятной."
      }
    }, language);
    var cards = scope.stages.slice(0, 4).map(function (stage, index) {
      return {
        title: stage,
        text: scope.includes[index] || scope.includes[0] || "",
        image: images[index] || images[0] || service.image
      };
    });
    var cardMarkup = cards.map(function (card, index) {
      return "" +
        '<article class="cctv-device-card cctv-device-card-' + (index + 1) + '">' +
          '<span class="cctv-card-photo" style="background-image: url(&quot;' + e(card.image) + '&quot;)">' +
            '<img src="' + e(card.image) + '" alt="' + e(card.title) + '" loading="lazy" decoding="async">' +
          "</span>" +
          "<div>" +
            "<span>" + e(String(index + 1).padStart(2, "0")) + "</span>" +
            "<h3>" + e(card.title) + "</h3>" +
            "<p>" + e(card.text) + "</p>" +
          "</div>" +
        "</article>";
    }).join("");

    return "" +
      '<section class="cctv-showcase service-approach-showcase reveal">' +
        '<div class="cctv-showcase-head">' +
          '<span class="eyebrow">' + e(header.eyebrow) + "</span>" +
          "<h2>" + e(header.title) + "</h2>" +
          "<p>" + e(header.text) + "</p>" +
        "</div>" +
        '<div class="cctv-device-grid">' + cardMarkup + "</div>" +
      "</section>";
  }

  function serviceEquipmentBadges(id) {
    var badges = {
      "systems-design": ["PLAN", "CAD", "LOAD", "BOQ"],
      "equipment-supply": ["RACK", "NET", "CCTV", "BMS"],
      installation: ["TRAY", "FIX", "BOX", "TEST"],
      "automation-cabinets": ["PLC", "MCB", "RELAY", "IO"],
      "commissioning-programming": ["CTRL", "HMI", "SENS", "APP"],
      interfaces: ["UI", "MAP", "ALRT", "WEB"],
      "video-surveillance": ["IP", "NVR", "PoE", "APP"],
      "fire-security": ["FIRE", "FACP", "SND", "MCP"],
      networks: ["LAN", "RACK", "Wi-Fi", "TEST"],
      electrical: ["DB", "MCB", "LINE", "LUX"],
      automation: ["BMS", "SENS", "ACS", "HVAC"],
      "engineering-monitoring": ["SMS", "NOC", "SVR", "APP"],
      "full-design": ["PLAN", "LOW", "PWR", "DOC"],
      "audio-systems": ["SPK", "AMP", "MIC", "ZONE"],
      wacker: ["KIT", "CTRL", "LINE", "SET"],
      "powder-coating": ["PREP", "GUN", "OVEN", "QC"]
    };
    return badges[id] || ["01", "02", "03", "04"];
  }

  function serviceEquipmentMarkup(id, tags) {
    var e = site.utils.escapeHtml;
    var language = site.i18n.language || "hy";
    var scope = serviceScopeByCategory(id, tags || []);
    var badges = serviceEquipmentBadges(id);
    var copy = site.i18n.pickLanguageDictionary({
      hy: {
        eyebrow: "Տեղադրվող սարքեր",
        title: "Ինչ սարքերից է կազմվում լուծումը",
        text: "Ցուցադրում ենք հիմնական հանգույցները՝ սարքեր, կապեր և գործարկման տրամաբանություն։ Վերջնական կազմը միշտ ընտրվում է օբյեկտի չափագրումից հետո։",
        diagramTitle: "Համակարգի տրամաբանություն",
        core: "SmartTech համակարգ",
        node: "Հանգույց",
        flowTitle: "Ինչպես է կառուցվում"
      },
      en: {
        eyebrow: "Installed equipment",
        title: "What the solution is built from",
        text: "We show the main nodes: devices, connections and commissioning logic. The final set is selected after the site survey.",
        diagramTitle: "System logic",
        core: "SmartTech system",
        node: "Node",
        flowTitle: "How it is built"
      },
      ru: {
        eyebrow: "Устанавливаемое оборудование",
        title: "Из каких устройств состоит решение",
        text: "Показываем основные узлы: устройства, подключения и логику запуска. Финальный состав подбирается после обследования объекта.",
        diagramTitle: "Логика системы",
        core: "SmartTech система",
        node: "Узел",
        flowTitle: "Как строится"
      }
    }, language);
    var items = scope.includes.slice(0, 4).map(function (item, index) {
      return {
        title: item,
        text: scope.stages[index] || scope.stages[0] || "",
        badge: badges[index] || String(index + 1).padStart(2, "0")
      };
    });
    var nodeMarkup = items.map(function (item, index) {
      return "" +
        '<article class="equipment-node equipment-node-' + (index + 1) + '">' +
          '<span class="equipment-node-badge notranslate" translate="no">' + e(item.badge) + "</span>" +
          "<div>" +
            '<span class="equipment-node-kicker">' + e(copy.node) + " " + e(String(index + 1).padStart(2, "0")) + "</span>" +
            "<h3>" + e(item.title) + "</h3>" +
            "<p>" + e(item.text) + "</p>" +
          "</div>" +
        "</article>";
    }).join("");
    var diagramDots = items.map(function (item, index) {
      return "" +
        '<span class="equipment-diagram-dot equipment-diagram-dot-' + (index + 1) + '">' +
          '<b class="notranslate" translate="no">' + e(item.badge) + "</b>" +
        "</span>";
    }).join("");
    var flowMarkup = scope.stages.slice(0, 4).map(function (stage, index) {
      return "" +
        '<span class="equipment-flow-step">' +
          '<b>' + e(String(index + 1).padStart(2, "0")) + "</b>" +
          e(stage) +
        "</span>";
    }).join("");

    return "" +
      '<section class="equipment-showcase reveal">' +
        '<div class="equipment-showcase-head">' +
          '<span class="eyebrow">' + e(copy.eyebrow) + "</span>" +
          "<h2>" + e(copy.title) + "</h2>" +
          "<p>" + e(copy.text) + "</p>" +
        "</div>" +
        '<div class="equipment-showcase-shell">' +
          '<div class="equipment-diagram" aria-label="' + e(copy.diagramTitle) + '">' +
            '<span class="equipment-diagram-grid"></span>' +
            '<strong>' + e(copy.core) + "</strong>" +
            diagramDots +
          "</div>" +
          '<div class="equipment-node-grid">' + nodeMarkup + "</div>" +
        "</div>" +
        '<div class="equipment-flow">' +
          "<strong>" + e(copy.flowTitle) + "</strong>" +
          '<div>' + flowMarkup + "</div>" +
        "</div>" +
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
        "engineering-monitoring": {
          includes: ["24/7 մոնիթորինգ՝ CCTV, NVR, սերվեր, ցանց, UPS, հրդեհային/ազդանշան", "SMS, email, Telegram/push ահազանգումներ", "Կենտրոնացված dashboard և իրադարձությունների մատյան", "Սերվերային կառավարում, backup, թեստավորում և troubleshooting"],
          stages: ["Համակարգերի ինվենտար և մոնիթորինգի պլան", "Ահազանգման կանոնների և ալիքների կարգավորում", "Սերվեր/dashboard ծրագրավորում և ինտեգրացիա", "Թեստավորում, հանձնում և շարունակական ավարուժ սպասարձում"],
          result: "Պատվիրատուն 24/7 տեսնում է օբյեկտի վիճակը, ժամանակին ստանում է SMS/email ահազանգում, խնդիրները լուծվում են նախքան մեծ վնասի առաջացումը։"
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
        "engineering-monitoring": {
          includes: ["24/7 monitoring: CCTV, NVR, server, network, UPS, fire/alarm", "SMS, email, Telegram/push alerts", "Central dashboard and event log", "Server management, backup, testing and troubleshooting"],
          stages: ["System inventory and monitoring plan", "Alert rules and channel setup", "Server/dashboard programming and integration", "Testing, handover and ongoing engineering support"],
          result: "The client sees facility status 24/7, receives timely SMS/email alerts, and issues are resolved before major damage or downtime."
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
        "engineering-monitoring": {
          includes: ["Круглосуточный мониторинг: CCTV, NVR, сервер, сеть, UPS, пожарная/охрана", "SMS, email, Telegram/push-уведомления", "Центральный dashboard и журнал событий", "Управление серверами, backup, тестирование и troubleshooting"],
          stages: ["Инвентаризация систем и план мониторинга", "Настройка правил и каналов оповещения", "Программирование сервера/dashboard и интеграция", "Тестирование, сдача и постоянная инженерная поддержка"],
          result: "Заказчик видит состояние объекта 24/7, своевременно получает SMS/email-оповещения, проблемы решаются до серьезного ущерба или простоя."
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
      "engineering-monitoring": "network",
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
        resultPartial: "Աշխատանքների հիմնական մասը կատարված է, իսկ մնացած փուլերը շարունակվում են ըստ հաստատված ժամանակացույցի։",
        resultCompleted: "Համակարգերը հանձնված են շահագործման և ապահովում են օբյեկտի կայուն անվտանգ աշխատանքը։"
      },
      en: {
        problem: "The facility required stable and controllable engineering systems for safe daily operations.",
        solutionPrefix: "Implemented scope: ",
        resultCurrent: "The project is in progress with phased installation and configuration according to facility operations.",
        resultPartial: "The main scope is complete and the remaining stages continue according to the approved schedule.",
        resultCompleted: "The systems are delivered and support stable, secure daily operation of the facility."
      },
      ru: {
        problem: "Объекту требовались стабильные и управляемые инженерные системы для безопасной ежедневной работы.",
        solutionPrefix: "Реализованное решение: ",
        resultCurrent: "Проект в работе: системы поэтапно монтируются и настраиваются с учетом режима объекта.",
        resultPartial: "Основной объем выполнен, оставшиеся этапы продолжаются по утвержденному графику.",
        resultCompleted: "Системы сданы и обеспечивают стабильную и безопасную ежедневную работу объекта."
      }
    };
    var copy = site.i18n.pickLanguageDictionary(copyByLanguage, language);
    return {
      problem: copy.problem,
      solution: copy.solutionPrefix + (worksPreview || "-"),
      result: project.status === "current" ? copy.resultCurrent : (project.status === "partial" ? copy.resultPartial : copy.resultCompleted)
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

  function projectAgendaMarkup(project, works) {
    var e = site.utils.escapeHtml;
    var language = site.i18n.language || "hy";
    var copy = site.i18n.pickLanguageDictionary({
      hy: {
        eyebrow: "Կատարված աշխատանքներ",
        title: "Ինչ է իրականացվել օբյեկտում",
        text: "Ստորև ներկայացված է աշխատանքների ցանկը, իսկ հաջորդ բաժնում՝ իրական կատարված աշխատանքների լուսանկարները։",
        sectorLabel: "Կատարման հատված",
        itemLabel: "Աշխատանք"
      },
      en: {
        eyebrow: "Delivered works",
        title: "What was implemented on site",
        text: "The work list is below; the next section shows real photos of completed work on site.",
        sectorLabel: "Work area",
        itemLabel: "Work"
      },
      ru: {
        eyebrow: "Выполненные работы",
        title: "Что было реализовано на объекте",
        text: "Ниже список работ, а в следующем разделе — реальные фотографии выполненных работ на объекте.",
        sectorLabel: "Участок работ",
        itemLabel: "Работа"
      }
    }, language);
    var sector = localTitle({ title: project.sector });
    var itemMarkup = (works || []).map(function (item, index) {
      return "" +
        '<article class="project-agenda-card">' +
          '<span>' + e(copy.itemLabel) + " " + e(String(index + 1).padStart(2, "0")) + "</span>" +
          "<h3>" + e(item) + "</h3>" +
        "</article>";
    }).join("");

    return "" +
      '<section class="project-agenda reveal">' +
        '<div class="section-head project-agenda-head">' +
          "<div>" +
            '<span class="eyebrow">' + e(copy.eyebrow) + "</span>" +
            '<h2 class="section-title">' + e(copy.title) + "</h2>" +
          "</div>" +
          '<p class="section-copy">' + e(copy.text) + "</p>" +
        "</div>" +
        (sector ? (
          '<div class="project-agenda-sector">' +
            '<span>' + e(copy.sectorLabel) + "</span>" +
            "<strong>" + e(sector) + "</strong>" +
          "</div>"
        ) : "") +
        '<div class="project-agenda-grid">' + itemMarkup + "</div>" +
      "</section>";
  }

  function currentProjectBanner(project) {
    if (!project || (project.status !== "current" && project.status !== "partial")) return "";
    var e = site.utils.escapeHtml;
    var language = site.i18n.language || "hy";
    var copyByLanguage = {
      hy: {
        badge: "Ընթացքի մեջ",
        partialBadge: "Մասամբ ավարտված",
        title: "Այս օբյեկտում աշխատանքները ընթացքի մեջ են",
        partialTitle: "Այս օբյեկտի աշխատանքների մի մասը դեռ ընթացքի մեջ է",
        text: "Ստորև ներկայացված են ֆոտոներ ու ծառայությունների ցանկ, որոնք կատարվում են կամ արդեն ավարտվել են այս նախագծի շրջանակում։",
        stagesTitle: "Փուլեր",
        stages: ["Չափագրում և նախագիծ", "Մատակարարում", "Տեղադրում", "Ծրագրավորում", "Հանձնում"],
        activeLabel: "Ընթացիկ",
        cta: "Հետաքրքրվա՞ծ եք նման լուծումով",
        ctaBtn: "Ստանալ կոմերցիոն առաջարկ"
      },
      en: {
        badge: "In progress",
        partialBadge: "Partially completed",
        title: "Work is currently ongoing at this facility",
        partialTitle: "Part of the work at this facility is still in progress",
        text: "The photos and work scope below reflect what is being installed or has already been completed within this project.",
        stagesTitle: "Stages",
        stages: ["Survey and design", "Supply", "Installation", "Programming", "Handover"],
        activeLabel: "Active",
        cta: "Interested in a similar solution?",
        ctaBtn: "Get a commercial proposal"
      },
      ru: {
        badge: "В работе",
        partialBadge: "Частично завершено",
        title: "На этом объекте работы продолжаются",
        partialTitle: "Часть работ на объекте еще продолжается",
        text: "Ниже представлены фотографии и перечень работ, которые выполняются или уже завершены в рамках этого проекта.",
        stagesTitle: "Этапы",
        stages: ["Замер и проект", "Поставка", "Монтаж", "Программирование", "Сдача"],
        activeLabel: "Активно",
        cta: "Интересует похожее решение?",
        ctaBtn: "Получить коммерческое предложение"
      }
    };
    var copy = site.i18n.pickLanguageDictionary(copyByLanguage, language);
    var activeStageIndex = project.status === "partial" ? 3 : 2;
    var phase = project.phase || "";
    var stageItems = copy.stages.map(function (stage, index) {
      var isActive = index === activeStageIndex;
      var isDone = index < activeStageIndex;
      return '' +
        '<li class="project-stage-item' + (isActive ? " is-active" : "") + (isDone ? " is-done" : "") + '">' +
          '<span>' + e(String(index + 1).padStart(2, "0")) + '</span>' +
          '<strong>' + e(stage) + '</strong>' +
          (isActive ? '<em>' + e(copy.activeLabel) + '</em>' : '') +
        '</li>';
    }).join("");

    return '' +
      '<div class="current-project-banner reveal">' +
        '<div class="current-project-banner-head">' +
          '<span class="current-project-badge">' + e(project.status === "partial" ? copy.partialBadge : copy.badge) + '</span>' +
          '<div>' +
            '<h2>' + e(project.status === "partial" ? copy.partialTitle : copy.title) + '</h2>' +
            '<p>' + e(copy.text) + '</p>' +
            (phase ? '<p class="project-phase-note">' + e(phase) + '</p>' : '') +
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
    var serviceShowcase = id === "video-surveillance"
      ? videoSurveillanceShowcaseMarkup()
      : id === "engineering-monitoring"
        ? engineeringMonitoringPageMarkup()
        : serviceApproachMarkup(id);
    var galleryCopy = detailGalleryCopy(kind, id);
    var serviceScope = kind === "service" ? serviceScopeMarkup(id, chips || []) : "";
    var serviceEquipment = kind === "service" && id !== "engineering-monitoring" ? serviceEquipmentMarkup(id, chips || []) : "";
    var projectStory = kind === "project" ? projectStoryMarkup(data, chips || []) : "";
    var projectAgenda = kind === "project" ? projectAgendaMarkup(data, chips || []) : "";
    var activeBanner = kind === "project" ? currentProjectBanner(data) : "";
    var gallerySection = kind === "service" && id !== "engineering-monitoring" ? "" +
      '<section class="detail-gallery-section reveal">' +
        '<div class="section-head">' +
          "<div>" +
            '<span class="eyebrow">' + e(galleryCopy.eyebrow) + "</span>" +
            '<h2 class="section-title">' + e(galleryCopy.title) + "</h2>" +
          "</div>" +
          '<p class="section-copy">' + e(galleryCopy.text) + "</p>" +
        "</div>" +
        '<div class="detail-gallery">' + galleryMarkup(images, title, kind === "project" ? chips : null) + "</div>" +
      "</section>" : "";
    var projectGallerySection = kind === "project" && images && images.length ? "" +
      '<section class="detail-gallery-section detail-work-gallery reveal">' +
        '<div class="section-head">' +
          "<div>" +
            '<span class="eyebrow">' + e(galleryCopy.eyebrow) + "</span>" +
            '<h2 class="section-title">' + e(galleryCopy.title) + "</h2>" +
          "</div>" +
          '<p class="section-copy">' + e(galleryCopy.text) + "</p>" +
        "</div>" +
        '<div class="detail-gallery">' + galleryMarkup(images, title, kind === "project" ? chips : null) + "</div>" +
      "</section>" : "";

    var projectBody = kind === "project" ? (
      activeBanner +
      projectStory +
      projectAgenda +
      projectGallerySection +
      (systemGallery ? (
        '<div class="section-head detail-system-head">' +
          "<div>" +
            '<span class="eyebrow">' + e(site.i18n.get("detail.systemGalleryEyebrow", "Systems")) + "</span>" +
            '<h2 class="section-title">' + e(site.i18n.get("detail.systemGalleryTitle", "Installed system visuals")) + "</h2>" +
          "</div>" +
          '<p class="section-copy">' + e(site.i18n.get("detail.systemGalleryText", "")) + "</p>" +
        "</div>" +
        '<div class="detail-system-grid reveal">' + systemGallery + "</div>"
      ) : "")
    ) : "";

    var pageClass = "detail-page" + (id === "engineering-monitoring" ? " detail-page--monitoring" : "");
    var heroMarkup = '<div class="detail-hero" style="--detail-image: url(' + e(heroImage) + ')">' +
          '<div class="container detail-hero-inner reveal">' +
            '<a class="detail-back" href="' + e(backHref) + '">&lt; ' + e(site.i18n.get("detail.back")) + "</a>" +
            '<span class="eyebrow">' + e(type) + "</span>" +
            "<h1>" + e(title) + "</h1>" +
            "<p>" + e(lead) + "</p>" +
            '<div class="tag-row detail-tags">' + tagMarkup(chips) + "</div>" +
          "</div>" +
        "</div>";

    return "" +
      '<section class="' + pageClass + '">' +
        heroMarkup +
        '<div class="container detail-body' + (id === "engineering-monitoring" ? " detail-body--monitoring" : "") + '">' +
          (kind === "project" ? projectBody : (
          activeBanner +
          projectStory +
          (id === "engineering-monitoring" ? serviceShowcase : serviceScope + serviceEquipment + serviceShowcase) +
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
          projectAgenda +
          projectGallerySection +
          gallerySection
          )) +
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
    var projectLeadKey = project.status === "completed" ? "detail.projectLead" : "detail.projectLeadCurrent";
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
