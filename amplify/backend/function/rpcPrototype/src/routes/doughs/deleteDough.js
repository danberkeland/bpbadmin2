import callGraphQL from '../../project_modules/appsync-crud.js';

/****************
 * DELETE DOUGH *
 ****************/
 
const mutation = /* GraphQL */ `
mutation MyMutation($doughNick: String!) {
 deleteDough(input: {doughNick: $doughNick}) {
   doughNick
   doughName
 }
}
`;

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(mutation, body);
	if ("errors" in gqlResponse) {
    return {"GraphQL_errors": gqlResponse.errors};
  }
	return gqlResponse.data.deleteDough;

}

export default apiFunction;