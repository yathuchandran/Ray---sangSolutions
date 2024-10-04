import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  tooltipClasses,
  withStyles,
} from "@mui/material";

import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { buttonColors, secondaryColorTheme } from "../../../config";
import Loader from "../../../components/Loader/Loader";
import AutoComplete2 from "../AutoComplete/AutoComplete2";
import BasicDateTimePicker from "../DateAndTime";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import {
  PostAttendance,
  UpdateAttendanceProject,
} from "../../../api/apiHelper";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AttendanceNew({
  isOpen,
  handleNewClose,
  formDataEdit,
  mode,
  actions
}) {
  const iUser = localStorage.getItem("userId")? Number(localStorage.getItem("userId")) : ""
  const getInitialFormData = () => {
    
    const today = dayjs().format("DD-MM-YYYY");

    // Current time in HH:mm:ss format
    const nowTime = dayjs().format("HH:mm:ss");

    return {
      iId: 0,
      iAttendance_In: 0, //for mobile
      iAttendance_Out: 0, //for mobile
      iProject: 0,
      sProject: "", //not required in post
      iEmployee: 0,
      sEmployee: "", //not required in post
      sCheckInDate: today,
      sCheckInTime: nowTime,
      sCheckOutDate: today,
      sCheckOutTime: nowTime,
      iSupervisor: 0,
      sSupervisor: "", //not required in post
      sSite: "",
      iUser: iUser,
      sHrs: "0",
    };
  };

  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [formData, setFormData] = useState([]);
  const [open, setOpen] = React.useState(false); //loader
  const [mode1, setMode1] = useState("");
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");

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
  
  const modalStyle = {
    display: isOpen ? "block" : "none",
    position:"absolute"
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
  const newButtonClick = () => {
    setFormData({
      // Spread to fill in any missing fields with defaults
      ...getInitialFormData(),
    });
    setMode1("new");
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //post date validation and convert to yyyymmdd
  function validateDate(date) {
  
    return dayjs(date, "DD-MM-YYYY").isValid()
      ? dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD")
      : "";
  }
  
  function validateTime(time) {
  
    return dayjs(time, "HH:mm:ss", true).isValid() ? time : "";
  }

  //checking Date and Time Valid
  function validateDate1(date) {
    
     return dayjs(date, "DD-MM-YYYY").isValid()
       ? date  : "";
   }
   function validateTime1(time) {
  
    return dayjs(time, "HH:mm:ss", true).isValid() ? time : "";
  }
  
  const handleSaveAccount = async () => {
    if (!isOnline) {
      // Swal.fire({
      //   title: "Error!",
      //   text: "No Internet Connection",
      //   icon: "error",
      //   confirmButtonText: "Ok",
      //   confirmButtonColor: secondaryColorTheme,
      // });
      handleOpenAlert();
      setMessage(
        `No Internet Connection`
      );
      return; // Return early if offline
    }
    if (!formData.iEmployee) {
      // Swal.fire({
      //   title: "Error!",
      //   text: "Employee is required",
      //   icon: "error",
      //   confirmButtonText: "Ok",
      //   confirmButtonColor: secondaryColorTheme,
      // });
      handleOpenAlert();
      setMessage(
        `Employee is required`
      );
      return;
    }
    if (!formData.iProject) {
      // Swal.fire({
      //   title: "Error!",
      //   text: "Project is required",
      //   icon: "error",
      //   confirmButtonText: "Ok",
      //   confirmButtonColor: secondaryColorTheme,
      // });
      handleOpenAlert();
      setMessage(
        `Project is required`
      );
      return;
    }
    const checkOutDate = dayjs(formData.sCheckOutDate, "DD-MM-YYYY");
  const todayDate = dayjs();

  // Check if checkOutDate is after today
  if (checkOutDate.isAfter(todayDate, 'day')) {
    // Swal.fire({
    //   title: "Warning!",
    //   text: "Check Out Date cannot be a future date.",
    //   icon: "warning",
    //   confirmButtonText: "Ok",
    //   confirmButtonColor: secondaryColorTheme,
    // });
    handleOpenAlert();
      setMessage(
        `Check Out Date cannot be a future date`
      );
    return; // Stop execution if checkOutDate is a future date
  }
    if (!formData.sHrs  || Number(formData.sHrs) < 0) {
      // Swal.fire({
      //   title: "Error!",
      //   text: "The number of hours is not valid.",
      //   icon: "error",
      //   confirmButtonText: "Ok",
      //   confirmButtonColor: secondaryColorTheme,
      // });
      handleOpenAlert();
      setMessage(
        `The number of hours is not valid`
      );
      return;
    }

    try {
      
        
  
      // Merge valid form data fields with other formData
      const updatedFormData = {
       ...formData,
       sCheckInDate: validateDate(formData.sCheckInDate),
       sCheckInTime: validateTime(formData.sCheckInTime),
       sCheckOutDate: validateDate(formData.sCheckOutDate),
       sCheckOutTime: validateTime(formData.sCheckOutTime)
      };
  


      const response = await PostAttendance(updatedFormData);
      if (response.MessageDescription === "Inserted successfully") {
        Swal.fire({
          title: "Saved",
          text: "Inserted successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          handleNewClose();
        });
      } else if (response.MessageDescription === "Updated successfully") {
        Swal.fire({
          title: "Updated",
          text: "Updated successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          handleNewClose();
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.MessageDescription,
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProjectUpdate = async () => {
    if (!isOnline) {
      // Swal.fire({
      //   title: "Error!",
      //   text: "No Internet Connection",
      //   icon: "error",
      //   confirmButtonText: "Ok",
      //   confirmButtonColor: secondaryColorTheme,
      // });
      handleOpenAlert();
      setMessage(
        `No Internet Connection`
      );
      return; // Return early if offline
    }

    if (!formData.iProject) {
      // Swal.fire({
      //   title: "Error!",
      //   text: "Project is required",
      //   icon: "error",
      //   confirmButtonText: "Ok",
      //   confirmButtonColor: secondaryColorTheme,
      // });
      handleOpenAlert();
      setMessage(
        `Project is required`
      );
      return;
    }

    try {
      const response = await UpdateAttendanceProject(formData);
      if (response.MessageDescription === "Inserted successfully") {
        Swal.fire({
          title: "Saved",
          text: "Inserted successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          handleNewClose();
        });
      } else if (response.MessageDescription === "Updated successfully") {
        Swal.fire({
          title: "Updated",
          text: "Updated successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          handleNewClose();
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.MessageDescription,
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setMode1(mode);
  }, [mode]);

  //network errror
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
    };

    const goOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
 

  useEffect(() => {
    const handleCalculateTimeDifference = () => {
      const formatStr = "DD-MM-YYYY HH:mm:ss";
      const startTime = dayjs(`${formData.sCheckInDate} ${formData.sCheckInTime}`, formatStr);
      const endTime = dayjs(`${formData.sCheckOutDate} ${formData.sCheckOutTime}`, formatStr);
  
      // Check if the dates are valid before proceeding
      if (!startTime.isValid() || !endTime.isValid()) {
        //console.error("Invalid date format");
        setFormData((prevFormData) => ({
          ...prevFormData,
          sHrs: "0", // Reset hours if invalid
        }));
        return;
      }
  
      const timeDifference = endTime.diff(startTime, "second");
      const hours = timeDifference / 3600;

      if (hours < 0) {
        // Swal.fire({
        //   title: "Error!",
        //   text: "Checkout time should be greater than check-in time.",
        //   icon: "error",
        //   confirmButtonText: "Ok",
        //   confirmButtonColor: secondaryColorTheme,
        // });
        setFormData((prevFormData) => ({
          ...prevFormData,
          sHrs: hours, // Reset hours if invalid
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          sHrs: hours.toFixed(2),
        }));
      }
    };
  
    handleCalculateTimeDifference();
  }, [formData.sCheckInDate, formData.sCheckInTime, formData.sCheckOutDate, formData.sCheckOutTime]);
  


  //mode based fill data
  useEffect(() => {
    if (mode1 === "edit" && formDataEdit) {
      
      const editData = Array.isArray(formDataEdit)
        ? formDataEdit[0]
        : formDataEdit;

      if (typeof editData !== "object" || editData === null) {
        console.error("editData is not an object:", editData);
        return;
      }
      setFormData({
        // Spread to fill in any missing fields with defaults

        iId: editData.iId,
        iAttendance_In: editData.iAttendance_In, //for mobile
        iAttendance_Out: editData.iAttendance_Out, //for mobile
        iProject: editData.iProject,
        sProject: editData.sProject, //not required in post
        iEmployee: editData.iEmployee,
        sEmployee: editData.sEmployee, //not required in post
        sCheckInDate: validateDate1(editData.sCheckInDate),
        sCheckInTime: validateTime1(editData.sCheckinTime),
        sCheckOutDate: editData.sCheckOutDate,
        sCheckOutTime: editData.sCheckOutTime,
        iSupervisor: editData.iSupervisor,
        sSupervisor: editData?.sSupervisor??"", //not required in post
        iUser: iUser,
        sSite: editData?.sSite,
        sHrs: "0",
      });
    } else if (mode1 === "editProject" && formDataEdit) {
      
      const editData = Array.isArray(formDataEdit) ? formDataEdit : [formDataEdit];

      if (typeof editData !== "object" || editData === null) {
        console.error("editData is not an object:", editData);
        return;
      }
      const iIds = editData.map((row) => [
        row.iAttendance_In,
        row.iAttendance_Out,
      ]);
      //const updatediId = [editData.iAttendance_In, editData.iAttendance_Out];
      const stringWithComma = iIds.join(",");

      setFormData({
        // Spread to fill in any missing fields with defaults

        iId: stringWithComma,
        iUser: iUser,
        iProject: editData[0].iProject,
        sProject: editData[0].sProject,
      });
    } else if(mode1 === "new") {
      
      setFormData(getInitialFormData());
    }
  }, [mode1, formDataEdit]);


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
          <div style={{marginTop:"20%"}} className="modal-dialog  modal-md">
            <div className="modal-content">
              <Stack
                direction="row"
                spacing={1}
                padding={1}
                justifyContent="flex-end"
              >
                {(mode1 === "new" || mode1 === "edit") && (
                  <>
                    {/* <Button
                      onClick={newButtonClick}
                      variant="contained"
                      startIcon={<AddIcon />}
                      style={buttonStyle}
                    >
                      New
                    </Button>

                    <Button
                      // type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      style={buttonStyle}
                      onClick={handleSaveAccount}
                    >
                      Save
                    </Button> */}
                    {renderButton(2, "New", newButtonClick, <AddIcon />)}
                    {renderButton(8, "Save", handleSaveAccount, <SaveIcon />)}
     
      
                  </>
                )}
                {mode1 === "editProject" && (
                  // <Button
                  //   // type="submit"
                  //   variant="contained"
                  //   startIcon={<SaveIcon />}
                  //   style={buttonStyle}
                  //   onClick={handleProjectUpdate}
                  // >
                  //   Save
                  // </Button>
                 <> {renderButton(8, "Save", handleProjectUpdate, <SaveIcon />)}</>
                )}
                <Button
                  onClick={handleNewClose}
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
                {mode1 !== "editProject" && (
                  <div className="attendanceNewContainer">
                    <MDBCol>
                      {mode1 !== "edit" && (
                        <AutoComplete2
                          formData={formData}
                          setFormData={setFormData}
                          autoId={`Employee`}
                          label={"Employee/Supervisor"}
                          apiKey={"GetAllEmployee?"}
                          formDataName={"sEmployee"}
                          formDataiId={"iEmployee"}
                          required={true}
                        />
                      )}
                      {mode1 === "edit" && (
                        <MDBInput
                          required
                          value={formData.sEmployee}
                          id="form6Example3"
                          label="Employee/Supervisor"
                          name="sEmployee"
                          disabled
                          maxLength={100}
                         
                        />
                      )}
                    </MDBCol>

                    <MDBCol>
                      <AutoComplete2
                        formData={formData}
                        setFormData={setFormData}
                        autoId={`projects`}
                        label={"Projects"}
                        apiKey={"GetProject?iStatus=1"}
                        formDataName={"sProject"}
                        formDataiId={"iProject"}
                        required={true}
                      />
                    </MDBCol>

                    <MDBCol>
                    {mode1 !== "edit" && (
                      <AutoComplete2
                        formData={formData}
                        setFormData={setFormData}
                        autoId={`Supervisor`}
                        label={"Supervisor"}
                        apiKey={"GetSupervisor?"}
                        formDataName={"sSupervisor"}
                        formDataiId={"iSupervisor"}
                      />
                    )}
                    {mode1 === "edit" && (
                        <MDBInput
                          required
                          value={formData?.sSupervisor || ""}
                          id="form6Example3"
                          label="Supervisor"
                          name="sSupervisor"
                          disabled
                          maxLength={100}
                         
                        />
                      )}
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        required
                        value={formData?.sSite || ""}
                        id="form6Example3"
                        label="Site"
                        name="sSite"
                        onChange={handleInputChange}
                        maxLength={100}
                        disabled={mode1 === "edit"}
                      />
                    </MDBCol>

                    <MDBCol>
                      <Box>
                        <BasicDateTimePicker
                          formData={formData}
                          setFormData={setFormData}
                          formDataName1={"sCheckInDate"}
                          formDataName2={"sCheckInTime"}
                          label={"Check IN"}
                        />
                      </Box>
                    </MDBCol>
                    <MDBCol>
                      <Box>
                        <BasicDateTimePicker
                          formData={formData}
                          setFormData={setFormData}
                          formDataName1={"sCheckOutDate"}
                          formDataName2={"sCheckOutTime"}
                          label={"Check OUT"}
                        />
                      </Box>
                    </MDBCol>

                    <MDBCol>
                      <MDBInput
                        required
                        id={`AttennceTotalHours`}
                        disabled
                        size="small"
                        label="No. of Hrs"
                        value={
                          isNaN(parseFloat(formData.sHrs)) ? "" : formData.sHrs
                        }
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </MDBCol>
                  </div>
                )}
                {mode1 === "editProject" && (
                  <div className="attendanceNewContainer">
                    <MDBCol>
                    <AutoComplete2
                       formData={formData}
                       setFormData={setFormData}
                       autoId={`projects`}
                       label={"Projects"}
                       apiKey={`GetProject_User?iUser=${iUser}`}
                       formDataName={"sProject"}
                       formDataiId={"iProject"}
                       required={true}
                     />
                    </MDBCol>
                  </div>
                )}
              </Box>
            </div>
          </div>
        </div>
        
      </Zoom>
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
      
    </div>
  );
}
