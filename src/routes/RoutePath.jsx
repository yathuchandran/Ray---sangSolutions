import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login/LoginPage";
import Home from "../components/Home/Home";
import SummaryPage from "../components/SummaryPage/SummaryPage";
import ReportSummaryPage from "../ReportComponents/ReportSummary/SummaryPage";
import Attendance from "../Attendance/Attendance";
import AttendanceReport from "../Attendance/AttendanceReport";
import Summury from "../settings/Summury";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "../components/PublicRoute/PublicRoute";
import ProjectSummary from "../components/MasterProject/Project";
import EmployeeSummary from "../components/MasterProject/Employee";
import PayGroupSummary from "../components/MasterProject/PayGroup/PayGroupSummary";
import PublicHolidaySummary from "../components/MasterProject/PublicHoliday/PublicHolidaySummary";
import FormDesSummary from "../components/MasterProject/FormDes/FormDesSummary";
import SpecialOffTime from "../components/MasterProject/DailyBreak/SpecialOffTime";
import DeviceManagerSummary from "../components/DeviceManager/DeviceManagerSummary";
import AttendanceManagerProject from "../components/AttendanceManager/AttendanceManagerProject";

export default function RoutesPath() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/summary" element={<ProtectedRoute><SummaryPage /></ProtectedRoute>} />
      <Route path="/projectSummary" element={<ProtectedRoute><ProjectSummary /></ProtectedRoute>} />
      <Route path="/employeeSummary" element={<ProtectedRoute><EmployeeSummary /></ProtectedRoute>} />
      <Route path="/payGroupSummary" element={<ProtectedRoute><PayGroupSummary /></ProtectedRoute>} />
      <Route path="/publicHolidaySummary" element={<ProtectedRoute><PublicHolidaySummary /></ProtectedRoute>} />
      <Route path="/formDesSummary" element={<ProtectedRoute><FormDesSummary /></ProtectedRoute>} />
      <Route path="/dailyBreakPoint" element={<ProtectedRoute><SpecialOffTime /></ProtectedRoute>} />
      <Route path="/DeviceManager" element={<ProtectedRoute><DeviceManagerSummary /></ProtectedRoute>} />
      
      {/* ------------------REPORTS----------------------------------- */}

      <Route path="/Reportsummary" element={<ProtectedRoute><ReportSummaryPage /></ProtectedRoute>} />

      {/* ------------------ATTENDANCE----------------------------------- */}

      <Route path="/Attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/AttendanceReport" element={<ProtectedRoute><AttendanceReport /></ProtectedRoute>} />
      <Route path="/AttendanceManagerProject" element={<ProtectedRoute><AttendanceManagerProject /></ProtectedRoute>} />

      {/* ------------------SETTINGS----------------------------------- */}

      <Route path="/Settings" element={<ProtectedRoute><Summury /></ProtectedRoute>} />
    </Routes>
  );
}
