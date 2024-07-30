import React, { useState, useEffect, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import { Button } from "@material-tailwind/react";
import { FaPlus } from "react-icons/fa6";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import FormEditModal from "../../Components/editorComp/FormEditModal";
import CreateFolderModal from "../../Components/editorComp/CreateFolderModal";
import FormEditor from "./FormEditor";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import Forms from "../../Components/editorComp/Forms";
import Folders from "../../Components/editorComp/Folders";

const FormsList = () => {
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    pageState,
    setpageState,
    User,
    darkModeColors,
    themeBgImg,
    t,
    modal,
  } = useStateContext();
  const { hasPermission } = usePermission();
  const [formEditModal, setFormEditModal] = useState(false);
  const [folderModal, setFolderModal] = useState(false);
  const [formEditor, setFormEditor] = useState(false);
  const [currentTab, setCurrentTab] = useState("all_forms");
  const [forms, setForms] = useState([]);
  const [folders, setFolders] = useState([]);
  const [formEdit, setFormEdit] = useState({});
  const [formsLoading, setFormsLoading] = useState(false);
  const [foldersLoading, setFoldersLoading] = useState(false);

  useEffect(() => {
    fetchFolderList();
  }, []);
  useEffect(() => {
    fetchFormsList();
  }, []);

  //functions

  const fetchFolderList = async () => {
    let token = localStorage?.getItem("auth-token");
    setFoldersLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/folders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setFolders(res?.data?.data);

      console.log(res?.data?.data, "folders");
    } catch (error) {
      console.log("can't fetch folders ");
      toast.error("Can't fetch folders", {
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
      setFoldersLoading(false);
    }
  };

  const fetchFormsList = async () => {
    let token = localStorage?.getItem("auth-token");
    setFormsLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/forms`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setForms(res?.data?.data);
      console.log(res?.data);
    } catch (error) {
      console.log("can't fetch forms ");
      toast.error("Can't fetch forms", {
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
      setFormsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            !themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
          }`}
        >
          {!formEditor && (
            <div className="mb-10 py-5 px-[4rem]">
              <div className="">
                <div className="flex items-center justify-between w-full pt-10">
                  <div className="flex items-center">
                    <h1
                      className={`text-lg font-semibold uppercase ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {t("Forms")}
                    </h1>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Button
                      onClick={() => setFolderModal(true)}
                      ripple={true}
                      variant="outlined"
                      className={`shadow-none px-3 rounded-lg h-full text-sm flex gap-2 border border-gray-300 text-black bg-white`}
                    >
                      <MdOutlineCreateNewFolder size={16} />
                      {t("Create Folder")}
                    </Button>
                    <Button
                      onClick={() => {
                        setFormEditor(true);
                        setFormEdit({});
                      }}
                      ripple={true}
                      variant="outlined"
                      className={`shadow-none px-5  rounded-lg h-full text-sm flex gap-2 bg-black text-white border border-black items-center flex`}
                    >
                      <div className="h-[16px] grid items-center">
                        <FaPlus size={10} />
                      </div>
                      {t("Add Form")}
                    </Button>
                  </div>
                </div>
                <div>
                  <p
                    className={`text-gray-500 text-[16px] pb-7 xl:w-full sm:w-[65%]`}
                  >
                    Enhance reach with unlimited terms, no coding. Gather
                    essential into for targeted, personalized content.
                  </p>
                </div>
              </div>
              <div className="w-full flex items-center pb-3 mt-3  flex-col">
                <div className="flex w-full ">
                  <button
                    className={` ${
                      currentTab == "all_forms"
                        ? "bg-primary text-white"
                        : "bg-transparent"
                    } p-3 border ${
                      currentMode === "dark" && "border-gray-800 text-white"
                    }`}
                    onClick={() => setCurrentTab("all_forms")}
                  >
                    All Forms
                  </button>
                  <button
                    className={` ${
                      currentTab == "folders"
                        ? "bg-primary text-white"
                        : "bg-transparent"
                    } p-3 border border-l-none ${
                      currentMode === "dark" && "border-gray-800 text-white"
                    }`}
                    onClick={() => setCurrentTab("folders")}
                  >
                    Folders
                  </button>
                </div>
                {/* <div
                  className={`h-[1px] w-full  ${
                    currentMode == "dark" ? "bg-black" : "bg-gray-200"
                  }`}
                ></div> */}
              </div>
              {currentTab == "all_forms" && (
                <Forms
                  forms={forms}
                  fetchForms={fetchFormsList}
                  setFormEditor={setFormEditor}
                  setFormEdit={setFormEdit}
                  loading={formsLoading}
                />
              )}
              {currentTab == "folders" && (
                <Folders
                  folders={folders}
                  setFormEditor={setFormEditor}
                  setFormEdit={setFormEdit}
                  fetchFolders={fetchFolderList}
                  fetchForms={fetchFormsList}
                  loading={foldersLoading}
                />
              )}
            </div>
          )}
          {formEditor && (
            <FormEditor
              setFormEditor={setFormEditor}
              formName={`Hikam Form ${forms.length + 1}`}
              fetchForms={fetchFormsList}
              formEdit={formEdit}
              loading={foldersLoading}
              folders={folders}
              fetchFolders={fetchFolderList}
            />
          )}
        </div>

        {folderModal && (
          <CreateFolderModal
            folderModal={folderModal}
            setFolderModal={setFolderModal}
            fetchFolders={fetchFolderList}
          />
        )}
      </div>
    </>
  );
};

export default FormsList;
