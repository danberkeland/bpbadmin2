/*************
* CUSTOMERS *
*************/

export const listUsersbyLocation = /* GraphQL */ `
query ListUsersbyLocation(
  $locNick: String
 ) {
   listUsers(
     	filter: {
         locNick: {eq: $locNick}
       }
   ) {
     items {
       name
       createdAt
       email
       locNick
       phone
       sub
       updatedAt
     }
   }
 }
`;

// get full
// create
// update
// delete



/*************
* LOCATIONS *
*************/



export const listLocationsAZ = /* GraphQL */ `
query MyQuery {
 locSortAZ(Type: "Location", limit: 1000) {
   items {
       locName
       locNick
   }
 }
}
`;

export const getFullLocation = /* GraphQL */ `
query GetLocation($locNick: String!) {
 getLocation(locNick: $locNick) {
   Type
   locNick
   locName
   zoneNick
   addr1
   addr2
   city
   zip
   email
   phone
   toBePrinted
   toBeEmailed
   printDuplicate
   terms
   invoicing
   latestFirstDeliv
   latestFinalDeliv
   webpageURL
   picURL
   gMap
   specialInstructions
   delivOrder
   qbID
   createdAt
   updatedAt
 }
}
`;

export const createLocation = /* GraphQL */ `
mutation CreateLocation(
   $locNick: String!
   $locName: String!
) {
  createLocation(
    input: {
      locNick: $locNick, 
      locName: $locName
    }
  ) {
   Type
   locNick
   locName
   createdAt
   updatedAt
 }
}
`;

export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $locNick: String!
    $locName: String
    $zoneNick: String
    $addr1: String
    $addr2: String
    $city: String
    $zip: String
    $email: String
    $phone: String
    $toBePrinted: Boolean
    $toBeEmailed: Boolean
    $printDuplicate: Boolean
    $terms: String
    $invoicing: String
    $latestFirstDeliv: Float
    $latestFinalDeliv: Float
    $webpageURL: String
    $picURL: String
    $gMap: String
    $specialInstructions: String
    $delivOrder: Int
    $qbID: String
    $currentBalance: String
  ) {
   updateLocation(
    Type: $Type
    locNick: $locNick
    locName: $locName
    zoneNick: $zoneNick
    addr1: $addr1
    addr2: $addr2
    city: $city
    zip: $zip
    email: $email
    phone: $phone
    toBePrinted: $toBePrinted
    toBeEmailed: $toBeEmailed
    printDuplicate: $printDuplicate
    terms: $terms
    invoicing: $invoicing
    latestFirstDeliv: $latestFirstDeliv
    latestFinalDeliv: $latestFinalDeliv
    webpageURL: $webpageURL
    picURL: $picURL
    gMap: $gMap
    specialInstructions: $specialInstructions
    delivOrder: $delivOrder
    qbID: $qbID
    currentBalance: $currentBalance
   ) {
     Type
     locNick
     locName
     zoneNick
     addr1
     addr2
     city
     zip
     email
     phone
     toBePrinted
     toBeEmailed
     printDuplicate
     terms
     invoicing
     latestFirstDeliv
     latestFinalDeliv
     webpageURL
     picURL
     gMap
     specialInstructions
     delivOrder
     qbID
     currentBalance
     createdAt
     updatedAt
   }
  }
  `;
  
export const deleteLocation = /* GraphQL */ `
mutation DeleteLocation($locNick: String!) {
 deleteLocation(input: {locNick: $locNick}) {
   Type
   locNick
   locName
   createdAt
   updatedAt
 }
}
`;



/************
 * PRODUCTS *
 ************/
 
 
 
 export const listProductsAZ = /* GraphQL */ `
 query MyQuery {
     prodSortAZ(Type: "Product", limit: 1000) {
         items {
             prodName
             prodNick
         }
     }
 }
`;

export const getFullProduct = /* GraphQL */ `
query MyQuery($prodNick: String!) {
 getProduct(prodNick: $prodNick) {
   bakeDay
   bakeExtra
   bakeNick
   bakedWhere
   batchSize
   defaultInclude
   descrip
   doughNick
   forBake
   freezerThaw
   guarantee
   inventoryProductId
   isWhole
   leadTime
   packGroup
   packGroupOrder
   packSize
   picURL
   prodName
   prodNick
   qbID
   readyTime
   retailPrice
   shapeDay
   shapeNick
   squareID
   transferStage
   updatedAt
   weight
   wholePrice
 }
}
`;

export const createProduct = /* GraphQL */ `
 mutation MyMutation(
     $prodName: String!
     $prodNick: String!
     $packSize: Int!
     $wholePrice: Float!
 ) {
     createProduct(
         input: {
             prodName: $prodName
             prodNick: $prodNick
             packSize: $packSize
             wholePrice: $wholePrice
         }
     ) {
         prodName
         prodNick
         wholePrice
         packSize
     }
 }
`;

export const updateProduct = /* GraphQL */ `
 mutation MyMutation(
   $prodNick: String!
   $prodName: String
   $wholePrice: Float
   $packSize: Int
 ) {
   updateProduct(
     input: {
       prodName: $prodName
       prodNick: $prodNick
       wholePrice: $wholePrice
       packSize: $packSize
     }
   ) {
     prodNick
     prodName
   }
 }
`;

export const deleteProduct = /* GraphQL */ `
mutation MyMutation($prodNick: String!) {
 deleteProduct(input: {prodNick: $prodNick}) {
   prodNick
   prodName
 }
}
`;