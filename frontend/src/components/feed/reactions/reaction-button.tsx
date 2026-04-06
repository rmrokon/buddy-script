"use client";

import React, { useState } from "react";
import { EReactableType, EReactionType } from "@/types/reaction";
import { REACTION_ICONS } from "@/constants/reactions";
import { useToggleReaction } from "@/hooks/use-reactions";

interface ReactionButtonProps {
    reactableId: string;
    reactableType: EReactableType;
    initialReaction?: EReactionType;
    label?: string;
    showLabel?: boolean;
    onReactionChange?: (newReaction: EReactionType | null) => void;
}

export const ReactionButton = ({
    reactableId,
    reactableType,
    initialReaction,
    label = "Like",
    showLabel = true,
    onReactionChange
}: ReactionButtonProps) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const toggleReactionMutation = useToggleReaction();
    const activeReaction = initialReaction;

    const handleToggleReaction = (type: EReactionType) => {
        const isRemoving = activeReaction === type;

        toggleReactionMutation.mutate({
            reactableId,
            reactableType,
            reactionType: type,
        }, {
            onSuccess: (data) => {
                onReactionChange?.(data.reaction?.reactionType || null);
            }
        });
        setIsPickerOpen(false);
    };

    return (
        <div className="position-relative d-inline-block">
            {/* Reaction Picker Popup */}
            {isPickerOpen && (
                <div className="position-absolute bg-white shadow-sm px-2 rounded-pill d-flex gap-2"
                    style={{ bottom: "100%", left: 0, zIndex: 100 }}
                    onMouseLeave={() => setIsPickerOpen(false)}>
                    {(Object.keys(REACTION_ICONS) as EReactionType[]).map((type) => (
                        <div
                            key={type}
                            className="reaction-icon-picker-item"
                            style={{ width: "30px", height: "30px", cursor: "pointer", transition: "transform 0.2s" }}
                            onClick={() => handleToggleReaction(type)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.3)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                            {REACTION_ICONS[type]}
                        </div>
                    ))}
                </div>
            )}

            <button
                className={`_feed_inner_timeline_reaction_emoji _feed_reaction border-0 bg-transparent p-4 ${activeReaction ? "_feed_reaction_active" : ""}`}
                onMouseEnter={() => setIsPickerOpen(true)}
                onClick={() => handleToggleReaction(activeReaction || EReactionType.LIKE)}
                disabled={toggleReactionMutation.isPending}
            >
                <span className="_feed_inner_timeline_reaction_link d-flex align-items-center gap-1">
                    {activeReaction ? (
                        <div style={{ width: "18px", height: "18px" }}>
                            {REACTION_ICONS[activeReaction]}
                        </div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up opacity-75">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                    )}
                    {showLabel && (
                        <span className="text-capitalize small fw-bold" style={{ color: activeReaction ? "var(--primary)" : "#666" }}>
                            {activeReaction || label}
                        </span>
                    )}
                </span>
            </button>
        </div>
    );
};
