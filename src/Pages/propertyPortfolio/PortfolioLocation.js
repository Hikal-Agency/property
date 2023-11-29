import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { BiCurrentLocation } from "react-icons/bi";
import ListingAutoComplete from "../../Components/Leads/listings/ListingAutoComplete";
import { useStateContext } from "../../context/ContextProvider";
import { load } from "../../Pages/App";

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

const PortfolioLocation = ({
  listingLocation,
  setListingLocation,
  showOnly = false,
  currLocByDefault,
}) => {
  console.log("listing location: ", listingLocation);
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
          console.log("location result:: ", result);
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
    if (listingLocation?.lat === 0 || listingLocation?.lng === 0) {
      handleCurrentLocationClick();
    }
  }, []);

  return (
    <>
      {load?.isLoaded ? (
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
            size="small"
            className={`${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          />
          <div style={{ marginTop: 30 }}></div>
          <GoogleMap
            className="relative"
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

export default PortfolioLocation;
