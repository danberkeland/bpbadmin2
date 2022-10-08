import callGraphQL from '../../project_modules/appsync-crud.js';

/******************
 * DELETE PRODUCT *
 ******************/
 
const mutation = /* GraphQL */ `
mutation MyMutation($prodNick: String!) {
 deleteProduct(input: {prodNick: $prodNick}) {
   prodNick
   prodName
 }
}
`;

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(mutation, body);
	return gqlResponse.data.deleteProduct;
}

export default apiFunction;