import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useNavigate } from "react-router-dom";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  Popover,
  Stack,
} from "@mui/material";
import { getRoleDetails } from "../../api/apiCall";
import { colourTheme, secondaryColorTheme } from "../../config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { imageIcon } from "../../config";
import Loader from "../Loader/Loader";

function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const iUser = localStorage.getItem("userId");
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menu, setMenu] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [menuId, setMenuId] = React.useState(0);
  const [activeSubMenuId, setActiveSubMenuId] = React.useState(null);
  const [anchorElLogout, setAnchorElLogout] = React.useState(null);
  React.useEffect(() => {
    if (!iUser) {
      navigate("/");
    }
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await getRoleDetails({ iUser });
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        setMenu(myObject);
      }
    };
    fetchData();
  }, [iUser]);

  const handleMenuList = () => {
    setAnchorEl(null);
    setAnchorElNav(null); // This line will close the menu
    setActiveSubMenuId(null);
  };

  const handleSubMenu = (event, Id) => {
    if (Id?.iScreenId === 25) {
      navigate("/home", { state: Id });
    } else if (Id.iScreenId === 102) {
      navigate("/DeviceManager", { state: Id });
    } else {
      setAnchorEl(event.currentTarget);
      setMenuId(Id?.iScreenId);
    }
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
    setActiveSubMenuId(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setActiveSubMenuId(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const screenIdsAttendance = ["16", "42", "23", "38", "40", "17"]; //menu.iType===2
  const handleClickEvent = async (menu) => {
    if (menu.iType == "1") {
      navigate("/summary", { state: menu });
    } else if (screenIdsAttendance.includes(menu.iScreenId.toString())) {
      navigate("/AttendanceReport", { state: { attendanceReport: menu } });
    } else if (menu.iType == "2") {
      navigate("/Reportsummary", { state: menu });
    } else if (menu.iType == "3") {
      if (menu.iScreenId === 69) {
        navigate("/AttendanceManagerProject", { state: menu });
      } else {
        navigate("/Attendance", { state: { attendancePage: menu } });
      }
    } else if (menu.iType == "100") {
      navigate("/Settings", { state: menu });
    } else if (menu.iType == "101") {
      if (menu.iScreenId == "3") {
        navigate("/projectSummary", { state: menu });
      } else if (menu.iScreenId == "39") {
        navigate("/employeeSummary", { state: menu });
      } else if (menu.iScreenId == "8") {
        navigate("/payGroupSummary", { state: menu });
      } else if (menu.iScreenId == "24") {
        navigate("/publicHolidaySummary", { state: menu });
      } else if (menu.iScreenId == "41") {
        navigate("/formDesSummary", { state: menu });
      } else if (menu.iScreenId == "56") {
        navigate("/dailyBreakPoint", { state: menu });
      } else {
        navigate("/Home");
      }
    } else {
      navigate("/Home");
    }

    handleMenuList();
  };

  const handleMobMenu = (id) => {
    if (id === 25) {
      navigate("/home");
    } else {
      setActiveSubMenuId(id);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  let menuItems;
  if (activeSubMenuId == null) {
    // Main menu items
    menuItems = menu
      .filter((menuList) => menuList.iType === 0)
      .map((menuList) => (
        <MenuItem
          key={menuList.iScreenId}
          onClick={() => handleMobMenu(menuList.iScreenId)}
        >
          <Typography textAlign="center">{menuList.sScreen}</Typography>
        </MenuItem>
      ));
  } else {
    // Sub-menu items
    menuItems = [
      <MenuItem key="back" onClick={() => setActiveSubMenuId(null)}>
        <ArrowBackIcon sx={{ color: colourTheme }} />
      </MenuItem>,
      ...menu
        .filter((menuList) => menuList.iType === activeSubMenuId)
        .map((menuList) => (
          <MenuItem
            key={menuList.iScreenId}
            onClick={() => handleClickEvent(menuList)}
          >
            <Typography textAlign="center">{menuList.sScreen}</Typography>
          </MenuItem>
        )),
    ];
  }

  const handleLogoutClick = (event) => {
    setAnchorElLogout(event.currentTarget);
  };

  const handleLogoutClose = () => {
    setAnchorElLogout(null);
  };

  const handleConfirmLogout = () => {
    // Perform the logout action, such as clearing localStorage and navigating to the login page
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="static"
        style={{
          position: "sticky",
          zIndex: 100, // Adjust the z-index as needed
          top: 0,
          bgcolor: `${secondaryColorTheme}`,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img alt="Logo" src={imageIcon} style={{ width: 45, height: 50 }} />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {menuItems}
              </Menu>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              {menu &&
                menu
                  .filter((menuList) => menuList.iType === 0)
                  .map((menuList, index) => (
                    <Button
                      key={menuList.iScreenId}
                      aria-controls="master-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleSubMenu(e, menuList)}
                      variant="#00498E" // Note: This is not a valid variant, you might want to use 'contained', 'outlined', or 'text'
                      sx={{
                        mr: 0,
                        bgcolor: `#1976d2`, // Use template literal here
                        color: "white",
                      }}
                    >
                      {menuList.sScreen}
                    </Button>
                  ))}

              <Menu
                id="master-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuList}
              >
                {menu &&
                  menu
                    .filter((menuList) => menuList.iType === menuId)
                    .map((menuList, index) => (
                      <MenuItem
                        key={menuList.iScreenId}
                        onClick={() => handleClickEvent(menuList)}
                      >
                        {menuList.sScreen}
                      </MenuItem>
                    ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Log out">
                <IconButton
                  onClick={handleLogoutClick}
                  sx={{
                    p: 0,
                    "&:hover": { backgroundColor: "transparent !important" },
                  }}
                >
                  <PowerSettingsNewIcon
                    sx={{ marginRight: "20px", color: "#FFF" }}
                  />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={userName}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ background: "#fff", color: "gray" }}>
                      {userName?.substring(0, 2)?.toUpperCase()}
                    </Avatar>
                  </Stack>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
          <Popover
            open={Boolean(anchorElLogout)}
            anchorEl={anchorElLogout}
            onClose={handleLogoutClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <DialogContent>
              <DialogContentText>
                Are you sure you want to log out?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleConfirmLogout}
                style={{
                  textTransform: "none",
                  backgroundColor: secondaryColorTheme,
                  color: "white",
                }}
              >
                Logout
              </Button>
              <Button
                onClick={handleLogoutClose}
                style={{
                  textTransform: "none",
                  backgroundColor: secondaryColorTheme,
                  color: "white",
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Popover>
        </Container>
      </AppBar>
      <Loader open={open} handleClose={handleClose} />
    </>
  );
}
export default Header;
