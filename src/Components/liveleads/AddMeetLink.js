import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  Tooltip
} from "@mui/material";

import axios from "../../axoisConfig";
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import "react-phone-number-input/style.css";
import { datetimeLong } from "../_elements/formatDateTime";
import { MdAddLink } from "react-icons/md";


const AddMeetLink = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  LeadData,
  FetchLeads,
}) => {
  console.log("Single Lead: ", LeadData);
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    setSalesPerson: setAllSalesPersons,
    SalesPerson: AllSalesPersons,
    formatNum,
  } = useStateContext();
  const [value, setValue] = useState();
  const [loading, setloading] = useState(true);
  const [btnloading, setbtnloading] = useState(false);
  const [MeetLink, setMeetLink] = useState("");

  const [error, setError] = useState(false);
  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const [timeDifference, setTimeDifference] = useState(null);
  useEffect(() => {
    if (LeadData?.meet_link === null || LeadData?.meet_link === "" || LeadData?.meet_link === "null") {
      const currentTime = new Date();
      const creationDate = new Date(LeadData?.creationDate);
      const diff = (currentTime - creationDate) / (1000 * 60); // Convert milliseconds to minutes

      setTimeDifference(diff);
      
      const interval = setInterval(() => {
        const currentTime = new Date();
        const creationDate = new Date(LeadData?.creationDate);
        const diff = (currentTime - creationDate) / (1000 * 60); // Convert milliseconds to minutes

        setTimeDifference(diff);

        if (diff > 9) {
          // If time difference is greater than 9 minutes, stop checking
          clearInterval(interval);
        }
      }, 5000); // Check every 5 seconds

      // Clear the interval when the component is unmounted
      return () => clearInterval(interval);
    }
  }, [LeadData?.meet_link, LeadData?.creationDate]);

  const AddMeetLinkFunction = async () => {
    setbtnloading(true);

    const token = localStorage.getItem("auth-token");
    // const creationDate = new Date();
    const AddLeadData = new FormData();
    AddLeadData.append("id", LeadData.leadId);
    AddLeadData.append("meet_link", MeetLink);

    await axios
      .post(`${BACKEND_URL}/leads/${LeadData.leadId}`, AddLeadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Meeting link sent successfully!");
        console.log(result);
        toast.success("Meeting link sent successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
        handleLeadModelClose();
        FetchLeads(token);
      })
      .catch((err) => {
        toast.error("Error in sending meeting link", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
      });
  };
  return (
    <>
      {/* MODAL FOR SINGLE LEAD SHOW */}
      <Modal
        keepMounted
        open={LeadModelOpen}
        onClose={handleLeadModelClose}
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
          className={`w-[calc(100%-20px)] md:w-[50%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-4 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleLeadModelClose}
          >
            <IoMdClose size={18} />
          </IconButton>
          <div className="w-full flex items-center pb-3">
            <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
            <h1
              className={`mr-2 text-lg font-semibold ${
                currentMode === "dark"
                  ? "text-white"
                  : "text-black"
              }`}
            >
              Meeting Link
            </h1>
            {LeadData.meet_link === null || LeadData.meet_link === "" || LeadData.meet_link === "null" ? (
              timeDifference <= 9 && (
                <Tooltip title="Create Meeting Link" arrow>
                  <button className="bg-primary text-white mx-2 rounded-full p-2 text-sm font-semibold">
                    <MdAddLink size={16} />
                  </button>
                </Tooltip>
              )
            ) : (
              <></>
            )}
          </div>
          {LeadData.meet_link === null || LeadData.meet_link === "" || LeadData.meet_link === "null" ? (
            timeDifference <= 9 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  AddMeetLinkFunction();
                }}
              >
                <div className="text-[#AAAAAA] text-sm pb-3 w-full text-center">
                  Create a meeting, then copy the invite link and paste it here to invite your client for the live meeting!
                </div>
                <Box sx={darkModeColors} className="my-3">
                  <TextField
                    id="MeetLink"
                    type={"text"}
                    label="Meeting Link"
                    className="w-full"
                    variant="outlined"
                    size="small"
                    multiline
                    minRows={2}
                    required
                    value={MeetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                  />
                </Box>
                <Button
                  className={`min-w-fit w-full mt-3 text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-btn-primary`}
                  ripple={true}
                  size="lg"
                  style={{color: "white"}}
                  type="submit"
                  disabled={btnloading ? true : false}
                >
                  {btnloading ? (
                    <div className="flex items-center justify-center space-x-1">
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    </div>
                  ) : (
                    <span>Send Meeting Link</span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="w-full p-5 pt-0 text-center text-[#AAAAAA] font-semibold">
                The waiting time for the lead has been expired!
                <br /><br />
                Please try to reach out the lead through other mediums as soon as possible.
                <br /><br />
                The lead registerd for the live call on {datetimeLong(LeadData?.creationDate)}.
              </div>
            )
          ) : (
            <div className="w-full p-5 pt-0 text-center">
              The meet link has been already sent!
              <br />
              <br />
              <span className="text-primary font-semibold">
                {LeadData?.meet_link}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AddMeetLink;
