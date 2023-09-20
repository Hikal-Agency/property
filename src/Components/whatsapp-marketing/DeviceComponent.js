import React from "react";
import { Button } from "@material-tailwind/react";
import { useStateContext } from "../../context/ContextProvider";

const DeviceComponent = () => {
  const { currentMode } = useStateContext();

  return (
    <div className="mt-5 md:mt-2">
      <h1
        className={`font-semibold ${
          currentMode === "dark" ? "text-white" : "text-primary"
        } text-xl ml-2 mb-3`}
      >
        Devices
      </h1>
      <Button className="text-white bg-primary my-5 p-3 text-sm w-full rounded-md">
        Add new device
      </Button>
      <div className="grid grid-cols-4 gap-x-5 gap-y-5 mb-5">
        <div
          className={`${
            currentMode === "dark"
              ? "bg-[#1c1c1c] text-white"
              : "bg-gray-200 text-black"
          } rounded-md grid content-center text-center p-5`}
        >
          <h1>Total Devices</h1>
          <h1 className="font-bold">1</h1>
        </div>
        <div
          className={`${
            currentMode === "dark"
              ? "bg-[#1c1c1c] text-white"
              : "bg-gray-200 text-black"
          } rounded-md grid content-center text-center p-5`}
        >
          <h1>Total Online</h1>
          <h1 className="font-bold">1</h1>
        </div>
        <div
          className={`${
            currentMode === "dark"
              ? "bg-[#1c1c1c] text-white"
              : "bg-gray-200 text-black"
          } rounded-md grid content-center text-center p-5`}
        >
          <h1>Total Sent</h1>
          <h1 className="font-bold">1</h1>
        </div>
        <div
          className={`${
            currentMode === "dark"
              ? "bg-[#1c1c1c] text-white"
              : "bg-gray-200 text-black"
          } rounded-md grid content-center text-center p-5`}
        >
          <h1>Total Sent All Time</h1>
          <h1 className="font-bold">1</h1>
        </div>
      </div>
      <div className="w-full p-5">
        <h1 className="font-bold">LIST OF DEVICES</h1>
      </div>
    </div>
  );
};

export default DeviceComponent;
