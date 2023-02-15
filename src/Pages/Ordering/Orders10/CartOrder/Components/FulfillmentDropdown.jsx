import React from "react"
import { Dropdown } from "primereact/dropdown"

const delivOptions = [
  {label: 'Delivery', value: 'deliv'},
]
const pickupOptions = [
  {label: 'SLO Pickup', value: 'slopick'},
  {label: 'Carlton Pickup', value: 'atownpick'}
]

export const FulfillmentDropdown = ({ headerChanges, setHeaderChanges }) => {

  const fulfillmentDropdownModel = headerChanges?.defaultRoute === 'deliv'
    ? delivOptions + pickupOptions
    : pickupOptions

  return (
    <Dropdown 
      options={fulfillmentDropdownModel}
      value={headerChanges?.route}
      onChange={e => {
        console.log(e.value)
        setHeaderChanges({ ...headerChanges, route: e.value })
      }}
      itemTemplate={(option) => {
        if (option.value === headerChanges?.defaultRoute) return <div>{`${option.label} (default)`}</div>
        return <div>{option.label}</div>
      }}
      valueTemplate={(option, props) => {
        if (option) return <div>{option.label}</div>
        return <span>{props.placeholder}</span>
      }}
    />

  )
}
