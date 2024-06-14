// import axios from "../../axoisConfig";
import { boss } from "../../Components/_elements/SelectOptions";
import axios from "axios";

export const sendSMSNotif = async (t, BACKEND_URL, data, phoneNumber) => {
  console.log("sms data: ", data);
  const token = localStorage.getItem("auth-token");
  // const phoneNumber = boss(t)?.find((boss) => boss?.id == 102)?.phone;
  // const phoneNumber = "+971563110950";
  console.log("phone number: ", phoneNumber);
  const smsData = {
    phone_number: phoneNumber,
    senderAddr: "AD-HIKAL",
    message: `Commission for ${data?.project} ${data?.enquiryType} unit ${data?.unit}, has been received.`,
    type: "sms",
  };
  try {
    const sendSMS = await axios.post(`${BACKEND_URL}/otp`, smsData, {
      headers: {
        "Content-Type": "application/json",
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
