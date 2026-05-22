const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

// Busca recursivamente claves peligrosas en cualquier nivel del objeto.
// Si encuentra una, el request se rechaza — no se hace stripping silencioso.
const hasDangerousKey = (input) => {
  if (Array.isArray(input))               return input.some(hasDangerousKey);
  if (input !== null && typeof input === 'object') {
    for (const key of Object.keys(input)) {
      if (key.startsWith('$') || BLOCKED_KEYS.has(key)) return true;
      if (hasDangerousKey(input[key]))                  return true;
    }
  }
  return false;
};

// Elimina markup ejecutable de todos los strings del objeto (XSS).
const cleanXSS = (input) => {
  if (Array.isArray(input)) return input.map(cleanXSS);

  if (input !== null && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([k, v]) => [k, cleanXSS(v)])
    );
  }

  if (typeof input === 'string') {
    return input
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  return input;
};

export const sanitize = (req, res, next) => {
  // Detectar operadores MongoDB o prototype pollution → rechazar de inmediato
  if (hasDangerousKey(req.body) || hasDangerousKey(req.query) || hasDangerousKey(req.params)) {
    return res.status(400).json({ message: 'Solicitud no permitida' });
  }

  // Limpiar XSS de todos los strings en body, query y params
  if (req.body)   req.body   = cleanXSS(req.body);
  if (req.query)  req.query  = cleanXSS(req.query);
  if (req.params) req.params = cleanXSS(req.params);

  next();
};
