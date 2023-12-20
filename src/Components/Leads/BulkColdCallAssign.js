import React, { useEffect, useState } from "react";

import {
  Modal,
  Backdrop,
  Select,
  Box,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import moment from "moment";

import { useStateContext } from "../../context/ContextProvider";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../axoisConfig";
import { toast } from "react-toastify";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const BulkColdCallAssign = ({ bulkColdCallAssignModal, handleCloseModal }) => {
  const {
    currentMode,
    t,
    isLangRTL,
    primaryColor,
    i18n,
    darkModeColors,
    SalesPerson,
    Managers,
    BACKEND_URL,
  } = useStateContext();

  const [isClosing, setIsClosing] = useState(false);
  const [managerVal, setManagerVal] = useState(null);
  const [agentVal, setAgentVal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [managers, setManagers] = useState([]);
  const [agents, setAgents] = useState([]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseModal();
    }, 1000);
  };

  const handleBulkAssign = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem("auth-token");

      const currDay = bulkColdCallAssignModal?.file["DATE(creationDate)"];

      const originalDate = moment(currDay);

      const nextDay = originalDate.add(1, "days");

      const nextDayString = nextDay.format("YYYY-MM-DD");

      const UpdateLeadData = {
        user_id: agentVal || managerVal,
        role: agentVal ? "agent" : "manager",
        notes: bulkColdCallAssignModal?.file?.notes,
        range: `${from},${to}`,
        date_range: `${currDay},${nextDayString}`,
      };

      setLoading(true);

      await axiosInstance.post(
        `${BACKEND_URL}/bulkassign`,
        JSON.stringify(UpdateLeadData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setLoading(false);
      toast.success("Leads Updated Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
      handleClose();
    } catch (error) {
      toast.error("Error in Updating file leads", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setManagers(Managers);
  }, [Managers]);

  useEffect(() => {
    setAgents(SalesPerson[`manager-${managerVal}`]);
  }, [managerVal]);

  return (
    <>
      <Modal
        keepMounted
        open={bulkColdCallAssignModal?.isOpen}
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
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
        w-[100vw] h-[100vh] flex items-start justify-end `}
        >
          <button
            // onClick={handleCloseTimelineModel}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className=" hover:border hover:border-white hover:rounded-full"
            />
          </button>

          <form action="#" onSubmit={handleBulkAssign}>
            <div
              style={style}
              className={` ${
                currentMode === "dark"
                  ? "bg-[#000000] text-white"
                  : "bg-[#FFFFFF] text-black"
              } ${
                isLangRTL(i18n.language)
                  ? currentMode === "dark" && " border-primary border-r-2"
                  : currentMode === "dark" && " border-primary border-l-2"
              }
               p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
              `}
            >
              <div className="flex items-center mb-5">
                <div className="rounded bg-primary mr-2 text-white p-1">
                  {bulkColdCallAssignModal?.file["DATE(creationDate)"]}
                </div>
                <div
                  className={`${
                    currentMode === "light" ? "text-black" : "text-white"
                  }`}
                >
                  {bulkColdCallAssignModal?.file?.notes}
                </div>
              </div>
              <div className="flex mt-12 mb-16">
                <div className="flex flex-col items-center w-[50%]">
                  <p className="font-bold mb-8 text-lg">Agent Details</p>
                  <Box sx={darkModeColors} className="w-[80%] mx-auto">
                    <Select
                      id="manager"
                      value={managerVal}
                      onChange={(e) => setManagerVal(e.target.value)}
                      placeholder={t("manager")}
                      className="w-full mb-4"
                      fullWidth
                      required
                      displayEmpty
                    >
                      <MenuItem selected value={null} disabled>
                        Select Manager
                      </MenuItem>
                      {managers?.map((m) => (
                        <MenuItem key={m?.id} value={m?.id}>
                          {m?.userName}
                        </MenuItem>
                      ))}
                    </Select>
                    <Select
                      fullWidth
                      id="agent"
                      value={agentVal}
                      onChange={(e) => setAgentVal(e.target.value)}
                      placeholder={t("agent")}
                      className="w-full"
                      displayEmpty
                    >
                      <MenuItem selected value={null} disabled>
                        Select Agent
                      </MenuItem>
                      {agents?.map((m) => (
                        <MenuItem key={m?.id} value={m?.id}>
                          {m?.userName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </div>
                <div className="flex flex-col items-center w-[50%]">
                  <p className="font-bold mb-8 text-lg">Lead Range</p>
                  <Box
                    sx={darkModeColors}
                    className="flex w-[80%] gap-x-2 items-center"
                  >
                    <TextField
                      id="from"
                      type={"number"}
                      className="w-full"
                      label={t("From")}
                      variant="outlined"
                      size="small"
                      fullWidth
                      required
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />
                    <TextField
                      id="to"
                      type={"number"}
                      className="w-full"
                      label={t("To")}
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                  </Box>
                </div>
              </div>
              <Button
                className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
                ripple={true}
                style={{
                  color: "white",
                  background: `${primaryColor}`,
                }}
                size="lg"
                type="submit"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: "white" }}
                    className="text-white"
                  />
                ) : (
                  <span>Bulk Assign</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default BulkColdCallAssign;
