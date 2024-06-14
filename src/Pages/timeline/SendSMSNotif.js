import React, { useState } from "react";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { boss } from "../../Components/_elements/SelectOptions";

export const sendSMSNotif = async (t, BACKEND_URL, data) => {
  console.log("sms data: ", data);
  const token = localStorage.getItem("auth-token");
  const phoneNumber = boss(t)?.find((boss) => boss?.id == 102)?.phone;
  console.log("phone number: ", phoneNumber);
  const smsData = {
    phone_number: phoneNumber,
    senderAddr: "AD-HIKAL",
    message: `Commission for ${data?.project} ${data?.enquiryType} unit ${data?.unit} ,has been received.`,
    type: "sms",
  };
  try {
    const sendSMS = await axios.post(`${BACKEND_URL}/otp`, smsData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    });

    console.log("sms response ", sendSMS);

    return { success: true, message: "SMS sent successfully" };
  } catch (error) {
    console.log("SMS Error: ", error);

    return {
      success: false,
      message: "Unable to send SMS notification",
      error: error,
    };
  }
};
