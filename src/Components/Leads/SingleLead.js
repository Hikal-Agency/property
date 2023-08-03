// import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  IconButton,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

import axios from "../../axoisConfig";
import BlockIPModal from "./BlockIPModal";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { BiBlock } from "react-icons/bi";
import { BsPersonVcard } from "react-icons/bs";
import { Link } from "react-router-dom";

const SingleLead = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  LeadData,
  lead_origin,
  setLeadData,
}) => {
  const { darkModeColors, currentMode, User, BACKEND_URL, isArabic } =
    useStateContext();
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [addNoteloading, setaddNoteloading] = useState(false);
  const [lastNote, setLastNote] = useState("");
  const [lastNoteDate, setLastNoteDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [blockIPModalOpened, setBlockIPModalOpened] = useState({
    lead: null,
    isOpened: false,
  });

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const FetchLead = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(`${BACKEND_URL}/leads/${LeadData}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("leads: ", result);

      setLeadData(result?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const AddNote = ({ note = "" }) => {
    setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");

    const data = {
      leadId: LeadData.leadId || LeadData.id,
      leadNote: note || AddNoteTxt,
      addedBy: User?.id,
    };
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
        if (!note) {
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
        }
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
        `${BACKEND_URL}/lastnote/${LeadData?.leadId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const lastNoteText = result.data?.notes?.data[0]?.leadNote;
      const lastNoteDate = result.data?.notes?.data[0]?.creationDate;
      setLastNote(lastNoteText);
      setLastNoteDate(lastNoteDate);
    } catch (error) {
      console.log(error);
    }
  };

  const HandleBlockIP = async (params) => {
    setBlockIPModalOpened({
      lead: params,
      isOpened: true,
    });
  };

  useEffect(() => {
    if (LeadData?.leadId) {
      fetchLastNote();
    }

    console.log("leaddata: ", LeadData);

    if (typeof LeadData === "number") {
      FetchLead(LeadData);
    }

    console.log("LeadData::", LeadData);
  }, [LeadData]);

  return (
    <>
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
            } text-center font-bold text-lg pb-5`}
          >
            Lead details
          </h1>
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-5 md:grid-cols-5 sm:grid-cols-1 gap-5">
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <h6
                        className={`font-bold ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Lead name:
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
                        Contact details:
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
                  </div>
                  <p
                    className={` text-sm ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Lead added on {LeadData?.creationDate}
                  </p>
                  <p
                    className={` text-sm ${
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
                  <h6 className="font-bold">Enquiry about</h6>
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
              <div className="flex mb-6 justify-end items-center mt-0 w-full">
                {lead_origin === "freshleads" &&
                  LeadData?.ip &&
                  LeadData?.is_blocked !== 1 && (
                    <div className="flex items-center mr-3 justify-end">
                      <p
                        style={{ cursor: "pointer", display: "inline-block" }}
                        className={`${
                          currentMode === "dark"
                            ? "bg-transparent text-white rounded-md shadow-none"
                            : "bg-transparent text-black rounded-md shadow-none"
                        }`}
                        onClick={() => HandleBlockIP(LeadData)}
                      >
                        <Tooltip title="Block IP">
                          <IconButton
                            sx={{
                              padding: 0,
                              "& svg": {
                                color: "red !important",
                              },
                            }}
                          >
                            <BiBlock size={19} />
                          </IconButton>
                        </Tooltip>
                      </p>
                    </div>
                  )}
                <Link
                  sx={{ my: 0, w: "100%" }}
                  to={`/lead/${LeadData?.leadId || LeadData?.id}`}
                  target="_blank"
                >
                  <Button
                    fullWidth
                    sx={{ my: 0 }}
                    variant="contained"
                    color="error"
                    size="medium"
                  >
                    View Lead Details
                  </Button>

                  {/* <Tooltip title="View Lead Dettails" arrow>
                    <Button
                      className="rounded-full"
                      sx={{
                        "& svg": {
                          color:
                            currentMode === "dark"
                              ? "white !important"
                              : "black !important",
                        },
                      }}
                    >
                      <BsPersonVcard size={18}/>
                    </Button>
                  </Tooltip> */}
                </Link>
              </div>
              <div className={`rounded-md mt-2`}>
                {lastNote && (
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "text-white bg-black border-gray-800"
                        : "text-black bg-gray-200 border-gray-300"
                    } border-2 flex items-center my-2 w-full rounded-md`}
                  >
                    <p className="px-2 py-2 mx-1 text-center text-sm">
                      {lastNoteDate}
                    </p>
                    <div className="bg-main-red-color h-10 w-0.5"></div>
                    <p
                      style={{
                        fontFamily: isArabic(lastNote)
                          ? "Noto Kufi Arabic"
                          : "inherit",
                      }}
                      className="px-2 py-2 mx-1"
                    >
                      {lastNote}
                    </p>
                  </div>
                )}
                <form
                  className="mt-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    AddNote();
                  }}
                >
                  <TextField
                    sx={{
                      ...darkModeColors,
                      "& input": {
                        fontFamily: "Noto Kufi Arabic",
                      },
                    }}
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
            </>
          )}
        </div>
      </Modal>
      <BlockIPModal
        addNote={AddNote}
        blockIPModalOpened={blockIPModalOpened?.isOpened}
        handleCloseIPModal={() =>
          setBlockIPModalOpened({
            isOpened: false,
            lead: null,
          })
        }
        lead={LeadData}
      />
    </>
  );
};

export default SingleLead;
