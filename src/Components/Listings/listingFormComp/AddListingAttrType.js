import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { selectStyles } from "../../../Components/_elements/SelectStyles";
import Select from "react-select";
import { toast } from "react-toastify";
import axios from "../../../axoisConfig";
import ListingDataGrid from "../ListingDataGrid";

const AddListingAttrType = ({
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
  const [listingAttrType, setListingAttrType] = useState({
    name: "",
    listing_attribute_id: "",
    type: "",
    price: "",

    near_by: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setListingAttrType((prevListingAttr) => ({
      ...prevListingAttr,
      [e.target.id]: e.target.value,
    }));
  };

  const AddListAttrType = () => {
    setBtnLoading(true);

    axios
      .post(`${BACKEND_URL}/listing-attribute-types`, listingAttrType, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("listing attr added : ", result);
        setBtnLoading(false);

        toast.success("Listing Attribute type added successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setListingAttrType({
          name: "",
          listing_attribute_id: 3,
          type: "",
          price: "",

          near_by: "",
          latitude: "",
          longitude: "",
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
    // LISTING ATTRIBUTE ID
    {
      field: "listing_attribute_id",
      headerName: t("listing_attribute_id"),
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
    // TYPE
    {
      field: "type",
      headerName: t("type"),
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
    // // AMENITIES
    // {
    //   field: "amenities",
    //   headerName: t("form_label_amenities"),
    //   headerAlign: "center",
    //   editable: false,
    //   minwidth: 100,
    //   flex: 1,
    //   renderCell: (cellValues) => {
    //     return (
    //       <div className="w-full flex items-center justify-center">
    //         <p className="text-center">{cellValues?.formattedValue}</p>
    //       </div>
    //     );
    //   },
    // },
    // NEAR BY
    {
      field: "near_by",
      headerName: t("label_nearby"),
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
    // LATITUDE
    {
      field: "latitude",
      headerName: t("form_label_lat"),
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
    // LONGITUDE
    {
      field: "longitude",
      headerName: t("form_label_long"),
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

  return (
    <div className="my-4">
      <h4 className={`text-primary text-center font-semibold pb-5`}>
        {t("heading_listing_attr_type")}
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
            value={listingAttrType?.name}
            name="projectLocation"
            onChange={handleChange}
            required
          />
          <TextField
            id="type"
            type={"text"}
            label={t("type")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.type}
            name="area"
            onChange={handleChange}
            required
          />

          {/* <TextField
            id="amenities"
            type={"text"}
            label={t("form_label_amenities")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.amenities}
            name="tourLink"
            onChange={handleChange}
          /> */}

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
            value={listingAttrType?.gallery}
            name="tourLink"
            onChange={handleChange}
          />

          <TextField
            id="latitude"
            type={"text"}
            label={t("form_label_lat")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.latitude}
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
            id="listing_attribute_id"
            value={{
              value: listingAttrType?.listing_attribute_id,
              label: listingAttrType?.listing_attribute_id
                ? data?.list_attribute?.filter(
                    (list_type) =>
                      list_type.id === listingAttrType?.listing_attribute_id
                  )[0]?.name
                : t("label_list_attr"),
            }}
            onChange={(e) => {
              setListingAttrType({
                ...listingAttrType,
                listing_attribute_id: e.value,
              });
            }}
            options={data?.list_attribute?.map((list_type) => ({
              value: list_type.id,
              label: list_type.name,
            }))}
            className="w-full"
            placeholder={t("label_list_attr")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <TextField
            id="price"
            type={"text"}
            label={t("label_price")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.price}
            name="projectLocation"
            onChange={handleChange}
            required
          />
          <TextField
            id="near_by"
            type={"text"}
            label={t("label_nearby")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.near_by}
            name="area"
            onChange={handleChange}
            required
          />
          <TextField
            id="longitude"
            type={"text"}
            label={t("form_label_long")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.longitude}
            name="area"
            onChange={handleChange}
            required
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
            onClick={AddListAttrType}
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
          type="list_attr_type"
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

export default AddListingAttrType;
