import { User } from "@db/services/Todo/models/User";
import { authenticatedProcedure } from "../../trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { userItemToResponse, UserResponse } from ".";

export default authenticatedProcedure
    .input(
        z.object({
            userId: z.string(),
        }),
    )
    .query<UserResponse>(async ({ input }) => {
        try {
            const userResponse = await User.get({
                userId: input.userId,
            }).go();

            if (userResponse.data === null) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            return userItemToResponse(userResponse.data);
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
