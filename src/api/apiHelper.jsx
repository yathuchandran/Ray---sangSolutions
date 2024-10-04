import axios from "axios"
import { baseUrl, baseUrlWEB } from "../config";


export const getSupervisor_attendance = async ({apiKey, searchkey}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}${apiKey}&sSearch=${searchkey}`);
      return response?.data;
    } catch (error) {
      console.log('getSupervisor_attendance',error);
    }
  };
  export const AttendanceSummary = async ({displayLength,displayStart,FromDate,ToDate,iEmployee,iProject,searchKey}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}AttendanceSummary?DisplayLength=${displayLength}&DisplayStart=${displayStart}&FromDate=${FromDate}&ToDate=${ToDate}&iEmployee=${iEmployee}&iProject=${iProject}&Search=${searchKey}`);
      return response?.data;
    } catch (error) {
      console.log('AttendanceSummary_Web',error);
    }
  };
  export const AttendanceSummary_Web = async ({displayLength,displayStart,FromDate,ToDate,iEmployee,iProject,searchKey}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}AttendanceSummary_Web?DisplayLength=${displayLength}&DisplayStart=${displayStart}&FromDate=${FromDate}&ToDate=${ToDate}&iEmployee=${iEmployee}&iProject=${iProject}&Search=${searchKey}`);
      return response?.data;
    } catch (error) {
      console.log('AttendanceSummary_Web',error);
    }
  };

  export const PostAttendance = async (updatedFormData) => {
    try {
      const response = await axios.post(`${baseUrlWEB}PostAttendance`,updatedFormData);
      return response?.data;
    } catch (error) {
      console.log('Attendance Post',error);
    }
  };

  export const DeleteAttendance = async (payload) => {
    try {
      
      const response = await axios.get(`${baseUrlWEB}DeleteAttendance`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('Attendance Post',error);
    }
  };

  export const UpdateAttendanceProject = async (updatedFormData) => {
    try {
      const response = await axios.post(`${baseUrlWEB}UpdateAttendanceProject`,updatedFormData);
      return response?.data;
    } catch (error) {
      console.log('Attendance Post',error);
    }
  };
  //Old_ Daily Attendance Project Wise  - new_ Daily Project Wise
  export const DailyProjectReport = async ({FromDate,ToDate,iEmployee,iProject,searchKey}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DailyProjectReport?FromDate=${FromDate}&ToDate=${ToDate}&iEmployee=${iEmployee}&iProject=${iProject}&Search=${searchKey}`);
      return response?.data;
    } catch (error) {
      console.log('DailyProjectReport',error);
    }
  };
  //Variance Report 
  export const VarienceReport = async ({FromDate,ToDate,iEmployee,iProject,searchKey}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}VarienceReport?FromDate=${FromDate}&ToDate=${ToDate}&iEmployee=${iEmployee}&iProject=${iProject}&Search=${searchKey}`);
      return response?.data;
    } catch (error) {
      console.log('VarienceReport',error);
    }
  };
  //Daily Absentees
  export const DailyAbsenceReport = async ({FromDate,ToDate,iEmployee,iType,searchKey}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DailyAbsenceReport?FromDate=${FromDate}&ToDate=${ToDate}&iEmployee=${iEmployee}&iType=${iType}&Search=${searchKey}`);
      return response?.data;
    } catch (error) {
      console.log('DailyAbsenceReport',error);
    }
  };
  //Monthly summary project wise
  export const MonthlySummaryProjectReport = async ({displayLength,displayStart,Month,year,iEmployee,iProject,searchKey}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}MonthlySummaryProjectReport?DisplayLength=${displayLength}&DisplayStart=${displayStart}&Month=${Month}&year=${year}&iEmployee=${iEmployee}&iProject=${iProject}&Search=${searchKey}`);
      return response?.data;
    } catch (error) {
      console.log('MonthlySummaryProjectReport',error);
    }
  };
  export const GetLayout = async ({FromDate,ToDate,iEmployee,iType,searchKey}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetLayout?FromDate=${FromDate}&ToDate=${ToDate}&iEmployee=${iEmployee}&iType=${iType}&Search=${searchKey}`);
      return response?.data;
    } catch (error) {
      console.log('GetLayout',error);
    }
  };
  export const GenerateExcelReport = async ({ Month, year, iEmployee,iProject,iType}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GenerateExcelReport?year=${year}&month=${Month}&iEmployee=${iEmployee}&iProject=${iProject}&iType=${iType}`);
      return response?.data;
    } catch (error) {
      console.log('GenerateExcelReport',error);
    }
  };
  //BestEmployeeSummary
  export const BestEmployeeSummary = async ({displayLength,displayStart,Month,year,iEmployee,M_Y_Type,Category,searchKey,iCompany}) => {
      try {
        const response = await axios.get(`${baseUrlWEB}BestEmployeeSummary_React?iMonth=${Month}&iYear=${year}&iEmployee=${iEmployee}&iCompany=${iCompany}&iM_Y_Type=${M_Y_Type}&iCategory=${Category}&DisplayLength=${displayLength}&DisplayStart=${displayStart}&Search=${searchKey}`);
        return response?.data;
      } catch (error) {
        console.log('BestEmployeeSummary',error);
      }
  };
  //BestEmployeeSummary GetCompany
  export const BestEmployeeGetCompany = async () => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetCompany`);
      return response?.data;
    } catch (error) {
      console.log('BestEmployeeGetCompany',error);
    }
};
    //DeleteBestEmployee
    export const DeleteBestEmployee = async ({iIds,iUser}) => {
      try {
        const response = await axios.get(`${baseUrlWEB}DeleteBestEmployee?iId=${iIds}&iUser=${iUser}`);
        return response?.data;
      } catch (error) {
        console.log('DeleteBestEmployee',error);
      }
  };
   //PostBestEmployee_React
   export const PostBestEmployee = async (formData) => {
    try {
      const response = await axios.post(`${baseUrlWEB}PostBestEmployee_React`,formData);
      return response?.data;
    } catch (error) {
      console.log('PostBestEmployee_React',error);
    }
};

 //ChatBox_GetUser or Receivers
 export const ChatBox_GetUser = async (search) => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetUser?sSearch=${search}`);
    return response?.data;
  } catch (error) {
    console.log('ChatBox_GetUser',error);
  }
};
 //PostChat
 export const PostChat = async (formData) => {
  try {
    const response = await axios.post(`${baseUrlWEB}PostChat`,formData);
    return response?.data;
  } catch (error) {
    console.log('PostChat',error);
  }
};

//FileUploadChatBox
export const FileUploadChatBox = async (formData) => {
  try {
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
  };
    const response = await axios.post(`${baseUrl}FileUpload`,formData,config);
    return response?.data;
  } catch (error) {
    console.log('FileUploadChatBox',error);
  }
};

//ChatSummary
export const ChatSummary = async ( {displayLength,
  displayStart,
  searchKey}) => {
  try {
    const response = await axios.get(`${baseUrlWEB}ChatSummary?DisplayLength=${displayLength}&DisplayStart=${displayStart}&Search=${searchKey}`);
    return response?.data;
  } catch (error) {
    console.log('ChatSummary',error);
  }
};

 //DeleteChat
 export const DeleteChat = async ({iIds,iUser}) => {
  try {
    const response = await axios.get(`${baseUrlWEB}DeleteChat?iId=${iIds}&iUser=${iUser}`);
    return response?.data;
  } catch (error) {
    console.log('DeleteChat',error);
  }
};

 //ChatDetails
 export const ChatDetails = async ({iId}) => {
  try {
    const response = await axios.get(`${baseUrlWEB}ChatDetailsReact?iId=${iId}`);
    return response?.data;
  } catch (error) {
    console.log('ChatDetails',error);
  }
};