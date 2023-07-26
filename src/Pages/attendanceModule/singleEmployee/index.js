// import Image from "next/image";
import React from "react";
import { useEffect } from "react";

import { useStateContext } from "../../../context/ContextProvider";
import OfficeSettings from "../../../Components/attendance/OfficeSettings";
import EmployeesList from "../../../Components/attendance/EmployeesList";
import SingleEmployee from "../../../Components/attendance/SingleEmployee";

const Employee = () => {
  const {
    currentMode,
    setopenBackDrop,
    setLocationData,
    BACKEND_URL,
    setUser,
    User,
  } = useStateContext();

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <div
          className={`w-full  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="px-5 ">
            <h1
              className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                currentMode === "dark"
                  ? "text-white border-white"
                  : "text-red-600 font-bold border-red-600"
              }`}
            >
              ● Employee:{" "}
              <span className="bg-main-red-color text-white px-3 py-1 rounded-sm my-auto">
                Ubaid
              </span>
            </h1>
            <SingleEmployee />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Employee;
