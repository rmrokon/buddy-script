import { ICreateComment, IComment } from './types';
import Comment from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';

export default class CommentRepository extends DefaultRepository<Comment> implements BaseRepository<IComment, ICreateComment> {
  _model;

  constructor(model: typeof Comment) {
    super();
    this._model = model;
  }
}
