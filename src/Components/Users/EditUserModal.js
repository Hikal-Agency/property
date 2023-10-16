import React, { useEffect, useState } from "react";
import {
    Modal,
    Backdrop,
    IconButton,
    CircularProgress,
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
  } from "@mui/material";
  import classNames from "classnames";
  import { useStateContext } from "../../context/ContextProvider";
  import ListingLocation from "../Leads/listings/ListingLocation";
  import { MdFileUpload } from "react-icons/md";
  import { CiMapPin } from "react-icons/ci";
  import axios from "../../axoisConfig";
  import { toast } from "react-toastify";
  import AddImageModal from "../../Pages/listings/AddImageModal";
  import AddDocumentModal from "../../Pages/listings/AddDocumentModal";
  import EditUser from "./EditUser";

  import {
    MdClose
  } from "react-icons/md";
  import {
    BsGenderAmbiguous
  } from "react-icons/bs";
  import {
    FaBirthdayCake,
    FaTransgender,
    FaPhoneAlt,
    FaEnvelope
  } from "react-icons/fa";
  
  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };
  
  const EditUserModal = ({
    UserData,
    setEditModalOpen,
    handleCloseEditModal,
  }) => {
    const { 
        currentMode, 
        darkModeColors, 
        BACKEND_URL, 
        DataGridStyles 
    } = useStateContext();
    const [user, setUser] = useState();

    // FETCH USER DETAILS 
    const fetchUser = async (token) => {
        try {
          // const token = localStorage.getItem("auth-token");
          const response = await axios.get(`${BACKEND_URL}/users/${UserData}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
          console.log("User: ", response?.data?.data);
    
          setUser(response?.data?.data);
        } catch (error) {
          console.log(error);
          toast.error("Unable to fetch users.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
    };
    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        fetchUser(token);
    }, []);
  
    return (
      <>
        <Modal
          keepMounted
          open={setEditModalOpen}
          onClose={handleCloseEditModal}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
            <div className="modal-container w-[100vw] h-[100vh] flex items-start justify-end">
                <button onClick={handleCloseEditModal}
                    className="bg-primary w-fit h-fit p-3 rounded-l-full my-4 z-10"
                >
                    <MdClose
                    size={18}
                    color={"white"}
                    className="hover:border hover:border-white hover:rounded-full"
                    />
                </button>

                <div
                    style={style}
                    className={` ${
                        currentMode === "dark"
                            ? "bg-[#1C1C1C] text-white"
                            : "bg-[#FFFFFF] text-black"
                        }
                         h-[100vh] w-[80vw] rounded-l-md overflow-y-scroll
                    `}
                >
                    <div className={`${currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light"} p-4 w-full flex items-center mb-1 fixed`}>
                        <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                        <h1
                            className={`text-lg font-semibold ${
                            currentMode === "dark" ? "text-white" : "text-black"
                            }`}
                        >
                            {user?.userName}
                        </h1>
                    </div>

                    <div className="p-5 mt-12">
                        <div className={` ${currentMode === "dark" ? "text-white" : "text-black"} grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5`}>
                            {/* CONTACT DETAILS  */}
                            <div className="card-hover shadow-lg rounded-lg w-full h-fit">
                                <div className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"} text-center font-semibold p-3 uppercase rounded-t-lg`}>
                                    Contact Details
                                </div>
                                <div className="px-4">
                                    <div className="grid grid-cols-6 my-5">
                                        <div className="px-2 flex justify-center">
                                            <FaPhoneAlt size={16} color={"#AAAAAA"} />
                                        </div>
                                        <div className="col-span-5">
                                            {user?.userContact}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 my-5">
                                        <div className="px-2 flex justify-center">
                                            <FaEnvelope size={16} color={"#AAAAAA"} />
                                        </div>
                                        <div className="col-span-5">
                                            {user?.userEmail}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 my-5">
                                        <div className="px-2 flex justify-center">
                                            <FaPhoneAlt size={16} color={"#AAAAAA"} />
                                        </div>
                                        <div className="col-span-5">
                                            <span className="text-[#AAAAAA] text-sm uppercase me-2">
                                                (alt)
                                            </span>
                                            {user?.userAltContact}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 my-5">
                                        <div className="px-2 flex justify-center">
                                            <FaEnvelope size={16} color={"#AAAAAA"} />
                                        </div>
                                        <div className="col-span-5">
                                            <span className="text-[#AAAAAA] text-sm uppercase me-2">
                                                (alt)
                                            </span>
                                            {user?.userAltEmail}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PERSONAL DETAILS */}
                            <div className="card-hover shadow-lg rounded-lg w-full h-fit">
                                <div className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"} text-center font-semibold p-3 uppercase rounded-t-lg`}>
                                    Personal Details
                                </div>
                                <div className="px-4">
                                    <div className="grid grid-cols-2 my-5 px-4">
                                        <div className="text-start">
                                            Gender
                                        </div>
                                        <div className="text-end">
                                            {user?.gender}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 my-5 px-4">
                                        <div className="text-start">
                                            Date of birth
                                        </div>
                                        <div className="text-end">
                                            {user?.dob}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 my-5 px-4">
                                        <div className="text-start">
                                            Current Address
                                        </div>
                                        <div className="text-end">
                                            {user?.currentAddress}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 my-5 px-4">
                                        <div className="text-start">
                                            Nationality/Country
                                        </div>
                                        <div className="text-end">
                                            {user?.nationality}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* EMPLOYEE DETAILS  */}
                            <div className="card-hover shadow-lg rounded-lg w-full h-fit">
                                <div className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"} text-center font-semibold p-3 uppercase rounded-t-lg`}>
                                    Employee Details
                                </div>
                                <div className="px-4">
                                    <div className="grid grid-cols-2 my-5 px-4">
                                        <div className="text-start">
                                            Profession
                                        </div>
                                        <div className="text-end">
                                            {user?.position}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 my-5 px-4">
                                        <div className="text-start">
                                            Department
                                        </div>
                                        <div className="text-end">
                                            {user?.department}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 my-5 px-4">
                                        <div className="text-start">
                                            Joining date
                                        </div>
                                        <div className="text-end">
                                            {user?.joiningDate}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 my-5 px-4">
                                        <div className="text-start">
                                            Visa by company?
                                        </div>
                                        <div className="text-end">
                                            {user?.idByCompany}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full p-4">
                            <Box width={"100%"} sx={DataGridStyles}>
                                <EditUser user={user} />
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
      </>
    );
  };
  
  export default EditUserModal;
  