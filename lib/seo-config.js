const landings = require("./seo-landings");
const articles = require("./seo-articles");

const siteUrl = "https://smarttechllc.am";
const siteName = "Smart Tech";
const defaultImage = siteUrl + "/img/smart-tech.png";
const imageAlt = "Smart Tech security systems, CCTV, fire alarms, access control and smart building solutions in Armenia";
const lastmod = "2026-09-01";
const googleAnalyticsMeasurementId = "G-1SC80R2NZE";
const yandexVerificationCode = "f75d8ae54fe216ec";

const organization = {
  "@type": ["Organization", "LocalBusiness"],
  "@id": siteUrl + "/#organization",
  name: siteName,
  legalName: "Smart Tech LLC",
  alternateName: ["SmartTech LLC", "Smart Tech Armenia", "Սմարթ Տեք"],
  url: siteUrl + "/",
  logo: defaultImage,
  image: defaultImage,
  email: "info@smarttechllc.am",
  telephone: ["+37477424643", "+37496424643"],
  foundingDate: "2012",
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    minValue: 88,
    unitText: "employees"
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "10 Vazgen Sargsyan St",
    addressLocality: "Yerevan",
    addressRegion: "Kentron",
    postalCode: "0010",
    addressCountry: "AM"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.1763311,
    longitude: 44.5111915
  },
  areaServed: [
    { "@type": "Country", name: "Armenia" },
    { "@type": "City", name: "Yerevan" }
  ],
  knowsAbout: [
    "CCTV installation",
    "Fire alarm systems",
    "Access control",
    "Structured cabling",
    "Electrical installation",
    "Smart building automation",
    "Security systems",
    "Video surveillance",
    "BMS",
    "Network installation"
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Smart Tech engineering services",
    itemListElement: [
      "CCTV and video surveillance",
      "Fire alarm and security systems",
      "Access control and intercom",
      "Structured cabling and Wi-Fi",
      "Electrical installation",
      "Smart building and BMS"
    ].map(function (name, index) {
      return {
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: name,
          provider: { "@id": siteUrl + "/#organization" },
          areaServed: "Armenia"
        }
      };
    })
  },
  sameAs: [
    "https://www.facebook.com/share/1CYQCeM7jd",
    "https://www.instagram.com/smart_tech_armenia",
    "https://www.tiktok.com/@best_systems",
    "https://t.me/smarttechllc"
  ]
};

const services = [
  "Տեսահսկման համակարգեր",
  "Հրդեհային ազդարարման համակարգեր",
  "Մուտքի վերահսկում և անվտանգություն",
  "Ցանցերի տեղադրում և Wi-Fi ծածկույթ",
  "Էլեկտրամոնտաժային աշխատանքներ",
  "Շենքերի ավտոմատացում և BMS",
  "24/7 մոնիթորինգ և ավարուժ սպասարձում"
];

const faqItems = [
  {
    question: "Արդյո՞ք կատարում եք չափագրում",
    answer: "Այո, նախնական քննարկումից հետո կարող ենք կազմակերպել մասնագետի այց և տեխնիկական առաջարկ։"
  },
  {
    question: "Ինչքա՞ն է տևում տեղադրումը",
    answer: "Փոքր աշխատանքները սովորաբար տևում են մի քանի օր, իսկ մեծ նախագծերը գնահատվում են ըստ ծավալի։"
  },
  {
    question: "Կատարո՞ւմ եք սպասարկում",
    answer: "Այո, սպասարկում ենք տեղադրված համակարգերը և օգնում ենք կարգաբերման կամ վերանորոգման հարցերում։"
  },
  {
    question: "Որ քաղաքներում եք աշխատում",
    answer: "Հիմնական գրասենյակը Երևանում է, սակայն սպասարձում ենք նաև Հայաստանի մարզերը՝ Kentron, Arabkir, Ajapnyak, Davtashen, Shengavit, Malatia և այլ թաղամասերում։"
  },
  {
    question: "Ի՞նչ ծառայություններ է առաջարկում Smart Tech",
    answer: "Տեսահսկում, հրդեհային ազդանշան, մուտքի վերահսկում, ցանցեր, էլեկտրամոնտաժ, ավտոմատացում, BMS, աուդիո համակարգեր և սպասարկում։"
  }
];

