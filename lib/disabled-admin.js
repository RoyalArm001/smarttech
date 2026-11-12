'use strict';
module.exports = function disabledAdmin(request, response, next) {
  let pathname;
  try { pathname = decodeURIComponent(request.path).replace(/\\/g, '/').replace(/\/{2,}/g, '/'); }
  catch { return response.status(400).json({ error: 'Invalid path' }); }
  if (/^\/(?:api\/)?admin(?:\/|\.|$)/i.test(pathname)) {
    return response.status(404).set('Cache-Control', 'no-store').json({ error: 'Not found' });
  }
  next();
};
