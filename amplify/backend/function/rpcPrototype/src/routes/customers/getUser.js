import callGraphQL from '../../project_modules/appsync-crud.js';
// import { <QUERY_NAME> as query } from '../../project_modules/queries.js';

/**************
 * <TEMPLATE> *
 **************/

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(query, body);
	return gqlResponse;
	
}

export default apiFunction;