const routeSeo = {
  index: {
    path: "/",
    canonicalPath: "/",
    title: "Security Systems Armenia | CCTV, Fire Alarm & Smart Building | Smart Tech",
    description: "Smart Tech delivers CCTV installation, fire alarm systems, access control, network setup, electrical works and smart building automation in Yerevan and across Armenia.",
    pageName: "Անվտանգության և խելացի համակարգերի լուծումներ",
    robots: "index, follow",
    schemaType: "WebPage",
    includeInSitemap: true
  },
  home: {
    path: "/home",
    canonicalPath: "/",
    title: "Smart Tech | Security Systems & Automation in Armenia",
    description: "Professional CCTV, fire alarm, access control, cabling, electrical works and BMS solutions for residential, commercial and industrial projects in Armenia.",
    pageName: "Գլխավոր",
    robots: "index, follow",
    schemaType: "WebPage",
    includeInSitemap: false
  },
  services: {
    path: "/services",
    canonicalPath: "/services",
    title: "Security & Engineering Services in Armenia | Smart Tech",
    description: "CCTV systems, fire alarms, access control, structured cabling, Wi-Fi, electrical installation, smart automation and 24/7 monitoring by Smart Tech in Yerevan, Armenia.",
    pageName: "Ծառայություններ",
    robots: "index, follow",
    schemaType: "CollectionPage",
    includeInSitemap: true
  },
  projects: {
    path: "/projects",
    canonicalPath: "/projects",
    title: "Նախագծեր | Smart Tech",
    description: "Դիտեք Smart Tech-ի իրականացրած նախագծերը՝ բիզնես կենտրոններ, հյուրանոցներ, բնակելի համալիրներ և արդյունաբերական օբյեկտներ անվտանգային ու էլեկտրական համակարգերով։",
    pageName: "Նախագծեր",
    robots: "index, follow",
    schemaType: "CollectionPage",
    includeInSitemap: true
  },
  album: {
    path: "/album",
    canonicalPath: "/album",
    title: "Աշխատանքների ալբոմ | Smart Tech",
    description: "Smart Tech-ի աշխատանքների լուսանկարների ալբոմ՝ ընթացիկ նախագծերով և ավարտված աշխատանքներով երկու հստակ բաժիններում։",
    pageName: "Աշխատանքների ալբոմ",
    robots: "index, follow",
    schemaType: "CollectionPage",
    includeInSitemap: true
  },
  admin: {
    path: "/admin",
    canonicalPath: "/admin",
    title: "Smart Tech Admin",
    description: "Protected Smart Tech administration panel.",
    pageName: "Admin",
    robots: "noindex, nofollow",
    schemaType: "WebPage",
    includeInSitemap: false
  },
  chat: {
    path: "/chat",
    canonicalPath: "/chat",
    title: "AI օգնական | Smart Tech",
    description: "Smart Tech-ի AI օգնականի առանձին էջ՝ ծառայությունների, նախագծերի, գների և կապի հարցերի արագ պատասխանների համար։",
    pageName: "AI օգնական",
    robots: "index, follow",
    schemaType: "WebPage",
    includeInSitemap: true
  },
  "our-jobs": {
    path: "/our-jobs",
    canonicalPath: "/projects",
    title: "Նախագծեր | Smart Tech",
    description: "Smart Tech-ի նախագծերի էջը ցույց է տալիս իրականացված անվտանգային, էլեկտրամոնտաժային և խելացի համակարգերի աշխատանքները։",
    pageName: "Նախագծեր",
    robots: "index, follow",
    schemaType: "CollectionPage",
    includeInSitemap: false
  },
  request: {
    path: "/request",
    canonicalPath: "/request",
    title: "Պատվիրել համակարգերի հաշվարկ | Smart Tech",
    description: "Հավաքեք անվտանգության, տեսահսկման, մուտքի վերահսկման, ցանցերի կամ սպասարկման հայտ և ուղարկեք Smart Tech-ին արագ հաշվարկի համար։",
    pageName: "Պատվիրել",
    robots: "index, follow",
    schemaType: "WebPage",
    includeInSitemap: true
  },
  partners: {
    path: "/partners",
    canonicalPath: "/partners",
    title: "Գործընկերներ | Smart Tech",
    description: "Smart Tech-ի գործընկերները և հաճախորդները ընտրում են անվտանգային, էլեկտրամոնտաժային և ինժեներական լուծումների վստահելի սպասարկում։",
    pageName: "Գործընկերներ",
    robots: "index, follow",
    schemaType: "CollectionPage",
    includeInSitemap: true
  },
  team: {
    path: "/team",
    canonicalPath: "/team",
    title: "Մեր թիմը | Smart Tech",
    description: "Smart Tech-ի թիմում ընդգրկված են նախագծման, ծրագրավորման, տեղադրման և սպասարկման մասնագետներ՝ բիզնեսի համար հուսալի համակարգեր ապահովելու համար։",
    pageName: "Մեր թիմը",
    robots: "index, follow",
    schemaType: "AboutPage",
    includeInSitemap: true
  },
  about: {
    path: "/about",
    canonicalPath: "/about",
    title: "About Smart Tech | Security Company in Armenia",
    description: "Smart Tech is a leading Armenian security systems company specializing in CCTV, fire alarm, access control, BMS, electrical works and engineering solutions since 2012.",
    pageName: "Մեր մասին",
    robots: "index, follow",
    schemaType: "AboutPage",
    includeInSitemap: true
  },
  licenses: {
    path: "/licenses",
    canonicalPath: "/about",
    title: "Certifications & Quality Standards | Smart Tech",
    description: "Learn about Smart Tech quality standards, engineering expertise and technical compliance for security systems, installation and maintenance in Armenia.",
    pageName: "Լիցենզիաներ և որակ",
    robots: "index, follow",
    schemaType: "AboutPage",
    includeInSitemap: false
  },
  contact: {
    path: "/contact",
    canonicalPath: "/contact",
    title: "Contact Smart Tech | Security System Experts in Armenia",
    description: "Request a quote for CCTV, fire alarm, network, access control, electrical works or smart building automation in Yerevan and across Armenia.",
    pageName: "Կապ",
    robots: "index, follow",
    schemaType: "ContactPage",
    includeInSitemap: true
  },
  help: {
    path: "/help",
    canonicalPath: "/help",
    title: "Օգնություն | Smart Tech",
    description: "Իմացեք ինչպես արագ գտնել Smart Tech-ի ծառայությունները, նախագծերը, հայտի ձևը և կապի տվյալները։",
    pageName: "Օգնություն",
    robots: "index, follow",
    schemaType: "WebPage",
    includeInSitemap: false
  },
  faq: {
    path: "/faq",
    canonicalPath: "/faq",
    title: "Հաճախ տրվող հարցեր | Smart Tech",
    description: "Պատասխաններ Smart Tech-ի չափագրման, տեղադրման ժամկետների և սպասարկման մասին հաճախ տրվող հարցերին։",
    pageName: "Հաճախ տրվող հարցեր",
    robots: "index, follow",
    schemaType: "FAQPage",
    includeInSitemap: true
  },
  terms: {
    path: "/terms",
    canonicalPath: "/terms",
    title: "Օգտագործման պայմաններ | Smart Tech",
    description: "Smart Tech կայքի տեղեկատվության օգտագործման հիմնական պայմանները, գների և ժամկետների հաստատման կարգը։",
    pageName: "Օգտագործման պայմաններ",
    robots: "index, follow",
    schemaType: "WebPage",
    includeInSitemap: false
  },
  privacy: {
    path: "/privacy",
    canonicalPath: "/privacy",
    title: "Գաղտնիության քաղաքականություն | Smart Tech",
    description: "Smart Tech-ը օգտագործում է միայն անհրաժեշտ կոնտակտային տվյալները՝ հարցումներին պատասխանելու և կապ հաստատելու համար։",
    pageName: "Գաղտնիության քաղաքականություն",
    robots: "index, follow",
    schemaType: "WebPage",
    includeInSitemap: false
  },
  disclaimer: {
    path: "/disclaimer",
    canonicalPath: "/disclaimer",
    title: "Պատասխանատվության սահմանափակում | Smart Tech",
    description: "Կայքի նյութերի, նկարների և տեխնիկական լուծումների տեղեկատվական բնույթի վերաբերյալ Smart Tech-ի պատասխանատվության սահմանափակումը։",
    pageName: "Պատասխանատվության սահմանափակում",
    robots: "index, follow",
    schemaType: "WebPage",
    includeInSitemap: false
  },
  service: {
    path: "/service",
    canonicalPath: "/service",
    title: "Ծառայության մանրամասներ | Smart Tech",
    description: "Smart Tech-ի ծառայության մանրամասների տեխնիկական էջ։ Հիմնական ծառայությունները տեսեք ծառայությունների էջում։",
    pageName: "Ծառայության մանրամասներ",
    robots: "noindex, follow",
    schemaType: "WebPage",
    includeInSitemap: false
  },
  project: {
    path: "/project",
    canonicalPath: "/project",
    title: "Նախագծի մանրամասներ | Smart Tech",
    description: "Smart Tech-ի նախագծի մանրամասների տեխնիկական էջ։ Իրականացված նախագծերի ամբողջական ցանկը տեսեք նախագծերի էջում։",
    pageName: "Նախագծի մանրամասներ",
    robots: "noindex, follow",
    schemaType: "WebPage",
    includeInSitemap: false
  },
  member: {
    path: "/member",
    canonicalPath: "/member",
    title: "Մասնագետի պրոֆիլ | Smart Tech",
    description: "Smart Tech-ի մասնագետի պրոֆիլի տեխնիկական էջ։ Թիմի ընդհանուր տեղեկատվությունը հասանելի է թիմի էջում։",
    pageName: "Մասնագետի պրոֆիլ",
    robots: "noindex, follow",
    schemaType: "ProfilePage",
    includeInSitemap: false
  },
  landing: {
    path: "/landing",
    canonicalPath: "/landing",
    title: "Ծառայություններ Երևանում | Smart Tech",
    description: "Smart Tech LLC ծառայություններ Երևանում և Հայաստանում։",
    pageName: "Ծառայություններ",
    robots: "noindex, follow",
    schemaType: "WebPage",
    includeInSitemap: false
  },
  blog: {
    path: "/blog",
    canonicalPath: "/blog",
    title: "SEO Բլոգ | Smart Tech",
    description: "Տեսահսկում, անվտանգություն, էլեկտրամոնտաժ և խելացի համակարգեր — մասնագիտական հոդվածներ Smart Tech LLC-ից։",
    pageName: "Բլոգ",
    robots: "index, follow",
    schemaType: "CollectionPage",
    includeInSitemap: true,
    ogImage: defaultImage
  },
  article: {
    path: "/blog/article",
    canonicalPath: "/blog/article",
    title: "Հոդված | Smart Tech",
    description: "Smart Tech LLC մասնագիտական հոդված։",
    pageName: "Հոդված",
    robots: "noindex, follow",
    schemaType: "Article",
    includeInSitemap: false
  }
};

