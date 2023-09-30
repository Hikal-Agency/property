import {
  Avatar,
  IconButton,
  Pagination,
  PaginationItem,
  Stack,
} from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import ShowLocation from "./ShowLocation";
import axios from "../../axoisConfig";
import UpdateMeeting from "./UpdateMeeting";

import { 
  MdEdit,
  MdLocationOn 
} from "react-icons/md";
import { 
  BsBuildings,
  BsClock,
  BsFillBookmarkXFill,
  BsFillBookmarkStarFill,
  BsFillBookmarkCheckFill
} from "react-icons/bs";
import { 
  BiUser
} from "react-icons/bi";

const GridMeeting = ({ pageState, setpageState }) => {
  console.log("meetings state: ", pageState);
  const [loading, setLoading] = useState(false);
  const { currentMode, BACKEND_URL, isArabic, primaryColor } = useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [meetingLocation, setMeetingLocation] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [notesData, setUserData] = useState([]);
  const [openEditModal, setOpenEditModal] = useState({
    open: false,
    id: null,
  });

  console.log("USERDATA: ", notesData);

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
  };

  const FetchLeads = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    axios
      .get(`${BACKEND_URL}/meeting/?page=${pageState.page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("the meeting leads are ");
        console.log(result.data);
        let rowsDataArray = "";
        if (result.data.leads.current_page > 1) {
          const theme_values = Object.values(result.data.leads.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.leads.data;
        }
        console.log("rows array is");
        console.log(rowsDataArray);

        let rowsdata = rowsDataArray.map((row, index) => ({
          id: pageState.page > 1 ? pageState.page * 15 - 14 + index : index + 1,
          meetingId: row?.id,
          leadName: row?.leadName || "-",
          project: row?.project || "-",
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          leadFor: row?.leadFor || "-",
          meetingDate: row?.meetingDate || "-",
          meetingBy: row?.userName || "-",
          meetingTime: row?.meetingTime || "-",
          meetingStatus: row?.meetingStatus || "-",
          mLat: row?.mLat,
          mLong: row?.mLong,
          meetingLocation: row?.meetingLocation || "-",
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          pageSize: result.data.leads.per_page,
          gridDataSize: result.data.leads.last_page,
          total: result.data.leads.total,
        }));
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);

    const { data, isLoading, page, pageSize, total, gridDataSize } = pageState;
    setUserData(data);
    // setMaxPage(Math.ceil(total / pageSize));
    setMaxPage(gridDataSize);

    setLoading(isLoading);
  }, [pageState]);

  const showLocation = (mLat, mLong) => {
    setLocationModalOpen(true);
    if (!mLat || !mLong) {
      setMeetingLocation({
        lat: "",
        lng: "",
        addressText: "",
      });
    } else {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: Number(mLat), lng: Number(mLong) } },
        (results, status) => {
          if (status === "OK") {
            setMeetingLocation({
              lat: Number(mLat),
              lng: Number(mLong),
              addressText: results[0].formatted_address,
            });
          } else {
            console.log("Getting address failed due to: " + status);
          }
        }
      );
    }
  };

  const handleEditMeeting = (meeting) => {
    if (!meeting?.meetingId) {
      return;
    }
    setOpenEditModal({
      open: true,
      id: meeting.meetingId,
    });
  };

  return (
    <>
      <div className="min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="">
              <div className="mt-5 md:mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                  {notesData?.length > 0 &&
                    notesData?.map((item, index) => {
                      const { mLat, mLong } = item;
                      return (
                        <div
                          key={index}
                          className={`${
                            currentMode === "dark"
                              ? "bg-[#1c1c1c] text-white"
                              : "bg-gray-200 text-black"
                          } p-4 rounded-md `}
                        >
                          <div className="space-y-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <h1 
                                className="font-bold text-primary" 
                                style={{
                                  fontFamily: isArabic(item?.leadName)
                                    ? "Noto Kufi Arabic"
                                    : "inherit",
                                }}
                              >
                                {item?.leadName}
                              </h1>

                              <div className="flex items-center">
                                <Avatar
                                  sx={{ marginRight: "3px" }}
                                  style={{
                                    background: `${currentMode === "dark" ? "black" : "white"}`,
                                    width: "25px",
                                    height: "25px",
                                  }}
                                >
                                  <IconButton
                                    onClick={() => handleEditMeeting(item)}
                                  >
                                    <MdEdit
                                      className={`${currentMode === "dark" ? "text-white" : "text-primary"} `}
                                      size={14}
                                    />
                                  </IconButton>
                                </Avatar>
                                <Avatar
                                  style={{
                                    background: `${currentMode === "dark" ? "black" : "white"}`,
                                    width: "25px",
                                    height: "25px",
                                  }}
                                >
                                  <IconButton
                                    onClick={() => showLocation(mLat, mLong)}
                                  >
                                    <MdLocationOn
                                      className={`${currentMode === "dark" ? "text-white" : "text-primary"} `}
                                      size={14}
                                    />
                                  </IconButton>
                                </Avatar>
                              </div>
                            </div>

                            
                            <p className="flex items-center text-sm py-1">
                              <BsBuildings size={16} className="mr-2" /> 
                              <span className="mx-1">{item?.project === "null" ? "-" : item?.project}</span>
                              <span className="mx-1">{item?.enquiryType === "null" ? "-" : item?.enquiryType}</span>
                              <span className="mx-1">{item?.leadType === "null" ? "-" : item?.leadType}</span>
                              <span className="mx-1">{item?.leadFor === "null" ? "-" : item?.leadFor}</span>
                            </p>
                            <p className="flex items-center text-sm py-1">
                              <BsClock size={16} className="mr-2" /> 
                              <span className="mx-1">{item?.meetingDate}</span>
                              <span className="mx-1">{item?.meetingTime}</span>
                            </p>
                            <p className="flex items-center text-sm py-1">
                              <BiUser size={16} className="mr-2" /> 
                              <span className="mx-1">{item?.meetingBy}</span>
                            </p>
                            <p className="flex items-center text-sm py-1">
                              {item?.meetingStatus === "Cancelled" && (
                                <>
                                  <BsFillBookmarkXFill size={16} className="mr-2 text-primary" /> 
                                  <span className="mx-1">{item?.meetingStatus}</span>
                                </>
                              )}
                              {item?.meetingStatus === "Attended" && (
                                <>
                                  <BsFillBookmarkCheckFill size={16} className="mr-2" color="#238e41" /> 
                                  <span className="mx-1">{item?.meetingStatus}</span>
                                </>
                              )}
                              {item?.meetingStatus === "Postponed" && (
                                <>
                                  <BsFillBookmarkStarFill size={16} className="mr-2" color="#f27f25" /> 
                                  <span className="mx-1">{item?.meetingStatus}</span>
                                </>
                              )}
                              {item?.meetingStatus === "Pending" && (
                                <>
                                  <BsFillBookmarkStarFill size={16} className="mr-2" color="#ebc24d" /> 
                                  <span className="mx-1">{item?.meetingStatus}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
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
                    color: currentMode === "dark" ? "white" : "gray",
                    backgroundColor: `${primaryColor} !important`,
                    "&:hover": {
                      backgroundColor:
                        currentMode === "dark" ? "black" : "white",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: currentMode === "dark" ? "white" : "gray",
                  },
                }}
                renderItem={(item) => {
                  const isEllipsis =
                    item.type === "start-ellipsis" ||
                    item.type === "end-ellipsis";

                  return (
                    <PaginationItem
                      {...item}
                      sx={{
                        color: isEllipsis
                          ? currentMode === "dark"
                            ? "white"
                            : "gray"
                          : undefined,
                        backgroundColor: isEllipsis
                          ? undefined
                          : currentMode === "dark"
                          ? "black"
                          : "white",
                        "&:hover": {
                          backgroundColor:
                            currentMode === "dark" ? "black" : "white",
                        },
                      }}
                    />
                  );
                }}
              />
            </Stack>
          </div>
        )}
      </div>

      {openEditModal.open && (
        <UpdateMeeting
          FetchLeads={FetchLeads}
          meetingModalOpen={openEditModal}
          handleMeetingModalClose={() => {
            setOpenEditModal({
              open: false,
            });
          }}
        />
      )}

      {meetingLocation !== null && locationModalOpen ? (
        <ShowLocation
          isModalOpened={locationModalOpen}
          meetingLocation={meetingLocation}
          handleModalClose={() => {
            setLocationModalOpen(false);
            setMeetingLocation(null);
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default GridMeeting;
