import { useState, useEffect } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { useLocation, useNavigate } from "react-router";
import { search } from "../../utils/axiosSearch";

const SearchLeads = () => {
  const { BACKEND_URL, currentMode, darkModeColors } = useStateContext();
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchResult, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const location = useLocation();

  const clearSearchInput = () => {
    setSearchResults(null);
    setSearchTerm("");
  };

  const handleNavigate = (e, search) => {
    clearSearchInput();
    document.location.href = `/lead/${search?.leadId || search?.id}`;
  };

  const handleSearch = async (e) => {
    const searchWord = e.target.value;
    if (!e.target.value) {
      setSearchTerm(null);
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const token = localStorage.getItem("auth-token");

    setSearchTerm(e.target.value);
    try {
      const postSearch = await search(
        `${BACKEND_URL}/searchleads?search=${searchWord}`,
        // {},
        token
      );

      if (postSearch?.data !== "No Data") {
        console.log("settted:::::: ");
        setSearchResults(postSearch?.data);
      }

      setSearchLoading(false);
      console.log("search result: ", postSearch);
    } catch (error) {
      setSearchLoading(false);
      console.log("error: ", error);
      toast.error("Unable to search", {
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
    clearSearchInput();
  }, [location]);

  useEffect(() => {
    const cb = (e) => {
      if (!e.target.closest(".search-leads-container")) {
        clearSearchInput();
      }
    };
    document.body.addEventListener("click", cb);

    return () => {
        document.body.removeEventListener("click", cb);
    }
  }, []);
  return (
    <div>
      <div class="search-leads-container">
        <Box sx={darkModeColors}>
          <TextField
            type="text"
            placeholder="Search Leads"
            value={searchTerm}
            onChange={handleSearch}
            size="small"
          />
        </Box>
        {searchResult?.data?.length > 0 && (
          <div
            className={`absolute rounded shadow mt-1 p-3 w-[190px] ${
              currentMode === "dark" ? "bg-[#292828]" : "bg-white"
            }`}
            style={{
              overflow:
                searchResult != null
                  ? searchResult?.data?.length > 10
                    ? "auto"
                    : "visible"
                  : "",
              maxHeight:
                searchResult != null
                  ? searchResult?.data?.length > 10
                    ? "200px"
                    : "auto"
                  : "",
            }}
          >
            {searchLoading === false ? (
              searchResult?.data &&
              searchResult?.data?.map((search) => (
                <Box sx={{
                    "&:hover": {
                        color: "var(--primary-color)", 
                        fontWeight: "bold"
                    }
                }}
                  key={search?.id}
                  className={`py-2 ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  } cursor-pointer`}
                  onClick={(e) => handleNavigate(e, search)}
                >
                  {search?.leadName}
                </Box>
              ))
            ) : (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchLeads;
