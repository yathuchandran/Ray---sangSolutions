import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
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

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { styled } from '@mui/system';
// import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import BasicDateTimePicker from "../DateAndTime";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import AutoComplete2 from "../../Attendance/components/AutoComplete/AutoComplete2";
import { buttonColors, secondaryColorTheme } from "../../config";
import { GetCompany, GetUserDetail, PostUsers } from "../../api/settingsApi";
import GetRoleAutocomplete from "../autoComplete/GetRoleAutocomplete";




export default function NewModal({
  isOpen,
  handleNewClose,
  formDataEdit,
  mode,
  actions
}) {
  const customFormGroupStyle = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    maxHeight: '200px', // Adjust as needed
    overflowY: 'auto', // Hide vertical overflow
    overflowX: 'auto', // Allow horizontal scrolling
    padding: '10px',
  };

  const customFormGroupStyle1 = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    maxHeight: '150px', // Adjust as needed
    overflowY: 'auto', // Hide vertical overflow
    overflowX: 'auto', // Allow horizontal scrolling
    padding: '10px',
  };

  const customFormControlLabelStyle = {
    '& .MuiCheckbox-root': {
      color: '#3f51b5', // Change checkbox color as needed
    },
    '& .MuiTypography-root': {
      marginLeft: '5px', // Adjust label spacing
    },
  };
  const iUser = localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : ""

  const getInitialFormData = () => {
    return {
      iId: 0,
      UserName: "",
      LoginName: "",
      Password: "",
      Email: "",
      Phone: "",
      Web: 0,
      Mob: 0,
      iUser: iUser,
      iRole: 0,
      iEmployee: 0,
      Company: ""
    }
  };


  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [formData, setFormData] = useState({
    Web: 0, // Initially set as 0
    Mob: 0,
    Password: '',
    // Add more fields as needed
  });
  const [open, setOpen] = React.useState(false); //loader
  const [mode1, setMode1] = useState("");
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");

  const [company, setCompany] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([]); // State to hold selected companies
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  

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
    position: "absolute"
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
    setFormData(
      getInitialFormData());
    setSelectedCompanies([])
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

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleItemToggle = (iId) => {
    setSelectedCompanies((prevItems) => {
      if (Array.isArray(prevItems)) { // Check if prevItems is an array
        if (prevItems.includes(iId)) {
          return prevItems.filter((id) => id !== iId); // Deselect if already selected
        } else {
          return [...prevItems, iId]; // Select if not selected
        }
      } else {
        return [iId]; // If it's not an array, initialize with iId
      }
    });
  };


  const handleUsertype = (e) => {
    const { name, checked } = e.target;
    const value = checked ? 1 : 0;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }


  const handleSelectAll = () => {


    if (selectedCompanies.length === company.length) {
      setSelectedCompanies([]);
    } else {
      const allCompanyIds = company.map((companyItem) => companyItem.iId.toString());
      setSelectedCompanies(allCompanyIds);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleSaveAccount = async () => {
    if (!formData.UserName) {
      Swal.fire({
        title: "Error!",
        text: "UserName is required",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return;
    }
    if (!formData.LoginName) {
      Swal.fire({
        title: "Error!",
        text: "Login Name is required",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return;
    }
    if (!formData.Password) {
      Swal.fire({
        title: "Error!",
        text: "Password is required.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return;
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
        formData.Password
      )
    ) {
      Swal.fire({
        title: "Error!",
        text:
          "Password must be at least 6 characters long and include at least one letter, one number, and one special character.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return;
    }


    // Regular expression for email validation
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!formData.Email) {
      Swal.fire({
        title: "Error!",
        text: "Email is required",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return;
    } else if (!emailRegex.test(formData.Email)) {
      Swal.fire({
        title: "Error!",
        text: "Invalid email format",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return;
    }
    if (!formData.iRole) {
      Swal.fire({
        title: "Error!",
        text: "Role is required",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return;
    }

    if (!formData.iEmployee) {
      Swal.fire({
        title: "Error!",
        text: "Supervisor/Employee is required",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return;
    }

    // Function to check if at least one checkbox is selected
    const isUserTypeSelected = () => {
      return Boolean(formData.Web) || Boolean(formData.Mob);
    };
    if (!isUserTypeSelected()) {
      // If neither Web User nor Mobile User checkbox is selected
      Swal.fire({
        title: "Error!",
        text: "Please select a user type (Web User or Mobile User)",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return; // Prevent form submission
    }

    const companies = selectedCompanies.join()


    // Function to check if at least one checkbox is selected
    const isCompanySelected = () => {
      return companies
    };
    if (!isCompanySelected()) {
      // If neither Web User nor Mobile User checkbox is selected
      Swal.fire({
        title: "Error!",
        text: "Please select a companies",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return; // Prevent form submission
    }


    try {
      const res = await PostUsers({
        iId: formData.iId,
        UserName: formData.UserName,
        LoginName: formData.LoginName,
        Password: formData.Password,
        Email: formData.Email,
        Phone: formData.Phone,
        Web: formData.Web,
        Mob: formData.Mob,
        iUser: iUser,
        iRole: formData.iRole,
        iEmployee: formData.iEmployee,
        Company: companies
      })
      if (res.Status === "Success") {
        if (res.MessageDescription === "Inserted successfully" || res.MessageDescription === "Updated successfully") {
          Swal.fire({
            title: "Success!",
            text: `${res.MessageDescription}`,
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });

        } else {
          handleOpenAlert();
          setMessage(`${res.MessageDescription}`);
          return;
        }
      }


      handleNewClose()
    } catch (error) {
      console.log("handleSave Post Error", error);
    }
  }


  // GET COMPANY API CALLLL-----------------------------------------------------
  useEffect(() => {
    const GetCompanys = async () => {
      try {
        const res = await GetCompany()
        const data = JSON.parse(res.ResultData)
        setCompany(data)
      } catch (error) {
        console.log(error);
      }
    }
    GetCompanys()
  }, [])





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



  //EDITE CASE------------------------------------------------------
  useEffect(() => {
    if (mode1 === "edit" && formDataEdit) {

      const editData = Array.isArray(formDataEdit)
        ? formDataEdit[0]
        : formDataEdit;

      if (typeof editData !== "object" || editData === null) {
        console.error("editData is not an object:", editData);
        return;
      }

      const GetUserDetails = async () => {
        try {
          const res = await GetUserDetail({
            iId: editData.iId
          })
          const data = JSON.parse(res.ResultData).Table[0]


          setFormData({
            ...formData,
            iId: data.iId,
            UserName: data.sUserName,
            LoginName: data.sLoginName,
            Password: data.sPassword,
            Phone: data.sPhoneNo,
            Email: data.sEmail,
            iRole: data.iRole,
            Web: data.bWeb == true ? 1 : 0,
            Mob: data.bMob == true ? 1 : 0,
            iEmployee: data.iEmployee,
            sEmployee: data.sEmployee
          })
          // const slctcompany = [...data.sCompany];
          const slctcompany = data.sCompany.split(',');

          setSelectedCompanies(slctcompany)


        } catch (error) {
          console.log(error);
        }
      }
      GetUserDetails()
    } else if (mode1 === "new") {

      setFormData(getInitialFormData());
    }
  }, [mode1, formDataEdit]);
  return (
    <div><div
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
          <div style={{ marginTop: "10%", width: "50%", marginLeft: "350px" }} >
            <div className="modal-content">
              {/* <Stack
                direction="row"
                spacing={1}
                padding={1}
                justifyContent="flex-end"
              >
                <>
                  <Button
                    onClick={newButtonClick}
                    variant="contained"
                    startIcon={<AddIcon />}
                    style={buttonStyle}
                  >
                    New
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    style={buttonStyle}
                    onClick={handleSaveAccount}
                  >
                    Save
                  </Button>
                </>



                <Button
                  onClick={handleNewClose}
                  variant="contained"
                  startIcon={<CloseIcon />}
                  style={buttonStyle}
                >
                  Close
                </Button>
              </Stack> */}
              <Stack
      direction="row"
      spacing={1}
      padding={1}
      justifyContent="flex-end"
    >
      {renderButton(2, "New", newButtonClick, <AddIcon />)}
      {renderButton(8, "Save", handleSaveAccount, <SaveIcon />)}
     
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
                <div className="attendanceNewContainer">
                  <MDBCol>
                    {/* <MDBInput
                      required
                      id="form6Example3"
                      label={(
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: '15px' }}>User Name</span>
                          <span style={{ color: '#1976D2', marginLeft: '5px' }}>*</span>
                        </div>
                      )}
                      name="UserName"
                      value={formData.UserName}
                      onChange={handleInputChange}
                      maxLength={100}
                    /> */}

<MDBInput
                      required
                      id="form6Example3"
                      label={(
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: '15px' }}>User Name</span>
                          <span style={{ color: '#1976D2', marginLeft: '5px' }}>*</span>
                        </div>
                      )}
                      name="UserName"
                      value={formData.UserName}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      required
                      id="form6Example3"
                      label={(
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: '15px' }}>Login Name</span>
                          <span style={{ color: '#1976D2', marginLeft: '5px' }}>*</span>
                        </div>
                      )}
                      name="LoginName"
                      value={formData.LoginName}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </MDBCol>
                  <MDBCol>
                    <div style={{ position: 'relative' }}>
                      <MDBInput
                        required
                        id="form6Example3"
                        label={(
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '15px' }}>Password</span>
                            <span style={{ color: '#1976D2', marginLeft: '5px' }}>*</span>
                          </div>
                        )}
                        type={showPassword ? 'text' : 'password'} // Toggle type based on showPassword state
                        name="Password"
                        value={formData.Password}
                        onChange={handleInputChange}
                        maxLength={100}
                        icon={null} // Remove default eye icon

                      />
                        {mode1 !== 'edit' && (
    <div
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
      }}
    >
      {showPassword ? <LockOpenIcon /> : <LockIcon />}
    </div>
  )}

                    </div>
                    
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      required
                      id="form6Example3"
                      label="Mobile"
                      name="Phone"
                      value={formData.Phone}
                      type="number"
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      required
                      id="form6Example3"
                      label={(
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: '15px' }}>Email</span>
                          <span style={{ color: '#1976D2', marginLeft: '5px' }}>*</span>
                        </div>
                      )} name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </MDBCol>
                  <MDBCol>
                    <GetRoleAutocomplete
                      formData={formData}
                      setFormData={setFormData}
                      autoId={`Role`}
                      label={"Role"}
                      apiKey={"GetRoles"}
                      formDataName={"sRole"}
                      formDataiId={"iRole"}
                    />
                  </MDBCol>

                  <div style={customFormGroupStyle1}>
                    <Typography sx={{ fontSize: '16px', paddingBottom: '10px' }}>
                      User Type <span style={{ color: '#1976D2', marginLeft: '1px' }}>*</span>
                    </Typography>
                    <FormGroup sx={{ paddingBottom: '80px' }}  >
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Web User"
                        name="Web"
                        checked={formData.Web === 1} // Check if value is 1
                        // checked={Boolean(formData.Web)} // Convert to boolean
                        onChange={handleUsertype}
                        value={formData.Web}
                      />
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Mobile User"
                        name="Mob"
                        checked={formData.Mob === 1} // Check if value is 1
                        style={{ fontSize: '10px', }}
                        onChange={handleUsertype}
                        value={formData.Mob}
                      />
                    </FormGroup>


                  </div>



                  <div style={customFormGroupStyle}>
                    <Typography sx={{ fontSize: '16px', paddingBottom: '10px' }}>
                      Company <span style={{ color: '#1976D2', marginLeft: '1px' }}>*</span>
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', }} >
                      <input
                        placeholder="Search"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ width: '100px', height: '20px', fontSize: '12px', }} // Adjust width and height as needed
                        sx={{ paddingBottom: '50px', }} // sx prop for further customization
                      />
                      <br />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedCompanies.length === company.length}
                            onChange={handleSelectAll}
                            name="select-all"
                            style={{ fontSize: '9px', marginLeft: "25px" }}
                          />
                        }
                        label="Select All"
                      />
                    </div>
                    <FormGroup >

                      {company
                        .filter((companyItem) =>
                          companyItem.sName.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((companyItem) => (
                          <FormControlLabel
                            key={companyItem.iId}
                            control={
                              <Checkbox
                                checked={Array.isArray(selectedCompanies) && selectedCompanies.includes(companyItem.iId.toString())}
                                onChange={() => handleItemToggle(companyItem.iId.toString())}
                                name={companyItem.sName}
                                sx={{ height: "10px" }}

                              />
                            }
                            label={companyItem.sName}
                          />
                        ))}

                    </FormGroup>
                    {/* </div> */}
                  </div>

                </div>
                <MDBCol style={{ marginLeft: "25px", width: "46%" }} >
                  <GetRoleAutocomplete
                    formData={formData}
                    setFormData={setFormData}
                    autoId={`Supervisor/Employee`}
                    label={"Supervisor/Employee"}
                    apiKey={"GetAllEmployee"}
                    formDataName={"sEmployee"}
                    formDataiId={"iEmployee"}
                  />
                </MDBCol>
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
  )
}

