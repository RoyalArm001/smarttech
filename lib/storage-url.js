'use strict';
// Same public project origin previously used by the hosting asset redirects.
const fallbackOrigin = 'https://aoeqjlvtncxblkhvqmeu.supabase.co';
function storageBase(configured) {
  const url = new URL(configured || fallbackOrigin);
  if (!['http:','https:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid Supabase public origin');
  return url.origin;
}
function publicStorageUrl(configured, bucket, objectPath) {
  if (!objectPath) return '';
  const encoded = String(objectPath).replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
  return storageBase(configured) + '/storage/v1/object/public/' + encodeURIComponent(bucket) + '/' + encoded;
}
module.exports = { storageBase, publicStorageUrl };
