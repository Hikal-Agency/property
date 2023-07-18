// import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Modal,
  IconButton,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
// import LeadNotes from "../LeadNotes/LeadNotes";
import { ToastContainer, toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
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
  const { currentMode, BACKEND_URL } = useStateContext();
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
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
        >
          <div className="flex flex-col justify-center items-center">
            <IoIosAlert size={50} className="text-main-red-color text-2xl" />
            <h1
              className={`font-semibold pt-3 text-lg ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              {`Do you really want to ${
                UserStatus === 1 ? "De-activate" : "Re-activate"
              } ${UserName}?`}
            </h1>
            <small className="text-center w-[80%] mx-auto text-gray-500">All the leads assigned to {UserName} will be unassigned automatically and can be found in Reshuffled leads.</small>

            <div className="bg-red-600 text-center rounded p-3 mb-2 mt-4 w-full text-white">
              <strong style={{ fontSize: 20 }}>
                {randNumbers?.firstNumber} + {randNumbers?.secondNumber} = ?
              </strong>
            </div>
            <TextField
              onInput={(e) => setAnswerVal(e.target.value)}
              value={answerVal}
              label="Type your answer here.."
              type="number"
              fullWidth
            />
          </div>

          <div className="action buttons mt-5 flex items-center justify-center space-x-2">
            <Button
              className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
              ripple="true"
              size="lg"
              disabled={!isCaptchaVerified}
              onClick={handleDeleteUser}
            >
              {deletebtnloading ? (
                <CircularProgress size={18} sx={{ color: "blue" }} />
              ) : (
                <span>{UserStatus === 1 ? "deactivate" : "reactive"}</span>
              )}
            </Button>

            <Button
              onClick={handleUserModelClose}
              ripple="true"
              variant="outlined"
              className={`shadow-none  rounded-md text-sm  ${
                currentMode === "dark"
                  ? "text-white border-white"
                  : "text-main-red-color border-main-red-color"
              }`}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteUser;
