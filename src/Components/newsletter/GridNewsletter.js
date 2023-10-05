import { Pagination, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";

import {
  BsFillEnvelopeCheckFill,
  BsFillEnvelopeXFill
} from "react-icons/bs";


const GridNewsletter = ({ pageState, setpageState }) => {
  console.log("Newsletter state: ", pageState);
  const [loading, setLoading] = useState(false);
  const { currentMode, primaryColor } = useStateContext();
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 pb-3">
              {notesData?.length > 0 &&
                notesData?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`${
                        currentMode === "dark"
                          ? "bg-[#1c1c1c] text-white"
                          : "bg-[#EEEEEE] text-black"
                      } p-4 rounded-md `}
                    >
                      <div className="grid grid-cols-8 gap-2 items-center">
                        <div className="col-span-7">
                          <h1 className="col-span-7 font-bold mb-2">
                            {item?.email}
                          </h1>
                          <p className="text-xs text-[#AAAAAA]">
                            Subscribed on {item?.creationDate}
                          </p>
                        </div>

                        <div className="w-full flex justify-center">
                          {item?.status === "Subscribed" ? (
                            <BsFillEnvelopeCheckFill size={20} className="text-green-600" />
                          ) : (
                            <BsFillEnvelopeXFill size={20} className="text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                    backgroundColor: `${primaryColor} !important`,
                    "&:hover": {
                      backgroundColor:
                        currentMode === "dark" ? "black" : "white",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: "white",
                  },
                }}
                
              />
            </Stack>
          </div>
        )}
      </div>
    </>
  );
};

export default GridNewsletter;
