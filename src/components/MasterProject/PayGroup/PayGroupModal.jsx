import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Stack, Zoom } from "@mui/material";
import { MDBRow, MDBCol, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Swal from "sweetalert2";
import { buttonColors, secondaryColorTheme } from "../../../config";
import Loader from "../../Loader/Loader";
import { payGroupDetails, postPayGroup } from "../../../api/projectApi";
import SearchBox from "./SearchBox";
import { CustomScroll } from "react-custom-scroll";

const weeks = [
  { title: "Sun", iId: 1 },
  { title: "Mon", iId: 2 },
  { title: "Tue", iId: 3 },
  { title: "Wed", iId: 4 },
  { title: "Thr", iId: 5 },
  { title: "Fri", iId: 6 },
  { title: "Sat", iId: 7 },
];

export default function PayGroupModal({
  isOpen,
  data,
  handleCloseModal,
  handleSubmit,
  actions
}) {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [halfDay, setHalfDay] = useState("");
  const [dayLimit, setDayLimit] = useState("");
  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [select, setSelect] = useState([]);
  const [child, setChild] = useState(null);

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
      const resposne = await payGroupDetails({ iId: data });
      if (resposne.Status === "Success") {
        const myObject = JSON.parse(resposne.ResultData);
        setId(data);
        setName(myObject?.Table[0]?.sName);
        setHalfDay(myObject?.Table[0]?.fMin_hr_HalfDay);
        setDayLimit(myObject?.Table[0]?.fDayLimit);
        const iIdArray = myObject?.Table1.map((item) => item.iWeekly);
        setSelect(iIdArray);
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
    setId(0);
    setName("");
    setHalfDay("");
    setDayLimit("");
    setSelect([]);
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const handleSave = () => {
    let emptyFields = []
    if (!name) emptyFields.push("Name");
    if (!halfDay) emptyFields.push("Min. Hrs for half day");
    if (!dayLimit) emptyFields.push("Day Limit");
    if (!child.length) emptyFields.push("Weekly Off");
    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(`Please fill : ${emptyFields.join(", ")}.`);
      return;
    }
    const saveData = {
      iId: id,
      iUser,
      sName: name,
      fMin_hr_HalfDay: halfDay,
      fDayLimit: dayLimit,
      bEligibleFor_OT: 0,
      bEligibleFor_HOT: 0,
      sShift_STime: "No",
      sShift_ETime: "No",
      PayGroupDetails: child,
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
        const response = await postPayGroup(saveData);
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
        }else{
          setMessage(response?.MessageDescription? response?.MessageDescription : "Something went wrong" )
          handleOpenAlert()
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

  const handleChild = (data) => {
    const newData = [];
    for (const key in data) {
      if (data[key] === true) {
        newData.push({ iWeekly: parseInt(key) });
      }
    }

    setChild(newData);
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
                      <div
                        style={{
                          width: "auto",
                          flexDirection: "column",
                          height: "270px",
                          overflowY: "auto",

                          border: "1px solid #969999",
                          padding: "0 10px",
                          boxSizing: "border-box",
                          borderRadius: 5,
                        }}
                      >
                        <CustomScroll heightRelativeToParent="100%">
                          <SearchBox
                            initialItems={weeks}
                            selected={select}
                            params={"projects"}
                            handleChild={handleChild}
                          />
                        </CustomScroll>
                      </div>
                    </MDBCol>
                    <MDBCol>
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
                      </MDBRow>
                      <MDBRow className="mb-4">
                        <MDBCol>
                          <MDBInput
                            value={halfDay}
                            id="form6Example3"
                            type="number"
                            label="Min. Hrs for half day"
                            onChange={(e) => setHalfDay(e.target.value)}
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
                          <MDBInput
                            value={dayLimit}
                            id="form6Example3"
                            label="Day limit"
                            type="number"
                            onChange={(e) => setDayLimit(e.target.value)}
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
