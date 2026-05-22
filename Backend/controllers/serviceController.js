import Service from '../models/Service.js';
import cloudinary from '../config/cloudinary.js';

// ─── Público ──────────────────────────────────────────────────────────────────

export const getActive = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getOneActive = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, isActive: true });
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
    res.json(service);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteImages = (images) =>
  Promise.all(images.map((img) => cloudinary.uploader.destroy(img.publicId)));

export const getAll = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const create = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.files?.length) {
      data.images = req.files.map((f, i) => ({
        url:      f.path,
        publicId: f.filename,
        isMain:   i === 0,
      }));
    }

    const service = await Service.create(data);
    res.status(201).json(service);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

    if (req.files?.length) {
      if (service.images.length) await deleteImages(service.images);
      req.body.images = req.files.map((f, i) => ({
        url:      f.path,
        publicId: f.filename,
        isMain:   i === 0,
      }));
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

    if (service.images.length) await deleteImages(service.images);
    await service.deleteOne();

    res.json({ message: 'Servicio eliminado' });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
