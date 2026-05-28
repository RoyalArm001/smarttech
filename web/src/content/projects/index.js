(function (site) {
  var base = site.content.company.assetBase;
  var jobBase = base + "/images/our-jobs/";
  var serviceBase = base + "/images/services/";
  var system = {
    cctv: {
      title: {
        hy: "Տեսահսկման սարքերի տեղադրում և ծրագրավորում",
        en: "CCTV device installation and programming",
        ru: "Монтаж и программирование видеонаблюдения"
      },
      image: serviceBase + "installation_surveillance_systems.jpg"
    },
    alarm: {
      title: {
        hy: "Alarm անվտանգության համակարգ",
        en: "Alarm security system",
        ru: "Охранная alarm-система"
      },
      image: serviceBase + "fire-security.jpg"
    },
    alarmPanel: {
      title: {
        hy: "Պատրաստի fire alarm call point",
        en: "Prepared fire alarm call point",
        ru: "Готовая точка пожарной сигнализации"
      },
      image: serviceBase + "fire-security.jpg"
    },
    network: {
      title: {
        hy: "Կապի և ցանցային համակարգեր",
        en: "Communication and network systems",
        ru: "Системы связи и сети"
      },
      image: serviceBase + "installation_networks.jpg"
    },
    serverRack: {
      title: {
        hy: "Պատրաստի սերվերային պահարան և patch panel",
        en: "Prepared server rack and patch panel",
        ru: "Готовый серверный шкаф и patch panel"
      },
      image: serviceBase + "installation_networks.jpg"
    },
    electrical: {
      title: {
        hy: "Էլեկտրամոնտաժային աշխատանքներ",
        en: "Electrical installation works",
        ru: "Электромонтажные работы"
      },
      image: serviceBase + "electrical_installation_works.jpg"
    },
    automation: {
      title: {
        hy: "Ավտոմատացում և կառավարման համակարգեր",
        en: "Automation and control systems",
        ru: "Автоматизация и системы управления"
      },
      image: serviceBase + "building_management_automation.jpg"
    },
    access: {
      title: {
        hy: "Դռների մուտքի վերահսկման կարգավորում",
        en: "Door access control setup",
        ru: "Настройка контроля доступа дверей"
      },
      image: serviceBase + "building_management_automation.jpg"
    },
    intercom: {
      title: {
        hy: "Ավտոմատ դոմոֆոնների տեղադրում և կարգավորում",
        en: "Automatic intercom installation and setup",
        ru: "Монтаж и настройка автоматических домофонов"
      },
      image: jobBase + "only-one-2.png"
    }
  };

  site.content.projects = [
    {
      id: "abovyan",
      title: "Abovyan 5/5 Hotel (Multi Group)",
      works: ["Հրդեհային ազդարարում", "Տարհանման համակարգ", "Մուտքի վերահսկում", "Էլեկտրական տաքացվող հատակներ"],
      images: [jobBase + "abovyan-1.png", jobBase + "abovyan-2.png"],
      systemImages: [system.alarmPanel, system.access, system.electrical]
    },
    {
      id: "amiryan",
      title: "Amiryan Business Center",
      works: ["Տեսահսկում", "Մուտքի վերահսկում", "Կառուցվածքային մալուխային համակարգ", "Ներքին լուսավորություն և էլեկտրացանց"],
      images: [jobBase + "amiryan-1.png", jobBase + "amiryan-2.png"],
      systemImages: [system.cctv, system.access, system.serverRack, system.electrical]
    },
    {
      id: "eria",
      title: "Eria Hotel",
      works: ["Տեսահսկում", "Հրդեհային ազդարարում", "Տարհանման համակարգ", "Էլեկտրամոնտաժ"],
      images: [jobBase + "eria-1.png"],
      systemImages: [system.cctv, system.alarmPanel, system.electrical]
    },
    {
      id: "dalan",
      title: "Dalan Technopark",
      works: ["Տեսահսկում", "Հրդեհային ազդարարում", "Տարհանման համակարգ", "Մուտքի վերահսկում"],
      images: [jobBase + "dalan-1.webp", jobBase + "dalan-2.png"],
      systemImages: [system.cctv, system.alarmPanel, system.access]
    },
    {
      id: "wyndham",
      title: "Wyndham Grand Tsaghkadzor",
      works: ["Էլեկտրական համակարգեր", "Կապի համակարգեր", "Տեսահսկում", "Հրդեհային անվտանգություն", "Մուտքի վերահսկում"],
      images: [
        jobBase + "wyndham-1.png",
        jobBase + "wyndham-2.png",
        jobBase + "wyndham-3.png",
        jobBase + "wyndham-4.png"
      ],
      systemImages: [system.electrical, system.serverRack, system.cctv, system.alarmPanel, system.access]
    },
    {
      id: "only-one",
      title: "ՕՆլի Վան բնակելի համալիր",
      works: [
        "Տեսահսկման սարքերի տեղադրում և ծրագրավորում",
        "Դռների մուտքի վերահսկման կարգավորում",
        "Ավտոմատ դոմոֆոնների տեղադրում և կարգավորում",
        "Alarm անվտանգության համակարգի տեղադրում"
      ],
      images: [jobBase + "only-one-1.png", jobBase + "only-one-2.png", jobBase + "only-one-3.png"],
      systemImages: [system.cctv, system.access, system.intercom, system.alarmPanel]
    },
    {
      id: "bidek",
      title: "Bedeck Davtashen Residential Complex",
      works: ["Տեսահսկում", "Հրդեհային ազդարարում", "Տարհանման համակարգ", "Մուտքի վերահսկում"],
      images: [jobBase + "bidek-1.jpg", jobBase + "bidek-2.jpg", jobBase + "bidek-3.jpg"],
      systemImages: [system.cctv, system.alarmPanel, system.access]
    },
    {
      id: "pallada-tsaghkadzor",
      title: "Pallada Tsaghkadzor",
      works: ["Ավտոմատ հրդեհային ազդարարում", "Տարհանման ծանուցման համակարգ", "Էլեկտրամոնտաժային աշխատանքներ", "BMS"],
      images: [jobBase + "pallada-tsaghkadzor.png"],
      systemImages: [system.alarmPanel, system.electrical, system.automation],
      translations: {
        en: { title: "Pallada Tsaghkadzor", works: ["Automatic fire alarm", "Evacuation notification system", "Electrical installation works", "BMS"] },
        ru: { title: "Pallada Tsaghkadzor", works: ["Автоматическая пожарная сигнализация", "Система оповещения и эвакуации", "Электромонтажные работы", "BMS"] },
        be: { title: "Pallada Tsaghkadzor", works: ["Аўтаматычная пажарная сігналізацыя", "Сістэма апавяшчэння і эвакуацыі", "Электрамантажныя работы", "BMS"] },
        fr: { title: "Pallada Tsaghkadzor", works: ["Alarme incendie automatique", "Système d'alerte et d'évacuation", "Travaux d'installation électrique", "BMS"] },
        ka: { title: "Pallada Tsaghkadzor", works: ["ავტომატური ხანძრის სიგნალიზაცია", "ევაკუაციის შეტყობინების სისტემა", "ელექტრომონტაჟის სამუშაოები", "BMS"] }
      }
    },
    {
      id: "uls-data-center",
      title: "ULS Data Center",
      works: ["Ներքին լուսավորություն և ուժային սարքավորումներ", "Ավտոմատ հրդեհային ազդարարում", "Կառուցվածքային մալուխային համակարգ"],
      images: [jobBase + "uls-data-center.png"],
      systemImages: [system.electrical, system.alarmPanel, system.serverRack],
      translations: {
        en: { title: "ULS Data Center", works: ["Internal lighting and power equipment", "Automatic fire alarm", "Structured cabling system"] },
        ru: { title: "ULS Data Center", works: ["Внутреннее электроосвещение и силовое оборудование", "Автоматическая пожарная сигнализация", "Структурированная кабельная система"] },
        be: { title: "ULS Data Center", works: ["Унутранае электраасвятленне і сілавое абсталяванне", "Аўтаматычная пажарная сігналізацыя", "Структураваная кабельная сістэма"] },
        fr: { title: "ULS Data Center", works: ["Éclairage intérieur et équipements de puissance", "Alarme incendie automatique", "Système de câblage structuré"] },
        ka: { title: "ULS Data Center", works: ["შიდა განათება და ძალოვანი აღჭურვილობა", "ავტომატური ხანძრის სიგნალიზაცია", "სტრუქტურირებული საკაბელო სისტემა"] }
      }
    },
    {
      id: "acba-sebastia",
      title: "ACBA Bank, Sebastia 80",
      works: ["Ներքին լուսավորության համակարգ", "Ուժային սարքավորումների համակարգ", "Էլեկտրամոնտաժային աշխատանքներ"],
      images: [jobBase + "acba-sebastia.png"],
      systemImages: [system.electrical],
      translations: {
        en: { title: "ACBA Bank, Sebastia 80", works: ["Internal lighting system", "Power equipment system", "Electrical installation works"] },
        ru: { title: "ACBA Bank, Себастия 80", works: ["Система внутреннего электроосвещения", "Силовое оборудование", "Электромонтажные работы"] },
        be: { title: "ACBA Bank, Себастыя 80", works: ["Сістэма ўнутранага электраасвятлення", "Сілавое абсталяванне", "Электрамантажныя работы"] },
        fr: { title: "ACBA Bank, Sebastia 80", works: ["Système d'éclairage intérieur", "Système d'équipements de puissance", "Travaux d'installation électrique"] },
        ka: { title: "ACBA Bank, Sebastia 80", works: ["შიდა განათების სისტემა", "ძალოვანი აღჭურვილობის სისტემა", "ელექტრომონტაჟის სამუშაოები"] }
      }
    },
    {
      id: "evocabank",
      title: "Evocabank",
      works: ["Ներքին լուսավորության համակարգ", "Ուժային սարքավորումների համակարգ", "Էլեկտրամոնտաժային աշխատանքներ"],
      images: [jobBase + "evocabank.png"],
      systemImages: [system.electrical],
      translations: {
        en: { title: "Evocabank", works: ["Internal lighting system", "Power equipment system", "Electrical installation works"] },
        ru: { title: "Evocabank", works: ["Система внутреннего электроосвещения", "Силовое оборудование", "Электромонтажные работы"] },
        be: { title: "Evocabank", works: ["Сістэма ўнутранага электраасвятлення", "Сілавое абсталяванне", "Электрамантажныя работы"] },
        fr: { title: "Evocabank", works: ["Système d'éclairage intérieur", "Système d'équipements de puissance", "Travaux d'installation électrique"] },
        ka: { title: "Evocabank", works: ["შიდა განათების სისტემა", "ძალოვანი აღჭურვილობის სისტემა", "ელექტრომონტაჟის სამუშაოები"] }
      }
    },
    {
      id: "movenpick-hotel",
      title: "Movenpick Hotel",
      works: ["Գլխավոր նախագծային ինժեների գործառույթ", "Տեխնիկական համակարգերի համակարգում", "Նախագծային վերահսկում"],
      images: [jobBase + "movenpick-hotel.png"],
      systemImages: [system.automation, system.electrical],
      translations: {
        en: { title: "Movenpick Hotel", works: ["Chief project engineer function", "Technical systems coordination", "Design supervision"] },
        ru: { title: "Гостиница Movenpick", works: ["Функция главного инженера проекта", "Координация технических систем", "Проектный контроль"] },
        be: { title: "Гасцініца Movenpick", works: ["Функцыя галоўнага інжынера праекта", "Каардынацыя тэхнічных сістэм", "Праектны кантроль"] },
        fr: { title: "Hôtel Movenpick", works: ["Fonction d'ingénieur principal du projet", "Coordination des systèmes techniques", "Supervision de conception"] },
        ka: { title: "Movenpick Hotel", works: ["მთავარი პროექტის ინჟინრის ფუნქცია", "ტექნიკური სისტემების კოორდინაცია", "პროექტის ზედამხედველობა"] }
      }
    },
    {
      id: "wildberries",
      title: "Wildberries",
      works: ["Էլեկտրամոնտաժ", "Տեսահսկում", "Հրդեհային ազդարարում", "Մուտքի վերահսկում", "Կապի համակարգեր"],
      images: [jobBase + "wildberries-1.png", jobBase + "wildberries-2.png"],
      systemImages: [system.electrical, system.cctv, system.alarmPanel, system.access, system.serverRack]
    }
  ];

  site.content.completedGallery = [
    jobBase + "completed-projects-1.png",
    jobBase + "completed-projects-2.png",
    jobBase + "completed-projects-3.png",
    jobBase + "completed-projects-4.png"
  ];
})(window.SmartTech);
