import React from "react"
import useSWR, { useSWRConfig } from "swr"
import { fetchQuery, useProductsPageStore } from "./hooks"
import { Formik } from "formik"

import { emptyProduct, productSchema } from "./productSchema"

import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { NumberField, DecimalField, TextField, CheckboxField, CategoryField, MultiCategoryField } from "./ProductFormFields"
import { API } from "aws-amplify"

function ProductFormFC({ initialValues, mutator }) {
  const { form } = useProductsPageStore()

  if (!initialValues) return (
    <Dialog visible={true}>Loading...</Dialog>
  )

  // convert nulls to empty string to avoid warnings
  const formValues = Object.fromEntries(Object.entries(initialValues).map(([k, v]) => [k, v === null ? "" : v]))

  // conditional text/formatting values
  let header, cancelLabel, submitLabel
  switch(form.viewMode){
    case "VIEW":
      header = `Details for "${formValues.prodNick}"`
      cancelLabel = "Close"
      submitLabel = ""
      break
    case "CREATE":
      header = "New Product"
      cancelLabel = "Cancel"
      submitLabel = "Create"
      break
    case "EDIT":
      header = `Editing "${formValues.prodNick}"`
      cancelLabel = "Cancel"
      submitLabel = "Confirm Edit"
      break
    default:
      console.log("Unrecognized viewType.")
  }

  // TODO: REPLACE WITH API CALL
  const doughList = [
    {label: "Baguette", value:"bag"},
    {label: "Ciabatta", value:"cia"},
    {label: "Country", value:"ctr"},
    {label: "French", value:"fre"},
    {label: "Multi", value:"multi"},
    {label: "Pretzel Bun", value:"pretz"},
    {label: "Rye", value: "rye"},
    {label: "Other", value: "other"},
    {label: "N/A", value: null}
  ]

  // TODO: REPLACE WITH API CALL
  const bakeLocations = [
    {label: "Prado", value: "Prado"},
    {label: "Carlton", value: "Carlton"},
    {label: "Mixed", value: "Mixed"}
  ]

  return (

    <Formik
      initialValues={formValues}
      validationSchema={productSchema}
      onSubmit={async (values, { setSubmitting }) => {
        // remove attributes that are falsy (null, "", etc...)
        // let cleanedValues = Object.fromEntries(Object.entries(values).filter( ([k, v]) => !!v === true))

        mutator(values)
        // TODO: make API call/mutate
        console.log("SUBMITTED!")
        setSubmitting(false)
        form.setViewMode("HIDDEN")
      }}
    > 
    { formikProps => (
      <form onSubmit={formikProps.handleSubmit}>
        <Dialog 
          visible
          style={{ width: '450px' }}
          header={header}
          modal
          className="p-fluid"
          onHide={() => form.setViewMode("HIDDEN")}
          footer={
            <>
              <Button 
                label={cancelLabel}
                icon="pi pi-times" 
                className="p-button-text" 
                onClick={() => form.setViewMode("HIDDEN")} />
              {form.viewMode !== "VIEW" &&
                <Button 
                  label={submitLabel}
                  icon="pi pi-check" 
                  className="p-button-text"
                  type="submit"
                  onClick={formikProps.handleSubmit} />
              }
            </>
          }
        >   
          <pre>{JSON.stringify(formValues, null, 2)}</pre>
          <TextField name="prodNick" label="Product Nickname" isIDValue={true} viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="prodName" label="Product Full Name" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="packGroup" label="Pack Group" viewMode={form.viewMode} formikProps={formikProps} />
          <NumberField name="packSize" label="Pack Size" viewMode={form.viewMode} formikProps={formikProps} />

          {/* doughtNick string categorical -- query to get categories? */}
          <CategoryField name="doughNick" label="Dough nickName(ID)" viewMode={form.viewMode} formikProps={formikProps} categories={doughList} />

          <CheckboxField name="freezerThaw" label="Freezer Thaw" viewMode={form.viewMode} formikProps={formikProps} />
          <NumberField name="packGroupOrder" label="Pack Group Order" viewMode={form.viewMode} formikProps={formikProps} />
          <NumberField name="shapeDay" label="Shape Day" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="shapeNick" label="shapeNick" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="bakeDay" label="Bake Day" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="bakeNick" label="Nickname for bakers" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="guarantee" label="Guarantee" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="transferStage" label="Transfer Stage" viewMode={form.viewMode} formikProps={formikProps} />
          <DecimalField name="readyTime" label="Ready Time" viewMode={form.viewMode} formikProps={formikProps} />

          {/* bakedWhere multiselect, categorical */}
          <MultiCategoryField name="bakedWhere" label="Locations(s) Where Baked" viewMode={form.viewMode} formikProps={formikProps} categories={bakeLocations} />

          <DecimalField name="wholePrice" label="Wholesale Price" viewMode={form.viewMode} formikProps={formikProps} />
          <DecimalField name="reatilPrice" label="Retail Price" viewMode={form.viewMode} formikProps={formikProps} />
          <CheckboxField name="isWhole" label="isWhole" viewMode={form.viewMode} formikProps={formikProps} />
          <DecimalField name="weight" label="Weight" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="descrip" label="Description" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="picURL" label="Picture URL" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="squareID" label="Square ID" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="forBake" label="forBake" viewMode={form.viewMode} formikProps={formikProps} />
          <NumberField name="bakeExtra" label="bakeExtra" viewMode={form.viewMode} formikProps={formikProps} />
          <NumberField name="batchSize" label="batchSize" viewMode={form.viewMode} formikProps={formikProps} />
          <CheckboxField name="defaultInclude" label="Include by Default?" viewMode={form.viewMode} formikProps={formikProps} />
          <NumberField name="leadTime" label="Lead Time" viewMode={form.viewMode} formikProps={formikProps} />
          <TextField name="qbID" label="QuickBooks ID" viewMode={form.viewMode} formikProps={formikProps} />

          {/* For your Copy/Paste Convenience */}
          {/* 
            <TextField name="AAAAA" label="AAAAA" viewMode={form.viewMode} formikProps={formikProps} />
            <NumberField name="AAAAA" label="AAAAA" viewMode={form.viewMode} formikProps={formikProps} />
            <DecimalField name="AAAAA" label="AAAAA" viewMode={form.viewMode} formikProps={formikProps} />
            <CheckboxField name="AAAAA" label="AAAAA" viewMode={form.viewMode} formikProps={formikProps} /> 
          */}

        </Dialog>
      </form>
    )}
    </Formik>
  )
}




