import Nav from "@/components/Nav";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "../index.css";

export const Route = createRootRoute({
    component: () => (
        <QueryClientProvider client={queryClient}>
            <Nav />
            <Outlet />
            <TanStackRouterDevtools />
            <ReactQueryDevtools />
        </QueryClientProvider>
    ),
});
