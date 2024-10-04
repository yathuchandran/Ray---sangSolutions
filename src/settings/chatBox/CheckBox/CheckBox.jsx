import React, { useCallback, useEffect, useMemo, useState } from 'react'
import "./checkbox.css"
import SearchBox from './SearchBox';
import { Typography } from '@mui/material';
import { ChatBox_GetUser } from '../../../api/apiHelper';

function CheckBox({sFieldName,label,isMandatory,setcheckBoxData,disabled,changesTriggeredCheck,setchangesTriggeredCheck,companyListExist}) {

 

    const [formData, setformData] = useState({})
    const [companyList, setcompanyList] = useState([]);
   
    const handleSelectedIds = useCallback(
        (selectedIds, params, selectedTitles) => {
          const updatedScreens = selectedIds.map(id => ({ iUser: parseInt(id, 10) })); // Transform string IDs to integers and wrap in object

          setformData((prevFormData) => ({
            ...prevFormData,
            ChatDetails: updatedScreens, // Update the PeriodType array with new values
          }));
        },
        []
      );
     
      useEffect(() => {
        setcheckBoxData(formData)
      }, [formData])
      
      const resetChangesTrigger = () => {
        
        setchangesTriggeredCheck(false)
      };
      const UserSearch = useMemo(
        () => (
          <SearchBox
            initialItems={companyList}
            search={true}
            handleSelectedIds={handleSelectedIds}
            params={sFieldName}
            changeTriggered={changesTriggeredCheck}
            setchangesTriggered={resetChangesTrigger}
            initialCheckedIds={companyListExist}
            disabled={disabled}
          />
        ),
        [companyList, handleSelectedIds, changesTriggeredCheck, companyListExist]
      );

      useEffect(() => {
        const fetchData = async () => {
          try {
           
            const response = await ChatBox_GetUser("")
            
            const resultData = JSON.parse(response.ResultData)
            if(resultData.length>0){
            
              
                const formattedData = resultData.map((item) => ({
                  title: item.sName,
                  iId: item.iId,
                }));
                setcompanyList(formattedData);
              
           
           
           
           
            return;
          }else{
            setcompanyList([])
            setloading(false)
            return
    
          }   
            
          } catch (error) {
            console.log(error);
            setcompanyList([])
          }
        };
        fetchData();
      }, []);
  return (
    <div>
        {companyList.length > 0 && (
                <div className="checkboxmainD1">
                  <div className="checkboxmainD1C">
                    <Typography id="checkboxmainD1CI1">{label}</Typography>
                    <div className="CCNPCompanySearchBoxM">
                      <div
                         style={
                          isMandatory
                            ? { borderLeft: "3px solid red" }
                            : null
                        }
                        className="CCNPCompanySearchBoxMS"
                      >
                        {UserSearch}
                      </div>
                    </div>
                  </div>
                </div>
              )}
    </div>
  )
}

export default CheckBox