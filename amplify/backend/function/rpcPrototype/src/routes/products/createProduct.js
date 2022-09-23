import callGraphQL from '../../project_modules/appsync-crud.js';
import { createProduct as query } from '../../project_modules/queries.js';

/******************
 * CREATE PRODUCT *
 ******************/

async function apiFunction(queryStringParameters, body){
	let data = await callGraphQL(query, body);
	return data;
	
}

export default apiFunction;