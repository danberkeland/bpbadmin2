import * as Yup from 'yup'

// Valid inputTypes are...
//
//	text
//	integer
//	float
//	bool
//	cat
//	multi-cat


const optString = Yup.string()
	.optional()
	.meta({inputType: "text"})
const optInteger = Yup.number()
	.integer()
	.optional()
	.min(0)
	.meta({inputType: "integer"})
const optFloat = Yup.number()
	.optional()
	.min(0)
	.meta({inputType: "number"})

/******************
 * Product Schema *
 ******************/

export const productSchema = Yup.object({
	prodNick: Yup.string().required().meta({inputType: "text"}),
	prodName: Yup.string().required().meta({inputType: "text"}),
	packGroup: optString,
	packSize: optInteger,
	doughNick: Yup.string().optional().meta({
		inputType: "cat",
		swrKey: "/doughs/listDoughs",
		options: [
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
	}),
	freezerThaw: Yup.bool()
		.default(false)
		.meta({inputType: "bool"}),
	packGroupOrder: optInteger,
	shapeDay: optInteger,
	shapeNick: optString,
	bakeDay: optString,
	bakeNick: optString,
	guarantee: optString,
	transferStage: optString,
	readyTime: optFloat,
	bakedWhere: Yup.array().of(Yup.string()).meta({
		inputType: "multi-cat",
		options: [
			{label: "Prado", value: "Prado"},
			{label: "Carlton", value: "Carlton"},
			{label: "Mixed", value:"Mixed"}
		]
	}),
	wholePrice: optFloat,
	retailPrice: optFloat,
	isWhole: Yup.boolean()
		.default(true)
		.meta({inputType: "bool"}),
	weight: optFloat,
	descrip: optString,
	picURL: optString,
	squareID: optString,
	forBake: optString,
	bakeExtra: optInteger,
	batchSize: optInteger,
	defaultInclude: Yup.boolean()
		.default(true)
		.meta({inputType: "bool"}),
	leadTime: optInteger,
	qbID: optString
}).meta({
	idField: "prodNick",
	nameField: "prodName",
	getPath: "/products/getProduct",
	listPath: "/products/listProducts",
	createPath: "/products/createProduct",
	updatePath: "/products/updateProduct",
	deletePath: "/products/deleteProduct"
})



/*******************
 * Location Schema *
 *******************/

const deliveryTime = Yup.number()
	.optional().nullable()
	.min(0)
	.max(24)
	.default(1.5)
	.meta({inputType: "float"})
 
export const locationSchema = Yup.object({
	locNick: Yup.string()
		.required()
		.meta({inputType: "text"}),
	locName: optString,
	zoneNick: optString,
	addr1: optString,
	addr2: optString,
	city: optString,
	zip: optString,
	email: optString.email(),
	phone: optString,
	toBePrinted: Yup.bool()
		.default(false)
		.meta({inputType: "bool"}),
	toBeEmailed: Yup.bool()
		.default(false)
		.meta({inputType: "bool"}),
	printDuplicate: Yup.bool()
		.default(false)
		.meta({inputType: "bool"}),
	terms: optString,
	invoicing: optString,
	latestFirstDeliv: deliveryTime,
	latestFinalDeliv: deliveryTime,
	delivOrder: optInteger
		.default(10),
	webpageURL: optString
		.url()
		.meta({inputType: "text"}),
	picURL: optString
		.url()
		.meta({inputType: "text"}),
	gMap: optString,
	specialInstructions: optString,
	qbID: optString,
	createdAt: Yup.mixed()
		.optional()
		.meta({inputType: "text"}),
	updatedAt: Yup.mixed()
		.optional()
		.meta({inputType: "text"}),
}).meta({
	idField: "locNick",
	nameField: "locName",
	getPath: "/locations/getLocation",
	listPath: "/locations/listLocations",
	createPath: "/locations/createLocation",
	updatePath: "/locations/updateLocation",
	deletePath: "/locations/deleteLocation"
})
 



/****************
 * Dough Schema *
 ****************/

export const doughSchema = Yup.object({
	doughNick: Yup.string()
		.required()
		.meta({
			inputType: "text"
		}),
	doughName: Yup.string()
		.required()
		.meta({
			inputType: "text"
		}),
	hydration: Yup.number()
	.min(0).max(200)
		.meta({
			inputType: "float"
		}),
	batchSize: Yup.number()
		.min(0)
		.meta({
			inputType: "float"
		}),
	mixedWhere: Yup.string()
		.meta({
			inputType: "cat",
			options: [
				{label: "Prado", value: "Prado"},
				{label: "Carlton", value: "Carlton"},
				{label: "Mixed", value:"Mixed"}
			]
		}),
	isBakeReady: Yup.bool()
		.default(false)
		.meta({
			inputType: "bool"
		}),
	buffer: Yup.number()
		.min(0)
		.meta({
			inputType: "float"
		}),
	saltInDry: Yup.bool()
		.meta({
			inputType: "bool"
		})
}).meta({
	idField: "doughNick",
	nameField: "doughName",
	getPath: "/doughs/getDough",
	listPath: "/doughs/listDoughs",
	createPath: "/doughs/createDough",
	updatePath: "/doughs/updateDough",
	deletePath: "/doughs/deleteDough"
})









// Model Crud Table with Yup Schema
	// include metadata on fields to decide
	// 		type of input field
	//
	// For categorical data, provide an object list
	// or an SWR key to fetch data
	//
	// empty item will be generated from schema defaults
	// (or lack thereof)
	//
	// Future idea: programmatically decide which
	// type of input to use based on type.

	// const doughSchema = Yup.object({
	// 	doughNick: Yup.string()
	// 		.required()
	// 		.meta({
	// 			inputType: "text"
	// 		}),
	// 	doughName: Yup.string()
	// 		.required()
	// 		.meta({
	// 			inputType: "text"
	// 		}),
	// 	hydration: Yup.number()
	// 	.min(0).max(200)
	// 		.meta({
	// 			inputType: "float"
	// 		}),
	// 	batchSize: Yup.number()
	// 		.min(0)
	// 		.meta({
	// 			inputType: "float"
	// 		}),
	// 	mixedWhere: Yup.string()
	// 		.meta({
	// 			inputType: "cat",
	// 			options: [
	// 				{label: "Prado", value: "Prado"},
	// 				{label: "Carlton", value: "Carlton"},
	// 				{label: "Mixed", value:"Mixed"}
	// 			]
	// 		}),
	// 	isBakeReady: Yup.bool()
	// 		.default(false)
	// 		.meta({
	// 			inputType: "bool"
	// 		}),
	// 	buffer: Yup.number()
	// 		.min(0)
	// 		.meta({
	// 			inputType: "float"
	// 		}),
	// 	saltInDry: Yup.bool()
	// 		.meta({
	// 			inputType: "bool"
	// 		})
	// }).meta({
	// 	idField: "doughNick",
	// 	nameField: "doughName",
	// 	getPath: "/doughs/getDough",
	// 	listPath: "/doughs/listDoughs",
	// 	createPath: "/doughs/createDough",
	// 	updatePath: "/doughs/updateDough",
	// 	deletePath: "/doughs/deleteDough"
	// })