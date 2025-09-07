import { authenticatedProcedure } from "../../trpc";
import { z } from "zod";
import { Todo } from "@db/services/Todo/models/Todo";
import { TRPCError } from "@trpc/server";
import { todoItemToResponse, TodoResponse } from ".";
import { getDbClient } from "@db/config";
import { TimeUuid } from "@db/utils";
import { createTodo } from "@db/tables/Todo";

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

            await createTodo(ctx.db, {
                userId: ctx.user.userId,
                title: input.title,
            });

            // await db.execute(
            //     "INSERT INTO ream_trading.todo (user_id, todo_id, title, done, updated_at) VALUES (?, ?, ?, ?, ?)",
            //     [
            //         ctx.user.userId,
            //         TimeUuid.now(),
            //         input.title,
            //         false,
            //         new Date(),
            //     ],
            // );

            return todoItemToResponse(newTodo.data);
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
