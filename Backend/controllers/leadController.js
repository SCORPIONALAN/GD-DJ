import Lead from '../models/Lead.js';

// ─── Público ──────────────────────────────────────────────────────────────────

export const submit = async (req, res) => {
  try {
    await Lead.create(req.body);
    res.status(201).json({ message: 'Mensaje recibido, pronto nos pondremos en contacto' });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAll = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Lead.countDocuments(filter),
    ]);

    res.json({ leads, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getOne = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead no encontrado' });
    res.json(lead);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead no encontrado' });

    if (status !== undefined) lead.status = status;
    if (notes  !== undefined) lead.notes  = notes;
    await lead.save();

    res.json(lead);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead no encontrado' });
    res.json({ message: 'Lead eliminado' });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
