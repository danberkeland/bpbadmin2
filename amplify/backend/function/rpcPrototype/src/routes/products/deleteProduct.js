import callGraphQL from '../../project_modules/appsync-crud.js';
import { deleteProduct as query } from '../../project_modules/queries.js';

/******************
 * DELETE PRODUCT *
 ******************/

async function apiFunction(queryStringParameters, body){
	let data = await callGraphQL(query, body);
	return data;
	
}

export default apiFunction;