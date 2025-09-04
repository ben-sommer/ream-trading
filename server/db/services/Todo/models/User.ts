import { Entity } from "electrodb";
import { client } from "@db/_config";
import { SERVICE_NAME, TABLE_NAME } from "../constants";

export const User = new Entity(
    {
        model: {
            service: SERVICE_NAME,
            entity: "User",
            version: "1",
        },
        attributes: {
            userId: {
                type: "string",
                required: true,
            },
            name: {
                type: "string",
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
            userById: {
                // collection: "todos",
                pk: {
                    field: "pk",
                    composite: ["userId"],
                },
            },
        },
    },
    { table: TABLE_NAME, client },
);
