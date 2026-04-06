"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IPost, IPreviewComment } from "@/types/post";
import { getRandomAvatar } from "@/utils/avatar-utils";
import { formatDistanceToNow } from "date-fns";
import { EReactableType, EReactionType } from "@/types/reaction";
import { REACTION_ICONS } from "@/constants/reactions";
import { ReactionsModal } from "./reactions/reactions-modal";
import { ReactionButton } from "./reactions/reaction-button";
import { CommentSection } from "./comments/comment-section";

interface PostCardProps {
    post?: IPost;
    // Fallback props for hardcoded mock data
    mockData?: {
        user: { name: string; image: string };
        time: string;
        visibility: string;
        content: string;
        image?: string;
        reactionsCount: number;
        commentsCount: number;    // Total count of ALL comments + replies (for display)
        rootCommentsCount: number; // Count of only top-level (root) comments
        sharesCount: number;
    };
}


export const PostCard = ({ post, mockData }: PostCardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false);
    const [isCommentsVisible, setIsCommentsVisible] = useState(true);

    // Determine which data to use
    const displayData = post ? {
        id: post.id,
        userName: `${post.user.firstName || ""} ${post.user.lastName || ""}`.trim() || post.user.email,
        userImage: post.user.profilePic || getRandomAvatar(post.userId),
        time: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }),
        visibility: post.visibility,
        content: post.content,
        image: post.image,
        reactionsCount: post.reactionsCount,
        commentsCount: post.commentsCount,
        rootCommentsCount: post.rootCommentsCount,
        sharesCount: 0,
        currentUserReaction: post.currentUserReaction as EReactionType | undefined,
        previewComments: (post.comments ?? []) as IPreviewComment[],
    } : {
        id: mockData?.user.name || "mock",
        userName: mockData?.user.name || "",
        userImage: mockData?.user.image || "",
        time: mockData?.time || "",
        visibility: mockData?.visibility || "",
        content: mockData?.content || "",
        image: mockData?.image,
        reactionsCount: mockData?.reactionsCount || 0,
        commentsCount: mockData?.commentsCount || 0,
        rootCommentsCount: mockData?.rootCommentsCount || 0,
        sharesCount: mockData?.sharesCount || 0,
        currentUserReaction: undefined,
        previewComments: [] as IPreviewComment[],
    };

    if (!displayData) return null;

    const activeReaction = displayData.currentUserReaction;

    return (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
            <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                <div className="_feed_inner_timeline_post_top">
                    <div className="_feed_inner_timeline_post_box">
                        <div className="_feed_inner_timeline_post_box_image">
                            <img src={displayData.userImage} alt="" className="_post_img" />
                        </div>
                        <div className="_feed_inner_timeline_post_box_txt">
                            <h4 className="_feed_inner_timeline_post_box_title">{displayData.userName}</h4>
                            <p className="_feed_inner_timeline_post_box_para">
                                {displayData.time} . <Link href="#" className="text-capitalize">{displayData.visibility}</Link>
                            </p>
                        </div>
                    </div>
                    <div className="_feed_inner_timeline_post_box_dropdown position-relative">
                        <div className="_feed_timeline_post_dropdown">
                            <button className="_feed_timeline_post_dropdown_link border-0 bg-transparent" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                                </svg>
                            </button>
                        </div>
                        {isMenuOpen && (
                            <div className="_feed_timeline_dropdown show" style={{ display: "block", right: 0, top: "100%", zIndex: 10 }}>
                                <ul className="_feed_timeline_dropdown_list">
                                    <li className="_feed_timeline_dropdown_item">
                                        <button className="_feed_timeline_dropdown_link border-0 bg-transparent text-start w-100">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                    <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" />
                                                </svg>
                                            </span>
                                            Save Post
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <h4 className="_feed_inner_timeline_post_title">{displayData.content}</h4>
                {displayData.image && (
                    <div className="_feed_inner_timeline_image">
                        <img src={displayData.image} alt="" className="_time_img" />
                    </div>
                )}
            </div>

            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                <div
                    className="_feed_inner_timeline_total_reacts_image d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsReactionsModalOpen(true)}
                >
                    {/* Show top 2 reaction types */}
                    <div className="d-flex align-items-center">
                        {REACTION_ICONS[EReactionType.LIKE]}
                        <div style={{ marginLeft: "-4px" }}>
                            {REACTION_ICONS[EReactionType.LOVE]}
                        </div>
                    </div>
                    <p className="_feed_inner_timeline_total_reacts_para ms-2">{displayData.reactionsCount}</p>
                </div>
                <div className="_feed_inner_timeline_total_reacts_txt d-flex align-items-center gap-2">
                    <p className="_feed_inner_timeline_total_reacts_para1">
                        <button
                            className="btn btn-link p-0 text-decoration-none"
                            onClick={() => setIsCommentsVisible(!isCommentsVisible)}
                        >
                            <span>{displayData.commentsCount}</span> {displayData.commentsCount <= 1 ? "Comment" : "Comments"}
                        </button>
                    </p>
                    <p className="_feed_inner_timeline_total_reacts_para2"><span>{displayData.sharesCount}</span> {displayData.sharesCount <= 1 ? "Share" : "Shares"}</p>
                </div>
            </div>

            <div className="_feed_inner_timeline_reaction position-relative px-4 d-flex align-items-center gap-3">
                <ReactionButton
                    reactableId={displayData.id}
                    reactableType={EReactableType.POST}
                    initialReaction={activeReaction}
                />

                <button
                    className="_feed_inner_timeline_reaction_comment _feed_reaction border-0 bg-transparent p-0"
                    onClick={() => setIsCommentsVisible(!isCommentsVisible)}
                >
                    <span className="_feed_inner_timeline_reaction_link d-flex align-items-center gap-2">
                        <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 21 21">
                            <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                            <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                        </svg>
                        <span className="small fw-bold text-muted">Comment</span>
                    </span>
                </button>

                <button className="_feed_inner_timeline_share _feed_reaction border-0 bg-transparent p-0 ms-auto">
                    <span className="_feed_inner_timeline_reaction_link d-flex align-items-center gap-2">
                        <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                            <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
                        </svg>
                        <span className="small fw-bold text-muted">Share</span>
                    </span>
                </button>
            </div>

            {isCommentsVisible && (
                <CommentSection
                    postId={displayData.id}
                    previewComments={displayData.previewComments}
                    totalCount={displayData.rootCommentsCount}
                />
            )}

            {isReactionsModalOpen && post && (
                <ReactionsModal
                    reactableId={post.id}
                    onClose={() => setIsReactionsModalOpen(false)}
                />
            )}
        </div>
    );
};
