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
