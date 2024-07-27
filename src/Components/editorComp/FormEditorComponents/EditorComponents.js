import React, { useState } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import DraggableComponent from "./DraggableComponent";
import { MdOutlineClose } from "react-icons/md";
import { useStateContext } from "../../../context/ContextProvider";
const EditorComonents = ({ components, setIsExpandedComponents }) => {
  const [currentTab, setCurrentTab] = useState("quick_add");
  const { themeBgImg, currentMode } = useStateContext();
  return (
    <div
      className={`${
        themeBgImg
          ? currentMode === "dark"
            ? "blur-bg-dark shadow-sm text-white"
            : ""
          : currentMode === "dark"
          ? "bg-dark-neu text-white"
          : ""
      } !rounded-none`}
    >
      <div className="flex justify-between items-center p-2">
        <h2 className=" text-[14px] font-medium text-gray-600">Form Element</h2>
        <button aria-label="close components">
          <MdOutlineClose
            size={22}
            className="text-gray-600"
            onClick={() => setIsExpandedComponents(false)}
          />
        </button>
      </div>
      <div className="p-1 flex bg-gray-200">
        <Box
          sx={{
            boxShadow: currentTab == "quick_add" ? 1 : 0,
            backgroundColor:
              currentTab == "quick_add"
                ? currentMode == "dark"
                  ? "black"
                  : "white"
                : "transparent",
            width: "100%",
            color:
              currentTab == "quick_add"
                ? currentMode == "dark"
                  ? "white"
                  : "black"
                : "black",
            borderRadius: "3px",
          }}
        >
          <button
            className="flex-1 text-center py-2 cursor-pointer rounded-md w-full"
            onClick={() => setCurrentTab("quick_add")}
          >
            Quick Add
          </button>
        </Box>
        <Box
          sx={{
            boxShadow: currentTab == "custom_fields" ? 1 : 0,
            backgroundColor:
              currentTab == "custom_fields"
                ? currentMode == "dark"
                  ? "black"
                  : "white"
                : "transparent",
            width: "100%",
            color:
              currentTab == "custom_fields"
                ? currentMode == "dark"
                  ? "white"
                  : "black"
                : "black",
            borderRadius: "3px",
          }}
        >
          <button
            className={`flex-1 text-center py-2 cursor-pointer rounded-md w-full`}
            onClick={() => setCurrentTab("custom_fields")}
          >
            Custom Fields
          </button>
        </Box>
      </div>
      <div>
        {currentTab == "quick_add" && (
          <div className="px-3 pb-5 ">
            <h2 className="mt-5 mb-3 font-semibold text-gray-600">
              Personal Info
            </h2>
            <div className="grid grid-cols-2 w-[180px] gap-3">
              {components?.personalComponents?.map((comp, index) => {
                return (
                  <DraggableComponent id={comp.id}>
                    <div className="flex flex-col items-center justify-center border py-7 gap-4 rounded-lg cursor-pointer">
                      <div>{comp?.icon}</div>
                      <p className="font-medium">{comp?.label}</p>
                    </div>
                  </DraggableComponent>
                );
              })}
            </div>
            <h2 className="mt-5 mb-3 font-semibold text-gray-600">
              Contact Info
            </h2>
            <div className="grid grid-cols-2 w-[180px] gap-3">
              {components?.contactComponents?.map((comp, index) => {
                return (
                  <DraggableComponent id={comp?.id}>
                    <div className="flex flex-col items-center justify-center py-7 border gap-4 rounded-lg cursor-pointer">
                      <div>{comp?.icon}</div>
                      <p className="font-medium">{comp?.label}</p>
                    </div>
                  </DraggableComponent>
                );
              })}
            </div>
            <h2 className="mt-5 mb-3 font-semibold text-gray-600">Submit</h2>
            <div className="grid grid-cols-2 w-[180px] gap-3">
              {components?.submitComponents?.map((comp, index) => {
                return (
                  <DraggableComponent id={comp.id}>
                    <div className="flex flex-col items-center justify-center py-7 border gap-4 rounded-lg cursor-pointer">
                      <div>{comp?.icon}</div>
                      <p className="font-medium">{comp?.label}</p>
                    </div>
                  </DraggableComponent>
                );
              })}
            </div>
            <h2 className="mt-5 mb-3 font-semibold text-gray-600">Address</h2>
            <div className="grid grid-cols-2 w-[180px] gap-3">
              {components?.addressComponents?.map((comp, index) => {
                return (
                  <DraggableComponent id={comp.id}>
                    <div className="flex flex-col items-center justify-center py-7 border gap-4 rounded-lg cursor-pointer">
                      <div>{comp?.icon}</div>
                      <p className="font-medium">{comp?.label}</p>
                    </div>
                  </DraggableComponent>
                );
              })}
            </div>
            <h2 className="mt-5 mb-3 font-semibold text-gray-600">
              Customized
            </h2>
            <div className="grid grid-cols-2 w-[180px] gap-3">
              {components?.customizedComponents?.map((comp, index) => {
                return (
                  <DraggableComponent id={comp.id}>
                    <div className="flex flex-col items-center justify-center py-7 border gap-4 rounded-lg cursor-pointer">
                      <div>{comp?.icon}</div>
                      <p className="font-medium">{comp?.label}</p>
                    </div>
                  </DraggableComponent>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorComonents;
