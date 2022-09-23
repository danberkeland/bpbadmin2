import React from "react";
import { API } from "aws-amplify";
import { Button } from "primereact/button";

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';


import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';



// *************
// API Functions
// *************

// Products

const apitest_listProducts = async () => {
	console.log("Client calling resource bpbapi/products...");
	const data = await API.get("bpbapi", "/products");
	console.log(data);
};

const apitest_getProduct = async () =>  {
	console.log("Client calling resource bpbapi/products/{prodNick}...");
	const data = await API.get("bpbapi", "/products/bag");
	console.log(data)
};

const apitest_postProduct = async () =>  {
	console.log("Client calling resource bpbapi/products/{prodNick}...");
	const data = await API.post("bpbapi", "/products/bag");
	console.log(data)
};

const apitest_putProduct = async () =>  {
	console.log("Client calling resource bpbapi/products/{prodNick}...");
	const data = await API.put("bpbapi", "/products/bag");
	console.log(data)
};

const apitest_deleteProduct = async () =>  {
	console.log("Client calling resource bpbapi/products/{prodNick}...");
	const data = await API.del("bpbapi", "/products/bag");
	console.log(data)
};

const apitest_expressRpc = async () =>  {
	console.log("bpbrpc...");
	const data = await API.get("bpbrpc", "/locations");
	console.log(data)
};

// Locations


// Customers

// SCHEMA

const SignupSchema = Yup.object().shape({
	firstName: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	lastName: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	email: Yup.string().email('Invalid email').required('Required'),

});

// const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
// const getFormErrorMessage = (name) => {
// 		return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
// };

// ****************
// Return Component
// ****************

function AaaBackendTest() {

  return (
		<React.Fragment>
			<div>
				<div>
					<Button label="List Products" onClick={apitest_listProducts} />
					<Button label="Get Product" onClick={apitest_getProduct} />
					<Button label="Post Product" onClick={apitest_postProduct} />
					<Button label="Put Product" onClick={apitest_putProduct} />
					<Button label="Delete Product" onClick={apitest_deleteProduct} />
				</div>
				<div>
					<Button label="List Locations" />
					<Button label="Get Location" />
					<Button label="Post Location" />
					<Button label="Put Location" />
					<Button label="Delete Location" />
				</div>
				<div>
					<Button label="List Customers" />
					<Button label="Get Customer" />
					<Button label="Post Customer" />
					<Button label="Put Customer" />
					<Button label="Delete Customer" />
				</div>
				<div>
					<Button label="Call Express Lambda" onClick={apitest_expressRpc} />
				</div>
			</div>
			<div>
				<h1>Signup</h1>
				<Formik
					initialValues={{
						firstName: '',
						lastName: '',
						email: '',
					}}
					validationSchema={SignupSchema}
					onSubmit={values => {
						// same shape as initial values
						console.log(values);
					}}
				>
					{({ errors, touched, values, handleChange }) => (
						<Form>

							<Field name="firstName" />
							{errors.firstName && touched.firstName ? (
								<div>{errors.firstName}</div>
							) : null}

							<Field name="lastName" />
							{errors.lastName && touched.lastName ? (
								<div>{errors.lastName}</div>
							) : null}

							<Field name="email" type="email">
							<div className="field">
									<span className="p-float-label p-input-icon-right">
											<i className="pi pi-envelope" />
											{/* <InputText id="email" name="email" value={values.email} onChange={handleChange} className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
											<label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Email*</label> */}
									</span>
									{/* {getFormErrorMessage('email')} */}
							</div>
							</Field>
							{errors.email && touched.email ? <div>{errors.email}</div> : null}
							<button type="submit">Submit</button>

						</Form>
					)}
				</Formik>
			</div>
		</React.Fragment>
	);
};

export default AaaBackendTest;
