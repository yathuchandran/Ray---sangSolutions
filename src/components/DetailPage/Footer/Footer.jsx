import { MDBFooter } from 'mdb-react-ui-kit';
import React from 'react';
import { colourTheme } from '../../../config';

export default function Footer() {
  const footerStyle = {
    padding: 0, // You can adjust the padding as needed
    marginTop: 0, // You can adjust the margin-top as needed
    backgroundColor: 'ButtonShadow', // Assuming this is a valid color
  };

  return (
    <MDBFooter bgColor='light' className='text-center text-md-left m-0 p-0'>
      <div className='text-center ' style={footerStyle}>
        &copy; {new Date().getFullYear()} Copyright: Ray
      </div>
    </MDBFooter>
  );
}
