import React, { useEffect, useState } from "react";
import { useFormik } from 'formik'
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";

import * as Yup from "yup";

export const LocationForm = (props) => {
	const [showMessage, setShowMessage] = useState(false);
	const [formData, setFormData] = useState({});

	// INITIAL VALUES *****************************
	// 		emptyLocation for creating new
	// 		get props.location to edit/update existing

  const emptyLocation = {
    locNick: "",
    locName: "",
    zoneNick: "",
    addr1: "",
    addr2: "",
    city: "",
    zip: "",
    email: "",
    phone: "",
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
  };

  let initialValues = props.location ? props.location : emptyLocation;
	
	// VALIDATION SCHEMA **************************

  const optionalString = Yup.string().optional().nullable();
  const deliveryTime = Yup.number()
    .optional().nullable()
    .min(0)
    .max(24);
    // .test(
    //   "maxDigitsAfterDecimal",
    //   "number field must have 2 digits after decimal or less",
    //   (number) => /^\d+(\.\d{1,2})?$/.test(number)
    // );

  let locationSchema = Yup.object({
    locNick: Yup.string().required(),
    locName: optionalString,
    zoneNick: optionalString,
    addr1: optionalString,
    addr2: optionalString,
    city: optionalString,
    zip: optionalString,
    email: optionalString.email(),
    phone: optionalString,
    toBePrinted: Yup.bool().optional(),
    toBeEmailed: Yup.bool().optional(),
    printDuplicate: Yup.bool().optional(),
    terms: optionalString,
    invoicing: optionalString,
    latestFirstDeliv: deliveryTime,
    latestFinalDeliv: deliveryTime,
    webpageURL: optionalString.url(),
    picURL: optionalString.url(),
    gMap: optionalString,
    specialInstructions: optionalString,
    delivOrder: Yup.number().optional().nullable().positive().integer(),
    qbID: optionalString,
    createdAt: Yup.mixed().optional(),
    updatedAt: Yup.mixed().optional(),
  });

	let apiPath;
	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: locationSchema,
		onSubmit: (data) => {
			console.log(`'Submitting' data to API path ${props.apiPath}`, data);
			props.hideForm();
		}
	});

	const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

	const getFormErrorMessage = (name) => {
			return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
	};

	/*************
	 * MAIN FORM *
	 *************/

  return (
		<div className="form-demo">
		<div className="flex justify-content-center">
			<div className="card">
				<h5 className="text-center">Register</h5>
				<form onSubmit={formik.handleSubmit} className="p-fluid">

					<div className="field">
						<span className="p-float-label">
								<InputText id="locNick" name="locNick" value={formik.values.locNick} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('locNick') })} />
								<label htmlFor="locNick" className={classNames({ 'p-error': isFormFieldValid('locNick') })}>Location Nickname*</label>
						</span>
						{getFormErrorMessage('locNick')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="locName" name="locName" value={formik.values.locName} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('locName') })} />
								<label htmlFor="locName" className={classNames({ 'p-error': isFormFieldValid('locName') })}>Location Full Name</label>
						</span>
						{getFormErrorMessage('locName')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="zoneNick" name="zoneNick" value={formik.values.zoneNick} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('zoneNick') })} />
								<label htmlFor="zoneNick" className={classNames({ 'p-error': isFormFieldValid('zoneNick') })}>Zone Nickname</label>
						</span>
						{getFormErrorMessage('zoneNick')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="addr1" name="addr1" value={formik.values.addr1} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('addr1') })} />
								<label htmlFor="addr1" className={classNames({ 'p-error': isFormFieldValid('addr1') })}>Address1</label>
						</span>
						{getFormErrorMessage('addr1')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="addr2" name="addr2" value={formik.values.addr2} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('addr2') })} />
								<label htmlFor="addr2" className={classNames({ 'p-error': isFormFieldValid('addr2') })}>Address2</label>
						</span>
						{getFormErrorMessage('addr2')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="city" name="city" value={formik.values.city} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('city') })} />
								<label htmlFor="city" className={classNames({ 'p-error': isFormFieldValid('city') })}>City</label>
						</span>
						{getFormErrorMessage('city')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="zip" name="zip" value={formik.values.zip} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('zip') })} />
								<label htmlFor="zip" className={classNames({ 'p-error': isFormFieldValid('zip') })}>Zip</label>
						</span>
						{getFormErrorMessage('zip')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="email" name="email" value={formik.values.email} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
								<label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>email</label>
						</span>
						{getFormErrorMessage('email')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="phone" name="phone" value={formik.values.phone} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('phone') })} />
								<label htmlFor="phone" className={classNames({ 'p-error': isFormFieldValid('phone') })}>phone</label>
						</span>
						{getFormErrorMessage('phone')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="webpageURL" name="webpageURL" value={formik.values.webpageURL} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('webpageURL') })} />
								<label htmlFor="webpageURL" className={classNames({ 'p-error': isFormFieldValid('webpageURL') })}>webpageURL</label>
						</span>
						{getFormErrorMessage('webpageURL')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="picURL" name="picURL" value={formik.values.picURL} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('picURL') })} />
								<label htmlFor="picURL" className={classNames({ 'p-error': isFormFieldValid('picURL') })}>picURL</label>
						</span>
						{getFormErrorMessage('picURL')}
					</div>
	
					<div style={{ "margin-bottom": "25px" }}>
						<div className="field-checkbox">
							<Checkbox inputId="toBePrinted" name="toBePrinted" checked={formik.values.toBePrinted} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('toBePrinted') })} />
							<label htmlFor="toBePrinted" className={classNames({ 'p-error': isFormFieldValid('toBePrinted') })}>To Be Pritnted</label>
						</div>

						<div className="field-checkbox">
							<Checkbox inputId="toBeEmailed" name="toBeEmailed" checked={formik.values.toBeEmailed} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('toBeEmailed') })} />
							<label htmlFor="toBeEmailed" className={classNames({ 'p-error': isFormFieldValid('toBeEmailed') })}>To Be Emailed</label>
						</div>

						<div className="field-checkbox">
							<Checkbox inputId="printDuplicate" name="printDuplicate" checked={formik.values.printDuplicate} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('printDuplicate') })} />
							<label htmlFor="printDuplicate" className={classNames({ 'p-error': isFormFieldValid('printDuplicate') })}>Print Duplicate</label>
						</div>
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="terms" name="terms" value={formik.values.terms} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('terms') })} />
								<label htmlFor="terms" className={classNames({ 'p-error': isFormFieldValid('terms') })}>terms</label>
						</span>
						{getFormErrorMessage('terms')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="invoicing" name="invoicing" value={formik.values.invoicing} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('invoicing') })} />
								<label htmlFor="invoicing" className={classNames({ 'p-error': isFormFieldValid('invoicing') })}>invoicing</label>
						</span>
						{getFormErrorMessage('invoicing')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputNumber maxFractionDigits={2} id="latestFirstDeliv" name="latestFirstDeliv" value={formik.values.latestFirstDeliv} onValueChange={e => {formik.setFieldValue('latestFirstDeliv', e.target.value)}} className={classNames({ 'p-invalid': isFormFieldValid('latestFirstDeliv') })} />
								<label htmlFor="latestFirstDeliv" className={classNames({ 'p-error': isFormFieldValid('latestFirstDeliv') })}>latestFirstDeliv</label>
						</span>
						{getFormErrorMessage('latestFirstDeliv')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputNumber maxFractionDigits={2} id="latestFinalDeliv" name="latestFinalDeliv" value={formik.values.latestFinalDeliv} onValueChange={e => {formik.setFieldValue('latestFinalDeliv', e.target.value)}} className={classNames({ 'p-invalid': isFormFieldValid('latestFinalDeliv') })} />
								<label htmlFor="latestFinalDeliv" className={classNames({ 'p-error': isFormFieldValid('latestFinalDeliv') })}>latestFinalDeliv</label>
						</span>
						{getFormErrorMessage('latestFinalDeliv')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="gMap" name="gMap" value={formik.values.gMap} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('gMap') })} />
								<label htmlFor="gMap" className={classNames({ 'p-error': isFormFieldValid('gMap') })}>gMap</label>
						</span>
						{getFormErrorMessage('gMap')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="specialInstructions" name="specialInstructions" value={formik.values.specialInstructions} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('specialInstructions') })} />
								<label htmlFor="specialInstructions" className={classNames({ 'p-error': isFormFieldValid('specialInstructions') })}>specialInstructions</label>
						</span>
						{getFormErrorMessage('specialInstructions')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputNumber id="delivOrder" name="delivOrder" value={formik.values.delivOrder} onValueChange={e => {formik.setFieldValue('delivOrder', e.target.value)}} className={classNames({ 'p-invalid': isFormFieldValid('delivOrder') })} />
								<label htmlFor="delivOrder" className={classNames({ 'p-error': isFormFieldValid('delivOrder') })}>delivOrder</label>
						</span>
						{getFormErrorMessage('delivOrder')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="qbID" name="qbID" value={formik.values.qbID} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('qbID') })} />
								<label htmlFor="qbID" className={classNames({ 'p-error': isFormFieldValid('qbID') })}>qbID</label>
						</span>
						{getFormErrorMessage('qbID')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="createdAt" name="createdAt" value={formik.values.createdAt} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('createdAt') })} disabled />
								<label htmlFor="createdAt" className={classNames({ 'p-error': isFormFieldValid('createdAt') })}>createdAt</label>
						</span>
						{getFormErrorMessage('createdAt')}
					</div>

					<div className="field">
						<span className="p-float-label">
								<InputText id="updatedAt" name="updatedAt" value={formik.values.updatedAt} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('updatedAt') })} disabled />
								<label htmlFor="updatedAt" className={classNames({ 'p-error': isFormFieldValid('updatedAt') })}>updatedAt</label>
						</span>
						{getFormErrorMessage('updatedAt')}
					</div>

					<Button type="submit" label="Submit" className="mt-2" />
					<Button label="Cancel" classname="mt-2" onClick={props.hideForm}/>

				</form>
			</div>
		</div>	
		</div>
	);
};