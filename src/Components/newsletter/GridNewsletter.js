import { Pagination, PaginationItem, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
const GridNewsletter = ({ pageState, setpageState }) => {
  console.log("Newsletter state: ", pageState);
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
    setMaxPage(Math.ceil(total / pageSize));
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
                            <h1 className="font-bold ">
                              <b>Email: </b> {item?.email}
                            </h1>

                            <p className="text-sm">
                              <b>Added At: </b> {item?.creationDate}
                            </p>
                            <hr />
                            <p className="text-sm font-semibold text-red-600 ">
                              <b>Status: </b>{" "}
                              {item?.status === "Subscribed" ? (
                                <span className="text-green-600">
                                  Subscribed
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  UnSubscribed
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
                onChange={handlePageChange}
                style={{ margin: "auto" }}
                sx={{
                  "& .Mui-selected": {
                    color: "white",
                    backgroundColor: "#DA1F26 !important",
                    "&:hover": {
                      backgroundColor:
                        currentMode === "dark" ? "black" : "white",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: "white",
                  },
                }}
                // renderItem={(item) => {
                //   const isEllipsis =
                //     item.type === "start-ellipsis" ||
                //     item.type === "end-ellipsis";

                //   return (
                //     <PaginationItem
                //       {...item}
                //       sx={{
                //         color: isEllipsis
                //           ? currentMode === "dark"
                //             ? "white"
                //             : "gray"
                //           : undefined,
                //         backgroundColor: isEllipsis
                //           ? undefined
                //           : currentMode === "dark"
                //           ? "black"
                //           : "white",
                //         "&:hover": {
                //           backgroundColor:
                //             currentMode === "dark" ? "black" : "white",
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

export default GridNewsletter;
