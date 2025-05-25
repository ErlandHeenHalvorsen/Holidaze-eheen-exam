import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

const EditVenueModal = ({ venue, onClose, onUpdate }) => {
    const accessToken = useAuthStore((s) => s.accessToken);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: venue.name || "",
        description: venue.description || "",
        imageUrl: venue.media?.[0]?.url || "",
        imageAlt: venue.media?.[0]?.alt || "",
        price: venue.price || 0,
        maxGuests: venue.maxGuests || 1,
        location: {
            city: venue.location?.city || "",
            country: venue.location?.country || "",
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["city", "country"].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    [name]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === "price" || name === "maxGuests" ? parseInt(value) : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venue.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    media: formData.imageUrl
                        ? [{ url: formData.imageUrl, alt: formData.imageAlt }]
                        : [],
                    price: formData.price,
                    maxGuests: formData.maxGuests,
                    location: {
                        city: formData.location.city,
                        country: formData.location.country,
                    },
                }),
            });

            if (!response.ok) {
                const { errors } = await response.json();
                throw new Error(errors?.[0]?.message || "Failed to update venue");
            }

            if (onUpdate) onUpdate();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
                    aria-label="Close"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold mb-4">Edit Venue</h2>

                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name *"
                        className="border rounded p-2"
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description *"
                        className="border rounded p-2"
                        required
                    />
                    <input
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL (optional)"
                        className="border rounded p-2"
                    />
                    <input
                        name="imageAlt"
                        value={formData.imageAlt}
                        onChange={handleChange}
                        placeholder="Image alt text"
                        className="border rounded p-2"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="price"
                            type="number"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Price"
                            className="border rounded p-2"
                            required
                        />
                        <input
                            name="maxGuests"
                            type="number"
                            min="1"
                            value={formData.maxGuests}
                            onChange={handleChange}
                            placeholder="Max Guests"
                            className="border rounded p-2"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="city"
                            value={formData.location.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="border rounded p-2"
                        />
                        <input
                            name="country"
                            value={formData.location.country}
                            onChange={handleChange}
                            placeholder="Country"
                            className="border rounded p-2"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditVenueModal;
