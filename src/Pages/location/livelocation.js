// import Image from "next/image";

import React from "react";
import { useEffect } from "react";
import LocationComponent from "../../Components/location/LocationComponent";
import { useStateContext } from "../../context/ContextProvider";

const Livelocation = () => {
  const { currentMode, setopenBackDrop, DashboardData } = useStateContext();
  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  console.log("meetinglocations:: ", DashboardData);

  return (
    <>
      <div className="min-h-screen">
        <div
          className={`w-full  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="px-5 ">
            <LocationComponent
              upcoming_meetings={DashboardData?.upcoming_meetings}
            />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Livelocation;
