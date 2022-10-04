import callGraphQL from '../../project_modules/appsync-crud.js';
import { updateProduct as query } from '../../project_modules/queries.js';

/******************
 * UPDATE PRODUCT *
 ******************/

async function apiFunction(queryStringParameters, body) {
	let gqlResponse = await callGraphQL(query, body);
	return gqlResponse;
	
}

export default apiFunction;
