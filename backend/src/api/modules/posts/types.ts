import { z } from 'zod';
import type {
  PostBodyValidationSchema,
} from './validations';
import { Attributes, CreationAttributes } from '@sequelize/core';
import Post from './model';

export interface IPost extends Attributes<Post> { };
export type ICreatePost = CreationAttributes<Post>;
export type IPostRequestBody = z.infer<typeof PostBodyValidationSchema>;
export enum EPostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}


