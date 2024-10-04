import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import { buttonColors, secondaryColorTheme } from "../../../config";
import ImageModal from "../ImageViewer";
import { MDBCardHeader } from "mdb-react-ui-kit";

function EnhancedTableHead(props) {
  return (
    <TableHead
      style={{
        background: `${secondaryColorTheme}`,
        position: "sticky",
        top: 0,
        zIndex: "1",
      }}
    >
      <TableRow>
        <TableCell
          sx={{
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            color: "white",
            cursor: "pointer",
          }}
          align="center" // Set the alignment to left
          padding="normal"
        >
          Sl No
        </TableCell>
        <TableCell
          sx={{
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            color: "white",
            cursor: "pointer",
          }}
          component="th"
          scope="row"
          padding="normal"
          align="center"
        >
          Image
        </TableCell>
        <TableCell
          sx={{
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            color: "white",
            cursor: "pointer",
          }}
          component="th"
          scope="row"
          padding="normal"
          align="center"
        >
          Observations / Findings
        </TableCell>
        <TableCell
          sx={{
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            color: "white",
            cursor: "pointer",
          }}
          component="th"
          scope="row"
          padding="normal"
          align="center"
        >
          Risk Level
        </TableCell>
        <TableCell
          sx={{
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            color: "white",
            cursor: "pointer",
          }}
          component="th"
          scope="row"
          padding="normal"
          align="center"
        >
          Action Required
        </TableCell>
        <TableCell
          sx={{
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            color: "white",
            cursor: "pointer",
          }}
          component="th"
          scope="row"
          padding="normal"
          align="center"
        >
          Action By
        </TableCell>
        <TableCell
          sx={{
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            color: "white",
            cursor: "pointer",
          }}
          component="th"
          scope="row"
          padding="normal"
          align="center"
        >
          Date
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function CloseHseTable({ data, handleChildData }) {
  const [dense, setDense] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [popup, setPopup] = React.useState();
  const [isNewPage, setIsNewPage] = React.useState(false);
  const [tableData, setTableData] = React.useState([]);
  const [rowIndex, setRowIndex] = React.useState(-1);
  const [isImageModalOpenSign, setIsImageModalOpenSign] = React.useState(false);
  const [sign, setSign] = React.useState("");

  const handleImageClickSign = (path) => {
    setSign(path);
    setIsImageModalOpenSign(true);
  };

  const handleCloseImagePopupSign = () => {
    setIsImageModalOpenSign(false);
  };

  return (
    <>
      <>
        <Box
          sx={{
            width: "auto",
            marginTop: 3,
            zIndex: 1,
            backgroundColor: "#ffff",
            borderRadius: 2,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Accordion defaultExpanded sx={{ padding: 0, margin: 0 }}>
            <AccordionSummary
              sx={{ paddingBottom: 0, marginLeft: 1 }}
              expandIcon={<ExpandMoreIcon />}
            >
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
                  General Condition
                </Typography>
              </MDBCardHeader>
            </AccordionSummary>
            <AccordionDetails style={{ padding: 0, margin: 0 }}>
              <Paper
                sx={{
                  width: "100%",
                }}
              >
                <TableContainer
                  style={{
                    display: "block",
                    maxHeight: "calc(100vh - 400px)",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#888 #f5f5f5",
                    scrollbarTrackColor: "#f5f5f5",
                  }}
                >
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                  >
                    <EnhancedTableHead />

                    <TableBody>
                      <TableRow
                        hover
                        className={`table-row `}
                        role="checkbox"
                        tabIndex={-1}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell
                          sx={{
                            border: "1px solid #ddd",
                            whiteSpace: "nowrap",
                          }}
                          align="center"
                        >
                          <>1</>
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: 0,

                            border: " 1px solid #ddd",
                            minWidth: "100px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          align="center"
                        >
                          <>
                            <IconButton
                              onClick={() =>
                                handleImageClickSign(
                                  data?.sPath + data?.HseImages
                                )
                              }
                              style={{
                                fontSize: "16px", // Adjust the font size as needed
                                width: "32px", // Adjust the width as needed
                                height: "32px", // Adjust the height as needed
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ddd",
                            whiteSpace: "nowrap",
                          }}
                          align="center"
                        >
                          {data?.sObservation}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ddd",
                            whiteSpace: "nowrap",
                          }}
                          align="center"
                        >
                          {data?.iRiskLevel === 1
                            ? "Low"
                            : data?.iRiskLevel === 2
                            ? "Medium"
                            : data?.iRiskLevel === 3
                            ? "High"
                            : ""}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ddd",
                            whiteSpace: "nowrap",
                          }}
                          align="center"
                        >
                          {data?.sActionReq}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ddd",
                            whiteSpace: "nowrap",
                          }}
                          align="center"
                        >
                          {data?.sActionBy}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ddd",
                            whiteSpace: "nowrap",
                          }}
                          align="center"
                        >
                          {data?.Date}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Box>
      </>

      <ImageModal
        isOpen={isImageModalOpenSign}
        imageUrl={sign}
        handleCloseImagePopup={handleCloseImagePopupSign}
      />
    </>
  );
}
