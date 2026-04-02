import { Request, Response } from 'express';
import { SuccessResponses } from '../../../utils/responses';
import { ICommentRequestBody, IUpdateCommentRequestBody } from './types';
import { ICommentService } from './service';

export default class CommentController {
  _service: ICommentService;

  constructor(service: ICommentService) {
    this._service = service;
  }

  createComment = async (req: Request, res: Response) => {
    const body = req.body as ICommentRequestBody;
    const comment = await this._service.createComment(body);
    return SuccessResponses(req, res, comment, {
      statusCode: 201,
    });
  };

  getComments = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.user?.id as string;
    const comments = await this._service.find(req.query, userId);
    return SuccessResponses(req, res, comments, {
      statusCode: 200,
    });
  };

  getCommentById = async (req: Request, res: Response) => {
    const { commentId } = req.params as { commentId: string };
    const userId = (req as any).auth?.user?.id as string;
    const comment = await this._service.findCommentById(commentId, userId);
    return SuccessResponses(req, res, comment, {
      statusCode: 200,
    });
  };

  updateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params as { commentId: string };
    const body = req.body as IUpdateCommentRequestBody;
    const result = await this._service.updateComment({ id: commentId }, body);
    return SuccessResponses(req, res, result, {
      statusCode: 200,
    });
  };

  deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params as { commentId: string };
    await this._service.deleteComment(commentId);
    return SuccessResponses(req, res, { message: 'Comment deleted successfully' }, {
      statusCode: 200,
    });
  };
}
