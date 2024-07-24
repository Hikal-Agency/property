import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { selectStyles } from "../../../Components/_elements/SelectStyles";
import Select from "react-select";
import axios from "../../../axoisConfig";
import { toast } from "react-toastify";
import ListingDataGrid from "../ListingDataGrid";
import SelectOption from "@material-tailwind/react/components/Select/SelectOption";

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

  const [btnLoading, setBtnLoading] = useState(false);
  const [listingAttr, setListingAttr] = useState({
    name: "",
    listing_type_id: "",
    area: "",
    bedroom: "",
    bathroom: "",
    garage: "",
    gallery: "",
  });

  console.log("listing attr data:: ", listingAttr);

  console.log(
    "filterd value of listing type: ",
    data?.list_type?.filter(
      (list_type) => list_type.id === listingAttr?.listing_type_id
    )[0]?.name
  );

  const handleCheckboxChange = (event) => {
    console.log("checkbox: ", event.target.checked);
    setListingAttr({
      ...listingAttr,
      garage: event.target.checked ? 1 : 0,
    });
  };

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
      field: "bathroom",
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

  const handleChange = (e) => {
    setListingAttr((prevListingAttr) => ({
      ...prevListingAttr,
      [e.target.id]: e.target.value,
    }));
  };

  const AddListAttr = () => {
    setBtnLoading(true);

    axios
      .post(`${BACKEND_URL}/listing-attributes`, listingAttr, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("listing attr added : ", result);
        setBtnLoading(false);

        toast.success("Listing Attribute added successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setListingAttr({
          name: "",
          listing_type_id: "",
          area: "",
          bedroom: "",
          bathroom: "",
          garage: "",
          gallery: "",
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

          <TextField
            id="bathroom"
            type={"text"}
            label={t("bathroom")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttr?.bathroom}
            name="tourLink"
            onChange={handleChange}
          />

          <TextField
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
          />
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
          <Select
            id="listing_type_id"
            value={{
              value: listingAttr?.listing_type_id,
              label: listingAttr?.listing_type_id
                ? data?.list_type?.filter(
                    (list_type) => list_type.id === listingAttr?.listing_type_id
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
              value: list_type.id,
              label: list_type.name,
            }))}
            className="w-full"
            placeholder={t("label_listing_type")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <TextField
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
          />
          {/* <TextField
            id="garage"
            type={"text"}
            label={t("garage")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttr?.garage}
            name="area"
            onChange={handleChange}
            required
          /> */}
          <FormControlLabel
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
          />

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
      </div>
      <div className=" mt-5">
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
      </div>
    </div>
  );
};

export default AddListingAttribute;
