import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { buttonColors, secondaryColorTheme } from "../../config";
import { MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import { getEmployeeDetails, postUpdateEmployee } from "../../api/projectApi";
import QRCode from "qrcode.react";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const radioButtonStyle = {
  "& .MuiSvgIcon-root": {
    fontSize: 16,
  },
  "& .MuiFormControlLabel-label": {
    fontSize: 14,
  },
  color: "gray",
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EmployeeModal({ isOpen, data, handleCloseModal, handleSubmit, actions }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const [checkedHot, setCheckedHot] = useState(false);
  const [checkedOt, setCheckedOt] = useState(false);
  const [supervisor, setSupervisor] = useState(null);

  const [open, setOpen] = useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const qrRef = useRef(null);

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  const handleOpenAlert = () => {
    setWarning(true);
  };

  const handleCheckboxChangeHot = (event) => {
    setCheckedHot(event.target.checked);
  };

  const handleCheckboxChangeOt = (event) => {
    setCheckedOt(event.target.checked);
  };

  const modalStyle = {
    display: isOpen ? "block" : "none",
  };

  const iUser = Number(localStorage.getItem("userId"));

  const fetchData = async () => {
    handleOpen();
    if (data !== 0) {
      const response = await getEmployeeDetails({ iId: data });
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        setName(myObject?.Table[0]?.sName);
        setCode(myObject?.Table[0]?.sCode);
        setText(myObject?.Table[0]?.sBarcode);
        setCheckedHot(myObject?.Table[0]?.bHOT);
        setCheckedOt(myObject?.Table[0]?.bOT);
        setSupervisor(myObject?.Table[0]?.iIsSupervisor);
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
    textTransform: "none",
    color: `${buttonColors}`,
    backgroundColor: `${secondaryColorTheme}`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  const handleClear = () => {
    setName("");
    setCode("");
    setText("");
    setCheckedHot(false);
    setCheckedOt(false);
    setSupervisor(null);
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const handleSave = () => {
    const saveData = {
      iId: data,
      bHOT: checkedHot ? 1 : 0,
      bOT: checkedOt ? 1 : 0,
      iUser,
      IsSupervisor: supervisor,
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
        const response = await postUpdateEmployee(saveData);
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

  const downloadQRCode = () => {
    const qrCodeElement = qrRef.current.querySelector("canvas");
    const qrSize = 1000; // QR code size
    const borderSize = 50; // Border size

    const canvas = document.createElement("canvas");
    canvas.width = qrSize + 2 * borderSize;
    canvas.height = qrSize + 2 * borderSize;
    const context = canvas.getContext("2d");

    // Draw a white background with a white border
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the existing QR code onto the new canvas
    context.drawImage(qrCodeElement, borderSize, borderSize, qrSize, qrSize);

    const qrCodeURL = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = "QR_Code.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };

  const renderButton = (actionId, label, onClick, icon, disabled = false, style = buttonStyle) => {
    return actions.some((action) => action.iActionId === actionId) ? (
      <Button
        onClick={onClick}
        variant="contained"
        disabled={disabled}
        startIcon={icon}
        style={buttonStyle}
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
        <div className={`modal ${isOpen ? "modal-open" : ""}`} style={modalStyle}>
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <form>
                <Stack direction="row" spacing={1} padding={2} justifyContent="flex-end">
                  {renderButton(8, "Save", handleSave, <SaveIcon />)}
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
                        readOnly
                        value={name}
                        id="form6Example3"
                        label="Name"
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
                    <MDBCol>
                      <FormGroup>
                        <FormControlLabel
                          sx={radioButtonStyle}
                          control={
                            <Checkbox checked={checkedHot} onChange={handleCheckboxChangeHot} />
                          }
                          label="HOT"
                        />
                      </FormGroup>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        readOnly
                        value={code}
                        id="form6Example3"
                        label="Code"
                        onChange={(e) => setCode(e.target.value)}
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
                      <FormGroup>
                        <FormControlLabel
                          sx={radioButtonStyle}
                          control={<Checkbox checked={checkedOt} onChange={handleCheckboxChangeOt} />}
                          label="OT"
                        />
                      </FormGroup>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        readOnly
                        value={text}
                        id="form6Example3"
                        label="Text"
                        onChange={(e) => setText(e.target.value)}
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
                      <FormControl>
                        <FormLabel
                          sx={{
                            fontSize: "14px",
                          }}
                          id="demo-row-radio-buttons-group-label"
                        >
                          Is Supervisor
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                            sx={radioButtonStyle}
                            checked={supervisor === 1}
                            onChange={() => setSupervisor(1)}
                          />
                          <FormControlLabel
                            value="N/A"
                            control={<Radio />}
                            label="N/A"
                            sx={radioButtonStyle}
                            checked={supervisor === 0}
                            onChange={() => setSupervisor(0)}
                          />
                        </RadioGroup>
                      </FormControl>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="justify-content-center mb-1">
                    <MDBCol>
                      <div className="App d-flex justify-content-center" ref={qrRef}>
                        <QRCode id="qrCodeEl" size={200} value={text} bgColor="#FFFFFF" level="H" />
                      </div>
                      <Button
                        onClick={downloadQRCode}
                        className="d-block mx-auto mt-1"
                        size="sm"
                        color="primary"
                        sx={{ textTransform: "none" }}
                      >
                        Download QR Code
                      </Button>
                    </MDBCol>
                  </MDBRow>
                </Box>
              </form>
            </div>
          </div>
        </div>
      </Zoom>

      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage open={warning} handleClose={handleCloseAlert} message={message} />
    </div>
  );
}
