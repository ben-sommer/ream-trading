import { authenticatedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { todoItemToResponse } from ".";
import { createTodo } from "@db/models/Todo";

export default authenticatedProcedure
    .input(
        z.object({
            title: z.string(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        try {
            const result = await createTodo({
                userId: ctx.user.userId,
                title: input.title,
            });

            return todoItemToResponse(result);
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
