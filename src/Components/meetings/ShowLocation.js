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
  const { currentMode, darkModeColors, isArabic, t } = useStateContext();

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
            currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-white"
          } absolute top-1/2 left-1/2 p-4 rounded-md`}
        >
          <div className="w-full flex items-center pb-3">
            <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
            <h1
              className={`text-lg font-semibold ${
                currentMode === "dark"
                  ? "text-white"
                  : "text-black"
              }`}
            >
              {t("meeting_details")}
            </h1>
          </div>

          <Box sx={darkModeColors} className="w-full p-4">
            <FormControl fullWidth>
              <TextField
                id="text"
                type={"text"}
                sx={{"& input": {
                  fontFamily: isArabic(meetingNote) ? "Noto Kufi Arabic" : "inherit"
                }}}
                label={t("label_meeting_note")}
                className="w-full"
                style={{ marginBottom: "20px" }}
                variant="outlined"
                name="text"
                size="small"
                value={meetingNote || "No note"}
                readOnly={true}
              />
            </FormControl>
          {/* </Box>
          <Box sx={darkModeColors} className="w-full p-4"> */}
            {meetingLocation && [
              meetingLocation.lat && meetingLocation.lng ? (
                <LocationPicker
                  showOnly={true}
                  meetingLocation={meetingLocation}
                  className={`${currentMode === "dark" ? "text-white" : "text-black"}`}
                />
              ) : (
                <div className="mt-8 text-center text-[#da1f26]">
                  <p>{t("location_not_set_for_meeting")}</p>
                </div>
              ),
            ]}
          </Box>
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
