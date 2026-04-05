import { Router } from 'express';
import { asyncCatchHandler, isAuthenticated, validateRequestBody } from '../../middlewares';
import { postController, userController } from '../bootstrap';
import { PostBodyValidationSchema } from './validations';
import multer from 'multer';
import { BadRequest } from '../../../utils/errors';

export const PostRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/webp'
    ) {
      cb(null, true);
    } else {
      cb(new BadRequest('Only images are allowed (jpeg, jpg, png, webp)'));
    }
  },
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile operations
 */

/**
 * @swagger
 * /v1/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
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
 *               - image
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *   get:
 *     summary: Retrieve a list of posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts retrieved
 */
PostRouter.route('/')
  .post(
    [
      isAuthenticated,
      upload.single('image'),
      (req: any, _res: any, next: any) => {
        // If a file was uploaded, we set a dummy image value in body so Zod validation passes
        if (req.file && !req.body.image) {
          req.body.image = 'pending_upload';
        }
        next();
      },
      validateRequestBody(PostBodyValidationSchema),
    ],
    asyncCatchHandler(postController.createPost),
  )
  .get([isAuthenticated], asyncCatchHandler(postController.getPosts));

/**
 * @swagger
 * /v1/posts/{postId}:
 *   patch:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *   get:
 *     summary: Retrieve a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 */
PostRouter.route('/:postId')
  .patch([isAuthenticated], asyncCatchHandler(postController.updatePost))
  .get([isAuthenticated], asyncCatchHandler(postController.getPostById));


