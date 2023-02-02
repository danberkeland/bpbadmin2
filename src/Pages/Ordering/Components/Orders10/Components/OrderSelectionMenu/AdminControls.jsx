import React from "react";

import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

import { useLocationList } from "../../../../Data/locationData";


export const AdminControls = ({ settings, orderType }) => {
  const { 
    locNick, setLocNick, 
    standingIsWhole, standingSetIsWhole, 
    standingIsStand, standingSetIsStand 
  } = settings

  return(
    <div style={{width: "100%", padding: "10px"}} >
      <div style={{padding: "15px", backgroundColor: "lightgray", borderRadius: "6px"}}>
        <div style={{paddingBottom: "10px"}}>Admin Controls</div>
        <LocationDropdown
          location={locNick}
          setLocation={setLocNick}
        />

        {orderType === 'STAND' &&
          <div style={{marginTop: "10px"}}>
            <div className="field-checkbox">
              <Checkbox
                inputId="iswhole"
                onChange={e => standingSetIsWhole(e.checked)}
                checked={standingIsWhole}
                style={{marginRight: "0.5em"}}
              />
              <label htmlFor="iswhole" className="p-checkbox-label">isWhole</label>
            </div>

            <div className="field-checkbox" style={{marginTop: "5px"}}>
              <Checkbox
                inputId="isstand"
                onChange={e => standingSetIsStand(e.checked)}
                checked={standingIsStand}
                style={{marginRight: "0.5em"}}
              />
              <label htmlFor="isstand" className="p-checkbox-label">isStand</label>
            </div>
          </div>

        }

      </div>
      </div>

  )

}

const LocationDropdown = ({ location, setLocation }) => {
  const { data:locationList } = useLocationList(true)

  return(
    <div className="p-fluid" >
      <Dropdown 
        id="locationDropdown"
        options={locationList || null}
        optionLabel="locName"
        optionValue="locNick"
        value={location}
        placeholder="Choose Location"
        filter
        filterBy="locName,locNick"
        showFilterClear
        resetFilterOnHide
        onChange={e => setLocation(e.value)}
      />
    </div>

  )

}