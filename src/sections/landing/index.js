(function (site) {
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
    if (!landing) {
      return site.sections.pageHero({
        eyebrow: "Smart Tech",
        title: "Էջը չի գտնվել",
        text: "Հղումը սխալ է կամ էջը հեռացված է։",
        tone: "about"
      });
    }

    var districts = (window.SmartTechSeoDistricts || []).join(", ");
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
        action: "Ստանալ առաջարկ"
      }) +
      '<section class="section seo-landing-section">' +
        '<div class="container seo-landing-grid">' +
          '<article class="seo-geo-block reveal">' +
            '<h2>What is it?</h2>' +
            '<p>' + e(landing.whatIs) + "</p>" +
          "</article>" +
          '<article class="seo-geo-block reveal">' +
            '<h2>Why is it important?</h2>' +
            '<p>' + e(landing.whyImportant) + "</p>" +
          "</article>" +
          '<article class="seo-geo-block reveal">' +
            '<h2>Installation process</h2>' +
            listMarkup(landing.process) +
          "</article>" +
          '<article class="seo-geo-block reveal">' +
            '<h2>Cost factors</h2>' +
            listMarkup(landing.costFactors) +
          "</article>" +
          '<article class="seo-geo-block reveal">' +
            '<h2>Benefits</h2>' +
            listMarkup(landing.benefits) +
          "</article>" +
          '<article class="seo-geo-block seo-geo-local reveal">' +
            '<h2>Service areas in Yerevan</h2>' +
            '<p>Smart Tech LLC serves Yerevan and all of Armenia, including ' + e(districts) + '.</p>' +
            '<p><strong>Keywords:</strong> ' + e((landing.keywords || []).join(", ")) + "</p>" +
          "</article>" +
          '<article class="seo-geo-block seo-geo-faq reveal">' +
            '<h2>FAQ</h2>' +
            '<div class="seo-faq-list">' + faqMarkup(landing.faq) + "</div>" +
          "</article>" +
          '<aside class="seo-landing-cta reveal">' +
            '<h3>Պատրաստ եք սկսելու՞</h3>' +
            '<p>Թողեք հայտ կամ զանգահարեք մեր թիմին՝ չափագրում և գնային առաջարկ ստանալու համար։</p>' +
            '<div class="seo-landing-cta-actions">' +
              '<a class="button button-primary" href="' + e(requestUrl) + '">Պատվիրել հաշվարկ</a>' +
              '<a class="button button-secondary" href="' + e(contactUrl) + '">Կապ</a>' +
              '<a class="button button-secondary" href="https://wa.me/37496424643" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
            "</div>" +
          "</aside>" +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
