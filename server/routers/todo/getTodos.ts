import { authenticatedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { todoItemToResponse, TodoResponse } from ".";
import { getTodosByUserId } from "@db/models/Todo";

export default authenticatedProcedure.query<TodoResponse[]>(async ({ ctx }) => {
    try {
        const todoItems = await getTodosByUserId(ctx.user.userId);

        return todoItems.map(todoItemToResponse);
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
