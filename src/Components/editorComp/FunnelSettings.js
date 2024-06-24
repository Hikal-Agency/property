import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Box, CircularProgress, TextField } from "@mui/material";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const FunnelSettings = ({ data, fetchTemplates, handleClose }) => {
  console.log("landing page data in funnel settings::: ", data);
  const { darkModeColors, t, BACKEND_URL } = useStateContext();
  const [loading, setLoading] = useState(false);
  const updateSetting = data?.settings?.length > 0 ? true : false;

  const [formdata, setformdata] = useState({
    page_id: data?.id || null,
    // funnel_page_type: data?.template_type || null,
    funnel_page_name: data?.template_name || null,
    // path_head: null,
    // domain: null,
    favicon_url: null,
    body_code: null,
    header_code: null,
    footer_code: null,
    domain: updateSetting ? data?.settings[0]?.domain : null,
  });

  console.log("formData::: ", formdata);

  const handleSettingsData = (e) => {
    if (e.target.id === "domain") {
      let domain = e.target.value;

      // Check if the domain has 'http://' or 'https://' prefix
      const domainPrefixes = ["http://", "https://"];

      // Loop through each prefix
      for (const prefix of domainPrefixes) {
        // If the domain has a prefix, remove it
        if (domain.startsWith(prefix)) {
          domain = domain.replace(prefix, "");
          break; // Stop the loop once a prefix is removed
        }
      }

      // Update the state with the cleaned domain
      setformdata((prevFormData) => ({
        ...prevFormData,
        [e.target.id]: domain,
      }));

      return;
    }
    setformdata(() => ({
      ...formdata,
      [e.target.id]: e.target.value,
    }));
  };

  const saveSettings = async (e) => {
    setLoading(true);

    if (!formdata?.domain) {
      toast.error(`domain is required`, {
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

      return;
    }
    try {
      const token = localStorage.getItem("auth-token");

      let url;

      if (updateSetting) {
        url = `${BACKEND_URL}/page-settings/${data?.settings[0]?.id}`;
      } else {
        url = `${BACKEND_URL}/page-settings`;
      }
      const response = await axios.post(url, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("successfully posted", response.data);

      if (response?.data?.status == false) {
        setLoading(false);
        toast.error(`${response?.data?.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        return;
      }

      toast.success(`Settings update.`, {
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
      handleClose();
      fetchTemplates();
    } catch (error) {
      setLoading(false);
      console.error("error in updating funnel settings", error);
      toast.error("Unable to save settings.", {
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

  return (
    <div>
      <h1 className="mt-2 text-lg font-bold ml-2">{t("funnel_settings")}</h1>
      <div className="w-full">
        <form
          className="p-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveSettings();
          }}
        >
          <Box sx={darkModeColors}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="p-4">
                <TextField
                  id="funnel_page_name"
                  type={"text"}
                  label={t("funnel_form_name")}
                  className="w-full"
                  style={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="small"
                  required
                  value={formdata?.funnel_page_name}
                  onChange={handleSettingsData}
                />
                {/* <TextField
                  id="path_head"
                  type={"text"}
                  label={t("funnel_form_path")}
                  className="w-full"
                  style={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="small"
                  required
                  value={formdata?.path_head}
                  onChange={handleSettingsData}
                /> */}

                <TextField
                  id="header_code"
                  type={"text"}
                  label={t("funnel_header_code")}
                  className="w-full"
                  style={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="small"
                  value={formdata?.header_code}
                  onChange={handleSettingsData}
                />
                <TextField
                  id="domain"
                  type={"text"}
                  label={t("funnel_form_domain")}
                  className="w-full"
                  style={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="small"
                  required
                  value={formdata?.domain}
                  onChange={handleSettingsData}
                />
              </div>

              <div className="p-4">
                <TextField
                  id="favicon_url"
                  type={"text"}
                  label={t("funnel_form_favicon_url")}
                  className="w-full"
                  style={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="small"
                  value={formdata?.favicon_url}
                  onChange={handleSettingsData}
                />
                <TextField
                  id="footer_code"
                  type={"text"}
                  label={t("funnel_footer_code")}
                  className="w-full"
                  style={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="small"
                  value={formdata?.footer_code}
                  onChange={handleSettingsData}
                />
                <TextField
                  id="body_code"
                  type={"text"}
                  label={t("funnel_form_body_tracking_code")}
                  className="w-full"
                  style={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="small"
                  value={formdata?.body_code}
                  onChange={handleSettingsData}
                />
              </div>
            </div>
          </Box>
          <div className="p-4 flex justify-center">
            <button
              disabled={loading ? true : false}
              type="submit"
              className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex  justify-center rounded-md border border-transparent bg-btn-primary py-3 px-4 text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 text-md font-bold uppercase"
            >
              {loading ? (
                <CircularProgress
                  sx={{ color: "white" }}
                  size={18}
                  className="text-white"
                />
              ) : (
                <span>{t("funnel_form_save")}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FunnelSettings;
