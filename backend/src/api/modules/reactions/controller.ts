import { Request, Response } from 'express';
import { SuccessResponses } from '../../../utils/responses';
import { IReactionRequestBody } from './types';
import { IReactionService } from './service';

export default class ReactionController {
  _service: IReactionService;

  constructor(service: IReactionService) {
    this._service = service;
  }

  toggleReaction = async (req: Request, res: Response) => {
    const body = req.body as IReactionRequestBody;
    const reaction = await this._service.toggleReaction(body);
    
    return SuccessResponses(req, res, reaction || { message: 'Reaction removed' }, {
      statusCode: 200,
    });
  };

  getReactions = async (req: Request, res: Response) => {
    const reactions = await this._service.find(req.query);
    return SuccessResponses(req, res, reactions, {
      statusCode: 200,
    });
  };
}
