import callGraphQL from '../../project_modules/appsync-crud.js';
import { listUsersbyLocation as query } from '../../project_modules/queries.js';

/**************************
 * LIST USERS BY LOCATION *
 **************************/

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(query, body);
	return gqlResponse;
	
}

export default apiFunction;