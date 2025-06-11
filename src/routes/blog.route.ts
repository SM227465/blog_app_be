import express from 'express';
import { protect } from '../controllers/auth.controller';
import { createBlog, deleteBlog, getBlog, getBlogs, updateBlog } from '../controllers/blog.controller';

const router = express.Router();

/**
 * @swagger
 * /api/v1/blogs:
 *   get:
 *     summary: Get a paginated list of blogs
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of blogs per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort order of blogs (e.g., -createdAt for newest first)
 *     responses:
 *       200:
 *         description: A list of blogs with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665a1e6eb12b2a084c123456"
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *           example: "How to Master TypeScript in 2025"
 *         content:
 *           type: string
 *           minLength: 2
 *           maxLength: 10000
 *           example: "This blog covers everything you need to know about TypeScript..."
 *         slug:
 *           type: string
 *           example: "how-to-master-typescript-in-2025-1717994073521"
 *         author:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "665a1b9cb12b2a084c987654"
 *             firstName:
 *               type: string
 *               example: "John"
 *             lastName:
 *               type: string
 *               example: "Doe"
 *         status:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
 *           example: "PUBLISHED"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["typescript", "webdev", "javascript"]
 *         readTime:
 *           type: integer
 *           example: 5
 *         views:
 *           type: integer
 *           example: 124
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["665a1b9cb12b2a084c987654", "665a1c3eb12b2a084c987655"]
 *         likeCount:
 *           type: integer
 *           example: 2
 *         featuredImage:
 *           type: string
 *           format: uri
 *           example: "https://example.com/images/blog123.jpg"
 *         excerpt:
 *           type: string
 *           maxLength: 300
 *           example: "This blog gives a quick intro to TypeScript with real-world examples..."
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-06-11T12:34:56.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-06-10T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-06-11T10:30:00.000Z"
 *         commentCount:
 *           type: integer
 *           example: 3
 */

router.get('/', getBlogs);

/**
 * @swagger
 * /api/v1/blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Understanding Async/Await in JavaScript"
 *               content:
 *                 type: string
 *                 example: "In this blog, we dive deep into how async/await works under the hood..."
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Blog post created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Missing title or content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Title and content are required
 */

router.post('/', protect, createBlog);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Get a blog post by ID
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the blog post
 *         schema:
 *           type: string
 *           example: "665a1e6eb12b2a084c123456"
 *     responses:
 *       200:
 *         description: Blog post found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Blog'
 *                     - type: object
 *                       properties:
 *                         comments:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "665f8a2e1234a084c9873210"
 *                               content:
 *                                 type: string
 *                                 example: "This was very informative, thanks!"
 *                               author:
 *                                 type: object
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                                     example: "665a1b9cb12b2a084c987654"
 *                                   firstName:
 *                                     type: string
 *                                     example: "Alice"
 *                                   lastName:
 *                                     type: string
 *                                     example: "Smith"
 *       404:
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Blog post not found
 */

router.get('/:id', getBlog);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   patch:
 *     summary: Update a blog post by ID
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the blog post
 *         schema:
 *           type: string
 *           example: "665a1e6eb12b2a084c123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Blog Title"
 *               content:
 *                 type: string
 *                 example: "Updated content for the blog post..."
 *             example:
 *               title: "New Blog Title"
 *               content: "Updated content goes here"
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Blog updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Neither title nor content provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please provide title or content or both
 *       403:
 *         description: Unauthorized to update this blog
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: You are not authorized to update this blog
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Blog not found
 */

router.patch('/:id', protect, updateBlog);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the blog post
 *         schema:
 *           type: string
 *           example: "665a1e6eb12b2a084c123456"
 *     responses:
 *       204:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Blog deleted successfully
 *       403:
 *         description: Unauthorized to delete this blog
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: You are not authorized to delete this blog
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Blog not found
 */

router.delete('/:id', protect, deleteBlog);

export default router;
