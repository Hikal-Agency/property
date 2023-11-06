import { useState } from "react";
import {
  CircularProgress,
  Modal,
  Backdrop,
  Button,
  IconButton,
} from "@mui/material";
import { BsCheckCircleFill } from "react-icons/bs";
import { useStateContext } from "../../context/ContextProvider";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const JoinMeeting = ({ newMeetingModal, handleClose }) => {
  const { 
    currentMode, 
    t, primaryColor,
    BACKEND_URL
} = useStateContext();
  const [isCopied, setIsCopied] = useState(false);
  const [redirectAnimation, setRedirectAnimation] = useState(false);

  const redirectToMeeting = () => {
    // setRedirectAnimation(true);
    window.open(newMeetingModal?.urlForModerator, "_blank");

    // setTimeout(() => {
    //   window.open(newMeetingModal?.urlForModerator, "_blank");
    //   setRedirectAnimation(false);
    // }, 2000);

    AddMeetLinkFunction(newMeetingModal?.mLeadId, newMeetingModal?.urlForAttendee);
  };

  const [ btnLoading, setBtnLoading ] = useState(false);

//   SEND MEET LINK 
  const AddMeetLinkFunction = async (
    mLeadId, meetLink
  ) => {
    setBtnLoading(true);

    const token = localStorage.getItem("auth-token");
    const AddLeadData = new FormData();
    AddLeadData.append("id", mLeadId);
    AddLeadData.append("meet_link", meetLink);

    await axios
    .post(`${BACKEND_URL}/leads/${mLeadId}`, AddLeadData, {
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
      setBtnLoading(false);

      // handleLeadModelClose();
      // FetchLeads(token);
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
      setBtnLoading(false);
    });
  };

  const copyLink = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(newMeetingModal?.urlForAttendee);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <>
      <Modal
        keepMounted
        open={newMeetingModal?.isOpen}
        onClose={handleClose}
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
          className={`w-[calc(100%-20px)] md:w-[65%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 pt-12 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleClose}
          >
            <IoMdClose size={18} />
          </IconButton>
          <div className="flex flex-col justify-center items-center mb-5">
            <BsCheckCircleFill size={50} className="text-primary text-2xl" />
            <h1 className="font-semibold pt-4 text-lg mt-2 mb-1">
              {t("live_call_meeting_created_shared")}
            </h1>
            <h1 className="font-semibold pt-4 text-lg mt-1 mb-2">
              {t("just_start")}
            </h1>
          </div>

          {/* <div className="flex justify-center items-center">
            <p className="pr-3">
              {newMeetingModal?.urlForAttendee?.slice(0, 80)}...
            </p>
            <Button
              onClick={copyLink}
              variant="outlined"
              className="py-3"
              style={{
                color: primaryColor,
              }}
            >
              {isCopied ? "Link Copied!" : "Copy Link"}
            </Button>
          </div> */}
          <div className="mt-3">
            <Button
              onClick={redirectToMeeting}
              variant="contained"
              fullWidth
              className="py-3 card-hover bg-btn-primary"
              style={{ color: "white" }}
            >
              {t("start")}
            </Button>
          </div>
        </div>
      </Modal>

      {redirectAnimation && (
        <div className="flex fixed z-[100000] bg-black text-white top-0 left-0 w-screen h-screen flex-col justify-center items-center">
          <h1 className="text-4xl mb-6">
            Redirecting you to the meeting
          </h1>
          <div id="fountainG">
            <div id="fountainG_1" className="fountainG"></div>
            <div id="fountainG_2" className="fountainG"></div>
            <div id="fountainG_3" className="fountainG"></div>
            <div id="fountainG_4" className="fountainG"></div>
            <div id="fountainG_5" className="fountainG"></div>
            <div id="fountainG_6" className="fountainG"></div>
            <div id="fountainG_7" className="fountainG"></div>
            <div id="fountainG_8" className="fountainG"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinMeeting;
