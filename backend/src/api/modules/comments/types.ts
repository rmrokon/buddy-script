import { z } from 'zod';
import type {
  CommentBodyValidationSchema,
  UpdateCommentBodyValidationSchema
} from './validations';
import { Attributes, CreationAttributes } from '@sequelize/core';
import Comment from './model';

export interface IComment extends Attributes<Comment> { }
export type ICreateComment = CreationAttributes<Comment>;
export type ICommentRequestBody = z.infer<typeof CommentBodyValidationSchema>;
export type IUpdateCommentRequestBody = z.infer<typeof UpdateCommentBodyValidationSchema>;
