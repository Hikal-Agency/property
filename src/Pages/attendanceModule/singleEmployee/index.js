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
          className={`w-full pl-3  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="w-full flex items-center py-3">
            <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
            <h1
              className={`text-lg font-semibold ${
                currentMode === "dark"
                  ? "text-white"
                  : "text-black"
              }`}
            >
              Employee
            </h1>
          </div>
          <SingleEmployee />
        </div>
      </div>
    </>
  );
};

export default Employee;
