import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Stack, Zoom } from "@mui/material";
import { MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Swal from "sweetalert2";
import { buttonColors, secondaryColorTheme } from "../../../config";
import Loader from "../../Loader/Loader";
import { postP_Holiday, publicHolidayDetails } from "../../../api/projectApi";

export default function PublicHolidayModal({
  isOpen,
  data,
  handleCloseModal,
  handleSubmit,
  actions
}) {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
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
      const response = await publicHolidayDetails({ iId: data });

      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        setId(data);
        setName(myObject?.Table[0]?.sName);
        setDate(formatDate(myObject?.Table[0]?.sDate));
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
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setId(0);
    setName("");
    setDate(formattedDate);
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const handleSave = () => {
    let emptyFields = []
    if (!name) emptyFields.push("Name");
    if (!date) emptyFields.push("Date");

    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(`Please fill : ${emptyFields.join(", ")}.`);
      return;
    }
    const saveData = {
      iId: id,
      iUser,
      sName: name,
      sDate: date,
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
        const response = await postP_Holiday(saveData);
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

  const formatDate = (inputDate) => {
    if (!inputDate) return ""; // handle empty date

    const parts = inputDate.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    } else {
      // handle invalid date format
      console.error(`Invalid date format: ${inputDate}`);
      return "";
    }
  };

  const renderButton = (actionId, label, onClick, icon, disabled = false, style = buttonStyle) => {
    return actions.some(action => action.iActionId === actionId) ? (
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
                   {renderButton(8, "Save",handleSave, <SaveIcon />,  )}
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
                      <MDBInput
                        value={date}
                        id="form6Example3"
                        label="Date"
                        type="date"
                        onChange={(e) => setDate(e.target.value)}
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
                        onKeyDown={(e) => e.preventDefault()}
                        onClick={(e) => e.target.showPicker?.()} // This line is for modern browsers
                        onFocus={(e) => e.target.showPicker?.()}
                      />
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
