import React, { 
  useEffect, 
  useState } from "react";
import { 
  useLocation 
} from "react-router-dom";
import { 
  useStateContext 
} from "../../context/ContextProvider";

import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import { toast } from "react-toastify";
import {FaRegFileAlt } from "react-icons/fa";
import axiosInstance from "../../axoisConfig";
import { CircularProgress } from "@mui/material";

const correspondingParamName = (coldLeadType) => {
  if(coldLeadType?.toLowerCase() === "coldleadsverified") {
    return "verified";
  } else if(coldLeadType?.toLowerCase() ==="coldleadsinvalid") {
    return "invalid";
  } else if(coldLeadType?.toLowerCase() === "coldleadsnotchecked") {
    return "notChecked";
  } else {
    return null;
  }
}

const ColdLeads = () => {
  const location = useLocation();
  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");
  const pathname2 = location.pathname.split("/")[1];
  const [loading, setloading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [coldcallFiles, setColdcallFiles]  = useState([]);
  const { currentMode, pageState, setopenBackDrop, BACKEND_URL, t, themeBgImg, primaryColor } =
    useStateContext();

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
  }, []);

  const fetchColdLeadsData = async (type) => {
    try {

            setFilesLoading(true);

      let url = BACKEND_URL + "/total-cold?";
      if(type) {
        url += `&${type}=1`;
      } else {
        url += `&feedback=${lead_type}`;
      }

      const token = localStorage.getItem("auth-token");
      const response = await axiosInstance.get(url, {
        headers: {
          "Authorization": "Bearer " + token
        }
      }); 

      const data = response.data?.data;
      setColdcallFiles(data);

      setFilesLoading(false);
      
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
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
  }

  useEffect(() => {
    setopenBackDrop(false);
    const type = correspondingParamName(lead_type);

    fetchColdLeadsData(type);
    // eslint-disable-next-line
  }, [lead_type]);


  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1
                className={`text-lg font-semibold mx-2 uppercase ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {`${t("cold")} ${t("leads")}`} 
                {" "}
                <span className="capitalize">({t("feedback_" + lead_type?.toLowerCase()?.replaceAll(" ", "_"))})</span>{" "}
                <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                  {pageState?.total}
                </span>
              </h1>
            </div>

            {filesLoading ? <div className="flex w-full justify-center items-center py-8">
                <h1 className="text-xl">Loading...</h1>
            </div> : (coldcallFiles?.length > 0 ? <div className="flex items-center gap-x-1 overflow-x-scroll py-8" style={{whiteSpace: "nowrap"}}>
              {coldcallFiles?.map((file) => {
                return <div className="px-5 inline-block">
                  <div className="flex flex-col items-center">
                    <FaRegFileAlt  size={34} className="mb-2"/>
                    <p>{file?.notes}</p>
                    <p>{file["DATE(creationDate)"]}</p>
                  </div>
                </div>
              })}
    

            </div> : <div className="flex justify-center items-center py-5">Nothing yet</div>)}

            <AllLeads
              BACKEND_URL={BACKEND_URL}
              lead_type={lead_type}
              lead_origin={pathname2}
              leadCategory="hot"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ColdLeads;
