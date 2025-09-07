import { Entity } from "electrodb";
import { client } from "@db/_config";
import { SERVICE_NAME, TABLE_NAME } from "../constants";

export const Todo = new Entity(
    {
        model: {
            service: SERVICE_NAME,
            entity: "Todo",
            version: "1",
        },
        attributes: {
            userId: {
                type: "string",
                required: true,
            },
            todoId: {
                type: "string",
                required: true,
            },
            title: {
                type: "string",
                required: true,
            },
            done: {
                type: "boolean",
                required: true,
            },
            createdAt: {
                type: "string",
                readOnly: true,
                required: true,
                default: () => new Date().toISOString(),
                set: () => new Date().toISOString(),
            },
            updatedAt: {
                type: "string",
                watch: "*",
                required: true,
                default: () => new Date().toISOString(),
                set: () => new Date().toISOString(),
            },
        },
        indexes: {
            todoByUser: {
                // collection: "todos",
                pk: {
                    field: "pk",
                    composite: ["userId"],
                },
                sk: {
                    field: "sk",
                    composite: ["createdAt", "todoId"],
                },
            },
        },
    },
    { table: TABLE_NAME, client },
);
