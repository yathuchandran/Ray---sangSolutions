import axios from "axios"
import { baseUrlWEB } from "../config";

  export const getDeviceSummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DeviceSummary`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeviceSummary',error);
    }
  };

  export const getApproveDevice = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}ApproveDevice`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('ApproveDevice',error);
    }
  };

  export const getDeviceDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DeviceDetails`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeviceDetails',error);
    }
  };


  export const postDevice = async (payload) => {
    try {
      const response = await axios.post(`${baseUrlWEB}PostDevice`, payload);
      return response?.data;
    } catch (error) {
      console.log('PostDevice',error);
    }
  };