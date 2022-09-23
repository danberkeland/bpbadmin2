const GRAPHQL_ENDPOINT = process.env.API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT;

import fetch from "node-fetch";

export default async function callGraphQL(gqlOperation, variables = {}) {
  // 'gqlOperation' is the query or mutation string.
  // For mutations, 'variables' contains values for attributes to modify/create.
  //     variables can be supplied by query string params for queries,
  //     and by the request body for mutations.
  
  const gqlRequestBody = JSON.stringify({ 
		  "query": gqlOperation, 
		  "variables": variables 
		});

	const options = {
		"method": "POST",
		"headers": {
			"x-api-key": GRAPHQL_API_KEY,
		},
		"body": gqlRequestBody
	};

  let gqlResponse;
  let returnVal;

  try {
    gqlResponse = await fetch(GRAPHQL_ENDPOINT, options);
    returnVal = await gqlResponse.json()

	} catch (error) {
		returnVal = error;

  }

  return returnVal;
}