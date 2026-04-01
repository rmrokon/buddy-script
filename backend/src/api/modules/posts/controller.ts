import { Request, Response } from 'express';
import { SuccessResponses } from '../../../utils/responses';
import { IPostRequestBody } from './types';
import { IPostService } from './service';

export default class PostController {
  _service: IPostService;

  constructor(service: IPostService) {
    this._service = service;
  }

  createPost = async (req: Request, res: Response) => {
    const body = req.body as IPostRequestBody;
    const post = await this._service.createPost(body);
    return SuccessResponses(req, res, post, {
      statusCode: 200,
    });
  };

  getPosts = async (req: Request, res: Response) => {
    const users = await this._service.find(req.query);
    return SuccessResponses(req, res, users, {
      statusCode: 200,
    });
  };

  getPostById = async (req: Request, res: Response) => {
    const { postId } = req.params as { postId: string };
    const post = await this._service.findPostById(postId);
    return SuccessResponses(req, res, post, {
      statusCode: 200,
    });
  };

  updatePost = async (req: Request, res: Response) => {
    const { postId } = req.params as { postId: string };
    const result = await this._service.updatePost({ id: postId }, req.body);
    return SuccessResponses(req, res, result, {
      statusCode: 200,
    });
  };
}
