const siteUrl = "https://smarttechllc.am";

const articleTopics = [
  "CCTV installation cost in Armenia",
  "Fire alarm regulations in Armenia",
  "Smart building systems in Yerevan",
  "Access control systems guide",
  "Security systems for hotels",
  "Security systems for banks",
  "Security systems for warehouses",
  "Electrical installation standards in Armenia",
  "Structured cabling best practices Armenia",
  "Wi-Fi coverage for offices Yerevan",
  "NVR storage calculator guide Armenia",
  "Hotel CCTV design checklist",
  "Bank security system requirements",
  "Warehouse video surveillance guide",
  "BMS automation for commercial buildings",
  "Intercom systems residential Yerevan",
  "Fire evacuation voice notification",
  "PoE switch selection CCTV",
  "Access control for offices",
  "Smart home security Armenia"
];

function makeArticle(slug, titleHy, titleEn, descriptionHy, excerpt, sections, faq) {
  return {
    slug: slug,
    titleHy: titleHy,
    titleEn: titleEn,
    descriptionHy: descriptionHy,
    excerpt: excerpt,
    published: "2026-06-08",
    sections: sections,
    faq: faq || [],
    ogImage: siteUrl + "/img/smart-tech.png"
  };
}

const articles = [
  makeArticle(
    "cctv-installation-cost-armenia",
    "CCTV տեղադրման արժեքը Հայաստանում | Smart Tech",
    "CCTV Installation Cost in Armenia",
    "Ինչից է կախված տեսահսկման արժեքը Հայաստանում՝ տեսախցիկներ, արխիվ, մալուխավորում, հեռահար դիտում և չափագրում։",
    "CCTV installation cost in Armenia depends on camera count, archive duration, cabling routes, indoor/outdoor points and remote viewing requirements.",
    [
      {
        heading: "Ինչ է ներառված CCTV նախագծում",
        body: "Պրոֆեսիոնալ տեսահսկումը ներառում է տեսախցիկներ, NVR/DVR, HDD արխիվ, PoE switch, UPS, մալուխավորում, կարգավորում և հեռահար դիտարկում։ Smart Tech LLC-ն 2012 թվականից իրականացնում է նախագծեր Երևանում և մարզերում։"
      },
      {
        heading: "Գնի հիմնական գործոններ",
        body: "Արժեքը կախված է տեսախցիկների քանակից, տեսակից (ֆիքսված, varifocal, PTZ), արխիվի օրերից, մալուխային երթուղիներից, գիշերային պատկերի որակից և ինտեգրացիայից մուտքի վերահսկման հետ։"
      },
      {
        heading: "Ինչպես ստանալ ճշգրիտ առաջարկ",
        body: "Ճշգրիտ գնային առաջարկի համար անհրաժեշտ է օբյեկտի չափագրում։ Կարող եք թողնել հայտ smarttechllc.am/request էջում կամ զանգել +37477424643։"
      }
    ],
    [
      { question: "Որքա՞ն արժե 4 տեսախցիկով համակարգը", answer: "Կախված է տեսախցիկների դասից, արխիվից և մալուխավորումից։ Չափագրումից հետո թիմը կտա ճշգրիտ հաշվարկ։" },
      { question: "Արդյո՞ք գինը ներառում է սպասարկում", answer: "Սպասարկումը կարող է ներառվել առանձին պայմանագրով՝ կախված նախագծից։" }
    ]
  ),
  makeArticle(
    "fire-alarm-regulations-armenia",
    "Հրդեհային ազդանշանի պահանջներ Հայաստանում",
    "Fire Alarm Regulations in Armenia",
    "Հրդեհային անվտանգության հիմնական պահանջներ և ինժեներական մոտեցում բիզնես օբյեկտների համար Հայաստանում։",
    "Fire alarm requirements in Armenia depend on building type, occupancy, area and applicable safety regulations.",
    [
      { heading: "Ինչու է կարևոր հրդեհային ազդանշան", body: "Վաղ հայտնաբերումը փրկում է կյանքեր և նվազեցնում վնասը։ Հյուրանոցներ, առևտրի և գրասենյակային օբյեկտներում հրդեհային համակարգը հիմնական պահանջ է։" },
      { heading: "Ինժեներական մոտեցում", body: "Smart Tech-ը նախագծում է գոտիներ, ազդիչների տեղադրում, պանել, սիրենա և տարհանման ծանուցում՝ օբյեկտի նշանակությանը համապատասխան։" },
      { heading: "Հանձնում և սպասարկում", body: "Գործարկումից հետո կատարվում է փորձարկում, օգտատիրոջ ուսուցում և պարբերական սպասարկում։" }
    ]
  ),
  makeArticle(
    "smart-building-systems-yerevan",
    "Խելացի շենքի համակարգեր Երևանում",
    "Smart Building Systems in Yerevan",
    "BMS, ավտոմատացում, լուսավորության կառավարում, HVAC ինտեգրում և մոնիտորինգ Երևանի գրասենյակների և հյուրանոցների համար։",
    "Smart building systems in Yerevan combine BMS, lighting control, HVAC integration, security and monitoring in one platform.",
    [
      { heading: "Ինչ է smart building", body: "Խելացի շենքը միավորում է լուսավորություն, կլիմա, անվտանգություն, մուտքի վերահսկում և էներգիայի վերահսկում մեկ կառավարման հարթակում։" },
      { heading: "Օգուտները", body: "Նվազեցնում է էներգիայի ծախսը, բարձրացնում հարմարավետությունը և տալիս կենտրոնացված մոնիտորինգ։" },
      { heading: "Smart Tech-ի փորձ", body: "Մենք իրականացրել ենք BMS և ավտոմատացման նախագծեր հյուրանոցներում, գրասենյակներում և բնակելի համալիրներում։" }
    ]
  ),
  makeArticle(
    "access-control-systems-guide",
    "Մուտքի վերահսկման համակարգերի ուղեցույց",
    "Access Control Systems Guide",
    "Մուտքի վերահսկման ընտրության ուղեցույց՝ քարտ, կենսաչափություն, դոմոֆոն, հեռախոսային բացում և ինտեգրացիա։",
    "Access control guide: card readers, biometrics, intercom, mobile unlock and integration with CCTV.",
    [
      { heading: "Հիմնական տարբերակներ", body: "Քարտային մուտք, PIN, կենսաչափություն (մատնահետք, դեմք), մոբայլ հավելված և հեռախոսային դուռ բացում։" },
      { heading: "Ինչ հարցեր են կարևոր", body: "Մուտքերի քանակ, օգտատերերի թիվ, 24/7 հասանելիություն, ինտեգրացիա CCTV-ի հետ, դոմոֆոնի անհրաժեշտություն։" },
      { heading: "Տեղադրում", body: "Smart Tech-ը կատարում է նախագիծ, մոնտաժ, կարգավորում և սպասարկում Երևանում և Հայաստանում։" }
    ]
  ),
  makeArticle(
    "security-systems-hotels",
    "Անվտանգության համակարգեր հյուրանոցների համար",
    "Security Systems for Hotels",
    "Հյուրանոցային անվտանգություն՝ CCTV, մուտքի վերահսկում, հրդեհային ազդանշան, ցանց և BMS ինտեգրում։",
    "Hotel security systems: CCTV, access control, fire alarm, Wi-Fi and BMS integration for guest safety.",
    [
      { heading: "Հյուրանոցի առանձնություններ", body: "Հյուրանոցներում կարևոր են հանգստի գոտիներ, ստացման բաժին, պարկինգ, միջանցքներ և արտակարգ սցենարներ։" },
      { heading: "Ինտեգրված լուծում", body: "Smart Tech-ը աշխատել է Wyndham Grand Tsaghkadzor, Eria Hotel, Abovyan 5/5 Hotel և այլ նախագծերում։" },
      { heading: "Առաջարկվող համակարգեր", body: "IP տեսահսկում, մուտքի վերահսկում, հրդեհային ազդանշան, ցանց, public address և BMS։" }
    ]
  ),
  makeArticle(
    "security-systems-banks",
    "Անվտանգության համակարգեր բանկերի համար",
    "Security Systems for Banks",
    "Բանկային անվտանգություն՝ տեսահսկում, մուտքի վերահսկում, ազդանշան, ցանց և արխիվի պահպանում։",
    "Bank security: CCTV with long archive, access control, alarm systems and secure networking.",
    [
      { heading: "Բանկի պահանջներ", body: "Բարձր արխիվ, հստակ պատկեր, մուտքի վերահսկում, ազդանշանային գոտիներ և ցանցային անվտանգություն։" },
      { heading: "Smart Tech փորձ", body: "ACBA Bank Sebastia 80, Evocabank և այլ նախագծերում իրականացրել ենք ինտեգրված լուծումներ։" }
    ]
  ),
  makeArticle(
    "security-systems-warehouses",
    "Անվտանգություն պահեստների համար",
    "Security Systems for Warehouses",
    "Պահեստային տեսահսկում, perimeter protection, մուտքի վերահսկում և ցանց՝ Wildberries և արդյունաբերական օբյեկտների փորձով։",
    "Warehouse security: outdoor CCTV, perimeter detection, access control and reliable networking.",
    [
      { heading: "Պահեստի մարտահրավերներ", body: "Մեծ մակերես, բարձր պատեր, բեռնատարների հոսք, գիշերային պահպանություն և հեռահար դիտարկում։" },
      { heading: "Լուծումներ", body: "Outdoor տեսախցիկներ, IR/ColorVu, perimeter sensors, NVR արխիվ, UPS և հեռահար ահազանգում։" }
    ]
  ),
  makeArticle(
    "electrical-installation-standards-armenia",
    "Էլեկտրամոնտաժի ստանդարտներ Հայաստանում",
    "Electrical Installation Standards in Armenia",
    "Էլեկտրամոնտաժի անվտանգություն, grounding, վահաններ, բեռների հաշվարկ և ինժեներական նախագիծ։",
    "Electrical installation standards in Armenia: safety, grounding, panels, load calculation and engineering design.",
    [
      { heading: "Անվտանգության հիմք", body: "Ճիշտ մալուխավորում, վահաններ, արտակարգ պաշտպանություն և grounding-ը հիմք են անվտանգ էլեկտրամատակարարման։" },
      { heading: "Նախագիծ և իրականացում", body: "Smart Tech-ը կատարում է նախագիծ, մոնտաժ, փորձարկում և հանձնում՝ ավտոմատացման համար նախապատրաստված ենթակառուցվածքով։" }
    ]
  ),
  makeArticle(
    "structured-cabling-armenia",
    "Կառուցվածքային մալուխավորում Հայաստանում",
    "Structured Cabling Armenia",
    "UTP, fiber, patch panel, rack և Wi-Fi ցանցերի նախագիծ գրասենյակների և առևտրի օբյեկտների համար։",
    "Structured cabling in Armenia: UTP, fiber optics, racks, patch panels and Wi-Fi for offices and retail.",
    [
      { heading: "Ինչու է կարևոր", body: "Կառուցվածքային մալուխավորումը ապահովում է կայուն ցանց, ընդլայնում և պրոֆեսիոնալ սպասարկելիություն։" },
      { heading: "Ինչ ենք անում", body: "Նախագիծ, UTP/fiber տեղադրում, rack, patch panel, switch, Wi-Fi access points և փորձարկում։" }
    ]
  ),
  makeArticle(
    "hotel-cctv-design-checklist",
    "Հյուրանոցի CCTV նախագծման checklist",
    "Hotel CCTV Design Checklist",
    "Հյուրանոցի տեսահսկման նախագծման ստուգացուցակ՝ գոտիներ, արխիվ, գաղտնիություն, հեռահար դիտում։",
    "Hotel CCTV design checklist: zones, archive, privacy, remote viewing and integration.",
    [
      { heading: "Գոտիներ", body: "Մուտք, ստացման բաժին, միջանցքներ, լիֆտ, պարկինգ, բեռնատարային գոտի — առանց գաղտնիության խախտման։" },
      { heading: "Տեխնիկա", body: "IP տեսախցիկներ, NVR, PoE, UPS, հեռահար դիտարկում և ինտեգրացիա մուտքի վերահսկման հետ։" }
    ]
  ),
  makeArticle(
    "nvr-storage-guide-armenia",
    "NVR արխիվի հաշվարկի ուղեցույց",
    "NVR Storage Guide Armenia",
    "Որքան HDD է պետք CCTV արխիվի համար՝ տեսախցիկների քանակ, bitrate և օրերի հիման վրա։",
    "NVR storage guide: calculate HDD size by camera count, resolution, bitrate and retention days.",
    [
      { heading: "Հիմնական բանաձև", body: "Արխիվի ծավալը կախված է տեսախցիկների քանակից, resolution-ից, compression-ից և պահպանման օրերից։" },
      { heading: "Խորհուրդ", body: "Բիզնես օբյեկտներում սովորաբար ընտրում են 14-30+ օր արխիվ՝ կախված պահանջից։" }
    ]
  ),
  makeArticle(
    "wifi-office-yerevan",
    "Wi-Fi ծածկույթ գրասենյակներում Երևանում",
    "Wi-Fi Coverage for Offices in Yerevan",
    "Գրասենյակային Wi-Fi նախագիծ՝ access points, VLAN, guest network և կայուն ցանց։",
    "Office Wi-Fi in Yerevan: access points, VLAN, guest network and stable coverage.",
    [
      { heading: "Խնդիրներ", body: "Հաստ պատեր, մի քանի հարկ, բարձր օգտատերերի թիվ և dead zones-ներ։" },
      { heading: "Լուծում", body: "Site survey, access point տեղադրում, PoE switch, router/firewall և կարգավորում։" }
    ]
  )
];

