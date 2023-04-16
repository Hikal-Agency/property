// import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
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
  console.log("userid");
  console.log(userid);

  const FetchUserLocation = async (token) => {
    await axios
      .get(`${BACKEND_URL}/locations?userID=${userid}`, {
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
                                  <h1 className="font-semibold">{selectedUser.userName}</h1>
                                  <h1>LatLong: {selectedUser.latitude}, {selectedUser.longitude}</h1>
                                  <h1>Last updated: {selectedUser.latest_recorded_at}</h1>
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
                                          <h1 className="font-semibold">{location?.userName}</h1>
                                          <hr></hr>
                                          <div className="flex gap-3">
                                              <BsPinMap size={20} color="#da1f26" /> 
                                              {location?.location}
                                          </div>
                                          <div className="flex gap-3">
                                              <AiOutlineFieldTime size={20} color="#da1f26" />
                                              {location?.latest_recorded_at}
                                          </div>
                                          <div className="flex justify-end">
                                              <Button
                                                  type="button"
                                                  onClick={() => handleRowClick(location.user_id)}
                                                  sx={{ backgroundColor: "#da1f26", color: "#ffffff" }} 
                                                  className="rounded-md p-1 flex items-center w-fit h-fit text-sm btn-sm"
                                                  >
                                                  <BiCurrentLocation size={20} />
                                              </Button>
                                          </div>
                                      </div>
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

export default UserAllLocation;
