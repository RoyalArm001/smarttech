const projects = require('./project-seo');
module.exports = function registerProjectSeo(app, getProjects) {
  function missing(response, language) {
    const labels = {
      hy: { title: 'Նախագիծը չի գտնվել', back: 'Նախագծեր' },
      en: { title: 'Project not found', back: 'Projects' },
      ru: { title: 'Проект не найден', back: 'Проекты' }
    };
    const lang = Object.hasOwn(labels, language) ? language : 'hy';
    const copy = labels[lang];
    return response.status(404).set('X-Robots-Tag','noindex').type('html').send('<!doctype html><html lang="' + lang + '"><meta charset="utf-8"><title>' + copy.title + ' | Smart Tech</title><h1>' + copy.title + '</h1><a href="/projects?lang=' + lang + '">' + copy.back + '</a></html>');
  }
  app.get(['/project/:id','/api/project-seo'],async (request,response,next)=>{
    try {
      const id = request.params.id || request.query.id;
      if(!projects.validId(id))return missing(response, request.query.lang);
      const items = await getProjects();
      const project = items.find(item=>item.id===id);
      if(!project)return missing(response, request.query.lang);
      response.set('Cache-Control','public, max-age=0, s-maxage=60').type('html').send(projects.render(project,request.query.lang));
    } catch(error) { next(error); }
  });
  app.get('/project',(request,response,next)=>{
    if(!request.query.id)return next();
    if(!projects.validId(request.query.id))return missing(response, request.query.lang);
    const url = new URL(projects.projectUrl(request.query.id,request.query.lang));
    response.redirect(301,url.pathname+url.search);
  });
  app.get(['/sitemap-projects.xml','/api/project-sitemap'],async (request,response,next)=>{
    try { response.set('Cache-Control','public, max-age=0, s-maxage=60').type('application/xml').send(projects.sitemap(await getProjects())); }
    catch(error) { next(error); }
  });
};
