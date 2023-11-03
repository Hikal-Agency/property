import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, MarkerF, InfoWindow } from "@react-google-maps/api";
import moment from "moment";
import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";

import { load } from "../../Pages/App";
import { BsPinMap, BsClock } from "react-icons/bs";
import { BiCurrentLocation } from "react-icons/bi";
import { AiOutlineFieldTime } from "react-icons/ai";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { datetimeLong } from "../_elements/formatDateTime";

const UserLocationComponent = () => {
  const { 
    currentMode, 
    LastLocationData, 
    setLastLocationData, 
    BACKEND_URL, 
    t,
    themeBgImg
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const [filterDate, setFilterDate] = useState(moment().format("YYYY-MM-DD"));
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("auth-token");
  const imageContainerRef = useRef(null);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleCardclick = (location) => {
    setSelectedLocation(location);
  };

  const handlePinClick = (location) => {
    setSelectedLocation(location);
  };

  console.log("Last location data: ", LastLocationData);
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
  };

  const FetchLastLocation = async (date) => {
    let url = `${BACKEND_URL}/locations?last_by_all`;

    let dateFilter = date;
    const currentDate = moment().format("YYYY-MM-DD");
    if (!dateFilter) {
      dateFilter = currentDate;
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
        setLastLocationData(result.data);
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
    if (token) {
      // FetchLocation();
      FetchLastLocation();
    } else {
      navigate("/", {
        state: {
          error: "Something Went Wrong! Please Try Again",
          continueURL: location.pathname,
        },
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    FetchLastLocation(filterDate);
  }, [filterDate]);



  return (
    <>
      {/* <Box
      className="relative"
        sx={{
          "& .cls-1": {
            fill: "#231f20",
          },
          "& .cls-1, & .cls-2": {
            stroke: "#231f20",
            strokeiMterlimit: 10,
          },
          "& .cls-2": {
            fill: "#da2027",
            width: "200px",
          },
        }}
        ref={imageContainerRef}
      >
        <svg
        className="relative w-[48px]"
          id="Layer_2"
          data-name="Layer 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60.62 88.68"
        >
          <defs></defs>
          <g id="Layer_1-2" data-name="Layer 1">
            <g>
              <g>
                <circle class="cls-1" cx="30.65" cy="27.54" r="6.65" />
                <path
                  class="cls-1"
                  d="M30.31,53.93H13.81c0-9.05,7.44-16.49,16.49-16.49s16.49,7.44,16.49,16.49c0,0,0,0,0,.01H30.31Z"
                />
              </g>
              <path
                class="cls-2"
                d="M51.14,9.76C45.77,4.03,38.42,.5,30.31,.5S14.85,4.03,9.48,9.76C3.94,15.65,.5,23.89,.5,32.99c0,5.99,1.49,11.59,4.09,16.41l3.59,5.35,22.13,33.03,22.13-33.03,3.59-5.35c2.6-4.82,4.09-10.42,4.09-16.41,0-9.1-3.44-17.34-8.98-23.23ZM30.31,53.34c-11.8,0-21.36-9.56-21.36-21.36S18.51,10.62,30.31,10.62s21.35,9.57,21.35,21.36-9.56,21.36-21.35,21.36Z"
              />
            </g>
          </g>
        </svg>
        <img className="absolute rounded-full top-[5px] left-[3px] w-[42px]" src="https://testing.hikalcrm.com/storage/profile-pictures/102.jpg" alt=""/>
      </Box> */}
      <div className="w-full flex items-center justify-between pb-3">
        <div className="flex items-center mb-2">
          <div className="bg-primary h-10 w-1 rounded-full"></div>
          <h1
            className={`text-lg font-semibold mx-2 uppercase ${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          >
            {t("last_location")}
          </h1>
        </div>

        <div className="m-2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={filterDate}
              views={["year", "month", "day"]}
              format="yyyy-MM-dd"
              onChange={(newValue) => {
                // setMeetingDateValue(newValue);

                const formattedDate = moment(newValue?.$d).format("YYYY-MM-DD");
                setFilterDate(formattedDate);

                // FetchLastLocation(token, formattedDate);
                // FetchLocation(token, formattedDate);
              }}
              renderInput={(params) => (
                <TextField
                  className={`${themeBgImg && (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")}`}
                  size="small"
                  sx={{
                    "& input": {
                      color: currentMode === "dark" ? "#EEEEEE" : "#333333",
                    },
                    "&": {
                      borderRadius: "4px",
                      border: currentMode === "dark" ? "1px solid #EEEEEE" : "1px solid #333333",
                    },
                    "& .MuiSvgIcon-root": {
                      color: currentMode === "dark" ? "#EEEEEE" : "#333333",
                    },
                  }}
                  label={t("date")}
                  {...params}
                  onKeyDown={(e) => e.preventDefault()}
                  readOnly={true}
                />
              )}
            />
          </LocalizationProvider>
        </div>
      </div>

      {LastLocationData && (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 h-screen">
          <div
            className={` w-full h-screen col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3`}
          >
            {/* MAP */}
            {!load?.isLoaded ? (
              <div>{t("map_is_loading")}...</div>
            ) : (
              <>
                {LastLocationData ? (
                  <GoogleMap
                    zoom={selectedLocation ? 14 : 10}
                    center={{
                      lat: selectedLocation
                        ? selectedLocation.latitude
                        : 25.22527310000002,
                      lng: selectedLocation
                        ? selectedLocation.longitude
                        : 55.280889615218406,
                    }}
                    mapContainerStyle={mapContainerStyle}
                    options={options}
                  >
                    {LastLocationData?.locations?.data?.map((user) => (
                      <>
                        <MarkerF
                          key={user?.user_id}
                          position={{
                            lat: parseFloat(user.latitude),
                            lng: parseFloat(user.longitude),
                          }}
                          icon={{
                            url: "/userpin.svg",
                            scaledSize: window.google
                              ? new window.google.maps.Size(
                                  selectedLocation &&
                                  selectedLocation.user_id === user.user_id
                                    ? 70
                                    : 50,
                                  selectedLocation &&
                                  selectedLocation.user_id === user.user_id
                                    ? 70
                                    : 50
                                )
                              : new window.google.maps.Size(50, 50),

                            zIndex:
                              selectedLocation &&
                              selectedLocation.user_id === user.user_id
                                ? 1000 // Set a high zIndex value for the selected pin
                                : 1,
                          }}
                          onClick={() => {
                            // setselectedLocation(user);
                            handlePinClick(user);
                          }}
                        >
                          {selectedLocation && selectedLocation.user_id === user.user_id && (
                            <InfoWindow
                              position={{
                                lat: Number(selectedLocation.latitude),
                                lng: Number(selectedLocation.longitude),
                              }}
                              onCloseClick={() => {
                                setSelectedLocation(null);
                                // clearSelectedMeeting();
                              }}
                            >
                              <div className="w-[250px]">
                                <h1 
                                className="p-1 font-semibold capitalize text-primary"
                                >
                                  {selectedLocation.userName}
                                </h1>
                                <hr className="my-1" />
                                <div className="p-1 grid grid-cols-7">
                                  <BsPinMap size={16} />
                                  <div className="col-span-6">
                                    {selectedLocation.location}
                                  </div>
                                </div>
                                <div className="p-1 grid grid-cols-7">
                                  <BsClock size={16} />
                                  <div className="col-span-6">
                                    {datetimeLong(selectedLocation.latest_recorded_at)}
                                  </div>
                                </div>
                              </div>
                            </InfoWindow>
                          )}
                        </MarkerF>
                      </>
                    ))}
                  </GoogleMap>
                ) : (
                  <GoogleMap
                    zoom={10}
                    center={{
                      lat: 25.22527310000002,
                      lng: 55.280889615218406,
                    }}
                    mapContainerStyle={mapContainerStyle}
                    options={options}
                  ></GoogleMap>
                )}
              </>
            )}
          </div>
          <div className="w-full overflow-y-scroll hide-scrollbar">
            {LastLocationData?.locations?.data?.length > 0 ? (
              LastLocationData?.locations?.data?.map((location) => {
                return (
                  <div
                    className={`${
                      !themeBgImg ? (currentMode === "dark"
                        ? "bg-[#424242] text-white"
                        : "bg-[#EEEEEE] text-black")
                        : (currentMode === "dark"
                        ? "blur-bg-dark text-white"
                        : "blur-bg-light text-black")
                    } rounded-xl shadow-sm card-hover h-fit space-y-2 p-3 my-1`}
                    onClick={() => handleCardclick(location)}
                  >
                    <h1 className="font-semibold my-1 capitalize flex gap-3 items-center justify-between">
                      {location?.userName}
                      <img 
                      src={location?.profile_picture !== null || location?.profile_picture !== "" ? location?.profile_picture : "/favicon.png"} 
                      className="w-10 h-10 rounded-full" />
                    </h1>
                    <hr className="my-1" />
                    <div className="my-1 grid grid-cols-7 gap-3">
                      <BsPinMap size={16} className={!themeBgImg ? "text-primary" : (currentMode === "dark" ? "text-[#CCCCCC]" : "text-[#333333]")} />
                      <div className="col-span-6">{location?.location}</div>
                    </div>
                    <div className="my-1 grid grid-cols-7 gap-3">
                      <BsClock size={16} className={!themeBgImg ? "text-primary" : (currentMode === "dark" ? "text-[#CCCCCC]" : "text-[#333333]")} />
                      <div className="col-span-6">{location?.latest_recorded_at}</div>
                    </div>
                    <div className=" my-1 w-full">
                      <Tooltip title="View All Location">
                        <button
                          onClick={() =>
                            navigate(
                              `/location/useralllocation/${location?.user_id}/${filterDate}`
                            )
                          }
                          className="rounded-md uppercase text-white w-full p-1.5 justify-center flex bg-primary hover:bg-red-600 items-center gap-3 text-sm btn-sm"
                        >
                          <BiCurrentLocation
                            size={16}
                          />
                          {t("view_all_locations")}
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="my-5">
                <h2 className={`text-primary text-center italic text-lg`}>
                  {t("no_location_for_date")}.
                </h2>
              </div>
            )}
          </div>
          {/* )} */}
        </div>
      )}
    </>
  );
};

export default UserLocationComponent;
