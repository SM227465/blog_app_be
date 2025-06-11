import Blog from '../models/blog.model';
import Comment from '../models/comment.model';
import AppError from '../utils/app-error.util';
import catchAsync from '../utils/catch-async.util';

export const createComment = catchAsync(async (req, res, next) => {
  const { content, blogId } = req.body;

  if (!content || !blogId) {
    return next(new AppError('Content and blog ID are required', 400));
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  const comment = await Comment.create({
    content,
    author: req.user!._id,
    blog: blogId,
  });

  await comment.populate('author', 'firstName lastName');

  res.status(200).json({
    success: true,
    data: comment,
  });
});

export const deleteComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  if (!comment.author._id.equals(req.user!._id)) {
    return next(new AppError('You are not authorized to delete this comment', 403));
  }

  await comment.deleteOne();

  res.status(204).json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

export const updateComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return next(new AppError('Please provide updated content', 400));
  }

  const comment = await Comment.findById(id);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  if (!comment.author._id.equals(req.user!._id)) {
    return next(new AppError('You are not authorized to update this comment', 403));
  }

  comment.content = content;
  await comment.save();

  res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    data: comment,
  });
});
