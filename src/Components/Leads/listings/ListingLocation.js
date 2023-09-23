import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { BiCurrentLocation } from "react-icons/bi";
import ListingAutoComplete from "./ListingAutoComplete";
import { useStateContext } from "../../../context/ContextProvider";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const currentLocBtnStyle = {
  padding: "7px",
  width: 40,
  height: 40,
  minWidth: "auto",
  position: "absolute",
  top: 15,
  right: 10,
};

const ListingLocation = ({
  listingLocation,
  setListingLocation,
  showOnly = false,
  currLocByDefault,
  city,
  setCity,
  country,
  setCountry,
}) => {
  const { currentMode } = useStateContext();
  const geocoder = new window.google.maps.Geocoder();

  const [map, setMap] = useState({
    panTo() {},
  });

  const handleCurrentLocationClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      geocoder.geocode(
        {
          location: {
            lat: Number(position.coords.latitude),
            lng: Number(position.coords.longitude),
          },
        },
        (results, status) => {
          if (status === "OK") {
            if (showOnly) {
              map.panTo({ lat: listingLocation.lat, lng: listingLocation.lng });
            } else {
              setListingLocation({
                lat: Number(position.coords.latitude),
                lng: Number(position.coords.longitude),
                addressText: results[0].formatted_address,
              });
            }
          } else {
            console.log("Getting address failed due to : ", status);
          }
        }
      );
    });
  };

  const onSelect = ({ latLng }) => {
    geocoder.geocode(
      { location: { lat: Number(latLng.lat()), lng: Number(latLng.lng()) } },
      (results, status) => {
        if (status === "OK") {
          setListingLocation({
            lat: Number(latLng.lat()),
            lng: Number(latLng.lng()),
            addressText: results[0].formatted_address,
          });
          console.log(results[0]);
        } else {
          console.log("Google maps couldn't load");
        }
      }
    );
  };
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
  };

  useEffect(() => {
    map.panTo({ lat: listingLocation.lat, lng: listingLocation.lng });
  }, [listingLocation.lat, listingLocation.lng, map]);

  useEffect(() => {
    if (currLocByDefault) {
      handleCurrentLocationClick();
    }
  }, []);
  return (
    <>
      {typeof window.google === "object" ? (
        <Box
          sx={{
            "& ul": {
              color: currentMode === "dark" ? "white" : "black",
            },
          }}
          style={{ width: "100%" }}
        >
          <ListingAutoComplete
            defaultLocation={listingLocation.addressText}
            setListingLocation={setListingLocation}
            isDisabled={showOnly}
            setCity={setCity}
            country={country}
            setCountry={setCountry}
            city={city}
            size="small"
            className={`${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          />
          <div style={{ marginTop: 30 }}></div>
          <GoogleMap
            onLoad={(map) => setMap(map)}
            mapContainerStyle={mapContainerStyle}
            center={listingLocation}
            zoom={15}
            onClick={showOnly ? () => {} : onSelect}
            options={options}
          >
            <Marker position={listingLocation} />

            <Button
              onClick={handleCurrentLocationClick}
              variant="contained"
              sx={currentLocBtnStyle}
            >
              <BiCurrentLocation color="white" size={25} />
            </Button>
          </GoogleMap>
        </Box>
      ) : (
        <div>Your map is loading...</div>
      )}
    </>
  );
};

export default ListingLocation;
