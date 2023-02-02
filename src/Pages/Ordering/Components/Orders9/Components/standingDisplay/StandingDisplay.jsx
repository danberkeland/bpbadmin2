// First Iteration Standing Order Management

// Although the schema allows for serveral categories of standing order,
// we assume all records are wholesale (not retail), and standing (not holding).
// First extra type to incorporate will be holding orders
import "./standingDisplay.css"

import React, { useState, useEffect } from "react"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Dropdown } from "primereact/dropdown"
import { Column } from "primereact/column"
import { InputNumber } from "primereact/inputnumber"

import { AddProductInterface } from "./components/AddProductInterface"
import { StandingOptions } from "./components/StandingOptions"

import { useStandingByLocation } from "../../../../Data/orderData"

import detectChange from "./functions/detectChange"
import handleStandingSubmit from "./functions/handleStandingSubmit"
import makeStandingBase from "./functions/makeStandingBase"
import makeStandingView from "./functions/makeStandingView"

import dynamicSort from "../../../../Functions/dynamicSort"
import { getWorkingDateTime } from "../../../../Functions/dateAndTime"

export const StandingDisplay = ({ standingSettings, user }) => {
  const  { location, isWhole, isStand } = standingSettings

  // Display Controls
  const [viewMode, setViewMode] = useState(null) // 'DAY' or 'PRODUCT'. for future, perhaps a 'FULL' view which is a DAY view but with all 7 day columns.
  const [dayOfWeek, setDayOfWeek] = useState(null) // select day in viewMode 'DAY'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const viewSettings = { viewMode, setViewMode, dayOfWeek, setDayOfWeek, selectedProduct, setSelectedProduct } 
  
  // const { data:locationDetails } = useLocationDetails(location, !!location) // maybe use when adding route management features?
  
  const { data:standingData, mutate:mutateStanding } = useStandingByLocation(location, !!location)

  const [standingBase, setStandingBase] = useState({})
  const [standingChanges, setStandingChanges] = useState({})
  const changeDetected = detectChange(standingBase, standingChanges)

  useEffect(() => {
    if (!!standingData) {
      setStandingBase(makeStandingBase(standingData))
      setStandingChanges(makeStandingBase(standingData))
      
    }
  }, [standingData])

  const standingView = makeStandingView(standingChanges, isWhole, isStand, viewMode, dayOfWeek, selectedProduct)

  const products = standingChanges ? Object.values(standingChanges)
    .filter(item => item.isStand === isStand && item.isWhole === isWhole)
    .reduce((acc, curr) => {
      if (acc.findIndex(item => item.prodNick === curr.product.prodNick) === -1) {
        acc.push(curr.product)
      }
      return acc
      
    }, [])
    .sort(dynamicSort('prodName'))
    : []

  return(
    <div>

      <StandingOptions
        viewSettings={viewSettings}
        products={products}
      />

      <div style={{margin: "10px"}}>
      <DataTable 
        value={standingView}
        responsiveLayout="scroll"
        size="small"
      >        
        <Column field='label'
          header={viewMode === 'DAY' ? "Product" : "Weekday"}
          body={rowData => {
            const dataKey = [rowData.prodNick, rowData.dayOfWeek, (isWhole ? '1' : '0'), (isStand ? '1' : '0')].join('_')
            const originalItem = standingBase ? standingBase[dataKey] : null
            const changedItem = standingChanges[dataKey]

            const shouldCreate = !originalItem && (!!changedItem && changedItem.qty) > 0
            const qtyChanged = (!!originalItem && !!changedItem) && (originalItem.qty !== changedItem.qty)

            return (
              <span style={{fontWeight: (shouldCreate || qtyChanged) ? "bold" : ""}}>
                {rowData.label}
              </span>
            )
          }}
        />
        <Column field='dataKey'
          header="Qty"
          style={{width:"80px"}}
          body={rowData => {
            const standingItem = standingChanges[rowData.dataKey]
            
            return(
              <div className="p-fluid">
                <InputNumber 
                  value={standingItem ? standingItem.qty : 0}
                  onValueChange={e => {
                    // console.log('rowData', rowData)
                    if (standingItem) {
                      let _update = { 
                        ...standingChanges, 
                        [rowData.dataKey]: {
                          ...standingChanges[rowData.dataKey], 
                          qty: e.value
                        }
                      }
                      console.log(_update)
                      setStandingChanges(_update)
                    } else {
                      let dataKey = [rowData.prodNick, rowData.dayOfWeek, (isWhole ? '1' : '0'), (isStand ? '1' : '0')].join('_')
                      let newItem = {
                        locNick: location,
                        isStand: isStand,
                        isWhole: isWhole,
                        dayOfWeek: rowData.dayOfWeek,
                        route: 'deliv',
                        ItemNote: null,
                        prodNick: rowData.prodNick,
                        qty: e.value,
                        startDate: '2023-01-01',
                        updatedBy: user.name,
                        product: {
                          prodNick: rowData.prodNick,
                          prodName: rowData.prodName
                        }
                      }
                      let _update = {
                        ...standingChanges,
                        [dataKey]: newItem
                      }
                      console.log("Updated standing changes:", _update)
                      setStandingChanges(_update)
                    }
                  }}
                />
              </div>
            )
          }}
        />
      </DataTable>
      </div>

      <AddProductInterface
        standingChanges={standingChanges}
        setStandingChanges={setStandingChanges}
        isWhole={isWhole}
        isStand={isStand}
        viewMode={viewMode}
        setSelectedProduct={setSelectedProduct}
        filterBy={user.location === 'backporch' ? 'prodNick,prodName' : 'prodName'}
      />

      <Button label="Submit Changes"
        onClick={() => handleStandingSubmit(location, isWhole, standingBase, standingChanges, mutateStanding, user.name)}
        disabled={!changeDetected}
      />

      <p>{`Changes will take effect ${getWorkingDateTime('NOW').plus({ days: 4 }).toLocaleString({ weekday: 'long', month: 'short', day: '2-digit' })}.`}</p>
        
      {/* <pre>{viewMode === 'DAY' ? JSON.stringify(standingByDay, null, 2) : JSON.stringify(standingByProduct, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(standingDisplay, null, 2)}</pre> */}
      {/* <pre>{productData && JSON.stringify(productData.slice(5), null, 2)}</pre> */}
      {/* <pre>{locationDetails && locationDetails.locNick}</pre> */}
      {/* <pre>{standingData && JSON.stringify(standingData.filter(item => item.isStand === isStand && item.isWhole === isWhole), null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}

    </div>
  )

}



const WeekdayDropdown = ({ value, setValue }) => {
  return (
    <Dropdown
      style={{width:"150px"}}
      id="weekday-dropdown"
      value={value}
      options={
        [
          {label: "Sunday", value: "Sun"},
          {label: "Monday", value: "Mon"},
          {label: "Tuesday", value: "Tue"},
          {label: "Wednesday", value: "Wed"},
          {label: "Thursday", value: "Thu"},
          {label: "Friday", value: "Fri"},
          {label: "Saturday", value: "Sat"},
        ]
      }
      onChange={e => setValue(e.value)}
    />
  )
}

export const ProductDropdown = ({ options, value, setValue }) => {

  return (
      <Dropdown
      style={{width:"100%"}}
        id="product-dropdown"
        value={value?.prodNick}
        options={options}
        optionLabel="prodName"
        optionValue="prodNick"
        placeholder="Select a product"
        onChange={e => setValue(options.find(item => item.prodNick === e.value))}
      />
  )
}

