import { Button } from "@/components/ui/Button";
import FieldInfo from "@/components/ui/FieldInfo";
import { Input } from "@/components/ui/Input";
import { getIsAuthenticated } from "@/lib/auth";
import { queryClient } from "@/lib/trpc";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/lib/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, Navigate } from "@tanstack/react-router";
import { signIn } from "aws-amplify/auth";

export const Route = createFileRoute("/login")({
    component: Login,
    beforeLoad: async () => {
        if (await getIsAuthenticated()) {
            throw redirect({
                to: "/",
            });
        }
    },
});

function Login() {
    const loginMutation = useMutation({
        mutationFn: async ({
            username,
            password,
        }: {
            username: string;
            password: string;
        }) => {
            const response = await signIn({
                username,
                password,
            });

            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["isAuthenticated"],
            });
        },
    });

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            await loginMutation.mutateAsync({
                username: value.email,
                password: value.password,
            });
        },
    });

    return (
        <div className="p-2">
            <div className="center mx-auto flex max-w-[320px] flex-col gap-[16px]">
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
                                ? "Please enter your password"
                                : !PASSWORD_REGEX.test(value)
                                  ? "Please choose a stronger password"
                                  : undefined,
                        onMount: ({ value }) =>
                            !value
                                ? "Please enter your password"
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
                            {isSubmitting ? "..." : "Log In"}
                        </Button>
                    )}
                />
                {loginMutation.isPending && <p>Logging you in...</p>}
                {loginMutation.isError && (
                    <p className="text-red-500">
                        {loginMutation.error.message}
                    </p>
                )}
                {loginMutation.isSuccess && <Navigate to="/" />}
            </div>
        </div>
    );
}
