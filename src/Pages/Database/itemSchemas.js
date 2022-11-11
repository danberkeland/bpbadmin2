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



/********
 * USER *
 ********/

const userSchema = Yup.object({
	sub: Yup.string() // String! @primaryKey
		.meta({inputType: "readOnly"}),
  name: Yup.string() // String!
		.required()
		.meta({inputType: "text"}), 
  email: Yup.string() // String!
		.required()
		.meta({inputType: "text"}), 
  phone: Yup.string() // String
		.meta({inputType: "text"}), 
  locNick: Yup.string() // String
		.meta({inputType: "text"})
}).meta({
	idField: "sub", // email???
	nameField: "name",
	getPath: "/users/getUsers",
	listPath: "/users/listUsers",
	createPath: "/users/createUser",
	updatePath: "/users/updateUser",
	deletePath: "/users/deleteUser"
})

// const immutable = Yup.

// input CreateUserInput {
//   name: String!
//   email: String!
//   phone: String
//   sub: String!
//   locNick: String
// }

// input UpdateUserInput {
//   name: String
//   email: String
//   phone: String
//   sub: String!
//   locNick: String
// }

// input DeleteUserInput {
//   sub: String!
// }

const orderSchema = Yup.object({
	id: Yup.string()
		.meta({
			inputType: "text",
			immutable: true,
			autogen: true
		}),
	qty: Yup.number().integer()
		.meta({
			inputType: "integer",
			immutable: true
		}),
	prodNick: Yup.string()
		.required()
		.meta({
			inputType: "text",
			immutable: false
		}),
	locNick: Yup.string()
		.required()
		.meta({
			inputType: "text"
		}),
	ItemNote: Yup.string()
		.meta({
			inputType: "text"
		}),
	SO: Yup.number().integer()
		.meta({
			inputType: "integer"
		}),
	isWhole: Yup.bool()
		.meta({
			inputType: "bool"
		}),
	delivDate: Yup.number()
		.meta({
			inputType: "float"
		})
})	

// inputType
// immutable



// 		Type: String
// 		id: ID

// 		qty: Int
// 		prodNick: String!
// 		locNick: String!
// 		ItemNote: String
// 		SO: Int
// 		isWhole: Boolean
// 		delivDate: String
// 		rate: Float
// 		isLate: Int
// 		createdOn: AWSDateTime

// 	id: ID!
// 	qty: Int
// 	prodNick: String! @index(name: "byProd")
// 	product: Product! @hasOne(fields: ["prodNick"])
// 	locNick: String! @index(name: "byLoc")
// 	location: Location! @hasOne(fields: ["locNick"])
// 	ItemNote: String
// 	SO: Int
// 	isWhole: Boolean
// 	delivDate: String
// 	rate: Float
// 	isLate: Int
// 	createdOn: AWSDateTime!

// })

// type Order @model (timestamps: { createdAt: "createdOn"})  {
//   Type: String
//     @default(value: "Orders")
//     @index(
//       name: "orderByCreatedAt"
//       queryField: "orderByCreatedAt"
//       sortKeyFields: ["createdOn"]
//     )
//   id: ID!
//   qty: Int
//   prodNick: String! @index(name: "byProd")
//   product: Product! @hasOne(fields: ["prodNick"])
//   locNick: String! @index(name: "byLoc")
//   location: Location! @hasOne(fields: ["locNick"])
//   ItemNote: String
//   SO: Int
//   isWhole: Boolean
//   delivDate: String
//   rate: Float
//   isLate: Int
//   createdOn: AWSDateTime!
// }


// type Standing @model {
//   id: ID!
//   qty: Int
//   prodNick: String!  @index(name: "byProd")
//   product: Product @hasOne(fields: ["prodNick"])
//   locNick: String! @index(name: "byLoc")
//   location: Location @hasOne(fields: ["locNick"])
//   ItemNote: String
//   isWhole: Boolean
//   isStand: Boolean
//   dayOfWeek: String
//   startDate: String!
//   endDate: String
  
// }


// type Zone @model {
//   zoneNick: String! @primaryKey
//   zoneName: String
//   description: String
//   zoneFee: Int
//   zoneRoute: [ZoneRoute] @hasMany(indexName: "byZone", fields: ["zoneNick"])
// }

// type Route @model {
//   routeNick: String! @primaryKey
//   routeName: String
//   routeStart: Float
//   routeTime: Float
//   RouteDepart: String
//   RouteArrive: String
//   RouteSched: [String]
//   printOrder: Int
//   driver: String
//   zoneRoute: [ZoneRoute] @hasMany(indexName: "byRoute", fields: ["routeNick"])
// }

// type PackGroup @model {
//   packGroupNick: String! @primaryKey
//   packGroup: String
// }

// type Dough @model {
//   doughNick: String! @primaryKey
//   doughName: String
//   hydration: Float
//   batchSize: Float
//   mixedWhere: String
//   buckets: [BucketInfo] @hasMany
//   isBakeReady: Boolean
//   buffer: Float
//   saltInDry: Boolean
// }

