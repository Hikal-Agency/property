import { Link as RouterLink, useLocation } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";

const BreadCrumb = ({ allroutes, currentMode }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  console.log("pathnames : ", pathnames);
  console.log("routes: ", allroutes);

  const breadcrumbItems = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;

    if (index === 0) {
      return (
        <Link color="inherit" component={RouterLink} to="/" key={to}>
          Home
        </Link>
      );
    }

    const parentPage = `/${pathnames.slice(0, index).join("/")}`;
    const parentPageName = `${pathnames[index - 1][0]?.toUpperCase()}${pathnames[
      index - 1
    ]?.slice(1, pathnames[index - 1].length)}`?.replace("%20", " ");
    // const allRoutes = []; // Add your routes here

    if (allroutes.find((route) => route.path === parentPage)) {
      return (
        <Link color="inherit" component={RouterLink} to={parentPage} key={to}>
          {parentPageName}
        </Link>
      );
    } else {
      return (
        <Typography
          color={currentMode === "dark" ? "white" : "inherit"}
          key={to}
        >
          {parentPageName}
        </Typography>
      );
    }
  });

  const formattedLastURL = `${pathnames[
    pathnames.length - 1
  ][0]?.toUpperCase()}${pathnames[pathnames.length - 1]?.slice(
    1,
    pathnames[pathnames.length - 1].length
  )}`?.replace("%20", " ");

  return (
    <Breadcrumbs
      sx={{
        color: currentMode === "dark" ? "white" : "inherit",
      }}
      aria-label="breadcrumb"
    >
      {breadcrumbItems}
      <Typography color={currentMode === "dark" ? "white" : "inherit"}>
        {formattedLastURL}
      </Typography>
    </Breadcrumbs>
  );
};

export default BreadCrumb;
