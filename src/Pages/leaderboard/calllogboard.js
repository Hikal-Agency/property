import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const CallLogBoard = ({
    tabValue,
    setTabValue,
    isLoading,
}) => {
  const { currentMode, darkModeColors } = useStateContext();

  const handleChange = (event, newValue) => {
      setTabValue(newValue);
  };

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
        <div>
            <Box sx={darkModeColors} className="font-semibold">
                <Tabs value={tabValue} onChange={handleChange} variant="standard">
                    <Tab label="TODAY" />
                    <Tab label="YESTERDAY" />
                    <Tab label="THIS MONTH" />
                    <Tab label="LAST MONTH" />
                </Tabs>
            </Box>
            <Box
            className="mt-1 p-5"
            sx={
                isLoading && {
                opacity: 0.3,
                }
            }
            >
                {/* TODAY */}
                <TabPanel value={tabValue} index={0}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 gap-y-3 pb-3">
                        {calldata.map((call, index) => {
                            return (
                                <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} p-3 rounded-md`}>
                                    <div className="grid grid-cols-6 gap-3 rounded-md px-2 mb-2">
                                        <h5 className="font-bold text-main-red-color col-span-5">{call.userName}</h5>     
                                    </div>
                                    <div className="grid gap-3">
                                        <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md p-2`}>
                                            <h6 className="text-center text-xs font-semibold">Outgoing</h6>
                                            <hr></hr>
                                            <div className="block gap-3 mt-2">
                                                <div>
                                                    <h1 className="text-sm">ANSWERED&nbsp;<span className="font-semibold text-main-red-color float-right">{call.out_answered_calls}</span></h1>
                                                </div>
                                                <div>
                                                    <h1 className="text-sm">NOT ANSWERED&nbsp;<span className="font-semibold text-main-red-color float-right">{call.out_notanswered_calls}</span></h1>
                                                </div>
                                                <div>
                                                    <h1 className="text-sm">REJECTED&nbsp;<span className="font-semibold text-main-red-color float-right">{call.out_rejected_calls}</span></h1>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md p-2`}>
                                            <h6 className="text-center text-xs font-semibold">Incoming</h6>
                                            <hr></hr>
                                            <div className="block gap-3 mt-2">                                                
                                                <div>
                                                    <h1 className="text-sm">RECEIVED&nbsp;<span className="font-semibold text-main-red-color float-right">{call.in_answered_calls}</span></h1>
                                                </div>
                                                <div>
                                                    <h1 className="text-sm">MISSED&nbsp;<span className="font-semibold text-main-red-color float-right">{call.in_missed_calls}</span></h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </TabPanel>

                {/* YESTERDAY  */}
                <TabPanel value={tabValue} index={1}>
        
                </TabPanel>

                {/* THIS MONTH  */}
                <TabPanel value={tabValue} index={2}>
            
                </TabPanel>

                {/* LAST MONTH  */}
                <TabPanel value={tabValue} index={3}>
            
                </TabPanel>
            </Box>
        </div>
    );

    function TabPanel(props) {
        const { children, value, index } = props;
        return <div>{value === index && <div>{children}</div>}</div>;
    }
};

export default CallLogBoard;
