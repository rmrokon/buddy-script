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
import CommentRepository from './comments/repository';
import CommentService from './comments/service';
import CommentController from './comments/controller';
import Comment from './comments/model';
import ReactionRepository from './reactions/repository';
import ReactionService from './reactions/service';
import ReactionController from './reactions/controller';
import Reaction from './reactions/model';

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

// Comments
export const commentRepository = new CommentRepository(Comment);
export const commentService = new CommentService(commentRepository);
export const commentController = new CommentController(commentService);

// Reactions
export const reactionRepository = new ReactionRepository(Reaction);
export const reactionService = new ReactionService(reactionRepository);
export const reactionController = new ReactionController(reactionService);