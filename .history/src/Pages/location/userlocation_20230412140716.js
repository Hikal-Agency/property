// import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api';
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import LocationComponent from "../../Components/location/LocationComponent";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import UserLocationComponent from "../../Components/location/UserLocationComponent";

const Userlocation = () => {
  const { 
    LocationData,
    currentMode, 
    setopenBackDrop,
    setLocationData,
    BACKEND_URL
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const navigate = useNavigate(); 
  const location = useLocation();

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
        console.log("user location data is");
        console.log(result.locations.data);
        setLocationData(result?.locations?.data);
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

      setopenBackDrop(false);

    if (token) {
      FetchLocation(token);
    } else {
      navigate("/", {
        state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <div className="flex">
          <Sidebarmui />
          <div
            className={`w-full  ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5 ">
              <Navbar />
              {/* <UserLocationComponent user_location={LocationData} /> */}
              {/* UserLocationComponent  */}
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
                                      {location?.locations?.data?.id}
                                  </>
                              )
                          })}
                      </div>
                  </div>
              </div>  



            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Userlocation;
