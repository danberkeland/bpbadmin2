import React, { useState } from "react"

import { Calendar } from "primereact/calendar"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { InputText } from "primereact/inputtext"
import { InputNumber } from "primereact/inputnumber"

import * as customQueries from '../../../customGraphQL/queries'
import { API } from "aws-amplify"
import { Column } from "primereact/column"
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik'

function mmddyyyyToISO(strDate) {
  if (strDate === null) return null

  const dateParts = strDate.split('/')
  return (dateParts[2] + '-' + dateParts[0] + '-' + dateParts[1])
}


export const Orders = () => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  const [userAuth, setUserAuth] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState("whole")
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedWeekDay, setSelectedWeekDay] = useState(null)
  const [orderData, setOrderData] = useState(null)

  const fetchOrders = async (query, variables) => {
    const response = await API.graphql({
      query: query,
      variables: variables
    })

    const dateISO = mmddyyyyToISO(variables.delivDate)

    const cartOrders = response.data.getLocation.orders.items

    const standingOrders = response.data.getLocation.standing.items
    const filteredStanding = standingOrders.filter(order => {
      const startDateISO = mmddyyyyToISO(order.startDate)
      const endDateISO = mmddyyyyToISO(order.endDate)
      
      return (startDateISO.localeCompare(dateISO) <= 0) && (dateISO.localeCompare(endDateISO) <= 0)
    })

    let tableData = [];
    for (let i = 0; i < cartOrders.length; i++) { 
      if (!tableData.includes(cartOrders[i].prodNick)) {
        
        tableData.push({
          prodNick: cartOrders[i].prodNick,
          cartID: cartOrders[i].id,
          cartQty: cartOrders[i].qty,
          standingID: null,
          standingQty: null,
          total: cartOrders[i].qty
        })
      }
    }
    for (let i = 0; i < filteredStanding.length; i++) { 
      let j = tableData.findIndex(item => item.prodNick === filteredStanding[i].prodNick)

      if (j > -1) {
        tableData[j] = {...tableData[j], 
          standingID: filteredStanding[i].id,
          standingQty: filteredStanding[i].qty
        }
      } else {
        tableData.push({
          prodNick: filteredStanding[i].prodNick,
          cartID: null,
          cartQty: null,
          standingID: filteredStanding[i].id,
          standingQty: filteredStanding[i].qty,
          total: filteredStanding[i].qty
        })
      }
    }
    setOrderData(tableData)

  }

  const initialValues = {
    items: [
      {
        prodNick: "",
        qty: ""
      },
    ],
  }
  
  return (
    <div>
      <Calendar 
        value={selectedDate}
        dateFormat="mm/dd/yy"
        showTime={false}
        onChange={e => {
          let month = ('0' + ((e.value).getMonth() + 1)).slice(-2)
          let day = ('0' + (e.value).getDate()).slice(-2)
          let year = (e.value).getFullYear()
          setSelectedDate(month + '/' + day + '/' + year)
          setSelectedWeekDay(weekDays[(e.value).getDay()])
        }}
        placeholder={"Select Date"}
      />
      <Button
        label="Get Data"
        disabled={!selectedDate}
        onClick={() => fetchOrders(customQueries.listOrdersFromLocation, {
          locNick: selectedLocation,
          delivDate: selectedDate,
          dayOfWeek: selectedWeekDay
        })}
      />

      <div style={{maxWidth: "600px"}}>
      <DataTable
        value={orderData}
        selectionMode="single"
        metaKeySelection={false}
        responsiveLayout="scroll"
        size="small"
        showGridlines
        scrollable 
        scrollHeight="600px"
      >
        <Column field="prodNick" header="prodNick" />
        <Column field="standingQty" header="Standing" />
        <Column 
          header="Cart"
          body={(rowData) => {
            const [cellIsEdit, setCellisEdit] = useState(false)
            const [updatedValue, setUpdatedValue] = useState()

            if (cellIsEdit) {
              return (
                <div className="p-fluid">
                  <InputNumber 
                    id="numberInput"
                    className="p-inputtext-sm block mb-2"
                    width="50"
                    autoFocus 
                    placeholder={rowData.cartQty} 
                    onChange={e => {
                      setUpdatedValue(e.value)
                    }}
                    onKeyUp={e => {if (e.code === "Enter") {
                      let updatedOrderData = orderData.map(item => {return {...item}})
                      let i = orderData.findIndex(item => item.prodNick === rowData.prodNick)
                      console.log(i)
                      updatedOrderData[i].cartQty = updatedValue
                      setOrderData(updatedOrderData)
                      setCellisEdit(false)
                    }}} 
                    onBlur={() => setCellisEdit(false)}
                  />
                </div>
              )
            }
            return <div style={{display: "inline-block", width: "100%", height: "100%"}} onClick={() => {setCellisEdit(false); setCellisEdit(true)}} >{rowData.cartQty}</div>
        }}
        />
        <Column field="total" header="Total" />
      </DataTable>
      </div>
      
      <pre>selectedLocation: {selectedLocation}</pre>
      <pre>userAuth: {userAuth}</pre>
      <pre>selectedDate: {selectedDate}</pre>
      <pre>selectedWeekDay: {selectedWeekDay}</pre>
      <pre>GraphQL Order Data: {JSON.stringify(orderData, null, 2)}</pre>

      <h3>Add Items</h3>
      <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ values }) => (
        <Form>
          <FieldArray name="items">
            {({ insert, remove, push }) => (
              <div>
                {values.items.length > 0 &&
                  values.items.map((friend, index) => (
                    <div className="row" key={index}>
                      <div className="col">
                        <label htmlFor={`items.${index}.name`}>Name</label>
                        <Field
                          name={`items.${index}.name`}
                          placeholder="Jane Doe"
                          type="text"
                        />
                        <ErrorMessage
                          name={`items.${index}.name`}
                          component="div"
                          className="field-error"
                        />
                      </div>
                      <div className="col">
                        <label htmlFor={`items.${index}.email`}>Email</label>
                        <Field
                          name={`items.${index}.email`}
                          placeholder="jane@acme.com"
                          type="email"
                        />
                        <ErrorMessage
                          name={`items.${index}.name`}
                          component="div"
                          className="field-error"
                        />
                      </div>
                      <div className="col">
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => remove(index)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                <button
                  type="button"
                  className="secondary"
                  onClick={() => push({ name: '', email: '' })}
                >
                  Add Friend
                </button>
              </div>
            )}
          </FieldArray>
          <button type="submit">Invite</button>
        </Form>
      )}
    </Formik>

    </div>
    

  )

}