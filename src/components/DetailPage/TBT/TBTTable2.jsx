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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
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
  const { rows } = props;

  return (
    <TableHead
      style={{
        background: `${secondaryColorTheme}`,
        top: 0,
        position: "sticky",
        zIndex: 1,
      }}
    >
      <TableRow>
        {rows.map((header, index) => {
          if (
            header !== "iTransId" &&
            header !== "iTransDtId" &&
            header !== "sImage" &&
            header !== "ImagePath" &&
            header !== "iType" &&
            header !== "iItems" &&
            header !== "TypeName" &&
            header !== "iId" &&
            header !== "iSiNo" &&
            header !== "sPath" &&
            header !== "iCompliance" &&
            header !== "sRemarks" &&
            header !== "sAction_Taken"
          ) {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                  color: "white",
                  cursor: "pointer",
                }}
                key={index + header}
                align="center" // Set the alignment to left
                padding="normal"
                scope="row"
              >
                {header === "iDiscussed" ? "Compliance" : header?.slice(1)}
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

export default function TBTTable2({ data, handleChildData }) {
  const [dense, setDense] = React.useState(true);
  const [tableData, setTableData] = React.useState([]);

  React.useEffect(() => {
    handleChildData(tableData, 2);
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
    update[row].iDiscussed = type;
    setTableData([...update]);
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
                sx={{ paddingBottom: 0, marginLeft: 2 }}
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
                    Plan for the Job
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
                                    column !== "sImage" &&
                                    column !== "ImagePath" &&
                                    column !== "iType" &&
                                    column !== "iItems" &&
                                    column !== "TypeName" &&
                                    column !== "iId" &&
                                    column !== "iSiNo" &&
                                    column !== "sPath" &&
                                    column !== "iCompliance" &&
                                    column !== "sRemarks" &&
                                    column !== "sAction_Taken"
                                  ) {
                                    return (
                                      <>
                                        {column === "iDiscussed" ? (
                                          <TableCell
                                            sx={{
                                              padding: 0,
                                              border: " 1px solid #ddd",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              minWidth: "200px",
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
                                                  value="N/A"
                                                  control={<Radio />}
                                                  label="N/A"
                                                  sx={radioButtonStyle}
                                                  checked={row[column] === 2}
                                                  onChange={() =>
                                                    handleChange(index1, 2)
                                                  }
                                                />
                                              </RadioGroup>
                                            </FormControl>
                                          </TableCell>
                                        ) : column === "sDescription" ? (
                                          <TableCell
                                            sx={{
                                              padding: 0,
                                              paddingLeft: 3,
                                              border: " 1px solid #ddd",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              minWidth: "200px",
                                              gap: "2px",
                                            }}
                                            key={row[column]}
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            align="justify"
                                          >
                                            {row[column]}
                                          </TableCell>
                                        ) : (
                                          <TableCell
                                            sx={{
                                              padding: 0,

                                              border: " 1px solid #ddd",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
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
