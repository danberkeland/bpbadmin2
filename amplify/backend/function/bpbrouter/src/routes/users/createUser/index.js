import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  mutation MyMutation(
    $authClass: String
    $email: String!
    $locNick: String
    $username: username
    $name: String!
    $phone: String
    $sub: String!
  ) {
    createUser(
      input: {
        authClass: $authClass
        email: $email
        locNick: $locNick
        username: username
        name: $name
        phone: $phone
        sub: $sub
      }
    ) {
      authClass
      createdAt
      email
      locNick
      username
      name
      phone
      sub
      updatedAt
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const createUser = async (event) => {
  let response = await mainCall(query, event);
  return response;
};
export default createUser;
