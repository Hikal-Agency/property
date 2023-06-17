import React, { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import GoogleCalendarAppointment from "../../Components/appointments/GoogleCalendarAppointment";
import { Box } from "@mui/material";

const CreateAppointment = () => {
  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop } =
    useStateContext();
  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className={`w-full`}>
              <div className="pl-3">
                <div className="mt-3">
                  <h1
                    className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold border-red-600"
                    }`}
                  >
                    Create Appointment
                  </h1>
                    {/* <GoogleCalendarAppointment/> */}
                    <Box className="mx-auto mt-20 w-[50%] text-white text-center py-16 rounded" sx={{background:" #da1f26"}}>
                      <h1 className="mb-3" style={{fontWeight: "bold", fontSize: 36}}>Feature Coming Soon!</h1>
                      <p>Thanks for Waiting</p>
                    </Box>
                </div>
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default CreateAppointment;
