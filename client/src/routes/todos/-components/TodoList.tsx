import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../../lib/trpc";
import Spinner from "@/components/ui/Spinner";
import AddTodoForm from "./AddTodoForm";
import Todo from "./Todo";

export default function TodoList() {
    const getTodosQuery = useQuery(trpc.todo.getTodos.queryOptions());

    if (getTodosQuery.isLoading)
        return (
            <>
                <Spinner />
                <p>Loading your Todos...</p>
            </>
        );

    if (getTodosQuery.isError)
        return <p>Error: {getTodosQuery.error.message}</p>;

    const todos = getTodosQuery.data || [];

    return (
        <div>
            <div className="mb-[10px]">
                {todos.map((todo) => (
                    <Todo key={todo.todoId} todo={todo} />
                ))}
            </div>
            <AddTodoForm />
        </div>
    );
}
