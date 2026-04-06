"use client";

import React from "react";
import Image from "next/image";
import { useGetInfiniteReactions } from "@/hooks/use-reactions";
import { EReactableType } from "@/types/reaction";
import { REACTION_ICONS } from "@/constants/reactions";
import { getRandomAvatar } from "@/utils/avatar-utils";

interface ReactionsModalProps {
    reactableId: string;
    reactableType?: EReactableType;
    onClose: () => void;
}

import { createPortal } from "react-dom";

export const ReactionsModal = ({ reactableId, reactableType = EReactableType.POST, onClose }: ReactionsModalProps) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        // Prevent background scrolling when modal is open
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetInfiniteReactions(reactableId, reactableType);

    const allReactions = data?.pages.flatMap((page) => page.nodes) || [];

    if (!mounted) return null;

    return createPortal(
        <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                cursor: "pointer",
                zIndex: 9999,
                position: "fixed",
                top: -40,
                left: 0,
                width: "100%",
                height: "100%"
            }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                onClick={(e) => e.stopPropagation()}
                style={{ cursor: "default" }}
            >
                <div className="modal-content _b_radious6 border-0 shadow-lg" style={{ maxHeight: "80vh" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Reactions</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body _padd_r24 _padd_l24 _padd_t16 _padd_b24">
                        {isLoading && (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}

                        {isError && (
                            <div className="text-center py-4 text-danger">
                                Failed to load reactions.
                            </div>
                        )}

                        {!isLoading && allReactions.length === 0 && (
                            <div className="text-center py-4 text-muted">
                                No reactions yet.
                            </div>
                        )}

                        <ul className="list-unstyled mb-0">
                            {allReactions.map((reaction) => (
                                <li key={reaction.id} className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="_feed_inner_timeline_post_box_image me-3" style={{ width: "40px", height: "40px", position: "relative", borderRadius: "50%", overflow: "hidden" }}>
                                            <Image
                                                src={reaction.user.profilePic || getRandomAvatar(reaction.userId)}
                                                alt={reaction.user.firstName ?? "User"}
                                                fill
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold">{reaction.user.firstName} {reaction.user.lastName}</h6>
                                        </div>
                                    </div>
                                    <div className="fs-4">
                                        {REACTION_ICONS[reaction.reactionType]}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {hasNextPage && (
                            <div className="text-center mt-3">
                                <button
                                    className="btn btn-outline-primary btn-sm rounded-pill px-4"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
