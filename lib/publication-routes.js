const fs = require('node:fs');
const path = require('node:path');
const seo = require('./seo-config');
const articles = require('./seo-articles');
const landings = require('./seo-landings');

module.exports = function registerPublicationRoutes(app) {
  const routes = ['/blog', ...articles.articles.map(article => '/blog/' + article.slug), ...landings.landingPages.map(landing => '/' + landing.slug)];
  app.get(routes, (request, response) => {
    const language = ['en', 'ru'].includes(request.query.lang) ? request.query.lang : 'hy';
    const article = articles.getArticleBySlug(request.path.slice('/blog/'.length), language);
    const landing = landings.getLandingBySlug(request.path.slice(1), language);
    let meta;
    let template;
    if (article) {
      template = 'article';
      meta = articles.buildArticleRouteSeo(article);
    } else if (landing) {
      template = 'landing';
      meta = landings.buildLandingRouteSeo(landing);
    } else {
      template = 'blog';
      const copy = {
        hy: ['Բլոգ', 'Տեսահսկման, անվտանգության, էլեկտրամոնտաժի և խելացի համակարգերի մասին հոդվածներ։'],
        en: ['Blog', 'Articles about video surveillance, security, electrical installation and smart systems.'],
        ru: ['Блог', 'Статьи о видеонаблюдении, безопасности, электромонтаже и умных системах.']
      }[language];
      meta = { ...seo.routeSeo.blog, title: copy[0] + ' | Smart Tech', pageName: copy[0], description: copy[1] };
    }
    meta.language = language;
    meta.canonicalPath = meta.path + (language === 'hy' ? '' : '?lang=' + language);
    meta.alternates = ['hy', 'en', 'ru'].map(lang => ({ language: lang, url: seo.siteUrl + meta.path + (lang === 'hy' ? '' : '?lang=' + lang) }));
    const html = fs.readFileSync(path.resolve(__dirname, 'page-templates', template + '.html'), 'utf8');
    response.type('html').set('Cache-Control', 'no-store').send(seo.applySeo(html, meta).replace('<html lang="hy">', '<html lang="' + language + '">'));
  });
};
