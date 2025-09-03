import { authenticatedProcedure } from "../../trpc";
import z from "zod";
import { Todo } from "@db/services/Todo/models/Todo";
import { TRPCError } from "@trpc/server";

export default authenticatedProcedure
    .input(
        z.object({
            todoId: z.string(),
            createdAt: z.string(),
        }),
    )
    .mutation<null>(async ({ input, ctx }) => {
        try {
            await Todo.delete({
                userId: ctx.user.userId,
                todoId: input.todoId,
                createdAt: input.createdAt,
            }).go();

            return null;
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
