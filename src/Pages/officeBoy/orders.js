import React, { useEffect, useState } from "react";
import OrderHistory from "../../Components/OfficeBoy_Comp/OrderHistory";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const Orders = () => {
  const { currentMode, t, primaryColor, themeBgImg, BACKEND_URL } =
    useStateContext();
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(null);
  const [pageSize, setPageSize] = useState(null);
  const token = localStorage.getItem("auth-token");

  const listOrders = async () => {
    setLoading(true);
    try {
      const listOrders = await axios.get(`${BACKEND_URL}/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("list item::::: ", listOrders);
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

            <OrderHistory
              row={row}
              setRow={setRow}
              loading={loading}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              changeStatus={changeStatus}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
