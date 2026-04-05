"use client";

import React, { useState } from "react";
import { StoryList } from "@/components/feed/story-list";
import { CreatePost } from "@/components/feed/create-post";
import { PostCard } from "@/components/feed/post-card";
import { useGetPosts } from "@/hooks/use-posts";
import { IPost } from "@/types/post";

export default function FeedPage() {
    const { data: postsData, isLoading, isError } = useGetPosts();

    return (
        <>
            <StoryList />
            <CreatePost />

            {/* Real Posts from DB */}
            {isLoading && (
                <div className="text-center _padd_t24">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {isError && (
                <div className="alert alert-danger _mar_t16" role="alert">
                    Failed to load posts. Please try again later.
                </div>
            )}

            {postsData?.map((post: IPost) => (
                <PostCard key={post.id} post={post} />
            ))}
        </>
    );
}