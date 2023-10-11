// import Image from "next/image";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import moment from "moment";
import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";

import { load } from "../../Pages/App";
import { BsPinMap } from "react-icons/bs";
import { BiCurrentLocation } from "react-icons/bi";
import { AiOutlineFieldTime } from "react-icons/ai";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import { toPng } from "html-to-image";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const UserLocationComponent = () => {
  const { currentMode, LastLocationData, setLastLocationData, BACKEND_URL } =
    useStateContext();

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
        // console.log("user location data is");
        // console.log(result.data);
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

  const generateCompositeImage = () => {
    if(imageContainerRef.current) {
      toPng(imageContainerRef.current).then(function (dataUrl) {
        return dataUrl;
      });
    }
  };

  generateCompositeImage();

  return (
    <>
      <Box
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
      </Box>
      <div className="w-full flex items-center justify-between pb-3">
        <div className="flex items-center mb-2">
          <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
          <h1
            className={`text-lg font-semibold ${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          >
            Last Location
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
                  size="small"
                  sx={{
                    "& input": {
                      color: currentMode === "dark" ? "#EEEEEE" : "#424242",
                    },
                    "&": {
                      borderRadius: "4px",
                      border: "1px solid #AAAAAA",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#AAAAAA",
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
      </div>

      {LastLocationData && (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 h-[85vh]">
          <div
            className={`${
              currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-gray-200"
            } w-full h-[85vh] col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3`}
          >
            {/* MAP */}
            {!load?.isLoaded ? (
              <div>Your map is loading...</div>
            ) : (
              <>
                {LastLocationData ? (
                  <GoogleMap
                    zoom={selectedLocation ? 16 : 10}
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
                        <Marker
                          key={user?.user_id}
                          position={{
                            lat: parseFloat(user.latitude),
                            lng: parseFloat(user.longitude),
                          }}
                          icon={{
                            url: generateCompositeImage(),
                            // url:
                            //   selectedLocation &&
                            //   selectedLocation.user_id === user.user_id
                            //     ? user?.profile_picture //CHANGE FOR SELECTED
                            //     : "/userpin.svg",
                            // scaledSize: window.google
                            //   ? new window.google.maps.Size(
                            //       selectedLocation &&
                            //       selectedLocation.user_id === user.user_id
                            //         ? 70
                            //         : 50,
                            //       selectedLocation &&
                            //       selectedLocation.user_id === user.user_id
                            //         ? 70
                            //         : 50
                            //     )
                            //   : null,
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
                        ></Marker>

                        {selectedLocation && (
                          <InfoWindow
                            position={{
                              lat:
                                parseFloat(selectedLocation.latitude) + 0.0001,
                              lng: parseFloat(selectedLocation.longitude),
                            }}
                            onCloseClick={() => {
                              setSelectedLocation(null);
                            }}
                          >
                            <div>
                              <h1 className="font-semibold">
                                {selectedLocation.userName}
                              </h1>
                              <h1>
                                LatLong: {selectedLocation.latitude},{" "}
                                {selectedLocation.longitude}
                              </h1>
                              <h1>
                                Last updated:{" "}
                                {selectedLocation.latest_recorded_at}
                              </h1>
                            </div>
                          </InfoWindow>
                        )}
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
                      currentMode === "dark"
                        ? "bg-[#424242] text-white"
                        : "bg-[#EEEEEE] text-black"
                    } rounded-md card-hover h-fit space-y-2 p-3 mb-3`}
                    onClick={() => handleCardclick(location)}
                  >
                    <h1 className="font-semibold capitalize">
                      {location?.userName}
                    </h1>
                    <hr></hr>
                    <div className="flex gap-3">
                      <BsPinMap size={20} className="text-primary" />
                      {location?.location}
                    </div>
                    <div className="flex gap-3">
                      <AiOutlineFieldTime size={20} className="text-primary" />
                      {location?.latest_recorded_at}
                    </div>
                    <div className="flex justify-end">
                      <Tooltip title="View All Location">
                        <IconButton
                          onClick={() =>
                            navigate(
                              `/location/useralllocation/${location?.user_id}/${filterDate}`
                            )
                          }
                          // // onClick={() => handleRowClick(location.user_id)}
                          // sx={{
                          //   backgroundColor: "transparent",
                          //   color: "#ffffff",
                          // }}
                          className="rounded-full p-1 flex items-center w-fit h-fit text-sm btn-sm"
                        >
                          <BiCurrentLocation
                            size={20}
                            className="text-primary"
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="my-5">
                <h2 className={`text-primary text-center italic text-lg`}>
                  No location for selected date.
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
