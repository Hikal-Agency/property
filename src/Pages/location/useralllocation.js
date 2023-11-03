import React from "react";
import { useEffect, useState } from "react";
import { load } from "../App";
import { GoogleMap, MarkerF, InfoWindow } from "@react-google-maps/api";

import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import { datetimeLong } from "../../Components/_elements/formatDateTime";

import {
  BsClock
} from "react-icons/bs";

const UserAllLocation = (props) => {
  const {
    UserLocationData,
    setUserLocationData,
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    themeBgImg
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const userid = location.pathname.split("/")[3];
  const parentDate = location.pathname.split("/")[4];
  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
  const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");

  console.log("parentDate: ", parentDate);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
  };
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [filterDate, setFilterDate] = useState(null);

  const FetchUserLocation = async (token, date) => {
    let url = `${BACKEND_URL}/locations?userID=${userid}`;

    let dateFilter = date;
    const currentDate = moment().format("YYYY-MM-DD");
    if (!dateFilter) {
      dateFilter = parentDate;
    }

    const startDate = moment(dateFilter).format("YYYY-MM-DD");
    const endDate = moment(dateFilter).add(1, "days").format("YYYY-MM-DD");
    const dateRange = [startDate, endDate].join(",");
    url += `&date_range=${dateRange}`;

    await axios
      .get(url, {
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
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    FetchUserLocation(token);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    FetchUserLocation(token, filterDate);
  }, [filterDate]);

  return (
    <>
      <div className="min-h-screen">
        <div
          className={`w-full p-4`}
        >
          <div className="flex justify-between">
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1
                className={`text-lg font-semibold mx-2 uppercase ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {UserLocationData?.locations?.data[0].userName}
              </h1>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={filterDate || parentDate}
                views={["year", "month", "day"]}
                format="yyyy-MM-dd"
                onChange={(newValue) => {
                  const formattedDate = moment(newValue?.$d).format(
                    "YYYY-MM-DD"
                  );
                  setFilterDate(formattedDate);
                }}
                size="small"
                renderInput={(params) => (
                  <TextField
                    size="small"
                    sx={{
                      "& input": {
                        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
                      },
                      "&": {
                        borderRadius: "4px",
                        // border: currentMode === "dark" ? "1px solid #EEEEEE" :"1px solid #333333",
                      },
                      "& .MuiSvgIcon-root": {
                        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
                      },
                    }}
                    label="Date"
                    {...params}
                    onKeyDown={(e) => e.preventDefault()}
                    readOnly={true}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className="">
            <h4 className="text-primary font-bold text-lg mb-2 text-center">
              {UserLocationData?.location?.data?.length > 0 ? (
                <>{UserLocationData?.locations?.data[0].userName}</>
              ) : (
                <></>
              )}
            </h4>
            <div className="grid gap-5 pb-3">
              {UserLocationData?.locations?.data?.length > 0 && (
                <>
                  <div
                    className={`${
                      currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-gray-200"
                    } w-full h-screen col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3`}
                  >
                    {/* MAP */}
                    {!load?.isLoaded ? (
                      <div>Your map is loading...</div>
                    ) : (
                      <GoogleMap
                        zoom={14}
                        center={{
                          lat: UserLocationData?.locations?.data[0].latitude,
                          lng: UserLocationData?.locations?.data[0].longitude,
                        }}
                        mapContainerStyle={mapContainerStyle}
                        options={options}
                      >
                        {UserLocationData?.locations?.data?.map((user) => (
                          <>
                            <MarkerF
                              key={user?.user_id}
                              position={{
                                lat: parseFloat(user?.latitude),
                                lng: parseFloat(user?.longitude),
                              }}
                              icon={{
                                url: "/oldpin.svg",
                                scaledSize: window.google
                                  ? new window.google.maps.Size(30, 30)
                                  : new window.google.maps.Size(50, 50),
                              }}
                              onClick={() => {
                                setSelectedUser(user);
                              }}
                            >
                              {selectedUser && (
                                <InfoWindow
                                  position={{
                                    lat: Number(selectedUser.latitude),
                                    lng: Number(selectedUser.longitude),
                                  }}
                                  onCloseClick={() => {
                                    setSelectedUser(null);
                                  }}
                                >
                                  <div className="w-[250px]">
                                    <h1 
                                    className="p-1 font-semibold capitalize text-primary"
                                    >
                                      {selectedUser.userName}
                                    </h1>
                                    <hr className="my-1" />
                                    <div className="p-1 grid grid-cols-7">
                                      <BsClock size={16} />
                                      <div className="col-span-6">
                                        {datetimeLong(selectedUser.recorded_at)}
                                      </div>
                                    </div>
                                  </div>
                                </InfoWindow>
                              )}

                              {/* {selectedUser ? (
                                <InfoWindow
                                  position={{
                                    lat: parseFloat(selectedUser?.latitude),
                                    lng: parseFloat(selectedUser?.longitude),
                                  }}
                                  onCloseClick={() => {
                                    setSelectedUser(null);
                                  }}
                                >
                                  <div>
                                    <h1 className="font-semibold">
                                      {selectedUser.userName}
                                    </h1>
                                    <h1>
                                      LatLong: {selectedUser?.latitude},{" "}
                                      {selectedUser?.longitude}
                                    </h1>
                                    <h1>
                                      Last updated: {selectedUser.recorded_at}
                                    </h1>
                                  </div>
                                </InfoWindow>
                              ) : null} */}
                            </MarkerF>
                          </>
                        ))}
                        <MarkerF
                          key={UserLocationData?.locations?.data[0]?.user_id}
                          position={{
                            lat: parseFloat(
                              UserLocationData?.locations?.data[0]?.latitude
                            ),
                            lng: parseFloat(
                              UserLocationData?.locations?.data[0]?.longitude
                            ),
                          }}
                          icon={{
                            url: "/userpin.svg",
                            // scaledSize: window.google
                            //   ? new window.google.maps.Size(50, 50)
                            //   : null,
                            scaledSize: window.google
                              ? new window.google.maps.Size(50, 50)
                              : new window.google.maps.Size(50, 50),
                          }}
                          onClick={() => {
                            setSelectedUser(
                              UserLocationData?.locations?.data[0]
                            );
                          }}
                        />
                      </GoogleMap>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default UserAllLocation;
