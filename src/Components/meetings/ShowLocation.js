import { Modal, Backdrop } from "@mui/material"
import { useStateContext } from "../../context/ContextProvider";
import LocationPicker from "./LocationPicker";

const ShowLocation = ({isModalOpened, handleModalClose, meetingLocation,}) => {
  const {currentMode } = useStateContext();

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
    height: "90vh",
    overflowY: "scroll",
  };
    return (<>
      <Modal
        keepMounted
        open={isModalOpened}
        onClose={handleModalClose}
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
          className={`w-[calc(100%-20px)] md:w-[50%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
              <h1
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                } text-center font-bold text-xl pb-10`}
              >
                Meeting Location
              </h1>

              <LocationPicker showOnly={true} meetingLocation={meetingLocation}/>
          </div>
          </Modal>
    </>);
}

export default ShowLocation;