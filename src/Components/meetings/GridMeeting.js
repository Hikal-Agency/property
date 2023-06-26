import {
  Avatar,
  IconButton,
  Pagination,
  PaginationItem,
  Stack,
} from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../Loader";
import { MdEdit } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import ShowLocation from "./ShowLocation";
import axios from "../../axoisConfig";
import UpdateMeeting from "./UpdateMeeting";
const GridMeeting = ({ pageState, setpageState }) => {
  console.log("meetings state: ", pageState);
  const [loading, setLoading] = useState(false);
  const { currentMode, BACKEND_URL } = useStateContext();
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
          leadName: row?.leadName,
          project: row?.project,
          enquiryType: row?.enquiryType,
          leadType: row?.leadType,
          meetingDate: row?.meetingDate,
          meetingBy: row?.userName,
          meetingTime: row?.meetingTime,
          meetingStatus: row?.meetingStatus,
          mLat: row?.mLat,
          mLong: row?.mLong,
          meetingLocation: row?.meetingLocation,
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
            <div className="px-5">
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
                              ? "bg-gray-900 text-white"
                              : "bg-gray-200 text-black"
                          } p-3 rounded-md `}
                        >
                          <div className="mt-2 space-y-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <h1 className="font-bold capitalize">
                                <b>Lead Name: </b>{" "}
                                <span className="text-red-600">
                                  {item?.leadName}
                                </span>
                              </h1>
                              <div className="flex items-center">
                                <Avatar
                                  sx={{ marginRight: "3px" }}
                                  style={{
                                    background: "white",
                                    width: "30px",
                                    height: "30px",
                                  }}
                                >
                                  <IconButton onClick={() => handleEditMeeting(item)}>
                                    <MdEdit
                                      style={{ color: "#da1f26" }}
                                      size={16}
                                    />
                                  </IconButton>
                                </Avatar>
                                <Avatar
                                  style={{
                                    background: "white",
                                    width: "30px",
                                    height: "30px",
                                  }}
                                >
                                  <IconButton
                                    onClick={() => showLocation(mLat, mLong)}
                                  >
                                    <MdLocationOn
                                      style={{ color: "#da1f26" }}
                                      size={16}
                                    />
                                  </IconButton>
                                </Avatar>
                              </div>
                            </div>

                            <p className="text-sm">
                              <b>Project: </b> {item?.project}
                            </p>

                            <p className="text-sm">
                              <b>Enquiry: </b> {item?.enquiryType}
                            </p>
                            <p className="text-sm">
                              <b>Property: </b> {item?.leadType}
                            </p>
                            <hr />
                            <p className="text-sm">
                              <b>Meeting By: </b> {item?.meetingBy}
                            </p>
                            <p className="text-sm">
                              <b>Meeting Date: </b> {item?.meetingDate}
                            </p>
                            <p className="text-sm">
                              <b>Meeting Time: </b> {item?.meetingTime}
                            </p>
                            <p className="text-sm font-semibold ">
                              <b>Status: </b>
                              {item?.meetingStatus === "Cancelled" && (
                                <span className="text-sm font-semibold text-[#ff0000]">
                                  Cancelled
                                </span>
                              )}
                              {item?.meetingStatus === "Pending" && (
                                <span className="text-sm font-semibold text-[#f27f25]">
                                  Pending
                                </span>
                              )}
                              {item?.meetingStatus === "Postponed" && (
                                <span className="text-sm font-semibold text-[#f27f25]">
                                  Pending
                                </span>
                              )}
                              {item?.meetingStatus === "Attended" && (
                                <span className="text-sm font-semibold text-[#0f9d58]">
                                  Attended
                                </span>
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
                    backgroundColor: "red !important",
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
