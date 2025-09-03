import { authenticatedProcedure } from "../../trpc";
import { z } from "zod";
import { Todo } from "@db/services/Todo/models/Todo";
import { TRPCError } from "@trpc/server";
import { todoItemToResponse, TodoResponse } from ".";

export default authenticatedProcedure
    .input(
        z.object({
            title: z.string(),
        }),
    )
    .mutation<TodoResponse>(async ({ input, ctx }) => {
        try {
            const newTodo = await Todo.create({
                userId: ctx.user.userId,
                todoId: crypto.randomUUID(),
                title: input.title,
                completed: false,
            }).go();

            return todoItemToResponse(newTodo.data);
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
