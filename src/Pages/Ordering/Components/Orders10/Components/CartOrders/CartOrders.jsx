import React, { useEffect, useState } from "react";

import { Button } from "primereact/button";

import { CartHeaderDisplay } from "./Components/CartHeaderDisplay";
import { CartItemsDisplay } from "./Components/CartItemsDisplay";
import { AddItemSidebar } from "./Components/AddItemSidebar";

import { useLocationDetails } from "../../../../Data/locationData";
import { useOrdersByLocationByDate, useStandingByLocation } from "../../../../Data/orderData";

import { dateToYyyymmdd, getWeekday, getWorkingDate } from "../../../../Functions/dateAndTime";


export const CartOrders = ({ locNick, delivDate, cartIsWhole }) => {
  const { data:locationDetails } = useLocationDetails(locNick, !!locNick)
  const { data:standingData } = useStandingByLocation (locNick, (!!locNick && !!delivDate))
  const { data:cartData, mutate:mutateCart } = useOrdersByLocationByDate(locNick, delivDate, (!!locNick && !!delivDate))
  console.log("L S C: ", locationDetails?"y":"n", standingData?standingData.length:"n", cartData?cartData.length:"n")

  const [cartHeader, setCartHeader] = useState({}) // should not be changed with setCartHeader
  const [cartHeaderChanges, setCartHeaderChanges] = useState({})
  const headerState = {cartHeader, cartHeaderChanges, setCartHeaderChanges}

  const [cartItems, setCartItems] = useState([]) // should not be changed with setCartItems
  const [cartItemChanges, setCartItemChanges] = useState([])
  const itemsState = { cartItems, cartItemChanges, setCartItemChanges }

  const [showAddItemSidebar, setShowAddItemSidebar] = useState(false)

  const [submitting, setSubmitting] = useState(false)



  useEffect(() => {
    const [_cartHeader, _cartItems] = makeCartOrder(locationDetails, standingData, cartData, delivDate, cartIsWhole)
    setCartHeader(JSON.parse(JSON.stringify(_cartHeader)))
    setCartHeaderChanges(JSON.parse(JSON.stringify(_cartHeader)))
    
    setCartItems(JSON.parse(JSON.stringify(_cartItems)))
    setCartItemChanges(JSON.parse(JSON.stringify(_cartItems)))
   
  }, [locationDetails, standingData, cartData, delivDate, cartIsWhole])



  // const handleSubmit = () => {
  //   // combine header data with items
  //   // combination & submission logic will be designed 
  //   // to focus on one item at a time.
    
  //   // We build the submission item, then decide what, if anything,
  //   // to do with it.
  //   // For now we will build uniform submission items without
  //   // worrying about submitting non-changes over the wire.
  //   console.log("Submitting...")
  //   for (let cItem of cartItemChanges) {
  //     // build submit item
  //     let subItem = {
  //       isWhole: true,
  //       delivDate: dateToYyyymmdd(delivDate),
  //       route: cartHeaderChanges.route,
  //       ItemNote: cartHeaderChanges.ItemNote,
  //       locNick: location,
  //       prodNick: cItem.prodNick,
  //       qty: cItem.qty,
  //       rate: cItem.rate,
  //       isLate: 0,
  //       updatedBy: userName,
  //       ttl: getTtl(delivDate)
  //     }
  //     // can conditionally add other attributes in the future
  //     if (!!cItem.id && cItem.orderType === "C") subItem.id = cItem.id

  //     // Decide Action
  //     let action = "NONE"
  //     if (subItem.hasOwnProperty("id")) {
  //       // check changes for route, ItemNote, qty, rate
  //       if (cItem.qty !== orderItems[cItem.prodNick]?.qty) action = "UPDATE"
  //       if (cItem.rate !== orderItems[cItem.prodNick]?.rate) action = "UPDATE"
  //       if (orderHeader.route !== orderHeaderChanges.route) action = "UPDATE"
  //       if (orderHeader.ItemNote !== orderHeaderChanges.ItemNote) action = "UPDATE"
  //     } else {
  //       if (cItem.qty > 0) action = "CREATE"
  //       if (orderHeader.route !== orderHeaderChanges.route) action = "CREATE" // convert all items to cart when header values change
  //       if (orderHeader.ItemNote !== orderHeaderChanges.ItemNote) action = "CREATE" // ditto here
  //     }

  //     if (action === "CREATE") {
  //       subItem.sameDayMaxQty = cItem.qty
  //       subItem.qtyUpdatedOn = new Date().toISOString()
  //     }

  //     if (action === "UPDATE") {
  //       if (getWorkingDate('NOW') !== getWorkingDate(cItem.updatedOn)) {
  //         subItem.sameDayMaxQty = orderItems[cItem.prodNick].qty
  //       }
  //       if (cItem.qty !== orderItems[cItem.prodNick].qty) subItem.qtyUpdatedOn = new Date().toISOString()
  //     }

  //     // make API calls and revalidate cartData cache after.
  //     // less dynamic/efficient, but simple.  Can be enhanced later.
  //     // because of the final revalidation, response items serve no function.
  //     console.log(action+": ", JSON.stringify(subItem, null, 2))

  //     let response
  //     if (action === "CREATE") {
  //       response = await gqlFetcher(createOrder, {input: subItem})
  //       response = response.data.createOrder
  //       console.log(response)

  //     }
  //     if (action === "UPDATE") {
  //       response = await gqlFetcher(updateOrder, {input: subItem})
  //       response = response.data.updateOrder
  //       console.log(response)

  //     }

  //     mutateCart()
      
  //     // Testing mutate with generic SWR mutate below

  //     // let variables = {
  //     //   locNick: location,
  //     //   delivDate: dateToYyyymmdd(delivDate)
  //     // }
  //     // let key = [listOrdersByLocationByDate, variables]
  //     // mutate(key)
  //   }

  // }
  // }

  return(
    <div className="cart-order-display-body">
      <CartHeaderDisplay
        locNick={locNick}
        delivDate={delivDate}
        headerState={headerState}
      />

      <div className="add-button-container" style={{display: "flex", justifyContent: "right", width: "100%", padding: "25px"}}>
        <Button 
          icon="pi pi-plus" 
          label="Add Product" 
          className="p-button-outlined p-button-rounded" 
          style={{width: "150px"}}
          onClick={() => setShowAddItemSidebar(true)}
          disabled={!locNick || !delivDate}
        />
      </div>

      <CartItemsDisplay 
        locNick={locNick}
        delivDate={delivDate}
        itemsState={itemsState}
      />

      <AddItemSidebar
        visible={showAddItemSidebar}
        setVisible={setShowAddItemSidebar}
        locNick={locNick}
        delivDate={delivDate}
        cartItems={cartItems}
        cartItemChanges={cartItemChanges}
        setCartItemChanges={setCartItemChanges}
      />

      {(getWorkingDate('NOW') < delivDate) &&
        <div className="submit-button-container">
          <Button label="Submit" 
            // onClick={() => {
            //   setSubmitting(true)
            //   handleSubmit()
            //   setSubmitting(false)
            // }}
            disabled={!cartItemChanges || cartItemChanges?.length === 0 || submitting} // disable when no changes detected
          />
        </div>
      }
      
    </div>
  )

}





