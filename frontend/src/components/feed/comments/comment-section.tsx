"use client";

import React, { useState } from "react";
import { IComment } from "@/types/comment";
import { useGetInfiniteComments } from "@/hooks/use-comments";
import { CommentItem } from "./comment-item";
import { CommentInput } from "./comment-input";

export interface CommentSectionProps {
    postId: string;
    parentCommentId?: string | null;
    initialComments?: IComment[];
    totalCount: number;
    isReply?: boolean;
}

export const CommentSection = ({ 
    postId, 
    parentCommentId = null, 
    initialComments = [],
    totalCount,
    isReply = false
}: CommentSectionProps) => {
    const [showFullComments, setShowFullComments] = useState(false);
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useGetInfiniteComments({ 
        postId, 
        parentCommentId, 
        limit: 5 
    });

    // Determine which comments to show
    const infiniteComments = data?.pages.flatMap(page => page.nodes) || [];
    const displayComments = showFullComments ? infiniteComments : initialComments;
    
    // Remaining count for "View X previous comments"
    const remainingCount = totalCount - (showFullComments ? infiniteComments.length : initialComments.length);

    const handleViewMore = () => {
        if (!showFullComments) {
            setShowFullComments(true);
        } else {
            fetchNextPage();
        }
    };

    return (
        <div 
            id={`comment-section-${postId}-${parentCommentId || "top"}`}
            className={`comment-section ${isReply ? "mt-1" : "mt-3 pt-3 border-top"}`}
        >
            {!isReply && totalCount === 0 && (
                <div className="text-center py-2 mb-3 bg-light rounded-3">
                    <p className="mb-0 text-muted small fw-bold">Be the first to comment on this post</p>
                </div>
            )}

            {!isReply && (
                <div className="mb-3 px-4">
                    <CommentInput postId={postId} parentCommentId={null} />
                </div>
            )}

            {remainingCount > 0 && (
                <button 
                    className="btn btn-link btn-sm p-0 text-decoration-none text-primary fw-bold mb-3 ms-4 px-1"
                    style={{ fontSize: "13px" }}
                    onClick={handleViewMore}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? "Loading..." : `View ${remainingCount} ${remainingCount === 1 ? (isReply ? "previous reply" : "previous comment") : (isReply ? "previous replies" : "previous comments")}`}
                </button>
            )}

            <div className="comment-list px-2">
                {displayComments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} isReply={isReply} />
                ))}
            </div>

            {isLoading && showFullComments && infiniteComments.length === 0 && (
                <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};