Object.assign(routeSeo, landings.landingRouteMap());
Object.assign(routeSeo, articles.articleRouteMap());

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return "/" + String(pathname).replace(/^\/+|\/+$/g, "");
}

function absoluteUrl(pathname) {
  var cleanPath = normalizePath(pathname);
  return cleanPath === "/" ? siteUrl + "/" : siteUrl + cleanPath;
}

function getRouteSeo(route) {
  return routeSeo[route] || routeSeo.index;
}

function serviceItemList(url) {
  return {
    "@type": "ItemList",
    "@id": url + "#services",
    name: "Smart Tech ծառայությունների ուղղություններ",
    itemListElement: services.map(function (name, index) {
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: name,
          provider: { "@id": organization["@id"] },
          areaServed: "Armenia"
        }
      };
    })
  };
}

function faqPage(url, items) {
  var list = items || faqItems;
  return {
    "@type": "FAQPage",
    "@id": url + "#faq",
    mainEntity: list.map(function (item) {
      return {
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      };
    })
  };
}

function landingServiceSchema(url, landing) {
  if (!landing) return null;
  return {
    "@type": "Service",
    "@id": url + "#service",
    name: landing.headline,
    description: landing.lead,
    provider: { "@id": organization["@id"] },
    areaServed: [
      { "@type": "City", name: "Yerevan" },
      { "@type": "Country", name: "Armenia" }
    ],
    serviceType: landing.pageName,
    offers: {
      "@type": "Offer",
      url: siteUrl + "/request",
      availability: "https://schema.org/InStock",
      priceCurrency: "AMD",
      seller: { "@id": organization["@id"] }
    }
  };
}

