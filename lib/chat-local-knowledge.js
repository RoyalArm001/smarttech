"use strict";

const CONTACT = {
  hy: "Հեռ․ +374 77 424 643, +374 96 424 643 · info@smarttechllc.am · support@smarttechllc.am · Երևան, Վազգեն Սարգսյան 10",
  en: "Phone +374 77 424 643, +374 96 424 643 · info@smarttechllc.am · support@smarttechllc.am · Yerevan, 10 Vazgen Sargsyan St",
  ru: "Тел. +374 77 424 643, +374 96 424 643 · info@smarttechllc.am · support@smarttechllc.am · Ереван, ул. Вазгена Саргсяна 10"
};

const entries = [
  {
    id: "greeting",
    weight: 3,
    triggers: {
      hy: ["բարև", "բարի", "ողջույն", "hello", "hi", "նորմալ", "լավ է"],
      en: ["hello", "hi", "hey", "good morning", "good evening"],
      ru: ["привет", "здравств", "добрый", "доброе"]
    },
    reply: {
      hy: "Բարև։ Ես Smart Tech AI-ն եմ՝ ձեր խելացի օգնականը։ Գրեք, թե ինչ համակարգ կամ ծառայություն է հետաքրքրում, և կօգնեմ պարզել հաջորդ քայլը։",
      en: "Hello. I am Smart Tech AI, your intelligent assistant. Tell me which system or service you need, and I will help you understand the next step.",
      ru: "Здравствуйте. Я Smart Tech AI, ваш интеллектуальный помощник. Напишите, какая система или услуга вас интересует, и я помогу понять следующий шаг."
    }
  },
  {
    id: "thanks",
    weight: 3,
    triggers: {
      hy: ["շնորհակալ", "mersi", "thanks", "thank you"],
      en: ["thanks", "thank you", "appreciate"],
      ru: ["спасибо", "благодар"]
    },
    reply: {
      hy: "Շնորհակալ եմ։ Եթե ունեք ևս հարց՝ գրեք, կօգնեմ։",
      en: "Thank you. If you have more questions, just ask.",
      ru: "Спасибо. Если будут еще вопросы, напишите."
    }
  },
  {
    id: "who",
    weight: 4,
    triggers: {
      hy: ["դու ով", "ով ես", "ինչ ես", "smart tech ai", "օգնական"],
      en: ["who are you", "what are you", "smart tech ai", "assistant"],
      ru: ["кто ты", "что ты", "помощник", "smart tech ai"]
    },
    reply: {
      hy: "Ես Smart Tech LLC-ի պաշտոնական AI օգնականն եմ՝ Smart Tech AI։ Օգնում եմ հասկանալ մեր ծառայությունները, համակարգերի ընտրությունը և նախագծման քայլերը։",
      en: "I am Smart Tech AI, the official assistant of Smart Tech LLC. I help visitors understand our services, system choices and project steps.",
      ru: "Я Smart Tech AI, официальный помощник Smart Tech LLC. Помогаю понять услуги, выбор систем и этапы проекта."
    }
  },
  {
    id: "company",
    weight: 3,
    triggers: {
      hy: ["ընկերություն", "smart tech", "սմարթ", "2012", "մասին", "ովքեր եք"],
      en: ["about company", "smart tech", "who is smart", "since 2012", "about you"],
      ru: ["компани", "smart tech", "о вас", "кто вы", "2012"]
    },
    reply: {
      hy: "Smart Tech LLC-ն 2012 թվականից նախագծում, մատակարարում, տեղադրում և սպասարկում է տեսահսկում, անվտանգություն, ցանց, էլեկտրամոնտաժ, ավտոմատացում և smart համակարգեր բիզնեսի, հյուրանոցների, բնակելի և արտադրական օբյեկտների համար։",
      en: "Since 2012, Smart Tech LLC designs, supplies, installs and maintains video surveillance, security, network, electrical, automation and smart systems for business, hotels, residential and industrial sites.",
      ru: "С 2012 года Smart Tech LLC проектирует, поставляет, монтирует и обслуживает видеонаблюдение, безопасность, сети, электромонтаж, автоматизацию и smart-системы для бизнеса, отелей, жилых и производственных объектов."
    }
  },
  {
    id: "contact",
    weight: 4,
    triggers: {
      hy: ["կապ", "հեռախոս", "համար", "էլ", "փոստ", "email", "հասցե", "գտնվելու"],
      en: ["contact", "phone", "email", "address", "call", "reach"],
      ru: ["контакт", "телефон", "почт", "email", "адрес", "связ"]
    },
    reply: {
      hy: "Կապի տվյալներ՝ " + CONTACT.hy + "։",
      en: "Contact details: " + CONTACT.en + ".",
      ru: "Контакты: " + CONTACT.ru + "."
    }
  },
  {
    id: "services",
    weight: 3,
    triggers: {
      hy: ["ծառայություն", "ինչ եք անում", "ինչ ունեք", "համակարգ"],
      en: ["services", "what do you do", "what do you offer", "solutions"],
      ru: ["услуг", "что делаете", "что предлагаете", "систем"]
    },
    reply: {
      hy: "Մենք կատարում ենք՝ տեսահսկում, հրդեհային և ահազանգային համակարգեր, մուտքի վերահսկում և դոմոֆոն, ցանցեր և IT, էլեկտրամոնտաժ, BMS/ավտոմատացում, smart home, աուդիո համակարգեր, ինժեներական նախագծում և սարքավորումների մատակարարում։",
      en: "We provide video surveillance, fire and alarm systems, access control and intercom, networks and IT, electrical works, BMS/automation, smart home, audio systems, engineering design and equipment supply.",
      ru: "Мы выполняем видеонаблюдение, пожарные и охранные системы, СКУД и домофон, сети и IT, электромонтаж, BMS/автоматизацию, smart home, аудиосистемы, проектирование и поставку оборудования."
    }
  },
  {
    id: "cctv",
    weight: 4,
    triggers: {
      hy: ["տեսահսկ", "cctv", "տեսախցիկ", "nvr", "dvr", "արխիվ", "hikvision", "dahua"],
      en: ["cctv", "camera", "surveillance", "nvr", "dvr", "archive", "hikvision"],
      ru: ["видеонаблюд", "камер", "cctv", "nvr", "dvr", "архив", "hikvision"]
    },
    reply: {
      hy: "Տեսահսկման համար կարևոր է պարզել օբյեկտի տեսակը, ներս/դուրս գոտիները, տեսախցիկների մոտավոր քանակը, արխիվի օրերը, գիշերային պատկերը և հեռախոսով դիտումը։ IP տեսախցիկներ, NVR, PoE switch և UPS-ը սովորաբար միասին են լուծվում։",
      en: "For CCTV, we need the site type, indoor/outdoor zones, approximate camera count, archive days, night image needs and mobile viewing. IP cameras, NVR, PoE switch and UPS are usually planned together.",
      ru: "Для видеонаблюдения важны тип объекта, зоны внутри/снаружи, примерное число камер, срок архива, ночная картинка и просмотр с телефона. IP-камеры, NVR, PoE switch и UPS обычно решаются вместе."
    }
  },
  {
    id: "fire",
    weight: 4,
    triggers: {
      hy: ["հրդեհ", "կապույտ", "ծխի", "ջերմային", "ազդանշան"],
      en: ["fire alarm", "smoke", "heat detector", "fire safety"],
      ru: ["пожар", "дымов", "теплов", "пожарн"]
    },
    reply: {
      hy: "Հրդեհային համակարգը ներառում է պանել, ծխի/ջերմային դետեկտորներ, ձեռքով կանչ, սիրենա և, անհրաժեշտության դեպքում, արտակարգության ձայնային տեղեկացում։ Վերջնական լուծումը կախված է օբյեկտի տեսակից, գոտիներից և նորմատիվ պահանջներից։",
      en: "A fire alarm system includes a panel, smoke/heat detectors, manual call points, sirens and, when needed, evacuation voice notification. The final design depends on site type, zones and regulatory requirements.",
      ru: "Пожарная система включает панель, дымовые/тепловые извещатели, ручные извещатели, сирены и при необходимости речевое оповещение. Итоговое решение зависит от типа объекта, зон и нормативов."
    }
  },
  {
    id: "access",
    weight: 4,
    triggers: {
      hy: ["մուտք", "սկուդ", "դոմոֆոն", "intercom", "կարդ", "կողպեք", "turnstile", "բիոմետր"],
      en: ["access control", "intercom", "doorphone", "card reader", "lock", "turnstile"],
      ru: ["скуд", "домофон", "intercom", "считыват", "замок", "турникет", "доступ"]
    },
    reply: {
      hy: "Մուտքի վերահսկումը կարող է ներառել կոնտրոլեր, քարտային/բիոմետրիկ սկաներ, էլեկտրամագնիս/էլեկտրակողպեք, դոմոֆոն, բնակարանի մոնիտոր և հեռախոսի հավելված։ Սովորաբար կապվում է տեսահսկման և ցանցային ենթակառուցվածքի հետ։",
      en: "Access control may include controllers, card/biometric readers, magnetic/electric locks, intercom, apartment monitors and a mobile app. It is usually integrated with CCTV and the network infrastructure.",
      ru: "СКУД может включать контроллеры, считыватели карт/биометрию, электромагниты/замки, домофон, мониторы квартир и мобильное приложение. Обычно интегрируется с видеонаблюдением и сетью."
    }
  },
  {
    id: "network",
    weight: 4,
    triggers: {
      hy: ["ցանց", "wifi", "wi-fi", "switch", "router", "firewall", "ինտերնետ", "սերվեր", "it"],
      en: ["network", "wifi", "switch", "router", "firewall", "internet", "server", "it"],
      ru: ["сеть", "wifi", "switch", "router", "firewall", "интернет", "сервер", "it"]
    },
    reply: {
      hy: "Ցանցային լուծումները ներառում են կաբելավորում (UTP/օպտիկա), switch/router, firewall, Wi-Fi ծածկույթ, rack, UPS և անհրաժեշտության դեպքում սերվերային կարգավորում։ Կարևոր է հասկանալ մակերեսը, օգտատերերի քանակը և արդյոք հյուրերի ցանց է պետք։",
      en: "Network solutions include cabling (UTP/fiber), switches/routers, firewalls, Wi-Fi coverage, racks, UPS and server setup when needed. Area size, user count and guest network needs matter.",
      ru: "Сетевые решения включают кабельную инфраструктуру (UTP/оптика), switch/router, firewall, Wi-Fi, стойки, UPS и при необходимости настройку серверов. Важны площадь, число пользователей и нужна ли гостевая сеть."
    }
  },
  {
    id: "electrical",
    weight: 4,
    triggers: {
      hy: ["էլեկտր", "լույս", "վահան", "ծանրաբեռն", "գետին", "розետ"],
      en: ["electrical", "lighting", "panel", "grounding", "socket", "power"],
      ru: ["электр", "освещ", "щит", "заземл", "розет", "нагрузк"]
    },
    reply: {
      hy: "Էլեկտրամոնտաժում հաշվարկվում են լարային ուղիները, լուսավորությունը, վահանները, վերականգնումը, գետինացումը և բեռնվածությունը։ Ճիշտ լուծման համար սովորաբար անհրաժեշտ է օբյեկտի չափագրում և սխեմաներ։",
      en: "Electrical work covers cabling routes, lighting, distribution boards, protection, grounding and load planning. A site survey and drawings are usually needed for the right solution.",
      ru: "Электромонтаж включает кабельные трассы, освещение, щиты, защиту, заземление и нагрузку. Для правильного решения обычно нужен замер объекта и схемы."
    }
  },
  {
    id: "automation",
    weight: 4,
    triggers: {
      hy: ["ավտոմատ", "bms", "knx", "smart home", "սմարթ", "սենսոր", "սցենար"],
      en: ["automation", "bms", "knx", "smart home", "sensor", "scenario"],
      ru: ["автомат", "bms", "knx", "smart home", "датчик", "сценар"]
    },
    reply: {
      hy: "Ավտոմատացումը և BMS-ը թույլ են տալիս կառավարել լուսավորությունը, ջեռուցումը/հովացումը, վարագույրները, մուտքը և այլ ենթակարգեր մեկ կենտրոնից։ Smart home լուծումները հաճախ կապվում են ցանցի, անվտանգության և էներգախնայման հետ։",
      en: "Automation and BMS let you control lighting, HVAC, blinds, access and other subsystems from one center. Smart home solutions are often tied to network, security and energy saving.",
      ru: "Автоматизация и BMS позволяют управлять освещением, климатом, шторами, доступом и другими подсистемами из одного центра. Smart home часто связан с сетью, безопасностью и энергосбережением."
    }
  },
  {
    id: "audio",
    weight: 3,
    triggers: {
      hy: ["աուդիո", "ձայն", "խոսափող", "կոնֆերանս", "music", "pa"],
      en: ["audio", "sound", "speaker", "conference", "public address", "pa"],
      ru: ["аудио", "звук", "колон", "конференц", "оповещ", "pa"]
    },
    reply: {
      hy: "Աուդիո համակարգերը կարող են լինել ֆոնային երաժշտություն, հանրային տեղեկացում, կոնֆերանսային ձայն և արտակարգության ձայնային տեղեկացում։ Կարևոր է գոտիները, սրահների չափը և արդյոք ինտեգրում է պետք հրդեհային համակարգի հետ։",
      en: "Audio systems may include background music, public address, conference audio and evacuation voice notification. Zones, room sizes and fire-system integration matter.",
      ru: "Аудиосистемы могут включать фоновую музыку, оповещение, конференц-звук и речевое оповещение. Важны зоны, размеры помещений и интеграция с пожарной системой."
    }
  },
  {
    id: "powder",
    weight: 3,
    triggers: {
      hy: ["փոշեներկ", "powder", "ral", "ncs", "մետաղ"],
      en: ["powder coating", "ral", "ncs", "metal coating"],
      ru: ["порошков", "ral", "ncs", "металл", "покрыт"]
    },
    reply: {
      hy: "Փոշեներկումը ներառում է մակերեսի մշակում, մաքրում, փոշու ներկում և ուխտում՝ RAL/NCS գույներով։ Հարմար է մետաղական կոնստրուկցիաների պաշտպանական և դեկորատիվ ծածկույթի համար։",
      en: "Powder coating includes surface preparation, cleaning, powder application and curing in RAL/NCS colors. It is used for protective and decorative metal finishing.",
      ru: "Порошковая покраска включает подготовку поверхности, очистку, нанесение порошка и полимеризацию в цветах RAL/NCS. Подходит для защитного и декоративного покрытия металла."
    }
  },
  {
    id: "price",
    weight: 3,
    triggers: {
      hy: ["գին", "արժեք", "բյուջե", "հաշվարկ", "քանի", "որքան"],
      en: ["price", "pricing", "cost", "budget", "quote", "estimate", "how much"],
      ru: ["стоим", "цена", "бюджет", "расчет", "сколько"]
    },
    reply: {
      hy: "Գինը կախված է օբյեկտի չափագրումից, սարքավորումների դասից, մալուխային ուղիներից, տեսախցիկների/սարքերի քանակից, արխիվից և ժամկետից։ Կոնկրետ առաջարկի համար անհրաժեշտ է կարճ բրիֆ կամ չափագրում։",
      en: "Pricing depends on site survey, equipment class, cabling routes, device/camera count, archive needs and timeline. A short brief or site survey is needed for a concrete offer.",
      ru: "Стоимость зависит от обследования объекта, класса оборудования, трасс кабеля, количества устройств/камер, архива и сроков. Для точного предложения нужен краткий бриф или замер."
    }
  },
  {
    id: "timeline",
    weight: 3,
    triggers: {
      hy: ["ժամկետ", "երբ", "օր", "շաբաթ", "տևում", "արագ"],
      en: ["timeline", "when", "how long", "days", "weeks", "deadline"],
      ru: ["срок", "когда", "сколько дней", "недел", "долго"]
    },
    reply: {
      hy: "Փոքր օբյեկտներում մոնտաժը հաճախ 3–7 օր է, միջին նախագծերում՝ 1–3 շաբաթ։ Վերջնական ժամկետը հաստատվում է չափագրումից և աշխատանքների ծավալից հետո։",
      en: "Small sites often take 3–7 days, medium projects 1–3 weeks. The final timeline is confirmed after survey and scope review.",
      ru: "Небольшие объекты часто занимают 3–7 дней, средние проекты — 1–3 недели. Итоговый срок подтверждается после замера и оценки объема работ."
    }
  },
  {
    id: "workflow",
    weight: 3,
    triggers: {
      hy: ["ինչպես", "քայլ", "պրոցես", "նախագիծ", "չափագրում", "բրիֆ"],
      en: ["how it works", "process", "steps", "workflow", "brief", "survey"],
      ru: ["как работает", "процесс", "этап", "бриф", "замер"]
    },
    reply: {
      hy: "Սովորաբար աշխատանքի հերթականությունը այսպիսին է՝ խորհրդատվություն, չափագրում, տեխնիկական բրիֆ, սարքավորումների ընտրություն, առաջարկ, մատակարարում, մոնտաժ, կարգավորում/ծրագրավորում, հանձնում և սպասարկում։",
      en: "The usual workflow is consultation, site survey, technical brief, equipment selection, commercial offer, supply, installation, commissioning/programming, handover and maintenance.",
      ru: "Обычный процесс: консультация, замер, технический бриф, подбор оборудования, коммерческое предложение, поставка, монтаж, пусконаладка/программирование, сдача и обслуживание."
    }
  },
  {
    id: "brands",
    weight: 2,
    triggers: {
      hy: ["բրենդ", "hikvision", "dahua", "bosch", "ajax", "mikrotik", "cisco", "schneider"],
      en: ["brand", "hikvision", "dahua", "bosch", "ajax", "mikrotik", "cisco"],
      ru: ["бренд", "hikvision", "dahua", "bosch", "ajax", "mikrotik", "cisco"]
    },
    reply: {
      hy: "Smart Tech-ը աշխատում է Hikvision, Dahua, Bosch, Ajax, Cisco, MikroTik, Schneider Electric և այլ առաջատար բրենդերի հետ՝ ըստ նախագծի պահանջների։ Կոնկրետ մոդելների առկայությունը հաստատվում է առաջարկի փուլում։",
      en: "Smart Tech works with Hikvision, Dahua, Bosch, Ajax, Cisco, MikroTik, Schneider Electric and other leading brands depending on project needs. Exact model availability is confirmed at the offer stage.",
      ru: "Smart Tech работает с Hikvision, Dahua, Bosch, Ajax, Cisco, MikroTik, Schneider Electric и другими ведущими брендами по требованиям проекта. Наличие конкретных моделей подтверждается на этапе предложения."
    }
  },
  {
    id: "projects",
    weight:  2,
    triggers: {
      hy: ["նախագիծ", "հյուրանոց", "wildberries", "movenpick", "wyndham", "բանկ"],
      en: ["project", "hotel", "wildberries", "movenpick", "wyndham", "bank"],
      ru: ["проект", "отель", "wildberries", "movenpick", "wyndham", "банк"]
    },
    reply: {
      hy: "Կայքում ներկայացված նախագծերից են Abovyan 5/5 Hotel, Amiryan Business Center, Wyndham Grand Tsaghkadzor, Only One, Dalan Technopark, ULS Data Center, ACBA Bank, Evocabank, Movenpick և Wildberries։",
      en: "Projects on the site include Abovyan 5/5 Hotel, Amiryan Business Center, Wyndham Grand Tsaghkadzor, Only One, Dalan Technopark, ULS Data Center, ACBA Bank, Evocabank, Movenpick and Wildberries.",
      ru: "Среди проектов на сайте: Abovyan 5/5 Hotel, Amiryan Business Center, Wyndham Grand Tsaghkadzor, Only One, Dalan Technopark, ULS Data Center, ACBA Bank, Evocabank, Movenpick и Wildberries."
    }
  },
  {
    id: "maintenance",
    weight: 3,
    triggers: {
      hy: ["սպասարկ", "կարգավոր", "վերանորոգ", "խափանում", "չի աշխատ"],
      en: ["maintenance", "service", "repair", "not working", "issue", "fault"],
      ru: ["обслужив", "настрой", "ремонт", "не работ", "полом"]
    },
    reply: {
      hy: "Սպասարկման համար օգտակար է նշել համակարգի տեսակը, ապարատի մոդելը, խնդրի նկարագրությունը, օբյեկտի հասցեն և արդյոք արտակարգ դեպք է։ Անվտանգության համար խորհուրդ չի տրվում ինքնուրույն բացել վահանները կամ շրջանցել պաշտպանությունը։",
      en: "For maintenance, share the system type, device model, fault symptoms, site address and whether it is urgent. For safety, do not open electrical panels or bypass protection on your own.",
      ru: "Для обслуживания укажите тип системы, модель оборудования, симптомы, адрес объекта и срочность. В целях безопасности не открывайте щиты и не обходите защиту самостоятельно."
    }
  },
  {
    id: "offtopic",
    weight: 5,
    triggers: {
      hy: ["եղանակ", "ֆուտբոլ", "սիրո", "բաղադրություն", "դասախոս"],
      en: ["weather", "football", "soccer", "recipe", "joke", "politics"],
      ru: ["погод", "футбол", "рецепт", "анекдот", "политик"]
    },
    reply: {
      hy: "Ես Smart Tech AI-ն եմ և կարող եմ օգնել միայն Smart Tech-ի ծառայություններին, ինժեներական և անվտանգության համակարգերին վերաբերող հարցերում։",
      en: "I am Smart Tech AI and can help only with Smart Tech services, engineering and security systems.",
      ru: "Я Smart Tech AI и могу помочь только по услугам Smart Tech, инженерным и системам безопасности."
    }
  }
];

