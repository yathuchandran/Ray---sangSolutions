import axios from "axios"
import { baseUrlWEB } from "../config";



export const GetUserSummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetUserSummary`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetUserSummary ERROR',error);
    }
  };
  
 
  export const DeleteUsers = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}DeleteUser`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeleteUser ERROR',error);
    }
  };

  export const PostUsers = async (payload) => {
    try {

      const response = await axios.post(`${baseUrlWEB}PostUser`,payload);
      return response?.data;
    } catch (error) {
      console.log('PostUser ERROR',error);
    }
  };

  export const GetRoles_GetAllEmployee = async ({apiKey, searchkey}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}${apiKey}?sSearch=${searchkey}`);
      return response?.data;
    } catch (error) {
      console.log('GetRoles_GetAllEmployee',error);
    }
  };


  export const GetAllEmployee = async ({apiKey, searchkey}) => {
    try {
      const response = await axios.get(`${baseUrlWEB}${apiKey}?sSearch=${searchkey}`);
      return response?.data;
    } catch (error) {
      console.log('GetAllEmployee ERROR',error);
    }
  };

  export const GetCompany = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetCompany`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetCompany ERROR',error);
    }
  };

  export const GetUserDetail = async (payload) => {
    try {
      const response = await axios.get(`${baseUrlWEB}GetUserDetails`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetUserDetails ERROR',error);
    }
  };



  //ROLE--API---------------------------------------------------------------------


export const GetRoleSummarys = async (payload) => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetRoleSummary`,{
      params: payload,
    });
    return response?.data;
  } catch (error) {
    console.log('GetRoleSummary ERROR',error);
  }
};

 
export const GetScreens = async (payload) => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetScreen`,{
      params: payload,
    });
    return response?.data;
  } catch (error) {
    console.log('GetScreen ERROR',error);
  }
};

export const DeleteRoles = async (payload) => {
  try {
    const response = await axios.get(`${baseUrlWEB}DeleteRole`,{
      params: payload,
    });
    return response?.data;
  } catch (error) {
    console.log('DeleteRole ERROR',error);
  }
};


export const PostRoles = async (payload) => {
  try {
    const response = await axios.post(`${baseUrlWEB}PostRole`,payload);
    return response?.data;
  } catch (error) {
    console.log('PostRole ERROR',error);
  }
};
  

export const GetEditRoleDetail = async (payload) => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetEditRoleDetails`,{
      params: payload,
    });
    return response?.data;
  } catch (error) {
    console.log('GetEditRoleDetails ERROR',error);
  }
};

export const getRoleDetails_React = async (payload) => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetRoleDetails_React`,{
      params: payload,
    });
    return response?.data;
  } catch (error) {
    console.log('GetRoleDetails_React',error);
  }
};

export const getScreen_React = async (payload) => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetScreen_React`,{
      params: payload,
    });
    return response?.data;
  } catch (error) {
    console.log('GetScreen_React',error);
  }
};

export const getActions_React = async (payload) => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetActions_React`,{
      params: payload,
    });
    return response?.data;
  } catch (error) {
    console.log('GetActions_React',error);
  }
};

export const getNextPrevRole = async (payload) => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetNextPrevRole`,{
      params: payload,
    });
    return response?.data;
  } catch (error) {
    console.log('GetNextPrevRole',error);
  }
};

export const postRole_React = async (payload) => {
  try {

    const response = await axios.post(`${baseUrlWEB}PostRole_React`,payload);
    return response?.data;
  } catch (error) {
    console.log('PostRole_React',error);
  }
};

export const getActionBasedOnuser = async (payload) => {
  try {
    const response = await axios.get(`${baseUrlWEB}GetActionBasedOnuser`,{
      params: payload,
    });
    return response?.data;
  } catch (error) {
    console.log('GetActionBasedOnuser',error);
  }
};

