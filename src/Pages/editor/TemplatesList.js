import { Link } from "react-router-dom";
import TemplatesListComp from "../../Components/editorComp/TemplatesListComp";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import { AiOutlinePlus } from "react-icons/ai";

import React, { useState } from "react";
import AddTemplateModal from "../../Components/editorComp/AddTemplateModal";

const TemplatesList = () => {
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
  const token = localStorage.getItem("auth-token");
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="mb-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("templates_list")}{" "}
                </h1>
              </div>
              <button
                className="bg-btn-primary text-white px-4 py-2 rounded-md mr-2  mb-3"
                onClick={() => setOpenModal(true)}
              >
                <span className="flex justify-between items-center ">
                  <AiOutlinePlus style={{ marginRight: "0.5em" }} />
                  {t("btn_add_template")}
                </span>
              </button>
            </div>
            <TemplatesListComp />
          </div>

          {openModal && (
            <AddTemplateModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              modal="modal"
            />
          )}
        </div>
      </div>
    </>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default TemplatesList;
