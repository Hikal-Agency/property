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
// import Select from "@mui/material/Select";
import Select from "react-select";
import moment from "moment";
import { socket } from "../../Pages/App";

import axios from "../../axoisConfig";
import React, { useState, useEffect } from "react";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { renderStyles } from "../_elements/SelectStyles";

import {
  BsPersonCheck
} from "react-icons/bs";

const RenderSalesperson = ({ cellValues, lead_origin }) => {
  const [SalesPerson2, setSalesPerson2] = useState(
    cellValues?.row?.assignedToSales
  );

  console.log("agent's cellvalues======> ", cellValues);

  // const [transferfrom, settransferfrom] = useState(cellValues?.row?.transferredFrom);

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
    fetchSidebarData,
    User,
    t,
    primaryColor
  } = useStateContext();
  const [btnloading, setbtnloading] = useState(false);

  console.log("agents list: ", SalesPerson);
  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium,& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline ":
      {
        color: currentMode === "dark" ? "white" : "black",
        // borderColor: currentMode === "dark" ? "white" : "black",
        border: "none",
        fontSize: "12px",
        fontWeight: "400",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      // borderColor: currentMode === "dark" ? "white" : "black",
      border: "none",
    },
  };

  const ChangeSalesPerson = (e) => {
    let selectedItem;
    selectedItem = SalesPersonsList.find(
      // (item) => item.id === Number(e.target.value)
      (item) => item.id === Number(e.value)
    );
    let old_selectedItem;

    old_selectedItem = SalesPersonsList.find(
      (item) => item.id === Number(SalesPerson2)
    );
    // settransferfrom(transferfrom);
    // console.log("transfer from::::::::::::::::: ", transferfrom);
    console.log("old selected ===================> ", old_selectedItem);
    console.log(selectedItem);

    // if (transferfrom === null) {}
    // else {
    //   let tfromname;
    //   tfromname = SalesPersonsList.find(
    //     (item) => item.id === Number(transferfrom)
    //   );
    //   console.log("transfer name::::::::::::::", tfromname);
    //   console.log("transfer name::::::::::::::", tfromname);
    // }

    setnewSalesPerson(selectedItem);
    setSalesPerson3(old_selectedItem);
    setDialogue(true);
  };
  const UpdateSalesPerson = async () => {
    const managerId = cellValues?.row?.assignedToManager;
    console.log("cellvalues in agents: ", cellValues);
    setbtnloading(true);
    const token = localStorage.getItem("auth-token");

    var assigned = cellValues?.row?.firstAssigned;
    console.log(
      "assigned --------------------------------> ",
      cellValues?.row?.firstAssigned
    );
    console.log("assigned --------------------------------> ", assigned);
    var newAssigned = "";

    const UpdateLeadData = new FormData();
    UpdateLeadData.append("id", cellValues?.row?.leadId);
    if (newSalesPerson === undefined) {
      if (SalesPerson3 === undefined) {
        UpdateLeadData.append("assignedToSales", 1);
        UpdateLeadData.append("feedback", "New");
      } else {
        UpdateLeadData.append("assignedToSales", 1);
        // UpdateLeadData.append("leadStatus", "Transferred");
        // UpdateLeadData.append("transferredFrom", SalesPerson3.id);
        // UpdateLeadData.append("transferredFromName", SalesPerson3.userName);
        // UpdateLeadData.append(
        //   "transferredDate",
        //   moment().format("YYYY-MM-DD HH:mm:ss")
        // );
        UpdateLeadData.append("feedback", "New");
      }
    } else {
      newAssigned = newSalesPerson?.id;
      if (assigned === "") {
        assigned = newAssigned;
      } else {
        assigned += `,${newAssigned}`;
      }
      console.log("assigned ===================================> ", assigned);
      UpdateLeadData.append("firstAssigned", assigned);

      if (SalesPerson3 === undefined) {
        UpdateLeadData.append("assignedToSales", newSalesPerson?.id);
      } else {
        UpdateLeadData.append("assignedToSales", newSalesPerson?.id);
        // UpdateLeadData.append("leadStatus", "Transferred");
        // UpdateLeadData.append("transferredFrom", SalesPerson3.id);
        // UpdateLeadData.append("transferredFromName", SalesPerson3.userName);
        // UpdateLeadData.append(
        //   "transferredDate",
        //   moment().format("YYYY-MM-DD HH:mm:ss")
        // );
        UpdateLeadData.append("feedback", "New");
      }
    }

    // update transferred request
    if (cellValues?.row?.transferRequest === 1) {
      UpdateLeadData.append("leadStatus", "Transferred");
      UpdateLeadData.append("transferRequest", 2);
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
        fetchSidebarData();
        console.log(result);

        socket.emit("notification_lead_agent_assign", {
          from: { id: User?.id, userName: User?.userName },
          participants: [newSalesPerson?.id],
          newAgent: newSalesPerson?.userName,
          leadName: cellValues?.row?.leadName,
        });
        socket.emit("notification_lead_assign", {
          newAssignee: [
            {
              id: newSalesPerson?.id,
              userName: newSalesPerson?.userName,
            },
          ],
          leadName: cellValues?.row?.leadName,
        });

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
      className={`renderDD w-full h-full flex items-center justify-center`}
      sx={SelectStyles}
    >
      {noAgents ? (
        <p
          style={{
            color: currentMode === "light" ? "#000000" : "#ffffff",
            textAlign: "left",
            width: "85%",
          }}
        >
          {t("no_agents")}
        </p>
      ) : (
        <Select 
          id="SalesPerson"
          value={
            !SalesPerson2 || SalesPerson2 === "0" || SalesPerson === "1" || SalesPerson2 === null
            ? {
              label: "",
              value: null
            }
            : {
              label: SalesPersonsList.find(salesperson => salesperson.id === SalesPerson2)?.userName, 
              value: SalesPerson2
            }
          }
          onChange={ChangeSalesPerson}
          options={[
            {
              label: "---", //"---" + t("label_manager") + "---",
              value: null,
            },
            ...(SalesPersonsList?.map((salesperson) => ({
              label: salesperson.userName,
              value: salesperson.id,
            })) ?? []),
          ]}
          placeholder={t("label_sales_agent")}
          className={`w-full`}
          menuPortalTarget={document.body}
          styles={renderStyles(currentMode, primaryColor)}
        />
        // <FormControl sx={{ m: 1, minWidth: 80, border: 1, borderRadius: 1 }}>
        //   <Select
        //     id="SalesPerson"
        //     value={
        //       !SalesPerson2 || SalesPerson2 === "0" || SalesPerson === 102
        //         ? "selected_agent"
        //         : SalesPerson2
        //     }
        //     name="salesperson"
        //     label={t("label_sales_agent")}
        //     onChange={ChangeSalesPerson}
        //     size="medium"
        //     className="w-[100%] h-[75%]"
        //     sx={{
        //       "& .MuiSelect-select": {
        //         fontSize: 11,
        //       },
        //       color:
        //         currentMode === "dark"
        //           ? "#ffffff !important"
        //           : "#000000 !important",
        //       "& .MuiSelect-icon": {
        //         color:
        //           currentMode === "dark"
        //             ? "#ffffff !important"
        //             : "#000000 !important",
        //       },
        //     }}
        //     displayEmpty
        //     required
        //   >
        //     <MenuItem value={"selected_agent"} selected>
        //       {" "}
        //       ---{t("label_agent")}---
        //     </MenuItem>

        //     {SalesPersonsList?.length > 0 &&
        //       SalesPersonsList?.map((salesperson, index) => {
        //         return (
        //           <MenuItem
        //             key={index}
        //             value={salesperson?.id}
        //             data
        //             name={salesperson?.userName}
        //           >
        //             {salesperson?.userName}
        //           </MenuItem>
        //         );
        //       })}
        //   </Select>
        // </FormControl>
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
                  // backgroundColor: "rgba(0, 0, 0, 0.6) !important",
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
            <div className={`px-10 py-5 ${currentMode === "dark" ? "bg-[#1C1C1C] text-white" : "bg-white text-black"}`}>
              <div className="flex flex-col justify-center items-center">
                <BsPersonCheck size={50} className="text-primary text-2xl" />
                <h1 className="font-semibold pt-3 text-lg text-center">
                  {t("want_to_change_agent")} {t("from")}{" "}
                  <span className="text-sm bg-gray-500 px-2 py-1 rounded-md font-bold">
                    {SalesPerson3?.userName ?? "No Agent"}
                  </span>{" "}
                  {t("to")}{" "}
                  <span className="text-sm bg-primary px-2 py-1 rounded-md font-bold">
                    {newSalesPerson?.userName}
                  </span>{" "}
                  ?
                </h1>
              </div>
              <div className="action buttons mt-5 flex items-center gap-3 justify-center ">
                <Button
                  className={` text-white rounded-md p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                  ripple={true}
                  size="lg"
                  onClick={() => UpdateSalesPerson(cellValues)}
                >
                  {btnloading ? (
                    <CircularProgress size={16} sx={{ color: "white" }} />
                  ) : (
                    <span>{t("confirm")}</span>
                  )}
                </Button>

                <Button
                  onClick={() => setDialogue(false)}
                  ripple={true}
                  variant="outlined"
                  className={`shadow-none p-3 rounded-md text-sm  ${
                    currentMode === "dark"
                      ? "text-white border-white"
                      : "text-black border-black"
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
