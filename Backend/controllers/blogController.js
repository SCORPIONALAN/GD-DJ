import BlogPost from '../models/BlogPost.js';
import cloudinary from '../config/cloudinary.js';

// ─── Público ──────────────────────────────────────────────────────────────────

export const getPublished = async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query;
    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (tag)      filter.tags     = tag;

    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .select('-content')
        .populate('author', 'name')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      BlogPost.countDocuments(filter),
    ]);

    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.json(post);
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
    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      BlogPost.countDocuments(filter),
    ]);

    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const create = async (req, res) => {
  try {
    const data = { ...req.body, author: req.admin._id };

    if (req.file) {
      data.featuredImage = { url: req.file.path, publicId: req.file.filename };
    }

    const post = await BlogPost.create(data);
    res.status(201).json(post);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    if (req.file) {
      if (post.featuredImage?.publicId) {
        await cloudinary.uploader.destroy(post.featuredImage.publicId);
      }
      req.body.featuredImage = { url: req.file.path, publicId: req.file.filename };
    }

    const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    if (post.featuredImage?.publicId) {
      await cloudinary.uploader.destroy(post.featuredImage.publicId);
    }

    await post.deleteOne();
    res.json({ message: 'Post eliminado' });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
