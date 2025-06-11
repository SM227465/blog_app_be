import express from 'express';
import { protect } from '../controllers/auth.controller';
import { createComment, deleteComment, updateComment } from '../controllers/comment.controller';

const router = express.Router();

// router.get('/', getBlogs);

/**
 * @swagger
 * /api/v1/comment:
 *   post:
 *     summary: Create a new comment for a blog post
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - blogId
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Great article! Really helpful."
 *               blogId:
 *                 type: string
 *                 example: "665a1e6eb12b2a084c123456"
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "665f9a13b12b2a084c987777"
 *                     content:
 *                       type: string
 *                       example: "Great article! Really helpful."
 *                     author:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "665a1b9cb12b2a084c987654"
 *                         firstName:
 *                           type: string
 *                           example: "Jane"
 *                         lastName:
 *                           type: string
 *                           example: "Doe"
 *                     blog:
 *                       type: string
 *                       example: "665a1e6eb12b2a084c123456"
 *       400:
 *         description: Missing content or blogId
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
 *                   example: Content and blog ID are required
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

router.post('/', protect, createComment);
// router.get('/:id', getBlog);

/**
 * @swagger
 * /api/v1/comment/{id}:
 *   patch:
 *     summary: Update a comment by ID
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the comment
 *         schema:
 *           type: string
 *           example: "665f9a13b12b2a084c987777"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated comment content goes here."
 *     responses:
 *       200:
 *         description: Comment updated successfully
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
 *                   example: Comment updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "665f9a13b12b2a084c987777"
 *                     content:
 *                       type: string
 *                       example: "Updated comment content goes here."
 *                     blog:
 *                       type: string
 *                       example: "665a1e6eb12b2a084c123456"
 *                     author:
 *                       type: string
 *                       example: "665a1b9cb12b2a084c987654"
 *       400:
 *         description: Content not provided
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
 *                   example: Please provide updated content
 *       403:
 *         description: Unauthorized to update this comment
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
 *                   example: You are not authorized to update this comment
 *       404:
 *         description: Comment not found
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
 *                   example: Comment not found
 */

router.patch('/:id', protect, updateComment);

/**
 * @swagger
 * /api/v1/comment/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the comment to delete
 *         schema:
 *           type: string
 *           example: "665f9a13b12b2a084c987777"
 *     responses:
 *       204:
 *         description: Comment deleted successfully
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
 *                   example: Comment deleted successfully
 *       403:
 *         description: Unauthorized to delete this comment
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
 *                   example: You are not authorized to delete this comment
 *       404:
 *         description: Comment not found
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
 *                   example: Comment not found
 */

router.delete('/:id', protect, deleteComment);

export default router;
