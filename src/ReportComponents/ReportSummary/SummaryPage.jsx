import React from 'react'
import { useLocation } from 'react-router-dom';
import IncidentReport from './IncidentReport';
import HSEreport2 from './HSEreport2';
import StopCardReport from './StopCardReport';
import LiftingGear from './LiftingGear';
import QHSE from './QHSE';
import PPE from './PPE';
import MCC from './MCC';
import TBT from './TBT';
import Footer from '../../components/Footer/Footer';


function SummaryPage() {
  const location = useLocation();
  const details = location.state;
  return (
    <div>
      <>
        {details && (
          details.iScreenId === 20 ? <IncidentReport /> :
            details.iScreenId === 21 ? <StopCardReport /> :
              details.iScreenId === 18 ? <HSEreport2  /> :
              details.iScreenId === 43 ? <LiftingGear /> :
              details.iScreenId === 44 ? <QHSE /> :
              details.iScreenId === 45 ? <PPE /> :
              details.iScreenId === 46 ? <MCC /> :
              details.iScreenId === 53 ? <TBT /> :
                null
        )}
              <Footer/>

      </>
    </div >
  )
}
export default SummaryPage
