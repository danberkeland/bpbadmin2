import callGraphQL from '../../project_modules/appsync-crud.js';

/***************
 * GET PRODUCT *
 ***************/

const query = /* GraphQL */ `
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

async function apiFunction(queryStringParameters, body) {
  let gqlResponse = await callGraphQL(query, queryStringParameters);
  return gqlResponse.data.getProduct;
}

export default apiFunction;