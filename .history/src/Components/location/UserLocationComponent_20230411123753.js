// import Image from "next/image";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
// import UserImage from "../../public/favicon.png";
import { useStateContext } from "../../context/ContextProvider";
import { BsBuilding, BsCircleFill } from "react-icons/bs";
import { ImLocation, ImClock } from "react-icons/im";
import MapContainer from "./MapComponent";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "./App.css";

const UserLocationComponent = ({ user_location }) => {
  const { currentMode } = useStateContext();

//   const position = [51.505, -0.09];

    useEffect(() => {
        console.log("upcoming meetings are");
        console.log(user_location);
    }, []);

  return (
    <>
        <h4 className="text-red-600 font-bold text-xl mb-2 text-center">Meeting Locations</h4>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 pb-3">
            <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} w-full h-[85vh]`}>
                {/* MAP */}
                <MapContainer />
            </div>
            <div className="h-full w-full mt-5">
                <h4 className="text-red-600 font-bold text-xl mb-2">Meetings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                
                </div>
            </div>
        </div>    
    </>
  );
};

export default UserLocationComponent;
