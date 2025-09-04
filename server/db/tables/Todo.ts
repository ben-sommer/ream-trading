import { Table, TableColumn } from "@db/types";

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
