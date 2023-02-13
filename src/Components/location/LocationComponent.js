import Image from "next/image";
import React from "react";import { useEffect, useState } from "react";
import UserImage from "../../public/favicon.png";
import MeetingMap from "../../public/WhatsApp Image 2023-02-04 at 6.59.11 PM.jpeg";
import { useStateContext } from "../../context/ContextProvider";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "./App.css";

const LocationComponent = () => {
  const { currentMode } = useStateContext();

  const position = [51.505, -0.09];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 pb-3">
        <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} w-full h-full`}>
            {/* MAP */}
            <Image
            src={MeetingMap}
            height="full"
            width="full"
            className="cursor-pointer"
            alt=""
            />
            {/* <MapContainer center={position} zoom={13} style={{width: "200px", height: "200px"}}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" >
                </TileLayer>

                <Marker position={position}>
                    <Popup>
                        I am a pop-up!
                    </Popup>
                </Marker>                                                     
            </MapContainer> */}
        </div>
        <div className="h-full w-full">
            <h4 className="text-red-600 font-bold text-xl mb-2">Upcoming meetings</h4>
            <div>
            {/* LIST OF UPCOMING MEETINGS */}
            <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} grid grid-cols-6 gap-3 rounded-md p-5 my-3`}>
                <div className="">
                {/* <Link href={"/profile"}> */}
                    <Image
                    src={UserImage}
                    height="full"
                    width="full"
                    className="rounded-full cursor-pointer"
                    alt=""
                    />
                {/* </Link> */}
                
                </div>
                <div className={`${currentMode === "dark" ? "text-white" : "text-black"} col-span-5`}>
                <h4 className="font-bold text-lg my-1 text-main-red-color">Mohammad Alam</h4>
                <p className="my-1"><span className="font-bold">Project: </span>Riviera 1 Bedroom Apartment (Investment)</p>
                <p className="my-1"><span className="font-bold">Timing: </span>11:00 AM, 3rd February, 2023</p>
                <p className="my-1"><span className="font-bold">Location: </span>Azizi Developments, Conrad, Sheikh Zayed Road, Dubai</p>
                </div>
            </div>

            {/* MULTIPLE INSTANCES EXAMPLE  */}
            <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} grid grid-cols-6 gap-3 rounded-md p-5 my-3`}>
                <div className="">
                {/* <Link href={"/profile"}> */}
                    <Image
                    src={UserImage}
                    height="full"
                    width="full"
                    className="rounded-full cursor-pointer"
                    alt=""
                    />
                {/* </Link> */}
                </div>
                <div className={`${currentMode === "dark" ? "text-white" : "text-black"} col-span-5`}>
                <h4 className="font-bold text-lg my-1 text-main-red-color">Mohammad Alam</h4>
                <p className="my-1"><span className="font-bold">Project: </span>Riviera 1 Bedroom Apartment (Investment)</p>
                <p className="my-1"><span className="font-bold">Timing: </span>11:00 AM, 3rd February, 2023</p>
                <p className="my-1"><span className="font-bold">Location: </span>Azizi Developments, Conrad, Sheikh Zayed Road, Dubai</p>
                </div>
            </div>
            <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} grid grid-cols-6 gap-3 rounded-md p-5 my-3`}>
                <div className="">
                {/* <Link href={"/profile"}> */}
                    <Image
                    src={UserImage}
                    height="full"
                    width="full"
                    className="rounded-full cursor-pointer"
                    alt=""
                    />
                {/* </Link> */}
                </div>
                <div className={`${currentMode === "dark" ? "text-white" : "text-black"} col-span-5`}>
                <h4 className="font-bold text-lg my-1 text-main-red-color">Mohammad Alam</h4>
                <p className="my-1"><span className="font-bold">Project: </span>Riviera 1 Bedroom Apartment (Investment)</p>
                <p className="my-1"><span className="font-bold">Timing: </span>11:00 AM, 3rd February, 2023</p>
                <p className="my-1"><span className="font-bold">Location: </span>Azizi Developments, Conrad, Sheikh Zayed Road, Dubai</p>
                </div>
            </div>
            {/* MULTIPLE INSTANCES EXAMPLE END */}
            </div>
        </div>
    </div>    
  );
};

export default LocationComponent;
