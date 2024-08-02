import React, { useState, useEffect, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { GoClock } from "react-icons/go";
import { FaList } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { IoMdFolder } from "react-icons/io";
import axios from "../../axoisConfig";
import Forms from "./Forms";
import { toast } from "react-toastify";

const Folders = ({
  folders,
  loading,
  setFormEditor,
  setFormEdit,
  fetchFolders,
  fetchForms,
}) => {
  const { currentMode, DataGridStyles, BACKEND_URL, themeBgImg } =
    useStateContext();
  const [searchRows, setSearchRows] = useState(folders);
  const [folder, setFolder] = useState(null);
  const dataTableRef = useRef();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    setSearchRows(folders);
  }, [folders]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      // align: "left",
      minWidth: 30,
      flex: 1,
    },
    {
      field: "forms",
      headerName: "Forms",
      headerAlign: "center",
      minWidth: 30,
      flex: 1,
      renderCell: (row) => {
        return <div>{row?.row?.forms?.length}</div>;
      },
    },
    {
      field: "created_at",
      headerName: "Created At",
      headerAlign: "center",
      minWidth: 30,
      flex: 1,
      renderCell: (row) => {
        const createdDate = new Date(row?.row?.created_at);
        return <div>{createdDate?.toLocaleDateString()}</div>;
      },
    },
    {
      field: "",
      headerName: "",
      headerAlign: "center",
      minWidth: 40,
      maxWidth: 80,
      renderCell: () => {
        return <HiDotsVertical size={16} />;
      },
    },
  ];

  const deleteFolder = async (id) => {
    let token = localStorage?.getItem("auth-token");

    try {
      const res = await axios.delete(`${BACKEND_URL}/folders/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (res?.status) {
        toast.success("Folder is deleted Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchFolders();
        fetchForms();
      }
    } catch (error) {
      toast.error("Can't delete folder", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setFolder(null);
    }
  };

  const handleSearchChange = (e) => {
    const searchResults = folders?.filter((row) => {
      return (
        row?.name?.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        row?.created_at
          ?.toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.forms?.length.toString()?.includes(e?.target?.value.toLowerCase())
      );
    });

    setSearchRows(searchResults);
  };

  return (
    <>
      <Box
        sx={{
          ...DataGridStyles,
          // "& .MuiDataGrid-columnHeaders": {
          //   backgroundColor: "black",
          //   color: "white",
          //   width: "100%",
          // },
          // "& .MuiDataGrid-footerContainer": {
          //   borderTop: `0px`,
          //   borderRadius: "0px 0px 120px 120px",
          // },
        }}
        className={`${currentMode}-mode-datatable`}
      >
        {!folder ? (
          <div className="grid grid-cols-5 gap-5 mt-4 cursor-pointer select-none">
            {folders?.map((folder, index) => {
              return (
                <div
                  className={`flex items-center justify-between px-4 py-3 gap-4 ${
                    themeBgImg
                      ? currentMode === "dark"
                        ? "blur-bg-dark shadow-sm text-white hover:text-black"
                        : "blur-bg-light shadow-sm"
                      : currentMode === "dark"
                      ? "bg-dark-neu text-white hover:text-black"
                      : "bg-light-neu"
                  } rounded-lg hover:bg-neutral-300 `}
                  onClick={() => {
                    setForms(folder?.forms);
                    setFolder({ id: folder?.id, name: folder?.name });
                  }}
                >
                  <div className="flex items-center gap-2">
                    <IoMdFolder size={40} className="text-yellow-500" />
                    <h3>{folder?.name}</h3>
                  </div>
                  <div className="text-gray-700 font-medium">
                    {folder?.forms?.length}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Forms
            forms={forms}
            setFolder={setFolder}
            fetchForms={fetchFolders}
            setFormEditor={setFormEditor}
            setFormEdit={setFormEdit}
            folder={folder}
            deleteFolder={deleteFolder}
          />
        )}
      </Box>
    </>
  );
};

export default Folders;
