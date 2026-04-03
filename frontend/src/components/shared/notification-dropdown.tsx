"use client";

import React from "react";

interface Notification {
  id: number;
  image: string;
  name: string;
  action: string;
  time: string;
  linkText?: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    image: "/assets/images/friend-req.png",
    name: "Steve Jobs",
    action: "posted a link in your timeline.",
    time: "42 minutes ago",
  },
  {
    id: 2,
    image: "/assets/images/profile-1.png",
    name: "An admin",
    action: "changed the name of the group",
    linkText: "Freelacer usa",
    time: "42 minutes ago",
  },
  // Add more as needed or map from props
];

export const NotificationDropdown = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  return (
    <div id="_notify_drop" className="_notification_dropdown" style={{ display: "block" }}>
      <div className="_notifications_content">
        <h4 className="_notifications_content_title">Notifications</h4>
        <div className="_notification_box_right">
          <button type="button" className="_notification_box_right_link">
            <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
              <circle cx="2" cy="2" r="2" fill="#C4C4C4"></circle>
              <circle cx="2" cy="8" r="2" fill="#C4C4C4"></circle>
              <circle cx="2" cy="15" r="2" fill="#C4C4C4"></circle>
            </svg>
          </button>
          <div className="_notifications_drop_right">
            <ul className="_notification_list">
              <li className="_notification_item">
                <span className="_notification_link">Mark as all read</span>
              </li>
              <li className="_notification_item">
                <span className="_notification_link">Notifivations seetings</span>
              </li>
              <li className="_notification_item">
                <span className="_notification_link">Open Notifications</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="_notifications_drop_box">
        <div className="_notifications_drop_btn_grp">
          <button className="_notifications_btn_link">All</button>
          <button className="_notifications_btn_link1">Unread</button>
        </div>
        <div className="_notifications_all">
          {notifications.map((item) => (
            <div className="_notification_box" key={item.id}>
              <div className="_notification_image">
                <img src={item.image} alt="Image" className="_notify_img" />
              </div>
              <div className="_notification_txt">
                <p className="_notification_para">
                  <span className="_notify_txt_link">{item.name}</span> {item.action}{" "}
                  {item.linkText && <span className="_notify_txt_link">{item.linkText}</span>}
                </p>
                <div className="_nitification_time">
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
