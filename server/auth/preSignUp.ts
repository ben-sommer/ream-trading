import { PreSignUpTriggerEvent, Context, Callback } from "aws-lambda";

export const handler = async (
    event: PreSignUpTriggerEvent,
    context: Context,
    callback: Callback,
): Promise<PreSignUpTriggerEvent> => {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;

    return event;
};
