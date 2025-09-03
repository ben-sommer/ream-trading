import { EntityItem } from "electrodb";
import { router } from "../../trpc";
import addUser from "./addUser";
import getAllUsers from "./getAllUsers";
import getUser from "./getUser";
import { User } from "@db/services/Todo/models/User";

export const userRouter = router({
    addUser,
    getAllUsers,
    getUser,
});

export type UserResponse = {
    userId: string;
    name: string;
};

export const userItemToResponse = ({
    userId,
    name,
}: EntityItem<typeof User>): UserResponse => ({
    userId,
    name,
});
