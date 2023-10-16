import React, { useEffect } from "react";

import axios from "../../axoisConfig";
import { Button } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { Md360 } from "react-icons/md";
import { BiCheckboxChecked, BiCheckboxMinus } from "react-icons/bi";
import { toast } from "react-toastify";

const PropertyPortfolio = () => {
  const { currentMode, DevProData, setDevProData, BACKEND_URL } =
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
          className={`w-full p-4  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="w-full flex items-center pb-3">
            <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
            <h1
              className={`text-lg font-semibold ${
                currentMode === "dark"
                  ? "text-white"
                  : "text-black"
              }`}
            >
              Property Portfolio
              {/* <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                {pageState?.total}
              </span> */}
            </h1>
          </div>

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
                                } w-full h-full p-3 rounded-md space-y-1 border-t-2
                                ${project.projectStatus === "Available" ? "border-t-[#4CAF50]" : project.projectStatus === "Sold Out" ? "border-t-[#DC2626]" : "border-t-[#edb92b]"}
                                `}
                              >
                                <div className="uppercase font-semibold text-center mb-5">
                                  {project.project}
                                </div>

                                <div className="flex items-center gap-3">
                                  {project.studio === 1 ? (
                                    <BiCheckboxChecked
                                      size={"30px"}
                                      className="text-[#4CAF50]"
                                    />
                                  ) : (
                                    <BiCheckboxMinus
                                      size={"30px"}
                                      className="text-[#DC2626]"
                                    />
                                  )}
                                  <p>Studio</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {project.onebed === 1 ? (
                                    <BiCheckboxChecked
                                      size={"30px"}
                                      className="text-[#4CAF50]"
                                    />
                                  ) : (
                                    <BiCheckboxMinus
                                      size={"30px"}
                                      className="text-[#DC2626]"
                                    />
                                  )}
                                  <p>1 Bedroom</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {project.twobed === 1 ? (
                                    <BiCheckboxChecked
                                      size={"30px"}
                                      className="text-[#4CAF50]"
                                    />
                                  ) : (
                                    <BiCheckboxMinus
                                      size={"30px"}
                                      className="text-[#DC2626]"
                                    />
                                  )}
                                  <p>2 Bedrooms</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {project.threebed === 1 ? (
                                    <BiCheckboxChecked
                                      size={"30px"}
                                      className="text-[#4CAF50]"
                                    />
                                  ) : (
                                    <BiCheckboxMinus
                                      size={"30px"}
                                      className="text-[#DC2626]"
                                    />
                                  )}
                                  <p>3 Bedrooms</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {project.fourbed === 1 ? (
                                    <BiCheckboxChecked
                                      size={"30px"}
                                      className="text-[#4CAF50]"
                                    />
                                  ) : (
                                    <BiCheckboxMinus
                                      size={"30px"}
                                      className="text-[#DC2626]"
                                    />
                                  )}
                                  <p>4 Bedrooms</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {project.fivebed === 1 ? (
                                    <BiCheckboxChecked
                                      size={"30px"}
                                      className="text-[#4CAF50]"
                                    />
                                  ) : (
                                    <BiCheckboxMinus
                                      size={"30px"}
                                      className="text-[#DC2626]"
                                    />
                                  )}
                                  <p>5 Bedrooms</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {project.sixbed === 1 ? (
                                    <BiCheckboxChecked
                                      size={"30px"}
                                      className="text-[#4CAF50]"
                                    />
                                  ) : (
                                    <BiCheckboxMinus
                                      size={"30px"}
                                      className="text-[#DC2626]"
                                    />
                                  )}
                                  <p>6 Bedrooms</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {project.retail === 1 ? (
                                    <BiCheckboxChecked
                                      size={"30px"}
                                      className="text-[#4CAF50]"
                                    />
                                  ) : (
                                    <BiCheckboxMinus
                                      size={"30px"}
                                      className="text-[#DC2626]"
                                    />
                                  )}
                                  <p>Retail</p>
                                </div>
                                {project.tour360 === 1 ? (
                                  <div className="flex items-center justify-end gap-3 text-white text-sm">
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/propertyPortfolio/tour360/${project.proId}`
                                        )
                                      }
                                      className="bg-primary text-white rounded-md gap-2 px-3 py-2 flex items-center"
                                    >
                                      <Md360 size={"16"} />
                                      <span className="uppercase font-semibold">
                                        360 View
                                      </span>
                                    </button>
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
                          No projects to show
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
    </>
  );
};

export default PropertyPortfolio;