function normalizeLanguage(language) {
  const code = String(language || "hy").toLowerCase();
  if (code.indexOf("en") === 0) return "en";
  if (code.indexOf("ru") === 0) return "ru";
  return "hy";
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s/+.-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsTrigger(text, trigger) {
  const token = normalizeText(trigger);
  if (!token) return false;
  if (text === token) return true;

  if (token.length <= 4) {
    const re = new RegExp("(?:^|[\\s,.!?;:()\\[\\]\"'])(" + escapeRegExp(token) + ")(?:$|[\\s,.!?;:()\\[\\]\"'])", "u");
    return re.test(text);
  }

  return text.indexOf(token) >= 0;
}

function scoreEntry(entry, text, language) {
  const lang = normalizeLanguage(language);
  const words = []
    .concat(entry.triggers.hy || [])
    .concat(entry.triggers[lang] || [])
    .concat(entry.triggers.en || []);

  let score = 0;
  words.forEach((word) => {
    if (containsTrigger(text, word)) {
      score += entry.weight || 1;
    }
  });
  return score;
}

function pickReply(entry, language) {
  const lang = normalizeLanguage(language);
  return entry.reply[lang] || entry.reply.hy || entry.reply.en || "";
}

function shouldPreferOpenAI(message, history) {
  const text = normalizeText(message);
  if (!text) return false;

  if (Array.isArray(history) && history.length > 0) {
    return true;
  }

  if (/(հավաք|կազմ|հարցաշար|questionnaire|assemble|collect.*project|project.*(brief|plan)|собер|бриф|опросник|нужен проект)/i.test(text)) {
    return true;
  }
  if (/(կարող ես|կարող ենք|օգն|help me|can you|could you|please help|мог(у|ёшь|ете)|помог)/i.test(text)) {
    return true;
  }
  if (/(տարբերություն|համեմատ|compare|difference|versus|vs\b|чем отлича|разниц|bullet|dome|varifocal|ptz)/i.test(text)) {
    return true;
  }
  if (/(ինչու|why|почему|explain|բացատր)/i.test(text)) {
    return true;
  }
  if (text.length > 110) return true;

  return false;
}

function matchLocalChatReply(message, language, history) {
  const text = normalizeText(message);
  if (!text) return null;
  if (shouldPreferOpenAI(message, history)) return null;

  let best = null;
  let bestScore = 0;

  entries.forEach((entry) => {
    const score = scoreEntry(entry, text, language);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  });

  if (!best || bestScore < 2) {
    return null;
  }

  return {
    id: best.id,
    reply: pickReply(best, language),
    score: bestScore
  };
}

module.exports = {
  matchLocalChatReply
};
