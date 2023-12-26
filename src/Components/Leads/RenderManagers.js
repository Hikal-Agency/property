import { Button } from "@material-tailwind/react";
import { CircularProgress, Dialog, IconButton } from "@mui/material";
// import Select from "@mui/material/Select";
import Select from "react-select";
import { Box } from "@mui/system";
import { socket } from "../../Pages/App";

import axios from "../../axoisConfig";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { renderStyles } from "../_elements/SelectStyles";

import { BsPersonCheck } from "react-icons/bs";

const RenderManagers = ({ cellValues }) => {
  const [manager2, setmanager2] = useState(cellValues?.row?.assignedToManager);
  const [newManager, setnewManager] = useState("");

  const [salesperson2, setsalesperson2] = useState(
    cellValues?.row?.assignedToSales
  );

  const [Dialogue, setDialogue] = useState(false);
  const {
    currentMode,
    reloadDataGrid,
    setreloadDataGrid,
    BACKEND_URL,
    Managers,
    fetchSidebarData,
    User,
    t,
    primaryColor,
  } = useStateContext();
  const [btnloading, setbtnloading] = useState(false);

  useEffect(
    () => {
      setmanager2(cellValues?.row?.assignedToManager);
      setsalesperson2(cellValues?.row?.assignedToSales);
    },
    [cellValues?.row?.assignedToManager],
    [cellValues?.row?.assignedToSales]
  );

  const ChangeManager = (e) => {
    console.log(manager2);
    // console.log("New Manager", e.target);
    console.log("New Manager", e.value);

    let selectedItem;
    // selectedItem = Managers.find((item) => item.id === Number(e.target.value));
    selectedItem = Managers.find((item) => item.id === Number(e.value));
    setnewManager(selectedItem);

    let oldsales;
    oldsales = salesperson2;
    setsalesperson2(oldsales);
    console.log("setsalesperson2:   ", salesperson2);

    let old_selectedItem;

    old_selectedItem = Managers.find((item) => item.id === Number(manager2));
    // console.log("old: ", old_selectedItem);
    // console.log("new: ", selectedItem);

    setDialogue(true);
    // setmanager2(old_selectedItem);
  };
  const UpdateManager = async () => {
    setbtnloading(true);
    console.log("Update manager: ", cellValues);
    const token = localStorage.getItem("auth-token");

    var assigned = cellValues?.row?.firstAssigned;
    console.log(
      "assigned --------------------------------> ",
      cellValues?.row?.firstAssigned
    );
    console.log("assigned --------------------------------> ", assigned);
    var newAssigned = "";

    const UpdateLeadData = new FormData();
    // UpdateLeadData.append("lid", cellValues?.row?.leadId);
    UpdateLeadData.append("id", cellValues?.row?.leadId);
    if (newManager === undefined) {
      if (salesperson2 === null) {
        UpdateLeadData.append("assignedToManager", 1);
        UpdateLeadData.append("feedback", "New");
      } else {
        UpdateLeadData.append("assignedToManager", 1);
        UpdateLeadData.append("feedback", "New");
        // UpdateLeadData.append("leadStatus", "Transferred");
        // UpdateLeadData.append("transferredFrom", salesperson2);
        // UpdateLeadData.append("transferredFromName", salesperson2);
        // UpdateLeadData.append(
        //   "transferredDate",
        //   moment().format("YYYY-MM-DD HH:mm:ss")
        // );
      }
    } else {
      newAssigned = newManager?.id;
      if (assigned === "") {
        assigned = newAssigned;
      } else {
        assigned += `,${newAssigned}`;
      }
      console.log("assigned ===================================> ", assigned);
      UpdateLeadData.append("firstAssigned", assigned);

      if (salesperson2 === null) {
        UpdateLeadData.append("assignedToManager", newManager?.id);
        UpdateLeadData.append("feedback", "New");
      } else {
        UpdateLeadData.append("assignedToManager", newManager?.id);
        UpdateLeadData.append("feedback", "New");
        // UpdateLeadData.append("leadStatus", "Transferred");
        // UpdateLeadData.append("transferredFrom", salesperson2);
        // UpdateLeadData.append("transferredFromName", salesperson2);
        // UpdateLeadData.append(
        //   "transferredDate",
        //   moment().format("YYYY-MM-DD HH:mm:ss")
        // );
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
        console.log("Manager Updated successfull");
        fetchSidebarData();
        console.log(result);

        socket.emit("notification_lead_manager_assign", {
          from: { id: User?.id, userName: User?.userName },
          participants: [newManager?.id],
          newManager: newManager?.userName,
          leadName: cellValues?.row?.leadName,
        });

        socket.emit("notification_lead_assign", {
          newAssignee: [
            {
              id: newManager?.id,
              userName: newManager?.userName,
            },
          ],
          leadName: cellValues?.row?.leadName,
        });

        fetchSidebarData();

        toast.success("Manager Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
        setmanager2(newManager);
        setreloadDataGrid(!reloadDataGrid);
        setDialogue(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in Updating Manager. Kindly Refresh the page", {
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

  console.log("manger2: ", manager2);

  return (
    <Box
      className={`renderDD w-full h-full flex items-center justify-center`}
      // sx={SelectStyles}
    >
      <Select
        id="manager"
        value={
          String(manager2) === "1" || !manager2 || manager2 === "0"
            ? null
            : {
                label: Managers.find((manager) => manager.id === manager2)
                  ?.userName,
                value: manager2,
              }
        }
        onChange={ChangeManager}
        options={[
          {
            label: "---", //"---" + t("label_manager") + "---",
            value: null,
          },
          ...(Managers?.map((manager) => ({
            label: manager?.userName,
            value: manager?.id,
          })) ?? []),
        ]}
        placeholder={t("label_manager")}
        className={`w-full`}
        menuPortalTarget={document.body}
        styles={renderStyles(currentMode, primaryColor)}
      />

      {/* <FormControl sx={{ m: 1, minWidth: 80, border: 1, borderRadius: 1 }}>
        <Select
          id="manager"
          // value={manager2 ?? "select_manager"}
          value={
            String(manager2) === "1" || !manager2 || manager2 === "0"
              ? "select_manager"
              : manager2
          }
          label={t("label_manager")}
          onChange={ChangeManager}
          size="medium"
          className="w-full border border-gray-300 rounded "
          displayEmpty
          required
          sx={{
            border: "1px solid #000000",

            "& .MuiSelect-select": {
              fontSize: 11,
            },
          }}
        >
          <MenuItem value="select_manager" selected>
            ---{t("label_manager")}---
          </MenuItem>
          {Managers?.length > 0 &&
            Managers?.map((manager, index) => (
              <MenuItem key={index} value={manager?.id} sx={{ color: "black" }}>
                {manager?.userName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>*/}

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
            <div
              className={`px-10 py-5 ${
                currentMode === "dark"
                  ? "bg-[#1C1C1C] text-white"
                  : "bg-white text-black"
              }`}
            >
              <div className="flex flex-col justify-center items-center">
                <BsPersonCheck size={50} className="text-primary text-2xl" />
                <h1 className="font-semibold pt-3 text-lg text-center">
                  {t("want_to_change_manager")} {t("from")}{" "}
                  <span className="text-sm bg-gray-500 px-2 py-1 rounded-md font-bold">
                    {Managers.find((item) => item.id === Number(manager2))
                      ?.userName ?? "No manager"}
                  </span>{" "}
                  {t("to")}{" "}
                  <span className="text-sm bg-primary px-2 py-1 rounded-md font-bold">
                    {newManager?.userName}
                    {/* //{" "}
                    {
                      Managers?.find((manager) => manager.id === manager2)
                        .userName
                    }
                    //{" "}
                  </span>{" "}
                  // to //{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    //{" "}
                    {
                      Managers.find((manager) => manager.id === newManager)
                        .userName
                    } */}
                  </span>{" "}
                  ?
                </h1>
              </div>
              <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                <Button
                  className={` text-white rounded-md p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                  ripple={true}
                  size="lg"
                  onClick={() => UpdateManager(cellValues)}
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
                  {t("cancel")}
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default RenderManagers;
