import { useMutation } from "@tanstack/react-query";
import { queryClient, trpc } from "@/lib/trpc";
import { useCallback } from "react";
import { TodoResponse } from "../../../../../server/routers/todo";

export default function Todo({ todo }: { todo: TodoResponse }) {
    const updateTodoMutation = useMutation(
        trpc.todo.updateTodo.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.todo.getTodos.queryOptions(),
                );
            },
        }),
    );

    const handleCheckboxChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            try {
                await updateTodoMutation.mutateAsync({
                    todoId: todo.todoId,
                    createdAt: todo.createdAt,
                    completed: e.target.checked,
                });
            } catch {
                e.target.checked = !e.target.checked;
            }
        },
        [todo.todoId, todo.createdAt, updateTodoMutation],
    );

    return (
        <div className="flex items-center gap-[10px]">
            <p key={todo.todoId}>{todo.title}</p>
            <input
                type="checkbox"
                defaultChecked={todo.completed}
                onChange={handleCheckboxChange}
                disabled={updateTodoMutation.isPending}
            />
        </div>
    );
}
