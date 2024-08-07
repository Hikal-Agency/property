import { MdClose } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import { useEffect, useState } from "react";
import { Backdrop, Modal } from "@mui/material";
import HeadingTitle from "../../Components/_elements/HeadingTitle";
import {
  Addlisting,
  AddListingAttribute,
} from "../../Components/Listings/listingFormComp";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const UpdateListModal = ({ openEdit, fetchSingleListing, handleClose }) => {
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    isArabic,
    isLangRTL,
    i18n,
    User,
    t,
  } = useStateContext();
  const listData = openEdit?.data;
  const type = openEdit?.type;
  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };
  const [isClosing, setIsClosing] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);

  const token = localStorage.getItem("auth-token");

  const FetchData = async () => {
    setLoading(true);
    let url;
    if (type === "list_attr") url = `${BACKEND_URL}/listing-types`;

    try {
      const listingsData = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("all listings: ", listingsData);
      let listings = listingsData?.data?.data?.data || [];

      let rowsDataArray = "";
      if (listingsData?.data?.data?.current_page > 1) {
        const theme_values = Object.values(listings);
        rowsDataArray = theme_values;
      } else {
        rowsDataArray = listings;
      }

      let rowsData = rowsDataArray?.map((row, index) => {
        if (type === "list_attr") {
          return {
            lid: row?.id,
            id: row?.id,
            name: row?.name,
          };
        } else {
          return {};
        }
      });

      setData((prevData) => ({
        ...prevData,
        list_type: rowsData,
      }));

      setLoading(false);
    } catch (error) {
      console.log("listings not fetched. ", error);
      toast.error("Unable to fetch list type.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type === "list_attr") FetchData();
  }, [type]);

  return (
    <>
      {/* <div
          className={`flex min-h-screen w-full p-4 ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          } ${currentMode === "dark" ? "text-white" : "text-black"}`}
        > */}
      <Modal
        keepMounted
        open={openEdit?.open}
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
              currentMode === "dark" &&
              (isLangRTL(i18n.language)
                ? "border-primary border-r-2"
                : "border-primary border-l-2")
            }
                p-4 h-[100vh] w-[80vw] overflow-y-scroll
                `}
          >
            <>
              <div className="w-full">
                <HeadingTitle title={listData?.title} />
              </div>
              {type === "main" ? (
                <Addlisting
                  data={data}
                  loading={loading}
                  listData={listData}
                  handleClose={handleClose}
                  fetchSingleListing={fetchSingleListing}
                  edit={"edit"}
                />
              ) : type === "list_attr" ? (
                <AddListingAttribute
                  data={data}
                  loading={loading}
                  listData={listData}
                  handleClose={handleClose}
                  fetchSingleListing={fetchSingleListing}
                  edit={"edit"}
                />
              ) : null}
            </>
          </div>
        </div>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default UpdateListModal;
