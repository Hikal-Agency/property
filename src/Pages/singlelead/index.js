import React, { 
  useEffect, 
  useState 
} from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
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

import axios from "../../axoisConfig";
import Error404 from "../Error";
import usePermission from "../../utils/usePermission";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";

import { 
  BiImport,
  BiMessageRoundedDots,
  BiArchive
} from "react-icons/bi";
import { 
  BsSnow2, 
  BsPatchQuestion, 
  BsFire, 
  BsSun,
  BsPersonCircle
} from "react-icons/bs";
import {
  FaSnapchatGhost,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
  FaTwitter,
  FaRegComments,
  FaUser
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLink } from "react-icons/fi";
import { GiMagnifyingGlass } from "react-icons/gi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdCampaign } from "react-icons/md";
import {
  TbLanguage,
  TbPhone,
  TbBuildingCommunity,
  TbWorldWww
} from "react-icons/tb";


const SingleLeadPage = () => {
  const [loading, setloading] = useState(true);
  const [LeadData, setLeadData] = useState({});
  const [lastNote, setLastNote] = useState("");
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [LeadNotesData, setLeadNotesData] = useState(null);
  const [leadNotFound, setLeadNotFound] = useState(false);
  const [addNoteloading, setaddNoteloading] = useState(false);
  const {
    currentMode,
    setopenBackDrop,
    User,
    BACKEND_URL,
    darkModeColors,
    isArabic,
  } = useStateContext();

  const { hasPermission } = usePermission();

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
    console.log("Lead::", LeadData);
    if (LeadData?.id) {
      fetchLeadNotes();
      console.log("LEAD DATA::::::::::::::::::::", LeadData);
    }
  }, [LeadData]);
  // Replace last 4 digits with "*"
  const stearics =
    LeadData?.leadContact?.slice(0, LeadData?.leadContact?.length - 4) + "****";
  let contact;

  if (hasPermission("number_masking")) {
    if (User?.role === 1) {
      contact = LeadData?.leadContact;
    } else {
      contact = `${stearics}`;
    }
  } else {
    contact = LeadData?.leadContact;
  }

  useEffect(() => {
    setopenBackDrop(false);
    fetchSingleLead(lid);
    // eslint-disable-next-line
  }, []);

  const sourceIcons = {
    "campaign snapchat": () => (
      <FaSnapchatGhost size={16} color={"#f6d80a"} />
    ),

    "campaign facebook": () => (
      <FaFacebookF size={16} color={"#0e82e1"} />
    ),

    "campaign tiktok": () => (
      <FaTiktok
        size={16}
        color={`${currentMode === "dark" ? "#ffffff" : "#000000"}`}
      />
    ),

    "campaign googleads": () => <FcGoogle size={16} />,

    "campaign youtube": () => (
      <FaYoutube size={16} color={"#FF0000"} />
    ),

    "campaign twitter": () => (
      <FaTwitter size={16} color={"#00acee"} />
    ),

    "bulk import": () => (
      <BiImport size={16} className="text-primary"/>
    ),

    "property finder": () => (
      <GiMagnifyingGlass size={16} color={"#ef5e4e"} />
    ),

    campaign: () => (
      <MdCampaign size={16} color={"#696969"} />
    ),

    cold: () => <BsSnow2 size={16} color={"#0ec7ff"} />,

    personal: () => (
      <BsPersonCircle size={16} color={"#6C7A89"} />
    ),

    whatsapp: () => (
      <FaWhatsapp size={16} color={"#53cc60"} />
    ),

    message: () => (
      <BiMessageRoundedDots
        size={16}
        color={"#6A5ACD"}
      />
    ),

    comment: () => (
      <FaRegComments size={16} color={"#a9b3c6"} />
    ),

    website: () => (
      <TbWorldWww size={16} color={"#AED6F1"} />
    ),

    self: () => <FaUser size={16} color={"#6C7A89"} />,
  };

  return (
    <>
      <div className="flex min-h-screen mt-3">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full pl-3 pb-5 ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            {leadNotFound ? (
              <Error404 />
            ) : (
              <div>
                <div className="w-full flex items-center mt-5">
                  {/* <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div> */}
                  <span className="text-sm font-bold tracking-wide bg-primary text-white px-2 py-1 mr-2 rounded-sm my-auto">
                    <span>{LeadData?.id}</span>
                  </span>
                  <h1
                    className={`text-lg font-bold mr-2 ${
                      currentMode === "dark"
                        ? "text-white"
                        : "text-black"
                    }`}
                    style={{
                      fontFamily: isArabic(LeadData?.leadName)
                        ? "Noto Kufi Arabic"
                        : "inherit",
                    }}
                  >
                    {LeadData?.leadName}
                  </h1>
                </div>
                
                {/* Lead Info */}
                <div className={`${currentMode === "dark" ? "text-[#CCCCCC]" : "text-[#1C1C1C]"} px-3 text-base`}>
                  <div className="grid sm:grid-cols-1 md:grid-cols-5 mt-5 gap-5">
                    <div className="sm:col-span-1 md:col-span-3 space-y-3 font-semibold">
                      {/* LEAD CONTACT  */}
                      <div className="flex space-x-3">
                        <TbPhone size={17} className="mr-2 text-primary" />
                        <h6>{contact}</h6>
                        <h6>{LeadData?.leadEmail === "null" ? "" : LeadData?.leadEmail}</h6>
                      </div>
                      {/* LANGUAGE  */}
                      <div className="flex space-x-3">
                        <TbLanguage size={17} className="mr-2 text-primary" />
                        <h6>{LeadData?.language}</h6>
                      </div>
                      {/* PROJECT  */}
                      <div className="flex space-x-3">
                        <TbBuildingCommunity size={17} className="mr-2 text-primary" />
                        <h6>{LeadData?.project === "null" ? "-" : LeadData?.project}</h6>
                        <h6>{LeadData?.enquiryType === "null" ? "-" : LeadData?.enquiryType}</h6>
                        <h6>{LeadData?.leadType === "null" ? "-" : LeadData?.leadType}</h6>
                        <h6>{LeadData?.leadFor === "null" ? "-" : LeadData?.leadFor}</h6>
                      </div>
                    </div>

                    <div className="sm:col-span-1 md:col-span-2 space-y-2 text-right">
                      <div className="flex items-center justify-end space-x-3 mb-4">
                        <span className="border border-primary px-3 py-1 rounded-md font-semibold text-base">
                          {LeadData?.feedback ?? "?"}
                        </span>
                        <Box
                          className="float-right"
                        >
                          {/* {LeadData?.leadSource?.toLowerCase().startsWith("warm") ? (
                            <BiArchive
                              size={16}
                              color={"#AEC6CF"}
                            />
                          ) : (
                            <>
                              {sourceIcons[LeadData?.leadSource?.toLowerCase()]
                                ? sourceIcons[LeadData?.leadSource?.toLowerCase()]()
                                : "-"}
                            </>
                          )} */}

                          {LeadData?.coldcall === 0 ? (
                            <BsFire size={18} color={"#DA1F26"} />
                          ) : LeadData?.coldcall === 1 ? (
                            <BsSnow2 size={18} color={"#0ec7ff"} />
                          ) : LeadData?.coldcall === 2 ? (
                            <BsPersonCircle size={18} color={"#6C7A89"} />
                          ) : LeadData?.coldcall === 3 ? (
                            <GiMagnifyingGlass size={18} color={"#ef5e4e"} />
                          ) : LeadData?.coldcall === 4 ? (
                            <BiArchive size={18} color={"#AEC6CF"} />
                          ) : (
                            <BsPatchQuestion size={18} color={"#AAAAAA"} />
                          )}
                        </Box>
                      </div>
                      <p className="text-sm" >
                        Lead added on {LeadData?.creationDate}
                      </p>
                      <p className="text-sm">
                        Lead edited on{" "}
                        {LeadData?.lastEdited === ""
                          ? "-"
                          : LeadData?.lastEdited}
                      </p>
                    </div>
                  </div>
                  <div className="bg-main-red-color h-0.5 w-full my-7"></div>
                  
                  <div className={`rounded-md mb-5`}>
                    <h1 className="font-semibold text-lg text-center mb-2">
                      LEAD NOTES
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
                                fontWeight: "400",
                                // background: "#DA1F26"
                              },
                            }}
                            className={`${ currentMode === "dark" ? "bg-primary" : "bg-[#000000]" }`}
                          >
                            <TableRow>
                              <TableCell align="center" className="w-[5%]">#</TableCell>
                              <TableCell align="center" className="w-[15%]">Added On</TableCell>
                              <TableCell align="center" className="w-[15%]">Added By</TableCell>
                              <TableCell align="center" className="w-[65%]">Note</TableCell>
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
                                    <p
                                      style={{
                                        fontFamily: isArabic(row?.leadNote)
                                          ? "Noto Kufi Arabic"
                                          : "inherit",
                                      }}
                                    >
                                      {row?.leadNote}
                                    </p>
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
