import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  FormControlLabel,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { selectStyles } from "../../../Components/_elements/SelectStyles";
import Select from "react-select";
import axios from "../../../axoisConfig";
import { toast } from "react-toastify";
import ListingDataGrid from "../ListingDataGrid";
import SelectOption from "@material-tailwind/react/components/Select/SelectOption";
import { IoMdClose } from "react-icons/io";
import { BsDash, BsPlus, BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import {
  bathroom_options,
  enquiry_options,
  property_options,
} from "../../_elements/SelectOptions";

const AddListingAttribute = ({
  data,
  setData,
  loading,
  setLoading,
  page,
  pageSize,
  total,
  setPage,
  setPageSize,
  FetchData,
  listingIds,
  setListingIDs,
  handleNext,
  listData,
  edit,
  handleClose,
  fetchSingleListing,
}) => {
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

  console.log("api data from parent:: ", data);

  const [btnLoading, setBtnLoading] = useState(false);
  const [listingAttr, setListingAttr] = useState({
    name: listData?.listing_attribute?.name || "",
    listing_type_id: listData?.listing_type?.id || "",
    area: listData?.listing_attribute?.area || "",
    bedroom: listData?.listing_attribute?.bedroom || "",
    bathroom: listData?.listing_attribute?.bathroom || "",
  });

  console.log("listing attr:: ", listingAttr);
  const [deleteDialogue, setDeleteDialogue] = useState(false);
  const [editData, setEditData] = useState(null);

  console.log("edit data::: ", editData);

  const handleEdit = (values) => {
    console.log("values ::: ", values);
    setEditData(values);
    setListingAttr({
      name: values?.name,
      listing_type_id: values?.listing_type_id,
      area: values?.area,
      bedroom: values?.bedroom,
      bathroom: values?.bathroom,
      // garage: values?.garage,
      // gallery: values?.gallery,
    });
  };

  const deleteListAttr = (deleteDialogue) => {
    setBtnLoading(true);

    axios
      .delete(
        `${BACKEND_URL}/listing-attributes/${deleteDialogue?.la_id}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        setBtnLoading(false);
        setDeleteDialogue(false);

        toast.success(`${deleteDialogue?.name} deleted successfully.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        FetchData();
      })
      .catch((err) => {
        setBtnLoading(false);
        console.log(err);
        toast.error("Something Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  console.log("listing attr data:: ", listingAttr);

  const handleCheckboxChange = (event) => {
    console.log("checkbox: ", event.target.checked);
    setListingAttr({
      ...listingAttr,
      garage: event.target.checked ? "1" : "0",
    });
  };

  const handleChange = (e) => {
    setListingAttr((prevListingAttr) => ({
      ...prevListingAttr,
      [e.target.id]: e.target.value,
    }));
  };

  const AddListAttr = () => {
    setBtnLoading(true);

    let url = edit
      ? `${BACKEND_URL}/listing-attributes/${listData?.listing_attribute?.id}`
      : `${BACKEND_URL}/listing-attributes`;

    let method = edit ? "put" : "post";

    axios({
      method: method,
      url: url,
      data: listingAttr,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((result) => {
        console.log("listing attr added : ", result);
        setBtnLoading(false);

        toast.success(
          `Listing Attribute ${edit ? "updated" : "added"}  successfully.`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );

        if (edit) {
          handleClose();
          fetchSingleListing();
          return;
        }

        const attrID = result?.data?.data?.id;
        setListingIDs({
          ...listingIds,
          listing_attribute_id: attrID,
          listing_type_id: listingAttr?.listing_type_id,
        });

        setListingAttr({
          name: "",
          listing_type_id: "",
          area: "",
          bedroom: "",
          bathroom: "",
          // garage: "",
          // gallery: "",
        });
        // FetchData();
        handleNext();
      })
      .catch((err) => {
        console.error(err);
        setBtnLoading(false);
        console.log(err);
        const errors = err.response?.data?.errors;

        if (errors) {
          const errorMessages = Object.values(errors).flat().join(" ");
          toast.error(`Errors: ${errorMessages}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.error("Something Went Wrong! Please Try Again", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      });
  };

  return (
    <div className="my-4">
      <h4 className={`text-primary text-center font-semibold pb-5`}>
        {t("heading_listing_attr")}
      </h4>

      <div className="grid sm:grid-cols-1   md:grid-cols-2 lg:grid-cols-2 gap-3">
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
          <Select
            id="listing_type_id"
            value={{
              value: listingAttr?.listing_type_id,
              label: listingAttr?.listing_type_id
                ? data?.list_type?.filter(
                    (list_type) =>
                      list_type.lid === listingAttr?.listing_type_id
                  )[0]?.name
                : t("label_listing_type"),
            }}
            onChange={(e) => {
              setListingAttr({
                ...listingAttr,
                listing_type_id: e.value,
              });
            }}
            options={data?.list_type?.map((list_type) => ({
              value: list_type.lid,
              label: list_type.name,
            }))}
            className="w-full"
            placeholder={t("label_listing_type")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <TextField
            id="name"
            type={"text"}
            label={t("name")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttr?.name}
            name="projectLocation"
            onChange={handleChange}
            required
          />
          <TextField
            id="area"
            type={"text"}
            label={t("form_project_area")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttr?.area}
            name="area"
            onChange={handleChange}
            required
          />

          {/* <TextField
            id="gallery"
            type={"text"}
            label={t("gallery")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttr?.gallery}
            name="tourLink"
            onChange={handleChange}
          /> */}
        </Box>
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
          {/* <Select
            id="listing_type_id"
            value={{
              value: listingAttr?.listing_type_id,
              label: listingAttr?.listing_type_id
                ? data?.list_type?.filter(
                    (list_type) =>
                      list_type.lid === listingAttr?.listing_type_id
                  )[0]?.name
                : t("label_listing_type"),
            }}
            onChange={(e) => {
              setListingAttr({
                ...listingAttr,
                listing_type_id: e.value,
              });
            }}
            options={data?.list_type?.map((list_type) => ({
              value: list_type.lid,
              label: list_type.name,
            }))}
            className="w-full"
            placeholder={t("label_listing_type")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          /> */}
          {/* <TextField
            id="bedroom"
            type={"text"}
            label={t("bedroom")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttr?.bedroom}
            name="projectLocation"
            onChange={handleChange}
            required
          /> */}
          <Select
            id="bedroom"
            value={enquiry_options(t).find(
              (option) => option.value === listingAttr?.bedroom
            )}
            onChange={(e) => {
              setListingAttr({
                ...listingAttr,
                bedroom: e.value,
              });
            }}
            options={enquiry_options(t)}
            placeholder={t("number_of_bedrooms")}
            className="w-full"
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
            required
          />

          <Select
            id="bathroom"
            value={bathroom_options(t).find(
              (option) => option.value === listingAttr?.bathroom
            )}
            onChange={(e) => {
              setListingAttr({
                ...listingAttr,
                bathroom: e.value,
              });
            }}
            options={bathroom_options(t)}
            placeholder={t("number_of_bathrooms")}
            className="w-full"
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
            required
          />

          {/* <FormControlLabel
            control={
              <Checkbox
                value={listingAttr?.garage}
                onChange={handleCheckboxChange}
                checked={listingAttr?.garage}
                name="garage"
                id="garage"
                fullWidth
                inputProps={{ "aria-label": "controlled" }}
                style={{
                  color: currentMode === "dark" ? "#fff" : "#000",
                }}
              />
            }
            label={t("garage")}
          /> */}

          <Button
            className={`min-w-fit text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
            ripple={true}
            style={{
              fontFamily: fontFam,
              background: `${primaryColor}`,
            }}
            size="lg"
            type="submit"
            disabled={btnLoading ? true : false}
            onClick={AddListAttr}
          >
            {btnLoading ? (
              <CircularProgress
                size={20}
                sx={{ color: "white" }}
                className="text-white"
              />
            ) : (
              <span className="text-white">{t("submit")}</span>
            )}
          </Button>
        </Box>

        {deleteDialogue && (
          <>
            <Dialog
              sx={{
                "& .MuiPaper-root": {
                  boxShadow: "none !important",
                },
                "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
                  {
                    // backgroundColor: "rgba(0, 0, 0, 0.6) !important",
                  },
              }}
              open={deleteDialogue}
              onClose={(e) => setDeleteDialogue(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <IconButton
                sx={{
                  position: "absolute",
                  right: 12,
                  top: 10,
                  color: (theme) => theme.palette.grey[500],
                }}
                onClick={() => setDeleteDialogue(false)}
              >
                <IoMdClose size={18} />
              </IconButton>
              <div
                className={`px-10 py-5 ${
                  currentMode === "dark"
                    ? "bg-[#1C1C1C] text-white"
                    : "bg-white text-black"
                }`}
              >
                <div className="flex flex-col justify-center items-center">
                  {/* <BsPersonCheck size={50} className="text-primary text-2xl" /> */}
                  <h1 className="font-semibold pt-3 text-lg text-center">
                    {t("do_you_really_delete", { DataName: "" })}{" "}
                    <span className="text-sm bg-gray-500 px-2 py-1 rounded-md font-bold">
                      {deleteDialogue?.name}
                    </span>{" "}
                    ?
                  </h1>
                </div>
                <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                  <Button
                    className={` text-white rounded-md p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                    ripple={true}
                    size="lg"
                    onClick={() => deleteListAttr(deleteDialogue)}
                  >
                    {btnLoading ? (
                      <CircularProgress size={16} sx={{ color: "white" }} />
                    ) : (
                      <span>{t("confirm")}</span>
                    )}
                  </Button>

                  <Button
                    onClick={() => setDeleteDialogue(false)}
                    ripple={true}
                    variant="outlined"
                    className={`shadow-none p-3 rounded-md text-sm  ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-black border-black"
                    }`}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            </Dialog>
          </>
        )}
      </div>
      {/* <div className=" mt-5">
        <ListingDataGrid
          data={data}
          setData={setData}
          column={columns}
          // setColumn={setColumn}
          type="list_attribute"
          loading={loading}
          setLoading={setLoading}
          page={page}
          pageSize={pageSize}
          total={total}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </div> */}
    </div>
  );
};

export default AddListingAttribute;
