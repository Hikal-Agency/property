import {
  Modal,
  Backdrop,
  IconButton,
  TextField,
  FormControl,
  Box,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import LocationPicker from "./LocationPicker";
import { IoMdClose } from "react-icons/io";

const ShowLocation = ({
  isModalOpened,
  handleModalClose,
  meetingLocation,
  meetingNote,
}) => {
  const { currentMode, darkModeColors } = useStateContext();

  console.log("meeting note: ", meetingNote);

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
    height: "60vh",
    overflowY: "scroll",
    position: "relative",
  };
  return (
    <>
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
            } text-center font-bold text-xl pb-2`}
          >
            Meeting Location
          </h1>
          <Box sx={darkModeColors} className="w-full">
            <FormControl fullWidth>
              <TextField
                id="text"
                type={"text"}
                label="Meeting Notes "
                className="w-full mb-3"
                style={{ marginBottom: "20px" }}
                variant="outlined"
                name="text"
                size="medium"
                value={meetingNote || "No notes"}
                readOnly={true}
              />
            </FormControl>
          </Box>
          {meetingLocation && [
            meetingLocation.lat && meetingLocation.lng ? (
              <LocationPicker
                showOnly={true}
                meetingLocation={meetingLocation}
              />
            ) : (
              <div className="mt-8 text-center text-[#da1f26]">
                <p>Location for this meeting is not set</p>
              </div>
            ),
          ]}
          <IconButton
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleModalClose}
          >
            <IoMdClose size={18} />
          </IconButton>
        </div>
      </Modal>
    </>
  );
};

export default ShowLocation;
