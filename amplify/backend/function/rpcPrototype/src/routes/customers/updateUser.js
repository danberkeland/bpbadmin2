import callGraphQL from '../../project_modules/appsync-crud.js';
// import { <QUERY_NAME> as query } from '../../project_modules/queries.js';

/**************
 * <TEMPLATE> *
 **************/

async function apiFunction(queryStringParameters, body){
	let data = await callGraphQL(query, body);
	return data;
	
}

export default apiFunction;