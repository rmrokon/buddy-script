export enum EPostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface IUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
}

export interface IPost {
  id: string;
  content: string;
  image?: string;
  visibility: EPostVisibility;
  userId: string;
  user: IUser;
  reactionsCount: number;
  commentsCount: number;    // Total count of ALL comments + replies (for display)
  rootCommentsCount: number; // Count of only top-level (root) comments
  currentUserReaction?: string;
  createdAt: string;
  updatedAt: string;
  comments?: IPreviewComment[]; // Latest root comment provided by backend
}

// Lightweight preview comment included in post list response
export interface IPreviewComment {
  id: string;
  postId: string;
  userId: string;
  parentCommentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  reactionsCount?: number;
  repliesCount?: number;
  currentUserReaction?: string;
}

export interface ICreatePostRequest {
  content?: string;
  visibility: EPostVisibility;
  image?: File | string;
}

export interface IPostsResponse {
  result: {
    nodes: IPost[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
