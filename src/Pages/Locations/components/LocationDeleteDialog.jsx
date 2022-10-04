import React from "react"

import { useLocationStore, useLocation, useLocationList } from './hooks'

import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { API } from "aws-amplify"

function LocationDeleteDialog() {
  const { form, table } = useLocationStore()
  const key = table.selected ? table.selected.locNick : null
	const { location } = useLocation(key)
  const { locationList } = useLocationList()
  
  if (location.isLoading) return <div>Loading...</div>
  if (location.isError) return <div>Form Failed to Load</div>

  return (
    <Dialog
      visible
      header="Delete Location?"
      style={{ width: '450px' }}
      modal
      className="p-fluid"
      onHide={() => form.setViewType("HIDDEN")}  
      footer={
        <>
          <Button label="Cancel" icon="pi pi-times" className="p-button-text" 
            onClick={() => form.setViewType("HIDDEN")} 
          />
          <Button label="Confirm Delete" icon="pi pi-trash" className="p-button-text" 
            onClick={async () => {
              const response = await API.post('bpbrpc', '/locations/deleteLocation', {body: {locNick: table.selected.locNick}})
              console.log("Response from Lambda :", response)
              locationList.revalidate()
              form.setViewType("HIDDEN")
            }} 
          />
        </>
      }
    >
      <pre>{JSON.stringify(location.data, null, 2)}</pre>
    </Dialog>
  )
}

export default LocationDeleteDialog