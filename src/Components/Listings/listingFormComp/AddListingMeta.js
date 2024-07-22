import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import Select from "react-select";
import { selectStyles } from "../../../Components/_elements/SelectStyles";
import { toast } from "react-toastify";
import axios from "../../../axoisConfig";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import dayjs from "dayjs";
import AddImageModal from "../../../Pages/listings/AddImageModal";
import ListingDataGrid from "../ListingDataGrid";
const AddListingMeta = ({ data, setData }) => {
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

  const [btnLoading, setBtnLoading] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [listingMeta, setListingMeta] = useState({
    listing_id: 1,
    slug: "",
    long_description: "",
    year_build_in: "",
    promo_video: "",
    is_featured: 0,
    meta_title: "",
    meta_keywords: "",
    meta_description: "",
    og_title: "",
    og_description: "",
    json_ld: "1",
    canonical: "",
    banner: "",
    additional_gallery: [],
    og_image: "",
  });

  console.log("listingMeta: ", listingMeta);
  const columns = [
    // id
    {
      field: "id",
      headerName: t("id"),
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center ">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    // LISTING TYPE ID
    {
      field: "listing_type_id",
      headerName: t("label_listing_type"),
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },
    // NAME
    {
      field: "name",
      headerName: t("name"),
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },
    // AREA
    {
      field: "area",
      headerName: t("label_area"),
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },
    // BEDROOM
    {
      field: "bedroom",
      headerName: t("bedroom"),
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },
    // BATHROOM
    {
      field: "area",
      headerName: t("bathroom"),
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },
    // GARAGE
    {
      field: "garage",
      headerName: t("garage"),
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },
    // GALLERY
    {
      field: "gallery",
      headerName: t("gallery"),
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },

    // {
    //   field: "notes",
    //   headerName: t("label_action"),
    //   minwidth: 100,
    //   flex: 1,
    //   headerAlign: "center",
    //   sortable: false,
    //   filterable: false,
    //   renderCell: (cellValues) => {
    //     return (
    //       <div className="space-x-2 w-full flex items-center justify-start mx-2">
    //         <p
    //           style={{ cursor: "pointer" }}
    //           className={`${
    //             currentMode === "dark"
    //               ? "text-[#FFFFFF] bg-[#262626]"
    //               : "text-[#1C1C1C] bg-[#EEEEEE]"
    //           } hover:bg-blue-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center editUserBtn`}
    //         >
    //           <Tooltip title="Edit User" arrow>
    //             <button
    //               className="editUserBtn"
    //               onClick={() => handleEditModal(cellValues?.id)}
    //             >
    //               {/* <Link to={`/updateuser/${cellValues?.id}`}> */}
    //               <AiOutlineEdit size={16} />
    //               {/* </Link> */}
    //             </button>
    //           </Tooltip>
    //         </p>

    //         {cellValues?.row?.status === 1 && (
    //           <>
    //             {/* SEND CREDIT  */}
    //             <p
    //               style={{ cursor: "pointer" }}
    //               className={`${
    //                 currentMode === "dark"
    //                   ? "text-[#FFFFFF] bg-[#262626]"
    //                   : "text-[#1C1C1C] bg-[#EEEEEE]"
    //               } hover:bg-yellow-500 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center editUserBtn`}
    //             >
    //               <Tooltip title="Share Credits" arrow>
    //                 <button
    //                   onClick={() =>
    //                     setShareCreditsModal({
    //                       open: true,
    //                       data: cellValues?.row,
    //                     })
    //                   }
    //                 >
    //                   {/* <GiTwoCoins size={16} /> */}
    //                   <RiCoinsFill size={16} />
    //                 </button>
    //               </Tooltip>
    //             </p>

    //             {/* UPDATE ROLE  */}
    //             {/* {cellValues.row.role !== 1 && (
    //               hasPermission("role_update") ? (
    //                 <p
    //                   style={{ cursor: "pointer" }}
    //                   className={`${
    //                     currentMode === "dark"
    //                       ? "text-[#FFFFFF] bg-[#262626]"
    //                       : "text-[#1C1C1C] bg-[#EEEEEE]"
    //                   } hover:bg-green-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center editUserBtn`}
    //                 >
    //                   <Tooltip title="Update Role" arrow>
    //                     <button onClick={() =>
    //                       HandlePermissionModel(
    //                         cellValues?.id,
    //                         cellValues.row.status,
    //                         cellValues?.row?.userName,
    //                         cellValues?.row?.role
    //                       )
    //                     }>
    //                       <BsPersonFillGear size={16} />
    //                     </button>
    //                   </Tooltip>
    //                 </p>
    //               ) : null
    //             )} */}

    //             {/* DELETE USER  */}
    //             {hasPermission("users_delete") ? (
    //               <>
    //                 <p
    //                   style={{ cursor: "pointer" }}
    //                   className={`${
    //                     currentMode === "dark"
    //                       ? "text-[#FFFFFF] bg-[#262626]"
    //                       : "text-[#1C1C1C] bg-[#EEEEEE]"
    //                   } hover:bg-red-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center editUserBtn`}
    //                 >
    //                   <Tooltip title="Deactivate User" arrow>
    //                     <button
    //                       onClick={() =>
    //                         handleDelete(
    //                           cellValues?.id,
    //                           cellValues.row.status,
    //                           cellValues?.row?.userName
    //                         )
    //                       }
    //                     >
    //                       <BsPersonFillSlash size={16} />
    //                     </button>
    //                   </Tooltip>
    //                 </p>

    //                 {/* <Button
    //                   onClick={() =>

    //                   }
    //                   className={`editUserBtn ${
    //                     currentMode === "dark"
    //                       ? "text-white bg-transparent rounded-md p-1 shadow-none "
    //                       : "text-black bg-transparent rounded-md p-1 shadow-none "
    //                   }`}
    //                 >
    //                   {currentMode === "dark" ? (
    //                     <FaUnlock style={{ color: "white" }} size={16} />
    //                   ) : (
    //                     <FaUnlock style={{ color: "black" }} size={16} />
    //                   )}
    //                 </Button> */}
    //               </>
    //             ) : null}
    //           </>
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ];

  const [selectImagesModal, setSelectImagesModal] = useState({
    isOpen: false,
    gallery: null,
  });

  const handleChange = (e) => {
    setListingMeta((prevListingAttr) => ({
      ...prevListingAttr,
      [e.target.id]: e.target.value,
    }));
  };

  const AddListMeta = () => {
    setBtnLoading(true);

    const listingMetaData = {
      ...listingMeta,
      additional_gallery: allImages,
    };

    console.log("sending meta data:: ", listingMetaData);

    axios
      .post(`${BACKEND_URL}/meta-tags-for-listings`, listingMetaData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("listing ,eta added : ", result);
        setBtnLoading(false);

        toast.success("Listing Meta added successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setListingMeta({
          slug: "",
          long_description: "",
          year_build_in: "",
          promo_video: "",
          is_featured: "",
          meta_title: "",
          meta_keywords: "",
          meta_description: "",
          og_title: "",
          og_description: "",
          json_ld: "",
          canonical: "",
          banner: "",
          additional_gallery: [],
          og_image: "",
        });
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
        {t("heading_listing_meta_tag")}
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
            id="Developer"
            // value={{
            //   value: projectData?.developer_id,
            //   label: projectData?.developer_id
            //     ? developer.find((dev) => dev.id === projectData?.developer_id)
            //         ?.developerName || ""
            //     : t("form_developer_name"),
            // }}
            // onChange={(selectedOption) => {
            //   handleChange({
            //     target: { name: "developer_id", value: selectedOption.value },
            //   });
            // }}
            // options={developer.map((dev) => ({
            //   value: dev.id,
            //   label: dev.developerName,
            // }))}
            className="w-full"
            placeholder={t("menu_listings")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <TextField
            id="long_description"
            type={"text"}
            label={t("description")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.long_description}
            name="projectLocation"
            onChange={handleChange}
            required
          />

          <TextField
            id="promo_video"
            type={"text"}
            label={t("label_promo_video")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.promo_video}
            name="projectLocation"
            onChange={handleChange}
            required
          />
          <TextField
            id="meta_title"
            type={"text"}
            label={t("label_meta_title")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.meta_title}
            name="projectLocation"
            onChange={handleChange}
            required
          />
          <TextField
            id="canonical"
            type={"text"}
            label={t("label_cano")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.canonical}
            name="projectLocation"
            onChange={handleChange}
            required
          />

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="banner-image-file"
            type="file"
            name="picture"
            onChange={(e) => {
              console.log("event of og image: ", e);

              setListingMeta({
                ...listingMeta,
                banner: e.target.files,
              });
            }}
          />
          <label htmlFor="banner-image-file">
            <Button
              variant="contained"
              size="lg"
              className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3 "
              style={{
                fontFamily: fontFam,
                color: "#ffffff",
                marginTop: "20px",
              }}
              component="span"
              // disabled={loading ? true : false}
              // startIcon={loading ? null : <MdFileUpload />}
            >
              <span>{t("label_banner")}</span>
            </Button>
            <p className="text-primary mt-2 italic">
              {listingMeta?.banner ? `banner image selected.` : null}
            </p>
          </label>
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
          <TextField
            id="slug"
            type={"text"}
            label={t("label_slug")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.slug}
            name="area"
            onChange={handleChange}
            required
          />
          <TextField
            id="meta_description"
            type={"text"}
            label={t("label_meta_desc")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.meta_description}
            name="area"
            onChange={handleChange}
            required
          />
          <TextField
            id="meta_keywords"
            type={"text"}
            label={t("label_meta_keywords")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.meta_keywords}
            name="area"
            onChange={handleChange}
            required
          />
          <TextField
            id="og_title"
            type={"text"}
            label={t("label_og_title")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.og_title}
            name="area"
            onChange={handleChange}
            required
          />
          <TextField
            id="og_description"
            type={"text"}
            label={t("label_og_desc")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.og_description}
            name="area"
            onChange={handleChange}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                value={listingMeta?.is_featured}
                onChange={handleChange}
                checked={listingMeta?.is_featured}
                name="permissionCheckbox"
                id="is_featured"
                fullWidth
                inputProps={{ "aria-label": "controlled" }}
                style={{
                  color: currentMode === "dark" ? "#fff" : "#000",
                }}
              />
            }
            label={t("label_is_featured")}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t("label_built_year")}
              value={listingMeta?.year_build_in}
              views={["year"]}
              onChange={(newValue) => {
                console.log("meeting date: ", newValue);

                const formattedDate = moment(newValue?.$d).format("YYYY");

                setListingMeta({
                  ...listingMeta,
                  year_build_in: formattedDate,
                });
              }}
              format="YYYY"
              renderInput={(params) => (
                <TextField
                  {...params}
                  onKeyDown={(e) => e.preventDefault()}
                  readOnly={true}
                  fullWidth
                  size="small"
                  sx={{
                    marginTop: "20px !important",
                  }}
                />
              )}
              minDate={dayjs().startOf("day").toDate()}
              InputProps={{ required: true }}
            />
          </LocalizationProvider>

          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              size="lg"
              className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3 "
              onClick={() =>
                setSelectImagesModal({
                  isOpen: true,
                  gallery: true,
                })
              }
              style={{
                fontFamily: fontFam,
                color: "#ffffff",
                marginTop: "20px",
              }}
              component="span"
              // disabled={loading ? true : false}
              // startIcon={loading ? null : <MdFileUpload />}
            >
              <span>{t("label_additional_images")}</span>
            </Button>
            <p className="text-primary mt-2 italic">
              {allImages?.length > 0
                ? `${allImages?.length} images selected.`
                : null}
            </p>
          </label>

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="og-image-file"
            type="file"
            name="picture"
            // onChange={handleImgUpload}
            onChange={(e) => {
              console.log("event of og image: ", e);

              setListingMeta({
                ...listingMeta,
                og_image: e.target.files,
              });
            }}
          />
          <label htmlFor="og-image-file">
            <Button
              variant="contained"
              size="lg"
              className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3 "
              style={{
                fontFamily: fontFam,
                color: "#ffffff",
                marginTop: "20px",
              }}
              component="span"
              // disabled={loading ? true : false}
              // startIcon={loading ? null : <MdFileUpload />}
            >
              <span>{t("label_og_img")}</span>
            </Button>
            <p className="text-primary mt-2 italic">
              {listingMeta?.og_image ? `og image selected.` : null}
            </p>
          </label>

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
            sx={{ marginTop: "20px" }}
            onClick={AddListMeta}
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
        {selectImagesModal?.isOpen && (
          <AddImageModal
            selectImagesModal={selectImagesModal}
            handleClose={() => setSelectImagesModal({ isOpen: false })}
            allImages={allImages}
            setAllImages={setAllImages}
          />
        )}

        {/* <div className=" mt-5">
          <ListingDataGrid
            data={data}
            setData={setData}
            column={columns}
            // setColumn={setColumn}
            type="list_type"
          />
        </div> */}
      </div>
    </div>
  );
};

export default AddListingMeta;
