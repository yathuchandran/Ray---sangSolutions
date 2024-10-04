import axios from "axios";

import { baseUrlWEB } from "../config";

export const getBoxData = async () => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetTotal`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const GetBestEmployee = async (iId) => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetBestEmployee_React?iId=${iId}`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const GetCountGraph = async (payload) => {
  try {
    const response = await axios.get(
      `${baseUrlWEB}Getcount_Graph1?iType=${payload}`
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getModalApi = async (payload) => {
  try {
    const response = await axios.get(`${baseUrlWEB}${payload.path}`, {
      params: payload,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};
