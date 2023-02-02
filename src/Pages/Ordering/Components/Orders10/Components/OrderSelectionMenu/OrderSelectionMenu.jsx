import React, { useState } from "react"

import { TabMenu } from "primereact/tabmenu"
import { Calendar } from "primereact/calendar"
import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { AdminControls } from "./AdminControls"



export const OrderSelectionMenu = ({  user, publicSettings, adminSettings }) => {
  const { 
    orderType, setOrderType, 
    cartDelivDate, setCartDelivDate, 
    standingViewType, setStandingViewType, 
    standingViewProduct, setStandingViewProduct, 
    standingViewDay, setStandingViewDay 
  } = publicSettings

  const [activeIndex, setActiveIndex] = useState(0)
  const model = [
    {label: 'Cart', value: 'CART', icon: 'pi pi-fw pi-shopping-cart'},
    {label: 'Standing', value: 'STAND', icon: 'pi pi-fw pi-calendar'}
  ]


  return (
    <div className="order-menu">
      <TabMenu 
        model={model}
        activeIndex={activeIndex}
        onTabChange={e => {
          setActiveIndex(e.index)
          setOrderType(e.value.value)
        }}
      />

      {user.locNick === 'backporch' &&
       
        <AdminControls settings={adminSettings} orderType={orderType} />

      }

      {orderType === 'CART' &&
        <div style={{padding: "25px", width: "100%", height: "149px"}}>
          <div style={{display: "flex"}}>
            <div style={{flex: "100%", display: "flex", justifyContent: "right", alignItems: "center", marginRight: "10px"}}>
              <label htmlFor="delivdate-calendar">Delivery Date:</label>
            </div>

            <div className="p-fluid" style={{flex: "0 0 105px"}}>
              <Calendar 
                id="delivdate-calendar"
                touchUI={true}
                style={{width: "100%"}}
                value={cartDelivDate}
                onChange={e => {
                  setCartDelivDate(e.value)
                }}
              />
              
            </div>
          </div>
        </div>
      }

      {orderType === 'STAND' && 
        <div style={{padding: "25px", width: "100%"}}>
          <div style={{display: "flex", gap:"25px"}}>
            <Button label="by Day" style={{flex: "50%"}}
              onClick={e => {
                setStandingViewType('DAY')
                //if (!dayOfWeek) setDayOfWeek('Sun')
              }} 
              className={standingViewType === 'DAY' ? '' : "p-button-outlined p-button-secondary"}
            />

            <Button label="by Product" style={{flex: "50%"}}
              onClick={e => {
                setStandingViewType('PRODUCT')
                //if (!selectedProduct && !!products.length) setSelectedProduct(products[0])
              }} 
              className={standingViewType === 'PRODUCT' ? '' : "p-button-outlined p-button-secondary"}
            />
          </div>

          {standingViewType === 'PRODUCT' &&
            <ProductDropdown 
              options={[]}
              value={standingViewProduct}
              setValue={setStandingViewProduct}            
            />
          }

          {standingViewType === 'DAY' &&
            <WeekdaySelection value={standingViewDay} setValue={setStandingViewDay}/>
          }
        </div>
      }



    </div>
  )
}

const WeekdaySelection = ({ value, setValue }) => {
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
    <div className="p-float-label" style={{display: "flex", gap: "10px", marginTop: "25px"}}>
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
    <div className="p-float-label" style={{marginTop: "25px"}}>
      <Dropdown
        style={{width: "100%"}}
        id="product-dropdown"
        value={value?.prodNick}
        options={options}
        optionLabel="prodName"
        optionValue="prodNick"
        onChange={e => setValue(options.find(item => item.prodNick === e.value))}
        placeholder="Product"
      />
    </div>
  )
}