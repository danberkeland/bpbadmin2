import React from 'react'

// State Management
import { useLocationStore, useLocation, useLocationList } from './hooks'
import { Formik } from 'formik'

// Validation
import { locationSchema } from './formSchema'

// Components
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import { TextField } from './LocationFormInputTemplates'
import { API } from 'aws-amplify'

/******************
 * Main Component *
 ******************/

function LocationForm() {
  const { form, table } = useLocationStore()
  const key = table.selected ? table.selected.locNick : null
	const { location } = useLocation(key)
  const { locationList } = useLocationList()

  /**********
   * Render *
   **********/

	if (location.isLoading) return <div>Loading...</div>
  if (location.isError) return <div>Form Failed to Load</div>

	return (
    <Formik
      initialValues={location.data}
      validationSchema={locationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        // remove attributes that are falsy (null, "", etc...)
        let cleanedValues = Object.fromEntries(Object.entries(values).filter( ([k, v]) => !!v === true))
        let response
        switch(form.viewType) {  
          case "EDIT":
            response = await API.post('bpbrpc', '/locations/updateLocation', {body: cleanedValues})
            location.revalidate()
            locationList.revalidate()
            break
          case "CREATE":
            response = await API.post('bpbrpc', '/locations/createLocation', {body: cleanedValues})
            locationList.revalidate()
            break
          default:
            console.log("Error: unrecognized form type.")
        }

        console.log("Response from Lambda: ", response)
        setSubmitting(false)
        form.setViewType("HIDDEN")
      }}
    >
      { formikProps => (
        <form onSubmit={formikProps.handleSubmit}>
          <Dialog 
            visible
            style={{ width: '450px' }}
            header="Location"
            modal
            className="p-fluid"
            onHide={() => form.setViewType("HIDDEN")}
            footer={
              <>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => form.setViewType("HIDDEN")} />
                {form.viewType === "EDIT" && <Button label="Save" icon="pi pi-check" className="p-button-text" type="submit" onClick={formikProps.handleSubmit} />}
                {form.viewType === "CREATE" && <Button label="Create" icon="pi pi-check" className="p-button-text" type="submit" onClick={formikProps.handleSubmit} />}
              </>
            }
          >
            <pre>{JSON.stringify(location.data, null, 2)}</pre>
            <TextField name="locNick" label="Location NickName*" disabled={form.viewType !== "CREATE"} formikProps={formikProps} />
            <TextField name="locName" label="Location Full Name" disabled={form.viewType === "READ"} formikProps={formikProps} />
            <TextField name="addr1" label="Address Line 1" disabled={form.viewType === "READ"} formikProps={formikProps} />
            <TextField name="addr2" label="Address Line 2" disabled={form.viewType === "READ"} formikProps={formikProps} />
            <TextField name="city" label="City" disabled={form.viewType === "READ"} formikProps={formikProps} />
            <TextField name="zip" label="Zip" disabled={form.viewType === "READ"} formikProps={formikProps} />
            <TextField name="email" label="email" disabled={form.viewType === "READ"} formikProps={formikProps} />
            <TextField name="phone" label="Phone" disabled={form.viewType === "READ"} formikProps={formikProps} />

            <TextField name="zoneNick" label="Zone Nickname" disabled={form.viewType === "READ"} formikProps={formikProps} />
            {/* <pre>{JSON.stringify(location.data, null, 2)}</pre> */}
          
            {/*
            **Remaining Fields**
            **Todo: make input components for numeric, boolean types
            
            toBePrinted: false,
            toBeEmailed: false,
            printDuplicate: false,
            terms: "",
            invoicing: "",
            latestFirstDeliv: null,
            latestFinalDeliv: null,
            webpageURL: "",
            picURL: "",
            gMap: "",
            specialInstructions: "",
            delivOrder: null,
            qbID: "",
            createdAt: "",
            updatedAt: "", 
            */}
          </Dialog>
          
        </form>
      )}
    </Formik>
	)
}

export default LocationForm