function articleSchema(url, meta, article) {
  if (!article) return null;
  return {
    "@type": "Article",
    "@id": url + "#article",
    headline: article.titleHy,
    description: article.descriptionHy,
    datePublished: article.published,
    dateModified: article.published,
    author: { "@id": organization["@id"] },
    publisher: { "@id": organization["@id"] },
    mainEntityOfPage: { "@id": url + "#webpage" },
    image: article.ogImage || defaultImage,
    inLanguage: "hy",
    articleSection: "Engineering systems",
    keywords: article.titleEn
  };
}

function breadcrumbSchema(canonical, crumbs) {
  return {
    "@type": "BreadcrumbList",
    "@id": canonical + "#breadcrumb",
    itemListElement: crumbs.map(function (crumb, index) {
      return {
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.item
      };
    })
  };
}

function structuredData(route) {
  var meta = getRouteSeo(route);
  var canonical = absoluteUrl(meta.canonicalPath || meta.path);
  var pageImage = meta.ogImage || defaultImage;
  var landing = meta.landingSlug ? landings.getLandingBySlug(meta.landingSlug) : null;
  var article = meta.articleSlug ? articles.getArticleBySlug(meta.articleSlug) : null;
  var graph = [
    organization,
    {
      "@type": "WebSite",
      "@id": siteUrl + "/#website",
      url: siteUrl + "/",
      name: siteName,
      inLanguage: ["hy", "en", "ru"],
      publisher: { "@id": organization["@id"] },
      potentialAction: {
        "@type": "SearchAction",
        target: siteUrl + "/services?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": meta.schemaType === "Article" ? "WebPage" : (meta.schemaType || "WebPage"),
      "@id": canonical + "#webpage",
      url: canonical,
      name: meta.pageName || meta.title,
      headline: meta.title,
      description: meta.description,
      inLanguage: "hy",
      isPartOf: { "@id": siteUrl + "/#website" },
      about: landing ? { "@id": canonical + "#service" } : undefined,
      publisher: { "@id": organization["@id"] },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: pageImage,
        caption: imageAlt
      },
      dateModified: lastmod
    }
  ];

  if (meta.path !== "/") {
    var crumbs = [{ name: "Գլխավոր", item: siteUrl + "/" }];
    if (landing) {
      crumbs.push({ name: "Ծառայություններ", item: siteUrl + "/services" });
      crumbs.push({ name: meta.pageName || meta.title, item: canonical });
    } else if (article) {
      crumbs.push({ name: "Բլոգ", item: siteUrl + "/blog" });
      crumbs.push({ name: meta.pageName || meta.title, item: canonical });
    } else {
      crumbs.push({ name: meta.pageName || meta.title, item: canonical });
    }
    graph.push(breadcrumbSchema(canonical, crumbs));
  }

  if (route === "services") {
    graph.push(serviceItemList(canonical));
  }

  if (route === "faq") {
    graph.push(faqPage(canonical));
  }

  if (landing) {
    var serviceNode = landingServiceSchema(canonical, landing);
    if (serviceNode) graph.push(serviceNode);
    if (landing.faq && landing.faq.length) {
      graph.push(faqPage(canonical, landing.faq));
    }
  }

  if (article) {
    var articleNode = articleSchema(canonical, meta, article);
    if (articleNode) graph.push(articleNode);
    if (article.faq && article.faq.length) {
      graph.push(faqPage(canonical, article.faq));
    }
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph.filter(function (node) { return node; })
  }, null, 2).replace(/</g, "\\u003c");
}

