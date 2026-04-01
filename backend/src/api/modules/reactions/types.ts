import { z } from 'zod';
import type {
  ReactionBodyValidationSchema,
} from './validations';
import { Attributes, CreationAttributes } from '@sequelize/core';
import Reaction from './model';

export enum EReactableType {
  POST = 'post',
  COMMENT = 'comment',
}

export enum EReactionType {
  LIKE = 'like',
  LOVE = 'love',
  HAHA = 'haha',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
}

export interface IReaction extends Attributes<Reaction> { }
export type ICreateReaction = CreationAttributes<Reaction>;
export type IReactionRequestBody = z.infer<typeof ReactionBodyValidationSchema>;
