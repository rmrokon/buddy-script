"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IPost } from "@/types/post";
import { getRandomAvatar } from "@/utils/avatar-utils";
import { formatDistanceToNow } from "date-fns";
import { EReactableType, EReactionType } from "@/types/reaction";
import { useToggleReaction } from "@/hooks/use-reactions";
import { LaughIcon } from "lucide-react";

interface PostCardProps {
    post?: IPost;
    // Fallback props for hardcoded mock data
    mockData?: {
        user: { name: string; image: string };
        time: string;
        visibility: string;
        content: string;
        image?: string;
        reactionsCount: number;
        commentsCount: number;
        sharesCount: number;
    };
}

const REACTION_ICONS: Record<EReactionType, React.ReactNode> = {
    [EReactionType.LIKE]: (
        <span className="_reaction_like d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
        </span>
    ),
    [EReactionType.LOVE]: (
        <span className="_reaction_heart d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </span>
    ),
    [EReactionType.HAHA]:
        <span className="_reaction_haha d-flex align-items-center">
            <svg
                version="1.1"
                id="Uploaded to svgrepo.com"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 32 32"
                xmlSpace="preserve"
                fill="#000000"
                width={16}
                height={16}
            >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                    {" "}
                    <style
                        type="text/css"
                        dangerouslySetInnerHTML={{
                            __html:
                                " .avocado_een{fill:#231F20;} .avocado_zeventien{fill:#CC4121;} .avocado_zes{fill:#FFFAEE;} .avocado_twintig{fill:#EAD13F;} .st0{fill:#E0A838;} .st1{fill:#D1712A;} .st2{fill:#A3AEB5;} .st3{fill:#788287;} .st4{fill:#C3CC6A;} .st5{fill:#6F9B45;} .st6{fill:#248EBC;} .st7{fill:#8D3E93;} .st8{fill:#3D3935;} .st9{fill:#D36781;} .st10{fill:#E598A3;} .st11{fill:#716558;} .st12{fill:#AF9480;} .st13{fill:#DBD2C1;} .st14{fill:#231F20;} "
                        }}
                    />{" "}
                    <g>
                        {" "}
                        <g>
                            {" "}
                            <circle className="avocado_twintig" cx={16} cy={16} r="13.5" />{" "}
                        </g>{" "}
                        <path
                            className="avocado_zeventien"
                            d="M16,16.5c-4.416,0-7.5,1.028-7.5,2.5c0,4.136,3.364,7.5,7.5,7.5s7.5-3.364,7.5-7.5 C23.5,17.528,20.416,16.5,16,16.5z"
                        />{" "}
                        <path
                            className="avocado_zes"
                            d="M8.637,20.396C9.589,20.049,11.762,19.5,16,19.5s6.411,0.548,7.363,0.896 C23.454,19.927,23.5,19.459,23.5,19c0-1.472-3.084-2.5-7.5-2.5S8.5,17.528,8.5,19C8.5,19.459,8.546,19.927,8.637,20.396z"
                        />{" "}
                        <path
                            className="avocado_een"
                            d="M16,2C8.268,2,2,8.268,2,16s6.268,14,14,14s14-6.268,14-14S23.732,2,16,2z M16,29 C8.832,29,3,23.168,3,16S8.832,3,16,3s13,5.832,13,13S23.168,29,16,29z M8,13H7c0-1.654,1.346-3,3-3s3,1.346,3,3h-1 c0-1.103-0.897-2-2-2S8,11.897,8,13z M25,13h-1c0-1.103-0.897-2-2-2s-2,0.897-2,2h-1c0-1.654,1.346-3,3-3S25,11.346,25,13z M24,19 c0-2-3.582-3-8-3s-8,1-8,3c0,0.346,0.029,0.684,0.072,1.018c0.006,0.045,0.014,0.088,0.02,0.133C8.651,24.022,11.973,27,16,27 c4.026,0,7.348-2.977,7.908-6.849c0.007-0.045,0.014-0.089,0.021-0.134C23.971,19.683,24,19.345,24,19z M16,17c4.382,0,7,1.017,7,2 c0,0.244-0.014,0.491-0.042,0.739C21.757,19.391,19.605,19,16,19s-5.757,0.391-6.958,0.739C9.014,19.491,9,19.244,9,19 C9,18.017,11.618,17,16,17z M16,26c-3.263,0-6.003-2.247-6.776-5.273C10.277,20.409,12.337,20,16,20s5.723,0.408,6.776,0.727 C22.003,23.753,19.263,26,16,26z"
                        />{" "}
                    </g>{" "}
                </g>
            </svg>


        </span>,

    [EReactionType.WOW]: <span className="_reaction_wow d-flex align-items-center">
        <svg
            viewBox="0 0 1500 1500"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            width={16}
            height={16}
        >
            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
            <g id="SVGRepo_iconCarrier">
                <style
                    dangerouslySetInnerHTML={{
                        __html:
                            ".st0{fill:#ffda6b}.st1{fill:#262c38}.st2{fill:none;stroke:#262c38;stroke-width:60;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}"
                    }}
                />
                <circle className="st0" cx={750} cy={750} r={750} />
                <ellipse className="st1" cx="748.3" cy="1046.3" rx="220.6" ry="297.2" />
                <ellipse
                    transform="rotate(-81.396 402.197 564.888)"
                    className="st1"
                    cx="402.2"
                    cy="564.9"
                    rx="155.6"
                    ry="109.2"
                />
                <ellipse
                    transform="rotate(-8.604 1093.463 564.999)"
                    className="st1"
                    cx="1093.2"
                    cy="564.9"
                    rx="109.2"
                    ry="155.6"
                />
                <path
                    className="st2"
                    d="M320.9 223s69.7-96.7 174-28.6M1177.5 223s-69.7-96.7-174-28.6"
                />
            </g>
        </svg>
    </span>,
    [EReactionType.SAD]: <span className="_reaction_wow d-flex align-items-center">
        <svg
            viewBox="0 0 1024 1024"
            className="icon"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            width={16}
            height={16}
        >
            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
            <g id="SVGRepo_iconCarrier">
                <path
                    d="M512.004 512.002m-491.988 0a491.988 491.988 0 1 0 983.976 0 491.988 491.988 0 1 0-983.976 0Z"
                    fill="#FDDF6D"
                />
                <path
                    d="M617.43 931.354c-271.716 0-491.986-220.268-491.986-491.986 0-145.168 62.886-275.632 162.888-365.684C129.056 155.124 20.016 320.824 20.016 512c0 271.716 220.268 491.986 491.986 491.986 126.548 0 241.924-47.796 329.098-126.298-67.106 34.308-143.124 53.666-223.67 53.666z"
                    fill="#FCC56B"
                />
                <path
                    d="M735.828 834.472H496.912c-11.056 0-20.014-8.958-20.014-20.014s8.958-20.014 20.014-20.014h238.914c11.056 0 20.014 8.958 20.014 20.014s-8.956 20.014-20.012 20.014zM442.172 628.498c-48.674 0-92.65-12.454-117.634-33.316-8.486-7.082-9.62-19.706-2.536-28.188 7.082-8.484 19.702-9.62 28.188-2.536 17.472 14.586 53.576 24.012 91.98 24.012 37.486 0 74.086-9.604 93.242-24.464 8.732-6.776 21.3-5.188 28.08 3.546 6.776 8.732 5.188 21.304-3.546 28.08-26.524 20.58-70.554 32.866-117.774 32.866zM789.346 628.498c-48.674 0-92.65-12.454-117.634-33.316-8.486-7.082-9.62-19.706-2.536-28.188s19.706-9.62 28.188-2.536c17.472 14.586 53.576 24.012 91.98 24.012 37.486 0 74.086-9.604 93.242-24.464 8.73-6.776 21.304-5.188 28.08 3.546 6.776 8.732 5.188 21.304-3.546 28.08-26.526 20.58-70.554 32.866-117.774 32.866zM347.382 526.08c-7.438 0-14.36-0.836-20.53-2.544-10.654-2.946-16.9-13.972-13.954-24.628 2.948-10.654 13.984-16.904 24.628-13.954 9.852 2.73 30.072 0.814 53.044-9.608 22.486-10.194 37.75-24.62 42.904-34.39 5.156-9.78 17.26-13.528 27.038-8.368 9.778 5.156 13.524 17.264 8.368 27.038-10.488 19.886-33.582 39.392-61.778 52.178-20.608 9.346-41.672 14.276-59.72 14.276zM878.98 526.08c-18.05 0-39.108-4.928-59.724-14.278-28.194-12.782-51.288-32.288-61.774-52.174-5.158-9.776-1.41-21.882 8.368-27.038 9.778-5.164 21.882-1.406 27.038 8.368 5.156 9.77 20.418 24.194 42.898 34.388 22.974 10.42 43.2 12.338 53.044 9.61 10.666-2.938 21.68 3.298 24.628 13.952 2.946 10.654-3.298 21.68-13.952 24.628-6.166 1.706-13.09 2.544-20.526 2.544z"
                    fill="#7F184C"
                />
                <path
                    d="M711.124 40.168c-10.176-4.304-21.922 0.464-26.224 10.646s0.464 21.926 10.646 26.224c175.212 74.03 288.428 244.764 288.428 434.96 0 260.248-211.724 471.97-471.968 471.97S40.03 772.244 40.03 511.998 251.756 40.03 512.002 40.03c11.056 0 20.014-8.958 20.014-20.014S523.058 0 512.002 0c-282.32 0-512 229.68-512 511.998 0 282.32 229.68 512.002 512 512.002C794.318 1024 1024 794.32 1024 512c0.002-206.322-122.812-391.528-312.876-471.832z"
                    fill=""
                />
                <path
                    d="M496.912 794.444c-11.056 0-20.014 8.958-20.014 20.014s8.958 20.014 20.014 20.014h238.914c11.056 0 20.014-8.958 20.014-20.014s-8.958-20.014-20.014-20.014H496.912zM350.194 564.46c-8.488-7.088-21.106-5.948-28.188 2.536-7.086 8.486-5.948 21.106 2.536 28.188 24.984 20.86 68.96 33.316 117.634 33.316 47.218 0 91.248-12.286 117.778-32.864 8.734-6.776 10.322-19.348 3.546-28.08-6.778-8.738-19.348-10.32-28.08-3.546-19.158 14.858-55.758 24.464-93.242 24.464-38.408-0.002-74.514-9.43-91.984-24.014zM671.714 595.184c24.984 20.86 68.96 33.316 117.634 33.316 47.218 0 91.248-12.286 117.778-32.864 8.734-6.776 10.322-19.348 3.546-28.08-6.776-8.738-19.35-10.32-28.08-3.546-19.158 14.858-55.758 24.464-93.242 24.464-38.404 0-74.508-9.426-91.98-24.012-8.486-7.088-21.104-5.948-28.188 2.536-7.09 8.48-5.954 21.104 2.532 28.186zM347.382 526.08c18.048 0 39.108-4.926 59.718-14.272 28.196-12.786 51.294-32.29 61.778-52.176 5.158-9.776 1.41-21.882-8.368-27.038-9.778-5.164-21.882-1.41-27.038 8.368-5.156 9.77-20.418 24.194-42.904 34.388-22.972 10.42-43.19 12.34-53.042 9.608-10.646-2.936-21.68 3.298-24.628 13.952-2.946 10.65 3.296 21.68 13.952 24.628 6.17 1.704 13.094 2.542 20.532 2.542zM819.26 511.808c20.616 9.346 41.674 14.272 59.722 14.272 7.434 0 14.362-0.836 20.532-2.546 10.65-2.948 16.896-13.976 13.946-24.628a20.004 20.004 0 0 0-24.628-13.946c-9.842 2.714-30.062 0.812-53.042-9.61-22.48-10.192-37.746-24.618-42.898-34.388-5.156-9.778-17.26-13.53-27.038-8.368-9.778 5.156-13.524 17.264-8.368 27.038 10.482 19.888 33.576 39.39 61.774 52.176z"
                    fill=""
                />
                <path
                    d="M638.204 37.682m-20.014 0a20.014 20.014 0 1 0 40.028 0 20.014 20.014 0 1 0-40.028 0Z"
                    fill=""
                />
            </g>
        </svg>
    </span>,
    [EReactionType.ANGRY]: <span className="_reaction_angry d-flex align-items-center">
        <svg
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            className="iconify iconify--twemoji"
            preserveAspectRatio="xMidYMid meet"
            fill="#000000"
            width="16"
            height="16"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
            <g id="SVGRepo_iconCarrier">
                <path
                    fill="#ff4d4d"
                    d="M36 18c0 9.941-8.059 18-18 18c-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18"
                />
                <path
                    fill="#23221f"
                    d="M25.485 29.879C25.44 29.7 24.317 25.5 18 25.5c-6.318 0-7.44 4.2-7.485 4.379a.499.499 0 0 0 .237.554a.507.507 0 0 0 .6-.077c.019-.019 1.954-1.856 6.648-1.856s6.63 1.837 6.648 1.855a.502.502 0 0 0 .598.081a.5.5 0 0 0 .239-.557zm-9.778-12.586C12.452 14.038 7.221 14 7 14a1.001 1.001 0 0 0-.001 2c.029 0 1.925.022 3.983.737c-.593.64-.982 1.634-.982 2.763c0 1.934 1.119 3.5 2.5 3.5s2.5-1.566 2.5-3.5c0-.174-.019-.34-.037-.507c.013 0 .025.007.037.007a.999.999 0 0 0 .707-1.707zM29 14c-.221 0-5.451.038-8.707 3.293A.999.999 0 0 0 21 19c.013 0 .024-.007.036-.007c-.016.167-.036.333-.036.507c0 1.934 1.119 3.5 2.5 3.5s2.5-1.566 2.5-3.5c0-1.129-.389-2.123-.982-2.763A13.928 13.928 0 0 1 29.002 16A1 1 0 0 0 29 14z"
                />
            </g>
        </svg>

    </span>,
};

