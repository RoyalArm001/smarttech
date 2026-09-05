(function (site) {
  var jobBase = "/img/our-jobs/";
  var serviceBase = "/img/services/";
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
        hy: "Ազդարարման անվտանգության համակարգ",
        en: "Intrusion alarm security system",
        ru: "Охранная сигнализация"
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
    audio: {
      title: {
        hy: "Ամբողջական աուդիո համակարգի տեղադրում",
        en: "Complete audio system installation",
        ru: "Монтаж полной аудиосистемы"
      },
      image: serviceBase + "audio_systems.jpg"
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
      id: "e1-residence",
      title: "E1 Residence",
      status: "completed",
      progress: 100,
      order: 0,
      phase: "Էլեկտրամոնտաժային աշխատանքներն ավարտված են",
      works: ["Էլեկտրամոնտաժային աշխատանքներ"],
      images: ["https://aoeqjlvtncxblkhvqmeu.supabase.co/storage/v1/object/public/project-images/projects/e1-residence.webp"],
      systemImages: [system.electrical],
      translations: {
        en: { title: "E1 Residence", works: ["Electrical installation works"], phase: "Electrical installation works completed" },
        ru: { title: "E1 Residence", works: ["Электромонтажные работы"], phase: "Электромонтажные работы завершены" }
      }
    },
    {
      id: "atlantis-yerevan",
      title: "Atlantis Yerevan",
      works: ["Էլեկտրամոնտաժային աշխատանքներ", "Հրդեհային ազդարարման համակարգ"],
      images: [jobBase + "atlantis-yerevan.webp"],
      systemImages: [system.electrical, system.alarmPanel],
      translations: {
        en: { title: "Atlantis Yerevan", works: ["Electrical installation works", "Fire alarm system"] },
        ru: { title: "Atlantis Yerevan", works: ["Электромонтажные работы", "Система пожарной сигнализации"] }
      }
    },
    {
      id: "sunday-towers",
      title: "Sunday Towers",
      works: ["Էլեկտրամոնտաժային աշխատանքներ"],
      images: [jobBase + "sunday-towers.webp"],
      systemImages: [system.electrical],
      translations: {
        en: { title: "Sunday Towers", works: ["Electrical installation works"] },
        ru: { title: "Sunday Towers", works: ["Электромонтажные работы"] }
      }
    },
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
        jobBase + "wyndham-2.png"
      ],
      systemImages: [system.electrical, system.serverRack, system.cctv, system.alarmPanel, system.access]
    },
    {
      id: "only-one",
      title: "Only One Residential Complex",
      works: [
        "Տեսահսկման սարքերի տեղադրում և ծրագրավորում",
        "Դռների մուտքի վերահսկման կարգավորում",
        "Ավտոմատ դոմոֆոնների տեղադրում և կարգավորում",
        "Ազդարարման անվտանգության համակարգի տեղադրում"
      ],
      images: [jobBase + "only-one-1.png", jobBase + "only-one-2.png", jobBase + "only-one-3.png"],
      systemImages: [system.cctv, system.access, system.intercom, system.alarmPanel]
    },
    {
      id: "bidek",
      title: "Bidek Davtashen Residential Complex",
      works: ["Տեսահսկում", "Հրդեհային ազդարարում", "Տարհանման համակարգ", "Մուտքի վերահսկում"],
      images: [jobBase + "bidek-1.jpg", jobBase + "bidek-2.jpg", jobBase + "bidek-3.jpg"],
      systemImages: [system.cctv, system.alarmPanel, system.access]
    },
    {
      id: "moselle-armenia",
      title: "Moselle Armenia Wellness & Medical SPA",
      works: ["Medical SPA բուժական հատվածում կատարված աշխատանքներ", "UTP մալուխի մոնտաժ", "Կապի մալուխային համակարգի կառուցում", "Ամբողջական աուդիո համակարգի տեղադրում"],
      images: [
        jobBase + "moselle-armenia-hotel.jpg",
        jobBase + "moselle-medical-hydromassage.png",
        jobBase + "moselle-medical-laboratory.png",
        jobBase + "moselle-medical-electrotherapy.png",
        jobBase + "moselle-medical-massage.png"
      ],
      systemImages: [system.network, system.audio],
      sector: {
        hy: "Բուժական / Medical SPA հատված",
        en: "Medical / SPA section",
        ru: "Медицинский / SPA сектор"
      },
      translations: {
        en: { title: "Moselle Armenia Wellness & Medical SPA", works: ["Works in the Medical SPA section", "UTP cable installation", "Communication cabling system build-out", "Complete audio system installation"] },
        ru: { title: "Moselle Armenia Wellness & Medical SPA", works: ["Работы в медицинском SPA-секторе", "Монтаж UTP-кабеля", "Построение кабельной системы связи", "Монтаж полной аудиосистемы"] },
      }
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

  var activeProjectIds = ["atlantis-yerevan", "sunday-towers", "dalan", "abovyan", "wyndham", "only-one", "bidek", "pallada-tsaghkadzor"];
  site.content.featuredProjectId = "atlantis-yerevan";
  site.content.activeProjectIds = activeProjectIds;
  var projectStatusLabels = {
    current: {
      hy: "Ընթացիկ",
      en: "In progress",
      ru: "В работе"
    },
    partial: {
      hy: "Մասամբ ավարտված",
      en: "Partially completed",
      ru: "Частично завершено"
    },
    completed: {
      hy: "Ավարտված",
      en: "Completed",
      ru: "Завершено"
    }
  };
  var originalProjectOrder = {};

  site.content.projects.forEach(function (project, index) {
    originalProjectOrder[project.id] = index;
    if (!projectStatusLabels[project.status]) {
      project.status = activeProjectIds.indexOf(project.id) >= 0 ? "current" : "completed";
    }
    project.order = Number.isFinite(Number(project.order)) ? Number(project.order) : index;
    project.progress = Number.isFinite(Number(project.progress))
      ? Math.max(0, Math.min(100, Math.round(Number(project.progress))))
      : (project.status === "completed" ? 100 : 0);
    project.statusLabels = projectStatusLabels[project.status];
  });

  site.content.projects.sort(function (a, b) {
    var statusRank = { current: 0, partial: 1, completed: 2 };
    var rankDifference = statusRank[a.status] - statusRank[b.status];
    return rankDifference || a.order - b.order || originalProjectOrder[a.id] - originalProjectOrder[b.id];
  });

  site.content.completedGallery = [
    jobBase + "completed-projects-1.png",
    jobBase + "completed-projects-2.png",
    jobBase + "completed-projects-3.png",
    jobBase + "completed-projects-4.png"
  ];
})(window.SmartTech);
