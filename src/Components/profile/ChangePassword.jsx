import { useState } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { Button } from "@material-tailwind/react";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";

export const ChangePassword = () => {
  const { darkModeColors, BACKEND_URL, User, t } = useStateContext();
  const [btnloading, setbtnloading] = useState(false);
  const [SamePasswordError, setSamePasswordError] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    password: "",
    c_password: "",
    loginId: User?.loginId,
  });

  const LogoutUser = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    localStorage.removeItem("leadsData");
    localStorage.removeItem("fb_token");
    window.open("/", "_self");
  };

  const UpdatePass = async (e) => {
    e.preventDefault();
    if (passwordData.password === passwordData.c_password) {
      setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      await axios
        .post(`${BACKEND_URL}/updatePassword`, passwordData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {
          console.log(result);
          setbtnloading(false);
          toast.success("Password Updated, Login again with the new credentials!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            LogoutUser();
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          toast.error(
            err?.response?.data?.data?.old_password[0]
              ? err?.response?.data?.data?.old_password[0]
              : "Something Went Wrong! Try Again",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
          setbtnloading(false);
        });
    } else {
      setSamePasswordError(true);
    }
  };
  return (
    <>
      
      <div className="relative w-full">
        <form onSubmit={UpdatePass}>
          <Box sx={darkModeColors} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            <div className="col-span-1 md:col-span-2 lg:col-span-2 w-full">
              <TextField
                id="old-password"
                type={"password"}
                label={t("label_old_password")}
                className="w-full"
                style={{
                  marginBottom: "15px",
                }}
                variant="outlined"
                size="medium"
                required
                value={passwordData?.old_password}
                onInput={(e) =>
                  setPasswordData({
                    ...passwordData,
                    old_password: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-1 w-full">
              <TextField
                id="new-password"
                type={"password"}
                label={t("label_new_password")}
                className="w-full"
                style={{
                  marginBottom: "15px",
                }}
                variant="outlined"
                size="medium"
                value={passwordData?.password}
                onChange={(e) => {
                  setSamePasswordError(false);
                  setPasswordData({
                    ...passwordData,
                    password: e.target.value,
                  });
                }}
                required
              />
            </div>
            <div className="col-span-1 w-full">
              <TextField
                id="confirm-password"
                type={"password"}
                label={t("label_confirm_password")}
                className="w-full"
                style={{
                  marginBottom: "15px",
                }}
                variant="outlined"
                size="medium"
                required
                value={passwordData?.c_password}
                onChange={(e) => {
                  setSamePasswordError(false);
                  setPasswordData({
                    ...passwordData,
                    c_password: e.target.value,
                  });
                }}
              />
              {SamePasswordError && (
                <div className="col-span-6">
                  <p className="italic text-red-500">
                    {t("passwords_must_be_same")}
                  </p>
                </div>
              )}
            </div>
            <Button
              className={`col-span-1 md:col-span-2 lg:col-span-2 card-hover min-w-full  text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
              ripple={true}
              size="lg"
              type="submit"
              style={{
                color: "white"
              }}
              disabled={btnloading ? true : false}
            >
              {btnloading ? (
                <CircularProgress
                  sx={{ color: "white" }}
                  size={16}
                  className="text-white"
                />
              ) : (
                <span>{t("update_password")}</span>
              )}
            </Button>
          </Box>
        </form>
      </div>
    </>
  );
};
