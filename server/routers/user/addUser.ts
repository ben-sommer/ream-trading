import { User } from "@db/services/Todo/models/User";
import { authenticatedProcedure } from "../../trpc";
import z from "zod";
import { CreateEntityItem, EntityItem } from "electrodb";
import { TRPCError } from "@trpc/server";
import { UserResponse } from ".";
import { userItemToResponse } from ".";

export default authenticatedProcedure
    .input(
        z.object({
            name: z.string(),
        }),
    )
    .mutation<UserResponse>(async ({ input }) => {
        try {
            const newUser: CreateEntityItem<typeof User> = {
                userId: crypto.randomUUID(),
                name: input.name,
            };

            const createUserResponse = await User.create(newUser).go();

            return userItemToResponse(createUserResponse.data);
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
