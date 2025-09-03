import { useMutation } from "@tanstack/react-query";
import { queryClient, trpc } from "../../../lib/trpc";
import Spinner from "@/components/ui/Spinner";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/Input";
import FieldInfo from "@/components/ui/FieldInfo";
import { Button } from "@/components/ui/Button";

export default function AddTodoForm() {
    const addTodoMutation = useMutation(
        trpc.todo.addTodo.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.todo.getTodos.queryOptions(),
                );
            },
        }),
    );

    const form = useForm({
        defaultValues: {
            title: "",
        },
        onSubmit: async ({ value, formApi }) => {
            const addTodoMutationResponse = await addTodoMutation.mutateAsync({
                title: value.title,
            });

            queryClient.setQueryData(
                trpc.todo.getTodos.queryKey(),
                (current) => [...(current || []), addTodoMutationResponse],
            );

            formApi.reset();
        },
    });

    return (
        <div className="flex flex-col gap-[10px]">
            <div className="flex w-full justify-between gap-[10px]">
                <form.Field
                    name="title"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? "Please enter a Todo title" : undefined,
                        onMount: ({ value }) =>
                            !value ? "Please enter a Todo title" : undefined,
                    }}
                    children={(field) => (
                        <div className="w-full">
                            <Input
                                type="text"
                                placeholder="Take the bins out"
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                            <FieldInfo field={field} />
                        </div>
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
                            {isSubmitting ? <Spinner /> : "Add Todo"}
                        </Button>
                    )}
                />
            </div>
            {addTodoMutation.isError && (
                <p className="text-red-500">{addTodoMutation.error.message}</p>
            )}
        </div>
    );
}
