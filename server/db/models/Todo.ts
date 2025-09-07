import { getDbClient } from "@db/config";
import { TimeUuid } from "@db/utils";

export type TodoItem = {
    user_id: string;
    todo_id: InstanceType<typeof TimeUuid>;
    title: string;
    done: boolean;
    updated_at: Date;
};

export const createTodo = async ({
    userId,
    title,
}: {
    userId: string;
    title: string;
}) => {
    const client = await getDbClient();

    const createdAt = new Date();

    const todo: TodoItem = {
        user_id: userId,
        todo_id: TimeUuid.fromDate(createdAt),
        title,
        done: false,
        updated_at: new Date(),
    };

    await client.execute(
        "INSERT INTO ream_trading.todo (user_id, todo_id, title, done, updated_at) VALUES (?, ?, ?, ?, ?)",
        [todo.user_id, todo.todo_id, todo.title, todo.done, todo.updated_at],
        { prepare: true },
    );

    return todo;
};

export const getTodosByUserId = async (userId: string) => {
    const client = await getDbClient();

    const result = await client.execute(
        "SELECT user_id, todo_id, title, done, updated_at FROM ream_trading.todo WHERE user_id = ?",
        [userId],
        { prepare: true },
    );

    return result.rows.map(({ user_id, todo_id, title, done, updated_at }) => ({
        user_id,
        todo_id,
        title,
        done,
        updated_at,
    }));
};

export const deleteTodo = async (userId: string, todoId: string) => {
    const client = await getDbClient();

    await client.execute(
        "DELETE FROM ream_trading.todo WHERE user_id = ? AND todo_id = ?",
        [userId, TimeUuid.fromString(todoId)],
        { prepare: true },
    );

    return null;
};

export const updateTodo = async ({
    userId,
    todoId,
    done,
}: {
    userId: string;
    todoId: string;
    done: boolean;
}) => {
    const client = await getDbClient();

    const updatedAt = new Date();

    await client.execute(
        "UPDATE ream_trading.todo SET done = ?, updated_at = ? WHERE user_id = ? AND todo_id = ?",
        [done, updatedAt, userId, TimeUuid.fromString(todoId)],
        { prepare: true },
    );

    return null;
};
