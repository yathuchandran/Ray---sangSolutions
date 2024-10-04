import React, { useEffect, useState } from "react";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import DoneIcon from "@mui/icons-material/Done";
import {
  Box,
  Button,
  Stack,
  Zoom,
} from "@mui/material";
import { buttonColors, secondaryColorTheme } from "../../config";
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBTextArea,
} from "mdb-react-ui-kit";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Swal from "sweetalert2";
import { getApproveDevice, getDeviceDetails, postDevice } from "../../api/deviceMangerApi";
import { getCompany, getProject } from "../../api/apiCall";
import AutoComplete from "../AutoComplete/AutoComplete";
import AutoComplete4 from "../AutoComplete/AutoComplete4";

export default function DeviceDetails({
  isOpen,
  data,
  handleCloseModal,
  handleSubmit,
  actions
}) {
  const [deviceId, setDeviceId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [company, setCompany] = useState("");

  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  const handleOpenAlert = () => {
    setWarning(true);
  };

  const modalStyle = {
    display: isOpen ? "block" : "none",
  };

  const iUser = Number(localStorage.getItem("userId"));

  const fetchData = async () => {
    handleOpen();
    if (data !== 0) {
      const resposne = await getDeviceDetails({ iId: data });
      if (resposne?.Status === "Success") {
        const myObject = JSON.parse(resposne?.ResultData);
        setDeviceId(myObject?.Table[0]?.sDeviceId);
        setName(myObject?.Table[0]?.sDeviceName);
        setProject({
          sName: myObject?.Table[0]?.sProject,
          iId: myObject?.Table[0]?.iProject,
        });
        setCompany({
          sName: myObject?.Table[0]?.sCompany,
          iId: myObject?.Table[0]?.iCompany,
        });
        setDescription(myObject?.Table[0]?.sDescription || "");
      }
    } else {
      handleClear();
    }
    handleClose();
  };

  useEffect(() => {
    fetchData();
  }, [data, isOpen]);

  const buttonStyle = {
    textTransform: "none", // Set text transform to none for normal case
    color: `${buttonColors}`, // Set text color
    backgroundColor: `${secondaryColorTheme}`, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    fontSize: "12px",
    padding: "6px 10px",
  };

  const handleClear = () => {
    setDeviceId("");
    setName("");
    setProject("");
    setCompany("");
    setDescription("");
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const handleSave = () => {
    const saveData = {
      iId: data,
      sDeviceId: deviceId,
      sDeviceName: name,
      iUser,
      iCompany: company.iId,
      iProject: project.iId,
      sDescription: description,
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Save this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await postDevice(saveData);
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Saved",
            text: "Your file has been Saved!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            handleSubmit();
            handleAllClear();
          });
        }
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleApprove = async (type) => {
    let message = "";

    if (type === 2) {
      const { value: remarks } = await Swal.fire({
        title: "Enter Remarks",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
          maxlength: 200,
          autocomplete: "off", // Disable suggestions
        },
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        showCancelButton: true,
        confirmButtonText: `Add`,
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          return login;
        },
      });

      if (remarks) {
        message = remarks;
      } else {
        return; // Exit if no remarks were provided or the dialog was cancelled
      }
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${type === 1 ? "Approve" : "Reject"} this!`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        handleOpen();
        const response = await getApproveDevice({
          iId: data,
          iUser,
          istatus: type,
          sRemarks: message,
        });
         handleClose()
        if (response?.Status === "Success") {
          Swal.fire({
            icon: "success",
            title: type === 1 ? "Approved" : "Rejected",
            showConfirmButton: false,
            timer: 1500,
          });
          handleSubmit();
          handleAllClear();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    });
  };

  const renderButton = (actionId, label, onClick, icon, disabled = false, style = buttonStyle) => {
    return actions.some(action => action.iActionId === actionId) ? (
      <Button
        onClick={onClick}
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
    <div>
      <div
        className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
        style={{
          display: isOpen ? "block" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      ></div>

      <Zoom in={isOpen} timeout={isOpen ? 400 : 300}>
        <div
          className={`modal ${isOpen ? "modal-open" : ""}`}
          style={modalStyle}
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <form>
                <Stack
                  direction="row"
                  spacing={1}
                  padding={2}
                  justifyContent="flex-end"
                >
                 
                  {renderButton(8, "Save", handleSave, <SaveIcon />,)} 
                  {renderButton(5, "Approve", () => handleApprove(1), <DoneIcon />,)} 
                  {renderButton(6, "Reject", () => handleApprove(2), <DoDisturbIcon />,)}
   
                  <Button
                    onClick={handleAllClear}
                    variant="contained"
                    startIcon={<CloseIcon />}
                    style={buttonStyle}
                  >
                    Close
                  </Button>
                </Stack>
                <Box
                  sx={{
                    width: "auto",
                    marginTop: 1,
                    padding: 3,
                    zIndex: 1,
                    backgroundColor: "#ffff",
                    borderRadius: 2,
                  }}
                >
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        value={deviceId}
                        id="form6Example3"
                        label="Device ID *"
                        onChange={(e) => setDeviceId(e.target.value)}
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
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        required
                        value={name}
                        id="form6Example3"
                        label="Device Name *"
                        onChange={(e) => setName(e.target.value)}
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
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <AutoComplete
                        apiName={getProject}
                        value={project}
                        onChangeName={setProject}
                      />
                    </MDBCol>
                    <MDBCol>
                      <AutoComplete4
                        id="form6Example4"
                        value={company}
                        setValue={setCompany}
                        apiName={getCompany}
                        field="Company"
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBTextArea
                        id={`form3Example`}
                        type="text"
                        label="Description"
                        size="small"
                        autoComplete="off"
                        rows={2}
                        maxLength={500}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                      {/* <MDBInput
                        value={description}
                        id="form6Example3"
                        label="Description"
                        onChange={(e) => setDescription(e.target.value)}
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
                      /> */}
                    </MDBCol>
                  </MDBRow>
                </Box>
              </form>
            </div>
          </div>
        </div>
      </Zoom>

      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </div>
  );
}
