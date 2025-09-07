import { router } from "../../trpc";
import addTodo from "./addTodo";
import deleteTodo from "./deleteTodo";
import getTodos from "./getTodos";
import updateTodo from "./updateTodo";
import { timeUuidToDate } from "@db/utils";
import { TodoItem } from "@db/models/Todo";

export const todoRouter = router({
    addTodo,
    deleteTodo,
    getTodos,
    updateTodo,
});

export type TodoResponse = {
    userId: string;
    todoId: string;
    title: string;
    done: boolean;
    createdAt: string;
    updatedAt: string;
};

export const todoItemToResponse = ({
    user_id,
    todo_id,
    title,
    done,
    updated_at,
}: TodoItem): TodoResponse => ({
    userId: user_id,
    todoId: todo_id.toString(),
    title,
    done,
    createdAt: timeUuidToDate(todo_id).toISOString(),
    updatedAt: updated_at.toISOString(),
});
