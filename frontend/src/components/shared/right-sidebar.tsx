"use client";

import React from "react";
import Link from "next/link";
import { SuggestedPersonCard } from "./suggested-person-card";
import { FriendStatusCard } from "./friend-status-card";

export const RightSidebar = () => {
    return (
        <div className="_layout_right_sidebar_wrap">
            <div className="_layout_right_sidebar_inner">
                <div className="_right_inner_area_info _padd_t24  _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                    <div className="_right_inner_area_info_content _mar_b24">
                        <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
                        <span className="_right_inner_area_info_content_txt">
                            <Link className="_right_inner_area_info_content_txt_link" href="#">See All</Link>
                        </span>
                    </div>
                    <hr className="_underline" />
                    <SuggestedPersonCard id={4} name="Radovan SkillArena" description="Founder & CEO at Trophy" image="/assets/images/Avatar.png" variant="follow" />
                </div>
            </div>
            <div className="_layout_right_sidebar_inner">
                <div className="_feed_right_inner_area_card  _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                    <div className="_feed_top_fixed">
                        <div className="_feed_right_inner_area_card_content _mar_b24">
                            <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
                            <span className="_feed_right_inner_area_card_content_txt">
                                <Link className="_feed_right_inner_area_card_content_txt_link" href="#">See All</Link>
                            </span>
                        </div>
                        <form className="_feed_right_inner_area_card_form">
                            <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                                <circle cx="7" cy="7" r="6" stroke="#666"></circle>
                                <path stroke="#666" stroke-linecap="round" d="M16 16l-3-3"></path>
                            </svg>
                            <input className="form-control me-2 _feed_right_inner_area_card_form_inpt" type="search" placeholder="input search text" aria-label="Search" />
                        </form>
                    </div>
                    <div className="_feed_bottom_fixed">
                        <FriendStatusCard id={1} name="Steve Jobs" description="CEO of Apple" image="/assets/images/people1.png" status="offline" lastSeen="5 minute ago" />
                        <FriendStatusCard id={2} name="Ryan Roslansky" description="CEO of Linkedin" image="/assets/images/people2.png" status="online" />
                        <FriendStatusCard id={3} name="Dylan Field" description="CEO of Figma" image="/assets/images/people3.png" status="online" />
                    </div>
                </div>
            </div>
        </div>
    );
};
