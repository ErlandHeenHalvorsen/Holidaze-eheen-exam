import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

export default function CreateVenueModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        maxGuests: 1,
        imageUrl: "",
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
            lat: 0,
            lng: 0,
        },
    });

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
                location: {
                    ...prev.location,
                    [name]: ["lat", "lng"].includes(name) ? Number(value) : value,
                },
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
        const { accessToken } = useAuthStore.getState();

        const payload = {
            name: formData.name,
            description: formData.description,
            media: formData.imageUrl
                ? [{ url: formData.imageUrl, alt: formData.name }]
                : [],
            price: formData.price,
            maxGuests: formData.maxGuests,
            meta: formData.meta,
            location: formData.location,
        };

        try {
            const res = await fetch("https://api.noroff.dev/api/v1/holidaze/venues", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create venue");

            const data = await res.json();
            console.log("Venue created:", data);
            onClose();
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
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
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="input" required />
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="input" />

                    <div className="grid grid-cols-2 gap-4">
                        <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price per night" className="input" required />
                        <input name="maxGuests" type="number" value={formData.maxGuests} onChange={handleChange} placeholder="Max guests" className="input" required />
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
                            {["address", "city", "zip", "country", "continent", "lat", "lng"].map((field) => (
                                <input
                                    key={field}
                                    name={field}
                                    value={String(formData.location[field])}
                                    onChange={handleChange}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    className="input"
                                    type={["lat", "lng"].includes(field) ? "number" : "text"}
                                />
                            ))}
                        </div>
                    </fieldset>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Create Venue
                    </button>
                </form>
            </div>
        </div>
    );
}