function buildArticleRouteSeo(article) {
  return {
    path: "/blog/" + article.slug,
    canonicalPath: "/blog/" + article.slug,
    title: article.titleHy,
    description: article.descriptionHy,
    pageName: article.titleHy.split("|")[0].trim(),
    robots: "index, follow",
    schemaType: "Article",
    includeInSitemap: true,
    ogImage: article.ogImage,
    articleSlug: article.slug,
    published: article.published
  };
}

function articleRouteMap() {
  var map = {
    blog: {
      path: "/blog",
      canonicalPath: "/blog",
      title: "SEO Բլոգ | Smart Tech",
      description: "Տեսահսկում, անվտանգություն, էլեկտրամոնտաժ, ցանցեր և խելացի համակարգեր — մասնագիտական հոդվածներ Smart Tech LLC-ից։",
      pageName: "Բլոգ",
      robots: "index, follow",
      schemaType: "CollectionPage",
      includeInSitemap: true,
      ogImage: siteUrl + "/img/smart-tech.png"
    }
  };
  articles.forEach(function (article) {
    map["blog-" + article.slug] = buildArticleRouteSeo(article);
  });
  return map;
}

function getArticleBySlug(slug) {
  return articles.find(function (item) {
    return item.slug === slug;
  }) || null;
}

module.exports = {
  siteUrl,
  articleTopics,
  articles,
  articleRouteMap,
  buildArticleRouteSeo,
  getArticleBySlug
};
