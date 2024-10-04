import React, { useEffect, useState } from "react";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
  Grid, // Import Grid from Material-UI
} from "@mui/material";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "../Loader/Loader";
import SaveIcon from "@mui/icons-material/Save";
import { buttonColors, secondaryColorTheme } from "../../config";
import Swal from "sweetalert2";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {
  getCompany,
  getPayGroup,
  getProjectDelete,
  getProjectDetails,
  getSupervisor,
  postProject,
} from "../../api/projectApi";
import AutoComplete4 from "../AutoComplete/AutoComplete4";
import AutoComplete5 from "../AutoComplete/AutoComplete5";
import AutoComplete3 from "../AutoComplete/AutoComplete3";
import MapComponent from "./ProjectMap";

const buttonStyle = {
  textTransform: "none",
  color: `${secondaryColorTheme}`,
  backgroundColor: `${buttonColors}`,
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  margin: 3,
  fontSize: "12px",
  padding: "6px 10px",
};

const buttonStyle2 = {
  textTransform: "none",
  color: ` ${buttonColors}`,
  backgroundColor: `${secondaryColorTheme}`,
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  margin: 3,
  padding: "6px 10px",
};

export default function ProjectDetails({ id, action, actions }) {
  const [open, setOpen] = React.useState(false);
  const [childData, setChildData] = useState([]);
  const iUser = localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : "";
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [payGroup, setPayGroup] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [appDate, setAppDate] = useState(null);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState("");
  const [client, setClient] = useState(" ");
  const [transId, setTransId] = useState(id);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [mapLocation, setMapLocation] = useState(null);
  const locations = useLocation();
  const details = locations?.state;

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      if (id) {
        const response = await getProjectDetails({ iId: transId });
        if (response.Status === "Success") {
          const myObject = JSON.parse(response.ResultData);
          setName(myObject?.Table[0]?.sName);
          setCode(myObject?.Table[0]?.sCode);
          setDescription(myObject?.Table[0]?.sDescription);
          setPayGroup(
            myObject?.Table[0]?.iPayGroup
              ? {
                  sName: myObject?.Table[0]?.sPayGroup,
                  iId: myObject?.Table[0]?.iPayGroup,
                }
              : ""
          );
          setSupervisor(
            myObject?.Table[0]?.iSupervisor
              ? {
                  sName: myObject?.Table[0]?.sSupervisor,
                  iId: myObject?.Table[0]?.iSupervisor,
                }
              : ""
          );
          setAppDate(formatDate(myObject?.Table[0]?.sApplicabledate));
          setEmail(myObject?.Table[0]?.sEmail);
          setCompany(
            myObject?.Table[0]?.iCompany
              ? {
                  sName: myObject?.Table[0]?.sCompany,
                  iId: myObject?.Table[0]?.iCompany,
                }
              : ""
          );
          setStatus({ iId: myObject?.Table[0]?.iStatus });
          setClient(myObject?.Table[0]?.sClient || " ");
          setMapLocation(myObject?.Table[0]?.Lat_Long || null);
        }
      } else {
        handleClear();
      }

      handleClose();
    };
    fetchData();
  }, [transId]);

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

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  const handleOpenAlert = () => {
    setWarning(true);
  };
  const handleCheckboxChange = (event) => {
    // Update state based on checkbox status
    setChecked(event.target.checked);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if(email){
      const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let emptyFields = [];
    if (!emailRegex.test(email)) emptyFields.push("Invalid Email");

    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(`${emptyFields.join(", ")}.`);
      return;
    }
    }
  
    const updatedData = {
      iId: transId,
      sName: name,
      sCode: code,
      sDescription: description,
      iStatus: status?.iId,
      icompany: company?.iId,
      iUser,
      iSupervisor: supervisor?.iId,
      sEmail: email,
      sApplicableDate: appDate ? appDate : null,
      iChecked: checked ? 1 : 0,
      sClient: client,
      iPayGroup: payGroup?.iId,
      Lan_Long: mapLocation,
    };
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to Save this!",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.value) {
          const response = await postProject(updatedData);
          if (response?.Status === "Success") {
            Swal.fire({
              title: "Saved",
              text: "Your file has been Saved!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              handleClear();
              action();
            });
          } else {
            setMessage(
              response?.MessageDescription
                ? response?.MessageDescription
                : "Something went wrong"
            );
            handleOpenAlert();
          }
        }
      });
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleClear = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setName("");
    setCode("");
    setDescription("");
    setPayGroup("");
    setSupervisor("");
    setAppDate(null);
    setEmail("");
    setCompany("");
    setStatus("");
    setClient(" ");
    setTransId(0);
    setMapLocation(null);
  };

  const handleChildData = (data) => {
    setMapLocation(`${data}`);
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
        const response = await getProjectDelete(
          {
            iId: transId,
            iUser,
          },
          details?.sName
        );
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Deleted",
            text: "Your file has been deleted!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          handleClear();
          action();
        } else {
          setMessage(response?.MessageDescription);
          handleOpenAlert();
        }
      }
    });
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
    <>
      <form onSubmit={handleSave}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          padding={1}
          justifyContent="space-between"
        >
          <Box>
            <Typography
              style={{
                color: `${buttonColors}`,
                margin: 3,
              }}
              variant="h6"
              component="h2"
            ></Typography>
          </Box>
          <Box>
          
            { renderButton(2, "New", handleClear, <AddIcon />)}
      {renderButton(8, "Save",null, <SaveIcon />,null, "submit"  )}
      {renderButton(4, "Delete", handleDelete, <DeleteIcon />, transId === 0 )}

            <Button
              onClick={action}
              variant="contained"
              startIcon={<CloseIcon />}
              style={buttonStyle}
            >
              Close
            </Button>
          </Box>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/* First Column */}
            <MDBCard
              className="text-center"
              style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
            >
              <Accordion defaultExpanded sx={{ padding: 0, margin: 0 }}>
                <AccordionSummary
                  sx={{ paddingBottom: 0, marginLeft: 1 }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography variant="h6" component="h2">
                    Project Details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails style={{ padding: 0, margin: 0 }}>
                  <MDBCardBody>
                    <MDBRow className="g-2">
                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="text"
                            size="small"
                            autoComplete="off"
                            label="Name *"
                            maxLength={100}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="text"
                            size="small"
                            autoComplete="off"
                            label="Code *"
                            maxLength={100}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="text"
                            autoComplete="off"
                            label="Description *"
                            maxLength={100}
                            size="small"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <AutoComplete5
                            id="form6Example4"
                            value={payGroup}
                            setValue={setPayGroup}
                            apiName={getPayGroup}
                            field="PayGroup"
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <AutoComplete5
                            id="form6Example4"
                            value={supervisor}
                            setValue={setSupervisor}
                            apiName={getSupervisor}
                            field="Supervisor"
                          />
                        </div>
                      </MDBCol>

                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            id={`form3Example`}
                            type="date"
                            autoComplete="off"
                            label="Applicable Date *"
                            size="small"
                            value={appDate}
                            onChange={(e) => {
                              // Ensure that the year input does not exceed four digits
                              if (e.target.value.length <= 10) {
                                setAppDate(e.target.value);
                              }
                            }}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                            onKeyDown={(e) => e.preventDefault()}
                            onClick={(e) => e.target.showPicker?.()} // This line is for modern browsers
                            onFocus={(e) => e.target.showPicker?.()}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            id={`form3Example`}
                            type="text"
                            autoComplete="off"
                            label="Email"
                            maxLength={80}
                            size="small"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>

                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <AutoComplete4
                            id="form6Example4"
                            value={company}
                            setValue={setCompany}
                            apiName={getCompany}
                            field="Company"
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <AutoComplete3
                            label="Status"
                            value={status}
                            onChangeName={setStatus}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            id={`form3Example`}
                            type="text"
                            autoComplete="off"
                            label="Client"
                            maxLength={100}
                            size="small"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            id={`form3Example`}
                            type="text"
                            autoComplete="off"
                            label="Lat-Lan"
                            maxLength={80}
                            size="small"
                            value={mapLocation ? mapLocation : ""}
                            onChange={(e) => setMapLocation(e.target.value)}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="6" md="6" sm="12" xs="12">
                        <FormGroup>
                          <FormControlLabel
                            style={{ color: "gray" }}
                            control={
                              <Checkbox
                                checked={checked}
                                onChange={handleCheckboxChange}
                              />
                            }
                            label="Do you want to change email"
                          />
                        </FormGroup>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                </AccordionDetails>
              </Accordion>
            </MDBCard>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Second Column */}
            <MapComponent
              location={mapLocation}
              handleLocation={handleChildData}
            />
          </Grid>
        </Grid>
        <Loader open={open} handleClose={handleClose} />
      </form>
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </>
  );
}
