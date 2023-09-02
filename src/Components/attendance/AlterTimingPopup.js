import React, { useState } from "react";
import "../../styles/index.css";
import { 
    TextField, 
    Box, 
    MenuItem,
    CircularProgress,
    Button
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";
import moment from "moment";

const AlterTimingPopup = ({ date, isOffDay, onClose }) => {
    const {
        darkModeColors,
        currentMode,
        BACKEND_URL
    } = useStateContext();
    
    const token = localStorage.getItem("auth-token");

    const [btnLoading, setBtnLoading] = useState(false);

    // SETTINGS 
    const [settings, setSettings] = useState({
        change_type: null,
        change_in_time: null,
        change_out_time: null,
        change_reason: null,
    });

    // DISABLE OFF DAY 
    const offDayText = isOffDay(date.start) ? "OFF" : "";

    // UPDATE TIMING 
    const handleUpdate = async () => {
        setBtnLoading(true);

        if (!settings) {
            toast.error("kindly enter data.", {
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

        const formData = new FormData();
    
        formData.append("change_type", settings?.change_type);
        formData.append(
            "change_in_time",
            settings?.change_in_time
              ? moment(settings.change_in_time, "HH:mm").format("hh:mm A")
              : ""
        );
        formData.append(
          "change_out_time",
          settings?.change_out_time
            ? moment(settings.change_out_time, "HH:mm").format("hh:mm A")
            : ""
        );    
        formData.append("change_reason", settings?.change_reason);

        try {
          const update_timings = await axios.post(
            `${BACKEND_URL}/agencies/1`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );
    
          setBtnLoading(false);
    
          toast.success("Settings updated successfully.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
    
        //   fetchSettings();
    
          console.log("Response: ", update_timings);
        } catch (error) {
          setBtnLoading(false);
          toast.error("Unable to update timings.", {
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

    return (
        <div className="popup-container">
            <div className={`popup p-2 ${currentMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black" }`} style={{ minWidth: "300px"}}>
                <div className="flex justify-end px-2">
                    <button onClick={onClose} className="text-lg" style={{ backgroundColor: "transparent", color: "gray", padding: "0px", }}>x</button>
                </div>
                <div className="text-center p-5">
                    {offDayText === "OFF" ? (
                        <>
                            <p className="font-semibold text-lg">{date.startStr} is Off Day!</p>
                            <div className="h-0.5 w-full bg-[#DA1F26] mt-3 mb-5"></div>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold text-lg">Modify Office Settings for {date.startStr}</p>
                            <div className="h-0.5 w-full bg-[#DA1F26] mt-3 mb-5"></div>
                            
                            {/* ADD FIELDS */}
                            <Box sx={darkModeColors} className="mt-2">
                                {/* CHANGE TYPE */}
                                <TextField
                                    id="change_type"
                                    label="Change Type"
                                    size="medium"
                                    className="w-full mb-5"
                                    sx={{
                                    marginBottom: "1.25rem",
                                    }}
                                    displayEmpty
                                    select
                                    // value={EnquiryType}
                                    // onChange={ChangeEnquiryType}
                                >
                                    <MenuItem value="" selected disabled>Change Type</MenuItem>
                                    <MenuItem value={"Work"}>Work Timing</MenuItem>
                                    <MenuItem value={"Off"}>Off Day</MenuItem>
                                </TextField>

                                <Box className="grid grid-cols-2 w-full mb-5 gap-2">
                                        {/* CHANGE IN-TIME  */}
                                        <TextField
                                        id="change_in_time"
                                        type={"time"}
                                        label="In-time"
                                        variant="outlined"
                                        size="medium"
                                        value={settings?.change_in_time || ""}
                                        onChange={(e) => {
                                            setSettings({
                                            ...settings,
                                            change_in_time: e.target.value,
                                            });
                                        }}
                                    />
                                    {/* CHANGE OUT-TIME  */}
                                    <TextField
                                        id="change_out_time"
                                        type={"time"}
                                        label="Out-time"
                                        variant="outlined"
                                        size="medium"
                                        value={settings?.change_out_time || ""}
                                        onChange={(e) => {
                                            setSettings({
                                            ...settings,
                                            change_out_time: e.target.value,
                                            });
                                        }}
                                    />
                                </Box>

                                {/* CHANGE REASON */}
                                <TextField
                                    id="change_reason"
                                    type={"text"}
                                    className="w-full mb-5"
                                    style={{ marginBottom: "20px" }}
                                    label="Reason/Note"
                                    variant="outlined"
                                    size="medium"
                                    value={settings?.change_reason || ""}
                                    onChange={(e) => {
                                        setSettings({
                                        ...settings,
                                        change_reason: e.target.value,
                                        });
                                    }}
                                />
                            </Box>

                            {/* BUTTON */}
                            <Button
                                type="submit"
                                size="medium"
                                className="bg-main-red-color w-full text-white rounded-lg py-3 font-semibold mb-3"
                                style={{ backgroundColor: "#da1f26", color: "#ffffff" }}
                                // onClick={handleUpdate}
                                >
                                {btnLoading ? (
                                    <CircularProgress
                                    size={23}
                                    sx={{ color: "white" }}
                                    className="text-white"
                                    />
                                ) : (
                                    <span>Update</span>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlterTimingPopup;