// type BucketInfo @model {
//   id: ID!
//   bucketType: String!
//   invId: ID
//   inventoryItem: Inventory @hasOne(fields: ["invId"])
//   doughNick: String
//   dough: Dough @hasOne(fields: ["doughNick"])
//   qty: Int
//   unitNick: String
//   unit: Unit @hasOne(fields:["unitNick"])
//   totalDoughWeight: Int
//   whoMixed: String
// }



// type PocketCount @model {
//   doughNick: String! @primaryKey(sortKeyFields: ["size"])
//   doughType: Dough! @hasOne(fields: ["doughNick"])
//   size: Int!
//   qty: Int
//   whoCounted: String
// }

// type Inventory @model {
//   id: ID!
//   ingName: String!
//   ingNick: String!
//   ingTypeNick: String
//   ingType: IngType @hasOne(fields: ["ingTypeNick"])
//   vendor: [Vendor] @hasMany
//   product: [Product] @hasMany
//   unitNick: String
//   unit: Unit @hasOne(fields: ["unitNick"])
//   bakeryLocation: String
//   intLocNick: String
//   internalLocation: InternalLoc @hasOne(fields: ["intLocNick"])
//   whoCounted: String
// }

// type Unit @model {
//   unitNick: String! @primaryKey
//   unitName: String
// }

// type InternalLoc @model {
//   intLocNick: String! @primaryKey
//   bakeryLoc: String!
//     @index(name: "byBakeryLoc", queryField: "internalByBakeryLoc")
//   intLocDescrip: String!
// }

// type IngType @model {
//   ingTypeNick: String! @primaryKey
//   ingType: String
// }

// type Vendor @model {
//   vendorName: String!
//   vendorNick: String! @primaryKey
//   productVendor: [ProductVendor]
//     @hasMany(indexName: "byVend", fields: ["vendorNick"])
// }


// type ProductVendor @model {
//   id: ID!
//   prodNick: String! @index(name: "byProd")
//   vendorNick: String! @index(name: "byVend")
//   product: Product! @belongsTo(fields: ["prodNick"])
//   vendor: Vendor! @belongsTo(fields: ["vendorNick"])
// }


// type InfoQBAuth @model {
//   id: ID!
//   infoName: String
//   infoContent: String
// }

//  #Dynamic Counts


// type EODCount @model {
//   prodNick: String! @primaryKey
//   product: Product @belongsTo(fields: ["prodNick"])
//   shelfOrFreezer: String
//   startOrFinish: String
//   location: String
//   qty: Int
//   whoCounted: String
// }


// type ActualSetOut @model {
//   prodNick: String! @primaryKey
//   prodName: Product! @belongsTo(fields: ["prodNick"])
//   qty: Int
//   location: String
//   whoSetOut: String
// }


// type CroixSheetCount @model {
//   id: ID!
//   qty: Int
//   whoCounted: String
// }

// type OldDough @model {
//   id: ID!
//   doughNick: String!
//   dough: Dough @hasOne(fields: ["doughNick"])
//   qty: Int
// }

// type Notes @model {
//   id: ID!
//   note: String
//   forWhom: String
//   byWhom: String
//   when: String
// }

// type EventLog @model {
//   id: ID!
//   eventType: String!
//   eventDescrip: String
//   userID: String
//   user: User @hasOne(fields: ["userID"])
// }

// # Join Schemas

// type TemplateProd @model {
//   id: ID!
//   locNick: String! @index(name: "byLoc")
//   prodNick: String! @index(name: "byTemp")
//   location: Location! @belongsTo(fields: ["locNick"])
//   product: Product! @belongsTo(fields: ["prodNick"])
// }

// type ProdsNotAllowed @model {
//   id: ID!
//   locNick: String! @index(name: "byLoc")
//   prodNick: String! @index(name: "byProd")
//   location: Location! @belongsTo(fields: ["locNick"])
//   product: Product! @belongsTo(fields: ["prodNick"])
// }

// type ProductDepend @model {
//   id: ID!
//   prod1Nick: String @index(name: "byProd1")
//   prod1: Product! @belongsTo(fields: ["prod1Nick"])
//   prod2Nick: String @index(name: "byProd2")
//   prod2: Product @belongsTo(fields: ["prod2Nick"])
// }

// type ZoneRoute @model {
//   id: ID!
//   routeNick: String @index(name: "byRoute")
//   route: Route! @belongsTo(fields: ["routeNick"])
//   zoneNick: String @index(name: "byZone")
//   zone: Zone @belongsTo(fields: ["zoneNick"])
// }

// type LocationUser @model {
//   id: ID!
//   Type: String!
//     @default(value: "LocationUser")
//     @index(
//       name: "locUsersByAuthType"
//       queryField: "locUsersByAuthType"
//       sortKeyFields: ["authType"]
//     )
//   authType: Int
//   locNick: String! @index(name: "byLoc")
//   sub: String! @index(name: "bySub")
//   location: Location @belongsTo(fields: ["locNick"])
//   user: User @belongsTo(fields: ["sub"])
// }

// type AltPricing @model {
//   id: ID!
//   wholePrice: Float
//   locNick: String @index(name: "byLoc", sortKeyFields: ["wholePrice"])
//   loc: Location! @belongsTo(fields: ["locNick"])
//   prodNick: String @index(name: "byProd", sortKeyFields: ["wholePrice"])
//   product: Product @belongsTo(fields: ["prodNick"])
// }

