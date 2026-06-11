(function (site) {
  var img = "/img/services/";
  site.content.services = [
    {
      id: "systems-design",
      title: "Համակարգերի նախագծում",
      lead: "Նախագծում ենք էլեկտրամատակարարման, թույլ հոսանքի, ավտոմատացման և կառավարման համակարգերը՝ հաշվի առնելով օբյեկտի ռիսկերը, բեռները և հետագա ընդլայնումը։",
      image: img + "full_design_integrated.jpg",
      gallery: [img + "full_design_integrated.jpg", img + "technical_drawing.jpg", img + "systems_design.jpg", img + "bms_office.jpg"],
      tags: ["Նախագիծ", "Հաշվարկ", "Ինժեներական լուծում", "BMS"]
    },
    {
      id: "equipment-supply",
      title: "Սարքավորումների մատակարարում",
      lead: "Աշխատում ենք վստահելի արտադրողների հետ, ճիշտ ենք ընտրում սարքավորումները և մատակարարում ժամկետում՝ առանց ավելորդ ծախսերի։",
      image: img + "equipment_supply.jpg",
      gallery: [img + "equipment_supply.jpg", img + "server_rack.jpg", img + "installation_networks.jpg", img + "automation_cabinets.jpg"],
      tags: ["Մատակարարում", "Սարքավորում", "Արտադրողներ"]
    },
    {
      id: "installation",
      title: "Տեղադրում",
      lead: "Իրականացնում ենք համակարգերի պրոֆեսիոնալ տեղադրում՝ մալուխային ուղիներից մինչև վերջնական սարքավորում և փորձարկում։",
      image: img + "installation_works.jpg",
      gallery: [img + "installation_works.jpg", img + "cabling_installation.jpg", img + "electrical_installation_works.jpg", img + "installation_surveillance_systems.jpg"],
      tags: ["Տեղադրում", "Մոնտաժ", "Մալուխավորում", "Փորձարկում"]
    },
    {
      id: "automation-cabinets",
      title: "Ավտոմատիկայի պահարանների հավաքում",
      lead: "Հավաքում ենք ավտոմատիկայի պահարաններ՝ նախագծային փաստաթղթերին համապատասխան, կատարում ենք controller-ների նախնական կարգաբերում և անվտանգության ստուգումներ։",
      image: img + "wacker_installation.jpg",
      gallery: [img + "wacker_installation.jpg", img + "automation_cabinets.jpg", img + "commissioning_programming.jpg", img + "electrical_installation_works.jpg"],
      tags: ["Ավտոմատիկա", "Պահարան", "Հավաքում"]
    },
    {
      id: "commissioning-programming",
      title: "Գործարկում և ծրագրավորում",
      lead: "Կատարում ենք համակարգերի ծրագրավորում, համատեղ աշխատանքի կարգաբերում և գործարկման փորձարկում՝ օբյեկտը կայուն շահագործման հանձնելու համար։",
      image: img + "commissioning_programming.jpg",
      gallery: [img + "commissioning_programming.jpg", img + "interfaces_ui.jpg", img + "bms_office.jpg", img + "smart_systems.jpg"],
      tags: ["Ծրագրավորում", "Կարգաբերում", "Գործարկում"]
    },
    {
      id: "interfaces",
      title: "Ինտերֆեյսների մշակում",
      lead: "Ստեղծում ենք պարզ և հարմարավետ կառավարման ինտերֆեյսներ՝ դիսպետչերիզացիայի, մոնիթորինգի և արագ արձագանքման համար։",
      image: img + "interfaces_ui.jpg",
      gallery: [img + "interfaces_ui.jpg", img + "bms_office.jpg", img + "commissioning_programming.jpg", img + "building_management_automation.jpg"],
      tags: ["Ինտերֆեյս", "Դիսպետչերիզացիա", "Կառավարում"]
    },
    {
      id: "video-surveillance",
      title: "Տեսահսկման համակարգեր",
      lead: "Տեսախցիկների, NVR/DVR և հեռահար դիտարկման լուծումներ՝ ճիշտ տեսադաշտով և հուսալի արխիվով։",
      image: img + "installation_surveillance_systems.jpg",
      gallery: [img + "installation_surveillance_systems.jpg", img + "surveillance_outdoor.jpg", img + "surveillance_indoor.jpg", img + "access_control_door.jpg"],
      tags: ["IP տեսախցիկներ", "NVR/DVR", "Հեռահար դիտում"]
    },
    {
      id: "fire-security",
      title: "Հրդեհային անվտանգություն",
      lead: "Նախագծում և տեղադրում ենք հրդեհային ազդարարման, տարհանման և անվտանգության սցենարային համակարգեր։",
      image: img + "fire-security.jpg",
      gallery: [img + "fire-security.jpg", img + "fire_alarm_device.jpg", img + "installation_works.jpg", img + "commissioning_programming.jpg"],
      tags: ["Ազդարարում", "Տարհանում", "Սերտիֆիկացված սարքեր"]
    },
    {
      id: "networks",
      title: "Ցանցերի տեղադրում",
      lead: "Կառուցում ենք կառուցվածքային մալուխային համակարգեր, rack և Wi-Fi ցանցեր՝ կայուն կապով և ընդլայնման պաշարով։",
      image: img + "network_patch_panel.jpg",
      gallery: [img + "network_patch_panel.jpg", img + "installation_networks.jpg", img + "server_rack.jpg", img + "cabling_installation.jpg"],
      tags: ["LAN", "Wi-Fi", "Rack"]
    },
    {
      id: "electrical",
      title: "Էլեկտրամոնտաժային աշխատանքներ",
      lead: "Կատարում ենք էլեկտրական գծերի տեղադրում, վահանների հավաքում, լուսավորության և սնուցման լուծումների իրականացում։",
      image: img + "electrical_installation_works.jpg",
      gallery: [img + "electrical_installation_works.jpg", img + "cabling_installation.jpg", img + "installation_works.jpg", img + "automation_cabinets.jpg"],
      tags: ["Լուսավորություն", "Վահաններ", "Մալուխային ուղիներ"]
    },
    {
      id: "automation",
      title: "Ավտոմատացում և smart համակարգեր",
      lead: "Ինտեգրում ենք BMS և smart կառավարման լուծումներ՝ մուտքի, լուսավորության, կլիմայի և անվտանգության միասնական հսկողության համար։",
      image: img + "building_management_automation.jpg",
      gallery: [img + "building_management_automation.jpg", img + "smart_systems.jpg", img + "access_control_door.jpg", img + "interfaces_ui.jpg"],
      tags: ["BMS", "Մուտքի վերահսկում", "Smart կառավարում"]
    },
    {
      id: "engineering-monitoring",
      title: "24/7 Մոնիթորինգ և ավարուժ սպասարձում",
      lead: "Մոնիթորինգ սերվերը 24/7 ստուգում է CCTV, NVR, ցանցը, UPS-ը, սերվերները և անվտանգությունը։ Խնդրի դեպքում ահազանգում եք ստանում SMS, email կամ Telegram-ով։",
      image: img + "surveillance_indoor.jpg",
      gallery: [img + "surveillance_indoor.jpg", img + "interfaces_ui.jpg", img + "server_rack.jpg", img + "commissioning_programming.jpg"],
      tags: ["SMS ահազանգում", "Dashboard", "Սերվեր/NVR", "24/7"]
    },
    {
      id: "full-design",
      title: "Համակարգերի համալիր նախագծում",
      lead: "Օբյեկտի համար կազմում ենք ամբողջական նախագծային լուծում՝ սարքերի դասավորությամբ, հաշվարկներով, ռեզերվներով և շահագործման տրամաբանությամբ։",
      image: img + "full_design_integrated.jpg",
      gallery: [img + "full_design_integrated.jpg", img + "technical_drawing.jpg", img + "systems_design.jpg", img + "bms_office.jpg"],
      tags: ["Նախագիծ", "Հաշվարկ", "Ամբողջական համակարգ"]
    },
    {
      id: "audio-systems",
      title: "Աուդիո համակարգերի տեղադրում",
      lead: "Ֆոնային երաժշտության, հանրային հասարակության (PA), կոնֆերանսային և ձայնային ծանուցման համակարգերի նախագծում, տեղադրում և կարգաբերում։",
      image: img + "audio_systems.jpg",
      gallery: [img + "audio_systems.jpg", img + "building_management_automation.jpg", img + "installation_works.jpg", img + "interfaces_ui.jpg"],
      tags: ["PA համակարգ", "Ֆոնային երաժշտություն", "Կոնֆերանսային աուդիո"]
    },
    {
      id: "powder-coating",
      title: "Փոշեներկում",
      lead: "Մետաղական դետալների պաշտպանիչ և էսթետիկ փոշեներկում՝ հավասար ծածկույթով և արտադրական որակի ֆինիշով։",
      image: img + "powder_coating.jpg",
      gallery: [
        img + "powder_coating.jpg",
        img + "powder_coating_prep.jpg",
        img + "powder_coating_oven.jpg",
        img + "powder_coating_quality.jpg"
      ],
      tags: ["Մետաղ", "Ծածկույթ", "Արտադրական որակ"]
    }
  ];
})(window.SmartTech);
