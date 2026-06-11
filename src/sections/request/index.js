(function (site) {
  function brandCatalog() {
    return {
      "video-surveillance": [
        "Hikvision AcuSense / ColorVu",
        "Dahua WizSense / TiOC",
        "Uniview EasyStar",
        "Axis Communications",
        "Hanwha Wisenet",
        "Bosch Security",
        "Tiandy",
        "Milesight"
      ],
      alarm: [
        "Ajax Hub / Fibra",
        "DSC PowerSeries",
        "Paradox EVO / MG",
        "Satel Integra",
        "Bosch Solution",
        "Honeywell Galaxy",
        "Texecom Premier",
        "Bentel Security"
      ],
      "access-control": [
        "Hikvision MinMoe",
        "ZKTeco",
        "Suprema BioStation",
        "HID Signo",
        "Rosslare",
        "Dahua Access",
        "Anviz",
        "PERCo"
      ],
      intercom: [
        "Akuvox",
        "BAS-IP",
        "2N IP Intercom",
        "Aiphone",
        "Commax",
        "Hikvision IP Intercom",
        "Dahua VTO/VTH",
        "Grandstream GDS"
      ],
      "audio-systems": [
        "Bosch Plena / Praesensa",
        "TOA",
        "JBL Control",
        "Yamaha",
        "Bose Professional",
        "RCF",
        "Electro-Voice",
        "Shure",
        "Sennheiser",
        "Biamp / Apart"
      ],
      network: [
        "UniFi Switch / UDM",
        "Grandstream GWN / GWN7800",
        "MikroTik CRS / CCR",
        "Aruba Instant On",
        "Cisco Catalyst / Meraki",
        "TP-Link Omada",
        "Ruijie Reyee",
        "D-Link",
        "Netgear",
        "Cambium Networks"
      ],
      electrical: [
        "Schneider Electric Acti9",
        "ABB System pro M",
        "Legrand",
        "Eaton",
        "Hager",
        "Siemens",
        "Chint",
        "Gewiss",
        "Phoenix Contact"
      ],
      automation: [
        "KNX",
        "Siemens Desigo",
        "Schneider EcoStruxure",
        "Honeywell BMS",
        "Johnson Controls",
        "ABB i-bus",
        "HDL Automation",
        "Control4",
        "Crestron",
        "Zennio"
      ],
      "powder-coating": [
        "RAL / NCS colors",
        "Epoxy primer",
        "Polyester powder",
        "Epoxy-polyester powder",
        "Zinc primer",
        "Anti-corrosion coating"
      ]
    };
  }

  function systemOptionCatalog(language) {
    var dictionaries = {
      hy: {
        "video-surveillance": ["IP տեսախցիկ", "PTZ տեսախցիկ", "NVR/DVR", "HDD պահեստավորում", "PoE switch", "մոնիթոր", "հեռահար դիտում", "շարժման ծանուցումներ"],
        alarm: ["կենտրոնական panel", "շարժման սենսոր", "դռան/պատուհանի սենսոր", "ծխի սենսոր", "սիրենա", "keypad", "GSM/Wi-Fi module", "մոբայլ ծանուցումներ"],
        "access-control": ["card reader", "biometric reader", "magnetic lock", "exit button", "door closer", "controller", "turnstile", "աշխատակիցների քարտեր"],
        intercom: ["մուտքի panel", "բնակարանային monitor", "IP intercom", "դռան բացման module", "կոդային մուտք", "մոբայլ հավելված", "բազմաբնակարան համակարգ"],
        "audio-systems": ["առաստաղային բարձրախոս", "պատի բարձրախոս", "amplifier", "mixer", "microphone", "zone controller", "ձայնային ծանուցում", "conference audio"],
        network: ["switch", "router", "firewall", "Wi-Fi access point", "rack cabinet", "patch panel", "UTP/Fiber cabling", "UPS"],
        electrical: ["մալուխային ուղի", "բաշխիչ վահան", "ավտոմատ անջատիչ", "լուսավորության գիծ", "վարդակների գիծ", "հողանցում", "UPS սնուցում", "չափումներ"],
        automation: ["BMS controller", "KNX module", "sensor", "relay module", "lighting automation", "HVAC integration", "dashboard", "scenario programming"],
        "engineering-monitoring": ["SMS ահազանգում", "email/Telegram ծանուցում", "NVR մոնիթորինգ", "սերվերային վերահսկում", "UPS/ցանցի կարգավիճակ", "dashboard", "իրադարձությունների մատյան", "պլանային սպասարձում"],
        "powder-coating": ["մաքրում", "փայլում", "փոշի կիրառում", "ջեռոցում", "Որակի ստուգում", "փաթեթավորում", "RAL գունային ընտրություն", "պաշտպանիչ ծածկ"]
      },
      en: {
        "video-surveillance": ["IP camera", "PTZ camera", "NVR/DVR", "HDD storage", "PoE switch", "monitor", "remote viewing", "motion alerts"],
        alarm: ["central panel", "motion sensor", "door/window sensor", "smoke detector", "siren", "keypad", "GSM/Wi-Fi module", "mobile alerts"],
        "access-control": ["card reader", "biometric reader", "magnetic lock", "exit button", "door closer", "controller", "turnstile", "employee cards"],
        intercom: ["entrance panel", "apartment monitor", "IP intercom", "door release module", "code access", "mobile app", "multi-apartment system"],
        "audio-systems": ["ceiling speaker", "wall speaker", "amplifier", "mixer", "microphone", "zone controller", "voice notification", "conference audio"],
        network: ["switch", "router", "firewall", "Wi-Fi access point", "rack cabinet", "patch panel", "UTP/Fiber cabling", "UPS"],
        electrical: ["cable route", "distribution panel", "circuit breaker", "lighting line", "socket line", "grounding", "UPS power", "measurements"],
        automation: ["BMS controller", "KNX module", "sensor", "relay module", "lighting automation", "HVAC integration", "dashboard", "scenario programming"],
        "engineering-monitoring": ["SMS alerts", "email/Telegram notifications", "NVR monitoring", "server supervision", "UPS/network status", "dashboard", "event log", "scheduled maintenance"],
        "powder-coating": ["cleaning", "sandblasting", "powder application", "curing", "quality check", "packaging", "RAL color selection", "protective coating"]
      },
      ru: {
        "video-surveillance": ["IP-камера", "PTZ-камера", "NVR/DVR", "HDD архив", "PoE switch", "монитор", "удаленный просмотр", "уведомления движения"],
        alarm: ["центральная панель", "датчик движения", "датчик двери/окна", "датчик дыма", "сирена", "keypad", "GSM/Wi-Fi module", "мобильные уведомления"],
        "access-control": ["card reader", "biometric reader", "магнитный замок", "кнопка выхода", "door closer", "controller", "turnstile", "карты сотрудников"],
        intercom: ["входная panel", "квартирный monitor", "IP intercom", "модуль открытия двери", "кодовый доступ", "мобильное приложение", "многоквартирная система"],
        "audio-systems": ["потолочный динамик", "настенный динамик", "amplifier", "mixer", "microphone", "zone controller", "голосовое оповещение", "conference audio"],
        network: ["switch", "router", "firewall", "Wi-Fi access point", "rack cabinet", "patch panel", "UTP/Fiber cabling", "UPS"],
        electrical: ["кабельная трасса", "распределительный щит", "автомат", "линия освещения", "линия розеток", "заземление", "UPS питание", "замеры"],
        automation: ["BMS controller", "KNX module", "sensor", "relay module", "lighting automation", "HVAC integration", "dashboard", "scenario programming"],
        "engineering-monitoring": ["SMS-оповещения", "email/Telegram уведомления", "мониторинг NVR", "контроль серверов", "статус UPS/сети", "dashboard", "журнал событий", "плановое обслуживание"],
        "powder-coating": ["очистка", "пескоструй", "нанесение порошка", "полимеризация", "контроль качества", "упаковка", "цвет RAL", "защитное покрытие"]
      },
      be: {
        "video-surveillance": ["IP-камера", "PTZ-камера", "NVR/DVR", "HDD-архіў", "PoE switch", "манітор", "аддалены прагляд", "апавяшчэнні пра рух"],
        alarm: ["цэнтральная панэль", "датчык руху", "датчык дзвярэй/акна", "датчык дыму", "сірэна", "keypad", "GSM/Wi-Fi module", "мабільныя апавяшчэнні"],
        "access-control": ["card reader", "biometric reader", "магнітны замок", "кнопка выхаду", "даводчык дзвярэй", "controller", "turnstile", "карткі супрацоўнікаў"],
        intercom: ["уваходная панэль", "кватэрны манітор", "IP intercom", "модуль адкрыцця дзвярэй", "кодaвы доступ", "мабільная праграма", "шматкватэрная сістэма"],
        "audio-systems": ["поталачны дынамік", "насценны дынамік", "amplifier", "mixer", "microphone", "zone controller", "галасавое апавяшчэнне", "канферэнц-аўдыя"],
        network: ["switch", "router", "firewall", "Wi-Fi access point", "rack cabinet", "patch panel", "UTP/Fiber cabling", "UPS"],
        electrical: ["кабельная траса", "размеркавальны шчыт", "аўтамат", "лінія асвятлення", "лінія разетак", "зазямленне", "UPS-сілкаванне", "замеры"],
        automation: ["BMS controller", "KNX module", "sensor", "relay module", "lighting automation", "HVAC integration", "dashboard", "scenario programming"]
      },
      fr: {
        "video-surveillance": ["caméra IP", "caméra PTZ", "NVR/DVR", "stockage HDD", "switch PoE", "moniteur", "vue à distance", "alertes de mouvement"],
        alarm: ["panneau central", "détecteur de mouvement", "détecteur porte/fenêtre", "détecteur de fumée", "sirène", "clavier", "module GSM/Wi-Fi", "alertes mobiles"],
        "access-control": ["lecteur de carte", "lecteur biométrique", "serrure magnétique", "bouton de sortie", "ferme-porte", "contrôleur", "tourniquet", "badges employés"],
        intercom: ["platine d'entrée", "moniteur appartement", "interphone IP", "module d'ouverture", "accès par code", "application mobile", "système collectif"],
        "audio-systems": ["haut-parleur plafond", "haut-parleur mural", "amplificateur", "mélangeur", "microphone", "contrôleur de zones", "notification vocale", "audio conférence"],
        network: ["switch", "routeur", "pare-feu", "point d'accès Wi-Fi", "baie rack", "patch panel", "câblage UTP/Fibre", "UPS"],
        electrical: ["chemin de câble", "tableau de distribution", "disjoncteur", "ligne d'éclairage", "ligne de prises", "mise à la terre", "alimentation UPS", "mesures"],
        automation: ["contrôleur BMS", "module KNX", "capteur", "module relais", "automatisation éclairage", "intégration HVAC", "tableau de bord", "programmation de scénarios"]
      }
    };
    return dictionaries[language] || dictionaries.en || dictionaries.hy;
  }

  function specialistCatalog(language) {
    var dictionaries = {
      hy: [
        { value: "Project Manager", title: "Project Manager", text: "նախնական քննարկում եւ աշխատանքների պլանավորում" },
        { value: "IT Network Engineer", title: "IT Network Engineer", text: "ցանցեր, Wi-Fi, switch/rack լուծումներ" },
        { value: "Video and Access Control Engineer", title: "Տեսահսկում / մուտքի վերահսկում", text: "CCTV, դռներ, դոմոֆոն, access control" },
        { value: "Alarm System Engineer", title: "Alarm System Engineer", text: "alarm, հրդեհային եւ անվտանգության գոտիներ" },
        { value: "Electrical Installation Engineer", title: "Էլեկտրամոնտաժային ինժեներ", text: "էլեկտրական գծեր, վահաններ, լուսավորություն" },
        { value: "BMS Design Specialist", title: "BMS նախագծման մասնագետ", text: "ավտոմատացում եւ շենքի կառավարման logic" },
        { value: "Audio Systems Specialist", title: "Աուդիո համակարգերի մասնագետ", text: "ձայնային ծանուցում, public address, ֆոնային երաժշտություն" }
      ],
      en: [
        { value: "Project Manager", title: "Project Manager", text: "initial discussion and delivery planning" },
        { value: "IT Network Engineer", title: "IT Network Engineer", text: "networks, Wi-Fi, switch/rack solutions" },
        { value: "Video and Access Control Engineer", title: "Video / Access Control", text: "CCTV, doors, intercom, access control" },
        { value: "Alarm System Engineer", title: "Alarm System Engineer", text: "alarm, fire safety and security zones" },
        { value: "Electrical Installation Engineer", title: "Electrical Installation Engineer", text: "electrical lines, panels and lighting" },
        { value: "BMS Design Specialist", title: "BMS Design Specialist", text: "automation and building management logic" },
        { value: "Audio Systems Specialist", title: "Audio Systems Specialist", text: "voice alerts, public address and background music" }
      ],
      ru: [
        { value: "Project Manager", title: "Project Manager", text: "первичное обсуждение и планирование работ" },
        { value: "IT Network Engineer", title: "IT Network Engineer", text: "сети, Wi-Fi, switch/rack решения" },
        { value: "Video and Access Control Engineer", title: "Видео / контроль доступа", text: "CCTV, двери, домофон, access control" },
        { value: "Alarm System Engineer", title: "Alarm System Engineer", text: "alarm, пожарная безопасность и зоны охраны" },
        { value: "Electrical Installation Engineer", title: "Инженер электромонтажа", text: "электролинии, щиты и освещение" },
        { value: "BMS Design Specialist", title: "BMS Design Specialist", text: "автоматизация и логика управления зданием" },
        { value: "Audio Systems Specialist", title: "Специалист по аудиосистемам", text: "голосовые оповещения, public address и фоновая музыка" }
      ],
      be: [
        { value: "Project Manager", title: "Project Manager", text: "першаснае абмеркаванне і планаванне работ" },
        { value: "IT Network Engineer", title: "IT Network Engineer", text: "сеткі, Wi-Fi, switch/rack-рашэнні" },
        { value: "Video and Access Control Engineer", title: "Відэа / кантроль доступу", text: "CCTV, дзверы, дамафон, access control" },
        { value: "Alarm System Engineer", title: "Alarm System Engineer", text: "alarm, пажарная бяспека і ахоўныя зоны" },
        { value: "Electrical Installation Engineer", title: "Інжынер электрамантажу", text: "электралініі, шчыты і асвятленне" },
        { value: "BMS Design Specialist", title: "BMS Design Specialist", text: "аўтаматызацыя і логіка кіравання будынкам" },
        { value: "Audio Systems Specialist", title: "Спецыяліст па аўдыясістэмах", text: "галасавыя апавяшчэнні, public address і фонавая музыка" }
      ],
      fr: [
        { value: "Project Manager", title: "Chef de projet", text: "premier échange et planification des travaux" },
        { value: "IT Network Engineer", title: "Ingénieur réseau IT", text: "réseaux, Wi-Fi, solutions switch/rack" },
        { value: "Video and Access Control Engineer", title: "Vidéo / contrôle d'accès", text: "CCTV, portes, interphone, contrôle d'accès" },
        { value: "Alarm System Engineer", title: "Ingénieur systèmes d'alarme", text: "alarme, sécurité incendie et zones de protection" },
        { value: "Electrical Installation Engineer", title: "Ingénieur installation électrique", text: "lignes électriques, tableaux et éclairage" },
        { value: "BMS Design Specialist", title: "Spécialiste conception BMS", text: "automatisation et logique de gestion du bâtiment" },
        { value: "Audio Systems Specialist", title: "Spécialiste systèmes audio", text: "notification vocale, public address et musique d'ambiance" }
      ]
    };
    return dictionaries[language] || dictionaries.en || dictionaries.hy;
  }

  function languageCopy() {
    var dictionaries = {
      hy: {
        heroEyebrow: "Վաճառք եւ սպասարկում",
        heroTitle: "Հավաքեք ձեր համակարգի հայտը",
        heroText: "Ընտրեք անհրաժեշտ համակարգերը, քանակները եւ սպասարկման տեսակը։ Վերջում նամակը կբացվի արդեն պատրաստ տեքստով։",
        introEyebrow: "Հայտի կոնստրուկտոր",
        introTitle: "Ընտրեք լուծումը, մենք կհաշվարկենք մնացածը",
        introText: "Այս էջը օգնում է արագ հավաքել տեխնիկական նախնական առաջադրանք՝ վաճառքի, տեղադրման կամ սպասարկման համար։",
        requestType: "Հայտի տեսակ",
        requestTypes: [
          { value: "Վաճառք եւ նոր համակարգ", label: "Վաճառք", note: "Նոր համակարգի ընտրություն եւ տեղադրում" },
          { value: "Սպասարկում", label: "Սպասարկում", note: "Գործող համակարգի ստուգում կամ վերանորոգում" },
          { value: "Խորհրդատվություն եւ աուդիտ", label: "Աուդիտ", note: "Տարածքի ուսումնասիրություն եւ առաջարկ" }
        ],
        contact: "Կոնտակտային տվյալներ",
        object: "Օբյեկտի տվյալներ",
        systems: "Համակարգեր",
        visit: "Այցելություն եւ չափագրում",
        visitText: "Եթե հաճախորդը դեռ չի կողմնորոշվում, կարող է խնդրել մասնագետի այց՝ չափագրման եւ տեխնիկական առաջարկի համար։",
        visitNeeded: "Պետք է մասնագետի այցելություն",
        visitNeededNote: "Թիմը կկապվի ժամն ու մասնագետներին համաձայնեցնելու համար",
        visitDate: "Ցանկալի օր",
        visitTime: "Ցանկալի ժամ",
        visitAccess: "Այցի / չափագրման նշումներ",
        visitAccessPlaceholder: "Օրինակ՝ մուտքը պահակակետից է, պետք է նախապես զանգել, կա պատրաստ նախագիծ կամ պլան",
        specialistsTitle: "Որ մասնագետներն են պետք",
        specialistsHint: "Ընտրեք կոնկրետ մասնագետներին կամ թողեք դատարկ՝ թիմը կորոշի",
        maintenance: "Սպասարկման աշխատանքներ",
        summaryTitle: "Ուղարկման կենտրոն",
        summaryText: "Հավաքեք տվյալները, հետո սեղմեք ուղարկել։ Նամակի վերնագիրը եւ տեքստը կկազմվեն ավտոմատ։",
        optionLabel: "Ինչ է պետք համակարգի մեջ",
        optionHint: "Ընտրեք սարքերն ու աշխատանքները",
        brandLabel: "Նախընտրելի ֆիրմաներ / մոդելներ",
        brandHint: "Ընտրեք մեկը կամ մի քանիսը",
        readyTitle: "Լրացրեք պարտադիր դաշտերը",
        readyText: "Անուն, հեռախոս և ընտրված համակարգերը պետք է նշված լինեն, ապա կտեսնեք ամբողջական ամփոփումը։",
        sendingTitle: "Պատրաստվում է նամակը",
        sendingText: "Mail ծրագիրը կբացվի արդեն հավաքված վերնագրով եւ տեքստով։",
        name: "Անուն / ընկերություն",
        phone: "Հեռախոս",
        email: "Email",
        objectType: "Օբյեկտի տեսակ",
        area: "Մակերես կամ սենյակների քանակ",
        address: "Հասցե",
        deadline: "Ցանկալի ժամկետ",
        notes: "Լրացուցիչ նշումներ",
        objectOptions: ["Բնակելի համալիր", "Առանձնատուն", "Գրասենյակ", "Խանութ / սրահ", "Պահեստ / արտադրամաս", "Այլ"],
        deadlineOptions: ["Շտապ", "Մինչեւ 1 շաբաթ", "Մինչեւ 1 ամիս", "Պլանային"],
        systemsList: [
          { id: "video-surveillance", title: "Տեսահսկում", unit: "կետ/սարք", text: "Տեսախցիկներ, NVR/DVR, հեռահար դիտում" },
          { id: "alarm", title: "Alarm անվտանգություն", unit: "գոտի", text: "Սենսորներ, ազդանշան, ծանուցումներ" },
          { id: "access-control", title: "Մուտքի վերահսկում", unit: "դուռ", text: "Քարտեր, կոդեր, դռների կառավարում" },
          { id: "intercom", title: "Դոմոֆոն", unit: "բնակարան/կետ", text: "Ավտոմատ դոմոֆոններ եւ բացման համակարգեր" },
          { id: "audio-systems", title: "Աուդիո համակարգեր", unit: "գոտի/բարձրախոս", text: "Ֆոնային երաժշտություն, public address, ձայնային ծանուցում" },
          { id: "network", title: "Ցանցեր եւ Wi-Fi", unit: "կետ", text: "LAN, rack, Wi-Fi ծածկույթ" },
          { id: "electrical", title: "Էլեկտրամոնտաժ", unit: "կետ", text: "Վահաններ, մալուխներ, լուսավորություն" },
          { id: "automation", title: "BMS / ավտոմատացում", unit: "հանգույց", text: "Շենքի կառավարման եւ smart logic լուծումներ" },
          { id: "engineering-monitoring", title: "24/7 մոնիթորինգ", unit: "հանգույց", text: "SMS/email ահազանգում, սերվեր/NVR, dashboard եւ ավարուժ սպասարձում" },
          { id: "powder-coating", title: "Փոշեներկում", unit: "մ²", text: "Մետաղական դետալների պաշտպանիչ և էսթետիկ փոշեներկում" }
        ],
        maintenanceList: [
          "Պլանային սպասարկում",
          "Շտապ վերանորոգում",
          "Ծրագրավորում / կարգաբերում",
          "Տեխնիկական աուդիտ եւ փաստաթղթավորում"
        ],
        openMail: "Բացել mail-ը",
        sendProject: "Ուղարկել որպես նոր նախագիծ",
        download: "Ներբեռնել TXT",
        reset: "Մաքրել",
        placeholderName: "Օրինակ՝ Արմեն / ABC LLC",
        placeholderArea: "Օրինակ՝ 120 մ² կամ 8 սենյակ",
        placeholderAddress: "Քաղաք, փողոց, շենք",
        placeholderNotes: "Նկարագրեք տարածքը, գործող համակարգը կամ հատուկ պահանջները",
        statusMail: "Mail ծրագիրը բացվեց պատրաստ նամակով։ Եթե չի բացվել, ներբեռնեք TXT ֆայլը եւ ուղարկեք email-ով։",
        statusDownload: "TXT ֆայլը պատրաստ է։",
        previewTitle: "Հայտի ամփոփում",
        previewHint: "Ստուգեք տվյալները նախքան ուղարկելը։",
        checklistTitle: "Պարտադիր լրացում",
        requiredMark: "*",
        subject: "Smart Tech համակարգի հայտ",
        empty: "Չի լրացվել",
        noSystems: "Համակարգեր դեռ ընտրված չեն",
        noMaintenance: "Սպասարկման աշխատանքներ դեռ ընտրված չեն"
      },
      en: {
        heroEyebrow: "Sales and service",
        heroTitle: "Build your system request",
        heroText: "Choose the systems, quantities and service type. The email will open with a prepared message.",
        introEyebrow: "Request builder",
        introTitle: "Select the solution, we will calculate the rest",
        introText: "This page helps create a first technical brief for sales, installation or maintenance.",
        requestType: "Request type",
        requestTypes: [
          { value: "Sales and new system", label: "Sales", note: "New system selection and installation" },
          { value: "Service", label: "Service", note: "Inspection or repair of an existing system" },
          { value: "Consultation and audit", label: "Audit", note: "Site survey and proposal" }
        ],
        contact: "Contact details",
        object: "Facility details",
        systems: "Systems",
        visit: "Visit and measurement",
        visitText: "If the client is not sure what to choose, they can request a specialist visit for measurement and a technical proposal.",
        visitNeeded: "Specialist visit is needed",
        visitNeededNote: "The team will confirm the time and specialists",
        visitDate: "Preferred date",
        visitTime: "Preferred time",
        visitAccess: "Visit / measurement notes",
        visitAccessPlaceholder: "Example: entrance is through security, call first, there is a drawing or project file",
        specialistsTitle: "Needed specialists",
        specialistsHint: "Choose specific specialists or leave empty and the team will decide",
        maintenance: "Service tasks",
        summaryTitle: "Sending center",
        summaryText: "Build the request, then send it. The email subject and body will be created automatically.",
        optionLabel: "What is needed in the system",
        optionHint: "Choose devices and tasks",
        brandLabel: "Preferred brands / models",
        brandHint: "Choose one or more",
        readyTitle: "Fill in the required fields",
        readyText: "Name, phone and selected systems must be completed before the full preview appears.",
        sendingTitle: "Preparing the email",
        sendingText: "The mail app will open with the prepared subject and message.",
        name: "Name / company",
        phone: "Phone",
        email: "Email",
        objectType: "Facility type",
        area: "Area or room count",
        address: "Address",
        deadline: "Preferred deadline",
        notes: "Additional notes",
        objectOptions: ["Residential complex", "Private house", "Office", "Store / showroom", "Warehouse / production", "Other"],
        deadlineOptions: ["Urgent", "Within 1 week", "Within 1 month", "Planned"],
        systemsList: [
          { id: "video-surveillance", title: "Video surveillance", unit: "point/device", text: "Cameras, NVR/DVR, remote viewing" },
          { id: "alarm", title: "Alarm security", unit: "zone", text: "Sensors, siren, notifications" },
          { id: "access-control", title: "Access control", unit: "door", text: "Cards, codes, door control" },
          { id: "intercom", title: "Intercom", unit: "apartment/point", text: "Automatic intercoms and opening systems" },
          { id: "audio-systems", title: "Audio systems", unit: "zone/speaker", text: "Background music, public address and voice alerts" },
          { id: "network", title: "Networks and Wi-Fi", unit: "point", text: "LAN, rack, Wi-Fi coverage" },
          { id: "electrical", title: "Electrical work", unit: "point", text: "Panels, cabling, lighting" },
          { id: "automation", title: "BMS / automation", unit: "node", text: "Building management and smart logic" },
          { id: "engineering-monitoring", title: "24/7 monitoring", unit: "node", text: "SMS/email alerts, server/NVR, dashboard and engineering support" },
          { id: "powder-coating", title: "Powder coating", unit: "m²", text: "Protective and aesthetic powder coating for metal parts" }
        ],
        maintenanceList: [
          "Scheduled maintenance",
          "Urgent repair",
          "Programming / configuration",
          "Technical audit and documentation"
        ],
        openMail: "Open mail",
        sendProject: "Send as new project",
        download: "Download TXT",
        reset: "Reset",
        placeholderName: "Example: Armen / ABC LLC",
        placeholderArea: "Example: 120 m² or 8 rooms",
        placeholderAddress: "City, street, building",
        placeholderNotes: "Describe the facility, existing system or special requirements",
        statusMail: "The mail app opened with a prepared message. If it did not open, download the TXT file and send it by email.",
        statusDownload: "TXT file is ready.",
        previewTitle: "Request preview",
        previewHint: "Review the details before sending.",
        checklistTitle: "Required items",
        requiredMark: "*",
        subject: "Smart Tech system request",
        empty: "Not filled",
        noSystems: "No systems selected yet",
        noMaintenance: "No service tasks selected yet"
      },
      ru: {
        heroEyebrow: "Продажа и сервис",
        heroTitle: "Соберите заявку на систему",
        heroText: "Выберите системы, количество и тип обслуживания. Почта откроется с готовым текстом.",
        introEyebrow: "Конструктор заявки",
        introTitle: "Выберите решение, остальное мы рассчитаем",
        introText: "Эта страница помогает быстро собрать первичное техническое задание для продажи, монтажа или сервиса.",
        requestType: "Тип заявки",
        requestTypes: [
          { value: "Продажа и новая система", label: "Продажа", note: "Подбор и монтаж новой системы" },
          { value: "Сервис", label: "Сервис", note: "Проверка или ремонт действующей системы" },
          { value: "Консультация и аудит", label: "Аудит", note: "Осмотр объекта и предложение" }
        ],
        contact: "Контактные данные",
        object: "Данные объекта",
        systems: "Системы",
        visit: "Визит и замер",
        visitText: "Если клиент не уверен, что выбрать, он может запросить визит специалиста для замера и технического предложения.",
        visitNeeded: "Нужен визит специалиста",
        visitNeededNote: "Команда согласует время и специалистов",
        visitDate: "Желаемая дата",
        visitTime: "Желаемое время",
        visitAccess: "Примечания для визита / замера",
        visitAccessPlaceholder: "Например: вход через охрану, заранее позвонить, есть план или проект",
        specialistsTitle: "Нужные специалисты",
        specialistsHint: "Выберите специалистов или оставьте пустым, команда определит сама",
        maintenance: "Сервисные работы",
        summaryTitle: "Центр отправки",
        summaryText: "Соберите заявку и отправьте. Тема и текст письма сформируются автоматически.",
        optionLabel: "Что нужно в системе",
        optionHint: "Выберите устройства и работы",
        brandLabel: "Предпочтительные фирмы / модели",
        brandHint: "Выберите один или несколько",
        readyTitle: "Заполните обязательные поля",
        readyText: "Имя, телефон и выбранные системы должны быть указаны, затем появится полный просмотр.",
        sendingTitle: "Готовим письмо",
        sendingText: "Почта откроется с подготовленной темой и текстом.",
        name: "Имя / компания",
        phone: "Телефон",
        email: "Email",
        objectType: "Тип объекта",
        area: "Площадь или количество комнат",
        address: "Адрес",
        deadline: "Желаемый срок",
        notes: "Дополнительные примечания",
        objectOptions: ["Жилой комплекс", "Частный дом", "Офис", "Магазин / салон", "Склад / производство", "Другое"],
        deadlineOptions: ["Срочно", "До 1 недели", "До 1 месяца", "Планово"],
        systemsList: [
          { id: "video-surveillance", title: "Видеонаблюдение", unit: "точка/устройство", text: "Камеры, NVR/DVR, удаленный просмотр" },
          { id: "alarm", title: "Alarm безопасность", unit: "зона", text: "Датчики, сирена, уведомления" },
          { id: "access-control", title: "Контроль доступа", unit: "дверь", text: "Карты, коды, управление дверями" },
          { id: "intercom", title: "Домофон", unit: "квартира/точка", text: "Автоматические домофоны и системы открытия" },
          { id: "audio-systems", title: "Аудиосистемы", unit: "зона/динамик", text: "Фоновая музыка, public address и голосовые оповещения" },
          { id: "network", title: "Сети и Wi-Fi", unit: "точка", text: "LAN, rack, Wi-Fi покрытие" },
          { id: "electrical", title: "Электромонтаж", unit: "точка", text: "Щиты, кабели, освещение" },
          { id: "automation", title: "BMS / автоматизация", unit: "узел", text: "Управление зданием и smart logic" },
          { id: "engineering-monitoring", title: "24/7 мониторинг", unit: "узел", text: "SMS/email-оповещения, сервер/NVR, dashboard и инженерная поддержка" },
          { id: "powder-coating", title: "Порошковая окраска", unit: "м²", text: "Защитная и эстетичная порошковая окраска металла" }
        ],
        maintenanceList: [
          "Плановое обслуживание",
          "Срочный ремонт",
          "Программирование / настройка",
          "Технический аудит и документация"
        ],
        openMail: "Открыть почту",
        sendProject: "Отправить как новый проект",
        download: "Скачать TXT",
        reset: "Очистить",
        placeholderName: "Например: Армен / ABC LLC",
        placeholderArea: "Например: 120 м² или 8 комнат",
        placeholderAddress: "Город, улица, здание",
        placeholderNotes: "Опишите объект, действующую систему или особые требования",
        statusMail: "Почта открылась с готовым письмом. Если не открылась, скачайте TXT файл и отправьте его по email.",
        statusDownload: "TXT файл готов.",
        previewTitle: "Просмотр заявки",
        previewHint: "Проверьте данные перед отправкой.",
        checklistTitle: "Обязательные поля",
        requiredMark: "*",
        subject: "Заявка на систему Smart Tech",
        empty: "Не заполнено",
        noSystems: "Системы пока не выбраны",
        noMaintenance: "Сервисные работы пока не выбраны"
      }
    };

    var generatedCopies = {
      be: {
        heroEyebrow: "Продаж і сэрвіс",
        heroTitle: "Складзіце заяўку на сістэму",
        heroText: "Выберыце сістэмы, колькасць і тып абслугоўвання. Пошта адкрыецца з ужо падрыхтаваным паведамленнем.",
        introEyebrow: "Канструктар заяўкі",
        introTitle: "Выберыце рашэнне, астатняе мы разлічым",
        introText: "Гэтая старонка дапамагае хутка сабраць першаснае тэхнічнае заданне для продажу, мантажу або сэрвісу.",
        requestType: "Тып заяўкі",
        requestTypes: [
          { value: "Продаж і новая сістэма", label: "Продаж", note: "Падбор і мантаж новай сістэмы" },
          { value: "Сэрвіс", label: "Сэрвіс", note: "Праверка або рамонт існуючай сістэмы" },
          { value: "Кансультацыя і аўдыт", label: "Аўдыт", note: "Агляд аб'екта і тэхнічная прапанова" }
        ],
        contact: "Кантактныя даныя",
        object: "Даныя аб'екта",
        systems: "Сістэмы",
        visit: "Візіт і замер",
        visitText: "Калі кліент яшчэ не ўпэўнены ў выбары, можна запытаць візіт спецыяліста для замеру і тэхнічнай прапановы.",
        visitNeeded: "Патрэбны візіт спецыяліста",
        visitNeededNote: "Каманда ўзгодніць час і спецыялістаў",
        visitDate: "Пажаданая дата",
        visitTime: "Пажаданы час",
        visitAccess: "Нататкі для візіту / замеру",
        visitAccessPlaceholder: "Напрыклад: уваход праз ахову, трэба папярэдне патэлефанаваць, ёсць план або праект",
        specialistsTitle: "Якія спецыялісты патрэбны",
        specialistsHint: "Выберыце канкрэтных спецыялістаў або пакіньце пустым, і каманда вызначыць сама",
        maintenance: "Сэрвісныя работы",
        summaryTitle: "Цэнтр адпраўкі",
        summaryText: "Складзіце заяўку і адпраўце яе. Тэма і тэкст ліста сфарміруюцца аўтаматычна.",
        optionLabel: "Што патрэбна ў сістэме",
        optionHint: "Выберыце абсталяванне і работы",
        brandLabel: "Пажаданыя брэнды / мадэлі",
        brandHint: "Выберыце адзін або некалькі",
        readyTitle: "Заяўка будзе сабрана аўтаматычна",
        readyText: "Падрабязны тэкставы прагляд схаваны. Ваш выбар будзе дададзены ў ліст пры адпраўцы.",
        sendingTitle: "Рыхтуем ліст",
        sendingText: "Паштовае прыкладанне адкрыецца з падрыхтаванай тэмай і паведамленнем.",
        name: "Імя / кампанія",
        phone: "Тэлефон",
        email: "Email",
        objectType: "Тып аб'екта",
        area: "Плошча або колькасць пакояў",
        address: "Адрас",
        deadline: "Пажаданы тэрмін",
        notes: "Дадатковыя нататкі",
        objectOptions: ["Жылы комплекс", "Прыватны дом", "Офіс", "Крама / салон", "Склад / вытворчасць", "Іншае"],
        deadlineOptions: ["Тэрмінова", "Да 1 тыдня", "Да 1 месяца", "Планава"],
        systemsList: [
          { id: "video-surveillance", title: "Відэаназіранне", unit: "кропка/прылада", text: "Камеры, NVR/DVR, аддалены прагляд" },
          { id: "alarm", title: "Alarm-бяспека", unit: "зона", text: "Датчыкі, сірэна, апавяшчэнні" },
          { id: "access-control", title: "Кантроль доступу", unit: "дзверы", text: "Карткі, коды, кіраванне дзвярыма" },
          { id: "intercom", title: "Дамафон", unit: "кватэра/кропка", text: "Аўтаматычныя дамафоны і сістэмы адкрыцця" },
          { id: "audio-systems", title: "Аўдыясістэмы", unit: "зона/дынамік", text: "Фонавая музыка, public address і галасавыя апавяшчэнні" },
          { id: "network", title: "Сеткі і Wi-Fi", unit: "кропка", text: "LAN, rack, Wi-Fi-пакрыццё" },
          { id: "electrical", title: "Электрамантаж", unit: "кропка", text: "Шчыты, кабелі, асвятленне" },
          { id: "automation", title: "BMS / аўтаматызацыя", unit: "вузел", text: "Кіраванне будынкам і smart logic" }
        ],
        maintenanceList: [
          "Планавае абслугоўванне",
          "Тэрміновы рамонт",
          "Праграмаванне / наладка",
          "Тэхнічны аўдыт і дакументацыя"
        ],
        openMail: "Адкрыць пошту",
        sendProject: "Адправіць як новы праект",
        download: "Спампаваць TXT",
        reset: "Ачысціць",
        placeholderName: "Напрыклад: Армен / ABC LLC",
        placeholderArea: "Напрыклад: 120 м² або 8 пакояў",
        placeholderAddress: "Горад, вуліца, будынак",
        placeholderNotes: "Апiшыце аб'ект, існуючую сістэму або асаблівыя патрабаванні",
        statusMail: "Пошта адкрылася з гатовым лістом. Калі не адкрылася, спампуйце TXT-файл і адпраўце яго па email.",
        statusDownload: "TXT-файл гатовы.",
        subject: "Заяўка на сістэму Smart Tech",
        empty: "Не запоўнена",
        noSystems: "Сістэмы пакуль не выбраны",
        noMaintenance: "Сэрвісныя работы пакуль не выбраны"
      },
      fr: {
        heroEyebrow: "Vente et service",
        heroTitle: "Composez votre demande système",
        heroText: "Choisissez les systèmes, les quantités et le type de service. L'e-mail s'ouvrira avec un message préparé.",
        introEyebrow: "Constructeur de demande",
        introTitle: "Sélectionnez la solution, nous calculons le reste",
        introText: "Cette page aide à créer rapidement un premier cahier des charges pour la vente, l'installation ou la maintenance.",
        requestType: "Type de demande",
        requestTypes: [
          { value: "Vente et nouveau système", label: "Vente", note: "Choix et installation d'un nouveau système" },
          { value: "Service", label: "Service", note: "Inspection ou réparation d'un système existant" },
          { value: "Conseil et audit", label: "Audit", note: "Visite du site et proposition technique" }
        ],
        contact: "Coordonnées",
        object: "Détails du site",
        systems: "Systèmes",
        visit: "Visite et mesure",
        visitText: "Si le client n'est pas sûr du choix, il peut demander la visite d'un spécialiste pour mesurer et préparer une proposition.",
        visitNeeded: "Visite d'un spécialiste nécessaire",
        visitNeededNote: "L'équipe confirmera l'heure et les spécialistes",
        visitDate: "Date souhaitée",
        visitTime: "Heure souhaitée",
        visitAccess: "Notes de visite / mesure",
        visitAccessPlaceholder: "Exemple : entrée par la sécurité, appeler avant, plan ou projet disponible",
        specialistsTitle: "Spécialistes nécessaires",
        specialistsHint: "Choisissez des spécialistes ou laissez vide, l'équipe décidera",
        maintenance: "Tâches de service",
        summaryTitle: "Centre d'envoi",
        summaryText: "Composez la demande puis envoyez-la. Le sujet et le texte de l'e-mail seront créés automatiquement.",
        optionLabel: "Ce qui est nécessaire dans le système",
        optionHint: "Choisissez les équipements et les travaux",
        brandLabel: "Marques / modèles préférés",
        brandHint: "Choisissez une ou plusieurs options",
        readyTitle: "La demande sera préparée automatiquement",
        readyText: "L'aperçu long est masqué. Vos sélections seront ajoutées à l'e-mail au moment de l'envoi.",
        sendingTitle: "Préparation de l'e-mail",
        sendingText: "L'application e-mail s'ouvrira avec le sujet et le message préparés.",
        name: "Nom / entreprise",
        phone: "Téléphone",
        email: "Email",
        objectType: "Type de site",
        area: "Surface ou nombre de pièces",
        address: "Adresse",
        deadline: "Délai souhaité",
        notes: "Notes supplémentaires",
        objectOptions: ["Complexe résidentiel", "Maison privée", "Bureau", "Magasin / showroom", "Entrepôt / production", "Autre"],
        deadlineOptions: ["Urgent", "Sous 1 semaine", "Sous 1 mois", "Planifié"],
        systemsList: [
          { id: "video-surveillance", title: "Vidéosurveillance", unit: "point/appareil", text: "Caméras, NVR/DVR, vue à distance" },
          { id: "alarm", title: "Sécurité alarm", unit: "zone", text: "Capteurs, sirène, notifications" },
          { id: "access-control", title: "Contrôle d'accès", unit: "porte", text: "Badges, codes, gestion des portes" },
          { id: "intercom", title: "Interphone", unit: "appartement/point", text: "Interphones automatiques et systèmes d'ouverture" },
          { id: "audio-systems", title: "Systèmes audio", unit: "zone/haut-parleur", text: "Musique d'ambiance, public address et notifications vocales" },
          { id: "network", title: "Réseaux et Wi-Fi", unit: "point", text: "LAN, rack, couverture Wi-Fi" },
          { id: "electrical", title: "Installation électrique", unit: "point", text: "Tableaux, câbles, éclairage" },
          { id: "automation", title: "BMS / automatisation", unit: "noeud", text: "Gestion de bâtiment et smart logic" }
        ],
        maintenanceList: [
          "Maintenance planifiée",
          "Réparation urgente",
          "Programmation / configuration",
          "Audit technique et documentation"
        ],
        openMail: "Ouvrir l'e-mail",
        sendProject: "Envoyer comme nouveau projet",
        download: "Télécharger TXT",
        reset: "Réinitialiser",
        placeholderName: "Exemple : Armen / ABC LLC",
        placeholderArea: "Exemple : 120 m² ou 8 pièces",
        placeholderAddress: "Ville, rue, bâtiment",
        placeholderNotes: "Décrivez le site, le système existant ou les exigences particulières",
        statusMail: "L'application e-mail s'est ouverte avec un message prêt. Sinon, téléchargez le TXT et envoyez-le par e-mail.",
        statusDownload: "Le fichier TXT est prêt.",
        subject: "Demande de système Smart Tech",
        empty: "Non renseigné",
        noSystems: "Aucun système sélectionné",
        noMaintenance: "Aucune tâche de service sélectionnée"
      }
    };

    var language = site.i18n.language;
    if (!dictionaries[language] && generatedCopies[language]) {
      return Object.assign({}, dictionaries.en, generatedCopies[language]);
    }

    if (!dictionaries[language] && site.content.locales && site.content.locales[language]) {
      var locale = site.content.locales[language];
      var copy = Object.assign({}, dictionaries.en);
      var serviceNames = {
        "video-surveillance": locale.services["video-surveillance"].title,
        alarm: locale.services["fire-security"].title,
        "access-control": locale.services.automation.tags[1],
        intercom: "Intercom",
        "audio-systems": locale.services["audio-systems"].title,
        network: locale.services.networks.title,
        electrical: locale.services.electrical.title,
        automation: locale.services.automation.title,
        "engineering-monitoring": locale.services["engineering-monitoring"] ? locale.services["engineering-monitoring"].title : "24/7 monitoring"
      };

      copy.heroEyebrow = locale.common.proposal;
      copy.heroTitle = locale.nav.request + " Smart Tech";
      copy.introEyebrow = locale.nav.request;
      copy.introTitle = locale.servicesPage.title;
      copy.contact = locale.contact.title;
      copy.object = locale.detail.projectType;
      copy.systems = locale.nav.services;
      copy.summaryTitle = locale.common.quickContact;
      copy.name = locale.contact.labels.name;
      copy.phone = locale.contact.labels.phone;
      copy.address = locale.contact.labels.address;
      copy.notes = locale.contact.labels.message;
      copy.openMail = locale.contact.labels.send;
      copy.sendProject = locale.common.proposal;
      copy.subject = locale.nav.request + " Smart Tech";
      copy.systemsList = copy.systemsList.map(function (item) {
        return Object.assign({}, item, { title: serviceNames[item.id] || item.title });
      });
      return copy;
    }

    return dictionaries[language] || dictionaries.en || dictionaries.hy;
  }

  site.sections.request = function request() {
    var e = site.utils.escapeHtml;
    var copy = languageCopy();
    var heroImage = "/img/services/building_management_automation.jpg";

    var requestKinds = ["sale", "service", "audit"];
    var typeCards = copy.requestTypes.map(function (type, index) {
      var kind = requestKinds[index] || "sale";
      return '' +
        '<label class="request-choice" data-request-type-card="' + e(kind) + '">' +
          '<input type="radio" name="requestType" value="' + e(type.value) + '" data-request-kind="' + e(kind) + '"' + (index === 0 ? " checked" : "") + '>' +
          '<span>' +
            '<strong>' + e(type.label) + '</strong>' +
            '<small>' + e(type.note) + '</small>' +
          '</span>' +
        '</label>';
    }).join("");

    var objectOptions = copy.objectOptions.map(function (option) {
      return '<option value="' + e(option) + '">' + e(option) + '</option>';
    }).join("");

    var deadlineOptions = copy.deadlineOptions.map(function (option) {
      return '<option value="' + e(option) + '">' + e(option) + '</option>';
    }).join("");

    var menuText = {
      hy: { open: "Բացել ցանկը", confirm: "Հաստատել", none: "Ոչինչ ընտրված չէ", selected: "ընտրված" },
      en: { open: "Open list", confirm: "Confirm", none: "Nothing selected", selected: "selected" },
      ru: { open: "Открыть список", confirm: "Подтвердить", none: "Ничего не выбрано", selected: "выбрано" },
      be: { open: "Адкрыць спіс", confirm: "Пацвердзіць", none: "Нічога не выбрана", selected: "выбрана" },
      fr: { open: "Ouvrir la liste", confirm: "Confirmer", none: "Rien sélectionné", selected: "sélectionné" }
    };
    var menuCopy = menuText[site.i18n.language] || menuText.en;

    function selectionMenu(title, hint, items, modifier, attrs) {
      return '' +
        '<div class="request-select-menu ' + e(modifier || "") + '" data-request-menu ' + (attrs || "") + '>' +
          '<button class="request-select-toggle" type="button" data-request-menu-toggle aria-expanded="false">' +
            '<span>' +
              '<strong>' + e(title) + '</strong>' +
              '<small>' + e(hint || menuCopy.open) + '</small>' +
            '</span>' +
            '<em data-request-menu-count>' + e(menuCopy.none) + '</em>' +
          '</button>' +
          '<div class="request-select-panel" data-request-menu-panel hidden>' +
            '<div class="request-select-list">' + items + '</div>' +
            '<div class="request-select-actions">' +
              '<button class="button button-primary request-select-confirm" type="button" data-request-menu-confirm>' + e(menuCopy.confirm) + '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    var catalog = brandCatalog();
    var optionCatalog = systemOptionCatalog(site.i18n.language);
    var systems = copy.systemsList.map(function (item, index) {
      var defaultQty = index < 2 ? "4" : "1";
      var brandItems = catalog[item.id] || [];
      var optionItems = optionCatalog[item.id] || [];
      var optionChips = optionItems.map(function (option) {
        return '' +
          '<label class="request-brand-chip request-option-chip notranslate" translate="no">' +
            '<input type="checkbox" value="' + e(option) + '" data-request-option data-system-id="' + e(item.id) + '" disabled>' +
            '<span>' + e(option) + '</span>' +
          '</label>';
      }).join("");
      var brandChips = brandItems.map(function (brand) {
        return '' +
          '<label class="request-brand-chip notranslate" translate="no">' +
            '<input type="checkbox" value="' + e(brand) + '" data-request-brand data-system-id="' + e(item.id) + '" disabled>' +
            '<span>' + e(brand) + '</span>' +
          '</label>';
      }).join("");
      return '' +
        '<article class="request-system-card">' +
          '<label>' +
            '<input type="checkbox" value="' + e(item.id) + '" data-request-system data-title="' + e(item.title) + '" data-unit="' + e(item.unit) + '">' +
            '<span class="request-system-main">' +
              '<strong>' + e(item.title) + '</strong>' +
              '<small>' + e(item.text) + '</small>' +
            '</span>' +
          '</label>' +
          '<label class="request-qty">' +
            '<span>' + e(item.unit) + '</span>' +
            '<input type="number" min="1" max="999" value="' + e(defaultQty) + '" data-request-qty="' + e(item.id) + '" disabled>' +
          '</label>' +
          '<div class="request-brand-block request-option-block" data-request-option-panel="' + e(item.id) + '">' +
            selectionMenu(copy.optionLabel, copy.optionHint, optionChips, "request-option-menu", 'data-system-menu="' + e(item.id) + '"') +
          '</div>' +
          '<div class="request-brand-block" data-request-brand-panel="' + e(item.id) + '">' +
            selectionMenu(copy.brandLabel, copy.brandHint, brandChips, "request-brand-menu", 'data-system-menu="' + e(item.id) + '"') +
          '</div>' +
        '</article>';
    }).join("");

    var maintenance = copy.maintenanceList.map(function (item) {
      return '' +
        '<label class="request-check">' +
          '<input type="checkbox" value="' + e(item) + '" data-request-maintenance data-title="' + e(item) + '">' +
          '<span>' + e(item) + '</span>' +
        '</label>';
    }).join("");

    var specialists = specialistCatalog(site.i18n.language).map(function (item) {
      return '' +
        '<label class="request-specialist-chip">' +
          '<input type="checkbox" value="' + e(item.value) + '" data-request-specialist data-title="' + e(item.title) + '">' +
          '<span>' +
            '<strong>' + e(item.title) + '</strong>' +
            '<small>' + e(item.text) + '</small>' +
          '</span>' +
        '</label>';
    }).join("");

    var labels = {
      hy: {
        stepType: "Տեսակ",
        stepContact: "Տվյալներ",
        stepScope: "Ընտրություն",
        stepSend: "Ուղարկում",
        back: "Հետ",
        next: "Առաջ",
        saleTitle: "Վաճառք եւ նոր համակարգ",
        saleText: "Ընտրեք անհրաժեշտ համակարգերը, քանակները, սարքերը եւ նախընտրելի մոդելները։",
        serviceTitle: "Սպասարկում",
        serviceText: "Ընտրեք սպասարկման աշխատանքները եւ նշեք, թե որ համակարգին է վերաբերում խնդիրը։",
        auditTitle: "Աուդիտ եւ չափագրում",
        auditText: "Նշեք այցի ցանկալի օրը, մասնագետներին եւ օբյեկտի տվյալները։"
      },
      en: {
        stepType: "Type",
        stepContact: "Details",
        stepScope: "Selection",
        stepSend: "Send",
        back: "Back",
        next: "Next",
        saleTitle: "Sale and new system",
        saleText: "Choose systems, quantities, devices and preferred brands.",
        serviceTitle: "Maintenance",
        serviceText: "Choose service tasks and the system that needs attention.",
        auditTitle: "Audit and measurement",
        auditText: "Choose visit time, specialists and facility details."
      },
      ru: {
        stepType: "Тип",
        stepContact: "Данные",
        stepScope: "Выбор",
        stepSend: "Отправка",
        back: "Назад",
        next: "Далее",
        saleTitle: "Продажа и новая система",
        saleText: "Выберите системы, количество, устройства и предпочтительные бренды.",
        serviceTitle: "Сервис",
        serviceText: "Выберите сервисные работы и систему, к которой относится задача.",
        auditTitle: "Аудит и замер",
        auditText: "Укажите время визита, специалистов и данные объекта."
      },
      be: {
        stepType: "Тып",
        stepContact: "Даныя",
        stepScope: "Выбар",
        stepSend: "Адпраўка",
        back: "Назад",
        next: "Далей",
        saleTitle: "Продаж і новая сістэма",
        saleText: "Выберыце сістэмы, колькасць, прылады і пажаданыя брэнды.",
        serviceTitle: "Сэрвіс",
        serviceText: "Выберыце сэрвісныя работы і сістэму, да якой адносіцца задача.",
        auditTitle: "Аўдыт і замер",
        auditText: "Укажыце час візіту, спецыялістаў і даныя аб'екта."
      },
      fr: {
        stepType: "Type",
        stepContact: "Détails",
        stepScope: "Choix",
        stepSend: "Envoi",
        back: "Retour",
        next: "Suivant",
        saleTitle: "Vente et nouveau système",
        saleText: "Choisissez les systèmes, quantités, équipements et marques préférées.",
        serviceTitle: "Service",
        serviceText: "Choisissez les tâches de service et le système concerné.",
        auditTitle: "Audit et mesure",
        auditText: "Indiquez l'heure de visite, les spécialistes et les détails du site."
      }
    };
    var wizard = labels[site.i18n.language] || labels.en || labels.hy;
    var stepItems = [
      wizard.stepType,
      wizard.stepScope,
      wizard.stepContact,
      wizard.stepSend
    ].map(function (label, index) {
      return '' +
        '<button class="request-stepper-item' + (index === 0 ? " is-active" : "") + '" type="button" data-request-go="' + e(index) + '">' +
          '<span>' + e("0" + (index + 1)) + '</span>' +
          '<strong>' + e(label) + '</strong>' +
        '</button>';
    }).join("");

    return '' +
      site.sections.pageHero({
        eyebrow: copy.heroEyebrow,
        title: copy.heroTitle,
        text: copy.heroText,
        image: heroImage,
        tone: "request"
      }) +
      '<section id="request-builder" class="section request-section">' +
        '<div class="container">' +
          '<div class="section-head request-head reveal">' +
            '<div>' +
              '<span class="eyebrow">' + e(copy.introEyebrow) + '</span>' +
              '<h2 class="section-title">' + e(copy.introTitle) + '</h2>' +
            '</div>' +
            '<p class="section-copy">' + e(copy.introText) + '</p>' +
          '</div>' +
          '<form class="request-layout" id="request-builder-form">' +
            '<div class="request-panel request-panel-main reveal">' +
              '<nav class="request-stepper" aria-label="Request steps">' + stepItems + '</nav>' +
              '<section class="request-step is-active" data-request-step="0">' +
                '<fieldset class="request-fieldset">' +
                  '<legend>' + e(copy.requestType) + '</legend>' +
                  '<div class="request-choice-row">' + typeCards + '</div>' +
                '</fieldset>' +
                '<div class="request-step-actions">' +
                  '<button class="button button-primary" type="button" data-request-next>' + e(wizard.next) + '</button>' +
                '</div>' +
              '</section>' +
              '<section class="request-step" data-request-step="2">' +
                '<div class="request-grid">' +
                  '<fieldset class="request-fieldset">' +
                    '<legend>' + e(copy.contact) + '</legend>' +
                    '<label class="request-field" data-request-field="clientName">' +
                      '<span>' + e(copy.name) + ' <em class="request-required">' + e(copy.requiredMark) + '</em></span>' +
                      '<input name="clientName" autocomplete="name" required placeholder="' + e(copy.placeholderName) + '">' +
                    '</label>' +
                    '<label class="request-field" data-request-field="clientPhone">' +
                      '<span>' + e(copy.phone) + ' <em class="request-required">' + e(copy.requiredMark) + '</em></span>' +
                      '<input name="clientPhone" type="tel" inputmode="tel" autocomplete="tel" required>' +
                    '</label>' +
                    '<label class="request-field">' +
                      '<span>' + e(copy.email) + '</span>' +
                      '<input name="clientEmail" type="email" autocomplete="email">' +
                    '</label>' +
                  '</fieldset>' +
                  '<fieldset class="request-fieldset">' +
                    '<legend>' + e(copy.object) + '</legend>' +
                    '<label class="request-field">' +
                      '<span>' + e(copy.objectType) + '</span>' +
                      '<select name="objectType">' + objectOptions + '</select>' +
                    '</label>' +
                    '<label class="request-field">' +
                      '<span>' + e(copy.area) + '</span>' +
                      '<input name="objectArea" placeholder="' + e(copy.placeholderArea) + '">' +
                    '</label>' +
                    '<label class="request-field">' +
                      '<span>' + e(copy.address) + '</span>' +
                      '<input name="objectAddress" placeholder="' + e(copy.placeholderAddress) + '">' +
                    '</label>' +
                    '<label class="request-field">' +
                      '<span>' + e(copy.deadline) + '</span>' +
                      '<select name="deadline">' + deadlineOptions + '</select>' +
                    '</label>' +
                  '</fieldset>' +
                '</div>' +
                '<div class="request-step-actions">' +
                  '<button class="button" type="button" data-request-prev>' + e(wizard.back) + '</button>' +
                  '<button class="button button-primary" type="button" data-request-next>' + e(wizard.next) + '</button>' +
                '</div>' +
              '</section>' +
              '<section class="request-step" data-request-step="1">' +
                '<div class="request-scope-intro is-active" data-request-scope-panel="sale">' +
                  '<h3>' + e(wizard.saleTitle) + '</h3>' +
                  '<p>' + e(wizard.saleText) + '</p>' +
                '</div>' +
                '<div class="request-scope-intro" data-request-scope-panel="service">' +
                  '<h3>' + e(wizard.serviceTitle) + '</h3>' +
                  '<p>' + e(wizard.serviceText) + '</p>' +
                '</div>' +
                '<div class="request-scope-intro" data-request-scope-panel="audit">' +
                  '<h3>' + e(wizard.auditTitle) + '</h3>' +
                  '<p>' + e(wizard.auditText) + '</p>' +
                '</div>' +
                '<fieldset class="request-fieldset" data-scope-show="sale service" data-request-fieldset="systems">' +
                  '<legend>' + e(copy.systems) + ' <em class="request-required">' + e(copy.requiredMark) + '</em></legend>' +
                  '<p class="request-field-hint" data-request-systems-hint hidden></p>' +
                  '<div class="request-system-grid" id="request-system-grid">' + systems + '</div>' +
                '</fieldset>' +
                '<fieldset class="request-fieldset" data-scope-show="service" data-request-fieldset="maintenance">' +
                  '<legend>' + e(copy.maintenance) + ' <em class="request-required">' + e(copy.requiredMark) + '</em></legend>' +
                  '<p class="request-field-hint" data-request-maintenance-hint hidden></p>' +
                  selectionMenu(copy.maintenance, copy.optionHint, maintenance, "request-maintenance-menu", 'data-request-field="maintenance"') +
                '</fieldset>' +
                '<fieldset class="request-fieldset request-visit-fieldset" data-scope-show="audit">' +
                  '<legend>' + e(copy.visit) + '</legend>' +
                  '<div class="request-visit-panel">' +
                    '<label class="request-visit-toggle">' +
                      '<input type="checkbox" name="visitNeeded" value="yes" data-request-visit>' +
                      '<span>' +
                        '<strong>' + e(copy.visitNeeded) + '</strong>' +
                        '<small>' + e(copy.visitNeededNote) + '</small>' +
                      '</span>' +
                    '</label>' +
                    '<p>' + e(copy.visitText) + '</p>' +
                    '<div class="request-grid request-visit-grid">' +
                      '<label class="request-field" data-request-field="visitDate">' +
                        '<span>' + e(copy.visitDate) + ' <em class="request-required">' + e(copy.requiredMark) + '</em></span>' +
                        '<input name="visitDate" type="date">' +
                      '</label>' +
                      '<label class="request-field">' +
                        '<span>' + e(copy.visitTime) + '</span>' +
                        '<input name="visitTime" type="time">' +
                      '</label>' +
                    '</div>' +
                    '<label class="request-field request-field-full">' +
                      '<span>' + e(copy.visitAccess) + '</span>' +
                      '<textarea name="visitAccess" rows="3" placeholder="' + e(copy.visitAccessPlaceholder) + '"></textarea>' +
                    '</label>' +
                    selectionMenu(copy.specialistsTitle, copy.specialistsHint, specialists, "request-specialist-menu", "") +
                  '</div>' +
                '</fieldset>' +
                '<div class="request-step-actions">' +
                  '<button class="button" type="button" data-request-prev>' + e(wizard.back) + '</button>' +
                  '<button class="button button-primary" type="button" data-request-next>' + e(wizard.next) + '</button>' +
                '</div>' +
              '</section>' +
              '<section class="request-step" data-request-step="3">' +
                '<label class="request-field request-field-full">' +
                  '<span>' + e(copy.notes) + '</span>' +
                  '<textarea name="notes" rows="5" placeholder="' + e(copy.placeholderNotes) + '"></textarea>' +
                '</label>' +
                '<div class="request-step-actions">' +
                  '<button class="button" type="button" data-request-prev>' + e(wizard.back) + '</button>' +
                '</div>' +
              '</section>' +
            '</div>' +
            '<aside class="request-panel request-summary-card reveal">' +
              '<span class="eyebrow">' + e(copy.summaryTitle) + '</span>' +
              '<p>' + e(copy.summaryText) + '</p>' +
              '<div class="request-checklist-wrap">' +
                '<h3 class="request-checklist-title">' + e(copy.checklistTitle) + '</h3>' +
                '<ul class="request-checklist" id="request-checklist" aria-live="polite"></ul>' +
              '</div>' +
              '<div class="request-preview-block">' +
                '<h3 class="request-preview-title">' + e(copy.previewTitle) + '</h3>' +
                '<p class="request-preview-hint">' + e(copy.previewHint) + '</p>' +
                '<textarea id="request-summary" class="request-summary notranslate" rows="12" readonly translate="no" aria-label="' + e(copy.previewTitle) + '"></textarea>' +
              '</div>' +
              '<div class="request-submit-state is-compact" id="request-submit-state" aria-live="polite">' +
                '<p id="request-submit-text">' + e(copy.readyText) + '</p>' +
              '</div>' +
              '<div class="request-actions">' +
                '<button class="button button-primary" type="submit">' + e(copy.openMail) + '</button>' +
                '<button class="button request-project-submit" type="button" id="request-project-submit">' + e(copy.sendProject) + '</button>' +
                '<button class="button" type="button" id="request-download">' + e(copy.download) + '</button>' +
                '<button class="button request-reset" type="reset">' + e(copy.reset) + '</button>' +
              '</div>' +
              '<p class="request-status" id="request-status" aria-live="polite"></p>' +
            '</aside>' +
          '</form>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
