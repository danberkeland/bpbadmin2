import React from "react"
import { Formik } from "formik"

import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { InputNumber } from "primereact/inputnumber"
import { Checkbox } from "primereact/checkbox"
import { classNames } from "primereact/utils"
import { Dropdown } from "primereact/dropdown"
import { MultiSelect } from 'primereact/multiselect'

import { API } from "aws-amplify"
import { useSWRConfig } from "swr"

function ItemFormFC({ form, itemSchema, initialValues, submitPath, mutateSwrKeys}) {
  const { mutate } = useSWRConfig()

  if (!initialValues) return (
    <Dialog visible={true}>Loading...</Dialog>
  )

  // convert nulls to empty string to avoid warnings
  const formValues = Object.fromEntries(Object.entries(initialValues).map(([k, v]) => [k, v === null ? "" : v]))

  // conditional text/formatting values
  let header, cancelLabel, submitLabel
  switch(form.viewMode){
    case "VIEW":
      header = `Details for "${formValues[itemSchema.meta().idField]}"`
      cancelLabel = "Close"
      submitLabel = ""
      break
    case "CREATE":
      header = "New Product"
      cancelLabel = "Cancel"
      submitLabel = "Create"
      break
    case "EDIT":
      header = `Editing "${formValues[itemSchema.meta().idField]}"`
      cancelLabel = "Cancel"
      submitLabel = "Confirm Edit"
      break
    default:
      console.log("Unrecognized viewType.")
  }

  const submitApiFunction = async (values) => {
    console.log("submitting to DDB...")
    const response = await API.post('bpbrpc', submitPath, {body: values})
    console.log ("API Gateway response:", response)
    mutateSwrKeys.forEach(key => mutate(key))

    return response  
  }

  return (

    <Formik
      initialValues={formValues}
      validationSchema={itemSchema}
      onSubmit={async (values, { setSubmitting }) => {
        // remove empty/blank values for GraphQL mutation
        let cleanedValues = Object.fromEntries(Object.entries(values).filter( ([k, v]) => !!v === true))

        submitApiFunction(cleanedValues)

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

          <pre>{JSON.stringify(initialValues, null, 2)}</pre>
          {/* <pre>{JSON.stringify(itemSchema.fields["doughNick"].spec.meta.inputType, null, 2)}</pre> */}


          {Object.entries(itemSchema.fields).map( ([k,v]) => {
            const fieldName = k
            const fieldLabel = k
            const copy_v = {...v}
            const copy_spec = {...copy_v.spec}
            const copy_meta = {...copy_spec.meta}
            const inputType = copy_meta.inputType

            switch (inputType) {
              case "text":
                return (<TextField key={fieldName} name={fieldName} label={fieldLabel} viewMode={form.viewMode} formikProps={formikProps} isIDValue={k === itemSchema.meta().idField} />)

              case "integer":
                return (<NumberField key={fieldName} name={fieldName} label={fieldLabel} viewMode={form.viewMode} formikProps={formikProps} isIDValue={k === itemSchema.meta().idField} />)

              case "float":
                return (<DecimalField key={fieldName} name={fieldName} label={fieldLabel} viewMode={form.viewMode} formikProps={formikProps} isIDValue={k === itemSchema.meta().idField} />)

              case "bool":
                return (<CheckboxField key={fieldName} name={fieldName} label={fieldLabel} viewMode={form.viewMode} formikProps={formikProps} />)

              case "cat":
                return (<CategoryField key={fieldName} name={fieldName} label={fieldLabel} viewMode={form.viewMode} formikProps={formikProps} categories={copy_meta.options} />)

              case "multi-cat":
                return (<MultiCategoryField key={fieldName} name={fieldName} label={fieldLabel} viewMode={form.viewMode} formikProps={formikProps} categories={copy_meta.options} />)

              default:
                return (
                  <div key={fieldName}>
                    <div>{`Unsupported input type "${inputType}" for ${k}`}</div>
                    <pre>{JSON.stringify(initialValues[k], null, 2)}</pre>
                  </div>
                )
            }
            
          })}
          

        </Dialog>
      </form>
    )}
    </Formik>
  )
}

export default ItemFormFC



/*************************************************************
 * Form Fields to be programmatically rendered in ItemFormFC *
 *************************************************************/