export const PostCard = ({ post, mockData }: PostCardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const toggleReactionMutation = useToggleReaction();

    // Determine which data to use
    const displayData = post ? {
        id: post.id,
        userName: `${post.user.firstName || ""} ${post.user.lastName || ""}`.trim() || post.user.email,
        userImage: post.user.profilePic || getRandomAvatar(post.userId),
        time: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }),
        visibility: post.visibility,
        content: post.content,
        image: post.image,
        reactionsCount: post.reactionsCount,
        commentsCount: post.repliesCount,
        sharesCount: 0,
        currentUserReaction: post.currentUserReaction as EReactionType | undefined,
    } : {
        id: mockData?.user.name || "mock",
        userName: mockData?.user.name || "",
        userImage: mockData?.user.image || "",
        time: mockData?.time || "",
        visibility: mockData?.visibility || "",
        content: mockData?.content || "",
        image: mockData?.image,
        reactionsCount: mockData?.reactionsCount || 0,
        commentsCount: mockData?.commentsCount || 0,
        sharesCount: mockData?.sharesCount || 0,
        currentUserReaction: undefined,
    };

    if (!displayData) return null;

    const handleToggleReaction = (type: EReactionType) => {
        if (!post) return;
        toggleReactionMutation.mutate({
            reactableId: post.id,
            reactableType: EReactableType.POST,
            reactionType: type,
        });
        setIsPickerOpen(false);
    };

    const activeReaction = displayData.currentUserReaction;

    return (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
            <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                <div className="_feed_inner_timeline_post_top">
                    <div className="_feed_inner_timeline_post_box">
                        <div className="_feed_inner_timeline_post_box_image">
                            <img src={displayData.userImage} alt="" className="_post_img" />
                        </div>
                        <div className="_feed_inner_timeline_post_box_txt">
                            <h4 className="_feed_inner_timeline_post_box_title">{displayData.userName}</h4>
                            <p className="_feed_inner_timeline_post_box_para">
                                {displayData.time} . <Link href="#" className="text-capitalize">{displayData.visibility}</Link>
                            </p>
                        </div>
                    </div>
                    <div className="_feed_inner_timeline_post_box_dropdown position-relative">
                        <div className="_feed_timeline_post_dropdown">
                            <button className="_feed_timeline_post_dropdown_link border-0 bg-transparent" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                                </svg>
                            </button>
                        </div>
                        {isMenuOpen && (
                            <div className="_feed_timeline_dropdown show" style={{ display: "block", right: 0, top: "100%", zIndex: 10 }}>
                                <ul className="_feed_timeline_dropdown_list">
                                    <li className="_feed_timeline_dropdown_item">
                                        <button className="_feed_timeline_dropdown_link border-0 bg-transparent text-start w-100">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                    <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" />
                                                </svg>
                                            </span>
                                            Save Post
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <h4 className="_feed_inner_timeline_post_title">{displayData.content}</h4>
                {displayData.image && (
                    <div className="_feed_inner_timeline_image">
                        <img src={displayData.image} alt="" className="_time_img" />
                    </div>
                )}
            </div>

            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                <div className="_feed_inner_timeline_total_reacts_image d-flex align-items-center">
                    {/* Show top 2 reaction types */}
                    <div className="d-flex align-items-center">
                        {REACTION_ICONS[EReactionType.LIKE]}
                        <div style={{ marginLeft: "-4px" }}>
                            {REACTION_ICONS[EReactionType.LOVE]}
                        </div>
                    </div>
                    <p className="_feed_inner_timeline_total_reacts_para ms-2">{displayData.reactionsCount}</p>
                </div>
                <div className="_feed_inner_timeline_total_reacts_txt">
                    <p className="_feed_inner_timeline_total_reacts_para1">
                        <Link href="#"><span>{displayData.commentsCount}</span> Comment</Link>
                    </p>
                    <p className="_feed_inner_timeline_total_reacts_para2"><span>{displayData.sharesCount}</span> Share</p>
                </div>
            </div>

            <div className="_feed_inner_timeline_reaction position-relative">
                {/* Reaction Picker Popup */}
                {isPickerOpen && (
                    <div className="position-absolute bg-white shadow-sm p-2 rounded-pill d-flex gap-2"
                        style={{ bottom: "100%", left: 0, zIndex: 100, marginBottom: "10px" }}
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
                    className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${activeReaction ? "_feed_reaction_active" : ""}`}
                    onMouseEnter={() => setIsPickerOpen(true)}
                    onClick={() => handleToggleReaction(activeReaction || EReactionType.LIKE)}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span className="d-flex align-items-center gap-2">
                            {activeReaction ? (
                                <div style={{ width: "19px", height: "19px" }}>
                                    {REACTION_ICONS[activeReaction]}
                                </div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                                    <path fill="#666" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" opacity="0.6" />
                                </svg>
                            )}
                            <span className="text-capitalize">{activeReaction || "Like"}</span>
                        </span>
                    </span>
                </button>

                <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                            </svg>
                            Comment
                        </span>
                    </span>
                </button>
                <button className="_feed_inner_timeline_reaction_share _feed_reaction">
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
                            </svg>
                            Share
                        </span>
                    </span>
                </button>
            </div>
        </div>
    );
};
