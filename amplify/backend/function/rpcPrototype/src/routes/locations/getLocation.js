import callGraphQL from '../../project_modules/appsync-crud.js';

/****************
 * GET LOCATION *
 ****************/

const query = /* GraphQL */ `
query GetLocation($locNick: String!) {
 getLocation(locNick: $locNick) {
   Type
   locNick
   locName
   zoneNick
   addr1
   addr2
   city
   zip
   email
   phone
   toBePrinted
   toBeEmailed
   printDuplicate
   terms
   invoicing
   latestFirstDeliv
   latestFinalDeliv
   webpageURL
   picURL
   gMap
   specialInstructions
   delivOrder
   qbID
   createdAt
   updatedAt
 }
}
`;

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(query, queryStringParameters);
	return gqlResponse.data.getLocation;
	
}

export default apiFunction;