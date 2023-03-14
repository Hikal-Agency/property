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
      {console.log(UserData)}
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
                    Contact Details:
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
                    Preferred language:
                  </h6>
                  <h6
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {LeadData?.language}
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-span-2 space-y-2 text-right">
              <div className="mb-5 space-x-3">
                <span className="p-2 bg-main-red-color text-white rounded-md">
                  {LeadData?.feedback}
                </span>
                <span className="float-right">
                  {LeadData?.coldcall === "1" ? (
                    <BsSnow2 size={25} />
                  ) : LeadData?.coldcall === "2" ? (
                    <HiOutlineUserCircle size={25} />
                  ) : LeadData?.coldcall === "3" ? (
                    <FiLink size={25} />
                  ) : (
                    <BsPatchQuestion size={25} />
                    // <FaHotjar size={25} />
                  )}
                </span>
              </div>
              <p
                className={`italic text-sm ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                Lead added on {LeadData?.creationDate}
              </p>
              <p
                className={`italic text-sm ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                Lead edited on{" "}
                {LeadData?.lastEdited === "" ? "-" : LeadData?.lastEdited}
              </p>
            </div>
          </div>
          <div className="bg-main-red-color h-0.5 w-full my-7"></div>

          <div
            className={`${
              currentMode === "dark" ? "text-white" : "text-black"
            } grid grid-cols-4 md:grid-cols-4 sm:grid-cols-2 gap-5 `}
          >
            <div className="grid justify-center space-y-3 text-center">
              <h6 className="font-bold">Project</h6>
              <h6 className="font-semibold">{LeadData?.project}</h6>
            </div>
            <div className="grid justify-center space-y-3 text-center">
              <h6 className="font-bold">How many bedrooms?</h6>
              <h6 className="font-semibold">{LeadData?.enquiryType}</h6>
            </div>
            <div className="grid justify-center space-y-3 text-center">
              <h6 className="font-bold">Property type</h6>
              <h6 className="font-semibold">{LeadData?.leadType}</h6>
            </div>
            <div className="grid justify-center space-y-3 text-center">
              <h6 className="font-bold">Purpose</h6>
              <h6 className="font-semibold">{LeadData?.leadFor}</h6>
            </div>
          </div>

          <div className="bg-main-red-color h-0.5 w-full my-7"></div>
          <div className={`rounded-md mt-5`}>
            <h1 className="font-bold text-lg text-center">Lead Notes</h1>

            <button type="button" className="btn btn-sm p-2 text-main-red-color text-italic font-semibold"
              onClick={() => handleRowClick(LeadData.lid)}>View all notes</button>
            <form
              className="mt-5"
              onSubmit={(e) => {
                e.preventDefault();
                AddNote();
              }}
            >
              <TextField
                sx={darkModeColors}
                id="note"
                type={"text"}
                label="Your Note"
                className="w-full"
                variant="outlined"
                size="small"
                required
                value={AddNoteTxt}
                onChange={(e) => setAddNoteTxt(e.target.value)}
              />

              <button
                disabled={addNoteloading ? true : false}
                type="submit"
                className="mt-3 disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-main-red-color p-1 text-white hover:bg-main-red-color-2 focus:outline-none focus:ring-2 focus:ring-main-red-color-2 focus:ring-offset-2 text-md font-bold uppercase"
              >
                {addNoteloading ? (
                  <CircularProgress
                    sx={{ color: "white" }}
                    size={25}
                    className="text-white"
                  />
                ) : (
                  <span>Add Note</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SingleUser;