function shouldIncludeVercelAnalytics() {
  return Boolean(process.env.VERCEL_ENV);
}

function seoHead(route) {
  var meta = getRouteSeo(route);
  var canonical = absoluteUrl(meta.canonicalPath || meta.path);
  var currentUrl = canonical;
  var title = meta.title;
  var description = meta.description;
  var social = meta.socialShare || {};
  var ogDescription = social.facebook || description;
  var twitterDescription = social.linkedin || social.facebook || description;
  var ogImage = meta.ogImage || defaultImage;
  var robots = meta.robots || "index, follow";
  var ogType = meta.schemaType === "Article" ? "article" : "website";
  var lines = [
    "  <head>",
    "    <meta charset=\"utf-8\">",
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content\">",
    "    <meta name=\"theme-color\" content=\"#101417\">",
    "    <meta name=\"mobile-web-app-capable\" content=\"yes\">",
    "    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">",
    "    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\">",
    "    <meta name=\"robots\" content=\"" + escapeHtml(robots) + "\">",
    "    <meta name=\"yandex-verification\" content=\"" + yandexVerificationCode + "\">",
    "    <meta name=\"description\" content=\"" + escapeHtml(description) + "\">",
    "    <link rel=\"canonical\" href=\"" + escapeHtml(canonical) + "\">",
    "    <link rel=\"sitemap\" type=\"application/xml\" href=\"" + siteUrl + "/sitemap.xml\">",
    "    <link rel=\"preconnect\" href=\"https://www.googletagmanager.com\" crossorigin>",
    "    <meta property=\"og:type\" content=\"" + ogType + "\">",
    "    <meta property=\"og:locale\" content=\"hy_AM\">",
    "    <meta property=\"og:site_name\" content=\"" + siteName + "\">",
    "    <meta property=\"og:title\" content=\"" + escapeHtml(title) + "\">",
    "    <meta property=\"og:description\" content=\"" + escapeHtml(ogDescription) + "\">",
    "    <meta property=\"og:url\" content=\"" + escapeHtml(currentUrl) + "\">",
    "    <meta property=\"og:image\" content=\"" + ogImage + "\">",
    "    <meta property=\"og:image:secure_url\" content=\"" + ogImage + "\">",
    "    <meta property=\"og:image:alt\" content=\"" + escapeHtml(imageAlt) + "\">",
    "    <meta name=\"twitter:card\" content=\"summary_large_image\">",
    "    <meta name=\"twitter:title\" content=\"" + escapeHtml(title) + "\">",
    "    <meta name=\"twitter:description\" content=\"" + escapeHtml(twitterDescription) + "\">",
    "    <meta name=\"twitter:image\" content=\"" + ogImage + "\">",
    "    <meta name=\"twitter:image:alt\" content=\"" + escapeHtml(imageAlt) + "\">"
  ];

  if (social.instagram) {
    lines.push("    <meta name=\"instagram:title\" content=\"" + escapeHtml(title) + "\">");
    lines.push("    <meta name=\"instagram:description\" content=\"" + escapeHtml(social.instagram) + "\">");
  }
  if (social.linkedin) {
    lines.push("    <meta name=\"linkedin:title\" content=\"" + escapeHtml(title) + "\">");
    lines.push("    <meta name=\"linkedin:description\" content=\"" + escapeHtml(social.linkedin) + "\">");
  }
  if (meta.keywords && meta.keywords.length) {
    lines.push("    <meta name=\"keywords\" content=\"" + escapeHtml(meta.keywords.join(", ")) + "\">");
  }

  lines.push(
    "    <title>" + escapeHtml(title) + "</title>",
    "    <!-- Google tag (gtag.js) -->",
    "    <script async src=\"https://www.googletagmanager.com/gtag/js?id=" + googleAnalyticsMeasurementId + "\"></script>",
    "    <script>",
    "      window.dataLayer = window.dataLayer || [];",
    "      function gtag(){dataLayer.push(arguments);}",
    "      gtag('js', new Date());",
    "      gtag('config', '" + googleAnalyticsMeasurementId + "');",
    "    </script>"
  );

  if (route !== "admin" && shouldIncludeVercelAnalytics()) {
    lines.push(
      "    <!-- Vercel Web Analytics -->",
      "    <script defer src=\"/_vercel/insights/script.js\"></script>",
      "    <!-- Vercel Speed Insights -->",
      "    <script defer src=\"/_vercel/speed-insights/script.js\"></script>"
    );
  }

  lines.push(
    "    <script type=\"application/ld+json\">",
    structuredData(route),
    "    </script>"
  );

  return lines.join("\n") + "\n";
}

