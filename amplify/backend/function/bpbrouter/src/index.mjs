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
  "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
};


export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  
    let statusCode = 200;
    let body = {};
    
    try {
        const { default: queryFunction } = await import(`./routes${event.path}/index.js`);
        body = await queryFunction(event.body ? event.body : "");
    } catch(error) {
        console.log(error)
        statusCode = 400;
    }
    
  return {
      "statusCode": statusCode,
      "headers": headers,
      "body": JSON.stringify(body)
     
      
  };
};