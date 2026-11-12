'use strict';
// Hosting rules live with Express, independent of any hosting-provider router.
module.exports = function hostingRoutes(storageBase) {
  return function (request, response, next) {
    if (!['GET', 'HEAD'].includes(request.method)) return next();
    const url = new URL(request.originalUrl, 'http://localhost');
    const pathname = url.pathname;
    if (request.hostname.toLowerCase() === 'www.smarttechllc.am') {
      return response.redirect(301, 'https://smarttechllc.am' + pathname + url.search);
    }
    if (pathname === '/src/core/runtime-config.js') response.set('Cache-Control', 'no-store');
    else if (/^\/(?:img\/|src\/assets\/)/.test(pathname)) response.set('Cache-Control', 'public, max-age=31536000, immutable');
    else if (pathname.startsWith('/src/')) response.set('Cache-Control', 'public, max-age=86400');
    const mappings = [
      ['/img/', 'project-images/'],
      ['/src/assets/brand/', 'project-images/brand/'],
      ['/src/assets/team/', 'avatars/team/']
    ];
    for (const [prefix, bucket] of mappings) {
      if (!pathname.startsWith(prefix)) continue;
      let segments;
      try { segments = pathname.slice(prefix.length).split('/').map(decodeURIComponent); }
      catch { return response.status(400).send('Invalid asset path'); }
      if (!segments.length || segments.some(s => !s || s === '.' || s === '..' || /[\\/\x00-\x1f]/.test(s))) return response.status(400).send('Invalid asset path');
      const base = storageBase();
      if (!base) return next();
      return response.redirect(302, base.replace(/\/+$/, '') + '/storage/v1/object/public/' + bucket + segments.map(encodeURIComponent).join('/') + url.search);
    }
    const clean = pathname.replace(/\/+$/, '') || '/';
    if (['/index','/index.html','/pages','/pages/index','/pages/index.html'].includes(clean)) return response.redirect(301, '/home' + url.search);
    if (['/our-jobs','/our-jobs.html','/pages/our-jobs','/pages/our-jobs.html'].includes(clean)) return response.redirect(301, '/projects' + url.search);
    if (clean.startsWith('/pages/')) return response.redirect(301, clean.slice(6).replace(/\.html$/, '') + url.search);
    if (clean.endsWith('.html')) return response.redirect(301, clean.slice(0,-5) + url.search);
    if (clean !== pathname) return response.redirect(301, clean + url.search);
    next();
  };
};
