// Accede a valores anidados con notacion de punto: 'client.name' → obj.client.name
const getNestedValue = (obj, path) =>
  path.split('.').reduce((current, key) => current?.[key], obj);

export const r = {
  required: () => (v) => {
    if (v === undefined || v === null || v === '') return 'Este campo es obligatorio';
    // Rechaza objetos planos — ningun campo deberia recibir un objeto despues de sanitizar
    if (!Array.isArray(v) && typeof v === 'object') return 'Este campo es obligatorio';
  },

  email: () => (v) => {
    if (!v || typeof v !== 'string') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Debe ser un email valido';
  },

  mongoId: () => (v) => {
    if (!v) return;
    if (!/^[a-fA-F0-9]{24}$/.test(String(v))) return 'ID invalido';
  },

  minLength: (n) => (v) => {
    if (!v || typeof v !== 'string') return;
    if (v.length < n) return `Minimo ${n} caracteres`;
  },

  maxLength: (n) => (v) => {
    if (!v || typeof v !== 'string') return;
    if (v.length > n) return `Maximo ${n} caracteres`;
  },

  isIn: (values) => (v) => {
    if (!v) return;
    if (!values.includes(v)) return `Debe ser uno de: ${values.join(', ')}`;
  },

  isFloat: (opts = {}) => (v) => {
    if (v === undefined || v === null || v === '') return;
    const num = parseFloat(v);
    if (isNaN(num)) return 'Debe ser un numero decimal';
    if (opts.min !== undefined && num < opts.min) return `El minimo es ${opts.min}`;
    if (opts.max !== undefined && num > opts.max) return `El maximo es ${opts.max}`;
  },

  isInt: (opts = {}) => (v) => {
    if (v === undefined || v === null || v === '') return;
    const num = Number(v);
    if (!Number.isInteger(num)) return 'Debe ser un numero entero';
    if (opts.min !== undefined && num < opts.min) return `El minimo es ${opts.min}`;
    if (opts.max !== undefined && num > opts.max) return `El maximo es ${opts.max}`;
  },

  isDate: () => (v) => {
    if (!v) return;
    if (isNaN(Date.parse(v))) return 'Debe ser una fecha valida';
  },

  isTime: () => (v) => {
    if (!v) return;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) return 'Debe tener formato HH:MM';
  },

  isArray: (opts = {}) => (v) => {
    if (!v) return;
    if (!Array.isArray(v)) return 'Debe ser un arreglo';
    if (opts.min !== undefined && v.length < opts.min) return `Minimo ${opts.min} elemento(s)`;
  },

  matches: (regex) => (v) => {
    if (!v) return;
    if (!regex.test(String(v))) return 'El formato no es valido';
  },
};

// Middleware — recibe un esquema { campo: [regla, regla, ...] }
// Soporta notacion de punto para campos anidados: 'client.name', 'author.email'
export const validate = (schema) => (req, res, next) => {
  const data   = { ...req.params, ...req.query, ...req.body };
  const errors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = field.includes('.') ? getNestedValue(data, field) : data[field];

    for (const rule of rules) {
      const msg = rule(value);
      if (msg) {
        errors[field] = msg;
        break;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ message: 'Error de validacion', errors });
  }

  next();
};
