import { Backdrop } from '@mui/material'
import React from 'react'
import { Hourglass } from 'react-loader-spinner'
import { colourTheme, secondaryColorTheme } from '../../config'

export default function Loader({open,handleClose}) {
  return (
      <Backdrop
      sx={{
        color: "#fff",
        zIndex: 1500, // Set a higher value for maximum z-index
      }}
      open={open}
      onClick={handleClose}
    >
    <Hourglass
        visible={true}
        height="80"
        width="80"
        ariaLabel="hourglass-loading"
        wrapperStyle={{zIndex: 1500}}
        wrapperClass=""
        colors={[`${colourTheme}`, `${secondaryColorTheme}`]}
    />
  </Backdrop>
  )
}