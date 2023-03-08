import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";

const CallLogBoard = () => {
  const { currentMode } = useStateContext();

  return (
    <>
        <div className="min-h-screen">
            <div className="flex">
                <Sidebarmui />
                <div
                className={`w-full  ${
                currentMode === "dark" ? "bg-black" : "bg-white"
                }`}
                >
                    <div className="px-5">
                        <Navbar />


                        <div className="mt-5 md:mt-2">
                            <h1 
                            className={`font-semibold ${
                            currentMode === "dark" ? "text-white" : "text-red-600"
                            } text-xl ml-2 mb-3`}
                            >
                                Leaderboard
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-x-3 gap-y-3 pb-3">
                                <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} p-3 rounded-md`}>
                                    one agent
                                    <div className="grid grid-cols-6 gap-3 rounded-md p-5 my-3">
                                        <div>
                                            <Image
                                            src="/favicon.png"
                                            height="full"
                                            width="full"
                                            className="rounded-full cursor-pointer"
                                            alt=""
                                            />
                                        </div>
                                        <div className="col-span-5">
                                            <h4 className="font-bold text-lg my-1 text-main-red-color">Mohammad Alam</h4>
                                            <h4 className="my-1">Sales Agent</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>




                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    </>
    
  );
};

export default CallLogBoard;
