// import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Modal, CircularProgress,
  Button,
  TextField
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import { IoIosAlert } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "../../axoisConfig";

const DeleteUser = ({
  UserData,
  UserModelOpen,
  handleUserModelClose,
  UserStatus,
  UserName,
  fetchUser,
}) => {
  const { currentMode, BACKEND_URL, t } = useStateContext();
  const [deletebtnloading, setdeleteBtnLoading] = useState(false);
  const [randNumbers, setRandNumbers] = useState({
    firstNumber: null,
    secondNumber: null,
  });
  const [answerVal, setAnswerVal] = useState("");

  console.log("deativate user model: ", UserData);
  console.log("userStatus: ", UserStatus);

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setdeleteBtnLoading(true);

    const token = localStorage.getItem("auth-token");

    const userSTatus = UserStatus === 1 ? 2 : 1;

    axios
      .post(
        `${BACKEND_URL}/updateuser/${UserData}`,
        { status: userSTatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        console.log("res user deativated  ", result);
        setdeleteBtnLoading(false);

        handleUserModelClose(true);
        toast.success(
          `User ${
            UserStatus === 1 ? "Deativated" : "Reactivated"
          } Successfully`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );

        fetchUser(token);
      })
      .catch((err) => {
        console.log("deactivate: ", err);
        setdeleteBtnLoading(false);

        toast.error("Something Went Wrong! Please Try Again", {
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

  // const handleDeleteUser = async (e) => {
  //   e.preventDefault();
  //   setdeleteBtnLoading(true);

  //   const token = localStorage.getItem("auth-token");

  //   const userSTatus = UserStatus === 1 ? 2 : 1;

  //   // Determine the endpoint based on UserStatus
  //   const url =
  //     UserStatus === 1
  //       ? `${BACKEND_URL}/deactivate/${UserData}`
  //       : `${BACKEND_URL}/updateuser/${UserData}`;

  //   axios
  //     .post(
  //       url,
  //       { status: userSTatus },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     )
  //     .then((result) => {
  //       console.log("res user status updated  ", result);
  //       setdeleteBtnLoading(false);

  //       handleUserModelClose(true);
  //       toast.success(
  //         `User ${
  //           UserStatus === 1 ? "Deativated" : "Reactivated"
  //         } Successfully`,
  //         {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "light",
  //         }
  //       );
  //     })
  //     .catch((err) => {
  //       console.log("status update error: ", err);
  //       setdeleteBtnLoading(false);

  //       toast.error("Something Went Wrong! Please Try Again", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //     });
  // };
  useEffect(() => {
    setRandNumbers({
      firstNumber: Math.ceil(Math.random() * 10),
      secondNumber: Math.ceil(Math.random() * 10),
    });
  }, []);

  let isCaptchaVerified = false;
  if (randNumbers?.firstNumber && randNumbers?.secondNumber) {
    isCaptchaVerified =
      Number(answerVal) ===
      Number(randNumbers?.firstNumber) + Number(randNumbers?.secondNumber);
  }
  return (
    <>
      {console.log("user data is")}
      {/* {console.log(UserData)} */}
      <Modal
        keepMounted
        open={UserModelOpen}
        onClose={handleUserModelClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          style={style}
          className={`w-[calc(100%-20px)] md:w-[40%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
        >
          <div className="flex flex-col justify-center items-center">
            <IoIosAlert size={50} className="text-primary text-2xl" />
            <h1
              className={`font-semibold pt-3 text-lg ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              {`${t("do_you_really_want_to")}${
                UserStatus === 1 ? t("de_activate") : t("re_activate")
              } ${UserName}?`}
            </h1>
            <small className="text-center w-[80%] mx-auto text-gray-500">
              {t("delete_user_description", {UserName})}
            </small>

            <div className="bg-primary text-center rounded p-3 mb-3 mt-4 w-full text-white">
              <strong style={{ fontSize: 20 }}>
                {randNumbers?.firstNumber} + {randNumbers?.secondNumber} = ?
              </strong>
            </div>
            <TextField
              onInput={(e) => setAnswerVal(e.target.value)}
              value={answerVal}
              label={`${t("type_your_answer")}..`}
              type="number"
              fullWidth
            />
          </div>

          <div className="action buttons mt-5 flex items-center justify-center space-x-2">
            <Button
              className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
              ripple="true"
              size="lg"
              style={{
                color: "white"
              }}
              disabled={!isCaptchaVerified}
              onClick={handleDeleteUser}
            >
              {deletebtnloading ? (
                <CircularProgress size={18} sx={{ color: "blue" }} />
              ) : (
                <span>{UserStatus === 1 ? t("de_activate") : t("re_activate")}</span>
              )}
            </Button>

            <Button
              onClick={handleUserModelClose}
              ripple="true"
              variant="outlined"
              className={`shadow-none  rounded-md text-sm  ${
                currentMode === "dark"
                  ? "text-white border-white"
                  : "text-primary border-primary"
              }`}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteUser;
