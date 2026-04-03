"use client";

import React, { useState } from "react";
import { StoryList } from "@/components/feed/story-list";
import { CreatePost } from "@/components/feed/create-post";
import { PostCard } from "@/components/feed/post-card";
import { useGetPosts } from "@/hooks/use-posts";
import { IPost } from "@/types/post";

const mockPosts = [
    {
        user: { name: "Karim Saif", image: "/assets/images/post_img.png" },
        time: "5 minute ago",
        visibility: "Public",
        content: "-Healthy Tracking App",
        image: "/assets/images/timeline_img.png",
        reactionsCount: 9,
        commentsCount: 12,
        sharesCount: 122
    },
    {
        user: { name: "Dylan Field", image: "/assets/images/profile.png" },
        time: "1 hour ago",
        visibility: "Public",
        content: "Really excited about this new design system!",
        reactionsCount: 45,
        commentsCount: 5,
        sharesCount: 10
    }
];

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

            {/* Mock Posts (Always show below or only if no real posts? User said "on top of the hard coded ones") */}
            {mockPosts.map((post, index) => (
                <PostCard key={`mock-${index}`} mockData={post} />
            ))}
        </>
    );
}