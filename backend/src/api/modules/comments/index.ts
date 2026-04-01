import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { commentController } from '../bootstrap';
import { CommentBodyValidationSchema, UpdateCommentBodyValidationSchema } from './validations';

export const CommentRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment creation and management for posts
 */

/**
 * @swagger
 * /v1/comments:
 *   post:
 *     summary: Create a new comment or reply
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - userId
 *               - content
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *               parentCommentId:
 *                 type: string
 *                 nullable: true
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *   get:
 *     summary: Retrieve a list of comments
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: Filter comments by post ID
 *       - in: query
 *         name: parentCommentId
 *         schema:
 *           type: string
 *         description: Filter replies by parent comment ID
 *     responses:
 *       200:
 *         description: List of comments retrieved
 */
CommentRouter.route('/')
  .post([isAuthenticated, validateRequestBody(CommentBodyValidationSchema)], asyncCatchHandler(commentController.createComment))
  .get([isAuthenticated], asyncCatchHandler(commentController.getComments));

/**
 * @swagger
 * /v1/comments/{commentId}:
 *   patch:
 *     summary: Update an existing comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *   get:
 *     summary: Retrieve a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
CommentRouter.route('/:commentId')
  .patch([isAuthenticated, validateRequestBody(UpdateCommentBodyValidationSchema)], asyncCatchHandler(commentController.updateComment))
  .get([isAuthenticated], asyncCatchHandler(commentController.getCommentById))
  .delete([isAuthenticated], asyncCatchHandler(commentController.deleteComment));
