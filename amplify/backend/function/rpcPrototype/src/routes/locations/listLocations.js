import callGraphQL from '../../project_modules/appsync-crud.js';

/******************
 * LIST LOCATIONS *
 ******************/
 
const query = /* GraphQL */ `
query MyQuery {
 locSortAZ(Type: "Location", limit: 1000) {
   items {
       locName
       locNick
   }
 }
}
`;

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(query, queryStringParameters);
	return gqlResponse.data.locSortAZ.items;
	
}

export default apiFunction;