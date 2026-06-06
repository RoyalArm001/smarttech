const siteUrl = "https://smarttechllc.am";
const siteName = "Smart Tech";
const defaultImage = siteUrl + "/img/smart-tech.png";
const imageAlt = "Smart Tech անվտանգության, էլեկտրամոնտաժման և խելացի համակարգերի լուծումներ";
const lastmod = "2026-06-01";
const googleAnalyticsMeasurementId = "G-1SC80R2NZE";
const yandexVerificationCode = "f75d8ae54fe216ec";

const organization = {
  "@type": ["Organization", "LocalBusiness"],
  "@id": siteUrl + "/#organization",
  name: siteName,
  legalName: "Smart Tech LLC",
  url: siteUrl + "/",
  logo: defaultImage,
  image: defaultImage,
  email: "info@smarttechllc.am",
  telephone: ["+37477424643", "+37496424643"],
  foundingDate: "2012",
  address: {
    "@type": "PostalAddress",
    streetAddress: "10 Vazgen Sargsyan St",
    addressLocality: "Yerevan",
    addressCountry: "AM"
  },
  areaServed: {
    "@type": "Country",
    name: "Armenia"
  },
  sameAs: [
    "https://www.facebook.com/share/1CYQCeM7jd",
    "https://www.instagram.com/smart_tech_armenia",
    "https://www.tiktok.com/@best_systems"
  ]
};

const services = [
  "Տեսահսկման համակարգեր",
  "Հրդեհային ազդարարման համակարգեր",
  "Մուտքի վերահսկում և անվտանգություն",
  "Ցանցերի տեղադրում և Wi-Fi ծածկույթ",
  "Էլեկտրամոնտաժային աշխատանքներ",
  "Շենքերի ավտոմատացում և BMS"
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
  }
];

const routeSeo = {
  index: {
    path: "/",
    canonicalPath: "/",
    title: "Smart Tech | Անվտանգության և խելացի համակարգերի լուծումներ",
    description: "Smart Tech-ը նախագծում, տեղադրում և սպասարկում է տեսահսկման, հրդեհային ազդարարման, մուտքի վերահսկման, ցանցային, էլեկտրամոնտաժման և ավտոմատացման համակարգեր բիզնեսի համար։",
    pageName: "Անվտանգության և խելացի համակարգերի լուծումներ",
    robots: "index, follow",
    schemaType: "WebPage",
    includeInSitemap: true
  },
  home: {
    path: "/home",
    canonicalPath: "/",
    title: "Smart Tech | Անվտանգության և խելացի համակարգերի լուծումներ",
    description: "Smart Tech-ը նախագծում, տեղադրում և սպասարկում է անվտանգային, էլեկտրական և ավտոմատացման համակարգեր բիզնեսի ու արդյունաբերական օբյեկտների համար։",
    pageName: "Գլխավոր",
    robots: "index, follow",
    schemaType: "WebPage",
    includeInSitemap: false
  },
  services: {
    path: "/services",
    canonicalPath: "/services",
    title: "Ծառայություններ | Smart Tech",
    description: "Տեսահսկում, հրդեհային ազդարարում, մուտքի վերահսկում, ցանցեր, էլեկտրամոնտաժ և շենքերի ավտոմատացում՝ նախագծումից մինչև տեղադրում ու սպասարկում։",
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
    title: "Մեր մասին | Smart Tech",
    description: "Smart Tech-ը 2012-ից մասնագիտացած է անվտանգության, շենքերի ավտոմատացման, էլեկտրամոնտաժման և ինժեներական համակարգերի նախագծման ու ներդրման ոլորտում։",
    pageName: "Մեր մասին",
    robots: "index, follow",
    schemaType: "AboutPage",
    includeInSitemap: true
  },
  licenses: {
    path: "/licenses",
    canonicalPath: "/about",
    title: "Լիցենզիաներ և որակ | Smart Tech",
    description: "Smart Tech-ի լիցենզիաներն ու որակի մոտեցումը հաստատում են ինժեներական համակարգերի նախագծման, տեղադրման և սպասարկման մասնագիտական պատրաստվածությունը։",
    pageName: "Լիցենզիաներ և որակ",
    robots: "index, follow",
    schemaType: "AboutPage",
    includeInSitemap: false
  },
  contact: {
    path: "/contact",
    canonicalPath: "/contact",
    title: "Կապ | Smart Tech",
    description: "Կապվեք Smart Tech-ի հետ՝ անվտանգության, տեսահսկման, էլեկտրամոնտաժման, ցանցային կամ ավտոմատացման համակարգերի խորհրդատվության և առաջարկի համար։",
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
  }
};

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

