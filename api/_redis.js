'use strict';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

function isConfigured() {
  return Boolean(REDIS_URL && REDIS_TOKEN);
}

async function redis(command) {
  if (!isConfigured()) {
    const error = new Error('Shared storage is not configured');
    error.code = 'STORAGE_NOT_CONFIGURED';
    throw error;
  }

  const response = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  });

  if (!response.ok) {
    throw new Error(`Storage request failed (${response.status})`);
  }

  const payload = await response.json();
  if (payload.error) throw new Error(payload.error);
  return payload.result;
}

async function pipeline(commands) {
  if (!isConfigured()) {
    const error = new Error('Shared storage is not configured');
    error.code = 'STORAGE_NOT_CONFIGURED';
    throw error;
  }

  const response = await fetch(`${REDIS_URL.replace(/\/$/, '')}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commands)
  });

  if (!response.ok) {
    throw new Error(`Storage pipeline failed (${response.status})`);
  }

  return response.json();
}

module.exports = { isConfigured, redis, pipeline };
