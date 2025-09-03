import { Button } from "@/components/ui/Button";
import FieldInfo from "@/components/ui/FieldInfo";
import { Input } from "@/components/ui/Input";
import { getIsAuthenticated } from "@/lib/auth";
import { queryClient } from "@/lib/trpc";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/lib/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Navigate, redirect } from "@tanstack/react-router";
import { autoSignIn, signUp } from "aws-amplify/auth";

export const Route = createFileRoute("/register")({
    component: Register,
    beforeLoad: async () => {
        if (await getIsAuthenticated()) {
            throw redirect({
                to: "/",
            });
        }
    },
});

function Register() {
    const registerMutation = useMutation({
        mutationFn: async ({
            username,
            password,
        }: {
            username: string;
            password: string;
        }) => {
            const signUpResponse = await signUp({
                username,
                password,
                options: {
                    autoSignIn: true,
                    userAttributes: {},
                },
            });

            await autoSignIn();

            return signUpResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["isAuthenticated"] });
        },
    });

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            await registerMutation.mutateAsync({
                username: value.email,
                password: value.password,
            });
        },
    });

    return (
        <div className="p-2">
            <div className="mx-auto flex max-w-[320px] flex-col gap-[16px]">
                <form.Field
                    name="email"
                    validators={{
                        onChange: ({ value }) =>
                            !value
                                ? "Please enter your email"
                                : !EMAIL_REGEX.test(value)
                                  ? "Please check your email is correct"
                                  : undefined,
                        onMount: ({ value }) =>
                            !value
                                ? "Please enter your email"
                                : !EMAIL_REGEX.test(value)
                                  ? "Please check your email is correct"
                                  : undefined,
                    }}
                    children={(field) => (
                        <>
                            <label htmlFor={field.name}>Email address:</label>
                            <Input
                                type="text"
                                placeholder="john@example.com"
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                />
                <form.Field
                    name="password"
                    validators={{
                        onChange: ({ value }) =>
                            !value
                                ? "Please choose your password"
                                : !PASSWORD_REGEX.test(value)
                                  ? "Please choose a stronger password"
                                  : undefined,
                        onMount: ({ value }) =>
                            !value
                                ? "Please choose your password"
                                : !PASSWORD_REGEX.test(value)
                                  ? "Please choose a stronger password"
                                  : undefined,
                    }}
                    children={(field) => (
                        <>
                            <label htmlFor={field.name}>Password:</label>
                            <Input
                                type="password"
                                placeholder="********"
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                />
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            onClick={form.handleSubmit}
                        >
                            {isSubmitting ? "..." : "Register"}
                        </Button>
                    )}
                />
                {registerMutation.isPending && <p>Registering...</p>}
                {registerMutation.isError && (
                    <p className="text-red-500">
                        {registerMutation.error.message}
                    </p>
                )}
                {registerMutation.isSuccess && <Navigate to="/" />}
            </div>
        </div>
    );
}
