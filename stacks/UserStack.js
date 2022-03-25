import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import * as sst from "@serverless-stack/resources";
// import * as apigAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";


export default class UserStack extends sst.Stack {
    // Public reference to the API
    usersApi;

    constructor(scope, id, props) {
        super(scope, id, props);

        const { usersTable, auth } = props;

        // Create the API
        this.usersApi = new sst.Api(this, "UsersApi", {
            defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
            defaultAuthorizer: new HttpUserPoolAuthorizer("Authorizer", auth.cognitoUserPool, {
                userPoolClients: [auth.cognitoUserPoolClient]
            }),
            defaultAuthorizationScopes: ["user.id", "user.email"],
            defaultFunctionProps: {
                environment: {
                    USERS_TABLE: usersTable.tableName,
                    JWT_KEY: "serverless"
                }
            },
            routes: {
                // "POST   /users": "src/services/users/handlers/create.handler",
                // "POST   /users/signin": "src/services/users/handlers/signIn.handler",
                "PUT    /users/{id}": "src/services/users/handlers/update.handler",
                "GET    /users/{id}": "src/services/users/handlers/retrieve.handler",
            },
            cors: true
        });

        // Allow the API to access the table
        this.usersApi.attachPermissions([usersTable]);
        //authorizer.attachPermissionsForAuthUsers([this.usersApi]);

        // Show the API endpoint in the output
        this.addOutputs({
            ApiEndpoint: this.usersApi.url,
        });
    }
}