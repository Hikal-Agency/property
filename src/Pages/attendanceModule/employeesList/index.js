// import Image from "next/image";
import React from "react";
import { useEffect } from "react";

import { useStateContext } from "../../../context/ContextProvider";
import OfficeSettings from "../../../Components/attendance/OfficeSettings";
import EmployeesList from "../../../Components/attendance/EmployeesList";

const Employees = () => {
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
              className={`text-xl border-l-[4px] ml-1 pl-1 font-bold ${
                currentMode === "dark"
                  ? "text-white border-white"
                  : "text-red-600 font-bold border-red-600"
              }`}
            >
              ● Employees
            </h1>
            <EmployeesList />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Employees;
