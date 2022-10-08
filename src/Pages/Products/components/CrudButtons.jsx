import React, { useRef } from "react"

import { useProductsPageStore } from "./hooks"

import { Button } from "primereact/button"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"
import { Toast } from "primereact/toast"

export const CreateButton = () => {
  const { form } = useProductsPageStore()
  
  return(
    <Button 
      label="Create New"
      icon="pi pi-plus"
      onClick={() => form.setViewMode("CREATE")}
    />
  )
}



export const ViewButton = () => {
  const { form, table } = useProductsPageStore()

  return(
    <Button 
      label="View"
      icon="pi pi-align-left"
      onClick={() => form.setViewMode("VIEW")}
      disabled={!table.selected.prodNick}
    />
  )
}



export const EditButton = () => {
  const { form, table } = useProductsPageStore()

  return(
    <Button 
      label="Edit"
      icon="pi pi-pencil"
      onClick={() => form.setViewMode("EDIT")}
      disabled={!table.selected.prodNick}
    />
  )
}



export const DeleteButton = () => {
  const { table } = useProductsPageStore()
  const toast = useRef(null)

  const confirm = (e, name) => {
    confirmPopup({
      target: e.currentTarget,
      message: `Delete the record for "${name}?"`,
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        toast.current.show({ 
          severity: 'info', 
          summary: 'Confirmed', 
          detail: `Deleted ${name}.`, 
          life: 3000
        })
      // API.post('bpbrc', /products/deleteProduct, {body: {prodNick: name}}) 
      // or wrap it in a SWR mutation...

      },
      reject: () => {
        toast.current.show({
          severity: 'warn', 
          summary: 'Rejected', 
          detail: 'Action cancelled.', 
          life: 3000 
        })
      }
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <Button 
        label="Delete" 
        onClick={(e) => confirm(e, table.selected.prodNick)}
        icon="pi pi-trash"  
        className="p-button-danger p-button-outlined" 
        disabled={!table.selected.prodNick}
      />
      <ConfirmPopup />
    </>
  )

}