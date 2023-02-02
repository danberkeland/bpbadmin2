import React, { useState } from "react"
import { Button } from "primereact/button"

import { AddItemSidebar } from "./components/AddItemSidebar"
import { ItemsCard } from "./components/ItemsCard"
import { OptionsCard } from "./components/OptionsCard"
import { useEffect } from "react"
import { makeOrderHeader, makeOrderItems, validateCart } from "../../../../Data/dataTransformations"
import { useLocationDetails } from "../../../../Data/locationData"
import { dateToYyyymmdd, getOrderSubmitDate, getTtl, getWorkingDate } from "../../../../Functions/dateAndTime"

import { useOrdersByLocationByDate, useStandingByLocation } from "../../../../Data/orderData"

import { gqlFetcher } from "../../../../Data/fetchers"
import { createOrder, updateOrder } from "../../../../Data/gqlQueries"

export const OrderDisplay = ({ location, delivDate, userName }) => {
  const [showAddItem, setShowAddItem] = useState(false)
  const sidebarProps = {showAddItem, setShowAddItem}

  const [orderHeader, setOrderHeader] = useState()
  const [orderHeaderChanges, setOrderHeaderChanges] = useState()

  const [orderItems, setOrderItems] = useState()
  const [orderItemChanges, setOrderItemChanges] = useState()

  const [revalidating, setRevalidating] = useState(false)

  const orderHeaderState = { orderHeader, orderHeaderChanges, setOrderHeaderChanges }
  const orderItemsState = { orderItems, orderItemChanges, setOrderItemChanges }

  // const { locationDetails, standingData, cartData } = useOrderData
  const { data:locationDetails } = useLocationDetails(location, !!location)
  const { data:standingData } = useStandingByLocation(location, (!!location && !!delivDate))
  const { data:cartData, mutate:mutateCart } = useOrdersByLocationByDate(location, delivDate, (!!location && !!delivDate))

  //const OrderItemList = makeOrderObject(locationDetails, cartData, standingData, delivDate)

  useEffect(() => {
    console.log("(L,S,C):", locationDetails?1:0, standingData?1:0, cartData?1:0)
    if (!!locationDetails && !!standingData && !!cartData) {
      const _header = makeOrderHeader(locationDetails, cartData, standingData, delivDate)
      const _items = makeOrderItems(locationDetails, cartData, standingData, delivDate)
      const _itemsObj = Object.fromEntries(_items.map(item => [item.prodNick, item]))
      setOrderHeader(_header)
      setOrderItems(_itemsObj) // keyed on prodNick for easy reference
      setOrderHeaderChanges(_header)
      setOrderItemChanges(_items)
      console.log("changed items:", _itemsObj)

      validateCart(cartData, mutateCart)
    }
  }, [locationDetails, standingData, cartData, mutateCart, delivDate])

  const handleSubmit = async () => {
    // combine header data with items
    // combination & submission logic will be designed 
    // to focus on one item at a time.
    
    // We build the submission item, then decide what, if anything,
    // to do with it.
    // For now we will build uniform submission items without
    // worrying about submitting non-changes over the wire.
    console.log("Submitting...")
    for (let ordItm of orderItemChanges) {
      // build submit item
      let subItem = {
        isWhole: true,
        delivDate: dateToYyyymmdd(delivDate),
        route: orderHeaderChanges.route,
        ItemNote: orderHeaderChanges.ItemNote,
        locNick: location,
        prodNick: ordItm.prodNick,
        qty: ordItm.qty,
        rate: ordItm.rate,
        isLate: 0,
        updatedBy: userName,
        ttl: getTtl(delivDate)
      }
      // can conditionally add other attributes in the future
      if (!!ordItm.id && ordItm.type === "C") subItem.id = ordItm.id

      // Decide Action
      let action = "NONE"
      if (subItem.hasOwnProperty("id")) {
        // check changes for route, ItemNote, qty, rate
        if (ordItm.qty !== orderItems[ordItm.prodNick]?.qty) action = "UPDATE"
        if (ordItm.rate !== orderItems[ordItm.prodNick]?.rate) action = "UPDATE"
        if (orderHeader.route !== orderHeaderChanges.route) action = "UPDATE"
        if (orderHeader.ItemNote !== orderHeaderChanges.ItemNote) action = "UPDATE"
      } else {
        if (ordItm.qty > 0) action = "CREATE"
        if (orderHeader.route !== orderHeaderChanges.route) action = "CREATE" // convert all items to cart when header values change
        if (orderHeader.ItemNote !== orderHeaderChanges.ItemNote) action = "CREATE" // ditto here
      }

      if (action === "CREATE") {
        subItem.sameDayMaxQty = ordItm.qty
        subItem.qtyUpdatedOn = new Date().toISOString()
      }

      if (action === "UPDATE") {
        if (getWorkingDate('NOW') !== getWorkingDate(ordItm.updatedOn)) {
          subItem.sameDayMaxQty = orderItems[ordItm.prodNick].qty
        }
        if (ordItm.qty !== orderItems[ordItm.prodNick].qty) subItem.qtyUpdatedOn = new Date().toISOString()
      }

      // make API calls and revalidate cartData cache after.
      // less dynamic/efficient, but simple.  Can be enhanced later.
      // because of the final revalidation, response items serve no function.
      console.log(action+": ", JSON.stringify(subItem, null, 2))

      let response
      if (action === "CREATE") {
        response = await gqlFetcher(createOrder, {input: subItem})
        response = response.data.createOrder
        console.log(response)

      }
      if (action === "UPDATE") {
        response = await gqlFetcher(updateOrder, {input: subItem})
        response = response.data.updateOrder
        console.log(response)

      }

      mutateCart()
      
      // Testing mutate with generic SWR mutate below

      // let variables = {
      //   locNick: location,
      //   delivDate: dateToYyyymmdd(delivDate)
      // }
      // let key = [listOrdersByLocationByDate, variables]
      // mutate(key)
    }

  }


  return (
    <div>
      {/* <pre>{"HEADER: " + JSON.stringify(orderHeader, null, 2)}</pre> */}
      {/* <pre>{"ITEMS: " + JSON.stringify(orderItems, null, 2)}</pre> */}
      {/* <pre>{"ITEM CHANGES: " + JSON.stringify(orderItemChanges, null, 2)}</pre> */}

      {/* <pre>{"Current working day: " + JSON.stringify(getWorkingDate('NOW'), null, 2)}</pre> */}
      {/* <pre>{"Item updatedOn dates: " + JSON.stringify(getOrderSubmitDate(), null, 2)}</pre>    */}

      <OptionsCard
        orderHeaderState={orderHeaderState}
        readOnly={getOrderSubmitDate() >= delivDate}
      />

      {orderItems &&
      <ItemsCard
        orderItemsState={orderItemsState}
        setShowAddItem={setShowAddItem}
        location={location}
        delivDate={delivDate}
        readOnly={getOrderSubmitDate() >= delivDate}
      />
      }

      {(getOrderSubmitDate() < delivDate) &&
      <Button label="Submit" 
        onClick={() => {
          setRevalidating(true)
          handleSubmit()
          setRevalidating(false)
        }}
        disabled={!orderItemChanges || orderItemChanges?.length === 0 || revalidating} // disable when no changes detected
      />
      }

      <AddItemSidebar 
        orderItemsState={orderItemsState}
        location={location}
        delivDate={delivDate}
        sidebarProps={sidebarProps}
      />

    </div>
  )

}