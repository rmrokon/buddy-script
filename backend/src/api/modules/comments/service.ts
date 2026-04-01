import { Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils';
import { IComment, ICommentRequestBody, IUpdateCommentRequestBody } from './types';
import CommentRepository from './repository';

export interface ICommentService {
  createComment(args: ICommentRequestBody, options?: { t: Transaction }): Promise<IComment>;
  find(query: Record<string, unknown>, options?: { t: Transaction }): Promise<Partial<IComment>[]>;
  findCommentById(id: string, options?: { t: Transaction }): Promise<IComment | null>;
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

  async find(query: Record<string, unknown>, options?: { t: Transaction }) {
    const comments = await this._repo.find(query, options);
    return comments;
  }

  async findCommentById(id: string, options?: { t: Transaction }) {
    const comment = await this._repo.findById(id, options);
    return this.convertToJson(comment as unknown as IDataValues<IComment>);
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
