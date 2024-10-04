import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { buttonColors, secondaryColorTheme } from "../../config";
import { MDBInput } from "mdb-react-ui-kit";
import {
  DeleteRoles,
  getNextPrevRole,
  getRoleDetails_React,
  postRole_React,
} from "../../api/settingsApi";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import RoleTree from "./RoleTree";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: `${secondaryColorTheme}`, // Set text color
  backgroundColor: `${buttonColors}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

const buttonStyle2 = {
  textTransform: "none", // Set text transform to none for normal case
  color: ` ${buttonColors}`, // Set text color
  backgroundColor: `${secondaryColorTheme}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

export default function RoleDetails({ handleCloseModal, data, actions }) {
  const iUser = localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : "";
  const [iId, setIId] = useState(data);
  const [role, setRole] = useState("");
  const [child, setChild] = useState([]);
  const [menuAction, setMenuAction] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      if (iId !== 0) {
        const response = await getRoleDetails_React({ rId: iId });
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response.ResultData);
          setRole(myObject?.Table[0]?.sRoleName);
          setMenuAction(myObject?.Table1 || []);
        }
      } else {
        handleClear();
      }
      handleClose();
    };

    fetchData();
  }, [iId]);

  const handleClear = () => {
    setIId(0);
    setRole("");
    setMenuAction([]);
  };

  const handleChild = (data) => {
    setChild(data);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleAlertOpen = () => {
    setAlert(true);
  };

  const handleAlertClose = () => {
    setAlert(false);
  };

  const handleSave = async () => {
    const emptyFields = [];
    if (!role) emptyFields.push("Role Name ");
    if (!child.length) emptyFields.push("Actions");
    if (emptyFields.length > 0) {
      handleAlertOpen();
      setMessage(` ${emptyFields[0]} is required`);
      return;
    }
    const saveData = {
      iRoleId: iId,
      sRoleName: role,
      iUser,
      Role_Details: child,
    };

    Swal.fire({
      text: "Are you sure you want to save this?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await postRole_React(saveData);
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Saved",
            text: "Saved successfully!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          handleAllClear();
        } else {
          handleAlertOpen();
          setMessage(
            response?.MessageDescription
              ? response?.MessageDescription
              : "Something went wrong"
          );
        }
      }
    });
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        const response = await DeleteRoles({
          iId: iId,
          iUser,
        });
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Deleted",
            text: "Your file has been deleted!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          handleAllClear();
        } else {
          setMessage(response?.MessageDescription);
          handleAlertOpen();
        }
      }
    });
  };

  const handlePages = async (iType) => {
    handleOpen();
    const response = await getNextPrevRole({rId:iId,iType });
    handleClose();
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setIId(myObject[0]?.iRoleId);
    } else {
      setMessage("Not Found");
      handleAlertOpen();
    }
  };

  const handleAllClear = () => {
    handleClear();
    handleCloseModal();
  };

  const renderButton = (actionId, label, onClick, icon, disabled = false,type, style = buttonStyle) => {
    return actions.some(action => action.iActionId === actionId) ? (
      <Button
        onClick={onClick}
        type={type}
        variant="contained"
        disabled={disabled}
        startIcon={icon}
        style={disabled ? buttonStyle2 : style}
      >
        {label}
      </Button>
    ) : null;
  };

  return (
    <Box
      sx={{
        width: "auto",
        paddingLeft: 2,
        paddingRight: 2,
        paddingBottom: 8,
        zIndex: 1,
        minHeight: "590px",
      }}
    >
      <Stack direction="row" spacing={1} padding={1} justifyContent="flex-end">
        <Typography
          sx={{ flex: "1 1 auto", color: "white" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Role
        </Typography>

        
        { renderButton(2, "New", handleClear, <AddIcon />)}
      {renderButton(8, "Save",handleSave, <SaveIcon />,null, "submit"  )}
      {renderButton(4, "Delete", handleDelete, <DeleteIcon />, iId === 0 )}
      {renderButton(9, "Prev",()=>handlePages(2), <UndoIcon />,  )}
      {renderButton(10, "Next", ()=>handlePages(1), <RedoIcon />, )}
    
        <Button
          onClick={handleAllClear}
          variant="contained"
          startIcon={<CloseIcon />}
          style={buttonStyle}
        >
          Close
        </Button>
      </Stack>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div>
          <div className="row">
            <div className="flex flex-wrap ">
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 2, width: "35ch" },
                }}
                noValidate
                autoComplete="auto"
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MDBInput
                    id="form6Example3"
                    label="Role Name *"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    labelStyle={{
                      fontSize: "15px",
                    }}
                    autoComplete="off"
                    style={{
                      cursor: "text",
                      color: "inherit",
                      backgroundColor: "transparent",
                      border: "none",
                      borderBottom: "1px solid #ced4da",
                    }}
                  />
                </div>
              </Box>
            </div>
            <RoleTree
              menuAction={menuAction}
              id={iId}
              handleChild={handleChild}
            />
          </div>
        </div>
      </Paper>
      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage
        open={alert}
        handleClose={handleAlertClose}
        message={message}
      />
    </Box>
  );
}
