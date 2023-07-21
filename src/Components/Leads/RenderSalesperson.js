import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
  // Select,
} from "@mui/material";
import Select from "@mui/material/Select";

// import axios from "axios";
import axios from "../../axoisConfig";
import React, { useState, useEffect } from "react";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";

const RenderSalesperson = ({ cellValues, lead_origin }) => {
  const [SalesPerson2, setSalesPerson2] = useState(
    cellValues?.row?.assignedToSales
  );

  const [SalesPersonsList, setSalesPersonsList] = useState([]);
  const [SalesPerson3, setSalesPerson3] = useState();
  const [newSalesPerson, setnewSalesPerson] = useState("");
  const [Dialogue, setDialogue] = useState(false);
  const [noAgents, setNoAgents] = useState(false);
  const {
    currentMode,
    reloadDataGrid,
    setreloadDataGrid,
    SalesPerson,
    BACKEND_URL,
    Managers,
    User,
  } = useStateContext();
  const [btnloading, setbtnloading] = useState(false);

  console.log("agents list: ", SalesPerson);
  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium,& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline ":
      {
        color: currentMode === "dark" ? "white" : "black",
        // borderColor: currentMode === "dark" ? "white" : "black",
        border: "none",
        fontSize: "0.9rem",
        fontWeight: "500",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      // borderColor: currentMode === "dark" ? "white" : "black",
      border: "none",
    },
  };

  const ChangeSalesPerson = (e) => {
    console.log(e.target);
    let selectedItem;
    selectedItem = SalesPersonsList.find(
      (item) => item.id === Number(e.target.value)
    );
    let old_selectedItem;

    old_selectedItem = SalesPersonsList.find(
      (item) => item.id === Number(SalesPerson2)
    );
    console.log(selectedItem);

    setnewSalesPerson(selectedItem);
    setSalesPerson3(old_selectedItem);
    setDialogue(true);
  };
  const UpdateSalesPerson = async () => {
    const managerId = cellValues?.row?.assignedToManager;
    console.log("cellvalues in agents: ", cellValues);
    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    const UpdateLeadData = new FormData();
    UpdateLeadData.append("id", cellValues?.row?.leadId);
    if (newSalesPerson === undefined) {
      UpdateLeadData.append("assignedToSales", 1);
    } else {
      UpdateLeadData.append("assignedToSales", newSalesPerson?.id);
    }

    await axios
      .post(`${BACKEND_URL}/leads/${cellValues?.row?.leadId}`, UpdateLeadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Agent Updated successfull");
        console.log(result);
        toast.success("Agent Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);

        if (lead_origin === "unassigned") {
          setSalesPerson2(null);
        } else {
          setSalesPerson2(newSalesPerson?.id);
        }
        setreloadDataGrid(!reloadDataGrid);
        setDialogue(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in Updating Agent. Kindly refresh the page", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
      });
  };

  useEffect(() => {
    const managerId = cellValues?.row?.assignedToManager;
    console.log("managerID: ", managerId);
    const agents = SalesPerson[`manager-${managerId}`];
    if (
      managerId &&
      ((User?.role === 2 && managerId !== User?.id && managerId !== 102) ||
        (User?.role !== 2 && managerId !== 102 && managerId !== 358))
    ) {
      if (agents === undefined || agents.length === 0) {
        setNoAgents(true);
      } else {
        setNoAgents(false);
        setSalesPersonsList(agents);
      }
    } else if (
      ((!managerId || managerId === 102) && User?.role === 1) ||
      ((!managerId || managerId === User?.id) && User?.role === 2)
    ) {
      setNoAgents(false);
      const agents = Object.values(SalesPerson).flat();
      console.log("Agents extracted: ", agents);

      setSalesPersonsList(agents);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cellValues?.row?.assignedToManager,
    cellValues?.row?.assignedToSales,
    SalesPerson,
  ]);

  useEffect(() => {
    if (Managers.length > 0 && Object.values(SalesPerson).length > 0) {
      const findAgent = SalesPerson[
        `manager-${cellValues?.row?.assignedToManager}`
      ]?.filter((agent) => {
        return String(agent.id) === String(cellValues?.row?.assignedToSales);
      });
      if (findAgent || findAgent?.length > 0) {
        setSalesPerson2(findAgent[0]?.id);
      } else {
        setSalesPerson2("selected_agent");
      }
    }
  }, [
    cellValues?.row?.assignedToManager,
    cellValues?.row?.assignedToSales,
    SalesPerson,
    Managers,
  ]);

  return (
    <Box
      className={`w-full h-full flex items-center justify-center`}
      sx={SelectStyles}
    >
      {noAgents ? (
        <p
          style={{
            color: currentMode === "light" ? "#0000005c" : "#ffffff",
            textAlign: "left",
            width: "85%",
          }}
        >
          No Agents
        </p>
      ) : (
        <FormControl sx={{ m: 1, minWidth: 80, border: 1, borderRadius: 1 }}>
          <Select
            id="SalesPerson"
            value={
              !SalesPerson2 || SalesPerson2 === "0" || SalesPerson === 102
                ? "selected_agent"
                : SalesPerson2
            }
            name="salesperson"
            label="Salesperson"
            onChange={ChangeSalesPerson}
            size="medium"
            className="w-[100%] h-[75%]"
            sx={{
              color:
                currentMode === "dark"
                  ? "#ffffff !important"
                  : "#000000 !important",
              "& .MuiSelect-icon": {
                color:
                  currentMode === "dark"
                    ? "#ffffff !important"
                    : "#000000 !important",
              },
            }}
            displayEmpty
            required
          >
            <MenuItem value={"selected_agent"} selected>
              {" "}
              Select Agent
            </MenuItem>

            {SalesPersonsList?.length > 0 &&
              SalesPersonsList?.map((salesperson, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={salesperson?.id}
                    data
                    name={salesperson?.userName}
                  >
                    {salesperson?.userName}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      )}

      {Dialogue && (
        <>
          <Dialog
            sx={{
              "& .MuiPaper-root": {
                boxShadow: "none !important",
              },
              "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
                {
                  backgroundColor: "rgba(0, 0, 0, 0.5) !important",
                },
            }}
            open={Dialogue}
            onClose={(e) => setDialogue(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <IconButton
              sx={{
                position: "absolute",
                right: 12,
                top: 10,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={() => setDialogue(false)}
            >
              <IoMdClose size={18} />
            </IconButton>
            <div className="px-10 py-5">
              <div className="flex flex-col justify-center items-center">
                <IoIosAlert
                  size={50}
                  className="text-main-red-color text-2xl"
                />
                <h1 className="font-semibold pt-3 text-lg text-center">
                  Do You Really Want Change the Agent from{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    {SalesPerson3?.userName ?? "No Agent"}
                  </span>{" "}
                  to{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    {newSalesPerson?.userName}
                  </span>{" "}
                  ?
                </h1>
              </div>
              <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                <Button
                  className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                  ripple={true}
                  size="lg"
                  onClick={() => UpdateSalesPerson(cellValues)}
                >
                  {btnloading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : (
                    <span>Confirm</span>
                  )}
                </Button>

                <Button
                  onClick={() => setDialogue(false)}
                  ripple={true}
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
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default RenderSalesperson;
