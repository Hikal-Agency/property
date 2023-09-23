import { useEffect } from "react";
import { TextField } from "@mui/material";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { useStateContext } from "../../../context/ContextProvider";

const ListingAutoComplete = ({
  isDisabled,
  defaultLocation,
  setListingLocation,
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const { currentMode } = useStateContext();
  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      setValue(description, false);
      clearSuggestions();

      getGeocode({ address: description }).then((results) => {
        console.log("autocomplete", results);
        const { lat, lng } = getLatLng(results[0]);
        setListingLocation((listingLocation) => {
          return { ...listingLocation, lat, lng };
        });
      });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      console.log(suggestion);
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  useEffect(() => {
    setValue(defaultLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultLocation]);

  return (
    <div ref={ref}>
      <TextField
        type={"text"}
        fullWidth
        sx={{
          "& input": {
            color: currentMode === "dark" ? "white" : "black",
            fontFamily: "Noto Kufi Arabic",
          },
        }}
        disabled={isDisabled ? true : !ready}
        onChange={handleInput}
        required
        placeholder="Search Location"
        value={value}
      />
      {status === "OK" && !isDisabled && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

export default ListingAutoComplete;
