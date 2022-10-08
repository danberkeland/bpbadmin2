import callGraphQL from '../../project_modules/appsync-crud.js';

/***************
 * LIST DOUGHS *
 ***************/
 
const query = /* GraphQL */ `
    query MyQuery {
        listDoughs(
            limit: 1000
        ) {
        items {
            doughName
            doughNick
        }
    }
}
`;

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(query, queryStringParameters);
    if ("errors" in gqlResponse) {
        return {"GraphQL_errors": gqlResponse.errors};
    }
	return gqlResponse.data.listDoughs.items;
}

export default apiFunction;