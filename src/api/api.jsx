import axios from "axios"
import { baseUrlWEB } from "../config";

  export const HSEReactReport = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}HSEReactReport`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('HSEReactReport ERROR',error);
    }
  };

  export const GetProject = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetProject`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetProject ERROR',error);
    }
  };

  export const GetEmployee = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetEmployee`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetEmployee ERROR',error);
    }
  };
 
  export const GetSupervisor = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetSupervisor`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetSupervisor ERROR',error);
    }
  };

  export const GetcloseStatus = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetcloseStatus`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetcloseStatus ERROR',error);
    }
  };

  export const CrystalPrint = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}CrystalPrint`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('CrystalPrint ERROR',error);
    }
  };

  export const IncidentReactReport = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}IncidentReactReport`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('IncidentReactReport ERROR',error);
    }
  };


  export const StopcardReactReport = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}StopcardReactReport`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('StopcardReactReport ERROR',error);
    }
  };

  export const LGICReport = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}LGICReactReport`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('LGICReactReport ERROR',error);
    }
  };

  export const GetAllEmployee = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetAllEmployee`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetAllEmployee ERROR',error);
    }
  };


  export const QHSEReactReport = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}QHSEReactReport`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('QHSEReactReport ERROR',error);
    }
  };

  export const PPEReactReport = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}PPEReactReport`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('PPEReactReport ERROR',error);
    }
  };

  export const MCCReactReport = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}MCCReactReport`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('MCCReactReport ERROR',error);
    }
  };


  export const TBTReactReport = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}TBTReactReport`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('TBTReactReport ERROR',error);
    }
  };


  export const GetUser = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetUser`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetUser ERROR',error);
    }
  };



  