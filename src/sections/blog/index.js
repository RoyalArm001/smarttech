(function (site) {
  var labels = {
    hy: { blog: "Smart Tech Բլոգ", title: "Հոդվածներ և ուղեցույցներ", description: "Մասնագիտական նյութեր տեսահսկման, անվտանգության, էլեկտրամոնտաժի և խելացի համակարգերի մասին Հայաստանում։", readMore: "Կարդալ ավելին", missing: "Հոդվածը չի գտնվել", back: "Վերադարձեք բլոգի էջ։", quote: "Ստանալ առաջարկ", all: "Բոլոր հոդվածները", faq: "Հաճախ տրվող հարցեր" },
    en: { blog: "Smart Tech Blog", title: "Articles and guides", description: "Professional articles about video surveillance, security, electrical installation and smart systems in Armenia.", readMore: "Read more", missing: "Article not found", back: "Return to the blog.", quote: "Request a quote", all: "All articles", faq: "Frequently asked questions" },
    ru: { blog: "Блог Smart Tech", title: "Статьи и руководства", description: "Профессиональные материалы о видеонаблюдении, безопасности, электромонтаже и умных системах в Армении.", readMore: "Читать далее", missing: "Статья не найдена", back: "Вернитесь в блог.", quote: "Получить предложение", all: "Все статьи", faq: "Часто задаваемые вопросы" }
  };

  function localizedArticle(article) {
    return Object.assign({ title: article.titleHy, description: article.descriptionHy }, article, article.translations && article.translations[site.i18n.language]);
  }

  function blogUrl(slug) {
    return "/blog" + (slug ? "/" + encodeURIComponent(slug) : "") + "?lang=" + site.i18n.language;
  }

  function articles() {
    return window.SmartTechSeoArticles || [];
  }

  site.sections.blogIndex = function blogIndex() {
    var e = site.utils.escapeHtml;
    var text = labels[site.i18n.language] || labels.hy;
    var items = articles().map(function (article) {
      article = localizedArticle(article);
      var url = blogUrl(article.slug);
      return '' +
        '<article class="seo-blog-card reveal">' +
          '<h2><a href="' + e(url) + '">' + e(article.title.split("|")[0].trim()) + "</a></h2>" +
          '<p>' + e(article.description) + "</p>" +
          '<a class="text-link" href="' + e(url) + '">' + e(text.readMore) + '</a>' +
        "</article>";
    }).join("");

    return '' +
      site.sections.pageHero({
        eyebrow: text.blog,
        title: text.title,
        text: text.description,
        tone: "about"
      }) +
      '<section class="section seo-blog-section">' +
        '<div class="container seo-blog-grid">' + items + "</div>" +
      "</section>";
  };

  site.sections.articlePage = function articlePage(slug) {
    var e = site.utils.escapeHtml;
    var text = labels[site.i18n.language] || labels.hy;
    var article = null;
    var list = articles();
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug) {
        article = localizedArticle(list[i]);
        break;
      }
    }

    if (!article) {
      return site.sections.pageHero({
        eyebrow: text.blog,
        title: text.missing,
        text: text.back,
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
        eyebrow: text.blog,
        title: article.title.split("|")[0].trim(),
        text: article.description,
        tone: "about"
      }) +
      '<section class="section seo-article-section">' +
        '<div class="container seo-article-layout">' +
          sections +
          (faq ? '<section class="seo-article-faq reveal"><h2>' + e(text.faq) + '</h2>' + faq + "</section>" : "") +
          '<div class="seo-article-cta reveal">' +
            '<a class="button button-primary" href="' + e(site.utils.pageUrl("request")) + '">' + e(text.quote) + '</a>' +
            '<a class="button button-secondary" href="' + e(blogUrl()) + '">' + e(text.all) + '</a>' +
          "</div>" +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
