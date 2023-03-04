// import Image from "next/image";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
// import UserImage from "../../public/favicon.png";
import { useStateContext } from "../../context/ContextProvider";
import { BsBuilding } from "react-icons/bs";
import { ImLocation, ImClock, ImUser } from "react-icons/im";
import { MapContainer } from "./MapComponent";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "./App.css";

const LocationComponent = ({ upcoming_meetings }) => {
  const { currentMode } = useStateContext();

//   const position = [51.505, -0.09];
const meetingData = {
    "type": "MeetingLocationCollection",
    "crs": {
      "type": "name",
      "properties": {
          "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
      }
    },
    "features": [
      {
        "type": "Meetings",
        "properties": {
            "mId":1,
            "leadId":28,
            "meetingDate":"2023-03-03",
            "meetingTime":"15:00"

        },
        "geometrics": {
            "type": "Point",
            "coordinates": [25.364647, 55.674632]
        }
      },
      {
        "type": "Meetings",
        "properties": {
            "mId":2,
            "leadId":222,
            "meetingDate":"2023-03-03",
            "meetingTime":"15:00"

        },
        "geometrics": {
            "type": "Point",
            "coordinates": [20.364647, 50.674632]
        }
      }
    ]
  };

    useEffect(() => {
        console.log("upcoming meetings are");
        console.log(upcoming_meetings);
    }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 pb-3">
        <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} w-full h-[90vh]`}>
            {/* MAP */}
            {/* <Image
            src={MeetingMap}
            height="full"
            width="full"
            className="cursor-pointer"
            alt=""
            /> */}
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
            <MapContainer />
            
        </div>
        <div className="h-full w-full">
            {meetingData.features.map(meeting => (
                <>                
                    <h1>{meeting.properties.mId}</h1>
                    <h1>{meeting.geometrics.coordinates[0]},&nbsp; {meeting.geometrics.coordinates[1]}</h1>
                </>
            ))}
            <br></br>
            <h4 className="text-red-600 font-bold text-xl mb-2">Upcoming meetings</h4>
            <div>
            {/* LIST OF UPCOMING MEETINGS */}
                {upcoming_meetings?.map((meeting, index) => {
                    return (
                        <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} grid grid-cols-6 gap-3 rounded-md p-5 my-3`}>
                            {/* <div className=""> */}
                            {/* <Link href={"/profile"}> */}
                                {/* <Image
                                src={UserImage}
                                height="full"
                                width="full"
                                className="rounded-full cursor-pointer"
                                alt=""
                                /> */}
                            {/* </Link> */}
                            {/* </div> */}
                            <div className={`${currentMode === "dark" ? "text-white" : "text-black"} col-span-5 space-y-2`}>
                                <h4 className="font-bold my-1 text-main-red-color">{meeting?.leadName}</h4>
                                <div className="w-full flex justify-between items-center">
                                    <div className="flex items-center space-x-1">
                                    <BsBuilding
                                        className={`mr-2 ${
                                        currentMode === "dark" ? "text-white" : "text-black"
                                        }`}
                                    />
                                    <p className="text-sm mr-3">
                                        {meeting?.project} {meeting?.enquiryType}{" "}
                                        {meeting?.leadType} {meeting?.leadFor}
                                    </p>
                                    </div>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <div className="flex items-center space-x-1">
                                    <ImClock
                                        className={`mr-2 ${
                                        currentMode === "dark" ? "text-white" : "text-black"
                                        }`}
                                    />
                                    <p className="text-sm mr-3">
                                        {meeting?.meetingTime === ""
                                        ? ""
                                        : `${meeting?.meetingTime}, `}{" "}
                                        {moment(meeting?.meetingDate).format("MMMM D, Y")}
                                    </p>
                                    </div>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <div className="flex items-center space-x-1">
                                    <ImLocation
                                        className={`mr-2 ${
                                        currentMode === "dark" ? "text-white" : "text-black"
                                        }`}
                                    />
                                    <p className="text-sm mr-3"> {meeting?.meetingLocation ? meeting.meetingLocation : "Not Updated"}</p>
                                    </div>
                                </div>
                                
                                <div className="w-full flex justify-between items-center">
                                    <div className="flex items-center space-x-1">
                                    <ImUser
                                        className={`mr-2 ${
                                        currentMode === "dark" ? "text-white" : "text-black"
                                        }`}
                                    />
                                    <p className="text-sm mr-3"> {meeting?.createdBy}</p>
                                    </div>
                                </div>
                                {/* <p className="my-1"><span className="font-bold">Project: </span>Riviera 1 Bedroom Apartment (Investment)</p>
                                <p className="my-1"><span className="font-bold">Timing: </span>11:00 AM, 3rd February, 2023</p>
                                <p className="my-1"><span className="font-bold">Location: </span>Azizi Developments, Conrad, Sheikh Zayed Road, Dubai</p> */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>    
  );
};

export default LocationComponent;
