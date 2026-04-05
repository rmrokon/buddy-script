import { EReactionType } from "./reaction";

export interface IComment {
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
    repliesCount: number;
    reactionsCount: number;
    currentUserReaction?: EReactionType;
}

export interface ICommentsResponse {
    nodes: IComment[];
    page_info: {
        total_count: number;
        has_next_page: boolean;
        next_page_cursor?: string;
    };
}
