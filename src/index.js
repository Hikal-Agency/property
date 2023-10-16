import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import "./styles/index.css";
import "react-toastify/dist/ReactToastify.css";
import { ContextProvider } from "./context/ContextProvider";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter } from "react-router-dom";
import './i18n'

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <ContextProvider>
      <ProSidebarProvider>
        {/* <Backdrop /> */}
        <BrowserRouter>
        <React.Suspense fallback="Loading...">
      <App />
    </React.Suspense>
        </BrowserRouter>
      </ProSidebarProvider>
    </ContextProvider>
  </>
);
