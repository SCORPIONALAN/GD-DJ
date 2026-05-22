import Review from '../models/Review.js';

// ─── Público ──────────────────────────────────────────────────────────────────

export const getApproved = async (req, res) => {
  try {
    const filter = { status: 'approved' };
    if (req.query.serviceId) filter.service = req.query.serviceId;
    const reviews = await Review.find(filter)
      .select('-author.email -status')
      .populate('service', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const submit = async (req, res) => {
  try {
    await Review.create(req.body);
    res.status(201).json({ message: 'Resena enviada, sera publicada una vez revisada' });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const reviews = await Review.find(filter)
      .populate('service', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const moderate = async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ message: 'Resena no encontrada' });
    res.json(review);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Resena no encontrada' });
    res.json({ message: 'Resena eliminada' });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
