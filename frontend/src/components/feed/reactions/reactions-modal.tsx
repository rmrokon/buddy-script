"use client";

import React from "react";
import { useGetInfiniteReactions } from "@/hooks/use-reactions";
import { EReactableType } from "@/types/reaction";
import { REACTION_ICONS } from "@/constants/reactions";
import { getRandomAvatar } from "@/utils/avatar-utils";
import Link from "next/link";

interface ReactionsModalProps {
    reactableId: string;
    reactableType?: EReactableType;
    onClose: () => void;
}

export const ReactionsModal = ({ reactableId, reactableType = EReactableType.POST, onClose }: ReactionsModalProps) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetInfiniteReactions(reactableId, reactableType);

    const allReactions = data?.pages.flatMap((page) => page.nodes) || [];

    return (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
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
                                        <div className="_feed_inner_timeline_post_box_image me-3" style={{ width: "40px", height: "40px" }}>
                                            <img 
                                                src={reaction.user.profilePic || getRandomAvatar(reaction.userId)} 
                                                alt={reaction.user.firstName} 
                                                className="rounded-circle w-100 h-100 object-fit-cover"
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
            <div className="modal-backdrop fade show" style={{ zIndex: -1 }} onClick={onClose}></div>
        </div>
    );
};
