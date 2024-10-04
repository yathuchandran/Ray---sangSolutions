import axios from "axios"
import { baseUrl, baseUrlWEB } from "../config";

export const getLogin = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}ReactUserLogin`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('ReactUserLogin',error);
    }
  };

  export const getRoleDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetReactRoleDetails`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetReactRoleDetails',error);
    }
  };

  export const getSummary = async (payload,apiName) => {
    try {
      const response = await axios.get(`${baseUrl}Get${apiName}Summary`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetHSESummary',error);
    }
  };

  export const deleteSummary = async (payload,apiName) => {
    try {
      const response = await axios.get(`${baseUrl}Delete${apiName}`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeleteHSE',error);
    }
  };
  
  export const getDetails = async (payload,apiName) => {
    try {
      const response = await axios.get(`${baseUrl}Get${apiName}Details`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetHSEDetails',error);
    }
  };

  export const getProject = async () => {
    try {
      const response = await axios.get(`${baseUrl}GetProject`);
      return response?.data;
    } catch (error) {
      console.log('GetProject',error);
    }
  };

  export const getProjectDescription = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetProjectDescription`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetProjectDescription',error);
    }
  };

  export const getEmployee = async (payload,apiName) => {
    try {
      const response = await axios.get(`${baseUrl}GetEmployee`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetEmployee',error);
    }
  };

  export const PostHSE = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostHSE`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostHSE',error);
    }
  };

  export const getPrev_NextDocNo = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetPrev_NextDocNo`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetPrev_NextDocNo',error);
    }
  };

  export const postIncident = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostIncident`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostIncident',error);
    }
  };

  export const postStopCard = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostStopCard`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostStopCard',error);
    }
  };

  export const projectDetails= async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}ProjectDetails`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('ProjectDetails',error);
    }
  };

  export const getCloseHSEStatus= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetCloseHSEStatus`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetCloseHSEStatus',error);
    }
  };

  export const postLGIC= async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostLGIC`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostLGIC',error);
    }
  };

  export const getFormData= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetFormData`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetFormData',error);
    }
  };

  export const postQHSE= async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostQHSE`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostQHSE',error);
    }
  };

  
  export const postPPE= async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostPPE`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostPPE',error);
    }
  };

  export const postMCC= async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostMCC`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostMCC',error);
    }
  };

  export const getEmpDesignation= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetEmpDesignation`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetEmpDesignation',error);
    }
  };

  export const getCompany= async () => {
    try {
      const response = await axios.get(`${baseUrl}GetCompany`);
      return response?.data;
    } catch (error) {
      console.log('GetCompany',error);
    }
  };

  export const postTBT= async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostTBT`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostTBT',error);
    }
  };

  export const postCloseHSE = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostCloseHSE`, payload);
      return response?.data;
    } catch (error) {
      console.log('PostCloseHSE',error);
    }
  };

  export const fileUpload= async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}FileUpload`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('FileUpload',error);
    }
  };

  export const crystalPrint = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}CrystalPrint`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('CrystalPrint',error);
    }
  };

  export const getAttendanceProject = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}AttendanceProject`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('AttendanceProject',error);
    }
  };


  