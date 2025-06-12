import Blog from '../models/blog.model';
import AppError from '../utils/app-error.util';
import catchAsync from '../utils/catch-async.util';

export const createBlog = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;

  if (!title?.trim() || !content?.trim()) {
    return next(new AppError('Title and content are required', 400));
  }

  const blog = await Blog.create({
    title: title?.trim(),
    content: content?.trim(),
    author: req.user!._id,
  });

  await blog.populate('author', 'firstName lastName');

  res.status(201).json({
    success: true,
    message: 'Blog post created successfully',
    data: blog,
  });
});

export const getBlogs = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort?.toString() || '-createdAt';

  const blogs = await Blog.find().skip(skip).limit(limit).sort(sort).populate('author', 'firstName lastName');
  const total = await Blog.countDocuments();

  res.status(200).json({
    success: true,
    results: blogs.length,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    data: blogs,
  });
});

export const getBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id)
    .populate({
      path: 'author',
      select: 'firstName lastName',
    })
    .populate({
      path: 'comments',
      select: 'content createdAt updatedAt',
      populate: {
        path: 'author',
        select: 'firstName lastName',
      },
    });

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  res.status(200).json({
    success: true,
    data: blog,
  });
});

export const updateBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title?.trim() && !content?.trim()) {
    return next(new AppError('Please provide title or content or both', 400));
  }

  const blog = await Blog.findById(id).populate('author', 'firstName lastName');

  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }

  if (!blog.author._id.equals(req.user!._id)) {
    return next(new AppError('You are not authorized to update this blog', 403));
  }

  if (title) blog.title = title?.trim();
  if (content) blog.content = content?.trim();

  await blog.save();

  res.status(200).json({
    success: true,
    message: 'Blog updated successfully',
    data: blog,
  });
});

export const deleteBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id).populate('author');

  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }

  if (!blog.author._id.equals(req.user!._id)) {
    return next(new AppError('You are not authorized to delete this blog', 403));
  }

  await blog.deleteOne();

  res.status(204).json({
    success: true,
    message: 'Blog deleted successfully',
  });
});
