import { Pagination, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";

// const UserTable = ({ user }) => {
//   const [loading, setloading] = useState(false);
//   const { currentMode, BACKEND_URL, pageState, setpageState } =
//     useStateContext();
//   const [page, setPage] = useState("1");
//   const [maxPage, setMaxPage] = useState(0);
//   const [userData, setUserData] = useState([]);

//   const handlePageChange = (event, value) => {
//     setPage(value);
//     setUserData(user?.managers?.data);
//   };

//   useEffect(() => {
//     setUserData(user?.managers?.data);
//     setMaxPage(user?.managers?.last_page);
//   }, [user]);

//   console.log("UsersData: ", userData);

//   return (
//     <>
//       <div className="min-h-screen">
//         {loading ? (
//           <Loader />
//         ) : (
//           <div
//             className={`w-full  ${
//               currentMode === "dark" ? "bg-black" : "bg-white"
//             }`}
//           >
//             <div className="px-5">
//               <div className="mt-5 md:mt-2">
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
//                   {userData?.map((item, index) => {
//                     return (
//                       <div
//                         key={index}
//                         className={`${
//                           currentMode === "dark"
//                             ? "bg-gray-900 text-white"
//                             : "bg-gray-200 text-black"
//                         } p-3 rounded-md `}
//                       >
//                         {item?.displayImg ? (
//                           <img
//                             src={item?.displayImg}
//                             className="rounded-md cursor-pointer h-[50px] w-[50px] object-cover"
//                             alt=""
//                           />
//                         ) : (
//                           <Avatar
//                             alt="User"
//                             variant="circular"
//                             style={{ width: "30px", height: "30px" }}
//                           />
//                         )}
//                         <div className="mt-2 space-y-1 overflow-hidden">
//                           <h1 className="font-bold">{item?.userName}</h1>
//                           <p className="text-sm font-semibold text-red-600">
//                             {item?.position}
//                           </p>

//                           <hr />

//                           <p className="text-sm">{item?.userContact}</p>
//                           <p className="text-sm">{item?.userEmail}</p>
//                           {item?.status === 0 ? (
//                             <p className="text-sm text-red-600">Deactive</p>
//                           ) : (
//                             <p className="text-sm text-green-600">Active</p>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <Stack spacing={2} marginTop={2}>
//               <Pagination
//                 count={maxPage}
//                 color="error"
//                 onChange={handlePageChange}
//                 style={{ margin: "auto" }}
//               />
//             </Stack>
//           </div>
//         )}
//         {/* <Footer /> */}
//       </div>
//     </>
//   );
// };

const UserTable = ({ user }) => {
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
                        } p-3 rounded-md `}
                      >
                        {item?.displayImg ? (
                          <img
                            src={item?.displayImg}
                            className="rounded-md cursor-pointer h-[50px] w-[50px] object-cover"
                            alt=""
                          />
                        ) : (
                          <Avatar
                            alt="User"
                            variant="circular"
                            style={{ width: "30px", height: "30px" }}
                          />
                        )}
                        <div className="mt-2 space-y-1 overflow-hidden">
                          <h1 className="font-bold">{item?.userName}</h1>
                          <p className="text-sm font-semibold text-red-600">
                            {item?.position}
                          </p>
                          <hr />
                          <p className="text-sm">{item?.userContact}</p>
                          <p className="text-sm">{item?.userEmail}</p>
                          {item?.status === 0 ? (
                            <p className="text-sm text-red-600">Deactive</p>
                          ) : (
                            <p className="text-sm text-green-600">Active</p>
                          )}
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
                    color: currentMode === "dark" ? "white" : "gray",
                    backgroundColor: currentMode === "dark" ? "black" : "white",
                    "&:hover": {
                      backgroundColor:
                        currentMode === "dark" ? "black" : "white",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: currentMode === "dark" ? "white" : "gray",
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

export default UserTable;
