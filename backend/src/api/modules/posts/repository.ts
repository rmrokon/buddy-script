import { ICreatePost, IPost } from './types';
import Post from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';

export default class PostRepository extends DefaultRepository<Post> implements BaseRepository<IPost, ICreatePost> {
  _model;

  constructor(model: typeof Post) {
    super();
    this._model = model;
  }
}
