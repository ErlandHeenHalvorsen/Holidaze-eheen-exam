import useFetch from "../../utils/useFetch";
import { useAuthStore } from "../../stores/useAuthStore";

export default function VenuesByUser() {
    const user = useAuthStore((s) => s.user);
    const accessToken = useAuthStore((s) => s.accessToken);

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

    return (
        <div className="space-y-6 mt-10">
            <h2 className="text-2xl font-semibold">Your Venues</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {venues.map((venue) => {
                    const image = venue.media?.[0]?.url;
                    const alt = venue.media?.[0]?.alt || "Venue image";

                    return (
                        <div key={venue.id} className="">
                            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl w-[300px]">
                                <img
                                    src={venue.media?.[0]?.url}
                                    alt={venue.media?.[0]?.alt || "Venue image"}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-gray-800 truncate">{venue.name}</h2>
                                        <span className="text-sm text-yellow-500 font-medium">
                                            {venue.rating ? `${venue.rating}/5` : "–"}
                                        </span>
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
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
