import Sale from '../models/Sale.js';

export const getStats = async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = { status: 'paid' };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to)   match.createdAt.$lte = new Date(to);
    }

    const [result] = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id:     null,
          total:   { $sum: '$total' },
          count:   { $sum: 1 },
          average: { $avg: '$total' },
        },
      },
    ]);

    res.json(result ?? { total: 0, count: 0, average: 0 });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAll = async (req, res) => {
  try {
    const { status, from, to, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to)   filter.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [sales, total] = await Promise.all([
      Sale.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Sale.countDocuments(filter),
    ]);

    res.json({ sales, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getOne = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('items.product', 'name');
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json(sale);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json(sale);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
