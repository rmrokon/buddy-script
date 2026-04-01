import { CredentialRouter } from './credentials';
import { UserRouter } from './users';
import { CommentRouter } from './comments';
import { ReactionRouter } from './reactions';
import { PostRouter } from './posts';

export const API = {
  '/credentials': CredentialRouter,
  '/users': UserRouter,
  '/posts': PostRouter,
  '/comments': CommentRouter,
  '/reactions': ReactionRouter,
};
