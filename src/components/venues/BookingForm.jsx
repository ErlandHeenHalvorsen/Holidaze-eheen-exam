import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

const BookingForm = ({ venueId }) => {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [guests, setGuests] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const { accessToken } = useAuthStore.getState();
        const apiKey = import.meta.env.VITE_NOROFF_API_KEY;


        try {
            const response = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "X-Noroff-API-Key": apiKey,
                },
                body: JSON.stringify({
                    dateFrom,
                    dateTo,
                    guests: parseInt(guests, 10),
                    venueId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errors?.[0]?.message || "Booking failed");
            }

            setSuccess("Booking successful!");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleBooking} className="space-y-4 mt-8 p-4 border rounded-md">
            <h3 className="text-xl font-semibold">Book this Venue</h3>

            <div>
                <label className="block">From</label>
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    required
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label className="block">To</label>
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    required
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label className="block">Guests</label>
                <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="1"
                    required
                    className="border p-2 w-full"
                />
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {loading ? "Booking..." : "Book Now"}
            </button>
        </form>
    );
};

export default BookingForm;
