import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import Swal from "sweetalert2";
import { secondaryColorTheme } from "../../../config";
import { MDBCardHeader } from "mdb-react-ui-kit";

const radioButtonStyle = {
  "& .MuiSvgIcon-root": {
    fontSize: 16,
  },
  "& .MuiFormControlLabel-label": {
    fontSize: 14, // Adjust the label font size as needed
  },
};

function EnhancedTableHead(props) {
  const { rows, setDisplay, display } = props;

  return (
    <TableHead
      style={{
        background: `${secondaryColorTheme}`,
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <TableRow>
        {rows.map((header, index) => {
          if (
            header !== "iTransId" &&
            header !== "iTransDtId" &&
            header !== "iItems" &&
            header !== "TypeName" &&
            header !== "iType" &&
            header !== "iId" &&
            header !== "sImage" &&
            header !== "sPath" &&
            header !== "iSiNo" &&
            header !== "ImagePath" &&
            header !== "iDiscussed"
          ) {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                onClick={() => setDisplay(!display)}
                sx={{
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                  color: "white",
                  cursor: "pointer",
                }}
                key={index + header}
                align={
                  header === "iCompliance" || header === "iSLNo"
                    ? "center"
                    : "left"
                }
                padding="normal"
                scope="row"
              >
                {header?.slice(1)}
              </TableCell>
            );
          }
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function MCCTable({ data, handleChildData, name }) {
  const [dense, setDense] = React.useState(true);
  const [tableData, setTableData] = React.useState([]);
  const [display, setDisplay] = React.useState(false);

  React.useEffect(() => {
    handleChildData(tableData, 1);
  }, [tableData]);

  const fetchData = async () => {
    if (Array.isArray(data) && data.length > 0) {
      setTableData(data);
    } else {
      setTableData([]);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [data]);

  const handleChange = (row, type) => {
    let update = [...tableData];
    update[row].iCompliance = type;
    setTableData([...update]);
  };

  const handleRemark = async (index) => {
    Swal.fire({
      title: "Enter Remarks",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        maxlength: 200,
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showCancelButton: true,
      confirmButtonText: `Add`,
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        let update = [...tableData];
        update[index].sRemarks = login;
        setTableData([...update]);

        Swal.fire({
          title: `Added`,
          text: `Remark Added.`,
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  };

  const handleActionTaken = async (index) => {
    Swal.fire({
      title: "Enter Action to be Taken",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        maxlength: 200,
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showCancelButton: true,
      confirmButtonText: `Add`,
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        let update = [...tableData];
        update[index].sAction_Taken = login;
        setTableData([...update]);

        Swal.fire({
          title: `Added`,
          text: `Action to be Taken Added.`,
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
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
          {tableData && tableData.length > 0 ? (
            <Accordion defaultExpanded>
              <AccordionSummary
                sx={{ paddingBottom: 0, margin: 0 }}
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
                    {name}
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
                      <EnhancedTableHead
                        rowCount={tableData.length}
                        rows={Object.keys(tableData[0])}
                        setDisplay={setDisplay}
                        display={display}
                      />

                      <TableBody>
                        {tableData.map((row, index1) => {
                          const labelId = `enhanced-table-checkbox-${row.iTransDtId}`;

                          return (
                            <TableRow
                              key={row.iTransDtId}
                              hover
                              className={`table-row `}
                              role="checkbox"
                              tabIndex={-1}
                              sx={{ cursor: "pointer", height: "30px" }} // Adjust the height as needed
                            >
                              {Object.keys(tableData[0]).map(
                                (column, index) => {
                                  if (
                                    column !== "iTransId" &&
                                    column !== "iTransDtId" &&
                                    column !== "iItems" &&
                                    column !== "TypeName" &&
                                    column !== "iType" &&
                                    column !== "iId" &&
                                    column !== "sImage" &&
                                    column !== "sPath" &&
                                    column !== "iSiNo" &&
                                    column !== "ImagePath" &&
                                    column !== "iDiscussed"
                                  ) {
                                    return (
                                      <>
                                        {column === "iCompliance" ? (
                                          <TableCell
                                            sx={{
                                              padding: 0,
                                              border: " 1px solid #ddd",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              width: 250,
                                              minWidth: 250,
                                            }}
                                            key={row[column]}
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            align="center"
                                          >
                                            <FormControl>
                                              <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                              >
                                                <FormControlLabel
                                                  value="yes"
                                                  control={<Radio />}
                                                  label="Yes"
                                                  sx={radioButtonStyle}
                                                  checked={row[column] === 1}
                                                  onChange={() =>
                                                    handleChange(index1, 1)
                                                  }
                                                />
                                                <FormControlLabel
                                                  value="no"
                                                  control={<Radio />}
                                                  label="No"
                                                  sx={radioButtonStyle}
                                                  checked={row[column] === 2}
                                                  onChange={() =>
                                                    handleChange(index1, 2)
                                                  }
                                                />
                                                <FormControlLabel
                                                  value="N/A"
                                                  control={<Radio />}
                                                  label="N/A"
                                                  sx={radioButtonStyle}
                                                  checked={row[column] === 3}
                                                  onChange={() =>
                                                    handleChange(index1, 3)
                                                  }
                                                />
                                              </RadioGroup>
                                            </FormControl>
                                          </TableCell>
                                        ) : column === "sRemarks" ? (
                                          <>
                                            {display ? (
                                              <TableCell
                                                sx={{
                                                  border: "1px solid #ddd",
                                                  whiteSpace: "nowrap",
                                                }}
                                                key={row[column]}
                                                onClick={() =>
                                                  handleRemark(index1)
                                                }
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="normal"
                                                align="center"
                                              >
                                                {row[column]}
                                              </TableCell>
                                            ) : (
                                              <TableCell
                                                sx={{
                                                  border: "1px solid #ddd",
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  width: 150,
                                                  maxWidth: 150,
                                                }}
                                                key={row[column]}
                                                onClick={() =>
                                                  handleRemark(index1)
                                                }
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="normal"
                                                align="center"
                                              >
                                                {row[column]}
                                              </TableCell>
                                            )}
                                          </>
                                        ) : column === "sAction_Taken" ? (
                                          <>
                                            {display ? (
                                              <TableCell
                                                sx={{
                                                  border: "1px solid #ddd",
                                                  whiteSpace: "nowrap",
                                                }}
                                                key={row[column]}
                                                onClick={() =>
                                                  handleActionTaken(index1)
                                                }
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="normal"
                                                align="center"
                                              >
                                                {row[column]}
                                              </TableCell>
                                            ) : (
                                              <TableCell
                                                sx={{
                                                  border: "1px solid #ddd",
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  width: 150,
                                                  maxWidth: 150,
                                                }}
                                                key={row[column]}
                                                onClick={() =>
                                                  handleActionTaken(index1)
                                                }
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="normal"
                                                align="center"
                                              >
                                                {row[column]}
                                              </TableCell>
                                            )}
                                          </>
                                        ) : column === "sDescription" ? (
                                          <TableCell
                                            sx={{
                                              border: "1px solid #ddd",
                                              whiteSpace: "nowrap",
                                            }}
                                            key={row[column]}
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="normal"
                                            align="left"
                                          >
                                            {row[column]}
                                          </TableCell>
                                        ) : (
                                          <TableCell
                                            sx={{
                                              border: "1px solid #ddd",
                                              whiteSpace: "nowrap",
                                            }}
                                            key={row[column]}
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="normal"
                                            align="center"
                                          >
                                            {row[column]}
                                          </TableCell>
                                        )}
                                      </>
                                    );
                                  }
                                }
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </AccordionDetails>
            </Accordion>
          ) : null}
        </Box>
      </>
    </>
  );
}
