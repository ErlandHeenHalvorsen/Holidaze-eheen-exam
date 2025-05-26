import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const setAuth = useAuthStore((s) => s.setAuth);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("https://v2.api.noroff.dev/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error("Login failed. Please check your credentials.");
            } else if (res.ok) {
                window.location.href = "/profile";
            }

            const { data } = await res.json();

            if (!data.accessToken || !data.name) {
                throw new Error("Invalid login response from server.");
            }

            setAuth(
                {
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                    banner: data.banner,
                    venueManager: data.venueManager,
                },
                data.accessToken
            );


            // window.location.href = "/profile";

        } catch (err) {
            setError(err.message);
            clearAuth();
        } finally {
            setLoading(false);

        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white  p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
