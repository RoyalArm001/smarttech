const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const seo = require('./seo-config');
const catalog = require('./project-catalog.json');
const languages = ['hy', 'en', 'ru'];
const root = path.resolve(__dirname, '..');
const validId = id => typeof id === 'string' && /^[a-z0-9][a-z0-9_-]{0,119}$/.test(id);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const language = value => languages.includes(value) ? value : 'hy';
const projectUrl = (id, lang = 'hy') => seo.siteUrl + '/project/' + encodeURIComponent(id) + (language(lang) === 'hy' ? '' : '?lang=' + lang);
const publicFields = ['id','title','works','images','systemImages','translations','status','stage','phase','progress','updated_at','order'];
const publicProject = project => Object.fromEntries(publicFields.filter(key => project[key] !== undefined).map(key => [key, project[key]]));
function imageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try { const url = new URL(value, seo.siteUrl); return /^https?:$/.test(url.protocol) ? url.href : ''; } catch { return ''; }
}
function metadata(project, lang = 'hy') {
  lang = language(lang);
  const translated = project.translations?.[lang] || {};
  const title = translated.title || project.title;
  const works = Array.isArray(translated.works) && translated.works.length ? translated.works : project.works || [];
  const suffix = {hy:'նախագիծ',en:'project',ru:'проект'}[lang];
  const description = (title + ' — Smart Tech. ' + works.join(' · ')).slice(0, 190);
  const url = projectUrl(project.id, lang);
  return {path:new URL(url).pathname + new URL(url).search, title:title + ' | Smart Tech ' + suffix, pageName:title,
    description, language:lang, robots:'index, follow', schemaType:'WebPage', project:true,
    ogImage:imageUrl(project.images?.[0]) || seo.siteUrl+'/img/smart-tech.png', imageAlt:title,
    modified:validDate(project.updated_at), alternates:languages.map(code => ({language:code,url:projectUrl(project.id,code)})),
    extraGraph:[{'@type':'CreativeWork','@id':url+'#project',name:title,url,description,inLanguage:lang,
      creator:{'@id':seo.siteUrl+'/#organization'},image:(project.images||[]).map(imageUrl).filter(Boolean),
      keywords:works,dateModified:validDate(project.updated_at)}]};
}
function validDate(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : undefined; }
const scripts = ['src/core/namespace.js','src/content/locales/index.js','src/content/services/index.js','src/core/i18n.js','src/core/utils.js','src/sections/detail/index.js'].map(file => new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file}));
function markup(project, lang) {
  const context = vm.createContext({window:{location:{protocol:'https:',search:'?lang='+lang},localStorage:{getItem:()=>lang,setItem(){}}},URLSearchParams});
  for (const script of scripts) script.runInContext(context);
  context.window.SmartTech.content.projects = [project];
  return context.window.SmartTech.sections.projectDetail(project.id).replace(/class="([^"]*)"/g, (_, names) => 'class="'+names.replace(/\breveal\b/g,'is-visible')+'"');
}
function render(project, lang) {
  lang = language(lang);
  const safe = publicProject(project);
  let html = seo.applySeo(fs.readFileSync(path.join(root,'lib/page-templates/project.html'),'utf8'),metadata(safe,lang));
  html = html.replace('<html lang="hy">','<html lang="'+lang+'">').replace(/(href|src)=(["'])\.\.\//g,'$1=$2/');
  html = html.replace('<main id="site-main"></main>','<main id="site-main">'+markup(safe,lang)+'</main>');
  return html.replace('</head>','<script type="application/json" id="project-seo-data">'+JSON.stringify(safe).replace(/</g,'\\u003c')+'</script>\n</head>');
}
function directory(html, projects = catalog) {
  const cards = projects.filter(p=>validId(p.id)).map(p=>'<a class="project-card" href="/project/'+escape(p.id)+'">'+(p.images?.[0]?'<img src="'+escape(imageUrl(p.images[0]))+'" alt="'+escape(p.title)+'" loading="lazy">':'')+'<h2>'+escape(p.title)+'</h2><p>'+escape((p.works||[]).join(' · '))+'</p></a>').join('');
  return html.replace('<main id="site-main"></main>','<main id="site-main"><section class="section"><div class="container"><h1>Smart Tech — Նախագծեր</h1><div class="projects-grid">'+cards+'</div></div></section></main>');
}
function sitemapEntries(projects = catalog) {
  return projects.filter(p=>validId(p.id)).flatMap(p=>languages.map(lang=>{
    const modified = validDate(p.updated_at);
    return '  <url><loc>'+escape(projectUrl(p.id,lang))+'</loc>'+(modified?'<lastmod>'+modified+'</lastmod>':'')+
      languages.map(code=>'<xhtml:link rel="alternate" hreflang="'+code+'" href="'+escape(projectUrl(p.id,code))+'"/>').join('')+
      (p.images||[]).map(imageUrl).filter(Boolean).map(url=>'<image:image><image:loc>'+escape(url)+'</image:loc></image:image>').join('')+'</url>';
  })).join('\n');
}
function sitemap(projects = catalog) { return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'+sitemapEntries(projects)+'\n</urlset>\n'; }
module.exports = {catalog,validId,publicProject,projectUrl,metadata,render,directory,sitemap,sitemapEntries};
