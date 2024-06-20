
import React, {
  useEffect,
  useState
} from "react";
import {
  useLocation,
  useNavigate
} from "react-router-dom";
import {
  useStateContext
} from "../../context/ContextProvider";
import {
  Box
} from "@mui/material";

import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import usePermission from "../../utils/usePermission";
import HeadingTitle from "../../Components/_elements/HeadingTitle";


const AllLiveLeads = () => {
  const {
    currentMode,
    setopenBackDrop,
    pageState,
    BACKEND_URL,
    themeBgImg,
    t
  } = useStateContext();
  const location = useLocation();
  const { hasPermission } = usePermission();
  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");
  const pathname2 = location.pathname.split("/")[1];
  const [loading, setloading] = useState(true);


  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, [lead_type]);

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-5 mt-2 ${!themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
              }`}
          >
            <HeadingTitle
              title={`${t("type_livecall")} ${t("leads")}`}
              subtitle={t("feedback_" + lead_type?.toLowerCase()?.replaceAll(" ", '_'))}
              counter={pageState?.total}
            />

            <AllLeads
              BACKEND_URL={BACKEND_URL}
              lead_type={lead_type}
              lead_origin={pathname2}
              leadCategory="live"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllLiveLeads;
