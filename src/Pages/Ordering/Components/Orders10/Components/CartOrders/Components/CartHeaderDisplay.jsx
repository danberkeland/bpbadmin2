import React from "react"
import { Dropdown } from "primereact/dropdown"
import { InputTextarea } from "primereact/inputtextarea"

export const CartHeaderDisplay = ({ locNick, delivDate, headerState }) => {
  const { cartHeader, cartHeaderChanges, setCartHeaderChanges } = headerState
  const fulfillmentOptions = [
    {label: 'Delivery', value: 'deliv'}, 
    {label: 'Pickup SLO', value: 'slopick'}, 
    {label: 'Pickup Carlton', value: 'atownpick'}
  ].map(item => item.value === cartHeader.defaultRoute 
    ? {...item, label: `${item.label} (default)`}
    : item 
  ).filter(item => (!!locNick) && (cartHeaderChanges.defaultRoute === 'deliv' || item.value !== 'deliv'))

  return (
    <div className="cart-header-container">
      <div className="route-dropdown-container" style={{display: "flex", padding: "25px 25px 0px 25px", width: "100%"}}>
        <div style={{flex: "100%", display: "flex", justifyContent: "right", alignItems: "center", marginRight: "10px"}}>
          <label htmlFor="route-dropdown">Fulfillment:</label>
        </div>

        <div className="p-fluid" style={{flex: "0 0 230px"}}>
          <Dropdown 
            id="route-dropdown"
            options={fulfillmentOptions} 
            value={cartHeaderChanges.route}
            onChange={e => setCartHeaderChanges({ ...cartHeaderChanges, route: e.value })}
          />
        </div>
      </div>

      <div className="note-container" style={{display: "flex", padding: "25px 25px 0px 25px", width: "100%"}}>
        <div style={{flex: "100%", display: "flex", justifyContent: "right", alignItems: "center", marginRight: "10px"}}>
          <label htmlFor="input-note">Note:</label>
        </div>

        <div className="p-fluid" style={{flex: "0 0 230px"}}>
          <InputTextarea
            id="input-note"
            rows={1}
            autoResize
            maxLength={100}
            value={cartHeader.ItemNote ? cartHeader.ItemNote : undefined}
            onChange={e => setCartHeaderChanges({ ...cartHeader, ItemNote: e.target.value ? e.target.value : null })}
            disabled={!locNick || !delivDate}
          />
        </div>
      </div>

    </div> 
  )
}