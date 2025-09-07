import { authenticatedProcedure } from "../../trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { deleteTodo } from "@db/models/Todo";

export default authenticatedProcedure
    .input(
        z.object({
            todoId: z.string(),
            createdAt: z.string(),
        }),
    )
    .mutation<null>(async ({ input, ctx }) => {
        try {
            await deleteTodo(ctx.user.userId, input.todoId);

            return null;
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
