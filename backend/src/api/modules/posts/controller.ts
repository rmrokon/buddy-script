import { Request, Response } from 'express';
import { SuccessResponses } from '../../../utils/responses';
import { IPostRequestBody } from './types';
import { IPostService } from './service';
import { logger } from '../../../libs';

export default class PostController {
  _service: IPostService;

  constructor(service: IPostService) {
    this._service = service;
  }

  createPost = async (req: Request, res: Response) => {
    const body = req.body as IPostRequestBody;
    console.dir({ auth: req.auth }, { depth: 5 });
    const userId = req.auth.user?.id as string;
    const post = await this._service.createPost({ ...body, userId });
    return SuccessResponses(req, res, post, {
      statusCode: 200,
    });
  };

  getPosts = async (req: Request, res: Response) => {
    const userId = req.auth.user?.id as string;
    const posts = await this._service.find(req.query, userId);
    return SuccessResponses(req, res, posts, {
      statusCode: 200,
    });
  };

  getPostById = async (req: Request, res: Response) => {
    const { postId } = req.params as { postId: string };
    const userId = req.auth.user?.id as string;
    const post = await this._service.findPostById(postId, userId);
    return SuccessResponses(req, res, post, {
      statusCode: 200,
    });
  };

  updatePost = async (req: Request, res: Response) => {
    const { postId } = req.params as { postId: string };
    const userId = req.auth.user?.id as string;
    const result = await this._service.updatePost({ id: postId }, { ...req.body, userId });
    return SuccessResponses(req, res, result, {
      statusCode: 200,
    });
  };
}
