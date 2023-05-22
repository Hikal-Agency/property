import { Pagination, Stack } from "@mui/material";
import React from "react";

const UserTable = () => {
  return (
    <>
      <div className="min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full  ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5">
              <div className="mt-5 md:mt-2">
                <h1
                  className={`font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
                >
                  Contacts
                  {/* <span className="px-5 py-3 rounded-md">Leaderboard</span> */}
                  {/* <span className="px-5 py-3 rounded-md">Call Log Board</span> */}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                  {contacts?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          currentMode === "dark"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-black"
                        } p-3 rounded-md `}
                      >
                        <img
                          src="/favicon.png"
                          className="rounded-md cursor-pointer h-[50px] w-[50px] object-cover"
                          alt=""
                        />
                        <div className="mt-2 space-y-1 overflow-hidden">
                          <h1 className="font-bold">{item.userName}</h1>
                          <p className="text-sm">{item.position}</p>
                          <p className="text-sm font-semibold text-red-600">
                            {item.userName}
                          </p>
                          <p className="text-sm">{item.userPhone}</p>
                          <p className="text-sm">{item.userEmail}</p>
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
                color="error"
                onChange={handlePageChange}
                style={{ margin: "auto" }}
              />
            </Stack>
          </div>
        )}
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default UserTable;
