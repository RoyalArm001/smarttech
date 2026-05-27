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
        automation: ["BMS controller", "KNX module", "sensor", "relay module", "lighting automation", "HVAC integration", "dashboard", "scenario programming"]
      },
      en: {
        "video-surveillance": ["IP camera", "PTZ camera", "NVR/DVR", "HDD storage", "PoE switch", "monitor", "remote viewing", "motion alerts"],
        alarm: ["central panel", "motion sensor", "door/window sensor", "smoke detector", "siren", "keypad", "GSM/Wi-Fi module", "mobile alerts"],
        "access-control": ["card reader", "biometric reader", "magnetic lock", "exit button", "door closer", "controller", "turnstile", "employee cards"],
        intercom: ["entrance panel", "apartment monitor", "IP intercom", "door release module", "code access", "mobile app", "multi-apartment system"],
        "audio-systems": ["ceiling speaker", "wall speaker", "amplifier", "mixer", "microphone", "zone controller", "voice notification", "conference audio"],
        network: ["switch", "router", "firewall", "Wi-Fi access point", "rack cabinet", "patch panel", "UTP/Fiber cabling", "UPS"],
        electrical: ["cable route", "distribution panel", "circuit breaker", "lighting line", "socket line", "grounding", "UPS power", "measurements"],
        automation: ["BMS controller", "KNX module", "sensor", "relay module", "lighting automation", "HVAC integration", "dashboard", "scenario programming"]
      },
      ru: {
        "video-surveillance": ["IP-камера", "PTZ-камера", "NVR/DVR", "HDD архив", "PoE switch", "монитор", "удаленный просмотр", "уведомления движения"],
        alarm: ["центральная панель", "датчик движения", "датчик двери/окна", "датчик дыма", "сирена", "keypad", "GSM/Wi-Fi module", "мобильные уведомления"],
        "access-control": ["card reader", "biometric reader", "магнитный замок", "кнопка выхода", "door closer", "controller", "turnstile", "карты сотрудников"],
        intercom: ["входная panel", "квартирный monitor", "IP intercom", "модуль открытия двери", "кодовый доступ", "мобильное приложение", "многоквартирная система"],
        "audio-systems": ["потолочный динамик", "настенный динамик", "amplifier", "mixer", "microphone", "zone controller", "голосовое оповещение", "conference audio"],
        network: ["switch", "router", "firewall", "Wi-Fi access point", "rack cabinet", "patch panel", "UTP/Fiber cabling", "UPS"],
        electrical: ["кабельная трасса", "распределительный щит", "автомат", "линия освещения", "линия розеток", "заземление", "UPS питание", "замеры"],
        automation: ["BMS controller", "KNX module", "sensor", "relay module", "lighting automation", "HVAC integration", "dashboard", "scenario programming"]
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
        readyTitle: "Հայտը պատրաստվում է ավտոմատ",
        readyText: "Տեսանելի տեքստային բլոկ չկա․ ընտրությունները կգնան նամակի մեջ ուղարկելու պահին։",
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
          { id: "automation", title: "BMS / ավտոմատացում", unit: "հանգույց", text: "Շենքի կառավարման եւ smart logic լուծումներ" }
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
        readyTitle: "Request will be built automatically",
        readyText: "The long text preview is hidden. Your selections will be added to the email on send.",
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
          { id: "automation", title: "BMS / automation", unit: "node", text: "Building management and smart logic" }
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
        readyTitle: "Заявка будет собрана автоматически",
        readyText: "Длинный текстовый блок скрыт. Выборы попадут в письмо при отправке.",
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
          { id: "automation", title: "BMS / автоматизация", unit: "узел", text: "Управление зданием и smart logic" }
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
        subject: "Заявка на систему Smart Tech",
        empty: "Не заполнено",
        noSystems: "Системы пока не выбраны",
        noMaintenance: "Сервисные работы пока не выбраны"
      }
    };

    var language = site.i18n.language;
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
        automation: locale.services.automation.title
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
    var heroImage = site.content.company.assetBase + "/images/services/building_management_automation.jpg";

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
      fr: { open: "Ouvrir la liste", confirm: "Confirmer", none: "Rien sélectionné", selected: "sélectionné" },
      ka: { open: "სიის გახსნა", confirm: "დადასტურება", none: "არაფერია არჩეული", selected: "არჩეულია" }
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
      }
    };
    var wizard = labels[site.i18n.language] || labels.hy;
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
                    '<label class="request-field">' +
                      '<span>' + e(copy.name) + '</span>' +
                      '<input name="clientName" autocomplete="name" placeholder="' + e(copy.placeholderName) + '">' +
                    '</label>' +
                    '<label class="request-field">' +
                      '<span>' + e(copy.phone) + '</span>' +
                      '<input name="clientPhone" autocomplete="tel">' +
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
                '<fieldset class="request-fieldset" data-scope-show="sale service">' +
                  '<legend>' + e(copy.systems) + '</legend>' +
                  '<div class="request-system-grid">' + systems + '</div>' +
                '</fieldset>' +
                '<fieldset class="request-fieldset" data-scope-show="service">' +
                  '<legend>' + e(copy.maintenance) + '</legend>' +
                  selectionMenu(copy.maintenance, copy.optionHint, maintenance, "request-maintenance-menu", "") +
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
                      '<label class="request-field">' +
                        '<span>' + e(copy.visitDate) + '</span>' +
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
              '<div class="request-submit-state" id="request-submit-state" aria-live="polite">' +
                '<span class="request-submit-icon" aria-hidden="true"></span>' +
                '<h3 id="request-submit-title">' + e(copy.readyTitle) + '</h3>' +
                '<p id="request-submit-text">' + e(copy.readyText) + '</p>' +
              '</div>' +
              '<textarea id="request-summary" class="request-summary request-summary-hidden notranslate" rows="1" readonly translate="no" aria-label="' + e(copy.summaryTitle) + '"></textarea>' +
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
