import useFetch from "../../utils/useFetch";
import { useAuthStore } from "../../stores/useAuthStore";
import EditVenueModal from "./EditVenue";
import { useState } from "react";

export default function VenuesByUser() {
    const user = useAuthStore((s) => s.user);
    const accessToken = useAuthStore((s) => s.accessToken);
    const [editingVenue, setEditingVenue] = useState(null);
    const [deletingVenue, setDeletingVenue] = useState(null);

    const url = user?.name
        ? `https://v2.api.noroff.dev/holidaze/profiles/${user.name}/venues`
        : null;

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
    };

    const { data: venues, loading, error } = useFetch(url, { headers });

    if (!user) return <p className="text-center mt-10">You must be logged in to view your venues.</p>;
    if (loading) return <p>Loading venues...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!venues || venues.length === 0) return <p className="text-gray-600">No venues found.</p>;

    const handleDelete = async (venueId) => {
        try {
            const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete venue");
            }

            // Optionally, refresh the venues list after deletion
            // setVenues(venues.filter((venue) => venue.id !== venueId));
        } catch (error) {
            console.error("Error deleting venue:", error);
        }
    }

    return (
        <div className="space-y-6 mt-10">
            <h2 className="text-2xl font-semibold">Your Venues</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {venues.map((venue) => {
                    const image = venue.media?.[0]?.url;
                    const alt = venue.media?.[0]?.alt || "Venue image";

                    return (
                        <div key={venue.id}>
                            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl w-[300px] relative">
                                <img
                                    src={venue.media?.[0]?.url}
                                    alt={venue.media?.[0]?.alt || "Venue image"}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 space-y-1 pb-16"> {/* Leave space for buttons */}
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-gray-800 truncate">{venue.name}</h2>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {venue.location?.city || "Unknown"}, {venue.location?.country || ""}
                                    </p>
                                    <p className="text-sm text-gray-700 font-medium">
                                        ${venue.price} <span className="text-gray-500">per night</span>
                                    </p>
                                    <div className="text-yellow-400 text-sm">
                                        {"★".repeat(Math.floor(venue.rating)) + "☆".repeat(5 - Math.floor(venue.rating))}
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="absolute bottom-3 right-3 flex space-x-2">
                                    <button
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-sm rounded"
                                        onClick={() => setEditingVenue(venue)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                                        onClick={() => setDeletingVenue(venue)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {editingVenue && (
                <EditVenueModal
                    venue={editingVenue}
                    onClose={() => setEditingVenue(null)}
                    onUpdate={() => {
                        setEditingVenue(null);

                    }}
                />
            )}
            {deletingVenue && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">Delete Venue</h3>
                        <p className="mb-4 text-sm text-gray-700">
                            Are you sure you want to delete <strong>{deletingVenue.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setDeletingVenue(null)}
                                className="px-4 py-2 rounded text-gray-600 hover:text-black"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch(
                                            `https://v2.api.noroff.dev/holidaze/venues/${deletingVenue.id}`,
                                            {
                                                method: "DELETE",
                                                headers: {
                                                    Authorization: `Bearer ${accessToken}`,
                                                    "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
                                                },
                                            }
                                        );

                                        if (!response.ok) {
                                            throw new Error("Failed to delete venue");
                                        }

                                        setDeletingVenue(null);
                                        // Optional: trigger refresh or state update
                                        window.location.reload(); // or refetch logic
                                    } catch (err) {
                                        console.error("Delete failed:", err);
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
