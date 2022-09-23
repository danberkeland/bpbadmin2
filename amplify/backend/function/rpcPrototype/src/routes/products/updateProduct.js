import callGraphQL from '../../project_modules/appsync-crud.js';
import { updateProduct as query } from '../../project_modules/queries.js';

/******************
 * UPDATE PRODUCT *
 ******************/

async function apiFunction(queryStringParameters, body) {
	let data = await callGraphQL(query, body);
	return data;
	
}

export default apiFunction;
