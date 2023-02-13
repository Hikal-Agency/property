import { Button } from "@material-tailwind/react";
import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

export const GeneralInfo = ({ GeneralInfoData, User }) => {
  const [GeneralInfo, setGeneralInfo] = useState(GeneralInfoData);
  const { currentMode, darkModeColors } = useStateContext();
  // eslint-disable-next-line
  const ResetGeneralInfo = () => {
    setGeneralInfo("");
  };

  // useEffect(() => {
  //   console.log("general info data is ");
  //   console.log(GeneralInfo);
  // }, []);

  return (
    <>
      <div className="relative w-full">
        <form action="">
          <Box sx={darkModeColors} className="grid grid-cols-6 gap-x-3 gap-y-5">
            <div className="col-span-3 w-full">
              <TextField
                id="contact-number"
                type={"text"}
                label="Contact Number"
                className="w-full"
                variant="outlined"
                size="medium"
                required
                value={GeneralInfo?.userContact}
                onChange={(e) =>
                  setGeneralInfo({
                    ...GeneralInfo,
                    userContact: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-3 w-full">
              <TextField
                id="alternative-contact-number"
                type={"text"}
                label="Alternative Contact Number"
                className="w-full"
                variant="outlined"
                size="medium"
                value={GeneralInfo?.userAltContact}
                onChange={(e) =>
                  setGeneralInfo({
                    ...GeneralInfo,
                    userAltContact: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-3 w-full">
              <TextField
                id="email"
                type={"email"}
                label="Email Address"
                className="w-full"
                variant="outlined"
                size="medium"
                required
                value={GeneralInfo?.userEmail}
                onChange={(e) =>
                  setGeneralInfo({
                    ...GeneralInfo,
                    userEmail: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-3 w-full">
              <TextField
                id="alternative-email"
                type={"email"}
                label="AlternativeEmail Address"
                className="w-full"
                variant="outlined"
                size="medium"
                required
                value={GeneralInfo?.userAltEmail}
                onChange={(e) =>
                  setGeneralInfo({
                    ...GeneralInfo,
                    userAltEmail: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-3 w-full">
              <Button
                className={`min-w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                ripple={true}
                size="lg"
              >
                Update Profile
              </Button>
            </div>
            <div className="col-span-3 w-full">
              <Button
                ripple={true}
                variant="outlined"
                type="reset"
                className={`shadow-none w-full rounded-md text-sm  ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-main-red-color border-main-red-color"
                }`}
              >
                Reset
              </Button>
            </div>
          </Box>
        </form>
        <div className="flex justify-between px-10 w-full pt-10">
          <div
            className={`text-center ${
              currentMode === "dark" ? "text-gray-50" : "text-gray-600"
            }`}
          >
            <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
              <h1>Created</h1>
            </div>
            {User?.creationDate}
          </div>
          <div
            className={`text-center ${
              currentMode === "dark" ? "text-gray-50" : "text-gray-600"
            }`}
          >
            <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
              <h1>Last Updated</h1>
            </div>
            {User?.lastEdited}
          </div>
        </div>
      </div>
    </>
  );
};
