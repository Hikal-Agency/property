import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Tooltip,
  IconButton,
  Modal,
  Backdrop,
  CircularProgress,
  Button,
} from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { FaPencilAlt } from "react-icons/fa";

import axios from "../../axoisConfig";
import Error404 from "../../Pages/Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { load } from "../../Pages/App";

import { MdClose, MdFileUpload } from "react-icons/md";
import { BsFileEarmarkMedical } from "react-icons/bs";

import usePermission from "../../utils/usePermission";
import AddTransactionForm from "./AddTransactionForm";
import NewTransactionForm from "./NewTransactionForm";

const EditTransactionForm = ({
  openEditModal,
  setOpenEditModal,
  fetchTransactions,
  // user,
  // vendors,
  // loading,
  // fetchUsers,
  transData,
  // fetchVendor,
}) => {
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    isArabic,
    isLangRTL,
    i18n,
    User,
    t,
    fontFam,
  } = useStateContext();
  const [leadNotFound, setLeadNotFound] = useState(false);
  const [loading, setloading] = useState(false);

  const [userLoading, setUserLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [vendors, setVendors] = useState([]);
  const token = localStorage.getItem("auth-token");

  console.log("edit data: ", transData);
  console.log("user list:: ", user);
  console.log("vendor list:: ", vendors);

  const [addTransactionData, setAddTransactionData] = useState({
    user_id: transData?.user_id || null,
    invoice_type: transData?.invoice_type || null,
    amount: transData?.amount || null,
    date: transData?.date || null,
    currency: transData?.currency || "AED",
    comm_percent: transData?.comm_percent || null,
    country: transData?.country || null,
    status: transData?.status || "Paid",
    paid_by: transData?.paid_by || null,
    vendor_id: transData?.vendor_id || null,
    category: transData?.category || null,
    image: null,
    total_amount: transData?.total_amount,
    vat: transData?.vat,
    is_petty_cash: transData?.is_petty_cash,
  });

  const fetchVendor = async () => {
    const vendorUrl = `${BACKEND_URL}/vendors`;
    const userUrl = transData?.user_id
      ? `${BACKEND_URL}/users?id=${transData?.user_id}`
      : `${BACKEND_URL}/users`;

    try {
      const [vendorResponse, userResponse] = await Promise.all([
        axios.get(vendorUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
        axios.get(userUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
      ]);

      console.log("vendors list:: ", vendorResponse);
      console.log("users list:: ", userResponse);

      let usersList = userResponse?.data?.managers?.data;

      usersList?.filter((user) => user?.status === 1);

      setUser(usersList);
      setVendors(vendorResponse?.data?.data?.data);
    } catch (error) {
      setloading(false);
      console.error("Error fetching data:", error);
      toast.error("Unable to fetch data", {
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

  const fetchUsers = async (title, type) => {
    try {
      let url = "";

      if (type === "user") {
        url = `${BACKEND_URL}/users?userName=${title}`;
      } else {
        url = `${BACKEND_URL}/vendors?vendor_name=${title}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Users: ", response);

      if (type === "user") {
        setUser(response?.data?.managers?.data);
      } else {
        setVendors(response?.data?.data?.data);
      }

      setUserLoading(false);
    } catch (error) {
      setUserLoading(false);
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

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenEditModal(false);
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  return (
    <>
      <Modal
        keepMounted
        open={openEditModal}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
          w-[100vw] h-[100vh] flex items-start justify-end `}
        >
          <button
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className=" hover:border hover:border-white hover:rounded-full"
            />
          </button>

          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#1C1C1C] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            } p-4 h-[100vh] w-[80vw] overflow-y-scroll `}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                {leadNotFound ? (
                  <Error404 />
                ) : (
                  <div className="w-full">
                    <NewTransactionForm
                      user={user}
                      vendors={vendors}
                      loading={loading}
                      fetchUsers={fetchUsers}
                      fetchTransactions={fetchTransactions}
                      addTransactionData={addTransactionData}
                      setAddTransactionData={setAddTransactionData}
                      edit={true}
                      transData={transData}
                      handleClose={handleClose}
                      fullRow={true}
                    />
                  </div>
                )}
                {/* <Footer /> */}
              </>
            )}
          </div>
        </div>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default EditTransactionForm;
