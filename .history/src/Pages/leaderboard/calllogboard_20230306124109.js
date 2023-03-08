import React from "react";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

const CallLogBoard = () => {
  const { currentMode } = useStateContext();

  const calldata = [
        {
            "userImage":"",
            "userName":"Hala Hikal",
            "outgoing_calls": 303,
            "out_answered_calls": 209,
            "out_notanswered_calls":89,
            "out_rejected_calls":5,
            "incoming_calls":35,
            "in_answered_calls":35,
            "in_missed_calls":0,
        },
        {
            "userImage":"",
            "userName":"Ameer Ali",
            "outgoing_calls": 203,
            "out_answered_calls": 109,
            "out_notanswered_calls":89,
            "out_rejected_calls":5,
            "incoming_calls":35,
            "in_answered_calls":30,
            "in_missed_calls":5,
        },
        {
            "userImage":"",
            "userName":"Hassan Lodhi",
            "outgoing_calls": 303,
            "out_answered_calls": 209,
            "out_notanswered_calls":89,
            "out_rejected_calls":5,
            "incoming_calls":35,
            "in_answered_calls":35,
            "in_missed_calls":0,
        },
        {
            "userImage":"",
            "userName":"Rahul TR",
            "outgoing_calls": 203,
            "out_answered_calls": 109,
            "out_notanswered_calls":89,
            "out_rejected_calls":5,
            "incoming_calls":35,
            "in_answered_calls":30,
            "in_missed_calls":5,
        },
    ];

  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-3 pb-3">
            {calldata.map((call, index) => {
                return (
                    <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} p-3 rounded-md`}>
                        <div className="grid grid-cols-6 gap-3 rounded-md">
                            <div className="col-span-1">
                                <img
                                src="/favicon.png"
                                height="full"
                                width="full"
                                className="rounded-xs cursor-pointer mb-2"
                                alt=""
                                />
                            </div>
                            <div className="col-span-5 px-2 mb-2">
                                <h4 className="font-bold text-lg my-2 text-main-red-color">{call.userName}</h4>     
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                            <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md p-2`}>
                                <h6 className="text-center font-semibold">Outgoing</h6>
                                <hr></hr>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 mt-2">
                                    <div>
                                        <h1 className="font-semibold text-center text-lg">{call.out_answered_calls}</h1>
                                        <h6 className="text-main-red-color text-center">ANSWERED</h6>
                                    </div>
                                    <div>
                                        <h1 className="font-semibold text-center text-lg">{call.out_notanswered_calls}</h1>
                                        <h6 className="text-main-red-color text-center">NOT ANSWERED</h6>
                                    </div>
                                    <div>
                                        <h1 className="font-semibold text-center text-lg">{call.out_rejected_calls}</h1>
                                        <h6 className="text-main-red-color text-center">REJECTED</h6>
                                    </div>
                                </div>
                            </div>
                            <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md p-2`}>
                                <h6 className="text-center font-semibold">Incoming</h6>
                                <hr></hr>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-3 mt-2">
                                    <div>
                                        <h1 className="font-semibold text-center text-lg">{call.in_answered_calls}</h1>
                                        <h6 className="text-main-red-color text-center">ANSWERED</h6>
                                    </div>
                                    <div>
                                        <h1 className="font-semibold text-center text-lg">{call.in_missed_calls}</h1>
                                        <h6 className="text-main-red-color text-center">NOT ANSWERED</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    </>
    
  );
};

export default CallLogBoard;
