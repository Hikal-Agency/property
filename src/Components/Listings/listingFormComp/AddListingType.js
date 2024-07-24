import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../../axoisConfig";
import ListingDataGrid from "../ListingDataGrid";

const AddListingType = ({
  data,
  setData,
  column,
  setColumn,
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

  const [name, setName] = useState("");

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
    // NAME
    {
      field: "name",
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

  const AddListType = () => {
    setBtnLoading(true);

    if (!name) {
      setBtnLoading(false);
      toast.error("Kindly fill the field.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }

    axios
      .post(
        `${BACKEND_URL}/listing-types`,
        { name: name },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        setBtnLoading(false);
        setName("");
        toast.success("Listing type added successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
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

  return (
    <div className="my-4">
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
        <h4 className={`text-primary text-center font-semibold pb-5`}>
          {t("heading_listing_type")}
        </h4>{" "}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <TextField
            id="name"
            type={"text"}
            label={t("label_listing_type")}
            value={name}
            name="name"
            onChange={(e) => setName(e.target.value)}
            //   className="w-full"

            variant="outlined"
            size="small"
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
            onClick={AddListType}
            disabled={btnLoading ? true : false}
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
        </div>
      </Box>

      <div classNAme=" mt-5">
        <ListingDataGrid
          data={data}
          setData={setData}
          column={columns}
          // setColumn={setColumn}
          type="list_type"
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

export default AddListingType;
