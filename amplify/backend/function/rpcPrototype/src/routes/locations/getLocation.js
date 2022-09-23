import callGraphQL from '../../project_modules/appsync-crud.js';
import { getFullLocation as query } from '../../project_modules/queries.js';

/****************
 * GET LOCATION *
 ****************/

async function apiFunction(queryStringParameters, body){
	let data = await callGraphQL(query, queryStringParameters);
	return data;
	
}

export default apiFunction;