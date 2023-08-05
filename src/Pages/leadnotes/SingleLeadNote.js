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

import axios from "../../axoisConfig";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import Error from "../Error";

const SingleLeadNote = (props) => {
  const location = useLocation();
  const leadId = location.pathname.split("/")[2];
  const [loading, setloading] = useState(true);
  const [addNoteloading, setaddNoteloading] = useState(false);
  const [LeadData, setLeadData] = useState();
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [error404, setError404] = useState(false);
  const { currentMode, darkModeColors, User, BACKEND_URL } = useStateContext();

  console.log("ID: ", leadId);

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
      .catch((err) => {
        if (err.response.status === 404) {
          setError404(true);
          setloading(false);
        } else {
          console.log(err);
        }
      });
  };

  const AddNote = () => {
    setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");
    const data = {
      leadId: location.pathname.split("/")[2],
      leadNote: AddNoteTxt,
      addedBy: User?.id,
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
    if (leadId) {
      fetchLead();
    }
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Lead Note</title>
        <meta name="description" content="User Dashboard - HIKAL CRM" />
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
            {error404 ? (
              <Error />
            ) : (
              <div className={`w-full`}>
                <div className="px-5 ">
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-black text-white"
                        : "bg-white"
                    }  px-10 py-10 mt-5 mb-10`}
                  >
                    <h1
                      className={`${
                        currentMode === "dark" ? "text-red-600" : "text-red-600"
                      } text-center font-bold text-2xl pb-5`}
                    >
                      Lead details and notes
                    </h1>
                    <div className="grid grid-cols-5 md:grid-cols-5 sm:grid-cols-1 gap-5">
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
                              Lead Name:
                            </h6>
                            <h6
                              className={`font-semibold ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                            >
                              {LeadData?.info?.lead}
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
                              Contact Details:
                            </h6>
                            <h6
                              className={`font-semibold ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                            >
                              {LeadData?.info?.leadContact}
                            </h6>
                            <h6
                              className={`font-semibold ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                            >
                              {LeadData?.info?.LeadEmail}
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
                              {LeadData?.info?.language}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 space-y-2 text-right">
                        <div className="mb-5 space-x-3">
                          <span className="p-2 bg-main-red-color text-white rounded-md">
                            {LeadData?.info?.feedback}
                          </span>
                        </div>
                        <p
                          className={`italic text-sm ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          Lead added on {LeadData?.info?.lead_date}
                        </p>
                        <p
                          className={`italic text-sm ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          Lead edited on{" "}
                          {LeadData?.info?.last_edited === ""
                            ? "-"
                            : LeadData?.info?.last_edited}
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
                        <h6 className="font-semibold">
                          {LeadData?.info?.project}
                        </h6>
                      </div>
                      <div className="grid justify-center space-y-3 text-center">
                        <h6 className="font-bold">How many bedrooms?</h6>
                        <h6 className="font-semibold">
                          {LeadData?.info?.category}
                        </h6>
                      </div>
                      <div className="grid justify-center space-y-3 text-center">
                        <h6 className="font-bold">Property type</h6>
                        <h6 className="font-semibold">
                          {LeadData?.info?.leadType}
                        </h6>
                      </div>
                      <div className="grid justify-center space-y-3 text-center">
                        <h6 className="font-bold">Purpose</h6>
                        <h6 className="font-semibold">
                          {LeadData?.info?.leadFor}
                        </h6>
                      </div>
                    </div>

                    <div className="bg-main-red-color h-0.5 w-full my-7"></div>

                    <div className={`rounded-md mt-5`}>
                      <h1 className="font-bold text-lg text-center">
                        Lead Notes
                      </h1>

                      <Box className="">
                        <form
                          className="mb-10 mt-5"
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
                            className="my-3 disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-main-red-color py-1 px-5 text-white hover:bg-main-red-color-2 focus:outline-none focus:ring-2 focus:ring-main-red-color-2 focus:ring-offset-2 text-md font-bold uppercase"
                          >
                            {addNoteloading ? (
                              <CircularProgress
                                sx={{ color: "white" }}
                                size={25}
                                className="text-white"
                              />
                            ) : (
                              <span>Add new note</span>
                            )}
                          </button>
                        </form>
                        {error404 || LeadData?.notes?.data?.length === 0 ? (
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
                                  <TableCell align="center"></TableCell>
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
                                {LeadData.notes.data.map((row, index) => (
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
                                      {row?.leadNote}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Box>
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

export default SingleLeadNote;
