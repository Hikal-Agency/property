import React, { useEffect, useState } from "react";
import Select from "react-select";
import OrderHistory from "../../Components/OfficeBoy_Comp/OrderHistory";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

import { BsCart4, BsInfoLg, BsPerson, BsClockHistory } from "react-icons/bs";
import { GiSpoon } from "react-icons/gi";
import { order_status } from "../../Components/_elements/SelectOptions";
import {
  renderStyles,
  renderStyles2,
  selectBgStyles,
} from "../../Components/_elements/SelectStyles";
import usePermission from "../../utils/usePermission";
import moment from "moment";
import { datetimeAMPM } from "../../Components/_elements/formatDateTime";

const Orders = () => {
  const { currentMode, t, primaryColor, themeBgImg, BACKEND_URL, User } =
    useStateContext();

  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(null);
  const [pageSize, setPageSize] = useState(null);
  const token = localStorage.getItem("auth-token");

  const listOrders = async () => {
    setLoading(true);

    let url;
    if (hasPermission("my_orders")) {
      url = `${BACKEND_URL}/orders`;
    } else {
      url = `${BACKEND_URL}/orders/filter?userId=${User?.id}`;
    }
    try {
      const listOrders = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      // console.log("list item::::: ", listOrders);
      setRow(listOrders?.data?.data);
      setTotal(listOrders?.data?.data?.meta?.total);
      setPageSize(listOrders?.data?.data?.meta?.per_page);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error:::: ", error);
      toast.error(`Unable to fetch inventory. Kindly try again`, {
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

  const changeStatus = async (e, value) => {
    const newValue = e.value;
    console.log("new value status:: ", newValue);
    console.log("status value:: ", value);
    setLoading(true);
    try {
      const updateStatus = await axios.post(
        `${BACKEND_URL}/orders/${value?.id}`,
        JSON.stringify({
          itemId: String(value?.itemId),
          orderStatus: newValue,
          quantity: value?.quantity,
          amount: value?.amount,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success(`Order Status Updated to ${newValue}.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log("order item::::: ", updateStatus);
      setLoading(false);

      listOrders();
    } catch (error) {
      setLoading(false);
      console.log("error:::: ", error);
      toast.error(`Unable to update Status. Kindly try again`, {
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
    listOrders();
  }, [page, pageSize]);

  useEffect(() => {
    const interval = setInterval(() => {
      listOrders();
    }, 60000); // 60000 milliseconds = 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex relative min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
            }
            ${currentMode === "dark" ? "text-white" : "text-black"}`}
          >
            <div className="w-full flex justify-between items-center pb-3">
              <div className="flex items-center">
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("order_history")}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {row.map((order, index) => {
                const status = order?.orderStatus?.toLowerCase();
                let disableUpdate = false;

                if (
                  ["delivered", "cancelled", "out of stock"].includes(status)
                ) {
                  disableUpdate = true;
                }
                let filteredOptions = order_status(t);

                if (!hasPermission("order_status_out_of_stock")) {
                  filteredOptions = filteredOptions.filter(
                    (option) => option.value.toLowerCase() !== "out_of_stock"
                  );
                }
                if (!hasPermission("order_cancel")) {
                  filteredOptions = filteredOptions.filter(
                    (option) => option.value.toLowerCase() !== "cancelled"
                  );
                }
                return (
                  <div
                    key={index}
                    className={`${
                      currentMode === "dark"
                        ? "blur-bg-dark text-white"
                        : "blur-bg-light text-black"
                    } relative p-4 shadow-md rounded-xl h-full flex flex-col gap-4 justify-between`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center w-full gap-4">
                        <div className="bg-primary w-4 h-4 rounded-full shadow-sm p-1"></div>
                        <div className="font-semibold">{order?.itemName}</div>
                      </div>
                      {order?.amount !== 0 && (
                        <div className="bg-primary text-white font-semibold rounded-md px-3 py-1 text-sm">
                          {order?.currency} {order?.amount}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {/* DETAILS */}
                      <div className="flex flex-col gap-2 col-span-2">
                        <div className="grid grid-cols-8 gap-2 items-center">
                          <BsCart4 size={16} />
                          <div className="col-span-7">
                            {order?.quantity} {t("quantity")}
                          </div>
                        </div>
                        <div className="grid grid-cols-8 gap-2 items-center">
                          <GiSpoon size={15} />
                          <div className="col-span-7">
                            {order?.sugar && order?.sugar !== 0 ? (
                              <span>
                                {order?.sugar} {t("spoon_of_sugar")}
                              </span>
                            ) : (
                              <span>-</span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-8 gap-2 items-center">
                          <BsInfoLg size={14} />
                          <div className="col-span-7">{order?.notes}</div>
                        </div>
                        <div className="grid grid-cols-8 gap-2 items-center">
                          <BsPerson size={15} />
                          <div className="col-span-7">{order?.userName}</div>
                        </div>
                        <div className="grid grid-cols-8 gap-2 items-center">
                          <BsClockHistory size={15} />
                          <div className="col-span-7">
                            {datetimeAMPM(order?.created_at)}
                          </div>
                        </div>
                      </div>
                      {/* IMAGE */}
                      <div className="">{/* SPACE FOR IMAGE */}</div>
                    </div>
                    <div className={``}>
                      <Select
                        id="status"
                        value={order_status(t)?.find(
                          (option) =>
                            option?.value?.toLowerCase() ===
                            order.orderStatus.toLowerCase()
                        )}
                        onChange={(e) => changeStatus(e, order)}
                        options={order_status(t)}
                        placeholder={t("select_status")}
                        className={`w-full`}
                        menuPortalTarget={document.body}
                        styles={renderStyles2(currentMode, primaryColor)}
                        isDisabled={disableUpdate}
                        isSearchable={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* <OrderHistory
              row={row}
              setRow={setRow}
              loading={loading}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              changeStatus={changeStatus}
            /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
