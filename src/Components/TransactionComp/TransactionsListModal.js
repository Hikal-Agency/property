import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Modal, Backdrop, CircularProgress, Box } from "@mui/material";
import { FaHome, FaUser } from "react-icons/fa";

import axios from "../../axoisConfig";
import Error404 from "../../Pages/Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";

import { MdClose } from "react-icons/md";

import usePermission from "../../utils/usePermission";

const TransactionsListModal = ({
  setTransactionsListModal,
  transactionsListModal,
  fetchCrmClients,
  filters,
}) => {
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    isArabic,
    isLangRTL,
    i18n,
    User,
    darkModeColors,
    t,
  } = useStateContext();

  console.log("single trans data ::: ", transactionsListModal);
  const [singleTrans, setSingleClient] = useState(transactionsListModal);

  let user = singleTrans?.user ? singleTrans?.user : false;

  console.log("user: ", user);

  const [loading, setloading] = useState(false);

  // const [loading, setloading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [listData, setListingData] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [leadNotFound, setLeadNotFound] = useState(false);
  const { hasPermission } = usePermission();
  const [singleImageModal, setSingleImageModal] = useState({
    isOpen: false,
    url: "",
    id: null,
  });

  const [isClosing, setIsClosing] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const token = localStorage.getItem("auth-token");

  const fetchTransactions = async () => {
    setloading(true);
    if (!filters?.month || !filters?.year) {
      toast.error("Month and year are required.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setloading(false);
      return;
    }
    try {
      const params = {
        month: filters?.month,
        year: filters?.year,
      };

      // Conditionally add country and currency if they have values
      if (filters?.country) {
        params.country = filters.country;
      }
      if (filters?.currency) {
        params.currency = filters.currency;
      }

      const response = await axios.get(`${BACKEND_URL}/invoices`, {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("transactions list:: ", response);
      setTransactionsData(response?.data?.data);
    } catch (error) {
      setloading(false);
      console.error("Error fetching statements:", error);
      toast.error("Unable to fetch the Transactions ", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setloading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setTransactionsListModal(false);
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  return (
    <>
      {/* <div
        className={`flex min-h-screen w-full p-4 ${
          !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
        } ${currentMode === "dark" ? "text-white" : "text-black"}`}
      > */}
      <Modal
        keepMounted
        open={transactionsListModal}
        // onClose={handleCloseTimelineModel}
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
            // onClick={handleCloseTimelineModel}
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
                    <div className="w-full flex justify-between items-center pb-3">
                      <div className="flex items-center gap-3">
                        <h1
                          className={`font-semibold text-white bg-primary py-2 px-3 rounded-md`}
                        >
                          {t("transaction_details")}
                        </h1>
                      </div>
                    </div>

                    <div className="">
                      <div
                        className={`rounded-xl w-full my-3  shadow-sm ${
                          currentMode === "dark" ? "bg-black" : "bg-[#EEEEEE]"
                        } p-4`}
                      >
                        <Box
                          sx={{
                            ...darkModeColors,
                            "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                              {
                                right: isLangRTL(i18n.language)
                                  ? "2.5rem"
                                  : "inherit",
                                transformOrigin: isLangRTL(i18n.language)
                                  ? "right"
                                  : "left",
                              },
                            "& legend": {
                              textAlign: isLangRTL(i18n.language)
                                ? "right"
                                : "left",
                            },
                          }}
                          className="p-2"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <CircularProgress />
                            </div>
                          ) : (
                            <div className="h-[600px] overflow-y-scroll ">
                              {transactionsData &&
                              transactionsData?.length > 0 ? (
                                transactionsData?.map((trans) => {
                                  let user;
                                  if (
                                    trans?.invoice?.category?.toLowerCase() ===
                                    "salary"
                                  ) {
                                    user = true;
                                  } else {
                                    user = false;
                                  }

                                  return (
                                    <>
                                      <div
                                        className="mb-9 mx-3 cursor-pointer"
                                        // onClick={() =>
                                        //   setSingleTransModal(trans)
                                        // }
                                      >
                                        <p>{trans?.invoice?.date}</p>
                                        <div className="flex items-center justify-between my-3">
                                          <div>
                                            <div className="flex flex-col">
                                              <div className="flex items-center mb-1">
                                                <span className="border rounded-md p-3 mr-3">
                                                  {user ? (
                                                    <FaUser />
                                                  ) : (
                                                    <FaHome size={20} />
                                                  )}
                                                </span>
                                                <p>
                                                  {user
                                                    ? trans?.user?.userName
                                                    : trans?.vendor
                                                        ?.vendor_name}
                                                </p>
                                              </div>
                                              <p className="text-sm self-start pl-[calc(20px+2rem)]">
                                                {trans?.invoice?.category}
                                              </p>
                                            </div>
                                          </div>
                                          <div>
                                            <p
                                              className={`font-semibold ${
                                                trans?.invoice?.invoice_type ==
                                                "Income"
                                                  ? "text-green-600"
                                                  : "text-red-600"
                                              } `}
                                            >
                                              {trans?.invoice?.invoice_type ===
                                              "Income"
                                                ? "+"
                                                : "-"}{" "}
                                              {trans?.invoice?.currency}{" "}
                                              {trans?.invoice?.amount}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })
                              ) : (
                                <div>
                                  <h1>{t("no_data_found")}</h1>
                                </div>
                              )}
                            </div>
                          )}
                        </Box>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default TransactionsListModal;
