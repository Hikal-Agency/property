import { CircularProgress, Modal, Backdrop, Button } from "@mui/material";
import { IoIosAlert } from "react-icons/io";
import { useStateContext } from "../../context/ContextProvider";
import { Select, TextField } from "@mui/material";
import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import "../../styles/app.css";
// import axios from "axios";
import axios from "../../axoisConfig";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";

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
  const [loading, setloading] = useState(false);
  const token = localStorage.getItem("auth-token");

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

    const AddData = new FormData();
    if (value === 0) {
      AddData.append("role", formdata?.data);
    } else {
      AddData.append("permission", formdata?.data);
    }
    AddData.append("user_id", User?.id);
    AddData.append("status", 1);

    await axios
      .post(`${BACKEND_URL}/${value === 0 ? "role" : "permissions"}`, AddData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
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

  console.log("User Model: ");
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
        className={`w-[calc(100%-20px)] md:w-[40%]  ${
          currentMode === "dark" ? "bg-gray-900" : "bg-white"
        } absolute top-1/2 left-1/2 p-5  rounded-md`}
      >
        <div className="relative overflow-hidden">
          <div className={``}>
            <div className="flex  items-center justify-center pl-3">
              <div className="w-[calc(100vw-50px)] md:max-w-[600px] space-y-4 md:space-y-6 bg-white pb-5 px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
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
