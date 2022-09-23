import callGraphQL from '../../project_modules/appsync-crud.js';
import { updateLocation as query } from '../../project_modules/queries.js';

/*******************
 * UPDATE LOCATION *
 *******************/

async function apiFunction(queryStringParameters, body){
	let data = await callGraphQL(query, body);
	return data;
	
}

export default apiFunction;