// src/components/BookingsByUser.jsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

export default function BookingsByUser() {
    const user = useAuthStore((s) => s.user);
    const accessToken = useAuthStore((s) => s.accessToken);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user?.name || !accessToken) return;

            try {
                const response = await fetch(
                    `https://v2.api.noroff.dev/holidaze/profiles/${user.name}/bookings`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.errors?.[0]?.message || "Could not fetch bookings");
                }

                setBookings(data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, accessToken]);

    return (
        <div className="space-y-6 mt-10">
            <h2 className="text-2xl font-semibold">Your Bookings</h2>

            {loading && <p>Loading bookings...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && bookings.length === 0 && (
                <p className="text-gray-600">You have no bookings yet.</p>
            )}

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {bookings.map((booking) => {
                    const venue = booking.venue;
                    const image = venue?.media?.[0]?.url;
                    const alt = venue?.media?.[0]?.alt || "Venue image";

                    return (
                        <div
                            key={booking.id}
                            className="bg-white rounded-xl overflow-hidden shadow-md "
                        >
                            <div className="relative h-48 w-full bg-gray-200">
                                {booking.venue?.media?.[0]?.url && (
                                    <img
                                        src={booking.venue.media[0].url}
                                        alt={booking.venue.media[0].alt || "Venue image"}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="p-4 space-y-1">
                                <h2 className="text-lg font-semibold text-gray-800 truncate">
                                    {booking.venue?.name || "Unknown Venue"}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {booking.venue?.location?.city || "Unknown"},{" "}
                                    {booking.venue?.location?.country || ""}
                                </p>
                                <p className="text-sm text-gray-700 font-medium">
                                    From: {new Date(booking.dateFrom).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-700 font-medium">
                                    To: {new Date(booking.dateTo).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-700">
                                    Guests: {booking.guests}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
