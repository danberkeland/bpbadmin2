/* Amplify Params - DO NOT EDIT
	API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT
	API_BPBADMIN2_GRAPHQLAPIIDOUTPUT
	API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

 const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  let { path, queryStringParameters, body } = event;
  let statusCode;

  let returnBody;
  try {
    const { default: executeApiMethod } = await import(
      `./routes${path}.js`
    );
    returnBody = await executeApiMethod(queryStringParameters, body);
    statusCode = 200;
  } catch (err) {
    returnBody = JSON.stringify(err);
    statusCode = 400;
  }

  return {
    statusCode: statusCode,
    headers: headers,
    body: JSON.stringify(returnBody)
  };
};
