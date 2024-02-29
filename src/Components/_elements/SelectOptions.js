import React from "react";

import { TbFlag3Filled } from "react-icons/tb";

// LEAD CATEGORY
export const lead_category = (t) => [
  {
    name: t("menu_fresh"),
    value: "freshleads",
  },
  {
    name: t("menu_thirdparty"),
    value: "thirdpartyleads",
  },
  {
    name: t("menu_live_call"),
    value: "liveleads",
  },
  {
    name: t("cold"),
    value: "coldleads",
  },
  {
    name: t("menu_archived"),
    value: "archive",
  },
  {
    name: t("menu_personal"),
    value: "personalleads",
  },
  {
    name: t("menu_secondary"),
    value: "buyers",
  },
];

// FEEDBACK
export const feedback_options = (t) => [
  {
    value: "New",
    label: t("feedback_new"),
  },
  {
    value: "Callback",
    label: t("feedback_callback"),
  },
  {
    value: "Follow Up (Short Term)",
    label: t("feedback_follow_up_short_term"),
  },
  {
    value: "Follow Up (Long Term)",
    label: t("feedback_follow_up_long_term"),
  },
  {
    value: "Meeting",
    label: t("feedback_meeting"),
  },
  {
    value: "Booked",
    label: t("feedback_booked"),
  },
  {
    value: "Low Budget",
    label: t("feedback_low_budget"),
  },
  {
    value: "Not Interested",
    label: t("feedback_not_interested"),
  },
  {
    value: "No Answer",
    label: t("feedback_no_answer"),
  },
  {
    value: "Switched Off",
    label: t("feedback_switched_off"),
  },
  {
    value: "Unreachable",
    label: t("feedback_unreachable"),
  },
  {
    value: "Wrong Number",
    label: t("feedback_wrong_number"),
  },
  {
    value: "Duplicate",
    label: t("feedback_duplicate"),
  },
  // {
  //   value: "Dead",
  //   label: t("feedback_dead")
  // },
];

// LEAD CATEGORY
export const lead_options = (t) => [
  {
    value: "0",
    label: t("menu_fresh"),
  },
  {
    value: "5",
    label: t("secondary_buyers"),
  },
  {
    value: "3",
    label: t("menu_thirdparty"),
  },
  {
    value: "4",
    label: t("menu_archived"),
  },
  {
    value: "6",
    label: t("menu_live_call"),
  },
  {
    value: "1",
    label: t("menu_cold"),
  },
  {
    value: "2",
    label: t("menu_personal"),
  },
];

// LANGUAGE
export const language_options = [
  {
    value: "English",
    label: <div style={{ fontFamily: "Noto Sans" }}>English</div>,
  },
  {
    value: "Arabic",
    label: (
      <div style={{ fontFamily: "Noto Kufi Arabic" }}>
        عربي{" "}
        <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>
          (Arabic)
        </span>
      </div>
    ),
  },
  {
    value: "Chinese",
    label: (
      <div style={{ fontFamily: "Noto Sans TC" }}>
        中国人{" "}
        <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>
          (Chinese)
        </span>
      </div>
    ),
  },
  {
    value: "Farsi",
    label: (
      <div style={{ fontFamily: "Noto Kufi Arabic" }}>
        فارسی{" "}
        <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>
          (Farsi/Persian)
        </span>
      </div>
    ),
  },
  {
    value: "French",
    label: (
      <div style={{ fontFamily: "Noto Sans" }}>
        Français <span className="mx-2">(French)</span>
      </div>
    ),
  },
  {
    value: "Hebrew",
    label: (
      <div style={{ fontFamily: "Noto Sans Hebrew" }}>
        עִברִית{" "}
        <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>
          (Hebrew)
        </span>
      </div>
    ),
  },
  {
    value: "Hindi",
    label: (
      <div style={{ fontFamily: "Noto Sans Devanagari" }}>
        हिंदी{" "}
        <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>
          (Hindi)
        </span>
      </div>
    ),
  },
  {
    value: "Russian",
    label: (
      <div style={{ fontFamily: "Noto Sans" }}>
        Русский <span className="mx-2">(Russian)</span>
      </div>
    ),
  },
  {
    value: "Spanish",
    label: (
      <div style={{ fontFamily: "Noto Sans" }}>
        Español <span className="mx-2">(Spanish)</span>
      </div>
    ),
  },
  {
    value: "Urdu",
    label: (
      <div style={{ fontFamily: "Noto Kufi Arabic" }}>
        اردو{" "}
        <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>
          (Urdu)
        </span>
      </div>
    ),
  },
];

// LEAD SOURCE
export const source_options = (t) => [
  {
    value: "Facebook",
    label: `${t("source_facebook")}`,
  },
  {
    value: "Instagram",
    label: `${t("source_instagram")}`,
  },
  {
    value: "Snapchat",
    label: `${t("source_snapchat")}`,
  },
  {
    value: "TikTok",
    label: `${t("source_tiktok")}`,
  },
  {
    value: "GoogleAds",
    label: `${t("source_googleads")}`,
  },
  {
    value: "YouTube",
    label: `${t("source_youtube")}`,
  },
  {
    value: "Telegram",
    label: `${t("source_telegram")}`,
  },
  {
    value: "WeChat",
    label: `${t("source_wechat")}`,
  },
  {
    value: "Twitter",
    label: `${t("source_twitter")}`,
  },
  {
    value: "Campaign",
    label: `${t("source_campaign")}`,
  },
  {
    value: "WhatsApp",
    label: `${t("source_whatsapp")}`,
  },
  {
    value: "Comment",
    label: `${t("source_comment")}`,
  },
  {
    value: "Message",
    label: `${t("source_message")}`,
  },
  {
    value: "Website",
    label: `${t("source_website")}`,
  },
  // {
  //   value: "Secondary",
  //   label: `${t("source_secondary")}`,
  // },
  {
    value: "Property Finder",
    label: `${t("source_property_finder")}`,
  },
  {
    value: "Personal",
    label: `${t("source_personal")}`,
  },
];

