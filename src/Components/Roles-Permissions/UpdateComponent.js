import { CircularProgress, Modal, Backdrop, IconButton } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import "../../styles/app.css";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { useEffect } from "react";
import UpdatePermissionsCheckbox from "../addUser/UpdatePermissionCheckbox";
import { GridCloseIcon } from "@mui/x-data-grid";
import { MdClose } from "react-icons/md";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const UpdateComponent = ({
  handleOpenModel,
  addUserModelClose,
  value,
  fetchData,
  DataName,
  UserData,
}) => {
  const { BACKEND_URL, User, t, isLangRTL, i18n, currentMode } =
    useStateContext();
  const [isClosing, setIsClosing] = useState(false);

  const [data, setRole] = useState(DataName);
  const [loading, setloading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState();
  const [permissions, setPermissions] = useState({
    allPermissions: null,
    selectedPermissions: null,
  });

  console.log("selected permissions: ", selectedPermission);
  console.log("all permisssions: ", permissions);

  const token = localStorage.getItem("auth-token");

  const UpdateData = async () => {
    setloading(true);

    if (!data) {
      setloading(false);
      toast.error("Kindly enter data.", {
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

    // const formdata = new FormData();
    // formdata.append("user_id", User?.id);
    // if (value === 0) {
    //   formdata.append("role", data);
    // } else {
    //   formdata.append("permission", data);
    // }

    const formdata = {};
    if (value === 0) {
      formdata["role"] = data;

      formdata["permission_ids"] = selectedPermission;
    } else {
      formdata["permission"] = data;
    }
    formdata["user_id"] = User?.id;
    formdata["status"] = 1;

    const method = value === 0 ? "put" : "post";

    await axios[method](
      `${BACKEND_URL}/${
        value === 0
          ? `roles/${UserData}/permissions/bulk`
          : `permissions/${UserData}`
      }`,
      formdata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((result) => {
        console.log("result", result);
        if (result.data.status === true) {
          toast.success(
            `${value === 0 ? "Role " : "Permission "} updated successfully.`,
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
        }
        setloading(false);
        addUserModelClose();
        fetchData(token);
      })
      .catch((err) => {
        toast.error("Something went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setloading(false);
      });
  };
  const fetchPermissions = async () => {
    setDataLoading(true);

    try {
      const permissionsPromise = axios.get(`${BACKEND_URL}/permissions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const rolesPromise = axios.get(
        `${BACKEND_URL}/roles/${UserData}/permissions`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const [permissionsResponse, rolesResponse] = await Promise.all([
        permissionsPromise,
        rolesPromise,
      ]);

      setPermissions({
        allPermissions: permissionsResponse?.data?.permission?.data,
        selectedPermissions: rolesResponse?.data?.permissions,
      });

      console.log("Permissions Response: ", permissionsResponse);
      console.log("Roles Permissions Response: ", rolesResponse);

      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);

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
    }
  };

  useEffect(() => {
    if (value === 0) {
      fetchPermissions();
    }
  }, []);

  const permits = permissions?.allPermissions?.map((permission) => {
    return {
      ...permission,
      isPermitted: permissions?.selectedPermissions?.find(
        (p) => p.id === permission.id
      )
        ? true
        : false,
    };
  });
  console.log("permits:::: ", permits);

  console.log("User Model: ");
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      addUserModelClose();
    }, 1000);
  };
  return (
    <Modal
      keepMounted
      open={handleOpenModel}
      onClose={addUserModelClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      {/* <div
        style={style}
        className={`w-[calc(100%-20px)] md:w-[75%] absolute top-1/2 left-1/2 p-5  rounded-md `}
      > */}
      <div
        className={`${
          isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
        } ${
          isClosing
            ? isLangRTL(i18n.language)
              ? "modal-close-left"
              : "modal-close-right"
            : ""
        }
        w-[100vw] h-[100vh] flex items-start justify-end`}
      >
        <button
          // onClick={handleLeadModelClose}
          onClick={handleClose}
          className={`${
            isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
          }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
        >
          <MdClose
            size={18}
            color={"white"}
            className="hover:border hover:border-white hover:rounded-full"
          />
        </button>
        {/* <div className="relative overflow-hidden"> */}
        <div
          style={style}
          className={` ${
            currentMode === "dark"
              ? "bg-[#000000] text-white"
              : "bg-[#FFFFFF] text-black"
          } ${isLangRTL(i18n.language) ? "border-r-2" : "border-l-2"}
             p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
            `}
        >
          <div className={` `}>
            <div className="flex items-center justify-center pl-3">
              <div className="w-full space-y-4 md:space-y-6  pb-5 px-5 md:px-10 rounded-sm md:rounded-md z-[5] ">
                {/* <IconButton
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: 20,
                    color: "#00000",
                  }}
                  onClick={addUserModelClose}
                >
                  <GridCloseIcon size={18} />
                </IconButton> */}
                <div>
                  <h2
                    className={`text-center text-xl font-bold  mt-4 ${
                      currentMode === "dark" ? "text-white" : "text-[#1c1c1c]"
                    }`}
                  >
                    {value === 0 ? t("update_role") : t("update_permission")}
                  </h2>
                </div>

                <form
                  className="mt-8 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    UpdateData();
                  }}
                >
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="grid grid-cols-6 gap-x-3 gap-y-5 rounded-md  ">
                    <div className="col-span-6">
                      <TextField
                        id=""
                        type="text"
                        label={value === 0 ? t("role") : t("permission")}
                        className="w-full"
                        variant="outlined"
                        size="medium"
                        required
                        value={data}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </div>
                    {value === 0 && (
                      <>
                        <div className="col-span-6 max-h-[60vh] overflow-y-auto ">
                          <div className="grid grid-cols-3 gap-x-3">
                            {!dataLoading ? (
                              permits?.length > 0 ? (
                                permits?.map((permission) => (
                                  <>
                                    <UpdatePermissionsCheckbox
                                      key={permission?.id}
                                      permission={permission}
                                      allPermissions={permissions}
                                      selectedPermission={selectedPermission}
                                      setSelectedPermission={
                                        setSelectedPermission
                                      }
                                    />
                                  </>
                                ))
                              ) : (
                                <p>No permissions found.</p>
                              )
                            ) : (
                              <div className="flex justify-center w-full my-3">
                                <CircularProgress />{" "}
                              </div>
                            )}
                            {/* <button
                              disabled={loading ? true : false}
                              type="submit"
                              className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-main-red-color py-3 px-4 text-white hover:bg-main-red-color-2 focus:outline-none focus:ring-2 focus:ring-main-red-color-2 focus:ring-offset-2 text-md font-bold uppercase"
                            >
                              {loading ? (
                                <CircularProgress
                                  sx={{ color: "white" }}
                                  size={25}
                                  className="text-white"
                                />
                              ) : (
                                <span>Select All</span>
                              )}
                            </button> */}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <button
                      disabled={loading ? true : false}
                      type="submit"
                      className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-btn-primary py-3 px-4 text-white focus:outline-none focus:ring-2  focus:ring-offset-2 text-md font-bold uppercase"
                    >
                      {loading ? (
                        <div className="w-full flex justify-center items-center">
                          <CircularProgress
                            sx={{ color: "white", width: "500px" }}
                            size={25}
                            className="text-white"
                          />
                        </div>
                      ) : (
                        <span>{t("btn_update")}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateComponent;
