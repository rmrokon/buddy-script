"use client";

import React, { useState } from "react";
import { IComment } from "@/types/comment";
import { IPreviewComment } from "@/types/post";
import { useGetInfiniteComments } from "@/hooks/use-comments";
import { CommentItem } from "./comment-item";
import { CommentInput } from "./comment-input";

export interface CommentSectionProps {
    postId: string;
    parentCommentId?: string | null;
    /** preview comments passed from the post (e.g. latest 1 root comment) */
    previewComments?: (IComment | IPreviewComment)[];
    /** total count of comments/replies at this level */
    totalCount: number;
    /** when true the section renders as a reply thread (indented, no input at top) */
    isReply?: boolean;
    /** if true, the section starts in expanded state (fetching full list) */
    initiallyExpanded?: boolean;
}

export const CommentSection = ({
    postId,
    parentCommentId = null,
    previewComments = [],
    totalCount,
    isReply = false,
    initiallyExpanded = false,
}: CommentSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useGetInfiniteComments({
        postId,
        parentCommentId,
        limit: 5,
        enabled: isExpanded,
    });

    // When expanded, use fetched data; otherwise show only the preview
    const fetchedComments = data?.pages.flatMap((page) => page.nodes) ?? [];
    const displayComments: (IComment | IPreviewComment)[] = isExpanded ? fetchedComments : previewComments;

    // How many more exist that we haven't shown yet
    const shownCount = isExpanded ? fetchedComments.length : previewComments.length;
    const remainingCount = Math.max(0, totalCount - shownCount);

    const handleViewMore = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        } else {
            fetchNextPage();
        }
    };

    return (
        <div
            id={`comment-section-${postId}-${parentCommentId ?? "root"}`}
            className={`comment-section ${isReply ? "" : "pt-2 border-top"}`}
        >
            {/* Empty state — only for root level */}
            {!isReply && totalCount === 0 && (
                <div className="text-center py-3 text-muted small">
                    <span>💬 Be the first to comment on this post</span>
                </div>
            )}

            {/* Root-level comment input */}
            {!isReply && (
                <div className="px-3 pb-2">
                    <CommentInput postId={postId} parentCommentId={null} />
                </div>
            )}

            {/* "View previous comments" button */}
            {remainingCount > 0 && (
                <button
                    className="btn btn-link btn-sm text-primary text-decoration-none fw-semibold px-3 pb-1"
                    style={{ fontSize: "13px" }}
                    onClick={handleViewMore}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage
                        ? "Loading..."
                        : `View ${remainingCount} ${isReply ? (Number(remainingCount) === 1 ? "previous reply" : "previous replies") : (Number(remainingCount) === 1 ? "previous comment" : "previous comments")}`}
                </button>
            )}

            {/* Loading spinner when expanding for the first time */}
            {isLoading && isExpanded && fetchedComments.length === 0 && (
                <div className="text-center py-2">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* Comment list */}
            <div className="comment-list">
                {displayComments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment as IComment}
                        isReply={isReply}
                    />
                ))}
            </div>

            {/* Load more button (shown when expanded and more pages exist) */}
            {isExpanded && hasNextPage && (
                <button
                    className="btn btn-link btn-sm text-primary text-decoration-none fw-semibold px-3 py-1"
                    style={{ fontSize: "13px" }}
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? "Loading..." : "Load more..."}
                </button>
            )}
        </div>
    );
};
