import { Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils';
import { IReaction, IReactionRequestBody } from './types';
import ReactionRepository from './repository';
import User from '../users/model';

export interface IReactionService {
  toggleReaction(body: IReactionRequestBody & { userId: string }, options?: { t: Transaction }): Promise<IReaction | null>;
  find(query: Record<string, unknown>, options?: { t: Transaction }): Promise<any>;
}

export default class ReactionService implements IReactionService {
  _repo: ReactionRepository;

  constructor(repo: ReactionRepository) {
    this._repo = repo;
  }

  convertToJson(data: IDataValues<IReaction> | null) {
    if (!data) return null;
    return {
      ...data.dataValues,
    };
  }

  async toggleReaction(body: IReactionRequestBody & { userId: string }, options?: { t: Transaction }) {
    // Check if reaction exists
    const existingReaction = await this._repo.findOne({
      userId: body.userId,
      reactableType: body.reactableType,
      reactableId: body.reactableId,
    }, options);

    if (existingReaction) {
      if (existingReaction.dataValues.reactionType === body.reactionType) {
        // Same reaction, remove it (toggle off)
        await this._repo.delete({ id: existingReaction.dataValues.id as string }, options);
        return null; // Null indicates it was removed
      } else {
        // Different reaction, update it
        const updated = await this._repo.update(
          { id: existingReaction.dataValues.id as string },
          { reactionType: body.reactionType },
          options
        );
        return updated;
      }
    } else {
      // Create new reaction
      const newReaction = await this._repo.create(body, options);
      return this.convertToJson(newReaction as IDataValues<IReaction>);
    }
  }

  async find(query: Record<string, unknown>, options?: { t: Transaction }) {
    const { page, limit, ...otherQuery } = query;
    const limitVal = limit ? +limit : 10;
    const pageVal = page ? +page : 1;

    const reactions = await this._repo.findWithPagination({
      ...otherQuery,
      limit: limitVal.toString(),
      page: pageVal.toString(),
    }, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        }
      ],
      ...options
    });
    return reactions;
  }
}
