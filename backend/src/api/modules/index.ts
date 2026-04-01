import { CredentialRouter } from './credentials';
import { UserRouter } from './users';

export const API = {
  '/credentials': CredentialRouter,
  '/users': UserRouter,
};
