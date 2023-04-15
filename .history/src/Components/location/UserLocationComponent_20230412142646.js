// import Image from "next/image";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
// import UserImage from "../../public/favicon.png";
import { useStateContext } from "../../context/ContextProvider";
import { BsBuilding, BsCircleFill } from "react-icons/bs";
import { ImLocation, ImClock } from "react-icons/im";
import MapContainer from "./MapComponent";
import UserMapContainer from "./UserMapComponent";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "./App.css";

const UserLocationComponent = ({ user_location }) => {
    const { 
        currentMode,
        LocationData,
        setLocationData
    } = useStateContext();

    const FetchLocation = async (token) => {
        await axios
        .get(`${BACKEND_URL}/locations`, {
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            },
        })
        .then((result) => {
            console.log("user location data is");
            console.log(result.data.locations.data);
            setLocationData(result.data.locations.data);
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
          console.log(LocationData);
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
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 pb-3">
                <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} w-full h-[85vh]`}>
                    {/* MAP */}
                    {(typeof window.google !== "object") ? <div>Your map is loading...</div> :
                    <GoogleMap
                        zoom={10}
                        center={{lat: 25.22527310000002, lng: 55.280889615218406}}
                        mapContainerStyle={mapContainerStyle}
                        options={options}
                    >
                        {/* {userData.map(user => (
                        <>
                            <MarkerF
                            key={user.userId} 
                            position={{ lat: parseFloat(user.last_location_lat), lng: parseFloat(user.last_location_long)}}
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
                                position={{ lat: parseFloat(selectedUser.last_location_lat), lng: parseFloat(selectedUser.last_location_long)}}
                                onCloseClick={
                                () => {setSelectedUser(null);
                                }}
                            >
                                <div>
                                <h1 className="font-semibold">{selectedUser.userName}</h1>
                                <h1>Last updated: {selectedUser.lastTime}</h1>
                                </div>
                            </InfoWindow>
                            ) : null}
                            
                            
                        </>
                        ))} */}

                    </GoogleMap>
                    }
                </div>
                <div className="h-full w-full mt-5">
                    <h4 className="text-red-600 font-bold text-xl mb-2">Users</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                        {LocationData?.map((location, index) => {
                            return (
                                <>
                                    {location?.id}
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