function TextField({isIDValue, name, label, viewMode, formikProps}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name])
  const isFormFieldDisabled = (viewMode === "VIEW") || (viewMode === "EDIT" && isIDValue)

  return (
    <div key={name} className="field" style={{ marginTop: "0.8em" }}>

          <div style={{ display: "block", fontSize: "0.8em" }}>
          <label 
            htmlFor={name}
            className={ classNames({ 'p-error': isFormFieldValid }) }
          >
            {label}
          </label>
          </div>

          <div style={{ display: "block" }}>
          <InputText
            key={name}
            id={name} 
            name={name} 
            value={formikProps.values[name]} 
            onChange={formikProps.handleChange} 
            className={ classNames({ 'p-invalid': isFormFieldValid }) }
            disabled={isFormFieldDisabled}
          />
          </div>

      {isFormFieldValid && <small className="p-error">{formikProps.errors[name]}</small>}
    </div>
  )
}


function NumberField({isIDValue, name, label, viewMode, formikProps}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name]);
  const isFormFieldDisabled = (viewMode === "VIEW") || (viewMode === "EDIT" && isIDValue)

  return (
    <div key={name} className="field" style={{ marginTop: "0.8em" }}>

          <div style={{ display: "block", fontSize: "0.8em" }}>
          <label 
            htmlFor={name}
            className={ classNames({ 'p-error': isFormFieldValid }) }
          >
            {label}
          </label>
          </div>

          <div style={{ display: "block" }}>
          <InputNumber
            key={name}
            id={name} 
            name={name} 
            value={formikProps.values[name]} 
            onChange={e => formikProps.setFieldValue(name, e.value)}
            className={ classNames({ 'p-invalid': isFormFieldValid }) }
            disabled={isFormFieldDisabled}
          />
          </div>

      {isFormFieldValid && <small className="p-error">{formikProps.errors[name]}</small>}
    </div>
  )
}



function DecimalField({isIDValue, name, label, viewMode, formikProps}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name]);
  const isFormFieldDisabled = (viewMode === "VIEW") || (viewMode === "EDIT" && isIDValue)

  return (
    <div key={name} className="field" style={{ marginTop: "0.8em" }}>

          <label 
            htmlFor={name}
            style={{ display: "block", fontSize: "0.8em" }}
            className={ classNames({ 'p-error': isFormFieldValid }) }
          >
            {label}
          </label>

          <div style={{ display: "block" }}>
          <InputNumber
            key={name}
            id={name} 
            name={name} 
            value={formikProps.values[name]}
            mode="decimal"
            maxFractionDigits={2}
            onChange={e => formikProps.setFieldValue(name, e.value)}
            className={ classNames({ 'p-invalid': isFormFieldValid }) }
            disabled={isFormFieldDisabled}
          />
          </div>

      {isFormFieldValid && <small className="p-error">{formikProps.errors[name]}</small>}
    </div>
  )
}



function CheckboxField({name, label, viewMode, formikProps}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name]);

  return( 
    <div key={name} className="field-checkbox" style={{ marginTop: "0.8em" }}>

      <label 
        htmlFor={name} 
        style={{ display: "block", fontSize: "0.8em" }}
        className={ classNames({ 'p-error': isFormFieldValid }) }
      >
        {label}
      </label>
      <Checkbox 
        key={name}
        inputId={name}
        name={name}
        checked={formikProps.values[name]} 
        onChange={formikProps.handleChange} 
        className={classNames({ 'p-invalid': isFormFieldValid })} 
        disabled={viewMode === "VIEW"}
      />
      
    </div>
  )
}

function CategoryField({name, label, viewMode, formikProps, categories}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name]);

  return (
    <div key={name} className="field-category">
      <label 
        htmlFor={name} 
        style={{ display: "block", fontSize: "0.8em", marginTop: "0.8em" }}
        className={ classNames({ 'p-error': isFormFieldValid }) }
      >
        {label}
      </label>

      <Dropdown 
        key={name}
        id={name}  
        value={formikProps.values[name]} 
        options={categories} 
        onChange={formikProps.handleChange} 
        placeholder="N/A"
        disabled={viewMode === "VIEW"}
      />
    </div>
  )
}

export function MultiCategoryField({name, label, viewMode, formikProps, categories}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name]);

  return (
    <div key={name} className="field-category">
      <label 
        htmlFor={name} 
        style={{ display: "block", fontSize: "0.8em", marginTop: "0.8em" }}
        className={ classNames({ 'p-error': isFormFieldValid }) }
      >
        {label}
      </label>

      <MultiSelect
        key={name}
        id={name}  
        value={formikProps.values[name]} 
        options={categories}
        onChange={e => formikProps.setFieldValue(name, e.value)} 
        display="chip"
        placeholder="N/A"
        disabled={viewMode === "VIEW"}
      />
    </div>
  )
}
