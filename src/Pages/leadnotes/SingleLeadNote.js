import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import moment from "moment/moment";

import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { GrMail } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../Components/Footer/Footer";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";

const SingleLeadNote = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const leadId = location.pathname.split("/")[2];
  const [loading, setloading] = useState(true);
  const [addNoteloading, setaddNoteloading] = useState(false);
  const [LeadData, setLeadData] = useState();
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const { currentMode, setUser, darkModeColors, User, BACKEND_URL } =
    useStateContext();

  const fetchLead = async () => {
    const token = localStorage.getItem("auth-token");
    await axios
      .get(`${BACKEND_URL}/leadNotes/${leadId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("lead notes are given below");
        console.log(result);
        setLeadData(result.data);
        setloading(false);
      })
      .catch((err) => console.log(err));
  };
  const FetchProfile = async () => {
    const token = localStorage.getItem("auth-token");
    await axios
      .get(`${BACKEND_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setUser(result.data.user[0]);
        fetchLead();
      })
      .catch((err) => {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again " },
        });
      });
  };
  const AddNote = () => {
    setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");
    const data = {
      leadId: location.pathname.split("/")[2],
      leadNote: AddNoteTxt,
      addedBy: User?.id,
      creationDate: moment(new Date()).format("YYYY/MM/DD"),
    };
    console.log(data);
    axios
      .post(`${BACKEND_URL}/leadNotes`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
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
        console.log(result);
        fetchLead();
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
  useEffect(() => {
    FetchProfile();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Lead Note</title>
        <meta name="description" content="User Dashboard - HIKAL CRM" />
      </Head> */}
      <ToastContainer />
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="flex">
              <Sidebarmui />
              <div className={`w-full`}>
                <div className="px-5 ">
                  <Navbar />
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-main-dark-bg-2 text-white"
                        : "bg-white"
                    }  px-10 py-10 mt-5 mb-10 rounded-md`}
                  >
                    <h1 className="text-center font-bold text-4xl mb-2 ">
                      Lead Notes Detail
                    </h1>
                    <span className="block h-1 w-16 bg-main-red-color mx-auto rounded-md"></span>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-3">
                          <h1
                            className={`text-lg font-bold ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            Lead Name:
                          </h1>
                          <h1
                            className={`text-lg font-semibold ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-main-red-color-2"
                            }`}
                          >
                            {LeadData?.info?.lead}
                          </h1>
                        </div>
                        <div className="flex space-x-3">
                          <Button className="bg-main-red-color rounded-md px-2 py-2 shadow-none hover:shadow-none">
                            <GrMail size={22} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-3">
                          <h1
                            className={`text-lg font-bold ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            Feedback:
                          </h1>
                          <h1
                            className={`text-lg font-semibold ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-main-red-color-2"
                            }`}
                          >
                            {LeadData?.feedback}
                          </h1>
                        </div>
                        <div className="flex space-x-3">
                          <p
                            className={`italic ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-main-red-color"
                            }`}
                          >
                            Lead added on {LeadData?.info?.lead_date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-3">
                          <h1
                            className={`text-lg font-bold ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            Project:
                          </h1>
                          <h1
                            className={`text-lg font-semibold ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-main-red-color-2"
                            }`}
                          >
                            {LeadData?.info?.project} {LeadData?.info?.enquiry}
                          </h1>
                        </div>
                        <div className="flex space-x-3">
                          <p
                            className={`italic ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-main-red-color"
                            }`}
                          >
                            Last edited on {LeadData?.lastEdited}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <h1
                          className={`text-lg font-bold ${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          Consultant:
                        </h1>
                        <h1
                          className={`text-lg font-semibold ${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-main-red-color-2"
                          }`}
                        >
                          {LeadData?.info?.property_consultant}
                        </h1>
                      </div>
                    </div>
                    <div className="mt-7 flex items-center justify-between border-t-2 border-main-red-color rounded-md shadow-md px-5 py-2">
                      <div className="flex space-x-3">
                        <h1
                          className={`text-lg font-bold capitalize ${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          Lead Status:
                        </h1>
                        <h1
                          className={`text-lg font-semibold capitalize ${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-main-red-color-2"
                          }`}
                        >
                          {LeadData?.leadStatus}
                        </h1>
                      </div>
                      <div className="flex space-x-3">
                        <h1
                          className={`text-lg font-bold capitalize ${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          Lead Category:
                        </h1>
                        <h1
                          className={`text-lg font-semibold capitalize ${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-main-red-color-2"
                          }`}
                        >
                          {LeadData?.leadCategory}
                        </h1>
                      </div>
                      <div className="flex space-x-3">
                        <h1
                          className={`text-lg font-bold capitalize ${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          Language Preferred:
                        </h1>
                        <h1
                          className={`text-lg font-semibold capitalize ${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-main-red-color-2"
                          }`}
                        >
                          {LeadData?.info?.language}
                        </h1>
                      </div>
                    </div>
                    <div className="mt-7 border-t-2 border-main-red-color rounded-md shadow-md px-5 py-3">
                      <h1 className="font-bold text-lg">Lead Notes</h1>
                      <span className="block h-1 w-16 my-1 bg-main-red-color rounded-md"></span>
                      {LeadData?.notes?.data?.length > 0 ? (
                        <Box className="">
                          <form
                            className="my-5"
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
                              size="medium"
                              required
                              value={AddNoteTxt}
                              onChange={(e) => setAddNoteTxt(e.target.value)}
                            />

                            <button
                              disabled={addNoteloading ? true : false}
                              type="submit"
                              className="mt-3 disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-fit justify-center rounded-md border border-transparent bg-main-red-color py-2 px-5 text-white hover:bg-main-red-color-2 focus:outline-none focus:ring-2 focus:ring-main-red-color-2 focus:ring-offset-2 text-md font-bold uppercase"
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
                                className="bg-main-red-color"
                              >
                                <TableRow>
                                  <TableCell align="left">No#</TableCell>
                                  <TableCell align="left">Added On</TableCell>
                                  <TableCell align="left">Added By</TableCell>
                                  <TableCell align="left"> Note</TableCell>
                                  <TableCell align="left">Actions</TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody
                                sx={{
                                  "& .MuiTableRow-root:nth-of-type(odd)": {
                                    backgroundColor:
                                      currentMode === "dark" && "#4f5159",
                                  },
                                  "& .MuiTableRow-root:nth-of-type(even)": {
                                    backgroundColor:
                                      currentMode === "dark" && "#3b3d44",
                                  },
                                }}
                              >
                                {LeadData.notes.data.map((row, index) => (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}
                                  >
                                    <TableCell component="th" scope="row">
                                      {index + 1}
                                    </TableCell>
                                    <TableCell align="left">
                                      {row?.creationDate}
                                    </TableCell>
                                    <TableCell align="left">
                                      {row?.userName}
                                    </TableCell>
                                    <TableCell align="left">
                                      {row?.leadNote}
                                    </TableCell>
                                    <TableCell align="left">
                                      <div className="space-x-2  w-full flex items-center ">
                                        <Button
                                          // onClick={() =>
                                          //   HandleEditFunc(cellValues)
                                          // }
                                          className="bg-main-red-color rounded-md px-1 py-1 shadow-none hover:shadow-none hover:scale-125"
                                        >
                                          <BiEdit size={20} />
                                        </Button>

                                        <Button
                                          // onClick={() => deleteLead(cellValues)}
                                          // disabled={deleteloading ? true : false}
                                          className="bg-main-red-color rounded-md px-1 py-1 deleteLeadBtn shadow-none hover:shadow-none hover:scale-125"
                                        >
                                          <MdDeleteOutline size={22} />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      ) : (
                        <p
                          className={`mt-3 italic ${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-main-red-color"
                          }`}
                        >
                          No notes to show
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default SingleLeadNote;
