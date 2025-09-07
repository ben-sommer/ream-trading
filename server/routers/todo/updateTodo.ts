import { authenticatedProcedure } from "../../trpc";
import z from "zod";
import { Todo } from "@db/services/Todo/models/Todo";
import { TRPCError } from "@trpc/server";
import { todoItemToResponse, TodoResponse } from ".";
import { EntityItem } from "electrodb";
import { updateTodo } from "@db/models/Todo";

export default authenticatedProcedure
    .input(
        z.object({
            todoId: z.string(),
            createdAt: z.string(),
            done: z.boolean(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        try {
            await updateTodo({
                userId: ctx.user.userId,
                todoId: input.todoId,
                done: input.done,
            });

            return null;
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
