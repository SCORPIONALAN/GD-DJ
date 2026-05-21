const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const cleanString = (value) =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

const cleanObject = (input) => {
  if (Array.isArray(input)) return input.map(cleanObject);

  if (input !== null && typeof input === 'object') {
    const clean = {};
    for (const key of Object.keys(input)) {
      if (key.startsWith('$')) continue;
      if (BLOCKED_KEYS.has(key)) continue;
      clean[key] = cleanObject(input[key]);
    }
    return clean;
  }

  if (typeof input === 'string') return cleanString(input);

  return input;
};

export const sanitize = (req, res, next) => {
  if (req.body)  req.body  = cleanObject(req.body);
  if (req.query) req.query = cleanObject(req.query);
  next();
};
