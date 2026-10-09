'use strict';

const crypto = require('crypto');
const { isConfigured, redis, pipeline } = require('./_redis');

const WISHES_KEY = 'tanloc-hongtu:wishes:v1';

function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json(body);
}

function cleanText(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function storageUnavailable(res) {
  return send(res, 503, {
    ok: false,
    code: 'STORAGE_NOT_CONFIGURED',
    message: 'Sổ lưu bút dùng chung chưa được kết nối cơ sở dữ liệu.'
  });
}

module.exports = async function handler(req, res) {
  if (!isConfigured()) return storageUnavailable(res);

  try {
    if (req.method === 'GET') {
      const rows = await redis(['ZREVRANGE', WISHES_KEY, 0, 99]);
      const wishes = (Array.isArray(rows) ? rows : []).map(row => {
        try { return JSON.parse(row); } catch (_) { return null; }
      }).filter(Boolean);
      return send(res, 200, { ok: true, wishes });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return send(res, 405, { ok: false, message: 'Method not allowed' });
    }

    const name = cleanText(req.body && req.body.name, 80) || 'Khách Quý';
    const text = cleanText(req.body && req.body.text, 500);
    const side = cleanText(req.body && req.body.side, 30) || 'Hai bên';
    const attendance = ['attending', 'remotely'].includes(req.body && req.body.attendance)
      ? req.body.attendance
      : 'attending';

    if (!text) return send(res, 400, { ok: false, message: 'Vui lòng nhập lời chúc.' });

    const forwarded = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'guest');
    const clientKey = crypto.createHash('sha256').update(forwarded.split(',')[0]).digest('hex').slice(0, 20);
    const rateKey = `tanloc-hongtu:wish-rate:${clientKey}`;
    const rateResult = await pipeline([
      ['INCR', rateKey],
      ['EXPIRE', rateKey, 3600, 'NX']
    ]);
    const count = Number(rateResult && rateResult[0] && rateResult[0].result);
    if (count > 8) {
      return send(res, 429, { ok: false, message: 'Bạn đã gửi nhiều lời chúc. Vui lòng thử lại sau.' });
    }

    const now = Date.now();
    const wish = {
      id: crypto.randomUUID(),
      name,
      text,
      side,
      attendance,
      createdAt: new Date(now).toISOString()
    };

    await redis(['ZADD', WISHES_KEY, now, JSON.stringify(wish)]);
    return send(res, 201, { ok: true, wish });
  } catch (error) {
    console.error('Guestbook API error:', error);
    return send(res, 500, { ok: false, message: 'Không thể lưu lời chúc lúc này. Vui lòng thử lại.' });
  }
};
