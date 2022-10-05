import * as yup from "yup"

export const validationSchema = yup.object().shape({
    prodNick: yup
        .string()
        .matches(/^[a-z]+$/, "must contain only lowercase letters")
        .min(2, "Product ID must have at least 2 characters")
        .notOneOf(['bag','pl','ch'], 'This ID is already taken.')
        .required("Required")
})

