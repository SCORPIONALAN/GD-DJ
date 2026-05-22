import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// ─── Público ──────────────────────────────────────────────────────────────────

export const getAvailability = async (req, res) => {
  try {
    const { serviceId, month, year } = req.query;
    const from = new Date(Number(year), Number(month) - 1, 1);
    const to   = new Date(Number(year), Number(month), 0, 23, 59, 59);

    const bookings = await Booking.find({
      service: serviceId,
      date:    { $gte: from, $lte: to },
      status:  { $in: ['pending', 'confirmed'] },
    }).select('date time');

    res.json(bookings);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createPublic = async (req, res) => {
  try {
    const { serviceId, date, time, client, notes } = req.body;

    const service = await Service.findOne({ _id: serviceId, isActive: true });
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

    const booking = await Booking.create({
      client,
      service: serviceId,
      date,
      time,
      notes,
      price: service.price,
    });

    res.status(201).json(booking);
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
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to)   filter.date.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('service', 'name price')
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getOne = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('service');
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json(booking);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });

    if (status)        booking.status        = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    await booking.save();

    res.json(booking);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json({ message: 'Reserva eliminada' });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
