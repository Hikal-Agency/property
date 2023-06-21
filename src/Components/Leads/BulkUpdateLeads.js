import { useState } from "react";
import {
  Modal,
  Backdrop,
  IconButton,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { IoMdClose } from "react-icons/io";
// import axios from "axios";
import axios from "../../axoisConfig";
import { toast, ToastContainer } from "react-toastify";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const BulkUpdateLeads = ({
  bulkUpdateModelOpen,
  handleCloseBulkUpdateModel,
  selectedRows,
  FetchLeads,
selectionModelRef
}) => {
  const { currentMode, Managers, User, SalesPerson, BACKEND_URL } =
    useStateContext();
  const [Manager, setManager] = useState(0);
  const [SalesPerson2, setSalesPerson2] = useState(0);
  const [SalesPersonsList, setSalesPersonsList] = useState([]);
  const [noAgents, setNoAgents] = useState(false);
  const [btnloading, setbtnloading] = useState(false);

  const ChangeManager = (event) => {
    setManager(event.target.value);
    const agents = SalesPerson[`manager-${event.target.value}`];
    if (agents) {
      setSalesPersonsList([...agents]);
      setNoAgents(false);
    } else {
      setNoAgents(true);
    }
  };

  const ChangeSalesPerson = (event) => {
    setSalesPerson2(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (User.role === 1 && Manager) {
      const token = localStorage.getItem("auth-token");

       const UpdateLeadData = {
        ids: selectedRows, 
        action: "update",
       };

          if (Manager && !SalesPerson2) {
            UpdateLeadData["role"] = "manager";
            UpdateLeadData["user_id"] = Manager;
          } else if(Manager && SalesPerson2) {
            UpdateLeadData["role"] = "agent";
            UpdateLeadData["user_id"] = SalesPerson2;
          }

          await axios.post(`${BACKEND_URL}/bulkaction`, JSON.stringify(UpdateLeadData), {
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

      setbtnloading(true);
      toast.success("Leads Updated Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);
      FetchLeads(token);
      selectionModelRef.current = [];
      handleCloseBulkUpdateModel();
    }
    } catch (error) {
      toast.error("Error in Updating Leads", {
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
      handleCloseBulkUpdateModel();
    }
  };

  return (
    <>
      <Modal
        keepMounted
        open={bulkUpdateModelOpen}
        onClose={handleCloseBulkUpdateModel}
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
          className={`w-[calc(100%-20px)] md:w-[40%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
        >
          <ToastContainer />
          <IconButton
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleCloseBulkUpdateModel}
          >
            <IoMdClose size={18} />
          </IconButton>
          <Select
            id="Manager"
            value={Manager}
            disabled={User?.role !== 1 && User?.role !== 2 && true}
            label="Manager"
            onChange={ChangeManager}
            size="medium"
            className="w-full mb-5"
            displayEmpty
            required
          >
            <MenuItem value="0" disabled>
              <span style={{ color: "grey" }}>Manager</span>
            </MenuItem>
            {Managers?.map((person, index) => (
              <MenuItem key={index} value={person?.id || ""}>
                {person?.userName}
              </MenuItem>
            ))}
          </Select>

          {noAgents ? (
            <p
              style={{
                color: "#0000005c",
                textAlign: "left",
                width: "85%",
              }}
            >
              No Agents
            </p>
          ) : (
            User.role === 1 && (
              <Select
                id="SalesPerson"
                value={SalesPerson2}
                label="Agent"
                onChange={ChangeSalesPerson}
                size="medium"
                className="w-full mb-5"
                displayEmpty
                disabled={User?.role !== 1 && User?.role !== 2 && true}
                // required={SalesPerson.length > 0 ? true : false}
              >
                <MenuItem value="0" disabled>
                  <span style={{ color: "grey" }}>Agent</span>
                </MenuItem>
                {SalesPersonsList?.map((person, index) => (
                  <MenuItem key={index} value={person?.id || ""}>
                    {person?.userName}
                  </MenuItem>
                ))}
              </Select>
            )
          )}

          <Button
            className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
            ripple={"true"}
            size="lg"
            onClick={handleSubmit}
            type="submit"
            disabled={btnloading ? true : false}
          >
            {btnloading ? (
              <div className="flex items-center justify-center space-x-1">
                <CircularProgress size={18} sx={{ color: "blue" }} />
              </div>
            ) : (
              <span>Update Leads</span>
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default BulkUpdateLeads;
