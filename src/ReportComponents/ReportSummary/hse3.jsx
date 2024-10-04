import React, { useEffect, useState } from 'react'
import { Box, Paper } from '@mui/material';
import { buttonColors, secondaryColorTheme } from "../../config";
import { Button, ButtonGroup, TextField } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import exportToExcel from './ExportTOexcel'
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import TablePagination from '@mui/material/TablePagination';
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    IconButton,

} from "@mui/material";

import {
      MDBCard,
    MDBCardBody,

} from "mdb-react-ui-kit";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SearchIcon from '@mui/icons-material/Search';
import { CrystalPrint, GetAllEmployee, GetProject, GetUser, GetcloseStatus, HSEReactReport } from '../../api/api';
import { useLocation, useNavigate } from 'react-router-dom';

function hse3({ data }) {
    const [ProjectsList, setProjectLists] = useState([])
    const [FromDate, setFromDate] = useState("")
    const [TODate, setTodate] = useState('')
    const [Project, setProject] = useState(0)
    const [Employee, setEmployee] = useState('')
    const [Supervisor, setSupervisor] = useState('')
    const [riskLevel, setRiskLevel] = useState(0);
    const [closeStatus, setCloseStatus] = useState([])
    const [images, setImages] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [iProjects, setIproject] = useState(0)
    const [intiate, setinitiate] = useState(0)
    const [Action, setAction] = useState(0)
    // const [visibleData, setVisibleData] = useState([]);
    const [visibleHeaders, setVisibleHeaders] = useState([]);

    const [searchQuery, setSearchQuery] = React.useState("");
    const [filteredRows, setFilteredRows] = React.useState([]);

    const [displayLength, setdisplayLength] = useState(10);
    const [displayStart, setdisplayStart] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const location = useLocation();
    const details = location.state;
    const navigates = useNavigate()
    const PageName = details.sName


    const handleDisplayStartChange = (newDisplayStart) => {
        setdisplayStart(newDisplayStart);
    };
    const handleDisplayLengthChange = (newDisplayLength) => {
        setdisplayLength(newDisplayLength);
    };

    const handleExportToExcel = () => {
        if (ProjectsList.length > 0) {
            exportToExcel(ProjectsList, visibleHeaders, PageName); // Pass your filtered/visibleRows data here
        }
    };


    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleOpenImages = (images) => {
        if (images && images.sImages && images.sPath) {
            const Image = images.sImages;
            const Path = images.sPath;
            const imageArray = images.sImages.split(";");
            const imageUrlArray = imageArray.map(image => Path + image);
            setImages(imageUrlArray);
            setOpenModal(true);
        }
    };

 
    const suggestionRistLevel = [
        { iId: 1, sName: "Low" },
        { iId: 2, sName: "Medium" },
        { iId: 3, sName: "High" },
    ];


    //API DATA CALLING USEEFECT----------------------------------------------
    useEffect(() => {
        const getProjects = async () => {
            try {
                const res = await GetProject({
                    iStatus: 1,
                    sSearch: ""
                })
                const data = JSON.parse(res?.ResultData)
                setProject(data.sName)
            } catch (error) {
                console.log(error);
            }
        }
        getProjects()

        const GetUsers = async () => {
            try {
                const res = await GetUser({
                    sSearch: ""
                })
                const data = JSON.parse(res?.ResultData)
                setEmployee(data.sName)
            } catch (error) {
                console.log(error);
            }
        }
        GetUsers()

        const GetAllEmployees = async () => {
            try {
                const res = await GetAllEmployee({
                    sSearch: ""
                })
                const data = JSON.parse(res?.ResultData)
                setSupervisor(data.sName)
            } catch (error) {
                console.log(error);
            }
        }
        GetAllEmployees()

        const GetcloseStatuss = async () => {
            try {
                const res = await GetcloseStatus()
                const data = JSON.parse(res?.ResultData)
                setCloseStatus(data)
            } catch (error) {
                console.log(error);
            }
        }
        GetcloseStatuss()

        if (data && Object.keys(data).length > 0) {
            const result = suggestionRistLevel.find(
                (item) => item.iId === data?.iRiskLevel
            );
            setRiskLevel(result)
        }

    }, [])

    const getInitialFormData = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(currentDate.getDate()).padStart(2, "0");
        const formattedCurrentDate = `${year}-${month}-${day}`;

        const tenDaysAgoDate = new Date();
        tenDaysAgoDate.setDate(tenDaysAgoDate.getDate() - 7);
        const tenDaysAgoYear = tenDaysAgoDate.getFullYear();
        const tenDaysAgoMonth = String(tenDaysAgoDate.getMonth() + 1).padStart(2, "0");
        const tenDaysAgoDay = String(tenDaysAgoDate.getDate()).padStart(2, "0");
        const formattedTenDaysAgoDate = `${tenDaysAgoYear}-${tenDaysAgoMonth}-${tenDaysAgoDay}`;

        setFromDate(formattedTenDaysAgoDate);
        setTodate(formattedCurrentDate);


        return {
            DisplayLength: displayLength,
            DisplayStart: displayStart,
            FromDate: "2023-01-01",
            ToDate: "2024-02-24",
            iProject: iProjects,
            initiatedBy: intiate,
            iActionBy: Action,
            iRisklevel: riskLevel,
            istatus: 0,
            Search: ""
        }
    };

    useEffect(() => {
        const resetFormData = getInitialFormData();
        fetchData(resetFormData)
    }, [])

    useEffect(() => {
    const newFormdata={
      DisplayLength: displayLength,
        DisplayStart: displayStart,
        FromDate: "2023-01-01",
        ToDate:  "2024-02-24",
        iProject: iProjects,
        initiatedBy: intiate,
        iActionBy: Action,
        iRisklevel: riskLevel,
        istatus: 0,
        Search: "",
    }
    fetchData(newFormdata)
  }, [displayLength,displayStart])

    // initialData SETTING FUNCTION-------------------------------------------
    const fetchData = async (initialData) => {
        handleOpen()
        try {
            const res = await HSEReactReport({
                DisplayLength: displayLength,
                DisplayStart: displayStart,
                FromDate: initialData.FromDate,
                ToDate: initialData.ToDate,
                iProject: initialData.iProject,
                initiatedBy: initialData.initiatedBy,
                iActionBy: initialData.iActionBy,
                iRisklevel: initialData.iRisklevel,
                istatus: initialData.istatus,
                Search: initialData.Search,
            });
            setProjectLists(res);
            handleClose()
        } catch (error) {
            console.log(error);
            handleClose()
        }
    }



    //PAGINATION AND SEARCH FUNCTION-------------------------------------------------
    const handleChangePage = (newPage) => {
        setPage(newPage);
        const newDisplayStart = newPage * rowsPerPage;
        handleDisplayStartChange(newDisplayStart);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        const newDisplayStart = 0;
        handleDisplayStartChange(newDisplayStart);
        handleDisplayLengthChange(newRowsPerPage);
    };



    //SEARCH FUNCTION-----------------------------------------------------------
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };
    useEffect(() => {
        if (searchQuery) {
            const filteredRows = ProjectsList.filter((row) =>
                Object.values(row).some((value) => {
                    if (typeof value === "string") {
                        return value.toLowerCase().includes(searchQuery.toLowerCase());
                    }
                    if (typeof value === "number") {
                        return value.toString().includes(searchQuery.toLowerCase());
                    }
                    return false; // Ignore other types
                })
            );
            setFilteredRows(filteredRows);
        } else {
            setFilteredRows(ProjectsList);
        }
    }, [searchQuery, ProjectsList, page, rowsPerPage]);


    const handleopenpdf = async (iTransId) => {
        const crystalRes = await CrystalPrint({
            iTransId: iTransId,
            iFormtype: 1,
        });
        window.open(crystalRes.ResultData, "_blank")
    }

    const handleClosedpdf = async (iTransDtId) => {
        if (iTransDtId) {
            const crystalRes = await CrystalPrint({
                iTransId: iTransDtId,
                iFormtype: 3,
            });

            window.open(crystalRes.ResultData, "_blank")
        }

    }

    return (
        <div> <Box>
            <MDBCard
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                    zIndex: 1,
                    marginTop: 20,
                }}
            >
                {ProjectsList && (
                    <Box sx={{ width: "95%", margin: "auto", marginTop: "30px" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <FormControl sx={{ m: 1 }}>
                                <InputLabel htmlFor="rows-per-page">Show Entries</InputLabel>
                                <Select
                                    value={rowsPerPage}
                                    onChange={handleChangeRowsPerPage}
                                    label="Rows per page"
                                    inputProps={{
                                        name: "rows-per-page",
                                        id: "rows-per-page",
                                    }}
                                    sx={{
                                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" },
                                        width: { xs: "80px", sm: "120px", md: "150px" },
                                        height: { xs: "25px", sm: "35px", md: "35px" },
                                    }}
                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Search"
                                variant="outlined"
                                size="small"
                                value={searchQuery}
                                onChange={handleSearch}
                                sx={{
                                    '& input': {
                                        padding: '3px 4px', // Adjust padding for input text
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon sx={{ marginRight: '8px', color: 'grey' }} />
                                    ),
                                }}
                            />
                        </div>
                        <Paper sx={{ width: "100%", mb: 2 }}>
                            <TableContainer sx={{ maxHeight: "40vh", overflow: "scroll" }}>
                                <Table
                                    stickyHeader
                                    sx={{ minWidth: 750 }}
                                    aria-labelledby="tableTitle"
                                >
                                    <TableHead>
                                        {filteredRows && filteredRows.length > 0 && (
                                            <TableRow>
                                                {Object.keys(filteredRows[0])
                                                    .filter((key) => key !== "totalRows" && key !== "sPath" && key !== "Observation" && key !== "ActionReq" && key !== "ProjectDes") // Exclude sPath from the keys
                                                    .map((key) => (
                                                        <TableCell
                                                            key={key}
                                                            align={"left"}
                                                            sx={{
                                                                padding: "4px",
                                                                border: " 1px solid #ddd",
                                                                fontWeight: "600",
                                                                font: "14px",
                                                                backgroundColor: secondaryColorTheme,
                                                                color: "white",
                                                            }}

                                                        >
                                                            {key === "sImages" ? "Images" :
                                                                key === "iTransId" ? "OpenPdf" :
                                                                    key === "iTransDtId" ? "Closed Pdf" :
                                                                        key === "RaisedBy" ? "InitiatedBy" :
                                                                            key}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        )}
                                    </TableHead>

                                    <TableBody>
                                        {filteredRows && filteredRows.length > 0 && filteredRows
                                            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow
                                                        hover
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                        sx={{ cursor: "pointer" }}
                                                        key={row.iId} // Fix: Use row.id instead of row.iId
                                                    >

                                                        {Object.keys(row)
                                                    .filter((key) => key !== "totalRows" && key !== "sPath" && key !== "Observation" && key !== "ActionReq" && key !== "ProjectDes") // Exclude sPath from the keys
                                                    .map((key, idx) => (
                                                                <TableCell
                                                                    sx={{
                                                                        padding: "0px",
                                                                        border: " 1px solid #ddd",
                                                                        minWidth: "100px",
                                                                        whiteSpace: "nowrap",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                    }}
                                                                    style={{
                                                                        // width: ${columnWidths[columnKey]}px,
                                                                        maxWidth: "300px",
                                                                        whiteSpace: "nowrap",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        borderBottom: "0px solid #ddd",
                                                                        borderLeft: "1px solid #ddd",
                                                                        borderRight: "1px solid #ddd",
                                                                        fontSize: "14px",
                                                                        // textAlign: shouldAlignRight ? "right" : "left",
                                                                    }}
                                                                    key={idx}
                                                                >
                                                                    {key === "sImages" ? (
                                                                        row[key] ? (
                                                                            <Button onClick={() => handleOpenImages(row)}>
                                                                                <ImageIcon />
                                                                            </Button>
                                                                        ) : (
                                                                            <><BrokenImageIcon sx={{ color: secondaryColorTheme }} /><span>No image</span></>// Display text if sPhoto is null or empty

                                                                        )

                                                                    ) : key === "iTransId" ? (
                                                                        <Button onClick={() => handleopenpdf(row[key])} >
                                                                            <PictureAsPdfIcon />
                                                                        </Button>
                                                                    ) : key === "iTransDtId" ? (
                                                                        <Button onClick={() => handleClosedpdf(row[key])}>
                                                                            <PictureAsPdfIcon />
                                                                        </Button>
                                                                    ) : (
                                                                        row[key]
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>


                                </Table>

                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={ProjectsList.length>0? ProjectsList[0].totalRows : 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={(props) => (
                                    <TablePaginationActions
                                        {...props}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        ProjectsList={ProjectsList} // Pass ProjectsList as a prop
                                        onChangePage={handleChangePage}
                                    />
                                )}

                            />
                        </Paper>
                    </Box>
                )}
            </MDBCard>
        </Box>


        </div>
    )
}

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
    const lastPage = Math.ceil(count / rowsPerPage) - 1;
    const startPage = Math.max(0, page - 2);
    const endPage = Math.min(lastPage, page + 2);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);

    const handlePageButtonClick = (newPage) => {
        onPageChange(newPage);
    };

    return (
        <div style={{ flexShrink: 0, marginLeft: 20 }}>
            {page > 0 && (
                <IconButton onClick={() => handlePageButtonClick(0)}>
                    <FirstPageIcon />
                </IconButton>
            )}
            {pages.map((pageNum) => (
                <IconButton
                    key={pageNum}
                    color={pageNum === page ? 'primary' : 'default'}
                    onClick={() => handlePageButtonClick(pageNum)}
                    disabled={pageNum > lastPage}
                    sx={{
                        width: '30px',
                        height: '30px',
                        padding: '0px',
                        margin: '0px',
                        borderRadius: '50%',
                        color: 'inherit',
                        backgroundColor: pageNum === page ? 'grey' : 'white',
                        '&:hover': {
                            backgroundColor: pageNum === page ? 'grey' : 'lightgrey',
                        },
                        '&.Mui-disabled': {
                            backgroundColor: 'white',
                        },
                    }}
                >
                    {pageNum + 1}
                </IconButton>
            ))}
            {page < lastPage && (
                <IconButton onClick={() => handlePageButtonClick(lastPage)} >
                    <LastPageIcon />
                </IconButton>
            )}
        </div>
    );
};
export default hse3