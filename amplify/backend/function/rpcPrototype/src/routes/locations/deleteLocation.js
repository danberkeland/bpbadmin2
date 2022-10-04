import callGraphQL from '../../project_modules/appsync-crud.js';

/*******************
 * DELETE LOCATION *
 *******************/
 
const mutation = /* GraphQL */ `
	mutation DeleteLocation($locNick: String!) {
		deleteLocation(input: {locNick: $locNick}) {
			Type
			locNick
			locName
			createdAt
			updatedAt
		}
	}
`;

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(mutation, body);
	return gqlResponse.data.deleteLocation;
	
}

export default apiFunction;