import { Pagination, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState, useRef } from "react";

import { BsBuildings } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { BsMic, BsMicFill } from "react-icons/bs";

import { BiUserCircle, BiUser } from "react-icons/bi";
import SingleLeadModal from "../../Pages/singlelead/SingleLeadModal";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const NotesGrid = ({ pageState, setpageState }) => {
  console.log("Notes state: ", pageState);
  const [loading, setLoading] = useState(false);
  const { currentMode, isArabic, primaryColor, themeBgImg } = useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [notesData, setUserData] = useState([]);
  const [isVoiceSearchState, setIsVoiceSearchState] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchRows, setSearchRows] = useState(pageState?.data);
  const searchRef = useRef(null);
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition("en");
  useEffect(() => {
    setSearchRows(pageState?.data);
  }, [pageState?.data]);
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });
  useEffect(() => {
    if (isVoiceSearchState && transcript.length > 0) {
      // setSearchTerm(transcript);
      setSearchText(transcript);
      handleSearchChange({ target: { value: transcript } });
    }
    console.log(transcript, "transcript");
  }, [transcript, isVoiceSearchState]);

  useEffect(() => {
    if (isVoiceSearchState) {
      handleSearchChange({ target: { value: "" } });
      resetTranscript();
      setSearchText("");
      startListening();
    } else {
      SpeechRecognition.stopListening();
      console.log(transcript, "transcript...");
      resetTranscript();
    }
  }, [isVoiceSearchState]);
  console.log("USERDATA: ", notesData);

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
    // alert("it is called for parent");
  };

  const handleNavigate = (e, leadId) => {
    e.preventDefault();

    const url = `/leadnotes/${leadId}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    setUserData(pageState?.data);
    setSearchRows(pageState?.data);
    // alert("it is updated");
  }, [pageState.data]);

  useEffect(() => {
    setLoading(true);

    const { data, isLoading, page, pageSize, total, gridPageSize } = pageState;
    // setUserData(data);
    // setMaxPage(Math.ceil(total / pageSize));
    setMaxPage(gridPageSize);
    setLoading(isLoading);
  }, [pageState.page]);

  const [singleLeadID, setSingleLeadID] = useState({});
  const [singleLeadModelOpen, setSingleLeadModelOpen] = useState(false);

  const HandleSingleLead = (params) => {
    setSingleLeadID(params);
    setSingleLeadModelOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchText(e?.target?.value);

    const searchResults = notesData.filter((row) => {
      return (
        row?.id
          ?.toString()
          .toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.creationDate
          ?.toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.project?.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        row?.enquiryType
          ?.toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.leadNote?.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        row?.userName?.toLowerCase().includes(e?.target?.value.toLowerCase())
      );
    });
    setSearchRows(searchResults);
  };

  return (
    <>
      <div className="min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div className={`w-full`}>
            <div className="mt-5 md:mt-2">
              <div className="flex justify-end w-full items-center mb-3 ">
                <div className="flex items-center border-b-[1px] border-b-black gap-2 mr-3">
                  <div>
                    <IoMdSearch size={22} />
                  </div>
                  <input
                    ref={searchRef}
                    type="text"
                    className=" focus:outline-none h-full bg-transparent text-[12px]"
                    placeholder="Search"
                    onChange={handleSearchChange}
                    value={searchText}
                  />
                  <div
                    // ref={searchContainer}
                    className={`${
                      isVoiceSearchState ? "listening bg-primary" : ""
                    } ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    } rounded-full cursor-pointer hover:bg-gray-500 p-1`}
                    onClick={() => {
                      setIsVoiceSearchState(!isVoiceSearchState);
                      console.log("mic is clicked...");
                    }}
                  >
                    {isVoiceSearchState ? (
                      <BsMicFill size={16} />
                    ) : (
                      <BsMic size={16} />
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {notesData?.length > 0 &&
                  searchRows?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          !themeBgImg
                            ? currentMode === "dark"
                              ? "bg-dark-neu text-white"
                              : "bg-light-neu text-black"
                            : currentMode === "dark"
                            ? "blur-bg-dark text-white"
                            : "blur-bg-light text-black"
                        } p-4 cursor-pointer `}
                        // onClick={(e) => handleNavigate(e, item?.leadId)}
                        onClick={() => HandleSingleLead(item?.leadId)}
                      >
                        <div className="my-1 space-y-1 overflow-hidden">
                          <h1
                            className={`font-semibold capitalize py-1 ${
                              !themeBgImg ? "text-primary" : ""
                            }`}
                          >
                            <span
                              style={{
                                fontFamily: isArabic(item?.leadNote)
                                  ? "Noto Kufi Arabic"
                                  : "inherit",
                              }}
                            >
                              {item?.leadNote}
                            </span>
                          </h1>
                          <div className="my-3 h-[1px] w-full bg-primary"></div>
                          <p className="flex items-center text-sm py-1">
                            <BiUserCircle size={16} className="mr-2" />
                            <span
                              className="mx-1"
                              style={{
                                fontFamily: isArabic(item?.leadName)
                                  ? "Noto Kufi Arabic"
                                  : "inherit",
                              }}
                            >
                              {item?.leadName}
                            </span>
                          </p>
                          <p className="flex items-center text-sm py-1">
                            <BsBuildings size={16} className="mr-2" />
                            <span className="mx-1">
                              {item?.project === "null" ? "-" : item?.project}
                            </span>
                            <span className="mx-1">
                              {item?.enquiryType === "null"
                                ? "-"
                                : item?.enquiryType}
                            </span>
                            <span className="mx-1">
                              {item?.leadType === "null" ? "-" : item?.leadType}
                            </span>
                            <span className="mx-1">
                              {item?.leadFor === "null" ? "-" : item?.leadFor}
                            </span>
                          </p>
                          <p className="flex items-center text-sm py-1">
                            <BiUser size={16} className="mr-2" />
                            <span className="mx-1">{item?.userName}</span>
                            <span className="mx-1">|</span>
                            <span className="mx-1">{item?.creationDate}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <Stack spacing={2} marginTop={2}>
              <Pagination
                count={maxPage}
                color={currentMode === "dark" ? "primary" : "secondary"}
                page={pageState.page}
                onChange={handlePageChange}
                style={{ margin: "auto" }}
                sx={{
                  "& .Mui-selected": {
                    color: "white !important",
                    backgroundColor: `${primaryColor} !important`,
                    boxShadow: "0 0 10px rgba(138, 138, 138, 0.5)",
                    "&:hover": {
                      backgroundColor:
                        currentMode === "dark" ? "black" : "white",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: currentMode === "dark" ? "white" : "black",
                  },
                }}
              />
            </Stack>

            {singleLeadModelOpen && (
              <SingleLeadModal
                singleLeadModelOpen={singleLeadModelOpen}
                handleCloseSingleLeadModel={() => setSingleLeadModelOpen(false)}
                LeadID={singleLeadID}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NotesGrid;
