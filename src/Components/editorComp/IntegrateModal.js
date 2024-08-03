import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  MenuItem,
  // Select,
} from "@mui/material";

import { IoMdClose } from "react-icons/io";
import { GoDuplicate } from "react-icons/go";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const FormIntegrateModal = ({
  formIntegrateModal,
  setFormIntegrateModal,
  form_id,
  formName,
}) => {
  const { darkModeColors, currentMode, User, BACKEND_URL, t, primaryColor } =
    useStateContext();
  const [method, setMethod] = useState("inline-form");
  const currentURL = window.location.href;
  console.log(currentURL, "current url");

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Code is SuccessFully Copied ", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const embeddedCode = `<!-- Form Embed Code -->
         
          <iframe
      src="${currentURL}/${form_id}${
    method == "inline-form" ? "/inline" : "/popup"
  }"
      style="width: 100%; height: 100%; border: none; border-radius: 3px"
      id="inline-zy83GNDUe6vzmVzaiedv"
      data-layout="{'id':'INLINE'}"
      data-trigger-type="alwaysShow"
      data-trigger-value=""
      data-activation-type="alwaysActivated"
      data-activation-value=""
      data-deactivation-type="neverDeactivate"
      data-deactivation-value=""
      data-form-name=${formName}
      data-height="664"
      data-layout-iframe-id="inline-zy83GNDUe6vzmVzaiedv"
      data-form-id="zy83GNDUe6vzmVzaiedv"
      title=${formName}
    >
      Your browser does not support iframes.
    </iframe>
         `;

  return (
    <Modal
      keepMounted
      open={formIntegrateModal}
      onClose={() => setFormIntegrateModal(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div
        style={style}
        className={`w-[calc(30%-20px)] md:w-[45%]  ${
          // currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          currentMode === "dark"
            ? "bg-dark-neu text-white"
            : "bg-light text-black"
        } absolute top-1/2 left-1/2 p-5 rounded-md`}
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 12,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => setFormIntegrateModal(false)}
        >
          <IoMdClose size={18} />
        </IconButton>
        <div className="px-7 py-7">
          <h2 className="text-[25px] py-4">Integrate Your Form</h2>
          <p className="text-[14px] py-2">
            Congratulations! You've successfully built your form. Now, it's time
            to integrate it into your website or application. Choose one of the
            options below to get started.
          </p>
          {/* <h2>Step 1 choose one method </h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                id="inline-form"
                checked={method == "inline-form"}
                onChange={() => setMethod("inline-form")}
              />
              <label htmlFor="inline-form">Inline</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                id="popup"
                checked={method == "popup"}
                onChange={() => setMethod("popup")}
              />
              <label htmlFor="popup">Popup</label>
            </div>
          </div> */}

          <h3 className="text-[20px] py-4">Option 1: Embed Code</h3>
          <p className="text-[12px] py-2">
            Embed your form directly into your website with our simple embed
            code. Just copy the code below and paste it into your HTML where you
            want the form to appear.
          </p>

          <div className="flex justify-between py-4">
            <h4 className="text-[16px] ">Embed Code:</h4>
            <button onClick={() => copyToClipboard(embeddedCode)}>
              Copy Embed Code
            </button>
          </div>
          <p className="py-3">{embeddedCode}</p>
          <h3 className="text-[20px] py-4">Option 2: Shareable Link</h3>
          <p className="text-[14px] py-3">
            If you prefer to share a link to your form, we've got you covered.
            Simply copy the link below and share it with your audience
          </p>
          <h4 className="text-[16px] py-3">Shareable Link:</h4>
          <a
            target="blank"
            className="text-blue-500 underline cursor-pointer py-3"
            href={`${currentURL}/${form_id}`}
          >{`${currentURL}/${form_id}${
            method == "inline-form" ? "/inline" : "/popup"
          }`}</a>
        </div>
      </div>
    </Modal>
  );
};

export default FormIntegrateModal;
