import { Pagination, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";

import { BsBuildings } from "react-icons/bs";
import { BiUserCircle, BiUser } from "react-icons/bi";


const NotesGrid = ({ pageState, setpageState }) => {
  console.log("Notes state: ", pageState);
  const [loading, setLoading] = useState(false);
  const { currentMode, isArabic, primaryColor } = useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [notesData, setUserData] = useState([]);

  console.log("USERDATA: ", notesData);

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
  };

  const handleNavigate = (e, leadId) => {
    e.preventDefault();

    const url = `/leadnotes/${leadId}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    setLoading(true);

    const { data, isLoading, page, pageSize, total, gridPageSize } = pageState;
    setUserData(data);
    // setMaxPage(Math.ceil(total / pageSize));
    setMaxPage(gridPageSize);
    setLoading(isLoading);
  }, [pageState.page]);

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
            <div className="px-1">
              <div className="mt-5 md:mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                  {notesData?.length > 0 &&
                    notesData?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={`${
                            currentMode === "dark"
                              ? "bg-[#1C1C1C] text-white"
                              : "bg-[#EEEEEE] text-black"
                          } p-3 rounded-md cursor-pointer `}
                          onClick={(e) => handleNavigate(e, item?.leadId)}
                        >
                          <div className="my-1 space-y-1 overflow-hidden">
                            <h1 className="font-semibold capitalize text-red-600 py-1">
                              <span style={{fontFamily: isArabic(item?.leadNote) ? "Noto Kufi Arabic" : "inherit"}}>{item?.leadNote}</span>
                            </h1>
                            <div className="my-3 h-[1px] w-full bg-primary" ></div>
                            <p className="flex items-center text-sm py-1">
                              <BiUserCircle size={16} className="mr-2" /> 
                              <span className="mx-1" style={{fontFamily: isArabic(item?.leadName) ? "Noto Kufi Arabic" : "inherit"}}>{item?.leadName}</span>
                            </p>
                            <p className="flex items-center text-sm py-1">
                              <BsBuildings size={16} className="mr-2" /> 
                              <span className="mx-1">{item?.project === "null" ? "-" : item?.project}</span>
                              <span className="mx-1">{item?.enquiryType === "null" ? "-" : item?.enquiryType}</span>
                              <span className="mx-1">{item?.leadType === "null" ? "-" : item?.leadType}</span>
                              <span className="mx-1">{item?.leadFor === "null" ? "-" : item?.leadFor}</span>
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
                    "&:hover": {
                      backgroundColor:
                        currentMode === "dark" ? "black" : "white",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: currentMode === "dark" ? "white" : "black",
                  },
                }}
                // renderItem={(item) => {
                //   const isEllipsis =
                //     item.type === "start-ellipsis" ||
                //     item.type === "end-ellipsis";

                //   return (
                //     <PaginationItem
                //       {...item}
                //       // page={pageState.page}
                //       sx={{
                //         color: isEllipsis
                //           ? currentMode === "dark"
                //             ? "red"
                //             : "red"
                //           : undefined,
                //         backgroundColor: isEllipsis
                //           ? undefined
                //           : currentMode === "dark"
                //           ? "red"
                //           : "red",
                //         "&:hover": {
                //           backgroundColor:
                //             currentMode === "dark" ? "red" : "red",
                //         },
                //       }}
                //     />
                //   );
                // }}
              />
            </Stack>
          </div>
        )}
      </div>
    </>
  );
};

export default NotesGrid;
