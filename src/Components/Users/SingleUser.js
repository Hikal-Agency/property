// import { Button } from "@material-tailwind/react";
import { Backdrop, Modal, IconButton } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
// import LeadNotes from "../LeadNotes/LeadNotes";
import { ToastContainer } from "react-toastify";
import { IoMdClose } from "react-icons/io";

const SingleUser = ({
  UserModelOpen,
  setUserModelOpe,
  handleUserModelOpen,
  handleUserModelClose,
  UserData,
}) => {
  const { currentMode } = useStateContext();

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
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
          className={`w-[calc(100%-20px)] md:w-[900px]  ${
            currentMode === "dark" ? "bg-gray-900 text-white" : "bg-white"
          } absolute top-1/2 left-1/2 p-10 rounded-md`}
        >
        <IconButton
          sx={{
            position: "absolute",
            right: 12,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleUserModelClose}
        >
          <IoMdClose size={18} />
        </IconButton>
          <h1
            className={`${
              currentMode === "dark" ? "text-red-600" : "text-red-600"
            } text-center font-bold text-xl pb-5`}
          >
            User details
          </h1>
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
            <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} col-span-1 p-3 rounded-md w-full h-full`}>
              <div className="flex justify-center items-center m-2 mt-0">
                <img src="/favicon.png" alt="" width={"60%"}  />
              </div>
              <h1 className="text-main-red-color text-center text-xl font-bold py-3">NAME OF THE USER</h1>
              <h3 className={`${currentMode === "dark" ? "text-white" : "text-black"} mb-3 text-center`}>DESIGNATION OF THE USER</h3>
              <div class="text-center py-3">
                <span className="bg-green-600 text-white text-sm font-semibold rounded-md text-center p-2">ACTIVATED ACCOUNT</span>
                <br></br>
                OR
                <br></br>
                <span className="bg-red-600 text-white text-sm font-semibold rounded-md text-center p-2">DEACTIVATED ACCOUNT</span>
              </div>
            </div>
            <div className="col-span-3 space-y-5">
              <div className={`${currentMode === "dark" ? "text-white" : "text-black"} space-y-3 p-3 w-full md:grid md:grid-cols-2 lg:grid-cols-1`}>
                <div className="sm:block md:block lg:flex xl:flex 2xl:flex items-center justify-between">
                  <div className="sm:block md:block lg:flex xl:flex 2xl:flex space-x-2">
                    <h6 className={`font-bold`}>Contact Number:</h6>
                    <h6 className={`font-semibold `}>CONTACT_NUMBER</h6>
                    <h6 className={`font-semibold `}>ALTERNATIVE_CONTACT_NUMBER</h6>
                  </div>
                </div>
                <div className="sm:block md:block lg:flex xl:flex 2xl:flex items-center justify-between">
                  <div className="sm:block md:block lg:flex xl:flex 2xl:flex space-x-2">
                    <h6 className={`font-bold`}>Email Address:</h6>
                    <h6 className={`font-semibold `}>EMAIL_ADDRESS</h6>
                    <h6 className={`font-semibold `}>ALTERNATIVE_EMAIL_ADDRESS</h6>
                  </div>
                </div>
              </div>
              <div className="bg-main-red-color h-0.5 w-full my-7"></div>
              <div className={`${currentMode === "dark" ? "text-white" : "text-black"} p-3 w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-5`}>
                <div className="sm:block md:block lg:flex xl:flex 2xl:flex items-center justify-between">
                  <div className="sm:block md:flex lg:flex xl:flex 2xl:flex space-x-2">
                    <h6 className={`font-bold`}>Date of Birth:</h6>
                    <h6 className={`font-semibold`}>DATE_OF_BIRTH</h6>
                  </div>
                </div>
                <div className="sm:block md:block lg:flex xl:flex 2xl:flex items-center justify-between">
                  <div className="sm:block md:flex lg:flex xl:flex 2xl:flex space-x-2">
                    <h6 className={`font-bold`}>Gender:</h6>
                    <h6 className={`font-semibold`}>USER_GENDER</h6>
                  </div>
                </div>
                <div className="sm:block md:block lg:flex xl:flex 2xl:flex items-center justify-between">
                  <div className="sm:block md:flex lg:flex xl:flex 2xl:flex space-x-2">
                    <h6 className={`font-bold`}> Country:</h6>
                    <h6 className={`font-semibold `}>COUNTRY_OF_ORIGIN</h6>
                  </div>
                </div>
              </div>
              <div className="bg-main-red-color h-0.5 w-full my-7"></div>
            </div>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default SingleUser;
