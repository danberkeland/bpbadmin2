import React, { useRef } from "react"
import { useSWRConfig } from "swr"
import { API } from "aws-amplify"

import { Button } from "primereact/button"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"
import { Toast } from "primereact/toast"

import { fetcher } from "./fetcher"



function ButtonArray({table, form, itemSchema}) {

return (
  <>
    <Button label="Create New" 
      onClick={() => form.setViewMode("CREATE")} />
    <Button label="View" 
      onClick={() => form.setViewMode("VIEW")} 
      disabled={!table.selected[itemSchema.meta().idField]} />
    <Button label="Edit" 
      onClick={() => form.setViewMode("EDIT")} 
      disabled={!table.selected[itemSchema.meta().idField]} />
    <DeleteButton table={table} 
      itemSchema={itemSchema} />
  </>
)

}

export default ButtonArray



const DeleteButton = ({ table, itemSchema }) => {
  const { mutate } = useSWRConfig()
  const toast = useRef(null)

  const deletePath = itemSchema.meta().deletePath
  const idField = itemSchema.meta().idField
  const body = Object.fromEntries([[idField, table.selected ? table.selected[idField] : null]])

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
        API.post('bpbrpc', deletePath, {body: body}) 
        mutate(itemSchema.meta().listPath)

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
        onClick={(e) => confirm(e, table.selected[idField])}
        icon="pi pi-trash"  
        className="p-button-danger p-button-outlined" 
        disabled={!table.selected[idField]}
      />
      <ConfirmPopup />
    </>
  )

}