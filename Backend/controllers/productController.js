import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// ─── Público ──────────────────────────────────────────────────────────────────

export const getActive = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getOneActive = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteImages = (images) =>
  Promise.all(images.map((img) => cloudinary.uploader.destroy(img.publicId)));

export const getAll = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
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

    const product = await Product.create(data);
    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if (req.files?.length) {
      if (product.images.length) await deleteImages(product.images);
      req.body.images = req.files.map((f, i) => ({
        url:      f.path,
        publicId: f.filename,
        isMain:   i === 0,
      }));
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if (product.images.length) await deleteImages(product.images);
    await product.deleteOne();

    res.json({ message: 'Producto eliminado' });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
