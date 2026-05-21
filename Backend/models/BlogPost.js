import mongoose from 'mongoose';
import slugify from 'slugify';

const blogPostSchema = new mongoose.Schema({
  title: {
    type:      String,
    required:  true,
    maxlength: 200,
    trim:      true,
  },
  slug: {
    type:   String,
    unique: true,
  },
  content: {
    type: String,
  },
  excerpt: {
    type:      String,
    maxlength: 500,
  },
  featuredImage: {
    url:      String,
    publicId: String,
  },
  category: {
    type: String,
    trim: true,
  },
  tags: [String],
  status: {
    type:    String,
    enum:    ['draft', 'published'],
    default: 'draft',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Admin',
  },
  publishedAt: {
    type: Date,
  },
}, { timestamps: true });

blogPostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
