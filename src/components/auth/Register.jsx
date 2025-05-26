import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/useAuthStore";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        avatarUrl: "",
        avatarAlt: "",
        bannerUrl: "",
        bannerAlt: "",
        venueManager: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            name: form.name,
            email: form.email,
            password: form.password,
            ...(form.bio && { bio: form.bio }),
            ...(form.avatarUrl || form.avatarAlt
                ? { avatar: { url: form.avatarUrl, alt: form.avatarAlt } }
                : {}),
            ...(form.bannerUrl || form.bannerAlt
                ? { banner: { url: form.bannerUrl, alt: form.bannerAlt } }
                : {}),
            venueManager: form.venueManager,
        };

        try {
            const res = await fetch("https://v2.api.noroff.dev/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`Registration failed: ${res.status}`);
            }

            const registered = await res.json();

            const loginRes = await fetch("https://v2.api.noroff.dev/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            if (!loginRes.ok) {
                throw new Error("Auto-login failed after registration.");
            }

            const { data } = await loginRes.json();

            setAuth(
                {
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                    banner: data.banner,
                },
                data.accessToken
            );

            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white  p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center">Create an Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Email */}
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
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password */}
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
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Bio */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Avatar */}
                <fieldset className=" p-4">
                    <legend className="text-sm font-medium text-gray-700">Avatar (optional)</legend>
                    <div className="mt-2 space-y-2">
                        <div>
                            <label htmlFor="avatarUrl" className="block text-sm">URL</label>
                            <input
                                id="avatarUrl"
                                name="avatarUrl"
                                value={form.avatarUrl}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="avatarAlt" className="block text-sm">Alt text</label>
                            <input
                                id="avatarAlt"
                                name="avatarAlt"
                                value={form.avatarAlt}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Banner */}
                <fieldset className=" p-4">
                    <legend className="text-sm font-medium text-gray-700">Banner (optional)</legend>
                    <div className="mt-2 space-y-2">
                        <div>
                            <label htmlFor="bannerUrl" className="block text-sm">URL</label>
                            <input
                                id="bannerUrl"
                                name="bannerUrl"
                                value={form.bannerUrl}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="bannerAlt" className="block text-sm">Alt text</label>
                            <input
                                id="bannerAlt"
                                name="bannerAlt"
                                value={form.bannerAlt}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Venue Manager Toggle */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="venueManager"
                        name="venueManager"
                        checked={form.venueManager}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label htmlFor="venueManager" className="text-sm">
                        Register as Venue Manager
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
                >
                    {loading ? "Registering…" : "Register"}
                </button>
            </form>

            {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        </div>
    );
}
