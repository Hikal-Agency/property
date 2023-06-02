// import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiLink } from "react-icons/fi";
import { BsSnow2, BsPatchQuestion, BsFire, BsSun } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useStateContext } from "../../context/ContextProvider";
import { camelCase } from "lodash";

// import LeadNotes from "../LeadNotes/LeadNotes";
import axios from "axios";
import moment from "moment";
import { IoMdClose } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const SingleLead = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  LeadData,
}) => {
  const { darkModeColors, currentMode, User, BACKEND_URL } = useStateContext();
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [addNoteloading, setaddNoteloading] = useState(false);
  const [lastNote, setLastNote] = useState("");

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  // ROW CLICK FUNCTION
  const handleRowClick = async (params) => {
    window.open(`/leadnotes/${params}`);
  };

  const AddNote = () => {
    setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");
    console.log("lead data is");
    console.log(LeadData);

    // const now = moment();
    // const datetimeString = now.format("YYYY/MM/DD hh:mm:ss A");

    const data = {
      leadId: LeadData.lid,
      leadNote: AddNoteTxt,
      addedBy: User?.id,
      creationDate: moment(new Date()).format("YYYY/MM/DD"),
      // creationDate: datetimeString,
    };
    console.log("Data: ");
    console.log("Data: ", data);
    axios
      .post(`${BACKEND_URL}/leadNotes`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);
        setaddNoteloading(false);
        setAddNoteTxt("");
        toast.success("Note added Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // console.log(result);
      })
      .catch((err) => {
        setaddNoteloading(false);
        console.log(err);
        toast.error("Soemthing Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const fetchLastNote = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(
        `${BACKEND_URL}/lastnote/${LeadData?.lid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const lastNoteText = result.data?.notes?.data[0]?.leadNote;
      setLastNote(lastNoteText);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (LeadData?.lid) {
      fetchLastNote();
    }

    console.log(LeadData);
  }, [LeadData]);

  return (
    <>
      <ToastContainer />
      {console.log("lead data is")}
      {console.log(LeadData)}
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
          className={`w-[calc(100%-20px)] md:w-[900px]  ${
            currentMode === "dark" ? "bg-gray-900 text-white" : "bg-white"
          } absolute top-1/2 left-1/2 px-10 py-5 rounded-md`}
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
          {/* {console.log("lead data is")}
          {console.log(LeadData)} */}
          <h1
            className={`${
              currentMode === "dark" ? "text-red-600" : "text-red-600"
            } text-center font-bold text-xl pb-5`}
          >
            Lead details
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
                    Lead Name :
                  </h6>
                  <h6
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {LeadData?.leadName}
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
                    {LeadData?.leadContact}
                  </h6>
                  <h6
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {LeadData?.LeadEmail}
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
                  {LeadData?.feedback ?? "No Feedback"}
                </span>
                <span className="float-right">
                  {LeadData?.leadCategory === "hot" ? (
                    <BsFire size={25} />
                  ) : LeadData?.leadCategory === "cold" ? (
                    <BsSnow2 size={25} />
                  ) : LeadData?.leadCategory === "personal" ? (
                    <HiOutlineUserCircle size={25} />
                  ) : LeadData?.leadCategory === "thridparty" ? (
                    <FiLink size={25} />
                  ) : LeadData?.leadCategory === "warm" ? (
                    <BsSun size={25} />
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

          <div className="bg-main-red-color h-0.5 w-full mt-6 mb-4"></div>
          <div className="flex my-0 w-full">
            <Link sx={{ my: 0, w: "100%" }} to={`/lead/${LeadData?.lid}`}>
              <Button
                fullWidth
                sx={{ my: 0 }}
                variant="contained"
                color="error"
                size="medium"
              >
                View Lead Details
              </Button>
            </Link>
          </div>
          <div className={`rounded-md mt-2`}>
            {lastNote && (
              <Box className="bg-gray-300 rounded px-2 py-1 mt-3">
                {lastNote}
              </Box>
            )}
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

export default SingleLead;
