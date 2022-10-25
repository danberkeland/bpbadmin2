export type AmplifyDependentResourcesAttributes = {
    "api": {
        "bpbadmin2": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "function": {
        "bpbadmin2fetchLayer": {
            "Arn": "string"
        },
        "bpbadmin2testFetchLayer": {
            "Arn": "string"
        },
        "bpbadmin2anotherTest": {
            "Arn": "string"
        },
        "deleteCognitoUser": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "bpbadmin2SDKLayer": {
            "Arn": "string"
        },
        "createCognitoUser": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "updateCognitoUser": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "confirmCognitoEmail": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "auth": {
        "bpbadmin2db0d25d4": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    }
}