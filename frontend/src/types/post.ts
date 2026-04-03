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
  repliesCount: number;
  currentUserReaction?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePostRequest {
  content: string;
  visibility: EPostVisibility;
  image?: string;
}

export interface IPostsResponse {
  result: {
    data: IPost[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
