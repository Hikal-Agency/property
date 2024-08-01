import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import { useState, useEffect } from "react";
import {
  Addlisting,
  AddListingAttribute,
  AddListingAttrType,
  AddListingMeta,
  AddListingType,
} from "./listingFormComp";
import { toast } from "react-toastify";

const steps = [1, 2, 3, 4];

export default function MultiStepForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [listingIds, setListingIDs] = useState({
    listing_attribute_id: null,
    listing_type_id: null,
    listing_arrtibute_type_id: null,
    meta_description: null,
    new_listing_id: null,
  });
  console.log("listingIDS::: ", listingIds);
  const [column, setColumn] = useState({
    list_type: [],
    list_attribute: [],
    list_attr_type: [],
  });
  const [data, setData] = useState({
    list_type: [],
    list_attribute: [],
    list_attr_type: [],
  });
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    fontFam,
  } = useStateContext();
  const token = localStorage.getItem("auth-token");
  const [last_page, setLastPage] = useState(null);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(null);
  const [loading, setLoading] = useState(false);

  let type =
    activeStep == 0
      ? "list_attribute"
      : // : activeStep == 1
        // ? "list_attribute"
        // : activeStep == 2
        // ? "list_attr_type"
        null;

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const FetchData = async () => {
    setLoading(true);
    let url;
    if (type === "list_attribute")
      url = `${BACKEND_URL}/listing-types?page=${page}`;
    // if (type === "list_attribute")
    //   url = `${BACKEND_URL}/listing-attributes?page=${page}`;
    // if (type === "list_attr_type")
    //   url = `${BACKEND_URL}/listing-attribute-types?page=${page}`;

    try {
      const listingsData = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("all listings: ", listingsData);
      let listings = listingsData?.data?.data?.data || [];

      let rowsDataArray = "";
      if (listingsData?.data?.data?.current_page > 1) {
        const theme_values = Object.values(listings);
        rowsDataArray = theme_values;
      } else {
        rowsDataArray = listings;
      }

      let rowsData = rowsDataArray?.map((row, index) => {
        if (type === "list_attribute") {
          return {
            lid: row?.id,
            id: page > 1 ? page * pageSize - (pageSize - 1) + index : index + 1,
            name: row?.name,
          };
        }
        //  else if (type === "list_attribute") {
        //   return {
        //     la_id: row?.id,
        //     id: page > 1 ? page * pageSize - (pageSize - 1) + index : index + 1,
        //     listing_type_id: row?.listing_type_id,
        //     name: row?.name,
        //     area: row?.area,
        //     bedroom: row?.bedroom,
        //     bathroom: row?.bathroom,
        //     garage: row?.garage,
        //     gallery: row?.gallery,
        //   };
        // }
        //  else if (type === "list_attr_type") {
        //   return {
        //     lat_id: row?.id,
        //     id: page > 1 ? page * pageSize - (pageSize - 1) + index : index + 1,
        //     listing_attribute_id: row?.listing_attribute_id,
        //     name: row?.name,
        //     type: row?.type,
        //     price: row?.price,
        //     amenities: row?.amenities,
        //     near_by: row?.near_by,
        //     latitude: row?.latitude,
        //     longitude: row?.longitude,
        //   };
        // }
        else {
          return {};
        }
      });

      setData((prevData) => ({
        ...prevData,
        // [type]: rowsData,
        list_type: rowsData,
      }));

      setLoading(false);
      setLastPage(listingsData?.data?.data?.last_page);
      setPageSize(listingsData?.data?.data?.per_page);
      setTotal(listingsData?.data?.data?.total);
    } catch (error) {
      console.log("listings not fetched. ", error);
      toast.error("Unable to fetch data.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      type === "list_attribute"
      // type === "list_type" ||
      // type === "list_attr_type"
    )
      FetchData();
  }, [page, pageSize, type]);

  return (
    <Box
      sx={{
        ...darkModeColors,
        "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
          {
            right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
            transformOrigin: isLangRTL(i18n.language) ? "right" : "left",
          },
        "& legend": {
          textAlign: isLangRTL(i18n.language) ? "right" : "left",
        },
      }}
    >
      <Stepper activeStep={activeStep}>
        {steps?.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography
                variant="caption"
                className={`${
                  currentMode === "dark" ? "text-whtie" : "text-black"
                }`}
              >
                Optional
              </Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel
                {...labelProps}
                sx={{
                  color: currentMode === "dark" ? "text-white" : "text-black",
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* <AddListingType
              data={data}
              setData={setData}
              column={column}
              setColumn={setColumn}
              type="list_type"
              loading={loading}
              setLoading={setLoading}
              page={page}
              pageSize={pageSize}
              total={total}
              setPage={setPage}
              setPageSize={setPageSize}
              FetchData={FetchData}
            /> */}
          {activeStep === 0 && (
            <AddListingAttribute
              data={data}
              setData={setData}
              column={column}
              setColumn={setColumn}
              type="list_attribute"
              loading={loading}
              setLoading={setLoading}
              page={page}
              pageSize={pageSize}
              total={total}
              setPage={setPage}
              setPageSize={setPageSize}
              FetchData={FetchData}
              listingIds={listingIds}
              setListingIDs={setListingIDs}
            />
          )}
          {activeStep === 1 && (
            <AddListingAttrType
              data={data}
              setData={setData}
              column={column}
              setColumn={setColumn}
              type="list_attr_type"
              loading={loading}
              setLoading={setLoading}
              page={page}
              pageSize={pageSize}
              total={total}
              setPage={setPage}
              setPageSize={setPageSize}
              FetchData={FetchData}
              listingIds={listingIds}
              setListingIDs={setListingIDs}
            />
          )}
          {activeStep === 2 && (
            <Addlisting
              data={data}
              listingIds={listingIds}
              setListingIDs={setListingIDs}
            />
          )}
          {activeStep === 3 && (
            <AddListingMeta
              listingIds={listingIds}
              setListingIDs={setListingIDs}
            />
          )}
          {/* {activeStep === 4 && } */}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )} */}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
