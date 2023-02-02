import React from "react";
import { useState } from "react";

import { useSettingsStore } from "../../../../Contexts/SettingsZustand";

import { OrderSelectionMenu } from "./Components/OrderSelectionMenu/OrderSelectionMenu";
import { CartOrders } from "./Components/CartOrders/CartOrders";
import { StandingOrders } from "./Components/StandingOrders";
import { getWorkingDateTime } from "../../Functions/dateAndTime";



const Orders10 = () => {
  const globalState = useSettingsStore()
  const user = {
    name: globalState.user,
    authClass: globalState.authClass,
    locNick: globalState.currentLoc
  }

  // State to determine what type of orders to manage

  // public
  const [orderType, setOrderType] = useState('CART')
  
  const [cartDelivDate, setCartDelivDate] = useState(new Date(getWorkingDateTime('NOW').plus({ days: 1}).toISO()))
  
  const [standingViewType, setStandingViewType] = useState('DAY')
  const [standingViewDay, setStandingViewDay] = useState('Sun')
  const [standingViewProduct, setStandingViewProduct] = useState(null)
  const menuSettings = { 
    orderType, setOrderType, 
    cartDelivDate, setCartDelivDate, 
    standingViewType, setStandingViewType,
    standingViewProduct, setStandingViewProduct,
    standingViewDay, setStandingViewDay
  }

  //admin
  const requireBPBUser = (user) => user.locNick === 'backporch'

  const [locNick, setLocNick] = useStateWithAuth(user.locNick === 'backporch' ? null : user.locNick, requireBPBUser, user)
  const [cartIsWhole, setCartIsWhole] = useStateWithAuth(true, requireBPBUser, user)
  const [standingIsWhole, setStandingIsWhole] = useStateWithAuth(true, requireBPBUser, user)
  const [standingIsStand, setStandingIsStand] = useStateWithAuth(true, requireBPBUser, user)
  const adminSettings = {
    locNick, setLocNick,
    cartIsWhole, setCartIsWhole,
    standingIsWhole, setStandingIsWhole,
    standingIsStand, setStandingIsStand
  }
  

  return(
    <div className="ordering-page-body" style={{marginBottom: "150px"}} >

      
      <h1>Order Management</h1>

      <OrderSelectionMenu 
        user={user}  
        publicSettings={menuSettings}
        adminSettings={adminSettings}
      />


      {orderType === 'CART' && 
        <CartOrders 
          locNick={locNick}
          delivDate={cartDelivDate}
          cartIsWhole={cartIsWhole}
        />}

      {orderType === 'STAND' && 
        <StandingOrders 
          locNick={locNick}
          viewType={standingViewType}
          viewDay={standingViewDay}
          viewProduct={standingViewProduct}
        />
      }

    </div>

  )

}

export default Orders10


/** Restrict access to setter function if authTest fails */
const useStateWithAuth = (initialState, authTest, creds) => {
  const [state, _setState] = useState(initialState)

  const setState = authTest(creds) ? _setState : (state) => console.log("Auth check failed")

  return [state, setState]
}