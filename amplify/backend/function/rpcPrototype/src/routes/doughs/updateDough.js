import callGraphQL from '../../project_modules/appsync-crud.js';

/****************
 * UPDATE DOUGH *
 ****************/
 
const mutation = /* GraphQL */`
    mutation MyMutation (
        $doughNick: String!, 
        $doughName: String, 
        $batchSize: Float, 
        $buffer: Float, 
        $hydration: Float, 
        $mixedWhere: String, 
        $isBakeReady: Boolean, 
        $saltInDry: Boolean
    ) {updateDough(input: {
            doughNick: $doughNick, 
            doughName: $doughName, 
            batchSize: $batchSize, 
            buffer: $buffer, 
            hydration: $hydration, 
            mixedWhere: $mixedWhere, 
            isBakeReady: $isBakeReady, 
            saltInDry: $saltInDry
        }) {
            doughNick
            doughName
            batchSize
            buffer
            hydration
            mixedWhere
            isBakeReady
            saltInDry
        }
    }
`;

async function apiFunction(queryStringParameters, body) {
	let gqlResponse = await callGraphQL(mutation, body);
	if ("errors" in gqlResponse) {
        return {"GraphQL_errors": gqlResponse.errors};
    }
	return gqlResponse.data.updateDough;
	
}

export default apiFunction;
