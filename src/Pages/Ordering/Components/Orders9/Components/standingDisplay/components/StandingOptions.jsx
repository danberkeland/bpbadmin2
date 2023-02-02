import React from "react"
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"

export const StandingOptions = ({ viewSettings, products }) => {
  const { viewMode, setViewMode, dayOfWeek, setDayOfWeek, selectedProduct, setSelectedProduct } = viewSettings

  return (
    <Card title="Display..." style={{margin: "10px"}}>
        <div style={{display: "flex"}}>
          <Button label="by Day" 
            onClick={e => {
              setViewMode('DAY')
              if (!dayOfWeek) setDayOfWeek('Sun')
            }} 
            className={viewMode === 'DAY' ? '' : "p-button-outlined p-button-secondary"}
            style={{flex: "50%", marginRight: "25px"}}
          />
          <Button label="by Product" 
            onClick={e => {
              setViewMode('PRODUCT')
              if (!selectedProduct && !!products.length) setSelectedProduct(products[0])
            }} 
            className={viewMode === 'PRODUCT' ? '' : "p-button-outlined p-button-secondary"}
            style={{flex: "50%"}}
          />
        </div>
        {viewMode === 'DAY' && 
          <WeekdayDropdown 
            value={dayOfWeek}
            setValue={setDayOfWeek}
          />
        }

        {viewMode === 'PRODUCT' && 
          <ProductDropdown 
            options={products}
            value={selectedProduct}
            setValue={setSelectedProduct}
          />
        }
      </Card>
  )

}

const WeekdayDropdown = ({ value, setValue }) => {
  const weekdays = [
    {label: "Sunday", value: "Sun"},
    {label: "Monday", value: "Mon"},
    {label: "Tuesday", value: "Tue"},
    {label: "Wednesday", value: "Wed"},
    {label: "Thursday", value: "Thu"},
    {label: "Friday", value: "Fri"},
    {label: "Saturday", value: "Sat"},
  ]

  return (
    <div className="p-float-label" style={{display: "flex", gap: "10px", marginTop: "30px"}}>
      <Button 
        icon="pi pi-chevron-left" 
        style={{flex:"25%"}} 
        className="p-button-outlined"
        onClick={e => {
          let idx = weekdays.findIndex(item => item.value === value)
          setValue(weekdays[(idx + 6) % 7].value)
        }}
      />

      <Dropdown style={{flex: "50%"}}
        id="weekday-dropdown"
        value={value}
        options={weekdays}
        onChange={e => setValue(e.value)}
        placeholder="Weekday"
      />

      <Button 
        icon="pi pi-chevron-right" 
        style={{flex:"25%"}} 
        className="p-button-outlined"
        onClick={e => {
          let idx = weekdays.findIndex(item => item.value === value)
          setValue(weekdays[(idx + 1) % 7].value)
        }}
      />
    </div>
  )
}

export const ProductDropdown = ({ options, value, setValue }) => {

  return (
    <div className="p-float-label" style={{marginTop: "30px"}}>
      <Dropdown
        style={{width: "100%"}}
        id="product-dropdown"
        value={value?.prodNick}
        options={options}
        optionLabel="prodName"
        optionValue="prodNick"
        onChange={e => setValue(options.find(item => item.prodNick === e.value))}
        placeHolder="Product"
      />
    </div>
  )
}

