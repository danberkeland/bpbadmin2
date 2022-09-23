import callGraphQL from '../../project_modules/appsync-crud.js';
import { getFullProduct as query } from '../../project_modules/queries.js';

/***************
 * GET PRODUCT *
 ***************/

async function apiFunction(queryStringParameters, body) {
  let data = await callGraphQL(query, queryStringParameters);
  return data;
  
}

export default apiFunction;