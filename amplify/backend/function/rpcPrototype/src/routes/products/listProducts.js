import callGraphQL from '../../project_modules/appsync-crud.js';

/*****************
 * LIST PRODUCTS *
 *****************/

 export const query = /* GraphQL */ `
 query MyQuery {
     prodSortAZ(Type: "Product", limit: 1000) {
         items {
             prodName
             prodNick
         }
     }
 }
`;

async function apiFunction(queryStringParameters, body) {
	let gqlResponse = await callGraphQL(query, queryStringParameters);
  return gqlResponse.data.prodSortAZ.items;
}

export default apiFunction;
