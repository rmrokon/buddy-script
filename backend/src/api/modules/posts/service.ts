import { Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils';
import {
  IPost,
  IPostRequestBody,
  EPostVisibility,
} from './types';
import PostRepository from './repository';
import { Op, sql, Sequelize } from '@sequelize/core';
import User from '../users/model';
import Comment from '../comments/model';
import Reaction from '../reactions/model';

export interface IPostService {
  createPost(args: IPostRequestBody & { userId: string }): Promise<IPost>;
  updatePost(
    query: Partial<IPostRequestBody> & { id: string },
    body: Partial<IPostRequestBody & { userId: string }>,
    options?: { t: Transaction },
  ): Promise<IDataValues<IPost>>;
  find(query: Record<string, unknown>, currentUserId: string, options?: { t: Transaction }): Promise<any>;
  findPostById(id: string, currentUserId: string, options?: { t: Transaction }): Promise<any>;
}

export default class PostService implements IPostService {
  _repo: PostRepository;

  constructor(repo: PostRepository) {
    this._repo = repo;
  }

  convertToJson(data: IDataValues<IPost>) {
    if (!data) return null;
    return {
      ...data?.dataValues,
    };
  }

  async createPost(body: IPostRequestBody & { userId: string }, options?: { t: Transaction }) {
    const post = await this._repo.create(body, options);
    return this.convertToJson(post as IDataValues<IPost>)!;
  }

  async find(query: Record<string, unknown>, currentUserId: string, options?: { t: Transaction }) {
    const { page, limit, ...otherQuery } = query;

    const baseWhere = {
      ...otherQuery,
      [Op.or]: [
        { visibility: EPostVisibility.PUBLIC },
        { visibility: EPostVisibility.PRIVATE, userId: currentUserId },
      ],
    };

    const posts = await this._repo.findWithPagination({
      ...baseWhere,
      limit: limit as string,
      page: page as string,
    }, {
      order: [['createdAt', 'DESC']],
      attributes: {
        include: [
          [
            sql`(
              SELECT COUNT(*)
              FROM comments AS c
              WHERE
                c.post_id = "Post"."id"
                AND c.deleted_at IS NULL
            )`,
            'commentsCount'
          ],
          [
            sql`(
              SELECT COUNT(*)
              FROM reactions AS r
              WHERE
                r.reactable_type = 'post'
                AND r.reactable_id = "Post"."id"
            )`,
            'reactionsCount'
          ],
          [
            sql`(
              SELECT r.reaction_type
              FROM reactions AS r
              WHERE
                r.reactable_type = 'post'
                AND r.reactable_id = "Post"."id"
                AND r.user_id = ${currentUserId}
              LIMIT 1
            )`,
            'currentUserReaction'
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
          model: Comment,
          as: 'comments',
          separate: true,
          limit: 1,
          order: [['createdAt', 'DESC']],
          attributes: {
            include: [
              [
                sql`(
                  SELECT COUNT(*)
                  FROM reactions AS r
                  WHERE
                    r.reactable_type = 'comment'
                    AND r.reactable_id = "Comment"."id"
                )`,
                'reactionsCount'
              ],
              [
                sql`(
                  SELECT r.reaction_type
                  FROM reactions AS r
                  WHERE
                    r.reactable_type = 'comment'
                    AND r.reactable_id = "Comment"."id"
                    AND r.user_id = ${currentUserId}
                  LIMIT 1
                )`,
                'currentUserReaction'
              ]
            ]
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName'],
            }
          ]
        },
      ],
      ...options,
    });

    return posts;
  }

  async createPostRaw(body: IPostRequestBody & { userId: string }, options?: { t: Transaction }) {
    const post = await this._repo.create(body, options);
    return post;
  }

  async updatePost(
    query: Partial<IPostRequestBody> & { id: string },
    body: Partial<IPostRequestBody>,
    options?: { t: Transaction },
  ) {
    console.log('here');

    const post = await this._repo.update(query, body, options);
    console.log({ post });

    return post as IDataValues<IPost>;
  }

  async findPostById(id: string, currentUserId: string, options?: { t: Transaction }) {
    const post = await this._repo.findOne({ id }, {
      attributes: {
        include: [
          [
            sql`(
              SELECT COUNT(*)
              FROM comments AS c
              WHERE
                c.post_id = "Post"."id"
                AND c.deleted_at IS NULL
            )`,
            'commentsCount'
          ],
          [
            sql`(
              SELECT COUNT(*)
              FROM reactions AS r
              WHERE
                r.reactable_type = 'post'
                AND r.reactable_id = "Post"."id"
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
          model: Comment,
          as: 'comments',
          separate: true,
          limit: 1,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'content', 'createdAt', 'userId'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName'],
            }
          ]
        },
        {
          model: Reaction,
          as: 'reactions',
          required: false,
          where: { userId: currentUserId, reactableType: 'post' },
        }
      ],
      ...options
    });

    if (!post) return null;

    const postJson = post.toJSON ? post.toJSON() : post as any;
    postJson.currentUserReaction = postJson.reactions && postJson.reactions.length > 0 ? postJson.reactions[0] : null;
    delete postJson.reactions;

    return postJson;
  }

  async findRawPostById(id: string, options?: { t: Transaction }) {
    const post = await this._repo.findOne({ id }, options);
    return post;
  }

  async findPostByRaw(query: Record<string, unknown>, options?: { t: Transaction }) {
    const post = await this._repo.findOne(query, options);
    return post;
  }

  async findPostBy(query: Record<string, unknown>, options?: { t: Transaction }) {
    const posts = await this._repo.find(query, options);
    return posts;
  }
}
