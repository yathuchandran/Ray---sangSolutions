import axios from "axios";
import { baseUrlWEB } from "../config";



export const getProjectSummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}ProjectSummary`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetProjectSummary',error);
    }
  };

  export const getEmployeeSummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}EmployeeSummary`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetEmployeeSummary',error);
    }
  };

  export const getProjectDelete = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DeleteProject`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetProjectSummary',error);
      return error?.response?.data
    }
  };

  export const deletePayGroup = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DeletePayGroup`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeletePayGroup',error);
      return error?.response?.data
    }
  };

  export const deleteP_Holiday = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DeleteP_Holiday`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeleteP_Holiday',error);
      return error?.response?.data
    }
  };

  export const deleteFormData = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DeleteFormData`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeleteFormData',error);
      return error?.response?.data
    }
  };

  export const getProjectDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}ProjectDetails`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetProjectDetails',error);
    }
  };

  export const getEmployeeDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}EmployeeDetails`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetEmployeeDetails',error);
    }
  };

  export const payGroupDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}PayGroupDetails`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('PayGroupDetails',error);
    }
  };

  export const publicHolidayDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}P_HolidayDetails`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('P_HolidayDetails',error);
    }
  };

  export const formDataDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}FormDataDetails`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('FormDataDetails',error);
    }
  };

  export const getPayGroup = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetPayGroup`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetPayGroup',error);
    }
  };

  export const getSupervisor = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetSupervisor`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetSupervisor',error);
    }
  };

  export const getCompany = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetCompany`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetCompany',error);
    }
  };

  export const payGroupSummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}PayGroupSummary`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('PayGroupSummary',error);
    }
  };

  export const publicHolidaySummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}P_HolidaySummary`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('P_HolidaySummary',error);
    }
  };

  export const formDataSummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}FormDataSummary`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('FormDataSummary',error);
    }
  };

  export const postProject = async (payload) => {
    try {
      const response = await axios.post(`${baseUrlWEB}PostProject`, payload);
      return response?.data;
    } catch (error) {
      console.log('PostProject',error);
    }
  };

  export const postUpdateEmployee = async (payload) => {
    try {
      const response = await axios.post(`${baseUrlWEB}UpdateEmployee`, payload);
      return response?.data;
    } catch (error) {
      console.log('UpdateEmployee',error);
    }
  };

  export const postPayGroup = async (payload) => {
    try {
      const response = await axios.post(`${baseUrlWEB}PostPayGroup`, payload);
      return response?.data;
    } catch (error) {
      console.log('PostPayGroup',error);
    }
  };

  export const postP_Holiday = async (payload) => {
    try {
      const response = await axios.post(`${baseUrlWEB}PostP_Holiday`, payload);
      return response?.data;
    } catch (error) {
      console.log('PostP_Holiday',error);
    }
  };

  export const postFormData = async (payload) => {
    try {
      const response = await axios.post(`${baseUrlWEB}PostFormData`, payload);
      return response?.data;
    } catch (error) {
      console.log('PostFormData',error);
    }
  };

  export const refreshEmployee = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}RefreshEmployee`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('RefreshEmployee',error);
    }
  };

  export const getForms = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetForms`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetForms',error);
    }
  };

  export const getFormsType = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetFormsType`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetFormsType',error);
    }
  };

  export const DailyBreaksummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DailyBreaksummary`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DailyBreaksummary',error);
    }
  };

  export const GetDailyBreakTypes = async () => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetDailyBreakTypes`);
      return response?.data;
    } catch (error) {
      console.log('GetDailyBreakTypes',error);
    }
  };

  export const GetPayGroupList = async () => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetPayGroupList`);
      return response?.data;
    } catch (error) {
      console.log('GetPayGroupList',error);
    }
  };

  export const PostDailyBreak = async (payload) => {
    try {
      const response = await axios.post(`${baseUrlWEB}PostDailyBreak`, payload);
      return response?.data;
    } catch (error) {
      console.log('PostDailyBreak',error);
    }
  };
  export const GetDailyBreakDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetDailyBreakDetails`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetDailyBreakDetails',error);
    }
  };
  export const DeleteDailyBreak = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DeleteDailyBreak`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeleteDailyBreak',error);
      return error?.response?.data
    }
  };