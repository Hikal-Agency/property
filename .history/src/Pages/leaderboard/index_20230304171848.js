import React from "react";
import { useLayoutEffect, useState, useRef } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Footer from "../../Components/Footer/Footer";
// import UserImage from "../../public/favicon.png";
import { useStateContext } from "../../context/ContextProvider";

const Leaderboard = () => {
  const { currentMode } = useStateContext();

  //   const ref = useRef(null);
  //   const [width, setWidth] = useState(0);
  //   const [height, setHeight] = useState(0);

  //   useLayoutEffect(() => {
  //     setWidth(ref.current.offsetWidth);
  //     setHeight(ref.current.offsetHeight);
  //   }, []);

  //   const progress = (150000 / 3000000) * 100;
  //   const absoluteprogress = progress.toFixed(0);

  const Manager = [
    {
      name: "Belal Hikal",
      target: "5000000",
      achieved: "5000000",
      teamDeals: "3",
      directDeals: "2",
    },
    {
      name: "Hossam Hassan",
      target: "5000000",
      achieved: "3000000",
      teamDeals: "0",
      directDeals: "1",
    },
    {
      name: "Nada Amin",
      target: "5000000",
      achieved: "2900000",
      teamDeals: "1",
      directDeals: "2",
    },
  ];

  const Agent = [
    {
      name: "Hassan Lodhi",
      target: "3000000",
      achieved: "3000000",
      totalClosed: "2",
    },
    {
      name: "Abdulrhman Makkawi",
      target: "3000000",
      achieved: "2567000",
      totalClosed: "5",
    },
    {
      name: "Ameer Ali",
      target: "3000000",
      achieved: "2500000",
      totalClosed: "2",
    },
    {
      name: "Hala Hikal",
      target: "3000000",
      achieved: "2000000",
      totalClosed: "2",
    },
    {
      name: "Zainab Ezzaldien",
      target: "3000000",
      achieved: "1900000",
      totalClosed: "1",
    },
  ];

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
                    currentMode === "dark" ? "text-white" : "text-black"
                  } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
                >
                  Leaderboard
                  {/* <span className="px-5 py-3 rounded-md">Leaderboard</span> */}
                  {/* <span className="px-5 py-3 rounded-md">Call Log Board</span> */}
                </h1>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-5 gap-y-5 pb-3"> */}
                <div
                  className={`${
                    currentMode === "dark" ? "text-white" : "text-black"
                  } p-3 rounded-md`}
                >
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "text-red-600"
                        : "text-main-red-color"
                    } text-xl font-bold`}
                  >
                    Sales Manager
                  </div>
                  <div>
                    {Manager.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-x-5 rounded-md my-3 content-center align-center items-center"
                        >
                          <div className="col-span-2">
                            <h4 className="font-semibold my-1">{item.name}</h4>
                          </div>
                          <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                            {item.achieved >= item.target ? (
                              <span
                                className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                              >
                                Team deals: {item.teamDeals} / Direct deals:{" "}
                                {item.directDeals}
                              </span>
                            ) : item.achieved < item.target ? (
                              <div
                                className={`w-[${
                                  (item.achieved / item.target) * 100
                                }%] bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                              >
                                Team deals: {item.teamDeals} / Direct deals:{" "}
                                {item.directDeals}
                              </div>
                            ) : (
                              <></>
                            )}
                            {/* <Image
                              src={UserImage}
                              height={50}
                              width={50}
                              className="rounded-full cursor-pointer"
                              alt=""
                            /> */}
                          </div>
                          <div></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  className={`${
                    currentMode === "dark" ? "text-white" : "text-black"
                  } p-3 rounded-md`}
                >
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "text-red-600"
                        : "text-main-red-color"
                    } text-xl font-bold`}
                  >
                    Sales Agent
                  </div>
                  <div>
                    {Agent.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-x-5 rounded-md my-3 content-center align-center items-center"
                        >
                          <div className="col-span-2">
                            <h4 className="font-semibold my-1">{item.name}</h4>
                          </div>
                          <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                            {item.achieved >= item.target ? (
                              <span
                                className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                              >
                                Closed deals: {item.totalClosed}
                              </span>
                            ) : item.achieved < item.target ? (
                              <div
                                className={`w-[${
                                  (item.achieved / item.target) * 100
                                }%] bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5`}
                              >
                                Closed deals: {item.totalClosed}
                              </div>
                            ) : (
                              <></>
                            )}
                            <Image
                              src={UserImage}
                              height={50}
                              width={50}
                              className="rounded-full cursor-pointer"
                              alt=""
                            />
                          </div>
                          <div></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
