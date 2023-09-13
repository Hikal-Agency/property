import { CircularProgress, Modal, Backdrop, IconButton } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GridCloseIcon } from "@mui/x-data-grid";
import axios from "../../axoisConfig";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const ShareCreditsModal = ({
  shareCreditsModal,
  handleClose,
}) => {
  const [loading, setloading] = useState(false);
  const [credits, setCredits] = useState("");
  const { BACKEND_URL, currentMode, userCredits, setUserCredits} = useStateContext();

  const shareCredits = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("auth-token");
      const response = await axios.post(
        `${BACKEND_URL}/share-credits`,
        JSON.stringify({
          credit: Number(credits),
          user_id: shareCreditsModal?.data?.id,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      
      toast.success("Credits shared successfuly to " + shareCreditsModal?.data?.userName, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setUserCredits(response.data?.reminging);
      handleClose();

    } catch (error) {
      console.log(error);
      toast.error("Failed to share credits!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setloading(false);
  };

  let hasEnoughCredits = false;

  if (credits && credits !== "0" && Number(userCredits) >= Number(credits)) {
    hasEnoughCredits = true;
  }

  return (
    <Modal
      keepMounted
      open={shareCreditsModal?.open}
      onClose={handleClose}
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
        className={`absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
      >
        <div className="relative overflow-hidden">
          <div className={``}>
            <div className="flex  items-center justify-center pl-3">
              <div className="w-[calc(100vw-50px)] md:max-w-[600px] space-y-4 md:space-y-6 bg-white pb-5 px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
                <div>
                  <IconButton
                    sx={{
                      position: "absolute",
                      right: 15,
                      top: 10,
                      color: "#000000",
                    }}
                    onClick={handleClose}
                  >
                    <GridCloseIcon size={18} />
                  </IconButton>
                  <h2 className="text-center mt-3 text-xl font-bold text-[#1c1c1c] py-4">
                    Share credits to{" "}
                    <span style={{ color: "#DA1F26", fontWeight: "700" }}>
                      {shareCreditsModal?.data?.userName}
                    </span>
                  </h2>
                </div>

                <form
                  className="mt-8 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    shareCredits();
                  }}
                >
                  <TextField
                    onInput={(e) => setCredits(e.target.value)}
                    value={credits}
                    label="Enter the number of credits to share.."
                    type="number"
                    fullWidth
                  />

                  <div>
                    <button
                      disabled={!hasEnoughCredits}
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
                        <span>Share</span>
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

export default ShareCreditsModal;
