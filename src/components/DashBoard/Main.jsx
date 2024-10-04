import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getActionBasedOnuser } from "../../api/settingsApi";
import DashboardBox from "./DashboardBox";
import ProfileBox from "./ProfileBox";
import Label from "./Label";
import Footer from "../Footer/Footer";

export default function Main() {
  const iUser = localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : "";
  const location = useLocation();
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const fetchData2 = async () => {
      const response = await getActionBasedOnuser({
        iScreenId: 25,
        uId: iUser,
      });
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setActions(myObject);
      }
    };
    fetchData2();
  }, [iUser]);

  const hasDetails = actions.some(action => action.iScreenId === 57);
  const hasBestEmployee = actions.some(action => action.iScreenId === 58);

  return (
    <>
      {hasDetails && <DashboardBox />}
      {hasBestEmployee && <ProfileBox />}
      <Label actions={actions} />
      <Footer />
    </>
  );
}
