import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import User from './User';
import Role from './Role';
import Footer from '../components/Footer/Footer';
import BestEmployee from './bestEmployee/BestEmployee';
import ChatBox from './chatBox/ChatBox';
// import NewCompany from './NewCompany';


function Summury() {
    const location = useLocation();
    const details = location.state;

    const navigate = useNavigate()

    React.useEffect(() => {
      if (!details) {
        navigate("/home");
      }
    }, [details]);

  return (
    <div>
        {details && (
        details.iScreenId === 9 ? <User /> :
          
            details.iScreenId === 10 ? <Role /> :
            details.iScreenId === 51 ? <BestEmployee /> :
            details.iScreenId === 52 ? <ChatBox /> :
              null
      )}
                    <Footer/>

      </div>
  )
}

export default Summury