function faqPage(url) {
  return {
    "@type": "FAQPage",
    "@id": url + "#faq",
    mainEntity: faqItems.map(function (item) {
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

function structuredData(route) {
  var meta = getRouteSeo(route);
  var canonical = absoluteUrl(meta.canonicalPath || meta.path);
  var graph = [
    organization,
    {
      "@type": "WebSite",
      "@id": siteUrl + "/#website",
      url: siteUrl + "/",
      name: siteName,
      inLanguage: "hy",
      publisher: { "@id": organization["@id"] }
    },
    {
      "@type": meta.schemaType || "WebPage",
      "@id": canonical + "#webpage",
      url: canonical,
      name: meta.pageName || meta.title,
      headline: meta.title,
      description: meta.description,
      inLanguage: "hy",
      isPartOf: { "@id": siteUrl + "/#website" },
      publisher: { "@id": organization["@id"] },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: defaultImage,
        caption: imageAlt
      },
      dateModified: lastmod
    }
  ];

  if (meta.path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": canonical + "#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Գլխավոր",
          item: siteUrl + "/"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: meta.pageName || meta.title,
          item: canonical
        }
      ]
    });
  }

  if (route === "services") {
    graph.push(serviceItemList(canonical));
  }

  if (route === "faq") {
    graph.push(faqPage(canonical));
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph
  }, null, 2).replace(/</g, "\\u003c");
}

function seoHead(route) {
  var meta = getRouteSeo(route);
  var canonical = absoluteUrl(meta.canonicalPath || meta.path);
  var currentUrl = canonical;
  var title = meta.title;
  var description = meta.description;
  var robots = meta.robots || "index, follow";
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
    "    <meta property=\"og:type\" content=\"website\">",
    "    <meta property=\"og:locale\" content=\"hy_AM\">",
    "    <meta property=\"og:site_name\" content=\"" + siteName + "\">",
    "    <meta property=\"og:title\" content=\"" + escapeHtml(title) + "\">",
    "    <meta property=\"og:description\" content=\"" + escapeHtml(description) + "\">",
    "    <meta property=\"og:url\" content=\"" + escapeHtml(currentUrl) + "\">",
    "    <meta property=\"og:image\" content=\"" + defaultImage + "\">",
    "    <meta property=\"og:image:secure_url\" content=\"" + defaultImage + "\">",
    "    <meta property=\"og:image:alt\" content=\"" + escapeHtml(imageAlt) + "\">",
    "    <meta name=\"twitter:card\" content=\"summary_large_image\">",
    "    <meta name=\"twitter:title\" content=\"" + escapeHtml(title) + "\">",
    "    <meta name=\"twitter:description\" content=\"" + escapeHtml(description) + "\">",
    "    <meta name=\"twitter:image\" content=\"" + defaultImage + "\">",
    "    <meta name=\"twitter:image:alt\" content=\"" + escapeHtml(imageAlt) + "\">",
    "    <title>" + escapeHtml(title) + "</title>",
    "    <!-- Google tag (gtag.js) -->",
    "    <script async src=\"https://www.googletagmanager.com/gtag/js?id=" + googleAnalyticsMeasurementId + "\"></script>",
    "    <script>",
    "      window.dataLayer = window.dataLayer || [];",
    "      function gtag(){dataLayer.push(arguments);}",
    "      gtag('js', new Date());",
    "      gtag('config', '" + googleAnalyticsMeasurementId + "');",
    "    </script>"
  ];

  if (route !== "admin") {
    lines.push(
      "    <!-- Vercel Web Analytics (active on Vercel deploy only) -->",
      "    <script defer src=\"/_vercel/insights/script.js\"></script>"
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
