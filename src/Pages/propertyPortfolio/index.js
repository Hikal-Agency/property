import React, { useEffect } from "react";

import axios from "../../axoisConfig";
import { Button } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { Md360 } from "react-icons/md";
import { BiCheckboxChecked, BiCheckboxMinus } from "react-icons/bi";
import { toast } from "react-toastify";

const PropertyPortfolio = () => {
  const { currentMode, DevProData, setDevProData, BACKEND_URL, t } =
    useStateContext();
  const navigate = useNavigate();

  const FetchProperty = async (token) => {
    await axios
      .get(`${BACKEND_URL}/dev-projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setDevProData(result.data);
      })
      .catch((err) => {


        toast.error("Something went wrong kindly force refresh the page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchProperty(token);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      
      <div className="min-h-screen">
        <div
          className={`w-full  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="pl-3">
            <h1
              className={`font-semibold pt-5 pb-3 ${
                currentMode === "dark" ? "text-white" : "text-primary"
              } text-lg ml-2 auto-cols-max gap-x-3`}
            >
              {t("menu_property_portfolio")}
            </h1>

            <div className="space-y-3">
              {/* {DevProData.length > 0 ? ( */}
              {DevProData?.map(
                (developer) => {
                  return (
                    <>
                      <div
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-black"
                        } w-full p-3 rounded-md space-y-3`}
                      >
                        <div className="font-semibold text-md">
                          <p className="text-lg">{developer.developer}</p>
                        </div>
                        {developer?.projects.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                            {developer?.projects.map((project) => {
                              return (
                                <div
                                  className={`${
                                    currentMode === "dark"
                                      ? "bg-[#1c1c1c]"
                                      : "bg-gray-200"
                                  } w-full h-full p-3 rounded-md space-y-1`}
                                >
                                  <div className="text-primary font-semibold text-center">
                                    {project.project}
                                  </div>
                                  <hr className="h-0.5"></hr>
                                  {project.projectStatus === "Available" ? (
                                    <div className="flex items-center justify-center gap-3 bg-[#0f9a56] text-white text-sm rounded-sm">
                                      <p>{t("project_available")}</p>
                                    </div>
                                  ) : project.projectStatus === "Sold Out" ? (
                                    <div className="flex items-center justify-center gap-3 bg-[#da1f26] text-white text-sm rounded-sm">
                                      <p>{t("project_soldout")}</p>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center gap-3 bg-[#ff6c37] text-white text-sm rounded-sm">
                                      <p>{t("project_unknown")}</p>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3">
                                    {project.studio === 1 ? (
                                      <BiCheckboxChecked
                                        size={"30px"}
                                        className="text-[#0f9a56]"
                                      />
                                    ) : (
                                      <BiCheckboxMinus
                                        size={"30px"}
                                        className="text-primary"
                                      />
                                    )}
                                    <p>{t("enquiry_studio")}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {project.onebed === 1 ? (
                                      <BiCheckboxChecked
                                        size={"30px"}
                                        className="text-[#0f9a56]"
                                      />
                                    ) : (
                                      <BiCheckboxMinus
                                        size={"30px"}
                                        className="text-primary"
                                      />
                                    )}
                                    <p>{t("enquiry_1bed")}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {project.twobed === 1 ? (
                                      <BiCheckboxChecked
                                        size={"30px"}
                                        className="text-[#0f9a56]"
                                      />
                                    ) : (
                                      <BiCheckboxMinus
                                        size={"30px"}
                                        className="text-primary"
                                      />
                                    )}
                                    <p>{t("enquiry_2bed")}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {project.threebed === 1 ? (
                                      <BiCheckboxChecked
                                        size={"30px"}
                                        className="text-[#0f9a56]"
                                      />
                                    ) : (
                                      <BiCheckboxMinus
                                        size={"30px"}
                                        className="text-primary"
                                      />
                                    )}
                                    <p>{t("enquiry_3bed")}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {project.fourbed === 1 ? (
                                      <BiCheckboxChecked
                                        size={"30px"}
                                        className="text-[#0f9a56]"
                                      />
                                    ) : (
                                      <BiCheckboxMinus
                                        size={"30px"}
                                        className="text-primary"
                                      />
                                    )}
                                    <p>{t("enquiry_4bed")}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {project.fivebed === 1 ? (
                                      <BiCheckboxChecked
                                        size={"30px"}
                                        className="text-[#0f9a56]"
                                      />
                                    ) : (
                                      <BiCheckboxMinus
                                        size={"30px"}
                                        className="text-primary"
                                      />
                                    )}
                                    <p>{t("enquiry_5bed")}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {project.sixbed === 1 ? (
                                      <BiCheckboxChecked
                                        size={"30px"}
                                        className="text-[#0f9a56]"
                                      />
                                    ) : (
                                      <BiCheckboxMinus
                                        size={"30px"}
                                        className="text-primary"
                                      />
                                    )}
                                    <p>{t("enquiry_6bed")}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {project.retail === 1 ? (
                                      <BiCheckboxChecked
                                        size={"30px"}
                                        className="text-[#0f9a56]"
                                      />
                                    ) : (
                                      <BiCheckboxMinus
                                        size={"30px"}
                                        className="text-primary"
                                      />
                                    )}
                                    <p>{t("enquiry_retail")}</p>
                                  </div>
                                  {project.tour360 === 1 ? (
                                    <div className="flex items-center justify-end gap-3 text-white text-sm">
                                      <Button
                                        type="button"
                                        onClick={() =>
                                          navigate(
                                            `/propertyPortfolio/tour360/${project.proId}`
                                          )
                                        }
                                        sx={{
                                          backgroundColor: "#8279c7",
                                          color: "#ffffff",
                                        }}
                                        className="rounded-sm p-1 gap-1 flex items-center hover:border-primary"
                                      >
                                        <Md360 size={"25px"} />
                                        <span className="text-xs">
                                          {t("360_view")}
                                        </span>
                                      </Button>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="italic text-sm text-primary">
                            {t("no_projects")}
                          </p>
                        )}
                      </div>
                      <hr></hr>
                    </>
                  );
                }
                // })
                // ) : (
                //     <p className="italic text-sm">Nothing to show</p>
              )}
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default PropertyPortfolio;
