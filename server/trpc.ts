import { initTRPC } from "@trpc/server";
import { type CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import {
    type APIGatewayEventRequestContextJWTAuthorizer,
    type APIGatewayProxyEventV2,
} from "aws-lambda";

export type Context = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2> & {
    user: {
        email: string;
        userId: string;
    };
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const authenticatedProcedure = t.procedure;
