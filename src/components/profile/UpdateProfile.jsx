import React, { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

export default function UpdateProfile({ isOpen, onClose }) {
    const { user, accessToken, setAuth } = useAuthStore();

    const [formData, setFormData] = useState({
        bio: user?.bio || "",
        avatarUrl: user?.avatar?.url || "",
        avatarAlt: user?.avatar?.alt || "",
        bannerUrl: user?.banner?.url || "",
        bannerAlt: user?.banner?.alt || "",
        venueManager: user?.venueManager || false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${user.name}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
                },
                body: JSON.stringify({
                    bio: formData.bio,
                    avatar: {
                        url: formData.avatarUrl,
                        alt: formData.avatarAlt,
                    },
                    banner: {
                        url: formData.bannerUrl,
                        alt: formData.bannerAlt,
                    },
                    venueManager: formData.venueManager,
                }),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const result = await response.json();
            setAuth(result.data, accessToken);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

                {error && <p className="text-red-600 mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="bio"
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="text"
                        name="avatarUrl"
                        placeholder="Avatar URL"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="text"
                        name="avatarAlt"
                        placeholder="Avatar Alt"
                        value={formData.avatarAlt}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="text"
                        name="bannerUrl"
                        placeholder="Banner URL"
                        value={formData.bannerUrl}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="text"
                        name="bannerAlt"
                        placeholder="Banner Alt"
                        value={formData.bannerAlt}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="venueManager"
                            checked={formData.venueManager}
                            onChange={handleChange}
                        />
                        Venue Manager
                    </label>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
