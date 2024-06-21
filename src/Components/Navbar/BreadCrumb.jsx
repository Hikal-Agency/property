import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useEffect } from "react";

const BreadCrumb = ({ allroutes, currentMode }) => {
  const location = useLocation();
  const { t, i18n, langs } = useStateContext();

  const [font, setFont] = useState("'Noto Sans', sans-serif");

  useEffect(() => {
    const matchingFont = langs.find((lang) => lang.code === i18n.language);
    if (matchingFont) {
      setFont(matchingFont.font);
    }
  }, [langs, i18n.language]);

  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbItems = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;

    if (index === 0) {
      return (
        <Link
          color="inherit"
          component={RouterLink}
          to="/"
          key={to}
          style={{
            fontFamily: font,
          }}
        >
          {t("home")}
        </Link>
      );
    }

    const parentPage = `/${pathnames.slice(0, index).join("/")}`;
    const parentPageName = `${pathnames[
      index - 1
    ][0]?.toUpperCase()}${pathnames[index - 1]?.slice(
      1,
      pathnames[index - 1].length
    )}`?.replace("%20", " ");
    // const allRoutes = []; // Add your routes here

    if (allroutes.find((route) => route.path === parentPage)) {
      return (
        <Link
          color="inherit"
          component={RouterLink}
          to={parentPage}
          key={to}
          style={{
            fontFamily: font,
          }}
        >
          {t(parentPageName?.toLowerCase())}
        </Link>
      );
    } else {
      return (
        <Typography
          color={currentMode === "dark" ? "white" : "inherit"}
          key={to}
          style={{
            fontFamily: font,
          }}
        >
          {t(parentPageName?.toLowerCase())}
        </Typography>
      );
    }
  });

  const formattedLastURL = `${pathnames[
    pathnames.length - 1
  ][0]?.toUpperCase()}${pathnames[pathnames.length - 1]?.slice(
    1,
    pathnames[pathnames.length - 1].length
  )}`?.replace(/%20/g, " ");

  return (
    <Breadcrumbs
      sx={{
        color: currentMode === "dark" ? "white" : "inherit",
      }}
      aria-label="breadcrumb"
      style={{
        fontFamily: font,
      }}
    >
      {breadcrumbItems}
      <Typography
        style={{
          fontFamily: font,
        }}
        color={currentMode === "dark" ? "white" : "inherit"}
      >
        {t(formattedLastURL?.toLowerCase())}
      </Typography>
    </Breadcrumbs>
  );
};

export default BreadCrumb;
