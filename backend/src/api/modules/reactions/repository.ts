import { ICreateReaction, IReaction } from './types';
import Reaction from './model';
import DefaultRepository from '../default-repository';
import { BaseRepository } from '../baseRepo';

export default class ReactionRepository extends DefaultRepository<Reaction> implements BaseRepository<IReaction, ICreateReaction> {
  _model;

  constructor(model: typeof Reaction) {
    super();
    this._model = model;
  }
}