function applySeo(html, route) {
  var headStart = html.indexOf("  <head>");
  var resourcesStart = html.indexOf("    <link rel=\"icon\"");
  if (headStart < 0 || resourcesStart < 0 || resourcesStart <= headStart) {
    throw new Error("Could not locate SEO head block for route " + route);
  }
  return html.slice(0, headStart) + seoHead(route) + html.slice(resourcesStart);
}

function sitemapXml() {
  var urls = Object.keys(routeSeo)
    .map(function (route) {
      return routeSeo[route];
    })
    .filter(function (meta) {
      return meta.includeInSitemap && !/noindex/i.test(meta.robots || "");
    })
    .map(function (meta) {
      return [
        "  <url>",
        "    <loc>" + absoluteUrl(meta.canonicalPath || meta.path) + "</loc>",
        "    <lastmod>" + lastmod + "</lastmod>",
        "  </url>"
      ].join("\n");
    })
    .join("\n");

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    urls,
    "</urlset>",
    ""
  ].join("\n");
}

function robotsTxt() {
  return [
    "# Smart Tech LLC robots.txt",
    "# " + siteUrl + "/",
    "",
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api/",
    "",
    "User-agent: Yandex",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api/",
    "",
    "# Preferred mirror for Yandex Webmaster",
    "Host: smarttechllc.am",
    "",
    "# Ignore duplicate URL parameters on detail pages",
    "Clean-param: id /service /project /member",
    "",
    "Sitemap: " + siteUrl + "/sitemap.xml",
    ""
  ].join("\n");
}

module.exports = {
  siteUrl,
  routeSeo,
  applySeo,
  sitemapXml,
  robotsTxt
};
