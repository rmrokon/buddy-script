import UserController from './users/controller';
import User from './users/model';
import UserRepository from './users/repository';
import CredentialRepository from './credentials/repository';
import CredentialService from './credentials/service';
import CredentialController from './credentials/controller';
import Credential from './credentials/model';
import UserService from './users/service';
import PostRepository from './posts/repository';
import PostService from './posts/service';
import PostController from './posts/controller';
import Post from './posts/model';

// Credentials
export const credentialRepository = new CredentialRepository(Credential);
export const credentialService = new CredentialService(credentialRepository);
export const credentialController = new CredentialController(credentialService);

// Users
export const userRepository = new UserRepository(User);
export const userService = new UserService(userRepository);
export const userController = new UserController(userService);

// Posts
export const postRepository = new PostRepository(Post);
export const postService = new PostService(postRepository);
export const postController = new PostController(postService);