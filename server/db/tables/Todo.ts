import { TableColumn } from "@db/types";
import { TimeUuid } from "@db/utils";
import { type Client } from "cassandra-driver";

export const TodoTableSchema: TableColumn[] = [
    { name: "user_id", type: "text" },
    { name: "todo_id", type: "timeuuid" },
    { name: "title", type: "text" },
    { name: "done", type: "boolean" },
    { name: "updated_at", type: "timestamp" },
] as const;

export const TodoTable = {
    name: "todo",
    schema: TodoTableSchema,
} as const;

export const createTodo = async (
    client: Client,
    {
        userId,
        title,
    }: {
        userId: string;
        title: string;
    },
) => {
    return client.execute(
        "INSERT INTO ream_trading.todo (user_id, todo_id, title, done, updated_at) VALUES (?, ?, ?, ?, ?)",
        [userId, TimeUuid.now(), title, false, new Date()],
        { prepare: true },
    );
};
