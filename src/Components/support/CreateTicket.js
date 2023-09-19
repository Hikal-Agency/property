import {
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

import { BiSupport, BiMailSend } from "react-icons/bi";
import { BsWhatsapp } from "react-icons/bs";
import { MdVideoCameraFront } from "react-icons/md";
import { toast } from "react-toastify";
import { useState } from "react";
import { socket } from "../../Pages/App";

import axios from "../../axoisConfig";

const CreateTicket = ({ categories, setCategories }) => {
  const { currentMode, darkModeColors, BACKEND_URL, User } = useStateContext();
  const [newCategory, setNewCategory] = useState();
  const [showTextInput, setShowTextInput] = useState(false);
  const [values, setValues] = useState({
    ticketCategory: "",
    ticketDescription: "",
    supportSource: "",
    ticketIssue: "",
    ticketStatus: "",
  });
  const [btnloading, setbtnloading] = useState(false);

  const handleAddCategory = (e) => {
    e.preventDefault();
    setShowTextInput(true);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    if (!newCategory) {
      toast.error("Kindly enter category name.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setbtnloading(false);

      return;
    }

    if (categories?.find((cat) => cat?.catName === newCategory)) {
      toast.error("Category already exists, try another one!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setbtnloading(false);
      return;
    }

    setbtnloading(true);

    try {
      const token = localStorage.getItem("auth-token");

      const NewCategory = new FormData();

      NewCategory.append("status", 1);
      NewCategory.append("catName", newCategory);
      NewCategory.append("type", 1);
      NewCategory.append("is_parent", 1);

      const add_category = await axios.post(
        `${BACKEND_URL}/categories`,
        NewCategory,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Category Added: ", add_category.data.categories);
      setbtnloading(false);
      setCategories([...categories, add_category.data.categories]);
      setShowTextInput(false);
      setNewCategory("");

      toast.success("Category created successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log("Error : ", error);
      toast.error("Creating new category failed.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);
    }
  };

  const handleCreateCategory = (e) => {
    console.log("NEw Cat: ", e.target.value);
    setNewCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem("auth-token");
      setbtnloading(true);
      const response = await axios.post(
        `${BACKEND_URL}/tickets`,
        JSON.stringify({
          description: values.ticketDescription,
          category: values.ticketCategory.toLocaleLowerCase(),
          source: values.supportSource.toLowerCase(),
          status: values.ticketStatus,
          issue: values.ticketIssue,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("ticket added:: ", response);
      setValues({
        ticketCategory: "",
        ticketDescription: "",
        supportSource: "",
        ticketIssue: "",
        ticketStatus: "",
      });

      toast.success("Created new ticket successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);

      socket.emit("notification_ticket_add", {
        from: {
          id: User?.id,
        },
        participants: [],
        ticketCategory: response.data.tickets?.category,
        ticketNumber: response.data.tickets?.id,
      });
    } catch (error) {
      console.log(error);
      toast.error("Creating new ticket failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);
    }
  };

  return (
    <div
      className={`${
        currentMode === "dark" ? "text-white" : "text-black"
      } w-full h-full rounded-md p-5`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5">
        <div
          className={`${
            currentMode === "dark" ? "bg-black" : "bg-white"
          } rounded-md space-3 p-7`}
        >
          <h3 className="mb-3 font-semibold text-primary text-center">
            Ticket Details
          </h3>
          <hr className="mb-5"></hr>

          <form onSubmit={handleSubmit} action="">
            <Box sx={darkModeColors}>
              {/* TICKET CATEGORY  */}
              <FormControl fullWidth>
                <InputLabel>Ticket Category</InputLabel>
                {/* <Select
                  label="Ticket Category"
                  size="medium"
                  onChange={(e) =>
                    setValues({ ...values, ticketCategory: e.target.value })
                  }
                  value={values.ticketCategory}
                  className="w-full mb-5"
                  required
                >
                  <MenuItem disabled selected value="">
                    Select Category
                  </MenuItem>
                  {categories.map((category) => {
                    if(category.catName) {
                      return (
                        <MenuItem key={category.id} value={category.catName}>
                          {category.catName}
                        </MenuItem>
                      );
                    }
                  })}
                </Select> */}
                <Select
                  label="Ticket Category"
                  size="medium"
                  onChange={(e) =>
                    setValues({ ...values, ticketCategory: e.target.value })
                  }
                  value={values.ticketCategory}
                  className="w-full mb-5"
                  required
                >
                  <MenuItem disabled selected value="">
                    Select Category
                  </MenuItem>
                  {categories?.map((category) => {
                    if (category.catName) {
                      return (
                        <MenuItem key={category.id} value={category.catName}>
                          {category.catName}
                        </MenuItem>
                      );
                    }
                  })}
                  {showTextInput && (
                    <>
                      <MenuItem onKeyDown={(e) => e.stopPropagation()}>
                        <TextField
                          placeholder="New Category"
                          value={newCategory}
                          onChange={handleCreateCategory}
                          fullWidth
                        />
                      </MenuItem>
                      <Button
                        size="medium"
                        className="bg-btn-primary text-white rounded-lg py-3 font-semibold mb-3 ml-5"
                        style={{ color: "#ffffff" }}
                        sx={{ marginLeft: "20px" }}
                        onClick={handleSubmitCategory}
                        disabled={btnloading ? true : false}
                      >
                        {btnloading ? (
                          <CircularProgress
                            size={23}
                            sx={{ color: "white" }}
                            className="text-white"
                          />
                        ) : (
                          <span> Add</span>
                        )}
                      </Button>
                    </>
                  )}
                  {showTextInput || (
                    <>
                      {btnloading ? (
                        <CircularProgress
                          size={23}
                          sx={{ color: "white" }}
                          className="text-white"
                        />
                      ) : (
                        <span
                          className="fw-bold ml-4 cursor-pointer"
                          onClick={handleAddCategory}
                          sx={{ marginLeft: "200px" }}
                        >
                          + Add Category
                        </span>
                      )}
                    </>
                  )}
                </Select>
              </FormControl>
              <TextField
                id="ticket"
                type={"text"}
                label="Ticket Description"
                className="w-full mb-5"
                style={{ marginBottom: "20px" }}
                variant="outlined"
                size="medium"
                required
                onChange={(e) =>
                  setValues({ ...values, ticketDescription: e.target.value })
                }
                value={values.ticketDescription}
              />
              <TextField
                id="issue"
                type={"text"}
                label="Ticket Issue"
                className="w-full mb-5"
                style={{ marginBottom: "20px" }}
                variant="outlined"
                size="medium"
                required
                onChange={(e) =>
                  setValues({ ...values, ticketIssue: e.target.value })
                }
                value={values.ticketIssue}
              />
              {/* SUPORT VIA  */}
              <FormControl fullWidth>
                <InputLabel>Support Source</InputLabel>
                <Select
                  label="Support Source"
                  size="medium"
                  className="w-full mb-5"
                  onChange={(e) =>
                    setValues({ ...values, supportSource: e.target.value })
                  }
                  value={values.supportSource}
                  required
                >
                  <MenuItem disabled value="">
                    Select Support Source
                  </MenuItem>
                  <MenuItem value={"Email"}>Email</MenuItem>
                  <MenuItem value={"Video Call"}>Video Call</MenuItem>
                  <MenuItem value={"Phone Call"}>Phone Call</MenuItem>
                  <MenuItem value={"WhatsApp Chat"}>WhatsApp Chat</MenuItem>
                </Select>
              </FormControl>
              {/* Status */}
              <FormControl fullWidth>
                <InputLabel>Ticket Status</InputLabel>
                <Select
                  label="Ticket Status"
                  size="medium"
                  className="w-full mb-5"
                  onChange={(e) =>
                    setValues({ ...values, ticketStatus: e.target.value })
                  }
                  value={values.ticketStatus}
                  required
                >
                  <MenuItem disabled value="">
                    Select Ticket Status
                  </MenuItem>
                  <MenuItem value={"open"}>
                    <div className="bg-green-400 h-[100%] py-2 rounded px-3 w-[100%]">
                      Open
                    </div>
                  </MenuItem>
                  <MenuItem value={"pending"}>
                    <div className="bg-blue-400 h-[100%] py-2 rounded px-3 w-[100%]">
                      Pending
                    </div>
                  </MenuItem>
                  <MenuItem value={"in process"}>
                    <div className="bg-slate-400 h-[100%] py-2 rounded px-3 w-[100%]">
                      In Process
                    </div>
                  </MenuItem>
                  <MenuItem value={"resolved"}>
                    <div className="bg-purple-400 h-[100%] py-2 rounded px-3 w-[100%]">
                      Resolved
                    </div>
                  </MenuItem>
                  <MenuItem value={"closed"}>
                    <div className="bg-red-400 h-[100%] py-2 rounded px-3 w-[100%]">
                      Closed
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                size="medium"
                className="bg-btn-primary w-full text-white rounded-lg py-3 font-semibold mb-3"
                style={{ color: "#ffffff" }}
              >
                {btnloading ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  <span>Submit</span>
                )}
              </Button>
            </Box>
          </form>
        </div>
        <div className="space-3 p-1 sm:pb-1 sm:pt-5 md:pb-1 md:pt-5 lg:pb-3 lg:pt-5 xl:p-5">
          <h3 className="mb-3 font-semibold text-primary text-center">
            24x7 Real-time Support
          </h3>
          <h6 className="mb-3 text-center">
            Need help with our system? Contact our support team or create ticket
            for prompt assistance.
          </h6>
          {/* <h6 className="mb-3 text-center">For any questions or issues related to our website or services, please feel free to contact our friendly support team at support@hikalcrm.com, and we will do our best to assist you as soon as possible.</h6> */}
          <hr className="mb-5"></hr>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-3">
            {/* EMAIL  */}
            <div
              className={`${
                currentMode === "dark" ? "bg-black" : "bg-white"
              } rounded-lg p-3`}
            >
              <div className="gap-2">
                <div className="flex justify-center mb-2">
                  <BiMailSend
                    size={"50"}
                    color={"#ffffff"}
                    className="bg-primary p-3 rounded-full"
                  />
                </div>
                <h3 className="flex justify-center flex-wrap">
                  Support via Email
                </h3>
              </div>
            </div>
            {/* PHONE  */}
            <div
              className={`${
                currentMode === "dark" ? "bg-black" : "bg-white"
              } rounded-lg p-3`}
            >
              <div className="gap-2 text-center">
                <div className="flex justify-center mb-2">
                  <BiSupport
                    size={"50"}
                    color={"#ffffff"}
                    className="bg-primary p-3 rounded-full"
                  />
                </div>
                <h3 className="col-span-3">Support via Call</h3>
              </div>
            </div>
            {/* WHATSAPP CHAT  */}
            <div
              className={`${
                currentMode === "dark" ? "bg-black" : "bg-white"
              } rounded-lg p-3`}
            >
              <div className="gap-2 text-center">
                <div className="flex justify-center mb-2">
                  <BsWhatsapp
                    size={"50"}
                    color={"#ffffff"}
                    className="bg-primary p-3 rounded-full"
                  />
                </div>
                <h3 className="col-span-3">Support via WhatsApp</h3>
              </div>
            </div>
            {/* VIDEO CALL */}
            <div
              className={`${
                currentMode === "dark" ? "bg-black" : "bg-white"
              } rounded-lg p-3`}
            >
              <div className="gap-2 text-center">
                <div className="flex justify-center mb-2">
                  <MdVideoCameraFront
                    size={"50"}
                    color={"#ffffff"}
                    className="bg-primary p-3 rounded-full"
                  />
                </div>
                <h3 className="col-span-3">Support via Video Call</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
