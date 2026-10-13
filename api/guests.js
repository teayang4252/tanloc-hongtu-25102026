'use strict';

const { isConfigured, redis } = require('./_redis');

const GUESTS_KEY = 'tanloc-hongtu:guests:v1';

function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json(body);
}

function cleanText(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function normalizeSlug(value) {
  return cleanText(value, 120)
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase();
}

module.exports = async function handler(req, res) {
  if (!isConfigured()) {
    return send(res, 503, {
      ok: false,
      code: 'STORAGE_NOT_CONFIGURED',
      message: 'Danh sách khách dùng chung chưa được kết nối cơ sở dữ liệu.'
    });
  }

  try {
    if (req.method === 'GET') {
      const slug = normalizeSlug(req.query && req.query.slug);
      if (!slug) return send(res, 400, { ok: false, message: 'Thiếu mã khách mời.' });

      const rawGuest = await redis(['HGET', GUESTS_KEY, slug]);
      if (!rawGuest) return send(res, 404, { ok: false, message: 'Không tìm thấy khách mời.' });

      let guest = null;
      try { guest = JSON.parse(rawGuest); } catch (_) {}
      if (!guest) return send(res, 404, { ok: false, message: 'Dữ liệu khách mời không hợp lệ.' });
      return send(res, 200, { ok: true, guest });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return send(res, 405, { ok: false, message: 'Method not allowed' });
    }

    const slug = normalizeSlug(req.body && req.body.slug);
    const name = cleanText(req.body && req.body.name, 80);
    const requestedSide = cleanText(req.body && req.body.side, 12).toLowerCase();
    const side = ['trai', 'gai'].includes(requestedSide) ? requestedSide : '';

    if (!slug || !/^[a-z0-9\-_%À-ỹ]+$/iu.test(slug)) {
      return send(res, 400, { ok: false, message: 'Đường dẫn khách mời không hợp lệ.' });
    }
    if (!name) return send(res, 400, { ok: false, message: 'Thiếu tên khách mời.' });

    const guest = { slug, name, side, updatedAt: new Date().toISOString() };
    await redis(['HSET', GUESTS_KEY, slug, JSON.stringify(guest)]);
    return send(res, 200, { ok: true, guest });
  } catch (error) {
    console.error('Guest link API error:', error);
    return send(res, 500, { ok: false, message: 'Không thể lưu khách mời lúc này.' });
  }
};
