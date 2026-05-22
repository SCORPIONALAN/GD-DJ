import Config from '../models/Config.js';

// ─── Público ──────────────────────────────────────────────────────────────────

export const getPublicConfig = async (req, res) => {
  try {
    const configs = await Config.find({ isPublic: true });
    const result  = Object.fromEntries(configs.map((c) => [c.key, c.value]));
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.group) filter.group = req.query.group;
    const configs = await Config.find(filter).sort({ group: 1, key: 1 });
    res.json(configs);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crea o actualiza por key (upsert)
export const upsert = async (req, res) => {
  try {
    const { key, value, group, isPublic } = req.body;
    const config = await Config.findOneAndUpdate(
      { key: key.toUpperCase() },
      { value, group, isPublic },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    const config = await Config.findOneAndDelete({ key: req.params.key.toUpperCase() });
    if (!config) return res.status(404).json({ message: 'Configuracion no encontrada' });
    res.json({ message: 'Configuracion eliminada' });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
