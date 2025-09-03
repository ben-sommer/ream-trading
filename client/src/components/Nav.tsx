import { getIsAuthenticated } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export default function Nav() {
    const { isLoading, data: isAuthenticated } = useQuery({
        queryFn: getIsAuthenticated,
        queryKey: ["isAuthenticated"],
    });

    return (
        <div className="bg-gray-300">
            <div className="mx-auto flex w-full max-w-[600px] items-center justify-between gap-2 px-[10px]">
                <p className="text-xl font-bold">Todo App</p>
                <div className="flex gap-2 p-2">
                    <Link to="/" className="[&.active]:font-bold">
                        Todos
                    </Link>
                    {!isLoading && isAuthenticated ? (
                        <Link to="/logout" className="[&.active]:font-bold">
                            Logout
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="[&.active]:font-bold">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="[&.active]:font-bold"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
