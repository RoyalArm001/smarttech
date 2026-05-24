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
    network: {
      title: {
        hy: "Կապի և ցանցային համակարգեր",
        en: "Communication and network systems",
        ru: "Системы связи и сети"
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
      image: "https://images.pexels.com/photos/13007861/pexels-photo-13007861.jpeg?auto=compress&cs=tinysrgb&w=1400"
    },
    intercom: {
      title: {
        hy: "Ավտոմատ դոմոֆոնների տեղադրում և կարգավորում",
        en: "Automatic intercom installation and setup",
        ru: "Монтаж и настройка автоматических домофонов"
      },
      image: "https://images.pexels.com/photos/32268533/pexels-photo-32268533.jpeg?auto=compress&cs=tinysrgb&w=1400"
    }
  };

  site.content.projects = [
    {
      id: "abovyan",
      title: "Abovyan 5/5 Hotel (Multi Group)",
      works: ["Հրդեհային ազդարարում", "Տարհանման համակարգ", "Մուտքի վերահսկում", "Էլեկտրական տաքացվող հատակներ"],
      images: [jobBase + "abovyan-1.png", jobBase + "abovyan-2.png"],
      systemImages: [system.alarm, system.access, system.electrical]
    },
    {
      id: "amiryan",
      title: "Amiryan Business Center",
      works: ["Տեսահսկում", "Մուտքի վերահսկում", "Կառուցվածքային մալուխային համակարգ", "Ներքին լուսավորություն և էլեկտրացանց"],
      images: [jobBase + "amiryan-1.png", jobBase + "amiryan-2.png"],
      systemImages: [system.cctv, system.access, system.network, system.electrical]
    },
    {
      id: "eria",
      title: "Eria Hotel",
      works: ["Տեսահսկում", "Հրդեհային ազդարարում", "Տարհանման համակարգ", "Էլեկտրամոնտաժ"],
      images: [jobBase + "eria-1.png"],
      systemImages: [system.cctv, system.alarm, system.electrical]
    },
    {
      id: "dalan",
      title: "Dalan Technopark",
      works: ["Տեսահսկում", "Հրդեհային ազդարարում", "Տարհանման համակարգ", "Մուտքի վերահսկում"],
      images: [jobBase + "dalan-1.webp", jobBase + "dalan-2.png"],
      systemImages: [system.cctv, system.alarm, system.access]
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
      systemImages: [system.electrical, system.network, system.cctv, system.alarm, system.access]
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
      systemImages: [system.cctv, system.access, system.intercom, system.alarm]
    },
    {
      id: "bidek",
      title: "Bidek Davtashen Residential Complex",
      works: ["Տեսահսկում", "Հրդեհային ազդարարում", "Տարհանման համակարգ", "Մուտքի վերահսկում"],
      images: [jobBase + "bidek-1.jpg", jobBase + "bidek-2.jpg", jobBase + "bidek-3.jpg"],
      systemImages: [system.cctv, system.alarm, system.access]
    },
    {
      id: "wildberries",
      title: "Wildberries",
      works: ["Էլեկտրամոնտաժ", "Տեսահսկում", "Հրդեհային ազդարարում", "Մուտքի վերահսկում", "Կապի համակարգեր"],
      images: [jobBase + "wildberries-1.png", jobBase + "wildberries-2.png"],
      systemImages: [system.electrical, system.cctv, system.alarm, system.access, system.network]
    }
  ];

  site.content.completedGallery = [
    jobBase + "completed-projects-1.png",
    jobBase + "completed-projects-2.png",
    jobBase + "completed-projects-3.png",
    jobBase + "completed-projects-4.png"
  ];
})(window.SmartTech);
