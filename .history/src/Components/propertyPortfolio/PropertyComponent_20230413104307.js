// import Image from "next/image";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
// import UserImage from "../../public/favicon.png";
import { useStateContext } from "../../context/ContextProvider";

const PropertyComponent = ({ dev_pro }) => {
  const { currentMode } = useStateContext();

//   const position = [51.505, -0.09];

    useEffect(() => {
        console.log("dev pro are");
        console.log(dev_pro);
    }, []);

  return (
    <>
        <div className="mt-5 md:mt-2">
            <h1
            className={`font-semibold ${
                currentMode === "dark" ? "text-white" : "text-red-600"
            } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
            >
                Property Portfolio
            </h1>

            <div className="space-y-3">
                {dev_pro.length > 0 ? (
                    dev_pro.map((developer) => {
                        return (
                            <>
                                <div className={`${currentMode === "dark" ? "text-white" : "text-black"} w-full p-3 rounded-md space-y-3`}>
                                    <div className="font-semibold text-md">
                                        <p className="text-lg">{developer.developer}</p>
                                    </div>
                                    {developer.projects.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                                            {developer.projects.map((project) => {
                                                return (
                                                    <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} w-full h-full p-3 rounded-md space-y-1`}>
                                                        <div className="text-main-red-color font-semibold text-center">{project.project}</div>
                                                        <hr className="h-0.5"></hr>
                                                        {project.projectStatus === "Available" ? (
                                                            <div className="flex items-center justify-center gap-3 bg-[#0f9a56] text-white text-sm rounded-sm">
                                                                <p>Available</p>
                                                            </div>
                                                        ) : project.projectStatus === "Sold Out" ? (
                                                            <div className="flex items-center justify-center gap-3 bg-[#da1f26] text-white text-sm rounded-sm">
                                                                <p>Sold Out</p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-3 bg-[#ff6c37] text-white text-sm rounded-sm">
                                                                <p>Unknown</p>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-3">
                                                            {project.studio === 1 ? (
                                                                <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                            ) : (
                                                                <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                            )}
                                                            <p>Studio</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {project.onebed === 1 ? (
                                                                <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                            ) : (
                                                                <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                            )}
                                                            <p>1 Bedroom</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {project.twobed === 1 ? (
                                                                <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                            ) : (
                                                                <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                            )}
                                                            <p>2 Bedrooms</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {project.threebed === 1 ? (
                                                                <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                            ) : (
                                                                <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                            )}
                                                            <p>3 Bedrooms</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {project.fourbed === 1 ? (
                                                                <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                            ) : (
                                                                <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                            )}
                                                            <p>4 Bedrooms</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {project.fivebed === 1 ? (
                                                                <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                            ) : (
                                                                <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                            )}
                                                            <p>5 Bedrooms</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {project.sixbed === 1 ? (
                                                                <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                            ) : (
                                                                <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                            )}
                                                            <p>6 Bedrooms</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {project.retail === 1 ? (
                                                                <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                            ) : (
                                                                <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                            )}
                                                            <p>Retail</p>
                                                        </div>
                                                        {project.tour360 === 1 ? (
                                                            <div className="flex items-center justify-end gap-3 text-white text-sm">
                                                                <Button 
                                                                    onClick={() => navigate(`/360tours`)}
                                                                    // onClick={() => navigate(`/360tours/${project.dpid}`)}
                                                                    sx={{ backgroundColor: "#8279c7", color: "#ffffff" }} className="rounded-sm p-1 gap-1 flex items-center hover:border-main-red-color">
                                                                    <Md360 size={"25px"} />
                                                                    <span className="text-xs">360 View</span>
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                            {/* <div>{developer.projects[developer.projects.length - 1]}</div>
                                            <div>{developer.projects[developer.projects.length - 2]}</div> */}
                                        </div>
                                    ) : (
                                        <p className="italic text-sm text-main-red-color">No projects to show</p>
                                    )}
                                </div>
                                <hr></hr>
                            </>
                        )
                    })
                ) : (
                    <p className="italic text-sm">Nothing to show</p>
                )}
            </div>
        </div>
    </>
  );
};

export default PropertyComponent;
