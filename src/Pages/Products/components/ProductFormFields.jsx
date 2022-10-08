import React from "react";

import { InputText } from "primereact/inputtext"
import { InputNumber } from "primereact/inputnumber"
import { Checkbox } from "primereact/checkbox"
import { classNames } from "primereact/utils"
import { Dropdown } from "primereact/dropdown"
import { MultiSelect } from 'primereact/multiselect'

export function TextField({isIDValue, name, label, viewMode, formikProps}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name])
  const isFormFieldDisabled = (viewMode === "VIEW") || (viewMode === "EDIT" && isIDValue)

  return (
    <div className="field" style={{ marginTop: "0.8em" }}>

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



export function NumberField({isIDValue, name, label, viewMode, formikProps}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name]);
  const isFormFieldDisabled = (viewMode === "VIEW") || (viewMode === "EDIT" && isIDValue)

  return (
    <div className="field" style={{ marginTop: "0.8em" }}>

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



export function DecimalField({isIDValue, name, label, viewMode, formikProps}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name]);
  const isFormFieldDisabled = (viewMode === "VIEW") || (viewMode === "EDIT" && isIDValue)

  return (
    <div className="field" style={{ marginTop: "0.8em" }}>

          <label 
            htmlFor={name}
            style={{ display: "block", fontSize: "0.8em" }}
            className={ classNames({ 'p-error': isFormFieldValid }) }
          >
            {label}
          </label>

          <div style={{ display: "block" }}>
          <InputNumber
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



export function CheckboxField({name, label, viewMode, formikProps}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name]);

  return( 
    <div className="field-checkbox" style={{ marginTop: "0.8em" }}>

      <label 
        htmlFor={name} 
        style={{ display: "block", fontSize: "0.8em" }}
        className={ classNames({ 'p-error': isFormFieldValid }) }
      >
        {label}
      </label>
      <Checkbox 
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

export function CategoryField({name, label, viewMode, formikProps, categories}) {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name]);

  return (
    <div className="field-category">
      <label 
        htmlFor={name} 
        style={{ display: "block", fontSize: "0.8em", marginTop: "0.8em" }}
        className={ classNames({ 'p-error': isFormFieldValid }) }
      >
        {label}
      </label>

      <Dropdown 
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
    <div className="field-category">
      <label 
        htmlFor={name} 
        style={{ display: "block", fontSize: "0.8em", marginTop: "0.8em" }}
        className={ classNames({ 'p-error': isFormFieldValid }) }
      >
        {label}
      </label>

      <MultiSelect
        id={name}  
        value={formikProps.values[name]} 
        options={categories} 
        onChange={formikProps.handleChange} 
        display="chip"
        placeholder="N/A"
        disabled={viewMode === "VIEW"}
      />
    </div>
  )
}
