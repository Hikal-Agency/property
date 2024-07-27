import React, { useState, useEffect } from "react";
import { TiArrowLeft } from "react-icons/ti";
import { Button } from "@material-tailwind/react";
import { useStateContext } from "../../context/ContextProvider";
import { FiEdit2 } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { RiArrowGoBackLine, RiArrowGoForwardLine } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";
import MainFormEditor from "../../Components/editorComp/MainFormEditor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import ViewForm from "../../Components/editorComp/ViewForm.js";
import { TextField } from "@mui/material";
import {
  DateOfBirth,
  Email,
  FirstName,
  FullName,
  LastName,
  Phone,
  ButtonComp,
  Address,
  City,
  Country,
  State,
  PostalCode,
  Website,
  Organization,
  Text,
  Image,
  Captcha,
  Source,
  TandC,
  HTMLBlock,
} from "../../Components/editorComp/FormEditorComponents/QuickAddComponents.js";
import FormSavingModal from "../../Components/editorComp/FormSavingModal.js";
import CurrencyConvertor from "./CurrencyConvertor.js";
import FormIntegrateModal from "../../Components/editorComp/IntegrateModal.js";
const components = {
  DateOfBirth,
  Email,
  FirstName,
  FullName,
  LastName,
  Phone,
  ButtonComp,
  Address,
  City,
  Country,
  State,
  PostalCode,
  Website,
  Organization,
  Text,
  Image,
  Captcha,
  Source,
  TandC,
  HTMLBlock,
};
const FormEditor = ({
  setFormEditor,
  formName: defaultFormName,
  fetchForms,
  formEdit,
  folders,
  fetchFolders,
}) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    t,
    themeBgImg,
    isLangRTL,
    i18n,
  } = useStateContext();
  const [formName, setFormName] = useState(defaultFormName);
  const [formNameEditMode, setFormNameEditMode] = useState(false);
  const [droppedComponents, setDroppedComponents] = useState([]);
  const [viewFormModal, setViewFormModal] = useState(false);
  const [formSavingModal, setFormSavingModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [formIntegrateModal, setFormIntegrateModal] = useState(false);
  const [formId, setFormId] = useState(null);

  useEffect(() => {
    if (formEdit?.fields?.length > 0) {
      const formEditFieldsR = formEdit?.fields?.map((field) => {
        const newField = { ...field };
        newField.component = components[field?.component];
        return newField;
      });
      setFormId(formEdit?.id);
      setDroppedComponents(formEditFieldsR);
      setFormName(formEdit?.name);
      console.log(formEdit, "form edit name");
    }
  }, [formEdit]);

  async function saveForm() {
    const token = localStorage?.getItem("auth-token");
    console.log(droppedComponents, "dropped components");
    const components = droppedComponents?.map((field) => {
      const newField = { ...field };
      newField.component = field?.component?.name;
      return newField;
    });
    console.log("select folder", selectedFolder);
    try {
      //new form creating api and logic
      if (!(formEdit?.fields?.length > 0) && !formId) {
        const changedComponents = components?.map((com) => {
          const newComp = { ...com };
          if (newComp.type == "html") {
            // alert("it is called here");
            newComp.html = newComp.html?.replace(/=/g, "equalSignH");
          }
          return newComp;
        });
        const res = await axios.post(
          `${BACKEND_URL}/forms`,
          JSON.stringify({
            name: formName,
            folder_id: selectedFolder?.value,
            fields: changedComponents,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (res?.status) {
          // console.log(res?.data)
          setFormId(res?.data?.data?.id);
          fetchForms();
          fetchFolders();
          toast.success("Form is Creadted Successfully", {
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
      } else {
        //form edit api
        // alert("it is called");
        console.log(formEdit, "folder id ");
        const changedComponents = components?.map((com) => {
          const newComp = { ...com };
          if (newComp.type == "html") {
            // alert("it is called here");
            newComp.html = newComp.html?.replace(/=/g, "equalSignH");
          }
          return newComp;
        });
        const res = await axios.put(
          `${BACKEND_URL}/forms/${formId}`,
          JSON.stringify({
            name: formName,
            folder_id: formEdit?.folder_id || selectedFolder?.value,
            fields: changedComponents,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (res?.status) {
          fetchForms();

          toast.success("Form is Updated Successfully", {
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
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Can't Save Form", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setFormSavingModal(false);
    }
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-full ">
          <header
            className={`flex items-center justify-between p-5 ${
              currentMode == "dark" ? "text-white" : "text-gray-600"
            } border-b`}
          >
            <Button
              onClick={() => setFormEditor(false)}
              ripple={true}
              variant="outlined"
              className={`shadow-none px-3 rounded-md text-sm flex gap-2 border-none ${
                themeBgImg
                  ? currentMode === "dark"
                    ? "blur-bg-dark shadow-sm text-white"
                    : "blur-bg-light shadow-sm text-black"
                  : currentMode === "dark"
                  ? "bg-dark-neu text-white"
                  : "bg-light-neu text-black"
              } `}
            >
              <TiArrowLeft size={16} />
              {t("Back")}
            </Button>
            <h2 className="text-[18px] flex gap-2 items-center">
              {!formNameEditMode && <span>{formName} </span>}
              {formNameEditMode && (
                // <input
                //   type="text"
                //   name=""
                //   id=""
                //   onChange={(e) => setFormName(e?.target?.value)}
                //   className="border-none border-b"
                // />
                <TextField
                  id="Form_name"
                  aria-label="Form Name"
                  type={"text"}
                  label={t("Form Name")}
                  className="w-full"
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                      {
                        right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                        transformOrigin: isLangRTL(i18n.language)
                          ? "right"
                          : "left",
                      },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language) ? "right" : "left",
                    },
                  }}
                  variant="outlined"
                  size="small"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              )}
              <FiEdit2 size={18} onClick={() => setFormNameEditMode(true)} />
            </h2>
            <nav className="flex gap-3">
              <Button
                onClick={() => setViewFormModal(true)}
                ripple={true}
                variant="outlined"
                className={`shadow-none px-3 rounded-md text-sm border-none flex gap-2${
                  themeBgImg
                    ? currentMode === "dark"
                      ? "blur-bg-dark shadow-sm text-white"
                      : "blur-bg-light shadow-sm text-black"
                    : currentMode === "dark"
                    ? "bg-dark-neu text-white"
                    : "bg-light-neu text-black"
                } `}
              >
                {t("Preview")}
              </Button>
              <Button
                onClick={() => setFormIntegrateModal(true)}
                ripple={true}
                variant="outlined"
                className={`shadow-none px-3 rounded-md text-sm flex gap-2 border-none  text-black bg-transparent`}
                disabled={!formId}
              >
                {t("Integrate")}
              </Button>
              <Button
                onClick={() => {
                  if (formEdit?.fields?.length > 0) {
                    saveForm();
                    return;
                  }
                  setFormSavingModal(true);
                }}
                ripple={true}
                variant="outlined"
                className={`shadow-none px-3 rounded-md text-sm border-none text-white flex gap-2 ${
                  themeBgImg
                    ? currentMode === "dark"
                      ? "blur-bg-dark shadow-sm text-white"
                      : "blur-bg-light shadow-sm text-black"
                    : currentMode === "dark"
                    ? "bg-dark-neu text-white"
                    : "bg-light-neu text-black"
                } `}
              >
                {!formId ? t("funnel_form_save") : t("btn_update")}
              </Button>
            </nav>
          </header>
          {/* <div className="flex items-center justify-between border-b p-5">
            <div className="flex items-center gap-3 px-3">
              <AiOutlinePlus size={16} />
              <IoNotificationsOutline size={16} />
            </div>
            <div className="flex items-center gap-3 px-3">
              <GoHistory size={16} />
              <RiArrowGoBackLine size={16} />
              <RiArrowGoForwardLine size={16} />
              <VscSettings size={16} />
            </div>
          </div> */}
          <MainFormEditor
            droppedComponents={droppedComponents}
            setDroppedComponents={setDroppedComponents}
          />
        </div>
      </DndProvider>
      <ViewForm
        viewFormModal={viewFormModal}
        setViewFormModal={setViewFormModal}
        fields={droppedComponents}
      />
      {formSavingModal && Object.keys(formEdit).length === 0 && (
        <FormSavingModal
          formSavingModal={formSavingModal}
          setFormSavingModal={setFormSavingModal}
          folders={folders}
          fetchFolders={fetchFolders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          saveForm={saveForm}
        />
      )}
      {formIntegrateModal && (
        <FormIntegrateModal
          formIntegrateModal={formIntegrateModal}
          setFormIntegrateModal={setFormIntegrateModal}
          form_id={formId}
          formName={formName}
        />
      )}
    </>
  );
};

export default FormEditor;
