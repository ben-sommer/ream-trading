import { EntityItem } from "electrodb";
import { router } from "../../trpc";
import addTodo from "./addTodo";
import deleteTodo from "./deleteTodo";
import getTodos from "./getTodos";
import updateTodo from "./updateTodo";
import { Todo } from "@db/services/Todo/models/Todo";

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
    completed: boolean;
    createdAt: string;
};

export const todoItemToResponse = ({
    userId,
    todoId,
    title,
    completed,
    createdAt,
}: EntityItem<typeof Todo>): TodoResponse => ({
    userId,
    todoId,
    title,
    completed,
    createdAt,
});
