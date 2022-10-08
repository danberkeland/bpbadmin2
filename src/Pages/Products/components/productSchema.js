import * as Yup from 'yup'

const optStr = Yup.string().optional()
const optInt = Yup.number().integer().min(0).optional()
const optFloat = Yup.number().min(0).optional()

export const productSchema = Yup.object({
  prodNick: Yup.string().required(),
  prodName: Yup.string().required(),
  packGroup: optStr,
  packSize: optInt,
  doughNick: optStr,
  freezerThaw: Yup.bool(),
  packGroupOrder: optInt,
  shapeDay: optInt,
  shapeNick: optStr,
  bakeDay: optStr,
  bakeNick: optStr,
  guarantee: optStr,
  transferStage: optStr,
  readyTime: optFloat,
  bakedWhere: Yup.array().of(Yup.string()),
  wholePrice: optFloat,
  retailPrice: optFloat,
  isWhole: Yup.boolean(),
  weight: optFloat,
  descrip: optStr,
  picURL: optStr,
  squareID: optStr,
  forBake: optStr,
  bakeExtra: optInt,
  batchSize: optInt,
  defaultInclude: Yup.boolean(),
  leadTime: optInt,
  qbID: optStr,
})

export const emptyProduct = {
  Type: "", 
  bakeDay: 10, 
  bakeNick: "", 
  bakedWhere: [""], 
  descrip: "", 
  doughNick: "", 
  freezerThaw: false, 
  guarantee: "", 
  inventoryProductId: "", 
  isWhole: false, 
  packGroup: "", 
  packGroupOrder: 10, 
  packSize: 10, 
  picURL: "", 
  prodName: "", 
  prodNick: "", 
  readyTime: 1.5, 
  retailPrice: 1.5, 
  shapeDay: 10, 
  shapeNick: "", 
  squareID: "", 
  transferStage: "", 
  weight: 1.5, 
  wholePrice: 1.5,
  forBake: "", 
  bakeExtra: 10, 
  batchSize: 10, 
  defaultInclude: false, 
  leadTime: 10, 
  qbID: "", 

}

// Reference from GraphQL

// input CreateProductInput {
//   Type: String  *** handled by AWS automatically
//   prodName: String!
//   prodNick: String!
//   packGroup: String
//   packSize: Int
//   doughNick: String
//   freezerThaw: Boolean
//   packGroupOrder: Int
//   shapeDay: Int
//   shapeNick: String
//   bakeDay: Int
//   bakeNick: String
//   guarantee: String
//   transferStage: String
//   readyTime: Float
//   bakedWhere: [String]
//   wholePrice: Float
//   retailPrice: Float
//   isWhole: Boolean
//   weight: Float
//   descrip: String
//   picURL: String
//   squareID: String
//   forBake: String
//   bakeExtra: Int
//   batchSize: Int
//   defaultInclude: Boolean
//   leadTime: Int
//   qbID: String
//   inventoryProductId: ID  *** handled by AWS automatically?
// }