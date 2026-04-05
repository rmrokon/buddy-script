"use client";

import React, { useState } from "react";
import { IComment } from "@/types/comment";
import { getRandomAvatar } from "@/utils/avatar-utils";
import { formatDistanceToNow } from "date-fns";
import { ReactionButton } from "../reactions/reaction-button";
import { EReactableType } from "@/types/reaction";
import { REACTION_ICONS } from "@/constants/reactions";
import { ReactionsModal } from "../reactions/reactions-modal";
import { CommentInput } from "./comment-input";
import dynamic from "next/dynamic";
import type { CommentSectionProps } from "./comment-section";

const CommentSection = dynamic<CommentSectionProps>(() => import("./comment-section").then(mod => mod.CommentSection), { ssr: false });

interface CommentItemProps {
    comment: IComment;
    isReply?: boolean;
}

export const CommentItem = ({ comment, isReply = false }: CommentItemProps) => {
    const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false);
    const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
    const [isRepliesVisible, setIsRepliesVisible] = useState(false);

    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

    return (
        <div className={`_feed_inner_timeline_comment_item ${isReply ? "ms-4 mt-2" : "mt-3"}`}>
            <div className="d-flex align-items-start">
                <div className="_feed_inner_timeline_post_box_image me-2" style={{ width: isReply ? "24px" : "32px", height: isReply ? "24px" : "32px" }}>
                    <img
                        src={comment.user.profilePic || getRandomAvatar(comment.userId)}
                        alt={comment.user.firstName}
                        className="rounded-circle w-100 h-100 object-fit-cover"
                    />
                </div>
                <div className="flex-grow-1">
                    <div className="bg-light rounded-3 p-2 px-3 d-inline-block mw-100 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center gap-3">
                            <h6 className="mb-0 fw-bold small text-primary">{comment.user.firstName} {comment.user.lastName}</h6>
                            <span className="text-muted" style={{ fontSize: "10px" }}>{timeAgo}</span>
                        </div>
                        <p className="mb-0 small text-break">{comment.content}</p>
                    </div>

                    <div className="d-flex align-items-center gap-3 mt-1 ms-2">
                        <ReactionButton
                            reactableId={comment.id}
                            reactableType={EReactableType.COMMENT}
                            initialReaction={comment.currentUserReaction}
                            showLabel={false}
                        />

                        <button
                            className="btn btn-link btn-sm p-0 text-decoration-none text-muted fw-bold"
                            style={{ fontSize: "12px" }}
                            onClick={() => setIsReplyInputOpen(!isReplyInputOpen)}
                        >
                            Reply
                        </button>

                        {comment.reactionsCount > 0 && (
                            <div
                                className="d-flex align-items-center gap-1"
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsReactionsModalOpen(true)}
                            >
                                <div style={{ transform: "scale(0.8)", width: "16px", height: "16px" }}>
                                    {REACTION_ICONS[comment.currentUserReaction || "like"]}
                                </div>
                                <span className="text-muted" style={{ fontSize: "12px" }}>{comment.reactionsCount}</span>
                            </div>
                        )}

                        {comment.repliesCount > 0 && (
                            <div
                                className="d-flex align-items-center gap-1"
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsRepliesVisible(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 21 21">
                                    <path stroke="#666" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" opacity="0.6" />
                                </svg>
                                <span className="text-muted" style={{ fontSize: "12px" }}>{comment.repliesCount}</span>
                            </div>
                        )}
                    </div>

                    {isReplyInputOpen && (
                        <div className="mt-2 ms-2">
                            <CommentInput
                                postId={comment.postId}
                                parentCommentId={comment.id}
                                placeholder={`Reply to ${comment.user.firstName}...`}
                                onSuccess={() => {
                                    setIsReplyInputOpen(false);
                                    setIsRepliesVisible(true);
                                }}
                                autoFocus
                            />
                        </div>
                    )}

                    {comment.repliesCount > 0 && !isRepliesVisible && (
                        <button
                            className="btn btn-link btn-sm p-0 text-decoration-none text-primary fw-bold mt-1 ms-2"
                            style={{ fontSize: "12px" }}
                            onClick={() => setIsRepliesVisible(true)}
                        >
                            View {comment.repliesCount} {comment.repliesCount === 1 ? "reply" : "replies"}
                        </button>
                    )}

                    {isRepliesVisible && (
                        <div className="border-start ms-2 ps-2" id={`comment-section-${comment.postId}-${comment.id}`}>
                            <CommentSection
                                postId={comment.postId}
                                parentCommentId={comment.id}
                                initialComments={[]}
                                totalCount={comment.repliesCount}
                                isReply
                            />
                        </div>
                    )}
                </div>
            </div>

            {isReactionsModalOpen && (
                <ReactionsModal
                    reactableId={comment.id}
                    reactableType={EReactableType.COMMENT}
                    onClose={() => setIsReactionsModalOpen(false)}
                />
            )}
        </div>
    );
};
