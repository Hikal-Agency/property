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
    bgColor: "#BEEDF1",
    color: "#000000",
  },
  {
    value: "Callback",
    label: t("feedback_callback"),
    bgColor: "#FFED9A",
    color: "#000000",
  },
  {
    value: "Follow Up (Short Term)",
    label: t("feedback_follow_up_short_term"),
    bgColor: "#FFF799",
    color: "#000000",
  },
  {
    value: "Follow Up (Long Term)",
    label: t("feedback_follow_up_long_term"),
    bgColor: "#FFDD99",
    color: "#000000",
  },
  {
    value: "Low Budget",
    label: t("feedback_low_budget"),
    bgColor: "#FDC68C",
    color: "#000000",
  },
  {
    value: "Meeting",
    label: t("feedback_meeting"),
    bgColor: "#C6DF9C",
    color: "#000000",
  },
  {
    value: "Booked",
    label: t("feedback_booked"),
    bgColor: "#81CA9D",
    color: "#000000",
  },
  {
    value: "No Answer",
    label: t("feedback_no_answer"),
    bgColor: "#FFBEBD",
    color: "#000000",
  },
  {
    value: "Switched Off",
    label: t("feedback_switched_off"),
    bgColor: "#F7977A",
    color: "#000000",
  },
  {
    value: "Not Interested",
    label: t("feedback_not_interested"),
    bgColor: "#F16C4D",
    color: "#000000",
  },
  {
    value: "Unreachable",
    label: t("feedback_unreachable"),
    bgColor: "#898989",
    color: "#000000",
  },
  {
    value: "Wrong Number",
    label: t("feedback_wrong_number"),
    bgColor: "#7D7D7D",
    color: "#000000",
  },
  {
    value: "Duplicate",
    label: t("feedback_duplicate"),
    bgColor: "#707070",
    color: "#000000",
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

// TICKET STATUS
export const ticket_status = (t) => [
  {
    value: "initiated",
    label: t("status_initiated"),
  },
  {
    value: "open",
    label: t("status_open"),
  },
  {
    value: "in process",
    label: t("status_in_process"),
  },
  {
    value: "closed",
    label: t("status_closed"),
  },
  {
    value: "resolved",
    label: t("status_resolved"),
  },
  {
    value: "transferred",
    label: t("status_transferred"),
  },
];

// TICKET SOURCE
export const ticket_source = (t) => [
  {
    value: "Email",
    label: t("support_via_email"),
  },
  {
    value: "Video Call",
    label: t("support_via_video_call"),
  },
  {
    value: "Phone Call",
    label: t("support_via_call"),
  },
  {
    value: "WhatsApp Chat",
    label: t("support_via_whatsapp"),
  },
];

// CURRENCIES
export const currencies = (t) => [
  {
    value: "AED",
    label: t("uae_currency"),
  },
  {
    value: "EGP",
    label: t("egp_currency"),
  },
  {
    value: "USD",
    label: t("usa_currency"),
  },
  {
    value: "PKR",
    label: t("pak_currency"),
  },
  // {
  //   value: "INR",
  //   label: t("india_currency"),
  // },
  // {
  //   value: "NPR",
  //   label: t("nepal_currency"),
  // },
  // {
  //   value: "GBP",
  //   label: t("uk_currency"),
  // },
  // {
  //   value: "JPY",
  //   label: t("japan_currency"),
  // },
  // {
  //   value: "CNY",
  //   label: t("china_currency"),
  // },
  // {
  //   value: "AUD",
  //   label: t("australia_currency"),
  // },
  // {
  //   value: "CAD",
  //   label: t("canada_currency"),
  // },
];

// CLAIM
export const claim = (t) => [
  {
    value: "First claim",
    label: t("claim_1"),
  },
  {
    value: "Second claim",
    label: t("claim_2"),
  },
  {
    value: "Third claim",
    label: t("claim_3"),
  },
  {
    value: "Full claim",
    label: t("full_claim"),
  },
];

// PAYMENT SOURCE
export const payment_source = (t) => [
  {
    value: "Bank transfer",
    label: t("form_account_bank"),
  },
  {
    value: "Cheque",
    label: t("payment_source_cheque"),
  },

  {
    value: "Cash",
    label: t("payment_source_cash"),
  },
];

// TRANSACTION TYPE
export const transaction_type = (t) => [
  {
    value: "Booking",
    label: t("booking"),
  },
  {
    value: "PDC",
    label: t("pdc"),
  },

  {
    value: "SPA",
    label: t("spa"),
  },
];

// COMMISSION TYPE
export const commission_type = (t) => [
  {
    value: "Income",
    label: t("income"),
  },
  {
    value: "Expense",
    label: t("expense"),
  },
];

// PAYMENT STATUS
export const payment_status = (t) => [
  {
    value: "Paid",
    label: t("payment_paid"),
  },
  {
    value: "Unpaid",
    label: t("payment_unpaid"),
  },
];

//  INVOICES COUNTRIES
export const countries_list = (t) => [
  {
    value: "UAE",
    label: t("country_uae"),
  },
  {
    value: "Egypt",
    label: t("country_eqypt"),
  },
  {
    value: "Pakistan",
    label: t("country_pakistan"),
  },
];

//  INVOICES CATEGORIES
export const invoice_category = (t) => [
  {
    value: "Purchase",
    label: t("purchase"),
  },
  {
    value: "Salary",
    label: t("label_salary"),
  },
];

//  VENDOR TYPES
export const vendor_type = (t) => [
  {
    value: "Developer",
    label: t("form_developer_name"),
  },
  {
    value: "Supermarket",
    label: t("vendor_type_market"),
  },
  {
    value: "Agency",
    label: t("vendor_type_agency"),
  },
  {
    value: "Supplier",
    label: t("vendor_type_supplier"),
  },
  {
    value: "Car wash",
    label: t("vendor_type_car_wash"),
  },
  {
    value: "Fuel Station",
    label: t("vendor_type_fuel"),
  },
];
