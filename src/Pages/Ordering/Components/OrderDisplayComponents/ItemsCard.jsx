import React, { useState } from "react"

import { Card } from "primereact/card"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"
import { Tooltip } from "primereact/tooltip"
import { OverlayPanel } from "primereact/overlaypanel"
import { useRef } from "react"
import TimeAgo from "timeago-react"
import { getOrderSubmitDate, getWorkingDate } from "../../Functions/dateAndTime"
import { useProductData } from "../../Data/productData"
import { useLocationDetails } from "../../Data/locationData"



/**For display/control of individual cart item info*/
export const ItemsCard = ({ orderItemsState, setShowAddItem, location, delivDate, readOnly }) => {
  const { orderItems, orderItemChanges, setOrderItemChanges } = orderItemsState
  const [expandedRows, setExpandedRows] = useState(null)

  const [rollbackQty, setRollbackQty] = useState(null)

  const inProductionOverlay = useRef(null)
  const orderLockedOverlay = useRef(null)

  const { data:productData } = useProductData()
  const { data:locationDetails, altLeadTimes, prodsNotAllowed } = useLocationDetails(location)

  const cardTitleTemplate = () => {
    return (
      <div style={{display: "flex", }}>
        <div style={{flex: "65%"}}>
          {readOnly ? "Items (Read Only)" : "Items"}
        </div>
        <div style={{flex: "35%"}}>
          <Button label="+ Add Item" 
            disabled={readOnly}
            onClick={() => setShowAddItem(true)}
          />
        </div>
      </div>
    )
  }

  const rowExpansionTemplate = (rowData) => {
    
    return (
      <div>
        <p>{"Rate: " + rowData.rate}</p>
        <p>{"Subtotal: " + ( (rowData.rate * rowData.qty).toFixed(2) )}</p>
        {rowData.qtyUpdatedOn && <p>Item edited <TimeAgo datetime={rowData.qtyUpdatedOn} /></p>}
        {rowData.updatedBy && <p>{"by " + rowData.updatedBy}</p>}
      </div>
    )
  }

  const tableFooterTemplate = () => {
    const total = orderItemChanges.reduce( (acc, item) => {
        return (acc + (item.rate * item.qty)) 
      }, 0).toFixed(2)

    return(
      <div>
        {"Total: " + total}
      </div>
    )
  }

  const qtyInputTemplate = (rowData) => {
    const orderSubmitDate = getOrderSubmitDate()
    const productDetails = productData?.find(item => item.prodNick === rowData.prodNick)
    const leadTime = productDetails?.leadTime
    const altLeadTime = altLeadTimes?.find(item => item.prodNick === rowData.prodNick)
    const inProduction = delivDate < orderSubmitDate.plus({ days: altLeadTime ? altLeadTime.altLeadTime : leadTime })

    const updateProductQty = (prodNick, newQty) => {
      const _orderItemChanges = orderItemChanges.map(item =>
        item.prodNick === prodNick ?
          {...item, qty: newQty} :
          item  
      )
      setOrderItemChanges(_orderItemChanges)
    }

    return(
      <div className="p-fluid">

        <InputNumber 
          className="order-list-number-input"
          disabled={readOnly}
          value={rowData.qty}
          min={0}
          max={inProduction ?
            (
              getWorkingDate('NOW') === getWorkingDate(rowData.qtyUpdatedOn) ?
                rowData.sameDayMaxQty :
                orderItems[rowData.prodNick].qty                
            ) :
            undefined}

          onFocus={e => {
            setRollbackQty(parseInt(e.target.value))
            e.target.select()
          }}

          onChange={e => updateProductQty(rowData.prodNick, e.value)}

          onKeyDown={e => {
            if (e.key === "Enter") {
              if (e.target.value === "") updateProductQty(rowData.prodNick, 0)
              e.target.blur()
            }

            if (e.key === "Escape") {
              if (e.target.value === "") {
                let resetQty = orderItems[rowData.prodNick].qty
                updateProductQty(rowData.prodNick, resetQty)
              } else {
                updateProductQty(rowData.prodNick, rollbackQty)
              }
              e.target.blur()
            }
          }}
        />
      </div>
    )
  }

  return (
    <Card 
      style={{marginTop: "10px"}}
      title={cardTitleTemplate} // Contains Add Item Button
    >   
      {/* <pre>{"rollback: " + rollbackQty + ", " + typeof(rollbackQty)}</pre> */}
      <pre>{JSON.stringify(locationDetails, null, 2)}</pre>
      <DataTable
        value={orderItemChanges.filter(item => (
            item.id === null // means item was just created & has no DB record
            || item.qty > 0 
            || orderItems[item.prodNick].qty > 0 // database record still shows > 0
            || getWorkingDate('NOW') === getWorkingDate(orderItems[item.prodNick].qtyUpdatedOn) 
        ))}
        style={{width: "100%"}}
        responsiveLayout="scroll"
        rowExpansionTemplate={rowExpansionTemplate} 
        expandedRows={expandedRows} 
        onRowExpand={e => console.log("Data for " + e.data.prodNick, JSON.stringify(e.data, null, 2))}
        onRowToggle={(e) => setExpandedRows(e.data)}
        dataKey="prodNick"
        footer={tableFooterTemplate} // displays grand total
      >
        <Column expander={true} style={{ width: '3em' }} />
        <Column header="Product" 
          field="prodName" 
          body={rowData => {
            const orderSubmitDate = getOrderSubmitDate()
            const productDetails = productData?.find(item => item.prodNick === rowData.prodNick)
            const leadTime = productDetails?.leadTime
            const altLeadTime = altLeadTimes?.find(item => item.prodNick === rowData.prodNick)
            const inProduction = delivDate < orderSubmitDate.plus({ days: altLeadTime ? altLeadTime.altLeadTime : leadTime })
            const changeDetected = rowData.prodNick in orderItems ? rowData.qty !== orderItems[rowData.prodNick].qty : true
            const style = {
              color: (rowData.qty === 0 || readOnly)? "gray" : "black",
              textDecoration: rowData.qty === 0 ? "line-through" : "",
              fontWeight: changeDetected ? "bold" : "normal"
            }

            return (
              <div>
                <div style={style} 
                  className="productNameDisplay"
                  onClick={(e) => {
                    // console.log(e)
                    if (readOnly) orderLockedOverlay.current.toggle(e)
                    else if (inProduction) inProductionOverlay.current.toggle(e)
                  }} 
                  aria-haspopup 
                  aria-controls="overlay_panel"
                >
                  {rowData.prodName + (changeDetected ? "*" : "")}
                  {inProduction && 
                    <i id="order-table-info-icon" className="pi pi-info-circle" style={{'fontSize': '1em', marginLeft: "10px"}}></i>
                  }
                </div>
                <OverlayPanel 
                  ref={inProductionOverlay}
                  style={{maxWidth: "400px", margin: "10px"}}
                  id="in-production-overlay"
                >
                  <h2>In Production</h2>
                  <p>Order adjustments are capped at the amount recorded at daily 6:00pm changeovers.</p>
                  <p><b>Reductions and cancellations will not be reversible after the next 6:00pm changeover.</b></p>

                </OverlayPanel>

                <OverlayPanel 
                  ref={orderLockedOverlay}
                  style={{maxWidth: "400px", margin: "10px"}}
                  id="locked-overlay"
                >
                  <h2>Delivery Date Reached</h2>
                  <p>Final production day is complete. Order is no longer editable.</p>

                </OverlayPanel>

              </div>
            )
          }}
        />
        <Column header="Qty" 
          field="_qty"
          style={{width: "80px"}}
          body={qtyInputTemplate}
        />
      </DataTable>

    </Card>
  )
}

