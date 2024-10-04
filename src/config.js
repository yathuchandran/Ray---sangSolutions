


export let baseUrl = null
export let colourTheme = "#1b77e9"
export let secondaryColorTheme = "#1b77e9"
export let buttonColors = "#ffff"
export let inputButtonColor = "#0133c1"
export let imageIcon = null



//WEB URL
export let baseUrlWEB = null
let config
export const loadConfig = async () => {
  const response = await fetch('/config.json');
  config = await response.json();
  console.log(baseUrlWEB,config,"===================================================================================");

  baseUrl = config.baseUrl;
  baseUrlWEB = config.baseUrlWEB
  imageIcon = config.loginLogo;
}


export const barTable = [
  { Id: 9, chartName: "HSE Form Data", chartType: "PIE", colorBg: "#189fb5", iScreenId: 59 },
  { Id: 10, chartName: "Incident", chartType: "PIE", colorBg: "#27a844", iScreenId: 60 },
  {
    Id: 2,
    chartName: "StopCard",
    chartType: "BAR",
    iType: 1,
    M_countName: "M_Stopcardcount",
    Y_countName: "Y_Stopcardcount",
    A_countName: "A_Stopcardcount",
    pathName: "StopCardDashboardPopup",
    colorBg: "#fec007", iScreenId: 61
  },
  {
    Id: 3,
    chartName: "NearMiss",
    chartType: "BAR",
    iType: 2,
    M_countName: "M_Stopcardcount",
    Y_countName: "Y_Stopcardcount",
    A_countName: "A_Stopcardcount",
    pathName: "StopCardDashboardPopup",
    colorBg: "#dc3546", iScreenId: 62
  },
  {
    Id: 4,
    chartName: "Incident",
    chartType: "BAR",
    M_countName: "M_Incidentcount",
    Y_countName: "Y_Incidentcount",
    A_countName: "A_Incidentcount",
    pathName: "IncidentDashboardPopup",
    colorBg: "#1385ff", iScreenId: 63
  },
  {
    Id: 5,
    chartName: "LGIC",
    chartType: "BAR",
    M_countName: "M_LGICcount",
    Y_countName: "Y_LGICcount",
    A_countName: "A_LGICcount",
    pathName: "LGICDashboardPopup",
    colorBg: "#3b71ca", iScreenId: 64
  },
  {
    Id: 6,
    chartName: "QHSE",
    chartType: "BAR",
    M_countName: "M_QHSEcount",
    Y_countName: "Y_QHSEcount",
    A_countName: "A_QHSEcount",
    pathName: "QHSEDashboardPopup",
    colorBg: "#e17aa0", iScreenId: 65
  },
  {
    Id: 7,
    chartName: "PPE",
    chartType: "BAR",
    M_countName: "M_PPEcount",
    Y_countName: "Y_PPEcount",
    A_countName: "A_PPEcount",
    pathName: "PPEDashboardPopup",
    colorBg: "#ff6347", iScreenId: 66
  },
  {
    Id: 8,
    chartName: "MCC",
    chartType: "BAR",
    M_countName: "M_MCCcount",
    Y_countName: "Y_MCCcount",
    A_countName: "A_MCCcount",
    pathName: "MCCDashboardPopup",
    colorBg: "#9932cc", iScreenId: 67
  },
  {
    Id: 11,
    chartName: "TBT",
    chartType: "BAR",
    M_countName: "M_TBTcount",
    Y_countName: "Y_TBTcount",
    A_countName: "A_TBTcount",
    pathName: "TBTPopup",
    colorBg: "#d93d76", iScreenId: 68
  },
];


