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
import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";

const AllWarmLeads = () => {
  const {
    currentMode,
    setopenBackDrop,
    pageState,
    BACKEND_URL,t,
    themeBgImg
  } = useStateContext();
  const location = useLocation();
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
            className={`w-full p-4 ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {`${t("type_archive")} ${t("leads")}`}{" "}
                <span className="capitalize">({(t("feedback_" + lead_type?.toLowerCase()?.replaceAll(" ", "_")))})</span>{" "}
                <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                  {pageState?.total}
                </span>
              </h1>
            </div>
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

export default AllWarmLeads;
