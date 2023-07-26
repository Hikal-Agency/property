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

const UpdateComponent = ({
  handleOpenModel,
  addUserModelClose,
  value,
  fetchData,
  DataName,
  UserData,
}) => {
  const { BACKEND_URL, currentMode, User } = useStateContext();

  const [data, setRole] = useState(DataName);
  const [loading, setloading] = useState(false);
  const [updateData, setUpdateData] = useState();
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

    const formdata = new FormData();
    formdata.append("user_id", User?.id);
    if (value === 0) {
      formdata.append("role", data);
    } else {
      formdata.append("permission", data);
    }

    await axios
      .post(
        `${BACKEND_URL}/${value === 0 ? "roles" : "permissions"}/${UserData}`,
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
                    Update {value === 0 ? " Role" : " Permissions"}
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
                  <div className="grid grid-cols-6 gap-x-3 gap-y-5 rounded-md">
                    <div className="col-span-6">
                      <TextField
                        id=""
                        type="text"
                        label={value === 0 ? "Role" : "Permission"}
                        className="w-full"
                        variant="outlined"
                        size="medium"
                        required
                        value={data}
                        onChange={(e) => setRole(e.target.value)}
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
                        <span>Update</span>
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
