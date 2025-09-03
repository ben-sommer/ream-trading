import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../../server";
import { TRPC_SERVER_URL } from "./env";
import { fetchAuthSession } from "aws-amplify/auth";

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: TRPC_SERVER_URL,
            headers: async () => {
                const session = await fetchAuthSession();

                const token = session.tokens?.idToken?.toString();

                if (token === undefined) return {};

                return {
                    Authorization: `Bearer ${token}`,
                };
            },
        }),
    ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
});
