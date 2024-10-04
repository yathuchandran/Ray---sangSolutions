import React from 'react'
import './footer.css'
import { secondaryColorTheme } from '../../config'

function Footer() {
  return (
    <div className="FooterMain">
    <h5 className="FMText">
      Copyright © Designed & Developed by{" "}
      <span style={{ color: secondaryColorTheme }}>Sang Solutions </span> 2024
    </h5>
  </div>
  )
}

export default Footer