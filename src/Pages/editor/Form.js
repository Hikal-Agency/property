import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Backdrop,
  Modal,
  // Select,
} from "@mui/material";
// import axios from "../../axoisConfig.js";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
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
  RadioBtn,
} from "../../Components/editorComp/FormEditorComponents/QuickAddComponents.js/index.js";
import Loader from "../../Components/Loader";

const components = [
  {
    id: 1,
    component: FullName,
  },
  {
    id: 2,
    component: FirstName,
  },
  {
    id: 3,
    component: LastName,
  },
  {
    id: 4,
    component: DateOfBirth,
  },
  {
    id: 5,
    component: Phone,
  },
  {
    id: 6,
    component: Email,
  },
  {
    id: 7,
    component: ButtonComp,
  },
  {
    id: 8,
    component: Address,
  },
  {
    id: 9,
    component: City,
  },
  {
    id: 10,
    component: State,
  },
  {
    id: 11,
    component: Country,
  },
  {
    id: 12,
    component: PostalCode,
  },
  {
    id: 13,
    component: Website,
  },
  {
    id: 14,
    component: Organization,
  },
  {
    id: 15,
    component: Text,
  },
  {
    id: 16,
    component: HTMLBlock,
  },
  {
    id: 17,
    component: Image,
  },
  {
    id: 18,
    component: Captcha,
  },
  {
    id: 19,
    component: Source,
  },
  {
    id: 20,
    component: TandC,
  },
  {
    id: 21,
    component: RadioBtn,
  },
];
const Form = () => {
  const { formID, formMethod } = useParams();
  const [form, setForm] = useState({});
  const { BACKEND_URL, themeBgImg, currentMode } = useStateContext();
  const [formData, setFormData] = useState({});
  const [loading, setIsloading] = useState(false);
  const [image, setImage] = useState();

  useEffect(() => {
    const fetchForm = async () => {
      let token = localStorage?.getItem("auth-token");
      setIsloading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/forms/${formID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (res?.status) {
          setForm(res?.data?.data);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsloading(false);
      }
    };
    fetchForm();
  }, []);

  useEffect(() => {
    const hiddenFields = form?.fields?.filter((field) => {
      return field.hidden;
    });
    hiddenFields?.map((field) => {
      setFormData((pre) => ({
        ...pre,
        [field.queryKey]: field.value,
      }));
    });
  }, [form]);

  useEffect(() => {
    console.log(form, "single form");
  }, [form]);

  const submitFormHandler = async (e) => {
    e?.preventDefault();
    const captcha = formData["captcha"];
    console.log(formData, "captcha value");
    const isCaptchaInComp = form?.fields.filter((field) => {
      return field.type == "captcha";
    });

    if (isCaptchaInComp?.length > 0) {
      if (!captcha) {
        toast.error("Please verify captcha!!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return null;
      }
    }

    let subFormData = { ...formData };

    delete subFormData["captcha"];

    console.log("formData", formData);
    let token = localStorage?.getItem("auth-token");
    // const formDataArray = Object.entries(subFormData).map(([key, value]) => {
    //   return { [key]: value };
    // });
    // let payload = {
    //   form_id: formID,
    //   data: formDataArray,
    // };
    const formDataSub = new FormData();
    const jsonFormData = JSON.stringify([subFormData]);
    formDataSub?.append("form_id", formID);
    formDataSub?.append("data", jsonFormData);
    if (image) {
      formDataSub?.append("image", image);
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/form-submissions`,
        // JSON?.stringify(payload),
        formDataSub,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (res?.data?.status) {
        toast.success("Form is Successfully Submitted", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error("Can't submit Form", {
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
    } catch (error) {
      console.log("error", error);
      toast.error("Can't submit Form", {
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
  };

  const handleInputChange = (name, value) => {
    console.log(name, value);

    if (name == "upload") {
      setImage(value);
      return;
    }

    setFormData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };
  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };
  console.log(form, "data in form");
  return loading ? (
    <Loader />
  ) : formMethod == "popup" ? (
    <Modal
      keepMounted
      open={true}
      // onClose={() => setLanguageModal(false)}
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
        className={`w-[calc(100%-20px)] md:w-[30%]  ${
          // currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          currentMode === "dark"
            ? "bg-dark-neu text-white"
            : "bg-light text-black"
        } absolute top-1/2 left-1/2 p-5 rounded-md`}
      >
        <div className="w-full min-h-[100vh] flex items-center justify-center pb-8">
          <div
            className="w-[40%] h-full pt-5 "
            style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
          >
            {/* <h1 className="text-[22px] text-center text-gray-700 font-semibold mb-11">
          {form?.name}
        </h1> */}
            <div className="flex flex-col gap-4">
              <form
                onSubmit={submitFormHandler}
                className={`${
                  themeBgImg
                    ? currentMode === "dark"
                      ? "blur-bg-dark shadow-sm text-white"
                      : ""
                    : currentMode === "dark"
                    ? "bg-dark-neu text-white"
                    : ""
                } !rounded-none p-10 h-full flex flex-col gap-4`}
              >
                {form?.fields?.map((comp, index) => {
                  if (comp.hidden) {
                    return null;
                  }
                  // const Component = components[comp?.component];
                  const Component = components?.find(
                    (com) => com?.id == comp?.id
                  )?.component;
                  return (
                    <Component
                      label={comp?.label}
                      shortLabel={comp?.shortLabel}
                      placeholder={comp?.placeholder}
                      queryKey={comp?.queryKey}
                      width={comp?.width}
                      url={comp?.url}
                      required={comp?.required}
                      text={comp?.text}
                      htmlContent={comp?.html}
                      isDevelopment={false}
                      options={comp?.options}
                      onChange={
                        (comp?.type == "field" ||
                          comp?.type == "upload" ||
                          comp?.type == "captcha" ||
                          comp?.type == "radio") &&
                        handleInputChange
                      }
                    />
                  );
                })}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  ) : (
    <div className="w-full min-h-[100vh] flex items-center justify-center pb-8">
      <div
        className="w-[40%] h-full pt-5 "
        style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
      >
        {/* <h1 className="text-[22px] text-center text-gray-700 font-semibold mb-11">
          {form?.name}
        </h1> */}
        <div className="flex flex-col gap-4">
          <form
            onSubmit={submitFormHandler}
            className={`${
              themeBgImg
                ? currentMode === "dark"
                  ? "blur-bg-dark shadow-sm text-white"
                  : ""
                : currentMode === "dark"
                ? "bg-dark-neu text-white"
                : ""
            } !rounded-none p-10 h-full flex flex-col gap-4`}
          >
            {form?.fields?.map((comp, index) => {
              if (comp.hidden) {
                return null;
              }
              // const Component = components[comp?.component];
              const Component = components?.find(
                (com) => com?.id == comp?.id
              ).component;
              return (
                <Component
                  label={comp?.label}
                  shortLabel={comp?.shortLabel}
                  placeholder={comp?.placeholder}
                  queryKey={comp?.queryKey}
                  width={comp?.width}
                  url={comp?.url}
                  required={comp?.required}
                  text={comp?.text}
                  htmlContent={comp?.html}
                  isDevelopment={false}
                  options={comp?.options}
                  onChange={
                    (comp?.type == "field" ||
                      comp?.type == "upload" ||
                      comp?.type == "captcha" ||
                      comp?.type == "radio") &&
                    handleInputChange
                  }
                />
              );
            })}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
