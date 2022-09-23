import callGraphQL from '../../project_modules/appsync-crud.js';
import { listUsersbyLocation as query } from '../../project_modules/queries.js';

/**************************
 * LIST USERS BY LOCATION *
 **************************/

async function apiFunction(queryStringParameters, body){
	let data = await callGraphQL(query, body);
	return data;
	
}

export default apiFunction;