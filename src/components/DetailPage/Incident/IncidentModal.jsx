import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Stack,
  Zoom,
} from "@mui/material";

import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { styled } from "@mui/material/styles";
import { buttonColors, secondaryColorTheme } from "../../../config";
import { getEmployee } from "../../../api/apiCall";
import AutoComplete2 from "../../AutoComplete/AutoComplete2";
import Loader from "../../Loader/Loader";
import AutoComplete3 from "../../AutoComplete/AutoComplete3";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

export default function IncidentModal({
  isOpen,
  data,
  handleCloseModal,
  handleRowData,
  rowIndex,
}) {
  const [type, setType] = useState();
  const [actionBy, setActionBy] = useState();
  const [EmployeeCode, setEmployeeCode] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [transId, setTransId] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [corrective, setCorrective] = useState("");
  const [warning, setWarning] = useState(false);
  const [newRowIndex, setNewRowIndex] = useState(0)
  const [message, setMessage] = useState("");

  const modalStyle = {
    display: isOpen ? "block" : "none",
  };

  const iUser = Number(localStorage.getItem("userId"));

  useEffect(() => {
    handleOpen();
    if (data && Object.keys(data).length > 0) {
      setNewRowIndex(rowIndex)
      setTransId(data?.iTransId || 0);
      setActionBy(
        {
          iId: data?.iResponsible,
          sName: data?.Responsible,
          sCode: data?.ResponsibleCode,
        } || ""
      );
      setEmployeeCode(data?.ResponsibleCode || "");
      setType({ iId: data?.iAction } || "");
      setCorrective(data?.sAction_Des || "");
      setCloseDate(data?.CloseDate || "");
    } else {
      handleClear();
    }
    handleClose();
  }, [data, isOpen]);

  const buttonStyle = {
    textTransform: "none",
    color: `${buttonColors}`,
    backgroundColor: `${secondaryColorTheme}`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  const handleClear = () => {
    setNewRowIndex(-1)
    setTransId(0);
    setActionBy("");
    setEmployeeCode("");
    setType("");
    setCorrective("");
    setCloseDate("");
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const handleSave = (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!closeDate) emptyFields.push("Close Date");
    if (!actionBy?.iId) emptyFields.push("Responsible");
    if (!type) emptyFields.push("Type");
    if (!EmployeeCode) emptyFields.push("Employee Code");
    if (!corrective) emptyFields.push("Corrective and preventive actions");

    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(
        `Please fill in the following mandatory fields: ${emptyFields.join(
          ", "
        )}.`
      );
      return;
    }

    const saveData = {
      CloseDate: closeDate,
      iResponsible: actionBy?.iId,
      iAction: type?.iId,
      sActionBy_Code: EmployeeCode,
      Responsible: actionBy?.sName,
      ResponsibleCode: actionBy?.sCode,
      iTransId: transId,
      sAction_Des: corrective,
      
    };
    handleRowData(saveData, newRowIndex);
    handleAllClear();
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  const handleOpenAlert = () => {
    setWarning(true);
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
                  <Button
                    onClick={handleClear}
                    variant="contained"
                    startIcon={<AddIcon />}
                    style={buttonStyle}
                  >
                    New
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    style={buttonStyle}
                  >
                    Save
                  </Button>
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
                      <AutoComplete3
                        label="Type"
                        value={type}
                        onChangeName={setType}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        required
                        value={closeDate}
                        id="form6Example6"
                        type="text"
                        autoComplete="off"
                        label="Close Date *"
                        onChange={(e) => setCloseDate(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <AutoComplete2
                        required
                        id="form6Example4"
                        value={actionBy}
                        setValue={setActionBy}
                        apiName={getEmployee}
                        setValue2={setEmployeeCode}
                        field="Responsible"
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        required
                        value={EmployeeCode}
                        id="form6Example3"
                        autoComplete="off"
                        label="Employee Code *"
                        onChange={(e) => setEmployeeCode(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBTextArea
                        required
                        value={corrective}
                        id="form6Example3"
                        autoComplete="off"
                        label="Corrective and preventive actions *"
                        rows={2}
                        maxLength={1000}
                        onChange={(e) => setCorrective(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
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
