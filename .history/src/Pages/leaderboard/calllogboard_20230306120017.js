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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-3 pb-3">
            {calldata.map((call, index) => {
                return (
                    <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} p-3 rounded-md`}>
                        <div className="grid grid-cols-6 gap-3 rounded-md">
                            <div className="col-span-2">
                                <img
                                src="/favicon.png"
                                height="full"
                                width="full"
                                className="rounded-xs cursor-pointer"
                                alt=""
                                />
                            </div>
                            <div className="col-span-4 px-2">
                                <h4 className="font-bold text-lg my-2 text-main-red-color">{call.userName}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                                    <div>
                                        
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
