import { useEffect, useState } from "react";
import BookingForm from "./BookingForm";

const VenueByIdComponent = ({ id }) => {
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`);
                const result = await response.json();
                setVenue(result.data);
            } catch (error) {
                console.error("Error fetching venue:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVenue();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!venue) return <p>Venue not found.</p>;

    const {
        name,
        description,
        media,
        price,
        maxGuests,
        rating,
        meta,
        location,
        created,
        updated,
    } = venue;

    const imageUrl = media?.[0]?.url || "https://via.placeholder.com/600x400";
    const imageAlt = media?.[0]?.alt || "Venue image";

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
            <h2 className="text-3xl font-bold">{name}</h2>
            <img src={imageUrl} alt={imageAlt} className="w-full h-64 object-cover rounded-lg" />

            <div className="space-y-2">
                <p className="text-gray-700">{description}</p>
                <p><strong>Price:</strong> ${price} per night</p>
                <p><strong>Max Guests:</strong> {maxGuests}</p>
                <p><strong>Rating:</strong> {rating ? `${rating}/5` : "Not rated"}</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold">Amenities</h3>
                <ul className="list-disc list-inside">
                    {meta.wifi && <li>WiFi</li>}
                    {meta.parking && <li>Parking</li>}
                    {meta.breakfast && <li>Breakfast</li>}
                    {meta.pets && <li>Pets allowed</li>}
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-semibold">Location</h3>
                {location?.address && <p>{location.address}{location.zip ? `, ${location.zip}` : ""}</p>}
                {(location?.city || location?.country) && (
                    <p>
                        {location.city || "Unknown City"}, {location.country || "Unknown Country"}
                    </p>
                )}
                {location?.continent && <p>{location.continent}</p>}
            </div>

            <div className="text-sm text-gray-500">
                <p>Created: {new Date(created).toLocaleString()}</p>
                <p>Updated: {new Date(updated).toLocaleString()}</p>
            </div>
            <BookingForm venueId={id} />
        </div>
    );
};

export default VenueByIdComponent;
