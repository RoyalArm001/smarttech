(function (site) {
  var ui = {
    hy: {
      missingTitle: "Էջը չի գտնվել",
      missingText: "Հղումը սխալ է կամ էջը հեռացված է։",
      quote: "Ստանալ առաջարկ",
      whatIs: "Ի՞նչ է համակարգը",
      whyImportant: "Ինչո՞ւ է կարևոր",
      process: "Տեղադրման ընթացքը",
      costFactors: "Գնի վրա ազդող գործոններ",
      benefits: "Առավելությունները",
      areas: "Սպասարկման տարածքները Երևանում",
      areaText: "Smart Tech LLC-ն սպասարկում է Երևանը և ամբողջ Հայաստանը, այդ թվում՝",
      districts: ["Կենտրոն", "Արաբկիր", "Աջափնյակ", "Դավթաշեն", "Շենգավիթ", "Մալաթիա-Սեբաստիա"],
      faq: "Հաճախ տրվող հարցեր",
      ready: "Պատրա՞ստ եք սկսելու",
      cta: "Թողեք հայտ կամ զանգահարեք մեր թիմին՝ չափագրում և գնային առաջարկ ստանալու համար։",
      request: "Պատվիրել հաշվարկ",
      contact: "Կապ"
    },
    en: {
      missingTitle: "Page not found",
      missingText: "The link is incorrect or the page has been removed.",
      quote: "Get a quote",
      whatIs: "What is it?",
      whyImportant: "Why is it important?",
      process: "Installation process",
      costFactors: "Cost factors",
      benefits: "Benefits",
      areas: "Service areas in Yerevan",
      areaText: "Smart Tech LLC serves Yerevan and all of Armenia, including",
      districts: ["Kentron", "Arabkir", "Ajapnyak", "Davtashen", "Shengavit", "Malatia-Sebastia"],
      faq: "Frequently asked questions",
      ready: "Ready to get started?",
      cta: "Submit a request or call our team to arrange a site survey and quotation.",
      request: "Request an estimate",
      contact: "Contact"
    },
    ru: {
      missingTitle: "Страница не найдена",
      missingText: "Ссылка неверна или страница удалена.",
      quote: "Получить предложение",
      whatIs: "Что представляет собой система?",
      whyImportant: "Почему это важно?",
      process: "Процесс установки",
      costFactors: "Что влияет на стоимость",
      benefits: "Преимущества",
      areas: "Районы обслуживания в Ереване",
      areaText: "Smart Tech LLC работает в Ереване и по всей Армении, включая",
      districts: ["Кентрон", "Арабкир", "Ачапняк", "Давташен", "Шенгавит", "Малатия-Себастия"],
      faq: "Часто задаваемые вопросы",
      ready: "Готовы начать?",
      cta: "Оставьте заявку или позвоните нашей команде для обследования объекта и расчёта стоимости.",
      request: "Заказать расчёт",
      contact: "Контакты"
    }
  };

  function getLanding(slug) {
    var list = window.SmartTechSeoLandings || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug) return list[i];
    }
    return null;
  }

  function listMarkup(items) {
    return "<ul>" + items.map(function (item) {
      return "<li>" + site.utils.escapeHtml(item) + "</li>";
    }).join("") + "</ul>";
  }

  function faqMarkup(faq) {
    if (!faq || !faq.length) return "";
    return faq.map(function (item) {
      return '' +
        '<details class="seo-faq-item">' +
          '<summary>' + site.utils.escapeHtml(item.question) + "</summary>" +
          '<p>' + site.utils.escapeHtml(item.answer) + "</p>" +
        "</details>";
    }).join("");
  }

  site.sections.landingPage = function landingPage(slug) {
    var e = site.utils.escapeHtml;
    var landing = getLanding(slug);
    var language = site.i18n.language || "hy";
    var text = ui[language] || ui.hy;
    if (!landing) {
      return site.sections.pageHero({
        eyebrow: "Smart Tech",
        title: text.missingTitle,
        text: text.missingText,
        tone: "about"
      });
    }

    landing = Object.assign({}, landing, (landing.translations || {})[language] || {});
    var districts = text.districts.join(", ");
    var requestUrl = site.utils.pageUrl("request");
    var contactUrl = site.utils.pageUrl("contact");

    return '' +
      site.sections.pageHero({
        eyebrow: landing.eyebrow,
        title: landing.headline,
        text: landing.lead,
        image: landing.heroImage,
        tone: "services",
        href: requestUrl,
        action: text.quote
      }) +
      '<section class="section seo-landing-section">' +
        '<div class="container seo-landing-grid">' +
          '<article class="seo-geo-block reveal">' +
            '<h2>' + e(text.whatIs) + '</h2>' +
            '<p>' + e(landing.whatIs) + "</p>" +
          "</article>" +
          '<article class="seo-geo-block reveal">' +
            '<h2>' + e(text.whyImportant) + '</h2>' +
            '<p>' + e(landing.whyImportant) + "</p>" +
          "</article>" +
          '<article class="seo-geo-block reveal">' +
            '<h2>' + e(text.process) + '</h2>' +
            listMarkup(landing.process) +
          "</article>" +
          '<article class="seo-geo-block reveal">' +
            '<h2>' + e(text.costFactors) + '</h2>' +
            listMarkup(landing.costFactors) +
          "</article>" +
          '<article class="seo-geo-block reveal">' +
            '<h2>' + e(text.benefits) + '</h2>' +
            listMarkup(landing.benefits) +
          "</article>" +
          '<article class="seo-geo-block seo-geo-local reveal">' +
            '<h2>' + e(text.areas) + '</h2>' +
            '<p>' + e(text.areaText) + ' ' + e(districts) + (language === "hy" ? '։' : '.') + '</p>' +
          "</article>" +
          '<article class="seo-geo-block seo-geo-faq reveal">' +
            '<h2>' + e(text.faq) + '</h2>' +
            '<div class="seo-faq-list">' + faqMarkup(landing.faq) + "</div>" +
          "</article>" +
          '<aside class="seo-landing-cta reveal">' +
            '<h3>' + e(text.ready) + '</h3>' +
            '<p>' + e(text.cta) + '</p>' +
            '<div class="seo-landing-cta-actions">' +
              '<a class="button button-primary" href="' + e(requestUrl) + '">' + e(text.request) + '</a>' +
              '<a class="button button-secondary" href="' + e(contactUrl) + '">' + e(text.contact) + '</a>' +
              '<a class="button button-secondary" href="https://wa.me/37496424643" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
            "</div>" +
          "</aside>" +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
