import { authenticatedProcedure } from "../../trpc";
import z from "zod";
import { Todo } from "@db/services/Todo/models/Todo";
import { TRPCError } from "@trpc/server";
import { todoItemToResponse, TodoResponse } from ".";
import { EntityItem } from "electrodb";

export default authenticatedProcedure
    .input(
        z.object({
            todoId: z.string(),
            createdAt: z.string(),
            completed: z.boolean(),
        }),
    )
    .mutation<TodoResponse>(async ({ input, ctx }) => {
        try {
            const updateTodoResponse = await Todo.update({
                userId: ctx.user.userId,
                createdAt: input.createdAt,
                todoId: input.todoId,
            })
                .set({
                    completed: input.completed,
                })
                .go({
                    response: "all_new",
                });

            return todoItemToResponse(
                updateTodoResponse.data as EntityItem<typeof Todo>,
            );
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
