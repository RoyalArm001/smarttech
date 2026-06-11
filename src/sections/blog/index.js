(function (site) {
  function articles() {
    return window.SmartTechSeoArticles || [];
  }

  site.sections.blogIndex = function blogIndex() {
    var e = site.utils.escapeHtml;
    var items = articles().map(function (article) {
      var url = "/blog/" + article.slug;
      return '' +
        '<article class="seo-blog-card reveal">' +
          '<h2><a href="' + e(url) + '">' + e(article.titleHy.split("|")[0].trim()) + "</a></h2>" +
          '<p>' + e(article.descriptionHy) + "</p>" +
          '<a class="text-link" href="' + e(url) + '">Կարդալ ավելին</a>' +
        "</article>";
    }).join("");

    return '' +
      site.sections.pageHero({
        eyebrow: "Smart Tech Blog",
        title: "SEO հոդվածներ և ուղեցույցներ",
        text: "Մասնագիտական նյութեր տեսահսկման, անվտանգության, էլեկտրամոնտաժի և խելացի համակարգերի մասին Հայաստանում։",
        tone: "about"
      }) +
      '<section class="section seo-blog-section">' +
        '<div class="container seo-blog-grid">' + items + "</div>" +
      "</section>";
  };

  site.sections.articlePage = function articlePage(slug) {
    var e = site.utils.escapeHtml;
    var article = null;
    var list = articles();
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug) {
        article = list[i];
        break;
      }
    }

    if (!article) {
      return site.sections.pageHero({
        eyebrow: "Blog",
        title: "Հոդվածը չի գտնվել",
        text: "Վերադարձեք բլոգի էջ։",
        tone: "about"
      });
    }

    var sections = (article.sections || []).map(function (section) {
      return '' +
        '<article class="seo-article-block reveal">' +
          '<h2>' + e(section.heading) + "</h2>" +
          '<p>' + e(section.body) + "</p>" +
        "</article>";
    }).join("");

    var faq = (article.faq || []).map(function (item) {
      return '' +
        '<details class="seo-faq-item">' +
          '<summary>' + e(item.question) + "</summary>" +
          '<p>' + e(item.answer) + "</p>" +
        "</details>";
    }).join("");

    return '' +
      site.sections.pageHero({
        eyebrow: "Smart Tech Blog",
        title: article.titleHy.split("|")[0].trim(),
        text: article.excerpt || article.descriptionHy,
        tone: "about"
      }) +
      '<section class="section seo-article-section">' +
        '<div class="container seo-article-layout">' +
          sections +
          (faq ? '<section class="seo-article-faq reveal"><h2>FAQ</h2>' + faq + "</section>" : "") +
          '<div class="seo-article-cta reveal">' +
            '<a class="button button-primary" href="' + e(site.utils.pageUrl("request")) + '">Ստանալ առաջարկ</a>' +
            '<a class="button button-secondary" href="/blog">Բոլոր հոդվածները</a>' +
          "</div>" +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
