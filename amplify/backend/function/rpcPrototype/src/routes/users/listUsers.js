import callGraphQL from '../../project_modules/appsync-crud.js';

/**************
 * LIST USERS *
 **************/
 
export const query = /* GraphQL */ `
	query MyQuery {
		listUsers(limit: 1000) {
			items {
				sub
				email
				name
				phone
				locNick
				createdAt
				updatedAt
			}
		}
	}
`;

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(query, body);
	return gqlResponse;
	
}

export default apiFunction;