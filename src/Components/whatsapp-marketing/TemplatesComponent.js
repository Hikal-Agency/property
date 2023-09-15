import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import CreateTemplateModal from "./CreateTemplateModal";
import { useStateContext } from "../../context/ContextProvider";

import axios from "../../axoisConfig";
import DeleteTemplateModal from "./DeleteTemplateModal";
import { BiPen, BiPlus, } from "react-icons/bi";
import { MdEmail, MdSms, MdTitle } from "react-icons/md";
import { HiTemplate } from "react-icons/hi";
import { AiFillEdit, AiOutlineEdit } from "react-icons/ai";
import { BsTrash, BsWhatsapp} from "react-icons/bs";
import { toast } from "react-toastify";
import UpdateTemplateModal from "./UpdateTemplateModal";
import Loader from "../Loader";
import TemplatesCountCard from "./TemplatesCountCard";

const TemplatesComponent = () => {
  const { BACKEND_URL, currentMode } = useStateContext();
  const [createTemplateModal, setCreateTemplateModal] = useState({
    isOpen: false,
  });
  const [loading, setLoading] = useState(false);
  const [updateTemplateModal, setUpdateTemplateModal] = useState({
    isOpen: false,
    template: {},
  });
  const [deleteTemplateModal, setDeleteTemplateModal] = useState({
    isOpen: false, 
    templateId: null
  });
  const [templates, setTemplates] = useState([]);
  const [deletebtnloading, setdeletebtnloading] = useState(false);

  const handleUpdateTemplate = (e, template) => {
      setUpdateTemplateModal({
        isOpen: true,
        template,
      });
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/templates`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setTemplates(response.data.templates.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (templateId) => {
    try {
      setdeletebtnloading(true);
      setLoading(true);
      const token = localStorage.getItem("auth-token");
      await axios.delete(`${BACKEND_URL}/templates/${templateId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      fetchTemplates();
      setLoading(false);
      toast.success("Template Deleted Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
      toast.error("Couldn't delete template", {
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
    setDeleteTemplateModal({isOpen: false, templateId: null});
      setdeletebtnloading(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box className="min-h-screen">
          <Box className="flex items-center justify-between mt-5">
            <h1
              className={`text-xl border-l-[4px] ml-1 pl-1 font-bold ${
                currentMode === "dark"
                  ? "text-white border-white"
                  : "text-red-600 font-bold border-red-600"
              }`}
            >
              ● Message Templates
            </h1>
            <Button
            style={{
                  background: "#da1f26",
            }}
              sx={{
                ml: 1,
                mr: 2,
                padding: "5px 10px",
                fontSize: 11,
              }}
              onClick={() => setCreateTemplateModal({ isOpen: true })}
              variant="contained"
            >
              <BiPlus size={16} style={{ marginRight: 5 }} />
              Add Template
            </Button>
          </Box>
          <Box
            className="flex items-center justify-around my-6"
            sx={{ color: currentMode === "dark" ? "white" : "black" }}
          >
            <TemplatesCountCard
              icon={<HiTemplate size={18} />}
              type="All Templates"
              count={templates?.length}
            />
            <TemplatesCountCard
              icon={<MdEmail size={18} />}
              type="Email Templates"
              count={templates?.map((temp) => temp?.type === "email")?.length}
            />
            <TemplatesCountCard
              icon={<BsWhatsapp size={18} />}
              type="Whatsapp Templates"
              count={templates?.map((temp) => temp?.type === "whatsapp")?.length}
            />
            <TemplatesCountCard
              icon={<MdSms size={18} />}
              type="SMS Templates"
              count={templates?.map((temp) => temp?.type === "sms")?.length}
            />
          </Box>
          <Box className="flex flex-wrap mt-3">
            {templates.length > 0 ? (
              <>
                {/* templates.map((template) => {
                return (
                  <>
                    <Card
                      key={template.name}
                      className={`w-[45%] max-h-[200px] border ${
                        currentMode === "dark"
                          ? "border-white"
                          : "border-red-600"
                      } mx-2 my-1 overflow-y-scroll cursor-pointer`}
                      onClick={(e) => handleUpdateTemplate(e, template)}
                      sx={{
                        bgcolor: currentMode === "dark" ? "#111827" : "#eee",
                        color: currentMode === "dark" ? "white" : "black",
                        marginBottom: 2,
                      }}
                    >
                      <CardHeader
                        titleTypographyProps={{ sx: { fontWeight: "bold" } }}
                        title={template.name}
                        action={
                          <div
                            className="delete-btn"
                            onClick={() => handleDelete(template.id)}
                          >
                            <IconButton>
                              <FaTrash
                                size={16}
                                color={currentMode === "dark" ? "white" : "red"}
                              />
                            </IconButton>
                          </div>
                        }
                      />
                      <CardContent>
                        <Typography variant="body1">
                          <Markdown>{template.body}</Markdown>
                        </Typography>
                      </CardContent>
                    </Card>
                  </>
                );
              }) */}
                <TableContainer component={Paper}>
                  <Table aria-label="simple table" sx={{ maxWidth: "100%" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Box className="flex items-center">
                            <strong className="text-xl">Name</strong>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className="flex items-center">
                              <strong className="text-xl">Type</strong>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className="flex items-center">
                              <strong className="text-xl">Edit</strong>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {templates.map((template) => (
                        <TableRow
                          key={template?.id}
                          sx={{
                            background: currentMode === "dark" ? "black" : "white",
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell sx={{color: currentMode === "dark" ? "white" : "black"}} component="th"  scope="row">
                            {template?.name}
                          </TableCell>
                          <TableCell sx={{color: currentMode === "dark" ? "white" : "black"}}>plain-text</TableCell>
                          <TableCell sx={{color: currentMode === "dark" ? "white" : "black"}}>
                            <Box className="flex items-center">
                              <IconButton
                              onClick={(e) => handleUpdateTemplate(e, template)}
                                sx={{ padding: 0, mr: 1 }}
                              >
                                <AiOutlineEdit
                                  size={20}
                                  style={{ color: currentMode === "dark" ? "white" : "black" }}
                                />
                              </IconButton>
                              <IconButton
                                onClick={() => setDeleteTemplateModal({isOpen: true, templateId: template?.id})}
                                sx={{ padding: 0 }}
                                color={
                                  "red"
                                }
                              >
                                <BsTrash
                                  size={18}
                                  style={{ color: "red" }}

                                />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <p style={{ color: "red", textAlign: "center" }}>
                Nothing to show
              </p>
            )}
          </Box>

          <CreateTemplateModal
            createTemplateModal={createTemplateModal}
            setCreateTemplateModal={setCreateTemplateModal}
            fetchTemplates={fetchTemplates}
          />
          {updateTemplateModal.isOpen && (
            <UpdateTemplateModal
              updateTemplateModal={updateTemplateModal}
              setUpdateTemplateModal={setUpdateTemplateModal}
              fetchTemplates={fetchTemplates}
            />
          )}
          {deleteTemplateModal?.isOpen && (
            <DeleteTemplateModal deleteTemplate={handleDelete} deleteTemplateModal={deleteTemplateModal} deletebtnloading={deletebtnloading} handleCloseDeleteTemplateModal={() => setDeleteTemplateModal({isOpen: false, templateId: null})}/>
          )}
        </Box>
      )}
    </>
  );
};

export default TemplatesComponent;
