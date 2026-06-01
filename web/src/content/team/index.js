(function (site) {
  site.content.team = [
    {
      id: "director",
      accent: "DIR",
      department: "Management",
      roleLevel: "director",
      managerId: null,
      order: 1,
      image: "/src/assets/team/it-director.svg",
      coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
      color: "#0aa896",
      email: "info@smarttechllc.am",
      title: "Տնօրեն",
      text: "Կառավարում է Smart Tech-ի նախագծային ուղղությունը, թիմերի համագործակցությունը և որակի ընդհանուր վերահսկումը։",
      level: "Executive",
      experience: "15+ տարի",
      workInfo: [
        "Ընկերության ռազմավարական զարգացում և հիմնական ուղղությունների կառավարում",
        "Նախագծերի որակի, ժամկետների և հաճախորդների հետ աշխատանքի վերահսկում",
        "Տեխնիկական թիմերի, գնումների և դաշտային աշխատանքի համակարգում",
        "Գործընկերների և խոշոր պատվիրատուների հետ երկարաժամկետ հարաբերությունների ձևավորում"
      ],
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Telegram", href: "https://t.me/" }
      ],
      certificates: [
        { title: "Business Management", image: "/src/assets/team/certificates/cert-pmp.svg" },
        { title: "Quality Control Leadership", image: "/src/assets/team/certificates/cert-agile.svg" }
      ]
    },
    {
      id: "it-network-engineer",
      accent: "NET",
      department: "IT",
      roleLevel: "specialist",
      managerId: "it-project-manager",
      order: 30,
      image: "/src/assets/team/it-director.svg",
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
      color: "#345f74",
      email: "info@smarttechllc.am",
      title: "IT Network Engineer",
      text: "Նախագծում և կարգավորում է ցանցային ենթակառուցվածքը, սերվերային կապերը և անվտանգ հեռահար հասանելիությունը։",
      level: "Network Engineering",
      experience: "8+ տարի",
      workInfo: [
        "LAN/Wi-Fi ցանցերի նախագծում և սարքավորումների ընտրություն",
        "Router, switch, firewall և VPN կարգավորումներ",
        "IP տեսահսկման և մուտքի վերահսկման ցանցային ինտեգրացիա",
        "Մոնիթորինգ, troubleshooting և փաստաթղթավորում"
      ],
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "GitHub", href: "https://github.com/" },
        { label: "Telegram", href: "https://t.me/" }
      ],
      certificates: [
        { title: "Cisco Network Engineering", image: "/src/assets/team/certificates/cert-cloud.svg" },
        { title: "Network Security Basics", image: "/src/assets/team/certificates/cert-cyber.svg" }
      ]
    },
    {
      id: "it-project-manager",
      accent: "PM",
      department: "IT",
      roleLevel: "manager",
      managerId: "director",
      order: 10,
      image: "/src/assets/team/project-manager.svg",
      coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
      color: "#38aab8",
      email: "info@smarttechllc.am",
      title: "IT Project Manager",
      text: "Կազմակերպում է IT և անվտանգության նախագծերի փուլերը, ժամկետները, ռիսկերը և հաճախորդի հետ հաղորդակցությունը։",
      level: "Project Delivery",
      experience: "7+ տարի",
      workInfo: [
        "Նախագծերի scope, timeline և ռեսուրսների պլանավորում",
        "Ինժեներական թիմերի, գնումների և պատվիրատուի կապի համակարգում",
        "Տեխնիկական փաստաթղթերի և փոփոխությունների վերահսկում",
        "Հանձնումից առաջ quality gate-երի կազմակերպում"
      ],
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Telegram", href: "https://t.me/" }
      ],
      certificates: [
        { title: "Project Management", image: "/src/assets/team/certificates/cert-pmp.svg" },
        { title: "Agile Delivery", image: "/src/assets/team/certificates/cert-agile.svg" }
      ]
    },
    {
      id: "alarm-system-engineer",
      accent: "ALM",
      department: "Security",
      roleLevel: "manager",
      managerId: "director",
      order: 11,
      image: "/src/assets/team/alarm-system-manager.svg",
      coverImage: "https://images.unsplash.com/photo-1581092921461-7d65ca45b2c8?auto=format&fit=crop&w=1400&q=80",
      color: "#d8a63a",
      email: "info@smarttechllc.am",
      title: "Alarm System Engineer",
      text: "Նախագծում, տեղադրում և կարգավորում է ազդարարող, հրդեհային և տարհանման անվտանգության համակարգերը։",
      level: "Safety Engineering",
      experience: "8+ տարի",
      workInfo: [
        "Հրդեհային և ազդարարող պանելների ճարտարապետություն",
        "Սենսորների, գոտիների և ազդանշանային երթուղիների նախագծում",
        "Տեղադրում, կարգաբերում, թեստավորում և հանձնում",
        "Սպասարկման և շահագործման փաստաթղթերի պատրաստում"
      ],
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Telegram", href: "https://t.me/" }
      ],
      certificates: [
        { title: "Fire Safety Systems", image: "/src/assets/team/certificates/cert-cyber.svg" }
      ]
    },
    {
      id: "automation-specialist",
      accent: "AUT",
      department: "Automation",
      roleLevel: "lead",
      managerId: "director",
      order: 13,
      image: "/src/assets/team/electricity-manager.svg",
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
      color: "#9a7a30",
      email: "info@smarttechllc.am",
      title: "Էլեկտրական սարքերի ավտոմատացման մասնագետ",
      text: "Կառուցում է էլեկտրական սարքերի կառավարման, ավտոմատացման և սցենարային աշխատանքի լուծումներ։",
      level: "Automation Specialist",
      experience: "6+ տարի",
      workInfo: [
        "Կառավարման վահանակների և ավտոմատացման սխեմաների հավաքում",
        "Սենսորների, relay-ների և controller-ների ինտեգրացիա",
        "Սարքերի աշխատանքի սցենարների կարգավորում",
        "Սպասարկման և fault diagnostics-ի տրամաբանություն"
      ],
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" }
      ],
      certificates: [
        { title: "Automation Systems", image: "/src/assets/team/certificates/cert-cloud.svg" }
      ]
    },
    {
      id: "bms-design-specialist",
      accent: "BMS",
      department: "BMS",
      roleLevel: "lead",
      managerId: "director",
      order: 14,
      image: "/src/assets/team/project-manager.svg",
      coverImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
      color: "#4e7890",
      email: "info@smarttechllc.am",
      title: "BMS Սիստեմի նախագծման մասնագետ",
      text: "Նախագծում է շենքերի կառավարման BMS լուծումները՝ կապելով անվտանգությունը, ինժեներիան և ավտոմատացումը մեկ տրամաբանության մեջ։",
      level: "BMS Design",
      experience: "7+ տարի",
      workInfo: [
        "BMS ճարտարապետության նախագծում և սարքավորումների ընտրություն",
        "HVAC, լուսավորություն, մուտք և անվտանգություն համակարգերի ինտեգրացիա",
        "Կառավարման սցենարների և մոնիթորինգի քարտեզների ձևավորում",
        "Նախագծային փաստաթղթերի և հանձնելու փաթեթի պատրաստում"
      ],
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" }
      ],
      certificates: [
        { title: "Building Management Systems", image: "/src/assets/team/certificates/cert-cloud.svg" },
        { title: "Systems Design", image: "/src/assets/team/certificates/cert-agile.svg" }
      ]
    },
    /*
    {
      id: "procurement-head",
      accent: "BUY",
      department: "Operations",
      roleLevel: "manager",
      managerId: "director",
      order: 13,
      image: "/src/assets/team/project-manager.svg",
      coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
      color: "#087b70",
      email: "info@smarttechllc.am",
      title: "Գնումների բաժնի ղեկավար",
      text: "Կառավարում է սարքավորումների գնումները, մատակարարների ընտրությունը և նախագծերի նյութական ապահովումը։",
      level: "Procurement Lead",
      experience: "9+ տարի",
      workInfo: [
        "Սարքավորումների և նյութերի գնման պլանավորում ըստ նախագծերի",
        "Մատակարարների հետ բանակցություններ և ժամկետների վերահսկում",
        "Որակի, երաշխիքների և համատեղելիության ստուգում",
        "Պահեստի և դաշտային թիմերի մատակարարման համակարգում"
      ],
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" }
      ],
      certificates: [
        { title: "Procurement Management", image: "/src/assets/team/certificates/cert-pmp.svg" }
      ]
    },
    */
    {
      id: "video-access-control-engineer",
      accent: "CCTV",
      department: "Security",
      roleLevel: "specialist",
      managerId: "alarm-system-engineer",
      order: 34,
      image: "/src/assets/team/alarm-system-manager.svg",
      coverImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1400&q=80",
      color: "#3d8f9f",
      email: "info@smarttechllc.am",
      title: "Տեսահսկման և մուտքի վերահսկման ինժեներ",
      text: "Նախագծում և կարգավորում է տեսահսկման, մուտքի վերահսկման և հեռահար դիտարկման համակարգերը՝ ապահովելով հստակ տեսադաշտ, կայուն արխիվ և անվտանգ հասանելիություն։",
      level: "Security Systems",
      experience: "7+ տարի",
      workInfo: [
        "IP տեսախցիկների, NVR/DVR սարքերի և պահեստավորման լուծումների ընտրություն",
        "Մուտքի վերահսկման կետերի, քարտային ընթերցիչների և turnstile-ների ինտեգրում",
        "Հեռահար դիտարկման, օգտատերերի իրավասությունների և ծանուցումների կարգավորում",
        "Տեսադաշտերի հաշվարկ, փորձարկում և շահագործման հանձնման փաստաթղթեր"
      ],
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Telegram", href: "https://t.me/" }
      ],
      certificates: [
        { title: "Video Surveillance Systems", image: "/src/assets/team/certificates/cert-cyber.svg" },
        { title: "Access Control Integration", image: "/src/assets/team/certificates/cert-cloud.svg" }
      ]
    },
    {
      id: "audio-systems-specialist",
      accent: "AUD",
      department: "Audio",
      roleLevel: "lead",
      managerId: "director",
      order: 15,
      image: "/src/assets/team/audio-systems-specialist.svg",
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
      color: "#38aab8",
      email: "info@smarttechllc.am",
      title: "Աուդիո համակարգերի տեղադրման մասնագետ",
      text: "Նախագծում, տեղադրում և կարգաբերում է ֆոնային երաժշտության, public address, ձայնային ծանուցման և կոնֆերանսային աուդիո համակարգերը։",
      level: "Audio Systems",
      experience: "6+ տարի",
      workInfo: [
        "Տարածքի ձայնային ծածկույթի հաշվարկ և բարձրախոսների ճիշտ տեղաբաշխում",
        "Ուժեղացուցիչների, mixer-ների, միկրոֆոնների և zone controller-ների ընտրություն",
        "Public address, ֆոնային երաժշտության և կոնֆերանսային աուդիո համակարգերի տեղադրում",
        "Կարգաբերում, ձայնի հավասարակշռում, թեստավորում և օգտագործման հանձնում"
      ],
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Telegram", href: "https://t.me/" }
      ],
      certificates: [
        { title: "Audio System Installation", image: "/src/assets/team/certificates/cert-cloud.svg" },
        { title: "Public Address Systems", image: "/src/assets/team/certificates/cert-agile.svg" }
      ]
    },
    {
      id: "electrical-installation-engineer",
      accent: "ELEC",
      department: "Electrical",
      roleLevel: "manager",
      managerId: "director",
      order: 12,
      image: "/src/assets/team/electricity-manager.svg",
      coverImage: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=80",
      color: "#b46f5f",
      email: "info@smarttechllc.am",
      title: "Էլեկտրամոնտաժային ինժեներ",
      text: "Պատասխանատու է էլեկտրական ցանցերի մոնտաժի, բաշխիչ վահանների, լուսավորության և մալուխային ուղիների որակյալ իրականացման համար։",
      level: "Electrical Engineering",
      experience: "6+ տարի",
      workInfo: [
        "Էլեկտրական գծերի, մալուխային ուղիների և բաշխիչ հանգույցների մոնտաժ",
        "Բաշխիչ վահանների հավաքում, նշագրում և պաշտպանիչ ավտոմատների դասավորում",
        "Լուսավորության, վարդակային խմբերի և տեխնիկական սնուցման գծերի ստուգում",
        "Չափումներ, fault diagnostics և օբյեկտի հանձնման տեխնիկական աջակցություն"
      ],
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" }
      ],
      certificates: [
        { title: "Electrical Installation", image: "/src/assets/team/certificates/cert-pmp.svg" },
        { title: "Low Voltage Systems", image: "/src/assets/team/certificates/cert-agile.svg" }
      ]
    }
  ];
})(window.SmartTech);
