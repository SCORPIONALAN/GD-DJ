import Faq from '../models/Faq.js';

// ─── Público ──────────────────────────────────────────────────────────────────

export const getActive = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    const faqs = await Faq.find(filter).select('-isActive').sort({ category: 1, order: 1 });
    res.json(faqs);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAll = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ category: 1, order: 1 });
    res.json(faqs);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const create = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(faq);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ message: 'FAQ no encontrada' });
    res.json(faq);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ no encontrada' });
    res.json({ message: 'FAQ eliminada' });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
