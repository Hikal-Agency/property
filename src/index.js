import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import "./styles/index.css";
import "react-toastify/dist/ReactToastify.css";
import { ContextProvider } from "./context/ContextProvider";
import { ProSidebarProvider } from "react-pro-sidebar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ContextProvider>
      <ProSidebarProvider>
        {/* <Backdrop /> */}
        <App />
      </ProSidebarProvider>
    </ContextProvider>
  </>
); 
