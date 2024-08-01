import React, { useState, useCallback } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import DragItem from "./DragItem.js";
import { Button } from "@material-tailwind/react";
import { MdOutlineClose } from "react-icons/md";
import { useDrop } from "react-dnd";
import { IoCloseSharp } from "react-icons/io5";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlinePercentage } from "react-icons/ai";
import { TiArrowLeft } from "react-icons/ti";
import EditorComonents from "./FormEditorComponents/EditorComponents";
import { CiText, CiSignpostDuo1 } from "react-icons/ci";
import { BiRename } from "react-icons/bi";
import { BsCalendar2Date } from "react-icons/bs";
import { LiaPhoneSquareSolid } from "react-icons/lia";
import { MdOutlineMailOutline } from "react-icons/md";
import { RxButton } from "react-icons/rx";
import { FaRegAddressCard, FaWpforms } from "react-icons/fa6";
import { PiCityLight } from "react-icons/pi";
import { MdAccountBalance } from "react-icons/md";
import { GrGlobe, GrResources } from "react-icons/gr";
import { CgWebsite } from "react-icons/cg";
import { GoOrganization } from "react-icons/go";
import { IoCodeSlash, IoImageOutline } from "react-icons/io5";
import captchaIcon from "./FormEditorComponents/assets/captcha.png";
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
} from "./FormEditorComponents/QuickAddComponents.js";
const MainFormEditor = ({ droppedComponents, setDroppedComponents }) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    t,
    isLangRTL,
    i18n,
    themeBgImg,
  } = useStateContext();
  const [components, setComponents] = useState({
    // category:"Personal Info",
    personalComponents: [
      {
        icon: <BiRename size={22} />,
        label: t("form_developer_fullName"),
        id: 1,
      },
      {
        icon: <BiRename size={22} />,
        label: t("first_name"),
        id: 2,
      },
      {
        icon: <BiRename size={22} />,
        label: t("last_name"),
        id: 3,
      },
      {
        icon: <BsCalendar2Date size={20} />,
        label: t("label_dob"),
        id: 4,
      },
    ],
    contactComponents: [
      {
        icon: <LiaPhoneSquareSolid size={16} />,
        label: t("label_phone"),
        id: 5,
      },
      {
        icon: <MdOutlineMailOutline size={16} />,
        label: t("support_via_email"),
        id: 6,
      },
    ],
    submitComponents: [
      {
        icon: <RxButton size={16} />,
        label: t("btn"),
        id: 7,
      },
    ],
    addressComponents: [
      {
        icon: <FaRegAddressCard size={16} />,
        label: t("form_developer_address"),
        id: 8,
      },
      {
        icon: <PiCityLight size={16} />,
        label: t("label_city"),
        id: 9,
      },
      {
        icon: <MdAccountBalance size={16} />,
        label: t("state"),
        id: 10,
      },
      {
        icon: <GrGlobe size={16} />,
        label: t("label_country"),
        id: 11,
      },
      {
        icon: <CiSignpostDuo1 size={16} />,
        label: t("postal_code"),
        id: 12,
      },
      {
        icon: <CgWebsite size={16} />,
        label: t("source_website"),
        id: 13,
      },
      {
        icon: <GoOrganization size={16} />,
        label: t("org"),
        id: 14,
      },
    ],
    customizedComponents: [
      {
        icon: <CiText size={16} />,
        label: t("text"),
        id: 15,
      },
      {
        icon: <IoCodeSlash size={16} />,
        label: "Html",
        id: 16,
      },
      {
        icon: <IoImageOutline size={16} />,
        label: t("image"),
        id: 17,
      },
      {
        icon: <img src={captchaIcon} width={16} />,
        label: "Captcha",
        id: 18,
      },
      {
        icon: <GrResources size={16} />,
        label: t("ticket_filter_source"),
        id: 19,
      },
      {
        icon: <FaWpforms size={16} />,
        label: "T & C",
        id: 20,
      },
    ],
  });
  const [actualComponents, setActualComponent] = useState([
    {
      id: 1,
      component: FullName,
      label: t("form_developer_fullName"),
      placeholder: t("form_developer_fullName"),
      queryKey: "full_name",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 2,
      component: FirstName,
      label: t("first_name"),
      placeholder: t("first_name"),
      queryKey: "first_name",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 3,
      component: LastName,
      label: t("last_name"),
      placeholder: t("last_name"),
      queryKey: "last_name",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 4,
      component: DateOfBirth,
      label: t("label_dob"),
      placeholder: t("label_dob"),
      queryKey: "date_of_birth",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 5,
      component: Phone,
      label: t("label_phone"),
      placeholder: t("label_phone"),
      queryKey: "phone",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 6,
      component: Email,
      label: t("support_via_email"),
      placeholder: t("support_via_email"),
      queryKey: "email",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 7,
      component: ButtonComp,
      label: t("btn_submit"),
      queryKey: "",
      width: "100",
      url: "",
      type: "button",
      required: false,
    },
    {
      id: 8,
      component: Address,
      label: t("form_developer_address"),
      placeholder: t("form_developer_address"),
      queryKey: "address",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 9,
      component: City,
      label: t("label_city"),
      placeholder: t("label_city"),
      queryKey: "city",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 10,
      component: State,
      label: t("state"),
      placeholder: t("state"),
      queryKey: "state",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 11,
      component: Country,
      label: t("label_country"),
      placeholder: t("label_country"),
      queryKey: "country",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 12,
      component: PostalCode,
      label: t("postal_code"),
      placeholder: t("postal_code"),
      queryKey: "postal_code",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 13,
      component: Website,
      label: t("source_website"),
      placeholder: t("source_website"),
      queryKey: "website",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 14,
      component: Organization,
      label: t("org"),
      placeholder: t("org"),
      queryKey: "organization",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 15,
      component: Text,
      width: "100",
      text: "text",
      type: "text",
      label: "",
    },
    {
      id: 16,
      component: HTMLBlock,
      width: "100",
      text: "text",
      type: "html",
      html: "",
    },
    {
      id: 17,
      component: Image,
      label: t("button_upload_image"),
      width: "100",
      text: "text",
      type: "upload",
      queryKey: "upload",
    },
    {
      id: 18,
      component: Captcha,
      width: "100",
      text: "text",
      type: "captcha",
    },
    {
      id: 19,
      component: Source,
      label: t("ticket_filter_source"),
      placeholder: t("ticket_filter_source"),
      queryKey: "source",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
    {
      id: 20,
      component: TandC,
      label: "TandC",
      placeholder: "TandC",
      queryKey: "tandc",
      width: "100",
      shortLabel: "",
      required: false,
      type: "field",
    },
  ]);
  const [selectedComponent, setSelectedComponent] = useState(-1);
  const [isExpandedComponents, setIsExpandedComponents] = useState(false);
  const [isExpandedFieldControls, setIsExpandedFieldControls] = useState(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: (item) => handleDragEnd(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  console.log("dropped components", droppedComponents);

  function handleDragEnd(id) {
    const droppedComponent = actualComponents?.filter((component) => {
      return component.id == id;
    });
    console.log(id, "id");

    if (droppedComponent.length > 0) {
      setDroppedComponents((pre) => {
        return [...pre, droppedComponent[0]];
      });
    }
  }
  const handleDroppedComponentClick = (id) => {
    setSelectedComponent(id);
  };
  const removeDroppedComponent = (id) => {
    setDroppedComponents((pre) => pre.filter((comp, index) => index != id));
    setSelectedComponent((pre) => -1);
  };
  console.log(selectedComponent, "selectedComponent");
  const elementParamsChangeHandler = (value, name) => {
    setDroppedComponents((pre) => {
      const updatedComponents = [...pre];
      updatedComponents[selectedComponent] = {
        ...updatedComponents[selectedComponent],
        [name]: value,
      };
      return updatedComponents;
    });
  };

  // console.log(droppedComponents, "droppedComponents");

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = droppedComponents[dragIndex];
      const newItems = [...droppedComponents];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
      setDroppedComponents(newItems);
    },
    [droppedComponents]
  );
  return (
    <>
      <div
        className={`${
          themeBgImg
            ? currentMode === "dark"
              ? "blur-bg-dark shadow-sm text-white"
              : "blur-bg-light shadow-sm text-black"
            : currentMode === "dark"
            ? "bg-dark-neu text-white"
            : "bg-light-neu text-black"
        } flex-1 flex justify-end md:justify-center w-full md:py-9 pt-1 px-8 gap-10 relative`}
      >
        {/* {isExpandedComponents ? */}
        {/* ( */}
        <Box
          sx={{
            boxShadow: 2,
            width: isExpandedComponents ? "270px" : "0px",
            backgroundColor: "white",
            borderRadius: "5px",
            height: "80vh",
            overflow: "auto",
            position: "absolute",
            left: isLangRTL(i18n.language) ? "auto" : "0px",
            right: isLangRTL(i18n?.language) ? "0px" : "auto",
            zIndex: 50,
            transition: "all 0.5s ease-in-out",
          }}
        >
          <EditorComonents
            components={components}
            setIsExpandedComponents={setIsExpandedComponents}
          />
        </Box>
        {/* ) : ( */}
        <button
          className={`bg-primary h-fit w-fit text-white p-4  absolute ${
            isLangRTL(i18n?.language)
              ? "right-0 rounded-l-2xl"
              : "left-0 rounded-r-2xl"
          } `}
          onClick={() => setIsExpandedComponents(true)}
        >
          {t("btn_add")} {t("btn_field")}
        </button>
        {/* )} */}
        <Box
          sx={{
            boxShadow: 2,
            width: {
              xs: "100%",
              sm: "90%",
              md: "45%",
            },
            backgroundColor: "white",
            borderRadius: "5px",
            color: isOver ? "green" : undefined,
            margin: {
              md: "0px",
              xs: "36px 0px",
            },
          }}
          ref={drop}
          onClick={(e) => {
            e.currentTarget == e.target && setSelectedComponent(-1);
          }}
        >
          <div
            className={`${
              themeBgImg
                ? currentMode === "dark"
                  ? "blur-bg-dark shadow-sm text-white"
                  : ""
                : currentMode === "dark"
                ? "bg-dark-neu text-white"
                : ""
            } !rounded-none p-10 h-full`}
          >
            {droppedComponents.map((comp, index) => {
              const Component = comp?.component;
              return (
                <DragItem index={index} moveItem={moveItem}>
                  <div
                    key={index}
                    className={`w-full h-full relative inline-block cursor-pointer mb-5 ${
                      currentMode == "dark"
                        ? "text-white bg-transparent"
                        : "text-black bg-transparent"
                    } ${
                      selectedComponent == index
                        ? "border-[2px] border-yellow-500 p-4"
                        : ""
                    }`}
                    onClick={(e) => handleDroppedComponentClick(index)}
                  >
                    {selectedComponent == index && (
                      <div
                        className={`flex justify-end absolute top-[-13px] right-[-13px] `}
                      >
                        <div
                          className={`p-2 rounded-full  ${
                            currentMode == "dark"
                              ? "text-whtie bg-black"
                              : "text-black bg-gray-100"
                          }`}
                          onClick={(event) => {
                            removeDroppedComponent(index);
                            event.stopPropagation();
                          }}
                        >
                          <IoCloseSharp size={20} id="closecomp" />
                        </div>
                      </div>
                    )}
                    <Component
                      label={comp?.label}
                      shortLabel={comp?.shortLabel}
                      placeholder={comp?.placeholder}
                      queryKey={comp?.queryKey}
                      width={comp?.width}
                      url={comp?.url}
                      required={comp?.required}
                      text={comp?.text}
                      float={comp?.float}
                      isDevelopment={true}
                      value={comp.hidden && comp.value}
                      onChange={(query, value) => {
                        if (comp.hidden) {
                          elementParamsChangeHandler(value, "value");
                        }
                      }}
                      onHTMLChange={(html) =>
                        elementParamsChangeHandler(html, "html")
                      }
                      htmlContent={comp?.html}
                    />
                  </div>
                </DragItem>
              );
            })}
          </div>
        </Box>

        <Box
          sx={{
            boxShadow: 2,
            // width: "25%",
            backgroundColor: "white",
            borderRadius: "5px",
            overflow: "auto",
            position: "absolute",
            left: !isLangRTL(i18n.language) ? "auto" : "0px",
            right: !isLangRTL(i18n?.language) ? "0px" : "auto",
            width: isExpandedFieldControls ? "270px" : "0px",
            zIndex: 50,
            transition: "all 0.5s ease-in-out",
            height: "80vh",
          }}
        >
          <div
            className={`${
              themeBgImg
                ? currentMode === "dark"
                  ? "blur-bg-dark shadow-sm text-white"
                  : ""
                : currentMode === "dark"
                ? "bg-dark-neu text-white"
                : ""
            } h-full w-full`}
          >
            <button aria-label="close components">
              <MdOutlineClose
                size={22}
                className="text-gray-600"
                onClick={() => setIsExpandedFieldControls(false)}
              />
            </button>
            {selectedComponent != -1 &&
              droppedComponents[selectedComponent]?.type != "html" && (
                <div className="p-2 ">
                  <div className="flex flex-col gap-4">
                    {/* <TiArrowLeft size={16} /> */}

                    {droppedComponents[selectedComponent]?.type == "text" && (
                      <div className="flex flex-col gap-3">
                        <label htmlFor="" className="text-[12px] font-medium">
                          {t("text")}
                        </label>
                        <input
                          type="text"
                          name=""
                          placeholder="Enter text here"
                          id=""
                          value={droppedComponents[selectedComponent]?.text}
                          onChange={(e) =>
                            elementParamsChangeHandler(e?.target?.value, "text")
                          }
                          className="focus:outline-none border w-full text-[12px] p-3 rounded-lg bg-transparent"
                        />
                      </div>
                    )}

                    <h3 className="text-center text-[14px]">
                      {droppedComponents[selectedComponent]?.label}
                    </h3>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="" className="text-[12px] font-medium">
                        {t("label")}
                      </label>
                      <input
                        type="text"
                        name=""
                        placeholder="Enter label for input"
                        id=""
                        value={droppedComponents[selectedComponent]?.label}
                        onChange={(e) => {
                          elementParamsChangeHandler(e?.target?.value, "label");
                          console.log(droppedComponents, "droppedComponents");
                        }}
                        className="focus:outline-none border w-full text-[12px] p-3 rounded-lg bg-transparent"
                      />
                    </div>
                    {droppedComponents[selectedComponent]?.type == "field" && (
                      <>
                        <div className="flex flex-col gap-3">
                          <label htmlFor="" className="text-[12px] font-medium">
                            {t("placeholder")}
                          </label>
                          <input
                            type="text"
                            name=""
                            placeholder="Enter placeholder for input field"
                            value={
                              droppedComponents[selectedComponent]?.placeholder
                            }
                            onChange={(e) =>
                              elementParamsChangeHandler(
                                e?.target?.value,
                                "placeholder"
                              )
                            }
                            id=""
                            className="focus:outline-none border w-full text-[12px] p-3 rounded-lg bg-transparent"
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <label htmlFor="" className="text-[12px] font-medium">
                            {t("short")} {t("label")}
                          </label>
                          <input
                            type="text"
                            name=""
                            placeholder={t("please_input")}
                            id=""
                            className="focus:outline-none border w-full text-[12px] p-3 rounded-lg bg-transparent"
                            value={
                              droppedComponents[selectedComponent]?.shortLabel
                            }
                            onChange={(e) =>
                              elementParamsChangeHandler(
                                e?.target?.value,
                                "shortLabel"
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <label htmlFor="" className="text-[12px] font-medium">
                            {t("query_key")}
                          </label>
                          <input
                            type="text"
                            name=""
                            placeholder={t("please_input")}
                            id=""
                            value={
                              droppedComponents[selectedComponent]?.queryKey
                            }
                            onChange={(e) =>
                              elementParamsChangeHandler(
                                e?.target?.value,
                                "queryKey"
                              )
                            }
                            // disabled={
                            //   droppedComponents[selectedComponent]?.queryKey ==
                            //   "upload"
                            // }
                            disabled={true}
                            className="focus:outline-none border w-full text-[12px] p-3 rounded-lg bg-transparent"
                          />
                        </div>
                      </>
                    )}

                    <div className="flex flex-col gap-3">
                      <label htmlFor="" className="text-[12px] font-medium">
                        {t("field_width")}
                      </label>
                      <div className="flex border rounded-lg">
                        <input
                          type="number"
                          name=""
                          placeholder="Please Input"
                          id=""
                          value={droppedComponents[selectedComponent]?.width}
                          onChange={(e) =>
                            elementParamsChangeHandler(
                              e?.target?.value,
                              "width"
                            )
                          }
                          className="focus:outline-none  w-full text-[12px] p-3 bg-transparent"
                        />
                        <div
                          className={`${
                            currentMode == "dark" ? "bg-black" : "bg-gray-100"
                          }  border-l flex items-center justify-center p-2`}
                        >
                          <AiOutlinePercentage size={16} />
                        </div>
                      </div>
                    </div>
                    {/* {droppedComponents[selectedComponent]?.type == "button" && (
                  <div className="flex flex-col gap-3">
                    <label htmlFor="" className="text-[12px] font-medium">
                      Url
                    </label>
                    <input
                      type="text"
                      name=""
                      placeholder="Please Input Url"
                      id=""
                      value={droppedComponents[selectedComponent]?.url}
                      onChange={(e) =>
                        elementParamsChangeHandler(e?.target?.value, "url")
                      }
                      className="focus:outline-none border w-full text-[12px] p-3 rounded-lg"
                    />
                  </div>
                )} */}
                    {/* {
                  <div className="flex flex-col gap-3">
                    <label htmlFor="" className="text-[12px] font-medium">
                      Float
                    </label>
                    <div className="flex border rounded-lg">
                      <select
                        name=""
                        id=""
                        onChange={(e) => {
                          elementParamsChangeHandler(e?.target?.value, "float");
                        }}
                      >
                        <option value="right">Right</option>
                        <option value="left">Left</option>
                      </select>
                    </div>
                  </div>
                } */}
                    {(droppedComponents[selectedComponent]?.type == "field" ||
                      droppedComponents[selectedComponent]?.type ==
                        "upload") && (
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            className="bg-transparent"
                            checked={
                              droppedComponents[selectedComponent]?.required
                            }
                            onChange={(e) => {
                              elementParamsChangeHandler(
                                e?.target?.checked,
                                "required"
                              );
                            }}
                          />{" "}
                          <label htmlFor="">{t("required")}</label>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="bg-transparent"
                          checked={droppedComponents[selectedComponent]?.hidden}
                          onChange={(e) => {
                            elementParamsChangeHandler(
                              e?.target?.checked,
                              "hidden"
                            );
                          }}
                        />{" "}
                        <label htmlFor="">{t("hidden")}</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </Box>
        <button
          className={`bg-primary h-fit w-fit text-white p-4 absolute ${
            !isLangRTL(i18n?.language)
              ? "right-0 rounded-l-2xl"
              : "left-0 rounded-r-2xl"
          } `}
          onClick={() => setIsExpandedFieldControls(true)}
        >
          {t("btn_field")} {t("landing_page_settings")}
        </button>
      </div>
    </>
  );
};

export default MainFormEditor;
