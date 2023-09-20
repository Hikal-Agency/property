import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { GoogleMap, MarkerF, InfoWindow } from "@react-google-maps/api";

import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";

const UserAllLocation = (props) => {
  const {
    UserLocationData,
    setUserLocationData,
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const userid = location.pathname.split("/")[3];
  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
  const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");

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
          className={`w-full  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="m-4 flex justify-end">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={filterDate}
                views={["year", "month", "day"]}
                format="yyyy-MM-dd"
                onChange={(newValue) => {
                  const formattedDate = moment(newValue?.$d).format(
                    "YYYY-MM-DD"
                  );
                  setFilterDate(formattedDate);
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
          <div className="px-5">
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
                    } w-full h-[85vh] col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3`}
                  >
                    {/* MAP */}
                    {typeof window.google !== "object" ? (
                      <div>Your map is loading...</div>
                    ) : (
                      <GoogleMap
                        zoom={14}
                        center={{
                          lat: 25.22527310000002,
                          lng: 55.280889615218406,
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
                            />
                            {selectedUser ? (
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
                            ) : null}
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
