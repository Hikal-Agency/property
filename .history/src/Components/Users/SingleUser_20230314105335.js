// import { Button } from "@material-tailwind/react";
import { Backdrop, CircularProgress, Modal, TextField } from "@mui/material";
import React, { useState } from "react";
import { FaHotjar } from "react-icons/fa";
import { MdOutlineIndeterminateCheckBox } from "react-icons/md";
import { FiLink } from "react-icons/fi";
import { BsSnow2, BsPatchQuestion } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useStateContext } from "../../context/ContextProvider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// import LeadNotes from "../LeadNotes/LeadNotes";
import Paper from "@mui/material/Paper";
import axios from "axios";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";

const SingleUser = ({
  UserModelOpen,
  setUserModelOpe,
  handleUserModelOpen,
  handleUserModelClose,
  UserData,
}) => {
  const { darkModeColors, currentMode, User, BACKEND_URL } = useStateContext();

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  return (
    <>
      <ToastContainer />
      {console.log("user data is")}
      {/* {console.log(UserData)} */}
      <Modal
        keepMounted
        open={UserModelOpen}
        onClose={handleUserModelClose}
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
          className={`w-[calc(100%-20px)] md:w-[900px]  ${
            currentMode === "dark" ? "bg-gray-900 text-white" : "bg-white"
          } absolute top-1/2 left-1/2 p-10 rounded-md`}
        >
          {/* {console.log("lead data is")}
          {console.log(LeadData)} */}
          <h1
            className={`${
              currentMode === "dark" ? "text-red-600" : "text-red-600"
            } text-center font-bold text-xl pb-5`}
          >
            User details
          </h1>
          <div className="grid grid-cols-5 md:grid-cols-5 sm:grid-cols-1 gap-5">
            <div className="col-span-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <h6
                    className={`font-bold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    User Name:
                  </h6>
                  <h6
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    NAME_OF_THE_USER
                  </h6>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <h6
                    className={`font-bold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Contact Number:
                  </h6>
                  <h6
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    CONTACT_NUMBER
                  </h6>
                  <h6
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    ALTERNATIVE_CONTACT_NUMBER
                  </h6>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <h6
                    className={`font-bold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Email Address:
                  </h6>
                  <h6
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    EMAIL_ADDRESS
                  </h6>
                  <h6
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    ALTERNATIVE_EMAIL_ADDRESS
                  </h6>
                </div>
              </div>
            </div>
            
          </div>
          <div className="bg-main-red-color h-0.5 w-full my-7"></div>

        </div>
      </Modal>
    </>
  );
};

export default SingleUser;
