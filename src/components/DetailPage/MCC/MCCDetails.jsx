import React, { useEffect, useState } from "react";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBTextArea,
} from "mdb-react-ui-kit";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import Swal from "sweetalert2";
import { buttonColors, secondaryColorTheme } from "../../../config";
import {
  crystalPrint,
  deleteSummary,
  getDetails,
  getEmployee,
  getFormData,
  getPrev_NextDocNo,
  getProject,
  postMCC,
  projectDetails,
} from "../../../api/apiCall";
import AutoComplete from "../../AutoComplete/AutoComplete";
import Loader from "../../Loader/Loader";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AutoComplete2 from "../../AutoComplete/AutoComplete2";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ImageModal from "../ImageViewer";
import MCCTable from "./MCCTable";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

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

const readOnlyStyle = {
  cursor: "text",
  color: "inherit",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid #ced4da",
};

export default function MCCDetails({ id, action, apiName, actions }) {
  const [body, setBody] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [childData1, setChildData1] = useState([]);
  const iUser = localStorage.getItem("userId")? Number(localStorage.getItem("userId")) : ""
  const [type, setType] = useState(0);
  const [project, setProject] = useState();
  const [projectDes, setProjectDes] = useState();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [client, setClient] = useState("");
  const [incharge, setInCharge] = useState("");
  const [makemodel, setMakeModel] = useState("");
  const [dLExpiry, setDLExpiry] = useState("");
  const [register, setRegister] = useState("");
  const [operator, setOperator] = useState("");
  const [demo, setDemo] = useState();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isImageModalOpenSign, setIsImageModalOpenSign] = useState(false);
  const [transId, setTransId] = useState(id);
  const [sign, setSign] = useState("");
  const [docNo, setDocNo] = useState("");
  const [general, setGeneral] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const locations = useLocation();
  const details = locations?.state;

  const HtmlTooltip = styled((props) => (
    <Tooltip {...props} classes={{ popper: props.className }} />
  ))({
    tooltip: {
      backgroundColor: "#f5f5f9",
      maxWidth: "auto",
    },
  });

  const handleImageClick = (index, types) => {
    setType(types);
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCloseImagePopup = () => {
    setSelectedImageIndex(null);
    setIsImageModalOpen(false);
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

  useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      if (transId !== 0 && apiName) {
        const response = await getDetails({ iTransId: transId }, apiName);
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response?.ResultData);
          setBody(myObject?.Body);
          setDocNo(myObject?.Header[0]?.sDocNo || "");
          setTransId(myObject?.Header[0]?.iTransId || "");
          setProject({
            sName: myObject?.Header[0]?.ProjectName,
            iId: myObject?.Header[0]?.iProject,
            sCode: myObject?.Header[0]?.ProjectCode,
          });
          setLocation(myObject?.Header[0]?.sLocation);
          setDate(formatDate(myObject?.Header[0]?.sDate));
          setInCharge({
            sName: myObject?.Header[0]?.sSiteIncharge,
            iId: myObject?.Header[0]?.iSiteIncharge,
          });
          setGeneral(myObject?.Header[0]?.sGeneralComments);
          if (myObject?.Header[0]?.imageFiles?.length) {
            setSelectedFiles(myObject?.Header[0]?.imageFiles);
          } else {
            setSelectedFiles([]);
          }
          if (myObject?.Header[0]?.sImage) {
            const imageArray = myObject?.Header[0]?.sImage.split(";");
            const fullImagePathArray = imageArray.map(
              (image) => `${myObject?.Header[0]?.ImagePath}${image}`
            );
            setSelectedImage(fullImagePathArray);
          }else{
            setSelectedImage([])
          }
          setSign(
            `${myObject?.Header[0]?.SignaturePath}${myObject?.Header[0]?.sSignature}` ||
              ""
          );
          setMakeModel(myObject?.Header[0]?.sMark_Model);
          setDLExpiry(formatDate(myObject?.Header[0]?.DrivingLicenceExpiry));
          setRegister(myObject?.Header[0]?.sRegistrationNo);
          setOperator(myObject?.Header[0]?.sOperatorName);
        }
      } else {
        handleClear();
      }
      handleClose();
    };
    fetchData();
  }, [transId]);

  useEffect(() => {
    const fetchData = async () => {
      if (project?.iId) {
        handleOpen();
        const response = await projectDetails({ iId: project?.iId });
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response?.ResultData);
          setClient(myObject?.Table[0]?.sClient);
        }
        handleClose();
      } else {
        setClient("");
        setProjectDes("");
      }
    };
    fetchData();
  }, [project]);

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

  const handleSave = async (e) => {
    e.preventDefault();

    // Map and transform childData
    const updatedChildData = [...childData1].map((obj, index) => {
      return {
        SlNo: obj.iSLNo,
        Items: obj.iItems,
        Compliance: obj.iCompliance,
        Remarks: obj.sRemarks,
        ActionTaken: obj.sAction_Taken,
      };
    });
    const hasComplianceZero = updatedChildData.some(
      (item) => item.Compliance === 0
    );
    if (hasComplianceZero) {
      handleOpenAlert();
      setMessage(`Ensure complete compliance`);
      return;
    }
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
    let fileSign;
    if (sign) {
      const urlObject = new URL(sign);
      fileSign = urlObject.pathname.split("/").pop();
    } else {
      fileSign = "";
    }
    // // Create updatedData object
    const updatedData = {
      iTransId: transId,
      DocDate: date,
      Project: project?.iId,
      ProjectDes: projectDes,
      Location: location,
      SiteIncharge: incharge?.iId,
      Client: client || "",
      sGeneralComments: general,
      UserId: iUser,
      Mark_Model: makemodel,
      DrivingLicenceExpiry: dLExpiry,
      RegistrationNo: register,
      OperatorName: operator,
      Images: newFileName,
      Signature: fileSign,
      Body: updatedChildData,
    };
    // // Create FormData
    const formData = new FormData();

    formData.append("data", JSON.stringify(updatedData));

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
          const response = await postMCC(formData);
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
              title: `${response?.Status}`,
              text: `${response?.MessageDescription}`,
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
      iForm: 8,
      iUser
    });
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setDocNo(myObject[0].sDocNo);
    }
    const response2 = await getFormData({ FormId: 8, iType: 0 });
    if (response2?.Status === "Success") {
      const myObject = JSON.parse(response2?.ResultData);
      setBody(myObject);
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setTransId(0);
    setProject("");
    setLocation("");
    setDate(formattedDate);
    setInCharge("");
    setClient("");
    setGeneral("");
    setSelectedFiles([]);
    setSelectedImage([]);
    setSign("");
    setMakeModel("");
    setDLExpiry("");
    setRegister("");
    setOperator("");
    handleClose();
  };

  const handleChildData = (data, type) => {
    if (type === 1) {
      setChildData1(data);
    }
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
    const response = await getPrev_NextDocNo({ iTransId, iType, iForm: 8, iUser });
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setTransId(myObject[0]?.iTransId);
    } else {
      setTransId(0);
    }
    handleClose();
  };

 
  const handleFileChange = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
  
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...filesArray];
      
      // Ensure no duplicate files by checking names
      const uniqueFiles = newFiles.filter((file, index, self) =>
        index === self.findIndex((f) => f.name === file.name)
      );
      
      return uniqueFiles;
    });
  
    // Reset the file input value to allow re-selection of the same file
    e.target.value = null;
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

  const handleImageClickSign = (index) => {
    setIsImageModalOpenSign(true);
  };

  const handleCloseImagePopupSign = () => {
    setIsImageModalOpenSign(false);
  };

  const handlePrint = async (id) => {
    handleOpen();
    const response = await crystalPrint({ iTransId: id, iFormtype: 8 });
    handleClose();
    if (response?.Status === "Success") {
      window.open(response?.ResultData, "_blank");
    } else {
      handleOpenAlert();
      setMessage("Can't Reach");
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Pad single-digit month and day with a leading zero
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
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
      {renderButton(8, "Save",null, <SaveIcon />,null, "submit"  )}
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
              {sign ? (
                <IconButton
                  onClick={handleImageClickSign}
                  aria-label="signature"
                >
                  <NoteAltIcon
                    style={{
                      textTransform: "none",
                      color: `${secondaryColorTheme}`,
                    }}
                  />
                </IconButton>
              ) : null}
            </AccordionSummary>
            <AccordionDetails style={{ padding: 0, margin: 0 }}>
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
                        size="small"
                        autoComplete="off"
                        label="Project Details *"
                        value={projectDes}
                        onChange={(e) => setProjectDes(e.target.value)}
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
                        size="small"
                        autoComplete="off"
                        label="Location *"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                        type="text"
                        size="small"
                        autoComplete="off"
                        label="Client"
                        readOnly
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        style={{
                          cursor: "text",
                          color: "inherit",
                          backgroundColor: "transparent",
                          border: "none",
                          borderBottom: "1px solid #ced4da",
                        }}
                      />
                    </div>
                  </MDBCol>
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <AutoComplete2
                        required
                        id="form6Example4"
                        value={incharge}
                        setValue={setInCharge}
                        apiName={getEmployee}
                        setValue2={setDemo}
                        field="Site Incharge"
                      />
                    </div>
                  </MDBCol>
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <MDBInput
                        required
                        id={`form3Example`}
                        type="text"
                        size="small"
                        autoComplete="off"
                        label="Make & Model *"
                        value={makemodel}
                        onChange={(e) => setMakeModel(e.target.value)}
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
                        label="Driving Licence Expiry *"
                        value={dLExpiry}
                        onChange={(e) => setDLExpiry(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        min={getCurrentDate()}
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
                        type="text"
                        size="small"
                        autoComplete="off"
                        label="Registation No. *"
                        value={register}
                        onChange={(e) => setRegister(e.target.value)}
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
                        size="small"
                        autoComplete="off"
                        label="Operator Name *"
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
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
                        label="General Comments *"
                        value={general}
                        onChange={(e) => setGeneral(e.target.value)}
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
              </MDBCardBody>
            </AccordionDetails>
          </Accordion>
        </MDBCard>
        <MCCTable data={body} handleChildData={handleChildData} name="" />

        <Loader open={open} handleClose={handleClose} name="" />
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
      <ImageModal
        isOpen={isImageModalOpenSign}
        imageUrl={sign}
        handleCloseImagePopup={handleCloseImagePopupSign}
      />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </>
  );
}
