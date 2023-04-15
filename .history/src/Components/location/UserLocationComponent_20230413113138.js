// import Image from "next/image";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api';

import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";

import { BsPinMap, BsCircleFill } from "react-icons/bs";
import { ImLocation, ImClock } from "react-icons/im";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "./App.css";

const UserLocationComponent = () => {
    const { 
        currentMode,
        LocationData,
        setLocationData,
        LastLocationData,
        setLastLocationData,
        BACKEND_URL
    } = useStateContext();

    const [loading, setloading] = useState(true);
    const navigate = useNavigate(); 
    const location = useLocation();
    
    const [selectedUser, setSelectedUser] = React.useState(null);
    
    const mapContainerStyle = {
        width: "100%",
        height: "100%",
    };
    const options = {
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: true,
    }

    const FetchLocation = async (token) => {
        await axios
        .get(`${BACKEND_URL}/locations`, {
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            },
        })
        .then((result) => {
            // console.log("user location data is");
            // console.log(result.data);
            setLocationData(result.data);
            setloading(false);
        })
        .catch((err) => {
            navigate("/", {
            state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
            });
        });
    };

    const FetchLastLocation = async (token) => {
        await axios
        .get(`${BACKEND_URL}/locations?last_by_all`, {
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            },
        })
        .then((result) => {
            // console.log("user location data is");
            // console.log(result.data);
            setLastLocationData(result.data);
            setloading(false);
        })
        .catch((err) => {
            navigate("/", {
            state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
            });
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (token) {
          FetchLocation(token);
          FetchLastLocation(token);
        } else {
          navigate("/", {
            state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
          });
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <h4 className="text-red-600 font-bold text-xl mb-2 text-center">User Locations</h4>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-3">
                <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} w-full h-[85vh] col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3`}>
                    {/* MAP */}
                    {(typeof window.google !== "object") ? <div>Your map is loading...</div> :
                    <GoogleMap
                        zoom={10}
                        center={{lat: 25.22527310000002, lng: 55.280889615218406}}
                        mapContainerStyle={mapContainerStyle}
                        options={options}
                    >
                        {LastLocationData?.locations?.data?.map(user => (
                        <>
                            <MarkerF
                            key={user.user_id} 
                            position={{ lat: parseFloat(user.latitude), lng: parseFloat(user.longitude)}}
                            icon={{
                                url: "/userpin.svg",
                                scaledSize: window.google ? new window.google.maps.Size(50,50) : null,
                            }}
                            onClick={() => {
                                setSelectedUser(user);
                            }} 
                            />

                            {selectedUser ? (
                            <InfoWindow
                                position={{ lat: parseFloat(selectedUser.latitude), lng: parseFloat(selectedUser.longitude)}}
                                onCloseClick={
                                () => {setSelectedUser(null);
                                }}
                            >
                                <div>
                                <h1 className="font-semibold">{selectedUser.user_id}</h1>
                                <h1>LatLong: {selectedUser.latitude}, {selectedUser.longitude}</h1>
                                <h1>Last updated: {selectedUser.last_recorded_at}</h1>
                                </div>
                            </InfoWindow>
                            ) : null}
                        </>
                        ))}

                    </GoogleMap>
                    }
                </div>
                <div className="h-full w-full">
                    <div className="grid grid-cols-1 gap-5">
                        {LastLocationData?.locations?.data?.map((location) => {
                            return (
                                <>
                                    <div className={`${ currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black" } rounded-md space-y-2 p-3`}>
                                        <h1 className="text-main-red-color font-semibold">{location?.user_id}</h1>
                                        <div className="flex gap-3">
                                            <BsPinMap size={22} /> 
                                            {location?.location}
                                        </div>
                                        <h2 className="">Last Location Recorded at: {location?.latest_recorded_at}</h2>

                                        {location?.latitude}
                                        {location?.longitude}
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>  


        </>
    );
};

export default UserLocationComponent;
