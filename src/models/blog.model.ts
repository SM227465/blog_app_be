import { Document, Schema, model, Types, Query } from 'mongoose';

// Constants
const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 200;
const CONTENT_MIN_LENGTH = 2;
const CONTENT_MAX_LENGTH = 10000;
const SLUG_MAX_LENGTH = 250;

// Blog status enum
export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// Main Blog interface
export interface IBlog extends Document {
  title: string;
  content: string;
  slug: string;
  author: Types.ObjectId;
  status: BlogStatus;
  tags: string[];
  readTime: number; // in minutes
  views: number;
  likes: Types.ObjectId[];
  featuredImage?: string;
  excerpt?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Blog schema
const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      minlength: [TITLE_MIN_LENGTH, `Title should be at least ${TITLE_MIN_LENGTH} characters`],
      maxlength: [TITLE_MAX_LENGTH, `Title should not exceed ${TITLE_MAX_LENGTH} characters`],
      trim: true,
    },

    content: {
      type: String,
      required: [true, 'Blog content is required'],
      minlength: [CONTENT_MIN_LENGTH, `Content should be at least ${CONTENT_MIN_LENGTH} characters`],
      maxlength: [CONTENT_MAX_LENGTH, `Content should not exceed ${CONTENT_MAX_LENGTH} characters`],
    },

    slug: {
      type: String,
      unique: true,
      maxlength: [SLUG_MAX_LENGTH, `Slug should not exceed ${SLUG_MAX_LENGTH} characters`],
      lowercase: true,
      trim: true,
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Blog must have an author'],
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(BlogStatus),
      default: BlogStatus.DRAFT,
      uppercase: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    readTime: {
      type: Number,
      default: 1,
      min: [1, 'Read time must be at least 1 minute'],
    },

    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative'],
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    featuredImage: {
      type: String,
      validate: {
        validator: (value: string) => {
          if (!value) return true;
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value);
        },
        message: 'Featured image must be a valid image URL',
      },
    },

    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt should not exceed 300 characters'],
      trim: true,
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ title: 'text', content: 'text' });

// Generate slug from title
blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() +
      '-' +
      Date.now();
  }
  next();
});

// Calculate read time based on content
blogSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute) || 1;
  }
  next();
});

// Generate excerpt if not provided
blogSchema.pre('save', function (next) {
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';
  }
  next();
});

// Set publishedAt when status changes to PUBLISHED
blogSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === BlogStatus.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtual for comment count
blogSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog',
  count: true,
});

blogSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'blog',
  localField: '_id',
});

// Virtual for like count
blogSchema.virtual('likeCount').get(function (this: IBlog) {
  return this.likes ? this.likes.length : 0;
});

// Populate author info by default
// blogSchema.pre(/^find/, function (next) {
//   const query = this as Query<any, any>;

//   query.populate({
//     path: 'author',
//     select: 'firstName lastName',
//   });

//   next();
// });

const Blog = model<IBlog>('Blog', blogSchema);

export default Blog;
