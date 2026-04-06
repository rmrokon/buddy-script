"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface FriendStatusProps {
    id: number;
    name: string;
    description: string;
    image: string;
    status?: "online" | "offline";
    lastSeen?: string;
}

export const FriendStatusCard = ({ name, description, image, status, lastSeen }: FriendStatusProps) => (
    <div className={`_feed_right_inner_area_card_ppl ${status === "offline" ? "_feed_right_inner_area_card_ppl_inactive" : ""}`}>
        <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
                <Link href="/profile">
                    <Image src={image} alt="" className="_box_ppl_img" width={44} height={44} style={{ objectFit: "cover" }} />
                </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
                <Link href="/profile">
                    <h4 className="_feed_right_inner_area_card_ppl_title">{name}</h4>
                </Link>
                <p className="_feed_right_inner_area_card_ppl_para">{description}</p>
            </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl_side">
            {status === "online" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                    <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                </svg>
            ) : (
                <span>{lastSeen}</span>
            )}
        </div>
    </div>
);
