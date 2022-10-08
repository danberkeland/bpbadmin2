import React from "react"

import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"


export function TextField({name, label, disabled=false, formikProps}) {

  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name]);

  return (
    <div className="field" style={{ marginTop: "0.8em" }}>
      {/* <span className="p-float-label"> */}

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
            disabled={disabled}
          />
          </div>

      {/* </span> */}
      {isFormFieldValid && <small className="p-error">{formikProps.errors[name]}</small>}
    </div>
  )
}

