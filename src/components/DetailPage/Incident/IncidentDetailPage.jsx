import React, { useEffect, useState } from "react";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBTextArea,
} from "mdb-react-ui-kit";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";
import { buttonColors, secondaryColorTheme } from "../../../config";
import {
  crystalPrint,
  deleteSummary,
  getDetails,
  getPrev_NextDocNo,
  getProject,
  postIncident,
} from "../../../api/apiCall";
import AutoComplete from "../../AutoComplete/AutoComplete";
import AutoComplete3 from "../../AutoComplete/AutoComplete3";
import IncidentTable from "./IncidentTable";
import Loader from "../../Loader/Loader";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ImageModal from "../ImageViewer";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

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

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: `${secondaryColorTheme}`, // Set text color
  backgroundColor: `${buttonColors}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  margin: 3,
  fontSize: "12px",
  padding: "6px 10px",
};

const buttonStyle2 = {
  textTransform: "none", // Set text transform to none for normal case
  color: ` ${buttonColors}`, // Set text color
  backgroundColor: `${secondaryColorTheme}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  margin: 3,
  padding: "6px 10px",
};

const readOnlyStyle = {
  cursor: "text",
  color: "inherit",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid #ced4da",
};

export default function IncidentDetailPage({ id, action, apiName, actions }) {
  const [body, setBody] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [childData, setChildData] = useState([]);
  const iUser = localStorage.getItem("userId")? Number(localStorage.getItem("userId")) : ""
  const [project, setProject] = useState();
  const [projectDes, setProjectDes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [location, setLocation] = useState("");
  const [transId, setTransId] = useState(id);
  const [incidentType, setIncidentType] = useState();
  const [severity, setSeverity] = useState();
  const [potential, setPotential] = useState();
  const [descriptionInc, setDescriptionInc] = useState("");
  const [descriptionDam, setDescriptionDam] = useState("");
  const [numberInjured, setNumberInjured] = useState("");
  const [nameInjured, setNameInjured] = useState("");
  const [immediate, setImmediate] = useState("");
  const [underlying, setUnderlying] = useState("");
  const [docNo, setDocNo] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [type, setType] = useState(0);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const locations = useLocation();
  const details = locations?.state;

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleImageClick = (index, types) => {
    setType(types);
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCloseImagePopup = () => {
    setSelectedImageIndex(null);
    setIsImageModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      if (transId !== 0 && apiName) {
        const response = await getDetails({ iTransId: transId }, apiName);
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response?.ResultData);
          setBody(myObject.Body);
          setProject(
            {
              sName: myObject?.Header[0]?.Project,
              iId: myObject?.Header[0]?.iProject,
            } || ""
          );
          setProjectDes(myObject?.Header[0]?.sProjectDes || "");
          setLocation(myObject?.Header[0]?.sLocation || "");
          setDate(formatDate(myObject?.Header[0]?.Date) || "");
          setTransId(myObject?.Header[0]?.iTransId || 0);
          setTime(convertTo24HourFormat(myObject?.Header[0]?.sTime) || "");
          setIncidentType({ iId: myObject?.Header[0]?.iIncidentType } || "");
          setSeverity({ iId: myObject?.Header[0]?.iSeverity_Rate } || "");
          setPotential({ iId: myObject?.Header[0]?.iPotential_Rate } || "");
          setDescriptionInc(myObject?.Header[0]?.sDes_incident || "");
          setDescriptionDam(myObject?.Header[0]?.sDes_Damage || "");
          setNumberInjured(myObject?.Header[0]?.iInjured_Person || 0);
          setNameInjured(myObject?.Header[0]?.sDetails_Persons || "");
          setImmediate(myObject?.Header[0]?.sImmediateCauses || "");
          setUnderlying(myObject?.Header[0]?.sUnderlyingCauses || "");
          setDocNo(myObject?.Header[0]?.sDocNo || "");
          if (myObject?.Header[0]?.imageFiles?.length) {
            setSelectedFiles(myObject?.Header[0]?.imageFiles);
          } else {
            setSelectedFiles([]);
          }
          if (myObject?.Header[0]?.sImage) {
            const imageArray = myObject?.Header[0]?.sImage.split(";");
            const fullImagePathArray = imageArray.map(
              (image) => `${myObject?.Header[0]?.sPath}${image}`
            );
            setSelectedImage(fullImagePathArray);
          }else{
            setSelectedImage([])
          }
        }
      } else {
        handleClear();
      }
      handleClose();
    };
    fetchData();
  }, [transId]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
  };

  function convertTo24HourFormat(time12Hour) {
    const date = new Date("2000-01-01 " + time12Hour); // Set a dummy date for parsing
    const options = { hour: "numeric", minute: "numeric", hour12: false };
    const time24Hour = date.toLocaleTimeString("en-US", options);
    return time24Hour;
  }

  const HtmlTooltip = styled((props) => (
    <Tooltip {...props} classes={{ popper: props.className }} />
  ))({
    tooltip: {
      backgroundColor: "#f5f5f9",
      maxWidth: "auto",
    },
  });

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

  const handleSave = async (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!childData.length) emptyFields.push("Add General Conditions");

    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(` ${emptyFields.join(", ")}.`);
      return;
    }
    // Map and transform childData
    const updatedChildData = childData.map((obj) => ({
      iResponsible: obj.iResponsible,
      sCloseDate: obj.CloseDate,
      iAction: obj.iAction,
      sAction_Des: obj.sAction_Des,
      sExtraDetails: "",
    }));

    let fileNames = "";
    let pathUrl = "";

    if (selectedImage && selectedImage.length) {
      fileNames = selectedImage
        .map((url) => url.substring(url.lastIndexOf("/") + 1))
        .join(";");

      const baseUrl = new URL(selectedImage[0]);
      baseUrl.pathname = baseUrl.pathname.substring(
        0,
        baseUrl.pathname.lastIndexOf("/") + 1
      );
      pathUrl = baseUrl.href;
    }

    const filenames = selectedFiles?.map((file) => file.name);
    const filenamesString = filenames?.join(";");
    const newFileName =
      fileNames +
      (fileNames && filenamesString ? ";" + filenamesString : filenamesString);

    const updatedData = {
      iTransId: transId,
      Project: project?.iId,
      Location: location,
      Date: date,
      Time: time,
      IncidentType: incidentType?.iId,
      Severity_Rate: severity?.iId,
      Potential_Rate: potential?.iId,
      IncidentDescription: descriptionInc,
      DamageDescription: descriptionDam,
      No_Injured_Person: numberInjured,
      DetailsOfPersons: nameInjured,
      ImmediateCauses: immediate,
      UnderlyingCauses: underlying,
      UserId: iUser,
      Images: newFileName,
      sPath: pathUrl,
      Others: "",
      Body: updatedChildData,
    };

    const formData = new FormData();

    // Append JSON data to FormData
    formData.append("data", JSON.stringify(updatedData));

    // Append files to FormData
    if (selectedFiles && selectedFiles.length) {
      selectedFiles.forEach((file, index) => {
        formData.append(`imageFiles[${index}]`, file);
      });
    }

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
          handleOpen();
          const response = await postIncident(formData);
          handleClose();
          if (response?.Status === "Success") {
            Swal.fire({
              title: "Saved",
              text: "Your file has been Saved!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              handleClear();
            });
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
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleClear = async () => {
    handleOpen();
    const response = await getPrev_NextDocNo({
      iTransId: 0,
      iType: 3,
      iForm: 2,
      iUser
    });
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setDocNo(myObject[0].sDocNo);
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    setLocation("");
    setProject("");
    setProjectDes("");
    setDate(formattedDate);
    setBody((prevBody) => (prevBody === -1 ? 0 : -1));
    setTime(currentTime);
    setPotential("");
    setIncidentType("");
    setSeverity("");
    setDescriptionInc("");
    setDescriptionDam("");
    setNumberInjured("");
    setNameInjured("");
    setImmediate("");
    setUnderlying("");
    setTransId(0);
    setSelectedImage([]);
    setSelectedFiles([]);
    handleClose();
  };

  const handleChildData = (data) => {
    setChildData(data);
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
        handleOpen();
        const response = await deleteSummary(
          {
            iTransId: transId,
            UserId: iUser,
          },
          details?.sName
        );
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Deleted",
            text: "Your file has been deleted!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            handleClear();
          });
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

  const handlePages = async (iType, iTransId) => {
    handleOpen();
    const response = await getPrev_NextDocNo({ iTransId, iType, iForm: 2,iUser });
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setTransId(myObject[0]?.iTransId);
    } else {
      setTransId(0);
    }
    handleClose();
  };

  const handleRemoveImage1 = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };
  const handleRemoveImage2 = (index) => {
    setSelectedImage((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handlePrint = async (id) => {
    handleOpen();
    const response = await crystalPrint({ iTransId: id, iFormtype: 2 });
    handleClose();
    if (response?.Status === "Success") {
      window.open(response?.ResultData, "_blank");
    } else {
      handleOpenAlert();
      setMessage("Can't Reach");
    }
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
          direction="row"
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
            >
              {details?.sScreen}
            </Typography>
          </Box>
          <Box>
            
            { renderButton(2, "New", handleClear, <AddIcon />)}
      {renderButton(8, "Save",null, <SaveIcon />,null, 'submit' )}
      {renderButton(4, "Delete", handleDelete, <DeleteIcon />, transId === 0 )}
      {renderButton(9, "Prev",()=>handlePages(1, transId), <ArrowCircleLeftIcon />,  )}
      {renderButton(10, "Next", ()=>handlePages(2, transId), <ArrowCircleRightIcon />, )}
      {renderButton(11, "Print", ()=>handlePrint(transId), <PrintIcon />, transId === 0)}
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

        <MDBCard
          className="text-center "
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
        >
          <>
            <div>
              <Accordion defaultExpanded sx={{ padding: 0, margin: 0 }}>
                <AccordionSummary
                  sx={{ paddingBottom: 0, marginLeft: 1 }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div>
                      <MDBInput
                        required
                        id={`form3Example`}
                        type="text"
                        size="small"
                        autoComplete="off"
                        label="Document Number"
                        value={docNo}
                        onChange={(e) => setDocNo(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        readonly
                        style={readOnlyStyle}
                      />
                    </div>
                  </MDBCol>
                </AccordionSummary>
                <AccordionDetails style={{ padding: 0, margin: 0 }}>
                  <MDBCardHeader
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      paddingBottom: 0,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h6"
                      style={{ fontSize: "16px" }}
                    >
                      Report Originated By :
                    </Typography>
                  </MDBCardHeader>
                  <MDBCardBody style={{ paddingBottom: 0 }}>
                    <MDBRow>
                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <AutoComplete
                            apiName={getProject}
                            value={project}
                            onChangeName={setProject}
                            onChangeDes={setProjectDes}
                          />
                        </div>
                      </MDBCol>

                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="text"
                            label="Location of Incident *"
                            maxLength={80}
                            autoComplete="off"
                            size="small"
                            onChange={(e) => setLocation(e.target.value)}
                            value={location}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="date"
                            size="small"
                            autoComplete="off"
                            label="Date *"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                            onKeyDown={(e) => e.preventDefault()}
                            onClick={(e) => e.target.showPicker?.()} // This line is for modern browsers
                            onFocus={(e) => e.target.showPicker?.()}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="time"
                            size="small"
                            autoComplete="off"
                            label="Time of Incident *"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <AutoComplete3
                            label="Incident Type"
                            value={incidentType}
                            onChangeName={setIncidentType}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <AutoComplete3
                            label="Severity rate"
                            value={severity}
                            onChangeName={setSeverity}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <AutoComplete3
                            label="Potential rate"
                            value={potential}
                            onChangeName={setPotential}
                          />
                        </div>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                  <MDBCardHeader
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      paddingBottom: 0,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h6"
                      style={{ fontSize: "16px" }}
                    >
                      Details :
                    </Typography>
                  </MDBCardHeader>
                  <MDBCardBody style={{ paddingBottom: 0 }}>
                    <MDBRow>
                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <MDBTextArea
                            required
                            id={`form3Example`}
                            type="text"
                            label="Description of Incident *"
                            size="small"
                            autoComplete="off"
                            rows={2}
                            maxLength={500}
                            onChange={(e) => setDescriptionInc(e.target.value)}
                            value={descriptionInc}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <MDBTextArea
                            required
                            id={`form3Example`}
                            type="text"
                            size="small"
                            autoComplete="off"
                            rows={2}
                            maxLength={500}
                            label="Description of Damage *"
                            value={descriptionDam}
                            onChange={(e) => setDescriptionDam(e.target.value)}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>
                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="number"
                            size="small"
                            autoComplete="off"
                            label="Number of person injured *"
                            value={numberInjured}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Check if the input is a non-negative number (including zero)
                              if (
                                /^\d+$/.test(inputValue) ||
                                inputValue === ""
                              ) {
                                setNumberInjured(inputValue);
                              }
                            }}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>

                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <MDBTextArea
                            required
                            id={`form3Example`}
                            type="text"
                            size="small"
                            autoComplete="off"
                            maxLength={500}
                            rows={2}
                            label="Names of injured people and details of injuries *"
                            value={nameInjured}
                            onChange={(e) => setNameInjured(e.target.value)}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                  <MDBCardHeader
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      paddingBottom: 0,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h6"
                      style={{ fontSize: "16px" }}
                    >
                      The follwing for low potential incidents :
                    </Typography>
                  </MDBCardHeader>
                  <MDBCardBody style={{ paddingBottom: 0 }}>
                    <MDBRow>
                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="text"
                            autoComplete="off"
                            label="Immediate Causes *"
                            maxLength={500}
                            size="small"
                            onChange={(e) => setImmediate(e.target.value)}
                            value={immediate}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>

                      <MDBCol lg="3" md="4" sm="6" xs="12">
                        <div className="mb-3">
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="text"
                            autoComplete="off"
                            maxLength={500}
                            label="Underlying Causes *"
                            size="small"
                            onChange={(e) => setUnderlying(e.target.value)}
                            value={underlying}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                          />
                        </div>
                      </MDBCol>

                      <>
                        {selectedImage.map((file, index) => (
                          <HtmlTooltip
                            key={index}
                            title={
                              <React.Fragment>
                                <Tooltip title="Remove">
                                  <IconButton
                                    onClick={() => handleRemoveImage2(index)}
                                    size="small"
                                    style={{
                                      color: `${buttonColors}`,
                                      backgroundColor: `${secondaryColorTheme}`,
                                      marginRight: 2,
                                    }}
                                  >
                                    <DeleteIcon style={{ fontSize: "16px" }} />
                                  </IconButton>
                                </Tooltip>
                              </React.Fragment>
                            }
                          >
                            <MDBCol xl="1" lg="2" md="3" sm="4" xs="5">
                              <img
                                onClick={() => handleImageClick(index, 2)}
                                key={index}
                                src={file}
                                alt={`uploaded-${index}`}
                                style={{
                                  height: "50px",
                                  width: "70px",
                                  margin: 2,
                                  cursor: "pointer",
                                }}
                              />
                            </MDBCol>
                          </HtmlTooltip>
                        ))}
                        {selectedFiles.map((file, index) => (
                          <HtmlTooltip
                            key={index}
                            title={
                              <React.Fragment>
                                <Tooltip title="Remove">
                                  <IconButton
                                    onClick={() => handleRemoveImage1(index)}
                                    size="small"
                                    style={{
                                      color: `${buttonColors}`,
                                      backgroundColor: `${secondaryColorTheme}`,
                                      marginRight: 2,
                                    }}
                                  >
                                    <DeleteIcon style={{ fontSize: "16px" }} />
                                  </IconButton>
                                </Tooltip>
                              </React.Fragment>
                            }
                          >
                            <MDBCol xl="1" lg="2" md="3" sm="4" xs="5">
                              <img
                                key={index}
                                onClick={() => handleImageClick(index, 1)}
                                src={URL.createObjectURL(file)}
                                alt={`uploaded-${index}`}
                                style={{
                                  height: "50px",
                                  width: "70px",
                                  cursor: "pointer",
                                  marginRight: 2,
                                }}
                              />
                            </MDBCol>
                          </HtmlTooltip>
                        ))}
                      </>
                      <MDBCol xl="1" lg="2" md="3" sm="4" xs="5">
                        <div className="mb-3">
                          <div
                            className="file-upload-container"
                            style={{
                              textAlign: "center",
                              border: "3px dashed rgb(210, 227, 244)",
                              padding: "0.2rem",
                              position: "relative",
                              cursor: "pointer",
                              borderRadius: 10,
                            }}
                          >
                            <Button component="label">
                              <div>
                                <AddAPhotoIcon style={{ color: "#adacac" }} />
                                <h3
                                  style={{
                                    fontSize: "0.6rem",
                                    color: "#adacac",
                                  }}
                                >
                                  Upload Image
                                </h3>
                              </div>
                              <VisuallyHiddenInput
                                type="file"
                                multiple
                                onChange={(e) => handleFileChange(e)}
                              />
                            </Button>
                          </div>
                        </div>
                      </MDBCol>
                    </MDBRow>

                    {/* <MDBRow className="m-4">
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={
                          <CloudUploadIcon style={{ width: "20px" }} />
                        }
                        style={{ width: "200px" }}
                      >
                        <span style={{ fontSize: "14px" }}>Upload files</span>
                        <VisuallyHiddenInput
                          type="file"
                          multiple
                          onChange={(e) => handleFileChange(e)}
                        />
                      </Button>
                    </MDBRow> */}
                  </MDBCardBody>
                </AccordionDetails>
              </Accordion>
            </div>
          </>
        </MDBCard>

        <IncidentTable data={body} handleChildData={handleChildData} />
        <Loader open={open} handleClose={handleClose} />
      </form>
      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={
          type === 1 && selectedFiles[selectedImageIndex]
            ? URL.createObjectURL(selectedFiles[selectedImageIndex])
            : selectedImage[selectedImageIndex]
        }
        handleCloseImagePopup={handleCloseImagePopup}
      />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </>
  );
}
