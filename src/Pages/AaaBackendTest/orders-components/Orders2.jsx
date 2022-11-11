import React, { useState } from "react"
import create from "zustand"

import { Calendar } from "primereact/calendar"

import * as mockData from './mockData'
import { Dropdown } from "primereact/dropdown"
import { useEffect } from "react"

import './orders.css'

export const Orders2 = () => {

  const testUser = mockData.users[1] // change index to test different user settings
  const userProps = {
    sub: testUser.sub,
    name: testUser.user.name,
    locNick: testUser.locNick,
    authClass: testUser.user.authClass,
    authType: testUser.authType
  }
  const locationList = [ ... new Set(mockData.users.map(item => item.locNick))]
    .map(item => ({label: item, value: item}))

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const [selectedDate, setSelectedDate] = useState()
  const [selectedWeekday, setSelectedWeekday] = useState()
  const [selectedLocation, setSelectedLocation] = useState(testUser.locNick === "backporch"? null : testUser.locNick)

  // Probably has bugs -- convert to Luxon later!
  useEffect(() => {
    const date = new Date()
    date.setDate(date.getDate() + 2)
    setSelectedDate(date)
  }, []);
  
  return (
      <div className="pageContainer">
        <h1>Wholesale Cart Order</h1>
        <div className="card">
            <header className="card-header">
              <h3>Selection</h3>
            </header>

          
          <div className="card-body">
            
            {/* Location */}
            <div style={{padding: "0px 0px 2px 0px"}}>
              {userProps.locNick === "backporch" &&
                <Dropdown
                  placeholder="Location" 
                  options ={locationList}
                  value={selectedLocation}
                  onChange={e => {setSelectedLocation(e.value)}}
                />
              }
              {userProps.locNick !== "backporch" && <div>Your location: {selectedLocation}</div>}
            </div>
            {/* Date */}
            <div style={{padding: "2px 0px 2px 0px"}}>
              <Calendar 
                readOnlyInput
                value={selectedDate}
                inline={false}
                touchUI={true}
                dateFormat="mm/dd/yy"
                showTime={false}
                onChange={e => {
                  // calendar selection values are js Date objects
                  setSelectedWeekday(weekdays[((e.value).getDay())])
                  setSelectedDate(e.value)
                }}
                placeholder={"Select Date"}
              />
            </div>
            <div>Fufillment type (delivery/pickup)</div>
            <div>PO#/instructions</div>
          </div>
        
        </div>

        <div className="orderList">Order List</div>

        <div className="card" hidden={false}>
          <header className="card-header">
            <h3>Variables</h3>
          </header>
          <div className="card-body">
            <pre>selectedDate: {JSON.stringify(selectedDate, null, 2)}</pre>
            <pre>selectedWeekday: {JSON.stringify(selectedWeekday, null, 2)}</pre>
            <pre>selectedLocation: {JSON.stringify(selectedLocation, null, 2)}</pre>
            <pre>userProps: {JSON.stringify(userProps, null, 2)}</pre>
          </div>
        </div>
      </div>


  )
}

// style={{border: "1px solid gray", borderRadius: "5px", margin: "5px", maxWidth: "400px"}}
// style={{width: "100%", backgroundColor: "lightGray", padding: "5px 0px 0px 5px", borderRadius: "5px 5px px 0px"}}