import { queryClient } from "@/lib/trpc";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { signOut } from "aws-amplify/auth";

export const Route = createFileRoute("/logout")({
    beforeLoad: async () => {
        await signOut();

        queryClient.invalidateQueries({
            queryKey: ["isAuthenticated"],
        });

        throw redirect({
            to: "/",
        });
    },
});
