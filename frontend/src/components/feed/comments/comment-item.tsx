"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IComment } from "@/types/comment";
import { getRandomAvatar } from "@/utils/avatar-utils";
import { formatDistanceToNow } from "date-fns";
import { ReactionButton } from "../reactions/reaction-button";
import { EReactableType, EReactionType } from "@/types/reaction";
import { REACTION_ICONS } from "@/constants/reactions";
import { ReactionsModal } from "../reactions/reactions-modal";
import { CommentInput } from "./comment-input";
import dynamic from "next/dynamic";
import type { CommentSectionProps } from "./comment-section";

// Lazy-loaded to break the circular dependency (CommentSection → CommentItem → CommentSection)
const CommentSection = dynamic<CommentSectionProps>(
    () => import("./comment-section").then((m) => m.CommentSection),
    { ssr: false }
);

interface CommentItemProps {
    comment: IComment;
    isReply?: boolean;
}

export const CommentItem = ({ comment, isReply = false }: CommentItemProps) => {
    const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false);
    const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
    const [isReplyThreadOpen, setIsReplyThreadOpen] = useState(false);

    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
    const hasReplies = (comment.repliesCount ?? 0) > 0;
    const activeReactionIcon = comment.currentUserReaction ? REACTION_ICONS[comment.currentUserReaction as EReactionType] : null;

    return (
        <div className={`d-flex align-items-start gap-2 ${isReply ? "mt-2 ms-4" : "mt-3 px-3"}`}>
            {/* Avatar */}
            <div
                className="rounded-circle flex-shrink-0"
                style={{ width: isReply ? "26px" : "32px", height: isReply ? "26px" : "32px", position: "relative", overflow: "hidden" }}
            >
                <Image
                    src={comment.user?.profilePic || getRandomAvatar(comment.userId)}
                    alt={comment.user?.firstName ?? "User"}
                    fill
                    style={{ objectFit: "cover" }}
                />
            </div>

            {/* Content column */}
            <div className="flex-grow-1 min-w-0">
                {/* Bubble */}
                <div className="d-inline-block bg-light rounded-3 px-3 py-2 shadow-sm" style={{ maxWidth: "100%" }}>
                    <span className="fw-bold small text-primary me-2">
                        {comment.user?.firstName} {comment.user?.lastName}
                    </span>
                    <span className="text-muted" style={{ fontSize: "11px" }}>{timeAgo}</span>
                    <p className="mb-0 mt-1 small text-break">{comment.content}</p>
                </div>

                {/* Meta row */}
                <div className="d-flex align-items-center flex-wrap gap-2 mt-1 ms-1">
                    {/* Like / Reaction button */}
                    <ReactionButton
                        reactableId={comment.id}
                        reactableType={EReactableType.COMMENT}
                        initialReaction={comment.currentUserReaction}
                        showLabel={false}
                    />

                    {/* Reply button */}
                    <button
                        className="btn btn-link btn-sm p-0 text-decoration-none text-muted fw-semibold"
                        style={{ fontSize: "12px" }}
                        onClick={() => setIsReplyInputOpen((v) => !v)}
                    >
                        Reply
                    </button>

                    {/* Reaction count (clickable → modal) */}
                    {(comment.reactionsCount ?? 0) > 0 && (
                        <button
                            className="btn btn-link btn-sm p-0 text-decoration-none d-flex align-items-center gap-1"
                            style={{ fontSize: "12px" }}
                            onClick={() => setIsReactionsModalOpen(true)}
                        >
                            <span style={{ width: "15px", height: "15px", display: "inline-block" }}>
                                {REACTION_ICONS[EReactionType.LIKE]}
                            </span>
                            <span className="text-muted">{comment.reactionsCount}</span>
                        </button>
                    )}

                    {/* Reply count (clickable → toggles reply thread) */}
                    {hasReplies && (
                        <button
                            className="btn btn-link btn-sm p-0 text-decoration-none text-primary fw-semibold"
                            style={{ fontSize: "12px" }}
                            onClick={() => setIsReplyThreadOpen((v) => !v)}
                        >
                            {isReplyThreadOpen
                                ? "Hide replies"
                                : `View ${comment.repliesCount} ${Number(comment.repliesCount) === 1 ? "reply" : "replies"}`}
                        </button>
                    )}
                </div>

                {/* Reply input */}
                {isReplyInputOpen && (
                    <div className="mt-2">
                        <CommentInput
                            postId={comment.postId}
                            parentCommentId={comment.id}
                            placeholder={`Reply to ${comment.user?.firstName ?? ""}...`}
                            autoFocus
                            onSuccess={() => {
                                setIsReplyInputOpen(false);
                                setIsReplyThreadOpen(true); // auto-expand replies after posting
                            }}
                        />
                    </div>
                )}

                {/* Reply thread — paginated, same CommentSection component */}
                {isReplyThreadOpen && (
                    <div className="mt-1 border-start ps-2" style={{ borderColor: "#dee2e6" }}>
                        <CommentSection
                            postId={comment.postId}
                            parentCommentId={comment.id}
                            previewComments={[]}
                            totalCount={comment.repliesCount ?? 0}
                            isReply
                            initiallyExpanded={true}
                        />
                    </div>
                )}
            </div>

            {/* Reactions modal */}
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
