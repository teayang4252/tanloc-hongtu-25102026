'use strict';

const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(process.cwd(), 'index.html');
let cachedTemplate = '';

function escapeAttribute(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getTemplate() {
  if (!cachedTemplate) cachedTemplate = fs.readFileSync(INDEX_PATH, 'utf8');
  return cachedTemplate;
}

module.exports = function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end('Method not allowed');
  }

  const side = String(req.query && req.query.inviteSide) === '1' ? '1' : '2';
  const rawSlug = String((req.query && req.query.inviteSlug) || '').replace(/^\/+|\/+$/g, '');
  if (!rawSlug || rawSlug.includes('/')) return res.status(404).end('Invitation not found');

  const forwardedHost = String(req.headers['x-forwarded-host'] || req.headers.host || 'tanloc-hongtu.vercel.app');
  const host = forwardedHost.split(',')[0].trim();
  const forwardedProto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const protocol = forwardedProto === 'http' ? 'http' : 'https';
  const encodedSlug = encodeURIComponent(rawSlug).replace(/%2D/gi, '-');
  const rawFacebookVersion = String((req.query && req.query.fb) || '').trim();
  const facebookVersion = /^[a-z0-9_-]{1,40}$/i.test(rawFacebookVersion) ? rawFacebookVersion : '';
  const facebookQuery = facebookVersion ? `?fb=${encodeURIComponent(facebookVersion)}` : '';
  const invitationUrl = `${protocol}://${host}/${side}/${encodedSlug}${facebookQuery}`;
  const safeUrl = escapeAttribute(invitationUrl);
  const description = side === '1'
    ? 'Trân trọng kính mời Quý khách đến chung vui cùng gia đình Nhà Gái vào ngày 24.10.2026 tại Nhà hàng Quang Long.'
    : 'Trân trọng kính mời Quý khách đến chung vui cùng gia đình Nhà Trai vào ngày 25.10.2026.';
  const safeDescription = escapeAttribute(description);

  const dynamicMeta = [
    `<link rel="canonical" href="${safeUrl}">`,
    `<meta property="og:url" content="${safeUrl}">`
  ].join('\n  ');

  const html = getTemplate()
    .replace('<!-- DYNAMIC_SOCIAL_META -->', dynamicMeta)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${safeDescription}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${safeDescription}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${safeDescription}">`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  if (req.method === 'HEAD') return res.status(200).end();
  return res.status(200).send(html);
};
