import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export default function CreateVenueModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        maxGuests: 1,
        imageUrl: "",
        imageAlt: "",
        meta: {
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false,
        },
        location: {
            address: "",
            city: "",
            zip: "",
            country: "",
            continent: "",
        },
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name in formData.meta) {
            setFormData((prev) => ({
                ...prev,
                meta: { ...prev.meta, [name]: checked },
            }));
        } else if (name in formData.location) {
            setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, [name]: value },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "number" ? Number(value) : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const { accessToken } = useAuthStore.getState();

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            maxGuests: Number(formData.maxGuests),
            meta: formData.meta,
            location: {},
        };


        Object.entries(formData.location).forEach(([key, val]) => {
            const cleanVal = val.trim();
            if (cleanVal) {
                payload.location[key] = cleanVal;
            }
        });

        if (
            isValidUrl(formData.imageUrl.trim()) &&
            formData.imageAlt.trim()
        ) {
            payload.media = [
                {
                    url: formData.imageUrl.trim(),
                    alt: formData.imageAlt.trim(),
                },
            ];
        }

        console.log("Sending payload:", JSON.stringify(payload, null, 2));

        try {
            const res = await fetch("https://v2.api.noroff.dev/holidaze/venues", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    'X-Noroff-API-Key': '3d3df9d0-115c-4d7b-b353-6ad17f9cdcd8',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.errors?.[0]?.message || "Invalid input");
            }

            const data = await res.json();
            console.log("Venue created:", data, res.status);
            onClose();
        } catch (err) {
            console.error("Error:", err);
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
                    aria-label="Close"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold mb-4">Create a New Venue</h2>

                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <input
                        id="venue-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name *"
                        className="input"
                        required
                    />
                    <textarea
                        id="venue-description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description *"
                        className="input"
                        required
                    />
                    <input
                        id="venue-image-url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL (optional)"
                        className="input"
                    />
                    <input
                        id="venue-image-alt"
                        name="imageAlt"
                        value={formData.imageAlt}
                        onChange={handleChange}
                        placeholder="Image alt text"
                        className="input"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <label htmlFor="price">Price</label>
                        <input
                            id="venue-price"
                            name="price"
                            type="number"
                            min={0}
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Price per night *"
                            className="input"
                            required
                        />
                        <label htmlFor="maxGuest">Max Guests</label>
                        <input
                            id="venue-max-guests"
                            name="maxGuests"
                            type="number"
                            min={1}
                            value={formData.maxGuests}
                            onChange={handleChange}
                            placeholder="Max guests *"
                            className="input"
                            required
                        />
                    </div>

                    <fieldset>
                        <legend className="font-semibold mb-2">Amenities</legend>
                        <div className="grid grid-cols-2 gap-2">
                            {["wifi", "parking", "breakfast", "pets"].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name={option}
                                        checked={formData.meta[option]}
                                        onChange={handleChange}
                                    />
                                    <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className="font-semibold mb-2">Location</legend>
                        <div className="grid grid-cols-2 gap-4">
                            {["address", "city", "zip", "country", "continent"].map((field) => (
                                <input
                                    key={field}
                                    id={`venue-${field}`}
                                    name={field}
                                    value={formData.location[field]}
                                    onChange={handleChange}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    className="input"
                                />
                            ))}
                        </div>
                    </fieldset>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {submitting ? "Creating..." : "Create Venue"}
                    </button>
                </form>
            </div>
        </div>
    );
}
