import { User } from "@db/services/Todo/models/User";
import { authenticatedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { userItemToResponse, UserResponse } from ".";

export default authenticatedProcedure.query<UserResponse[]>(async () => {
    try {
        const usersResponse = await User.scan.go();

        return usersResponse.data.map(userItemToResponse);
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
