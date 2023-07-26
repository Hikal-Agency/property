import React, { useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import {
  Box,
  TextField,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Loader from "../../Components/Loader";
import { FiLink } from "react-icons/fi";
import { BsSnow2, BsPatchQuestion, BsFire, BsSun } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import moment from "moment";
// import axios from "axios";
import axios from "../../axoisConfig";
import { useParams } from "react-router-dom";
import Error404 from "../Error";

const SingleLeadPage = () => {
  const [loading, setloading] = useState(true);
  const [LeadData, setLeadData] = useState({});
  const [lastNote, setLastNote] = useState("");
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [LeadNotesData, setLeadNotesData] = useState(null);
  const [leadNotFound, setLeadNotFound] = useState(false);
  const [addNoteloading, setaddNoteloading] = useState(false);
  const { currentMode, setopenBackDrop, User, BACKEND_URL, darkModeColors, isArabic } =
    useStateContext();

  const { lid } = useParams();

  console.log("LID: ", lid);

  const handleRowClick = async (params) => {
    window.open(`/leadnotes/${params}`);
  };

  const fetchLeadNotes = async () => {
    const token = localStorage.getItem("auth-token");
    await axios
      .get(`${BACKEND_URL}/leadNotes/${lid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("lead notes are given below");
        console.log(result);
        setLeadNotesData(result.data);
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddNote = () => {
    setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");
    const data = {
      leadId: LeadData.id,
      leadNote: AddNoteTxt,
      addedBy: User?.id,
      // creationDate: moment(new Date()).format("YYYY/MM/DD"),
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
        fetchLeadNotes();
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

  const fetchSingleLead = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(`${BACKEND_URL}/leads/${lid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("SINGLE LEAD: ", result);
      setLeadData(result.data.data);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log("Error", error);
      if (error?.response?.status === 404) {
        setLeadNotFound(true);
      } else {
        toast.error("Something went wrong!", {
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
    }
  };
  useEffect(() => {
    console.log("Lead::", LeadData)
    if (LeadData?.id) {
      fetchLeadNotes();
      console.log(LeadData);
    }
  }, [LeadData]);

  useEffect(() => {
    setopenBackDrop(false);
    fetchSingleLead(lid);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Lead Notes</title>
        <meta name="description" content="Meetings - HIKAL CRM" />
      </Head> */}
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            {leadNotFound ? (
              <Error404 />
            ) : (
              <div className={`w-full pb-5`}>
                <div className="pl-3">
                  <div className="mt-3">
                    <h1
                      className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-red-600 font-bold border-red-600"
                      }`}
                    >
                      ● Lead Details{" "}
                      <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                        <span>{LeadData?.id}</span>
                      </span>
                    </h1>
                    {/* Lead Info */}
                    <div className="px-3">
                      <div className="grid grid-cols-5 mt-5 md:grid-cols-5 sm:grid-cols-1 gap-5">
                        <div className="col-span-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <h6
                                className={`font-bold ${
                                  currentMode === "dark"
                                    ? "text-white"
                                    : "text-black"
                                }`}
                              >
                                Lead name:
                              </h6>
                              <h6
                              style={{fontFamily: isArabic(LeadData?.leadName) ? "Noto Kufi Arabic" : "inherit"}}
                                className={`font-semibold ${
                                  currentMode === "dark"
                                    ? "text-white"
                                    : "text-black"
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
                                  currentMode === "dark"
                                    ? "text-white"
                                    : "text-black"
                                }`}
                              >
                                Contact details:
                              </h6>
                              <h6
                                className={`font-semibold ${
                                  currentMode === "dark"
                                    ? "text-white"
                                    : "text-black"
                                }`}
                              >
                                {LeadData?.leadContact}
                              </h6>
                              <h6
                                className={`font-semibold ${
                                  currentMode === "dark"
                                    ? "text-white"
                                    : "text-black"
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
                                  currentMode === "dark"
                                    ? "text-white"
                                    : "text-black"
                                }`}
                              >
                                Preferred language:
                              </h6>
                              <h6
                                className={`font-semibold ${
                                  currentMode === "dark"
                                    ? "text-white"
                                    : "text-black"
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
                            <Box className="float-right" sx={{
                              "& svg": {
                                color: currentMode === "dark" ? "white" : "black"
                              }
                            }}>
                              {LeadData?.coldcall === 0 ? (
                                <BsFire size={20} />
                              ) : LeadData?.coldcall === 1 ? (
                                <BsSnow2 size={20} />
                              ) : LeadData?.coldcall === 2 ? (
                                <HiOutlineUserCircle size={20} />
                              ) : LeadData?.coldcall === 3 ? (
                                <FiLink size={20} />
                              ) : LeadData?.coldcall === 4 ? (
                                <BsSun size={20} />
                              ) : (
                                <BsPatchQuestion size={25} />
                                // <FaHotjar size={25} />
                              )}
                            </Box>
                          </div>
                          <p
                            className={`text-sm ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            Lead added on {LeadData?.creationDate}
                          </p>
                          <p
                            className={`text-sm ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            Lead edited on{" "}
                            {LeadData?.lastEdited === ""
                              ? "-"
                              : LeadData?.lastEdited}
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
                          <h6 className="font-semibold">
                            {LeadData?.enquiryType}
                          </h6>
                        </div>
                        <div className="grid justify-center space-y-3 text-center">
                          <h6 className="font-bold">Property type</h6>
                          <h6 className="font-semibold">
                            {LeadData?.leadType}
                          </h6>
                        </div>
                        <div className="grid justify-center space-y-3 text-center">
                          <h6 className="font-bold">Purpose</h6>
                          <h6 className="font-semibold">{LeadData?.leadFor}</h6>
                        </div>
                      </div>
                      <div className="bg-main-red-color h-0.5 w-full my-5"></div>
                      <div className={`rounded-md my-5`}>
                        <h1 className="font-bold text-lg text-center my-2">
                          Lead Notes
                        </h1>

                        {LeadNotesData?.notes?.data?.length === 0 ? (
                          <p
                            className={`mt-3 italic ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-main-red-color"
                            }`}
                          >
                            No notes to show
                          </p>
                        ) : (
                          <TableContainer component={Paper}>
                            <Table
                              sx={{
                                minWidth: 650,
                                "& .MuiTableCell-root": {
                                  color: currentMode === "dark" && "white",
                                },
                              }}
                              size="small"
                              aria-label="simple table"
                            >
                              <TableHead
                                sx={{
                                  "& .MuiTableCell-head": {
                                    color: "white",
                                    fontWeight: "600",
                                  },
                                }}
                                className="bg-black"
                              >
                                <TableRow>
                                  <TableCell align="center">#</TableCell>
                                  <TableCell align="center">Added On</TableCell>
                                  <TableCell align="center">Added By</TableCell>
                                  <TableCell align="center">Note</TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody
                                sx={{
                                  "& .MuiTableRow-root:nth-of-type(odd)": {
                                    backgroundColor:
                                      currentMode === "dark" && "#212121",
                                  },
                                  "& .MuiTableRow-root:nth-of-type(even)": {
                                    backgroundColor:
                                      currentMode === "dark" && "#3b3d44",
                                  },
                                }}
                              >
                                {LeadNotesData?.notes?.data?.map(
                                  (row, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        "&:last-child td, &:last-child th": {
                                          border: 0,
                                        },
                                      }}
                                    >
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        align="center"
                                      >
                                        {index + 1}
                                      </TableCell>
                                      <TableCell align="center">
                                        {row?.creationDate}
                                      </TableCell>
                                      <TableCell align="center">
                                        {row?.userName}
                                      </TableCell>
                                      <TableCell align="left">
                                        <p style={{fontFamily: isArabic(row?.leadNote) ? "Noto Kufi Arabic" : "inherit"}}>{row?.leadNote}</p>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}

                        <form
                          className="mt-5"
                          onSubmit={(e) => {
                            e.preventDefault();
                            AddNote();
                          }}
                        >
                          <TextField
                            sx={{...darkModeColors, "& input": {
                              fontFamily: "Noto Kufi Arabic"
                            }}}
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
                  </div>
                </div>
              </div>
            )}
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default SingleLeadPage;
