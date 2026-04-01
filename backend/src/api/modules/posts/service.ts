import { Transaction } from '@sequelize/core';
import { IDataValues } from '../../../utils';
import {
  IPost,
  IPostRequestBody,
} from './types';
import PostRepository from './repository';

export interface IPostService {
  createPost(args: IPostRequestBody): Promise<IPost>;
  updatePost(
    query: Partial<IPostRequestBody> & { id: string },
    body: Partial<IPostRequestBody>,
    options?: { t: Transaction },
  ): Promise<IDataValues<IPost>>;
  find(query: Record<string, unknown>, options?: { t: Transaction }): Promise<Partial<IPost>[]>;
  findPostById(id: string, options?: { t: Transaction }): Promise<IPost | null>;
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

  async createPost(body: IPostRequestBody, options?: { t: Transaction }) {
    const post = await this._repo.create(body, options);
    return this.convertToJson(post as IDataValues<IPost>)!;
  }

  async find(query: Record<string, unknown>, options?: { t: Transaction }) {
    const users = await this._repo.find(query, options);
    return users;
  }

  async createPostRaw(body: IPostRequestBody, options?: { t: Transaction }) {
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

  async findPostById(id: string, options?: { t: Transaction }) {
    const post = await this._repo.findById(id, options);
    return this.convertToJson(post as unknown as IDataValues<IPost>);
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
