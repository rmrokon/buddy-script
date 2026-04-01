import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { reactionController } from '../bootstrap';
import { ReactionBodyValidationSchema } from './validations';

export const ReactionRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Reactions
 *   description: Reactions on posts and comments
 */

/**
 * @swagger
 * /v1/reactions:
 *   post:
 *     summary: Add, update or remove a reaction
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - reactableType
 *               - reactableId
 *               - reactionType
 *             properties:
 *               userId:
 *                 type: string
 *               reactableType:
 *                 type: string
 *                 enum: [post, comment]
 *               reactableId:
 *                 type: string
 *               reactionType:
 *                 type: string
 *                 enum: [like, love, haha, wow, sad, angry]
 *     responses:
 *       200:
 *         description: Reaction toggled successfully
 *   get:
 *     summary: Retrieve a list of reactions
 *     tags: [Reactions]
 *     parameters:
 *       - in: query
 *         name: reactableId
 *         schema:
 *           type: string
 *         description: Filter reactions by post/comment ID
 *       - in: query
 *         name: reactableType
 *         schema:
 *           type: string
 *         description: Filter by reactable type (post/comment)
 *     responses:
 *       200:
 *         description: List of reactions retrieved
 */
ReactionRouter.route('/')
  .post([isAuthenticated, validateRequestBody(ReactionBodyValidationSchema)], asyncCatchHandler(reactionController.toggleReaction))
  .get([isAuthenticated], asyncCatchHandler(reactionController.getReactions));
