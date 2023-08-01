import {
  CircularProgress,
  Modal,
  Backdrop,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import "../../styles/app.css";
// import axios from "axios";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { useEffect } from "react";
import PermissionsCheckbox from "../addUser/PermissionsCheckbox";
import { GridCloseIcon } from "@mui/x-data-grid";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const RolesComponent = ({
  handleOpenModel,
  addUserModelClose,
  value,
  fetchData,
}) => {
  const { BACKEND_URL, currentMode, User } = useStateContext();
  const [formdata, setformdata] = useState({ user_id: User?.id, status: 1 });

  const [allChecked, setAllChecked] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [permissions, setPermissions] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const token = localStorage.getItem("auth-token");

  const handleSelectAll = () => {
    setAllChecked(!allChecked);
  };
  console.log("permissions:  ", permissions);
  console.log("selectedpermission: ", selectedPermission);

  const AddData = async () => {
    function isSafeInput(input) {
      const regex = /([';\/*-])/g; // Characters to look for in input
      return !regex.test(input);
    }

    const { data } = formdata;
    if (!isSafeInput(data)) {
      toast.error("Input contains invalid data", {
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

    setloading(true);

    const AddData = {};
    if (value === 0) {
      AddData["role"] = formdata?.data;

      AddData["permissions"] = selectedPermission;
    } else {
      AddData["permission"] = formdata?.data;
    }
    AddData["user_id"] = User?.id;
    AddData["status"] = 1;

    await axios
      .post(
        `${BACKEND_URL}/${value === 0 ? "roles" : "permissions"}`,
        JSON.stringify(AddData),
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
          toast.success("Registration Completed Successfully", {
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
      const permissions = await axios.get(`${BACKEND_URL}/permissions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setPermissions(permissions?.data?.permission?.data);

      console.log("Response: ", permissions);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);

      toast.error("Unable to fetch permissions.", {
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

  console.log("User Model: ");
  useEffect(() => {
    if (value === 0) {
      fetchPermissions();
    }
  }, []);
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
      <div
        style={style}
        className={`w-[calc(100%-20px)] md:w-[60%] absolute top-1/2 left-1/2 p-5 overflow-scroll rounded-md`}
      >
        <div className="h-[80%] relative overflow-scroll">
          <div className={``}>
            <div className="flex  items-center justify-center pl-3">
              <div className="w-full overflow-y-scroll space-y-4 md:space-y-6 bg-white pb-5 px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: 20,
                    color: "#00000",
                  }}
                  onClick={addUserModelClose}
                >
                  <GridCloseIcon size={18} />
                </IconButton>
                <div>
                  <h2 className="text-center text-xl font-bold text-gray-900 mt-4">
                    Create New {value === 0 ? " Role" : " Permissions"}
                  </h2>
                </div>

                <form
                  className="mt-8 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    AddData();
                  }}
                >
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="grid grid-cols-6 gap-x-3 gap-y-5 rounded-md">
                    <div className="col-span-6">
                      <TextField
                        id=""
                        type="text"
                        label={`${value === 0 ? "Role" : "Permissions"}`}
                        className="w-full"
                        variant="outlined"
                        size="medium"
                        required
                        value={formdata?.role}
                        onChange={(e) => {
                          setformdata({
                            ...formdata,
                            data: e.target.value,
                          });
                        }}
                      />
                    </div>
                    {value === 0 && (
                      <>
                        <div className="col-span-6 max-h-[60vh] overflow-y-auto ">
                          <FormControlLabel
                            control={
                              <Checkbox
                                value={allChecked}
                                onClick={handleSelectAll}
                                name="selectCheckbox"
                                fullWidth
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            }
                            label={allChecked ? "Deselect All" : "Select All"}
                          />
                          <div className="grid grid-cols-3 gap-x-3">
                            {!dataLoading ? (
                              permissions?.length > 0 ? (
                                permissions?.map((permission) => (
                                  <PermissionsCheckbox
                                    key={permission?.id}
                                    permission={permission}
                                    selectedPermission={selectedPermission}
                                    setSelectedPermission={
                                      setSelectedPermission
                                    }
                                    allChecked={allChecked}
                                  />
                                ))
                              ) : (
                                <p>No permissions found.</p>
                              )
                            ) : (
                              <div
                                className="flex justify-center w-full my-3"
                                style={{
                                  width: "500px",
                                }}
                              >
                                <CircularProgress />{" "}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <button
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
                        <span>Create</span>
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

export default RolesComponent;
