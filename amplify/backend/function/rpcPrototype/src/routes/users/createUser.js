import callGraphQL from '../../project_modules/appsync-crud.js';

/***************
 * CREATE USER *
 ***************/

const mutation = /* GraphQL */ `
    mutation MyMutation(
        $name: String!
        $email: String!
        $phone: String
        $sub: String!
        $locNick: String
    ) {
        createUser(
            input: {
                name: $name
                email: $email
                phone: $phone
                sub: $sub
                locNick: $locNick
            }
        ) {
        	sub
			email
			name
			phone
			locNick
			createdAt
			updatedAt
        }
    }
`;

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(mutation, body);
	return gqlResponse;
}

export default apiFunction;