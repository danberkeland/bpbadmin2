import React from "react"

import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"

export const CartItemsDisplay = ({ locNick, delivDate, itemsState }) => {
  const { cartItems, cartItemChanges, setCartItemChanges } = itemsState

  return (
    <div className="cart-items-container">
      <DataTable
        value={cartItemChanges}
        style={{width: "100%", padding: "10px"}}
        size="large"
        responsiveLayout="scroll"
        //rowExpansionTemplate={rowExpansionTemplate} 
        //expandedRows={expandedRows} 
        //onRowExpand={e => console.log("Data for " + e.data.prodNick, JSON.stringify(e.data, null, 2))}
        //onRowToggle={(e) => setExpandedRows(e.data)}
        dataKey="product.prodNick"
        //footer={tableFooterTemplate} // displays grand total
      >
        <Column field="product.prodName" 
          header="Product"
        />
        <Column field="qty" 
          header="Qty"
        />

      </DataTable>
    </div>
  )

}