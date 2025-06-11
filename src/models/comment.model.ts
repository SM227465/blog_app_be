import { Document, Schema, model, Types } from 'mongoose';

// Constants
const COMMENT_MIN_LENGTH = 1;
const COMMENT_MAX_LENGTH = 1000;

// Main Comment interface
export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  blog: Types.ObjectId;
  likes: Types.ObjectId[];
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Comment schema
const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      minlength: [COMMENT_MIN_LENGTH, `Comment should be at least ${COMMENT_MIN_LENGTH} character`],
      maxlength: [COMMENT_MAX_LENGTH, `Comment should not exceed ${COMMENT_MAX_LENGTH} characters`],
      trim: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must have an author'],
      index: true,
    },

    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'Comment must belong to a blog'],
      index: true,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
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
commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

// Track if comment is edited
commentSchema.pre('save', function (next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

// Virtual for like count
commentSchema.virtual('likeCount').get(function (this: IComment) {
  return this.likes ? this.likes.length : 0;
});

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
