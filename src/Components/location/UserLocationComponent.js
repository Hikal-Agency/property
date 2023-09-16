// import Image from "next/image";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, MarkerF, InfoWindow } from "@react-google-maps/api";

import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";

import { BsPinMap, BsCircleFill } from "react-icons/bs";
import { BiCurrentLocation } from "react-icons/bi";
import { AiOutlineFieldTime } from "react-icons/ai";
import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const UserLocationComponent = () => {
  const {
    currentMode,
    LocationData,
    setLocationData,
    LastLocationData,
    setLastLocationData,
    BACKEND_URL,
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const [filterDate, setFilterDate] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("auth-token");

  const [selectedUser, setSelectedUser] = React.useState(null);

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

  const FetchLocation = async (date) => {
    let url = `${BACKEND_URL}/locations`;
    if (date) {
      const startDate = moment(date).format("YYYY-MM-DD");
      const endDate = moment(date).add(1, "days").format("YYYY-MM-DD");
      const dateRange = [startDate, endDate].join(",");

      url += `?data_range=${dateRange}`;
    }
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
        setLocationData(result.data);
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

  const FetchLastLocation = async (date) => {
    let url = `${BACKEND_URL}/locations?last_by_all`;
    if (date) {
      const startDate = moment(date).format("YYYY-MM-DD");
      const endDate = moment(date).add(1, "days").format("YYYY-MM-DD");
      const dateRange = [startDate, endDate].join(",");

      url += `&data_range=${dateRange}`;
    }
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

  //CLICK FUNCTION
  const handleRowClick = async (params) => {
    window.open(`/location/useralllocation/${params}`);
  };

  useEffect(() => {
    if (token) {
      FetchLocation();
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
    // FetchLocation(filterDate);
    FetchLastLocation(filterDate);
    // eslint-disable-next-line
  }, [filterDate]);

  return (
    <>
      <div className="flex justify-center items-center my-5">
        {/* <div className=""> */}
        <div className="w-full flex flex-row items-center justify-center py-1">
          {/* <div> */}
          <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div>
          <h1
            className={`text-lg font-semibold ${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          >
            User Locations
          </h1>
          {/* </div> */}
          {/* <div>
              DATE FIELD (default is today's date) / (If "2023-09-15" is
              selected, date_range = "2023-09-15,2023-09-16")
            </div> */}
        </div>
        {/* </div> */}
        <div className="ml-3">
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
                      color: currentMode === "dark" ? "white" : "black",
                    },
                    "&": {
                      borderRadius: "4px",
                      border:
                        currentMode === "dark"
                          ? "1px solid white"
                          : "1px solid black",
                    },
                    "& .MuiSvgIcon-root": {
                      color: currentMode === "dark" ? "white" : "black",
                    },
                  }}
                  label="Meeting Date"
                  {...params}
                  onKeyDown={(e) => e.preventDefault()}
                  readOnly={true}
                />
              )}
            />
          </LocalizationProvider>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-3">
        <div
          className={`${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-gray-200"
          } w-full h-[85vh] col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3`}
        >
          {/* MAP */}
          {typeof window.google !== "object" ? (
            <div>Your map is loading...</div>
          ) : (
            <GoogleMap
              zoom={10}
              center={{ lat: 25.22527310000002, lng: 55.280889615218406 }}
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
                        ? new window.google.maps.Size(50, 50)
                        : null,
                    }}
                    onClick={() => {
                      setSelectedUser(user);
                    }}
                  />

                  {selectedUser ? (
                    <InfoWindow
                      position={{
                        lat: parseFloat(selectedUser.latitude),
                        lng: parseFloat(selectedUser.longitude),
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
                          LatLong: {selectedUser.latitude},{" "}
                          {selectedUser.longitude}
                        </h1>
                        <h1>Last updated: {selectedUser.latest_recorded_at}</h1>
                      </div>
                    </InfoWindow>
                  ) : null}
                </>
              ))}
            </GoogleMap>
          )}
        </div>
        <div className="h-full w-full">
          <div className="grid grid-cols-1 gap-5">
            {LastLocationData?.locations?.data?.map((location) => {
              return (
                <>
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-[#1c1c1c] text-white"
                        : "bg-gray-200 text-black"
                    } rounded-md space-y-2 p-3`}
                  >
                    <h1 className="font-semibold capitalize">
                      {location?.userName}
                    </h1>
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
                        onClick={() =>
                          navigate(
                            `/location/useralllocation/${location?.user_id}`
                          )
                        }
                        // onClick={() => handleRowClick(location.user_id)}
                        sx={{ backgroundColor: "#da1f26", color: "#ffffff" }}
                        className="rounded-md p-1 flex items-center w-fit h-fit text-sm btn-sm"
                      >
                        <BiCurrentLocation size={20} />
                      </Button>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLocationComponent;