/** 
 * Derives header data from item data, or from location details if no item data exists.
 * 
 * Header values across items are not checked for consistency,
 * rather, we simply use values from the first item found.
 */
const makeCartOrder = (locationDetails, standingData, cartData, delivDate, cartIsWhole) => {
  if (!(locationDetails && standingData && cartData)) return [[], []]

  const dayOfWeek = getWeekday(delivDate)
  const altPrices = locationDetails.customProd.items

  // Make Items

  // orderItems are cart items, plus any standing items...
  //    whose dayOfWeek coincides with the delivDate, and
  //    whose product (prodNick) doesn't show up in any cart item.
  const orderItems = standingData
    .filter(item => item.dayOfWeek === dayOfWeek)
    .map(item => {
      let altPriceItem = altPrices.find(altItem => altItem.prodNick = item.product.prodNick)
      item.rate = (!!altPriceItem) 
        ? altPriceItem.wholePrice 
        : item.product.wholePrice
      item.orderType = 'S'

      return item
    })
    .reduce((prev, curr) => {
      let matchIndex = prev.findIndex(item => item.product.prodNick === curr.product.prodNick)

      if (matchIndex === -1) {
        curr.orderType = 'C'
        prev.push(curr)
      }
      return prev
    }, cartData)

    // Make Header

    const defaultRoute = ['atownpick', 'slopick'].includes(locationDetails.zone.zoneNick) 
      ? locationDetails.zone.zoneNick
      : 'deliv'
    const cartRoute = cartData.length ? cartData[0].route : null
    //const standingRoute = ... <-- for when we enable setting the attribute in standing orders
    
    const cartNote = cartData.length ? cartData[0].ItemNote : null
    //const standingNote = ... <-- for when we enable setting the attribute in standing orders
    
    const orderHeader = {
      locNick: locationDetails.locNick,
      isWhole: cartIsWhole,
      delivDate: dateToYyyymmdd(delivDate),
      defaultRoute: defaultRoute,
      route: cartRoute ? cartRoute : defaultRoute,
      ItemNote: cartNote ? cartNote : null,
    }


  return [orderHeader, orderItems]
}



