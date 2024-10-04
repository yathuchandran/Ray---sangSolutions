import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";;
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { imageIcon } from "../../config";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { getLogin } from "../../api/apiCall";
import { colourTheme } from "../../config";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
const idleTime = 10 * 60 * 1000;


const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [sLoginName, setLoginName] = React.useState();
  const [sPassword, setSPassword] = React.useState();
  const [email, setEmail] = React.useState(false);
  const [password, setPassword] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState();
  const [loader, setLoader] = useState(false)
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if email is not present or is falsy
    if (!sLoginName) {
      setEmail(true);
    } else {
      setEmail(false);
    }

    // Check if password is not present or is falsy
    if (!sPassword) {
      setPassword(true);
    } else {
      setPassword(false);
    }

    // If both email and password are present, proceed with the login call
    if (sPassword && sLoginName) {
      handleLoaderOpen();
     const response =  await getLogin({
        sLoginName,
        sPassword,
      });
      if (response?.Status === "Success") {
         const myObject = JSON.parse(response?.ResultData)
         if(myObject[0]?.iId !== -1){
        localStorage.setItem("userId", myObject[0]?.iId);
        localStorage.setItem("userName", myObject[0]?.sUserName);
        const currentTime = new Date().getTime();
        const expirationTime = currentTime + idleTime;
        localStorage.setItem("timeStamp", expirationTime);
        navigate("/home");
         }else{
            setMessage(`${myObject[0]?.UserExists}`);
            handleClick();
         }
      } else {
        setMessage(`Incorrect UserName or PassWord`);
        handleClick();
      }
      handleLoaderClose();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleLoaderClose = () => {
    setLoader(false);
  };
  const handleLoaderOpen = () => {
    setLoader(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        sx={{ backgroundColor: colourTheme }}
        container
        component="main"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          borderRadius={2}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={imageIcon} style={{ width: "80px" }} />

            <Typography component="h1" variant="h5">
              LOGIN
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 ,width:"100%"}}
            >
              <TextField
                error={email}
                onChange={(e) => setLoginName(e.target.value)}
                margin="normal"
                required
                fullWidth
                id="email"
                label="UserName"
                autoComplete="off"
                helperText=""
                autoFocus
              />
              <div style={{ position: 'relative' }}>
              <TextField
                error={password}
                onChange={(e) => setSPassword(e.target.value)}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'} // Toggle type based on showPassword state
                id="password"
                autoComplete="current-password"
                onKeyDown={handleKeyPress}
              />
               <div
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          right: '10px',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                        }}
                      >
                        {showPassword ? <LockOpenIcon /> : <LockIcon />}
                      </div>
                      </div>
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                LOGIN
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Loader open={loader} handleClose={handleLoaderClose} />
      <ErrorMessage open={open} handleClose={handleClose} message={message} />
    </ThemeProvider>
  );
}
