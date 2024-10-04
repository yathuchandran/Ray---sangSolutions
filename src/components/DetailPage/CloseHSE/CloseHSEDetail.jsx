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
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";
import { buttonColors, secondaryColorTheme } from "../../../config";
import {
  fileUpload,
  getCloseHSEStatus,
  getDetails,
  postCloseHSE,
} from "../../../api/apiCall";
import Loader from "../../Loader/Loader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AutoComplete4 from "../../AutoComplete/AutoComplete4";
import ImageModal from "../ImageViewer";
import CloseHseTable from "./CloseHseTable";

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

const readOnlyStyle = {
  cursor: "text",
  color: "inherit",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid #ced4da",
};

export default function CloseHSEDetail({ id, action, apiName, actions }) {
  const [body, setBody] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [childData, setChildData] = useState([]);
  const iUser = localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : "";
  const [type, setType] = useState(0);
  const [project, setProject] = useState();
  const [projectDes, setProjectDes] = useState();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [transDtId, setTransDtId] = useState(0);
  const [HSETransDtId, setHSETransDtId] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [transId, setTransId] = useState(id);

  const locations = useLocation();
  const details = locations?.state;

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

  const HtmlTooltip = styled((props) => (
    <Tooltip {...props} classes={{ popper: props.className }} />
  ))({
    tooltip: {
      backgroundColor: "#f5f5f9",
      maxWidth: "auto",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      if (transId !== 0) {
        const response = await getDetails(
          { TransId: transId, UserId: iUser },
          "ReactCloseHSE"
        );
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response?.ResultData);
          setBody(myObject?.Table[0]);
          setProject(myObject?.Table1[0]?.sProject);
          setProjectDes(myObject?.Table1[0]?.sProjectDes);
          setLocation(myObject?.Table1[0]?.sLocation);
          setDate(formatDate(myObject?.Table1[0]?.Date));
          setStatus({
            sName: myObject?.Table[0]?.sStatus,
            iId: myObject?.Table[0]?.iStatus,
          });
          setLogs(myObject?.Table[0]?.sRemarks);
          setTransDtId(myObject?.Table[0]?.iTransDtId);
          setHSETransDtId(myObject?.Table[0]?.iHSETransDtId);
          if (myObject?.Table[0]?.CloseHseImages) {
            const imageArray = myObject?.Table[0]?.CloseHseImages.split(";");
            const fullImagePathArray = imageArray.map(
              (image) => `${myObject?.Table[0]?.sClosePath}${image}`
            );
            setSelectedImage(fullImagePathArray);
          }
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

  const handleSave = async (e) => {
    e.preventDefault();

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
    // // Create updatedData object
    const updatedData = {
      iTransDtId: transDtId,
      iHSETransDtId: HSETransDtId,
      Date: date,
      Status: status?.iId || 0,
      UserId: iUser,
      Remarks: remark,
      Images: newFileName,
    };
    const formData = new FormData();
    formData.append("4", 4);
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
          const response = await postCloseHSE(updatedData);
          let response2;
          if (selectedFiles && selectedFiles.length) {
            response2 = await fileUpload(formData);
          }
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
    setProject();
    setProjectDes("");
    setLocation("");
    setDate("");
    setStatus("");
    setLogs("");
    setTransDtId(0);
    setHSETransDtId(0);

    setSelectedImage([]);
    setSelectedFiles([]);

    setTransId(0);
    action();
  };

  const handleChildData = (data) => {
    setChildData(data);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
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
          
            {renderButton(8, "Save",null, <SaveIcon />,null, 'submit' )}
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
                    label="Project"
                    value={project}
                    autoComplete="off"
                    onChange={(e) => setProject(e.target.value)}
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
              <MDBCardBody style={{ paddingBottom: 0 }}>
                <MDBRow>
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <MDBInput
                        required
                        id={`form3Example`}
                        type="text"
                        size="small"
                        label="Project Details"
                        value={projectDes}
                        onChange={(e) => setProjectDes(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        readonly
                        style={readOnlyStyle}
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
                        label="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        readonly
                        style={readOnlyStyle}
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
                        label="Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        readonly
                        style={readOnlyStyle}
                        onKeyDown={(e) => e.preventDefault()}
                        onClick={(e) => e.target.showPicker?.()} // This line is for modern browsers
                        onFocus={(e) => e.target.showPicker?.()}
                      />
                    </div>
                  </MDBCol>
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <AutoComplete4
                        required
                        id="form6Example4"
                        value={status}
                        setValue={setStatus}
                        apiName={getCloseHSEStatus}
                        field="Status"
                        payload={{ UserId: iUser, Status: status?.iId || 0 }}
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
                        label="Log"
                        value={logs}
                        onChange={(e) => setLogs(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        readonly
                        style={readOnlyStyle}
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
                        label="Remark"
                        autoComplete="off"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
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

        <Loader open={open} handleClose={handleClose} />
      </form>
      <CloseHseTable data={body} />
      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={
          type === 1 && selectedFiles[selectedImageIndex]
            ? URL.createObjectURL(selectedFiles[selectedImageIndex])
            : selectedImage[selectedImageIndex]
        }
        handleCloseImagePopup={handleCloseImagePopup}
      />
    </>
  );
}
