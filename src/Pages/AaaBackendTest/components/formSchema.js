import * as Yup from 'yup'
import { useFormik } from 'formik';

const optionalString = Yup.string().optional().nullable();
const deliveryTime = Yup.number()
  .optional().nullable()
  .min(0)
  .max(24);

export const locationSchema = Yup.object({
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
  delivOrder: Yup.number().optional().nullable().positive().integer(),
  webpageURL: optionalString.url(),
  picURL: optionalString.url(),
  gMap: optionalString,
  specialInstructions: optionalString,
  qbID: optionalString,
  createdAt: Yup.mixed().optional(),
  updatedAt: Yup.mixed().optional(),
});

export const emptyLocation = {
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
  latestFirstDeliv: 1.5,
  latestFinalDeliv: 1.5,
  delivOrder: 10,
  webpageURL: "",
  picURL: "",
  gMap: "",
  specialInstructions: "",
  qbID: "",
  createdAt: "",
  updatedAt: "",
};