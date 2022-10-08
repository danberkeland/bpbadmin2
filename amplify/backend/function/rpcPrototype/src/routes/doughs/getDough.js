import callGraphQL from '../../project_modules/appsync-crud.js';

/*************
 * GET DOUGH *
 *************/

const query = /* GraphQL */ `
query MyQuery($doughNick: String!) 
    {
        getDough(
            doughNick: $doughNick
        ) {
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
  let gqlResponse = await callGraphQL(query, queryStringParameters);
  if ("errors" in gqlResponse) {
      return {"GraphQL_errors": gqlResponse.errors};
  }
  return gqlResponse.data.getDough;

}

export default apiFunction;