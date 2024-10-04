import React, { useEffect, useState } from "react";
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
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  tooltipClasses,
  withStyles,
} from "@mui/material";
import { buttonColors, secondaryColorTheme } from "../../config";
import { MDBRow, MDBCol, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getEmployee } from "../../api/apiCall";
import AutoComplete2 from "../AutoComplete/AutoComplete2";
import ImageModal from "./ImageViewer";
import Loader from "../Loader/Loader";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

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

export default function Modal({
  isOpen,
  data,
  handleCloseModal,
  handleRowData,
  rowIndex,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [riskLevel, setRiskLevel] = useState();
  const [observation, setObservation] = useState("");
  const [actionReq, setActionReq] = useState("");
  const [actionBy, setActionBy] = useState();
  const [EmployeeCode, setEmployeeCode] = useState("");
  const [date, setDate] = useState("");
  const [transId, setTransId] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState(0);
  const [newRowIndex, setNewRowIndex] = useState(0);
  const { register, handleSubmit, reset } = useForm();
  const handleImageClick = (index, types) => {
    ``;
    setType(types);
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCloseImagePopup = () => {
    setSelectedImageIndex(null);
    setIsImageModalOpen(false);
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

  const suggestionRistLevel = [
    { iId: 1, sName: "Low" },
    { iId: 2, sName: "Medium" },
    { iId: 3, sName: "High" },
  ];

  const modalStyle = {
    display: isOpen ? "block" : "none",
  };

  const iUser = Number(localStorage.getItem("userId"));

  useEffect(() => {
    handleOpen();
    if (data && Object.keys(data).length > 0) {
      setNewRowIndex(rowIndex);
      const result = suggestionRistLevel.find(
        (item) => item.iId === data?.iRiskLevel
      );
      setTransId(data?.iTransId);
      setRiskLevel(result);
      setObservation(data?.sObservation);
      setActionBy({ sName: data?.sActionBy, iId: data?.iActionBy });
      setEmployeeCode(data?.sActionBy_Code);
      setActionReq(data?.sActionReq);

      setDate(data?.TargetDate);

      if (data?.imageFiles?.length) {
        setSelectedFiles(data?.imageFiles);
      }else{
        setSelectedFiles([])
      }
      if (data?.sImages) {
        const imageArray = data?.sImages.split(";");
        const fullImagePathArray = imageArray.map(
          (image) => `${data?.sPath}${image}`
        );
        setSelectedImage(fullImagePathArray);
      }else{
        setSelectedImage([]);
      }
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

  const formatDate = (inputDate) => {
    if (!inputDate) return "";

    const parts = inputDate.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    } else {
      console.error(`Invalid date format: ${inputDate}`);
      return "";
    }
  };

  const handleClear = () => {
    setNewRowIndex(-1);
    setRiskLevel("");
    setObservation("");
    setActionBy({});
    setActionReq("");
    setEmployeeCode("");
    setTransId(0);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate);
    setSelectedFiles([]);
    setSelectedImage([]);
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const handleSave = () => {
    // Trigger the validation
    handleSubmit((data) => {
      // Add validation logic here
      const emptyFields = [];

      if (!observation) emptyFields.push("Observation");
      if (!riskLevel) emptyFields.push("Risk Level");
      if (!actionReq) emptyFields.push("Action Required");
      if (!actionBy?.iId) emptyFields.push("Action By");
      if (!date) emptyFields.push("Target Date");

      if (emptyFields.length > 0) {
        handleOpenAlert();
        setMessage(
          `Please fill in the following mandatory fields: ${emptyFields.join(
            ", "
          )}.`
        );
        return;
      }

      // Rest of your code for saving data

      let fileNames = "";
      let pathUrl = "";

      if (selectedImage && selectedImage.length) {
        fileNames = selectedImage
          .map((url) => {
            const parts = url.split("/");
            return parts.pop(); // Remove and return the last part of the array
          })
          .join(";"); // Assign the joined string back to the variable

        const baseUrl = new URL(selectedImage[0]);
        baseUrl.pathname = baseUrl.pathname.substring(
          0,
          baseUrl.pathname.lastIndexOf("/") + 1
        );
        pathUrl = baseUrl.href;
      }

      let newDate;

      const dateObject = new Date(date);

      // Get the day, month, and year from the Date object
      const day = dateObject.getDate();
      const month = dateObject.getMonth() + 1; // Months are zero-based, so add 1
      const year = dateObject.getFullYear();

      // Format the date components with leading zeros if needed
      const formattedDate = `${day < 10 ? "0" : ""}${day}-${
        month < 10 ? "0" : ""
      }${month}-${year}`;

      const saveData = {
        sObservation: observation,
        iRiskLevel: riskLevel?.iId,
        iActionBy: actionBy?.iId,
        sActionReq: actionReq,
        TargetDate: date,
        sPath: pathUrl,
        sActionBy_Code: EmployeeCode,
        sActionBy: actionBy?.sName,
        sImages: fileNames,
        iTransId: transId,
        imageFiles: selectedFiles,
      };

      handleRowData(saveData, newRowIndex);
      handleAllClear();
    })();
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
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

  const HtmlTooltip = styled((props) => (
    <Tooltip {...props} classes={{ popper: props.className }} />
  ))({
    tooltip: {
      backgroundColor: "#f5f5f9",
      maxWidth: "auto",
    },
  });

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
                      <MDBInput
                        required
                        value={observation}
                        id="form6Example1"
                        autoComplete="off"
                        maxLength={500}
                        label="Observations / Findings *"
                        onChange={(e) => setObservation(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </MDBCol>
                    <MDBCol>
                      <Autocomplete
                        id={`size-small-filled-assetType`}
                        size="small"
                        value={riskLevel || ""}
                        onChange={(event, newValue) => {
                          setRiskLevel(newValue);
                        }}
                        options={suggestionRistLevel.map((data) => ({
                          sName: data?.sName,
                          iId: data?.iId,
                        }))}
                        filterOptions={(options, { inputValue }) => {
                          return options.filter((option) =>
                            option.sName
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                          );
                        }}
                        autoHighlight
                        getOptionLabel={(option) =>
                          option && option.sName ? option.sName : ""
                        }
                        renderOption={(props, option) => (
                          <li {...props}>
                            <div
                              className=""
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Typography
                                style={{
                                  marginRight: "auto",
                                  fontSize: "12px",
                                  fontWeight: "normal",
                                }}
                              >
                                {option.sName}
                              </Typography>
                            </div>
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            required
                            label="Risk Level"
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "off",
                              style: {
                                borderWidth: "1px",
                                borderColor: "#ddd",
                                borderRadius: "10px",
                                fontSize: "15px",
                                height: "20px",
                                paddingLeft: "6px",
                              },
                            }}
                          />
                        )}
                        style={{ width: `auto` }}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        required
                        value={actionReq}
                        id="form6Example3"
                        maxLength={500}
                        label="Action Required *"
                        onChange={(e) => setActionReq(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        autoComplete="off"
                      />
                    </MDBCol>
                    <MDBCol>
                      <AutoComplete2
                        required
                        id="form6Example4"
                        value={actionBy}
                        setValue={setActionBy}
                        apiName={getEmployee}
                        setValue2={setEmployeeCode}
                        field="Action By"
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        required
                        value={EmployeeCode}
                        id="form6Example3"
                        label="Employee Code"
                        onChange={(e) => setEmployeeCode(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        autoComplete="off"
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        required
                        value={date}
                        id="form6Example6"
                        type="date"
                        label="Target Date *"
                        onChange={(e) => setDate(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        autoComplete="off"
                        onKeyDown={(e) => e.preventDefault()}
                        onClick={(e) => e.target.showPicker?.()} // This line is for modern browsers
                        onFocus={(e) => e.target.showPicker?.()}
                      />
                    </MDBCol>
                  </MDBRow>

                  <>
                    <MDBRow className="mb-4">
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
                        </HtmlTooltip>
                      ))}
                      <div
                        className="file-upload-container"
                        style={{
                          textAlign: "center",
                          border: "3px dashed rgb(210, 227, 244)",
                          padding: "0.2rem",
                          position: "relative",
                          cursor: "pointer",
                          borderRadius: 10,
                          height: "50px",
                          width: "70px",
                          paddingLeft: "0.2rem",
                          marginLeft: 10,
                        }}
                      >
                        <Button component="label">
                          <div>
                            <AddAPhotoIcon style={{ color: "#adacac" }} />
                          </div>
                          <VisuallyHiddenInput
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(e)}
                          />
                        </Button>
                      </div>
                    </MDBRow>
                  </>

                  {/* <MDBRow className="mb-4">
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload files
                      <VisuallyHiddenInput
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e)}
                      />
                    </Button>
                  </MDBRow> */}
                </Box>
              </form>
            </div>
          </div>
        </div>
      </Zoom>
      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={
          type === 1 && selectedFiles[selectedImageIndex]
            ? URL.createObjectURL(selectedFiles[selectedImageIndex])
            : selectedImage[selectedImageIndex]
        }
        handleCloseImagePopup={handleCloseImagePopup}
      />

      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </div>
  );
}
