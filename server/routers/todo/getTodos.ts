import { Todo } from "@db/services/Todo/models/Todo";
import { authenticatedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { todoItemToResponse, TodoResponse } from ".";

export default authenticatedProcedure.query<TodoResponse[]>(async ({ ctx }) => {
    try {
        const userResponse = await Todo.query
            .todoByUser({
                userId: ctx.user.userId,
            })
            .go();

        return userResponse.data.map(todoItemToResponse);
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
