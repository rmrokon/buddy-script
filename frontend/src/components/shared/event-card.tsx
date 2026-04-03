"use client";

import React from "react";
import Link from "next/link";

interface EventProps {
    id: number;
    title: string;
    image: string;
    day: string;
    month: string;
    goingCount: number;
}

export const EventCard = ({ title, image, day, month, goingCount }: EventProps) => (
    <Link className="_left_inner_event_card_link" href={`/events/${title}`}>
        <div className="_left_inner_event_card">
            <div className="_left_inner_event_card_iamge">
                <img src={image} alt="Image" className="_card_img" />
            </div>
            <div className="_left_inner_event_card_content">
                <div className="_left_inner_card_date">
                    <p className="_left_inner_card_date_para">{day}</p>
                    <p className="_left_inner_card_date_para1">{month}</p>
                </div>
                <div className="_left_inner_card_txt">
                    <h4 className="_left_inner_event_card_title">{title}</h4>
                </div>
            </div>
            <hr className="_underline" />
            <div className="_left_inner_event_bottom">
                <p className="_left_iner_event_bottom">{goingCount} People Going</p> 
                <button type="button" className="_left_iner_event_bottom_link border-0 bg-transparent">Going</button>
            </div>
        </div>
    </Link>
);
