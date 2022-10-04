import callGraphQL from '../../project_modules/appsync-crud.js';
import { listProductsAZ as query } from '../../project_modules/queries.js';

/*****************
 * LIST PRODUCTS *
 *****************/

async function apiFunction(queryStringParameters, body) {
	let gqlResponse = await callGraphQL(query, queryStringParameters);
  return gqlResponse.data.prodSortAZ.items;
  
}

export default apiFunction;