export const ViewForm = ({ prodNick }) => {
  const product = useSWR(`/products/getProduct?prodNick=${prodNick}`, fetchQuery, {revalidateIfStale: false})

  return (
    <ProductFormFC 
      initialValues={product.data}
    />
  )
}



export const EditForm = ({ prodNick }) => {
  const { mutate } = useSWRConfig()
  const product = useSWR(`/products/getProduct?prodNick=${prodNick}`, fetchQuery, {revalidateIfStale: false})

  const submitEdit = async (values) => {
    console.log("editing DDB record...")

    // remove empty/blank values for GraphQL mutation
    let cleanedValues = Object.fromEntries(Object.entries(values).filter( ([k, v]) => !!v === true))

    const response = await API.post('bpbrpc', '/products/updateProduct', {body: cleanedValues})
    console.log ("API Gateway response:", response)
    product.mutate(response)
    mutate('/products/listProducts')
    
  }

  return (
    <ProductFormFC 
      initialValues={product.data}
      mutator={submitEdit}
    />
  )
}



export const CreateForm = () => {
  const { mutate } = useSWRConfig()

  const submitCreate = async (values) => {
    console.log("creating DDB record...")

    // remove empty/blank values for GraphQL mutation
    let cleanedValues = Object.fromEntries(Object.entries(values).filter( ([k, v]) => !!v === true))
    
    const response = await API.post('bpbrpc', '/products/createProduct', {body: cleanedValues})
    console.log ("API Gateway response:", response)
    mutate('/products/listProducts')

  }

  return (
    <ProductFormFC 
      initialValues={emptyProduct}
      mutator={submitCreate}
    />
  )
}


