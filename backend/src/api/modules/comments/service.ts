import { Transaction, Op, Sequelize, sql } from '@sequelize/core';
import { IDataValues } from '../../../utils';
import { IComment, ICommentRequestBody, IUpdateCommentRequestBody } from './types';
import CommentRepository from './repository';
import User from '../users/model';
import Reaction from '../reactions/model';

export interface ICommentService {
  createComment(args: ICommentRequestBody, options?: { t: Transaction }): Promise<IComment>;
  find(query: Record<string, unknown>, currentUserId: string, options?: { t: Transaction }): Promise<any>;
  findCommentById(id: string, currentUserId: string, options?: { t: Transaction }): Promise<any>;
  updateComment(
    query: Partial<ICommentRequestBody> & { id: string },
    body: Partial<IUpdateCommentRequestBody>,
    options?: { t: Transaction },
  ): Promise<IDataValues<IComment>>;
  deleteComment(id: string, options?: { t: Transaction }): Promise<any>;
}

export default class CommentService implements ICommentService {
  _repo: CommentRepository;

  constructor(repo: CommentRepository) {
    this._repo = repo;
  }

  convertToJson(data: IDataValues<IComment>) {
    if (!data) return null;
    return {
      ...data?.dataValues,
    };
  }

  async createComment(body: ICommentRequestBody, options?: { t: Transaction }) {
    const comment = await this._repo.create(body, options);
    return this.convertToJson(comment as IDataValues<IComment>)!;
  }

  async find(query: Record<string, unknown>, currentUserId: string, options?: { t: Transaction }) {
    const { page, limit, parentCommentId, ...otherQuery } = query;
    const finalParentCommentId = parentCommentId || null;

    const baseWhere = {
      ...otherQuery,
      parentCommentId: finalParentCommentId,
    };

    const limitVal = limit ? +limit : (finalParentCommentId ? 5 : 10);

    const comments = await this._repo.findWithPagination({
      ...baseWhere,
      limit: limitVal.toString(),
      page: (page as string) || '1',
    }, {
      order: [['createdAt', finalParentCommentId ? 'ASC' : 'DESC']],
      attributes: {
        include: [
          [
            sql`(
              SELECT COUNT(*)
              FROM comments AS c
              WHERE
                c.parent_comment_id = "Comment"."id"
                AND c.deleted_at IS NULL
            )`,
            'repliesCount'
          ],
          [
            sql`(
              SELECT COUNT(*)
              FROM reactions AS r
              WHERE
                r.reactable_type = 'comment'
                AND r.reactable_id = "Comment"."id"
            )`,
            'reactionsCount'
          ]
        ]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: Reaction,
          as: 'reactions',
          required: false,
          where: { userId: currentUserId, reactableType: 'comment' },
        }
      ],
      ...options,
    });

    const result: any = comments;
    if (result && result.nodes) {
      result.nodes = result.nodes.map((comment: any) => {
        const commentJson = comment.toJSON ? comment.toJSON() : comment;
        commentJson.currentUserReaction = commentJson.reactions && commentJson.reactions.length > 0 ? commentJson.reactions[0] : null;
        delete commentJson.reactions;
        return commentJson;
      });
    }

    return comments;
  }

  async findCommentById(id: string, currentUserId: string, options?: { t: Transaction }) {
    const comment = await this._repo.findOne({ id }, {
      attributes: {
        include: [
          [
            sql`(
              SELECT COUNT(*)
              FROM comments AS c
              WHERE
                c.parent_comment_id = "Comment"."id"
                AND c.deleted_at IS NULL
            )`,
            'repliesCount'
          ],
          [
            sql`(
              SELECT COUNT(*)
              FROM reactions AS r
              WHERE
                r.reactable_type = 'comment'
                AND r.reactable_id = "Comment"."id"
            )`,
            'reactionsCount'
          ]
        ]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: Reaction,
          as: 'reactions',
          required: false,
          where: { userId: currentUserId, reactableType: 'comment' },
        }
      ],
      ...options
    });

    if (!comment) return null;
    const commentJson = comment.toJSON ? comment.toJSON() : comment as any;
    commentJson.currentUserReaction = commentJson.reactions && commentJson.reactions.length > 0 ? commentJson.reactions[0] : null;
    delete commentJson.reactions;
    
    return commentJson;
  }

  async updateComment(
    query: Partial<ICommentRequestBody> & { id: string },
    body: Partial<IUpdateCommentRequestBody>,
    options?: { t: Transaction },
  ) {
    const comment = await this._repo.update(query, body, options);
    return comment as IDataValues<IComment>;
  }

  async deleteComment(id: string, options?: { t: Transaction }) {
    const comment = await this._repo.delete({ id }, options);
    return comment;
  }
}
