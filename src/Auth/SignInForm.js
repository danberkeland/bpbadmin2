import React, { useState, useContext } from "react"
import { SettingsContext } from "../Contexts/SettingsContext";

import { Auth } from "aws-amplify"
import { Formik } from "formik"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { classNames } from "primereact/utils"
import "./Splash.css"

import { CenteredContainer, Title } from "../CommonStyles";

import * as Yup from 'yup'

const signInSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required()
})

const EmailField = ({name, label, formikProps}) => {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name])
  
  return (
    <div className="field">
      <span className="p-float-label p-input-icon-right">
        <i className="pi pi-envelope" />  
        <InputText
          id={name} 
          name={name} 
          value={formikProps.values[name]} 
          onChange={formikProps.handleChange} 
          className={ classNames({ 'p-invalid': isFormFieldValid }) }
        />
        <label
          htmlFor={name}
          className={classNames({
          "p-error": isFormFieldValid,
          })}
          >
          {label}
        </label>
      </span>
    </div>
  )
}

const PasswordField = ({name, label, formikProps}) => {
  const isFormFieldValid = !!(formikProps.touched[name] && formikProps.errors[name])
  
  return (
    <div className="field">
        <span className="p-float-label">
          <Password
            id={name}
            name={name}
            value={formikProps.values[name]} 
            onChange={e => formikProps.setFieldValue(name, e.target.value)} 
            className={ classNames({ "p-invalid": isFormFieldValid }) }
            feedback={false}
            toggleMask
            />
          <label
            htmlFor={name}
            className={classNames({
              "p-error": isFormFieldValid,
            })}
            >
            {label}
          </label>
        </span>
      </div>

)
}


export const SignInForm = () => {
  const { formData, setFormType, setUser, setIsLoading } = useContext(SettingsContext)
  const [showMessage, setShowMessage] = useState(false)

  return (
    <>
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="top"
        // footer={dialogFooter}
        showHeader={false}
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "30vw" }}
      >
        <div className="flex align-items-center flex-column pt-6 px-3">
          <i
            className="pi pi-exclamation-circle"
            style={{ fontSize: "5rem", color: "var(--red-500)" }}
          ></i>
          <h5>Invalid Email or Password</h5>
          <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
            Please check email and password to make sure they are correct.
          </p>
        </div>
      </Dialog>

      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        validationSchema={signInSchema}
        onSubmit={async (values, { setSubmitting }) => {
          console.log("Submitting info:", values.email, values.password)
          await Auth.signIn(values.email, values.password)
            .then((use) => {
              if (use.challengeName === "NEW_PASSWORD_REQUIRED") {
                setUser(use)
                setFormType("resetPassword");
              }
            })
            .catch((error) => {
              if (error) {
                setShowMessage(true);
              }
            })
          
          setSubmitting(false)
        }}
      >
        { formikProps => (
          <CenteredContainer>
            <div className="form-demo">
              <div className="flex justify-content-center">
                <div className="card">
                  <Title>Sign In</Title>
                  <div>
                    Don't have an account?{" "}
                    {/* <Button className="p-button-text" onClick={() => {console.log("APPLY")}}>
                      APPLY NOW
                    </Button> */}
                  </div>
                    <form className="p-fluid" onSubmit={formikProps.handleSubmit}>
                      <EmailField name="email" label="Email*" formikProps={formikProps} />
                      <PasswordField name="password" label="Password*" formikProps={formikProps} />

                      <Button type="submit" label="Submit" className="mt-2" onSubmit={formikProps.handleSubmit} />
                      {/* <Button className="p-button-text">
                        Forgot your password?
                      </Button> */}
                    </form>
                    <pre>{JSON.stringify(formikProps.values)}</pre>
                </div>
              </div>
            </div>
          </CenteredContainer>
        )}
      </Formik>
    </>
  )
}
