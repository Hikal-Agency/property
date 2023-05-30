import { Pagination, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";

const EmployeesList = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const { currentMode, BACKEND_URL, pageState, setpageState } =
    useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [userData, setUserData] = useState([]);
  const token = localStorage.getItem("auth-token");

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/users?page=${pageState.page}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        setUserData(response.data?.managers?.data);
        setMaxPage(response.data?.managers?.last_page);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
            <div className="px-5">
              <div className="mt-5 md:mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                  {userData?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          currentMode === "dark"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-black"
                        }  rounded-md`}
                      >
                        <div className="bg-green-500 py-2 px-4 rounded-md mb-3">
                          <p className="text-sm text-white text-center">
                            Checked-in
                          </p>
                        </div>
                        <div className="flex justify-center items-center">
                          {item?.displayImg ? (
                            <img
                              src={item?.displayImg}
                              className="rounded-full cursor-pointer h-16 w-16 object-cover"
                              alt=""
                            />
                          ) : (
                            <Avatar
                              alt="User"
                              variant="circular"
                              style={{ width: "64px", height: "64px" }}
                            />
                          )}
                        </div>
                        <div className="text-center mt-3">
                          <h4 className="font-bold text-lg capitalize">
                            Employee Name
                          </h4>
                          <p className="text-sm">{item?.position}</p>
                          <p className="text-sm">{item?.department}</p>
                        </div>
                        <div className="bg-green-500 rounded-md p-2 mt-3 text-center">
                          <p className="text-xs">Checked-Out</p>
                          <p className="text-xs">2023-05-30 06:30</p>
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
                // color={currentMode === "dark" ? "primary" : "secondary"}
                onChange={handlePageChange}
                style={{ margin: "auto" }}
                sx={{
                  "& .Mui-selected": {
                    color: "white",
                    backgroundColor: "red !important",
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

export default EmployeesList;
