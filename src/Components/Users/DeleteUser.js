// import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Modal,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
// import LeadNotes from "../LeadNotes/LeadNotes";
import { ToastContainer, toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { IoIosAlert } from "react-icons/io";
import { useState } from "react";
import axios from "../../axoisConfig";

const DeleteUser = ({ UserData, UserModelOpen, handleUserModelClose }) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [deletebtnloading, setdeleteBtnLoading] = useState(false);

  console.log("deativate user model: ", UserData);

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setdeleteBtnLoading(true);

    const token = localStorage.getItem("auth-token");

    axios
      .post(
        `${BACKEND_URL}/deactivate/${UserData}`,
        { status: 2 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        console.log("res user deativated  ", result);
        setdeleteBtnLoading(false);

        handleUserModelClose(true);
        toast.success("User Deactivated Successfull", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.log("deactivate: ", err);
        setdeleteBtnLoading(false);

        toast.error("Something Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <>
      <ToastContainer />
      {console.log("user data is")}
      {/* {console.log(UserData)} */}
      <Modal
        keepMounted
        open={UserModelOpen}
        onClose={handleUserModelClose}
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
          } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
        >
          <div className="flex flex-col justify-center items-center">
            <IoIosAlert size={50} className="text-main-red-color text-2xl" />
            <h1
              className={`font-semibold pt-3 text-lg ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              Do You Really Want to deactivate this User?
            </h1>
          </div>

          <div className="action buttons mt-5 flex items-center justify-center space-x-2">
            <Button
              className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
              ripple="true"
              size="lg"
              onClick={handleDeleteUser}
            >
              {deletebtnloading ? (
                <CircularProgress size={18} sx={{ color: "blue" }} />
              ) : (
                <span>Deactivate</span>
              )}
            </Button>

            <Button
              onClick={handleUserModelClose}
              ripple="true"
              variant="outlined"
              className={`shadow-none  rounded-md text-sm  ${
                currentMode === "dark"
                  ? "text-white border-white"
                  : "text-main-red-color border-main-red-color"
              }`}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteUser;
