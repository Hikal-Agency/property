import { Pagination, PaginationItem, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
const GridMeeting = ({ pageState, setpageState }) => {
  console.log("meetings state: ", pageState);
  const [loading, setLoading] = useState(false);
  const { currentMode } = useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [notesData, setUserData] = useState([]);

  console.log("USERDATA: ", notesData);

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
  };

  useEffect(() => {
    setLoading(true);

    const { data, isLoading, page, pageSize, total } = pageState;
    setUserData(data);
    // setMaxPage(Math.ceil(total / pageSize));
    setMaxPage(pageSize);

    setLoading(isLoading);
  }, [pageState]);

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
                            <h1 className="font-bold capitalize">
                              <b>Lead Name: </b>{" "}
                              <span className="text-red-600">
                                {item?.leadName}
                              </span>
                            </h1>

                            <p className="text-sm">
                              <b>Project: </b> {item?.project}
                            </p>

                            <p className="text-sm font-semibold  ">
                              <b>Enquiry: </b> {item?.enquiryType}
                            </p>
                            <p className="text-sm font-semibold  ">
                              <b>Property: </b> {item?.leadType}
                            </p>
                            <hr />
                            <p className="text-sm font-semibold  ">
                              <b>Meeting By: </b> {item?.meetingBy}
                            </p>
                            <p className="text-sm font-semibold ">
                              <b>Meeting Date: </b> {item?.meetingDate}
                            </p>
                            <p className="text-sm font-semibold ">
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
    </>
  );
};

export default GridMeeting;
