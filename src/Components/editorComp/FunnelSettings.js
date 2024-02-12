import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Box, CircularProgress, TextField } from "@mui/material";

const FunnelSettings = () => {
  const { darkModeColors, t } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [formdata, setformdata] = useState({
    name: null,
    path_head: null,
    tracking_code: null,
    domain: null,
    favicon_url: null,
    body_tracking_code: null,
  });

  console.log("formData::: ", formdata);

  const handleSettingsData = (e) => {
    setformdata(() => ({
      ...formdata,
      [e.target.id]: e.target.value,
    }));
  };

  const saveSettings = async (e) => {};

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
                  id="name"
                  type={"text"}
                  label={t("funnel_form_name")}
                  className="w-full"
                  style={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="small"
                  required
                  value={formdata?.name}
                  onChange={handleSettingsData}
                />
                <TextField
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
                />
                <TextField
                  id="tracking_code"
                  type={"text"}
                  label={t("funnel_form_tracking_code")}
                  className="w-full"
                  style={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="small"
                  required
                  value={formdata?.tracking_code}
                  onChange={handleSettingsData}
                />
              </div>

              <div className="p-4">
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
                  required
                  value={formdata?.favicon_url}
                  onChange={handleSettingsData}
                />
                <TextField
                  id="body_tracking_code"
                  type={"text"}
                  label={t("funnel_form_body_tracking_code")}
                  className="w-full"
                  style={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="small"
                  required
                  value={formdata?.body_tracking_code}
                  onChange={handleSettingsData}
                />
              </div>
            </div>
          </Box>
          <div className="p-4">
            <button
              disabled={loading ? true : false}
              type="submit"
              className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-btn-primary py-3 px-4 text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 text-md font-bold uppercase"
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
