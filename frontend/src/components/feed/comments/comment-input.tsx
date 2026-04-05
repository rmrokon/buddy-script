"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { getRandomAvatar } from "@/utils/avatar-utils";
import { useCreateComment } from "@/hooks/use-comments";

interface CommentInputProps {
    postId: string;
    parentCommentId?: string | null;
    placeholder?: string;
    onSuccess?: () => void;
    autoFocus?: boolean;
}

export const CommentInput = ({ 
    postId, 
    parentCommentId = null, 
    placeholder = "Write a comment...",
    onSuccess,
    autoFocus = false
}: CommentInputProps) => {
    const { user } = useAuthStore();
    const [content, setContent] = useState("");
    const createCommentMutation = useCreateComment();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || createCommentMutation.isPending) return;

        createCommentMutation.mutate({
            postId,
            content: content.trim(),
            parentCommentId
        }, {
            onSuccess: () => {
                setContent("");
                onSuccess?.();
                
                // Auto-scroll to the new comment/reply section
                setTimeout(() => {
                    const scrollId = `comment-section-${postId}-${parentCommentId ?? "root"}`;
                    const element = document.getElementById(scrollId);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }
                }, 100);
            }
        });
    };

    return (
        <div className="d-flex align-items-start _mar_b16">
            <div className="_feed_inner_timeline_post_box_image me-2" style={{ width: "32px", height: "32px" }}>
                <img 
                    src={user?.profilePic || getRandomAvatar(user?.id)} 
                    alt="User" 
                    className="rounded-circle w-100 h-100 object-fit-cover"
                />
            </div>
            <form className="flex-grow-1" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control form-control-sm border-0 bg-light rounded-pill px-3"
                        placeholder={placeholder}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={createCommentMutation.isPending}
                        autoFocus={autoFocus}
                    />
                    {content.trim() && (
                        <button 
                            className="btn btn-link btn-sm text-primary text-decoration-none fw-bold" 
                            type="submit"
                            disabled={createCommentMutation.isPending}
                        >
                            Post
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
