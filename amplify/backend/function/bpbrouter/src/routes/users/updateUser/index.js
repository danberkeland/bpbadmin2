import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  mutation MyMutation(
    $sub: String!
    $phone: String
    $name: String!
    $locNick: String
    $email: String!
    $authClass: String
  ) {
    updateUser(
      input: {
        authClass: $authClass
        email: $email
        locNick: $locNick
        name: $name
        phone: $phone
        sub: $sub
      }
    ) {
      email
      locNick
      createdAt
      authClass
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
const updateUser = async (event) => {
  let response = await mainCall(query, event);
  return response;
};
export default updateUser;