// LEAD PURPOSE
export const purpose_options = (t) => [
  {
    value: "Investment",
    label: t("purpose_investment"),
  },
  {
    value: "End-user",
    label: t("purpose_end_user"),
  },
];

// PROPERTY TYPE
export const property_options = (t) => [
  {
    value: "Apartment",
    label: t("property_apartment"),
  },
  {
    value: "Villa",
    label: t("property_villa"),
  },
  {
    value: "Penthouse",
    label: t("property_penthouse"),
  },
  {
    value: "Mansion",
    label: t("property_mansion"),
  },
  {
    value: "Commercial",
    label: t("property_commercial"),
  },
  {
    value: "Townhouse",
    label: t("property_townhouse"),
  },
];

// ENQUIRY TYPE
export const enquiry_options = (t) => [
  {
    value: "Studio",
    label: t("enquiry_studio"),
  },
  {
    value: "1 Bedroom",
    label: t("enquiry_1bed"),
  },
  {
    value: "2 Bedrooms",
    label: t("enquiry_2bed"),
  },
  {
    value: "3 Bedrooms",
    label: t("enquiry_3bed"),
  },
  {
    value: "4 Bedrooms",
    label: t("enquiry_4bed"),
  },
  {
    value: "5 Bedrooms",
    label: t("enquiry_5bed"),
  },
  {
    value: "6 Bedrooms",
    label: t("enquiry_6bed"),
  },
  {
    value: "7 Bedrooms",
    label: t("enquiry_7bed"),
  },
  {
    value: "8 Bedrooms",
    label: t("enquiry_8bed"),
  },
  {
    value: "9 Bedrooms",
    label: t("enquiry_9bed"),
  },
  {
    value: "10 Bedrooms",
    label: t("enquiry_10bed"),
  },
  {
    value: "Retail",
    label: t("enquiry_retail"),
  },
  {
    value: "Other",
    label: t("enquiry_others"),
  },
];

// BATHROOM
export const bathroom_options = (t) => [
  {
    value: "1 Bathroom",
    label: t("bathroom_1"),
  },
  {
    value: "2 Bathrooms",
    label: t("bathroom_2"),
  },
  {
    value: "3 Bathrooms",
    label: t("bathroom_3"),
  },
  {
    value: "4 Bathrooms",
    label: t("bathroom_4"),
  },
  {
    value: "5 Bathrooms",
    label: t("bathroom_5"),
  },
  {
    value: "6 Bathrooms",
    label: t("bathroom_6"),
  },
  {
    value: "7 Bathrooms",
    label: t("bathroom_7"),
  },
  {
    value: "8 Bathrooms",
    label: t("bathroom_8"),
  },
  {
    value: "9 Bathrooms",
    label: t("bathroom_9"),
  },
  {
    value: "10 Bathrooms",
    label: t("bathroom_10"),
  },
  {
    value: "Unavailabe",
    label: t("label_unavailable"),
  },
];

// LISTING TYPE
export const listing_options = (t) => [
  {
    value: "Secondary",
    label: t("menu_secondary"),
  },
  {
    value: "Off-plan",
    label: t("category_off_plan"),
  },
];

// PROJECT STATUS
export const project_status_options = (t) => [
  {
    value: "Available",
    label: t("project_available"),
  },
  {
    value: "Sold Out",
    label: t("project_soldout"),
  },
];

// PRIORITY
export const priority_options = (t) => [
  {
    value: "High",
    label: t("priority_high"),
    icon: (
      <TbFlag3Filled size={16} className={`text-${priorityColors.High}-500`} />
    ),
  },
  {
    value: "Medium",
    label: t("priority_medium"),
    icon: (
      <TbFlag3Filled
        size={16}
        className={`text-${priorityColors.Medium}-500`}
      />
    ),
  },
  {
    value: "Low",
    label: t("priority_low"),
    icon: (
      <TbFlag3Filled size={16} className={`text-${priorityColors.Low}-500`} />
    ),
  },
];

// PRIORITY FLAGS
const priorityColors = {
  High: "red",
  Medium: "yellow",
  Low: "gray",
};
// PRIORITY ENDS

// INVENTORY STATUS
export const inventory_status = (t) => [
  {
    value: "Available",
    label: t("inventory_status_avail"),
  },
  {
    value: "Out Of Stock",
    label: t("inventory_status_stock"),
  },
];

// ORDER STATUS
export const order_status = (t) => [
  {
    value: "preparing",
    label: t("order_status_preparing"),
  },
  {
    value: "delivered",
    label: t("order_status_delivered"),
  },
  {
    value: "out of stock",
    label: t("order_status_out_of_stock"),
  },
  {
    value: "cancelled",
    label: t("order_cancel"),
  },
  {
    value: "pending",
    label: t("order_pending"),
  },
];
