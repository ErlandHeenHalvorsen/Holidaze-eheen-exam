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
                    `https://v2.api.noroff.dev/holidaze/profiles/${user.name}/bookings?_venue=true&_customer=true`,
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
                            className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                        >
                            {image && (
                                <img
                                    src={image}
                                    alt={alt}
                                    className="w-full h-40 object-cover"
                                />
                            )}
                            <div className="p-4 space-y-2">
                                <h2 className="text-xl font-semibold text-gray-800 truncate">
                                    {venue?.name || "Unknown Venue"}
                                </h2>
                                <p className="text-sm text-gray-600 italic">
                                    {venue?.location?.city || "Unknown"},{" "}
                                    {venue?.location?.country || ""}
                                </p>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <p>
                                        <span className="font-medium">From:</span>{" "}
                                        {new Date(booking.dateFrom).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-medium">To:</span>{" "}
                                        {new Date(booking.dateTo).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-medium">Guests:</span> {booking.guests}
                                    </p>
                                </div>
                                <div className="pt-2 text-sm text-gray-500">
                                    Booking ID: <span className="text-gray-800">{booking.id}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
