import callGraphQL from '../../project_modules/appsync-crud.js';
import { listLocationsAZ as query } from '../../project_modules/queries.js';

/******************
 * LIST LOCATIONS *
 ******************/

async function apiFunction(queryStringParameters, body){
	let data = await callGraphQL(query, queryStringParameters);
	return data;
	
}

export default apiFunction;