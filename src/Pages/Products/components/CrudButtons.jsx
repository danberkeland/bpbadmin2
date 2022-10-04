import React, { useRef } from "react"

import { Button } from "primereact/button"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"
import { Toast } from "primereact/toast"
import { useProductsPageStore } from "./hooks"



export const DeleteButton = (props) => {
  const { table } = useProductsPageStore()
  const toast = useRef(null)

  const deleteRecord = (name) => {
    // API.post('bpbrc', /products/deleteProduct, {body: {prodNick: name}}) 
    // or wrap it in a SWR mutation...
    console.log("deleted", name)
  }

  const accept = () => {
      toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 })
      console.log("This is where we make an API request to delete")
      deleteRecord(table.selected.prodNick)
  };

  const reject = () => {
      toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
  };

  const confirm = (e, name) => {
    confirmPopup({
        target: e.currentTarget,
        message: `Do you want to delete the record for "${name}?"`,
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept,
        reject
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <Button 
        label="Delete" 
        onClick={(e) => confirm(e, table.selected.prodNick)}
        icon="pi pi-times"  
        className="p-button-danger p-button-outlined" 
        disabled={props.disabled}
      />
      <ConfirmPopup />
    </>
  )

}