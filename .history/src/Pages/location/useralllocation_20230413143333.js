// import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api';
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import UserLocationComponent from "../../Components/location/UserLocationComponent";

const UserAllLocation = (props) => {
  const { 
    UserLocationData,
    setUserLocationData,
    currentMode, 
    setopenBackDrop,
    BACKEND_URL
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const navigate = useNavigate(); 
  const location = useLocation();
  const userid = location.pathname.split("/")[3];

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };
  const options = {
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: true,
  }

  const FetchUserLocation = async (token) => {
    await axios
      // .get(`${BACKEND_URL}/locations?userID=${userid}`, {
      .get(`${BACKEND_URL}/locations?userID=${userid}&date_range=${((new Date()).getDate() - 1).toISOString().slice(0, 10)},${((new Date()).getDate() + 1).toISOString().slice(0, 10)}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("user all location data is");
        console.log(result.data);
        setUserLocationData(result.data);
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
      FetchUserLocation(token);
      console.log((new Date()).getDate() - 1);
      console.log((new Date()).getDate() + 1);
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
              <h4 className="text-red-600 font-bold text-xl mb-2 text-center">{userid}</h4>
              {UserLocationData?.locations?.data[0].userName}
              <div className="grid gap-5 pb-3">
                <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} w-full h-[85vh] col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3`}>
                  {/* MAP */}
                  {(typeof window.google !== "object") ? <div>Your map is loading...</div> :
                    <GoogleMap
                      zoom={10}
                      center={{lat: 25.22527310000002, lng: 55.280889615218406}}
                      mapContainerStyle={mapContainerStyle}
                      options={options}
                    >
                      {UserLocationData?.locations?.data?.map(user => (
                      <>
                        <MarkerF
                          key={user.user_id} 
                          position={{ lat: parseFloat(user.latitude), lng: parseFloat(user.longitude)}}
                          icon={{
                              url: "/oldpin.svg",
                              scaledSize: window.google ? new window.google.maps.Size(30,30) : null,
                          }}
                        />
                      </>
                      ))}

                      <MarkerF
                        key={UserLocationData?.locations?.data[0].user_id} 
                        position={{ lat: parseFloat(UserLocationData?.locations?.data[0].latitude), lng: parseFloat(UserLocationData?.locations?.data[0].longitude)}}
                        icon={{
                            url: "/userpin.svg",
                            scaledSize: window.google ? new window.google.maps.Size(50,50) : null,
                        }}
                      />
                      <InfoWindow
                          position={{ lat: parseFloat(UserLocationData?.locations?.data[0].latitude), lng: parseFloat(UserLocationData?.locations?.data[0].longitude)}}
                      >
                          <div>
                          <h1 className="font-semibold">{UserLocationData?.locations?.data[0].userName}</h1>
                          <h1>LatLong: {UserLocationData?.locations?.data[0].latitude}, {UserLocationData?.locations?.data[0].longitude}</h1>
                          <h1>Last updated: {UserLocationData?.locations?.data[0].recorded_at}</h1>
                          </div>
                      </InfoWindow>

                    </GoogleMap>
                  } 
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

export default UserAllLocation;
