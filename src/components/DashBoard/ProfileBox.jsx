import React, { useEffect, useState } from "react";
import { GetBestEmployee } from "../../api/dashboardApi";
import {
  CButton,
  CCard,
  CCardBody,
  CCardText,
  CCol,
  CImage,
  CRow,
} from "@coreui/react";
import Loader from "../Loader/Loader";
import { MDBCard } from "mdb-react-ui-kit";
import { barTable } from "../../config";
import { BestEmployeeGetCompany } from "../../api/apiHelper";
import { Typography } from "@mui/material";

export default function ProfileBox() {
  const [employeData, setEmployeData] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const [companyList, setcompanyList] = useState([])

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        handleOpen()
        const response = await GetBestEmployee(selectedButtonId);
        if (response.Status === "Success") {
          const parsedData = JSON.parse(response.ResultData);
          setEmployeData(parsedData);
          
        } 
        else{
          setEmployeData([])
        }
        handleClose()
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if(selectedButtonId)
    fetchData();
  }, [selectedButtonId]);

  const handleButtonClick = (iId) => {
   
    setSelectedButtonId(iId);
  };
  useEffect(() => {
    const fetchCompany = async()=>{

      try {
      
        const response = await BestEmployeeGetCompany()
        if(response?.ResultData?.length>0){
          const data = JSON.parse(response.ResultData)
          setcompanyList(data)
          setSelectedButtonId(data[0].iId)
         
        }
        
  
      } catch (error) {
        
      }

    }
    

    fetchCompany()
   
  }, [])

  const buttonColors = barTable.map((item) => item.colorBg);
  const selectedCompany =companyList && companyList.find(
    (company) => company.iId === selectedButtonId
  );
  return (
    <>
    <MDBCard
      className="text-center mb-5 pb-5"
      style={{ zIndex: 1 }}
    >
      <div className="button-container pb-2">
        <div className="button-group m-2 ">
        {companyList &&
            companyList.map((data,index) => (
              <CButton
                key={data.iId}
                onClick={() => handleButtonClick(data.iId)}
               
                shape="rounded-pill"
                color="white"
                style={{
                  marginRight: "10px",
                  height: "40px",
                  width: "150px",
                  textTransform: "none",
                  backgroundColor: buttonColors[index % buttonColors.length],
                  color: "white",
                  // border: selectedButtonId === data.iId ? '2px solid #000' : 'none',
                  //   boxShadow: selectedButtonId === data.iId ? '0 10px 20px rgba(0, 0, 0, 0.2)' : 'none',
                  //   transform: selectedButtonId === data.iId ? 'translateY(-5px)' : 'none',
                  //   transition: 'all 0.3s ease',
                }}
                hoverStyle={{
                 // backgroundColor: `${barData?.hoverColor || "white"}`, // Define a hover color or use a default color
                }}
              >
                {data.sName}
              </CButton>
            ))}

        </div>
      </div> 
      {selectedCompany && (
          // <Typography
          //   variant="h5"
          //   component="div"
          //   style={{
          //     margin: "10px 0",
          //     fontWeight: "bold",
          //     color: "#333",
          //   }}
          // >
          //   {`${selectedCompany.sName}`}
          // </Typography>
          <h5
          className="p-3 text-normal"
          style={{ fontWeight: "bold", textTransform: "uppercase" }}
        >
          {`${selectedCompany.sName}`}
        </h5>
        )}  
    <CRow className="m-1">
      {employeData &&
        employeData.map((employee, index) => (
          <CCol xs key={index} className="p-1">
            <CCard style={{ boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", height: "320px"  }}>
              <div className="text-center">
                <CImage
                  rounded
                  src={employee.EmployeePhoto}
                  width={150}
                  height={150}
                  className="rounded-circle"
                />
              </div>
              <CCardBody className="text-center">
                <CCardText className="text-md p-0 mb-1">{` ${employee.Category}`}</CCardText>
                {employee.sMonth ?
                <CCardText className="text-md p-0 mb-1">{` ${employee.sMonth}-${employee.sYear}`}</CCardText>
                :<CCardText className="text-md p-0 mb-1">{` Best Performer of the Year-${employee.sYear}`}</CCardText>}
                {/* <CCardText className="text-lg p-0 mb-1">{` ${employee.CompanyName}`}</CCardText> */}
                <CCardText className="text-sm">{`${employee.Employee} (${employee.EmployeeCode})`}</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
    </CRow>
    <Loader open={open} handleClose={handleClose} />
    
      </MDBCard>
    </>
  );
}
