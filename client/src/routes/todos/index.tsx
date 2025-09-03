import { createFileRoute, redirect } from "@tanstack/react-router";
import "../../index.css";
import "../../lib/auth";
import TodoList from "@/routes/todos/-components/TodoList";
import { useIsFetching } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import Spinner from "@/components/ui/Spinner";
import { getIsAuthenticated } from "../../lib/auth";

export const Route = createFileRoute("/todos/")({
    component: Index,
    beforeLoad: async () => {
        if (!(await getIsAuthenticated())) {
            throw redirect({
                to: "/login",
            });
        }
    },
});

function Index() {
    const isTodosBeingRefetched =
        useIsFetching({
            ...trpc.todo.getTodos.queryFilter(),
            predicate: (query) => query.state.status === "success",
        }) > 0;

    return (
        <div className="mx-auto max-w-[600px] px-[10px] pt-[20px]">
            <h3 className="mb-[10px] align-middle text-2xl font-semibold">
                My Todos {isTodosBeingRefetched && <Spinner />}
            </h3>
            <TodoList />
        </div>
    );
}
