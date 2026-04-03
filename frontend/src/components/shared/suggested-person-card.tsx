"use client";

import React from "react";
import Link from "next/link";

interface SuggestedPersonProps {
    id: number;
    name: string;
    description: string;
    image: string;
    variant?: "connect" | "follow";
}

export const SuggestedPersonCard = ({ name, description, image, variant = "connect" }: SuggestedPersonProps) => {
    if (variant === "connect") {
        return (
            <div className="_left_inner_area_suggest_info">
                <div className="_left_inner_area_suggest_info_box">
                    <div className="_left_inner_area_suggest_info_image">
                        <Link href="/profile">
                            <img src={image} alt="Image" className="_info_img" />
                        </Link>
                    </div>
                    <div className="_left_inner_area_suggest_info_txt">
                        <Link href="/profile">
                            <h4 className="_left_inner_area_suggest_info_title">{name}</h4>
                        </Link>
                        <p className="_left_inner_area_suggest_info_para">{description}</p>
                    </div>
                </div>
                <div className="_left_inner_area_suggest_info_link"> 
                    <button className="_info_link border-0 bg-transparent">Connect</button>
                </div>
            </div>
        );
    }

    return (
        <div className="_right_inner_area_info_ppl">
            <div className="_right_inner_area_info_box">
                <div className="_right_inner_area_info_box_image">
                    <Link href="/profile">
                        <img src={image} alt="Image" className="_ppl_img" />
                    </Link>
                </div>
                <div className="_right_inner_area_info_box_txt">
                    <Link href="/profile">
                        <h4 className="_right_inner_area_info_box_title">{name}</h4>
                    </Link>
                    <p className="_right_inner_area_info_box_para">{description}</p>
                </div>
            </div>
            <div className="_right_info_btn_grp">
                <button type="button" className="_right_info_btn_link">Ignore</button>
                <button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button>
            </div>
        </div>
    );
};
