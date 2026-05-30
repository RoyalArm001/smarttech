(function (site) {
  var base = site.content.company.assetBase;

  site.content.services = [
    {
      id: "video-surveillance",
      title: "Տեսահսկման համակարգեր",
      lead: "Տեսախցիկների, ձայնագրիչների և հեռահար մոնիթորինգի լուծումներ՝ ճիշտ տեսադաշտով և հուսալի արխիվով։",
      image: base + "https://smarttechllc.am/images/services/installation_surveillance_systems.jpg",
      gallery: [
        base + "https://smarttechllc.am/images/services/installation_surveillance_systems.jpg",
        base + "https://smarttechllc.am/images/our-jobs/amiryan-1.png",
        base + "https://smarttechllc.am/images/our-jobs/dalan-1.webp",
        base + "https://smarttechllc.am/images/our-jobs/wildberries-1.png"
      ],
      tags: ["IP տեսախցիկներ", "NVR/DVR", "Հեռահար դիտում"]
    },
    {
      id: "fire-security",
      title: "Հրդեհային անվտանգություն",
      lead: "Հրդեհային ազդարարման, տարհանման և անվտանգության սցենարների նախագծում ու տեղադրում։",
      image: base + "https://smarttechllc.am/images/services/fire-security.jpg",
      gallery: [
        base + "https://smarttechllc.am/images/services/fire-security.jpg",
        base + "https://smarttechllc.am/images/our-jobs/abovyan-1.png",
        base + "https://smarttechllc.am/images/our-jobs/eria-1.png",
        base + "https://smarttechllc.am/images/our-jobs/dalan-2.png"
      ],
      tags: ["Ազդարարում", "Տարհանում", "Սերտիֆիկացված սարքեր"]
    },
    {
      id: "networks",
      title: "Ցանցերի տեղադրում",
      lead: "Կառուցվածքային մալուխային համակարգեր, rack-եր, Wi-Fi ծածկույթ և կայուն ներքին կապ։",
      image: base + "https://smarttechllc.am/images/services/installation_networks.jpg",
      gallery: [
        base + "https://smarttechllc.am/images/services/installation_networks.jpg",
        base + "https://smarttechllc.am/images/our-jobs/amiryan-2.png",
        base + "https://smarttechllc.am/images/our-jobs/wildberries-2.png",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-2.png"
      ],
      tags: ["LAN", "Wi-Fi", "Rack"]
    },
    {
      id: "electrical",
      title: "Էլեկտրամոնտաժային աշխատանքներ",
      lead: "Էլեկտրական ցանցերի նախագծում, մոնտաժ, լուսավորություն և բաշխիչ վահանների հավաքում։",
      image: base + "https://smarttechllc.am/images/services/electrical_installation_works.jpg",
      gallery: [
        base + "https://smarttechllc.am/images/services/electrical_installation_works.jpg",
        base + "https://smarttechllc.am/images/our-jobs/wyndham-1.png",
        base + "https://smarttechllc.am/images/our-jobs/wyndham-3.png",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-1.png"
      ],
      tags: ["Լուսավորություն", "Վահաններ", "Մալուխային ուղիներ"]
    },
    {
      id: "automation",
      title: "Ավտոմատացում և smart համակարգեր",
      lead: "Շենքերի կառավարման, մուտքի վերահսկման և սարքերի ինտեգրված կառավարման լուծումներ։",
      image: base + "https://smarttechllc.am/images/services/building_management_automation.jpg",
      gallery: [
        base + "https://smarttechllc.am/images/services/building_management_automation.jpg",
        base + "https://smarttechllc.am/images/our-jobs/only-one-1.png",
        base + "https://smarttechllc.am/images/our-jobs/only-one-2.png",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-3.png"
      ],
      tags: ["BMS", "Access control", "Smart logic"]
    },
    {
      id: "systems-design",
      title: "Սիստեմների նախագծում",
      lead: "Տվյալ տարածքի համար նախագծում ենք համակարգերի ամբողջական լուծումներ՝ ապահովելով արդյունավետություն, ռեզերվ և հեշտ շահագործում։",
      image: base + "https://smarttechllc.am/images/services/building_management_automation.jpg",
      gallery: [
        base + "https://smarttechllc.am/images/services/building_management_automation.jpg",
        base + "https://smarttechllc.am/images/services/installation_networks.jpg",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-3.png",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-4.png"
      ],
      tags: ["Նախագիծ", "Հաշվարկ", "Ամբողջական համակարգ"]
    },
    {
      id: "audio-systems",
      title: "Աուդիո համակարգերի տեղադրում",
      lead: "Ֆոնային երաժշտության, public address, կոնֆերանսային և ձայնային ծանուցման համակարգերի նախագծում, տեղադրում և կարգաբերում։",
      image: base + "https://smarttechllc.am/images/services/building_management_automation.jpg",
      gallery: [
        base + "https://smarttechllc.am/images/services/building_management_automation.jpg",
        base + "https://smarttechllc.am/images/services/installation_networks.jpg",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-3.png",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-4.png"
      ],
      tags: ["Public Address", "Background music", "Conference audio"]
    },
    {
      id: "wacker",
      title: "Wacker համակարգերի տեղադրում",
      lead: "Տեխնիկական համակարգերի ճշգրիտ տեղադրում և կարգաբերում՝ օբյեկտի պահանջներին համապատասխան։",
      image: base + "https://smarttechllc.am/images/services/wacker_installation.jpg",
      gallery: [
        base + "https://smarttechllc.am/images/services/wacker_installation.jpg",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-1.png",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-4.png"
      ],
      tags: ["Մոնտաժ", "Կարգաբերում", "Սպասարկում"]
    },
    {
      id: "powder-coating",
      title: "Փոշեներկում",
      lead: "Մետաղական դետալների պաշտպանիչ և էսթետիկ փոշեներկում՝ հավասար ծածկույթով։",
      image: base + "https://smarttechllc.am/images/services/powder_coating.jpg",
      gallery: [
        base + "https://smarttechllc.am/images/services/powder_coating.jpg",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-2.png",
        base + "https://smarttechllc.am/images/our-jobs/completed-projects-4.png"
      ],
      tags: ["Մետաղ", "Ծածկույթ", "Արտադրական որակ"]
    }
  ];
})(window.SmartTech);
