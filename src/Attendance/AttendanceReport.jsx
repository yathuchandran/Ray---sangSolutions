import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import DailyProjectWiseReport from './components/DailyProjectWise/DailyProjectWise';
import VarianceReport from './components/Variance/VarianceReport';
import DailyAbsenteesReport from './components/DailyAbsentees/DailyAbsenteesReport';
import MonthlySummaryProjectWise from './components/MonthlySummary/MonthlySummaryProjectWise';
import MonthlyMasterProjectWise from './components/MonthlyMaster/MonthlyMasterProjectWise';
import MontlyAttendanceProjectWise from './components/MonthlyProjectWise/MontlyAttendanceProjectWise';
import Footer from '../components/Footer/Footer';



function AttendanceReport() {

  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = location.state?.attendanceReport;
// attendancereport
  useEffect(() => {
    if (!pageTitle) {
      navigate("/home");
    }
  }, [pageTitle, navigate]);

  return (
    
   
<>
      {pageTitle && (
        pageTitle.iScreenId === 16 ? <DailyProjectWiseReport /> :
        pageTitle.iScreenId === 17 ? <VarianceReport /> :
        pageTitle.iScreenId === 42 ? <DailyAbsenteesReport /> :  
        pageTitle.iScreenId === 38 ? <MonthlySummaryProjectWise /> : 
        pageTitle.iScreenId === 40 ? <MonthlyMasterProjectWise /> : 
        pageTitle.iScreenId === 23 ? <MontlyAttendanceProjectWise/> : 

              null
      )}
     <Footer/>
      </>

   
  )
}

export default AttendanceReport