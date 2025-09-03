import { Service } from "electrodb";
import { User } from "./models/User";
import { Todo } from "./models/Todo";
import { client } from "@db/config";
import { TABLE_NAME } from "./constants";

// export const TodoApp = new Service(
//     {
//         user: User,
//         todo: Todo,
//     },
//     {
//         table: TABLE_NAME,
//         client,
//     },
// );
