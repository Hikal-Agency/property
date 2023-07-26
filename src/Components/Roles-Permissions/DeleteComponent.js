// import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Modal,
  IconButton,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
// import LeadNotes from "../LeadNotes/LeadNotes";
import { ToastContainer, toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { IoIosAlert } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "../../axoisConfig";

const DeleteComponent = ({
  UserData,
  UserModelOpen,
  handleUserModelClose,
  fetchData,
  value,
  DataName,
}) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [deletebtnloading, setdeleteBtnLoading] = useState(false);

  console.log("delete model: ", UserData);

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setdeleteBtnLoading(true);

    const token = localStorage.getItem("auth-token");

    axios
      .delete(
        `${BACKEND_URL}/${value === 0 ? "roles" : "permissions"}/${UserData}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        console.log("data deleted  ", result);
        setdeleteBtnLoading(false);

        handleUserModelClose(true);
        toast.success(
          `${value === 0 ? "Role " : "Permission "}deleted Successfully`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );

        fetchData(token);
      })
      .catch((err) => {
        console.log("deleted: ", err);
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
              {`Do you really want to delete ${DataName}?`}
            </h1>
          </div>

          <div className="action buttons mt-5 flex items-center justify-center space-x-2">
            <Button
              className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
              ripple="true"
              size="lg"
              disabled={deletebtnloading}
              onClick={handleDeleteUser}
            >
              {deletebtnloading ? (
                <CircularProgress size={18} sx={{ color: "blue" }} />
              ) : (
                <span>Delete</span>
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

export default DeleteComponent;
