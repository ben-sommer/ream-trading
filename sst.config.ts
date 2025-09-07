/// <reference path=".sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: "ream-trading",
            home: "aws",
            removal: input?.stage === "production" ? "retain" : "remove",
            providers: {
                aws: {
                    profile: "personal",
                },
            },
        };
    },
    async run() {
        /* ----- Database ----- */

        const keyspace = new aws.keyspaces.Keyspace("Keyspace", {
            name: "ream_trading",
        });

        const todoTable = new aws.keyspaces.Table("TodoTable", {
            keyspaceName: keyspace.name,
            tableName: "todo",
            schemaDefinition: {
                columns: [
                    { name: "user_id", type: "text" },
                    { name: "todo_id", type: "timeuuid" },
                    { name: "title", type: "text" },
                    { name: "done", type: "boolean" },
                    { name: "updated_at", type: "timestamp" },
                ],
                partitionKeys: [{ name: "user_id" }],
                clusteringKeys: [{ name: "todo_id", orderBy: "ASC" }],
            },
            capacitySpecification: {
                throughputMode: "PAY_PER_REQUEST",
            },
        });

        /* ----- Auth ----- */

        const userPool = new sst.aws.CognitoUserPool("UserPool", {
            triggers: {
                preSignUp: "server/auth/preSignUp.handler",
            },
            usernames: ["email"],
        });

        const userPoolClient = userPool.addClient("UserPoolClient");

        const identityPool = new sst.aws.CognitoIdentityPool("IdentityPool", {
            userPools: [
                {
                    userPool: userPool.id,
                    client: userPoolClient.id,
                },
            ],
        });

        /* ----- API ----- */

        const api = new sst.aws.ApiGatewayV2("Api", {
            cors: {
                allowHeaders: ["*"],
                allowMethods: ["*"],
                allowOrigins: ["*"],
            },
        });

        const authorizer = api.addAuthorizer({
            name: "CognitoAuthorizer",
            jwt: {
                issuer: $interpolate`https://cognito-idp.${aws.getRegionOutput().name}.amazonaws.com/${userPool.id}`,
                audiences: [userPoolClient.id],
            },
        });

        api.route("OPTIONS /{proxy+}", {
            handler: "server/cors.handler",
            link: [todoTable],
        });

        const server = api.route(
            "$default",
            {
                handler: "server/index.handler",
                copyFiles: [
                    {
                        from: "server/db/sf-class2-root.crt",
                    },
                ],
                permissions: [
                    sst.aws.permission({
                        actions: ["cassandra:*"],
                        resources: [keyspace.arn],
                    }),
                ],
            },
            {
                auth: {
                    jwt: {
                        authorizer: authorizer.id,
                    },
                },
            },
        );

        /* ----- Frontend ----- */

        const client = new sst.aws.StaticSite("ViteClient", {
            environment: {
                VITE_TRPC_SERVER_URL: api.url,
                VITE_COGNITO_USER_POOL_ID: userPool.id,
                VITE_COGNITO_USER_POOL_CLIENT_ID: userPoolClient.id,
                VITE_COGNITO_IDENTITY_POOL_ID: identityPool.id,
            },
            build: {
                command: "npm run build:client",
                output: "client/dist",
            },
        });

        return {};
    },
});
