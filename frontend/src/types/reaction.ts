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

export interface IToggleReactionRequest {
  reactableType: EReactableType;
  reactableId: string;
  reactionType: EReactionType;
}

export interface IReactionResponse {
  result: {
    reaction: {
        id: string;
        reactionType: EReactionType;
        userId: string;
        reactableId: string;
        reactableType: EReactableType;
    } | null; // null if reaction was removed
  };
}

export interface IReaction {
  id: string;
  reactionType: EReactionType;
  userId: string;
  reactableId: string;
  reactableType: EReactableType;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IReactionsResponse {
  success: boolean;
  result: {
    nodes: IReaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
