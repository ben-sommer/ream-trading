import { router } from "./trpc";
import {
    awsLambdaRequestHandler,
    CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { todoRouter } from "./routers/todo";

const appRouter = router({
    todo: todoRouter,
});

export const handler = awsLambdaRequestHandler({
    router: appRouter,
    createContext: async ({
        event,
        context,
        info,
    }: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2WithJWTAuthorizer>) => {
        if (!("authorizer" in event.requestContext))
            throw new Error("Authorizer not present in request!");

        const user = event.requestContext.authorizer;

        return {
            event,
            context,
            info,
            user: {
                email: user.jwt.claims.email as string,
                userId: user.jwt.claims.sub as string,
            },
        };
    },
});

export type AppRouter = typeof appRouter;
