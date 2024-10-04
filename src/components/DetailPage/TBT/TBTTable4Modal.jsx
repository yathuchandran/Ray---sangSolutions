import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Stack, Zoom } from "@mui/material";
import { MDBRow, MDBCol, MDBTextArea } from "mdb-react-ui-kit";
import { buttonColors, secondaryColorTheme } from "../../../config";
import Loader from "../../Loader/Loader";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

export default function TBTTable4Modal({
  isOpen,
  data,
  handleCloseModal,
  handleRowData,
  rowIndex,
}) {
  const [task, setTask] = useState("");
  const [hazard, setHazard] = useState("");
  const [control, setControl] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [transId, setTransId] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [newRowIndex, setNewRowIndex] = useState(0)

  const modalStyle = {
    display: isOpen ? "block" : "none",
  };

  useEffect(() => {
    handleOpen();
    if (data && Object.keys(data).length > 0) {
      setNewRowIndex(rowIndex)
      setTransId(data?.iTransDtId);
      setHazard(data?.sHazards);
      setTask(data?.sTask);
      setControl(data?.sControls);
      setResponsibilities(data?.sResponsibilities);
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
    setHazard("");
    setTask("");
    setControl("");
    setResponsibilities("");
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const handleSave = (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!task) emptyFields.push("Task");
    if (!hazard) emptyFields.push("Hazard");
    if (!control) emptyFields.push("Control");
    if (!responsibilities) emptyFields.push("Responsibilities");

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
      iTransDtId: transId,
      sTask: task,
      sHazards: hazard,
      sControls: control,
      sResponsibilities: responsibilities,
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
                      <MDBTextArea
                        required
                        value={task}
                        id="form6Example3"
                        label="Enter task *"
                        autoComplete="off"
                        rows={2}
                        maxLength={200}
                        onChange={(e) => setTask(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBTextArea
                        required
                        value={hazard}
                        id="form6Example3"
                        autoComplete="off"
                        label="Enter hazard *"
                        maxLength={200}
                        rows={2}
                        onChange={(e) => setHazard(e.target.value)}
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
                        value={control}
                        id="form6Example3"
                        autoComplete="off"
                        label="Enter control *"
                        rows={2}
                        maxLength={800}
                        onChange={(e) => setControl(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBTextArea
                        required
                        value={responsibilities}
                        id="form6Example3"
                        autoComplete="off"
                        label="Enter responsibilities *"
                        rows={2}
                        maxLength={100}
                        onChange={(e) => setResponsibilities(e.target.value)}
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
