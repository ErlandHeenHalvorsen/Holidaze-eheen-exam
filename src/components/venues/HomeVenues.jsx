import VenueCard from "./VenueCard";
import useFetch from "../../utils/useFetch";

const HomeVenuesShowcase = () => {
    const { data: venues, loading, error } = useFetch("https://v2.api.noroff.dev/holidaze/venues");

    if (loading) return <p className="text-center">Loading venues...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;
    if (!Array.isArray(venues)) return <p className="text-center text-red-600">No venue data available.</p>;

    const topRated = [...venues]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

    const cheapest = [...venues]
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);

    const randomGood = [...venues]
        .filter((v) => v.rating > 3)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    return (
        <>
            <section>
                <h2 className="text-2xl font-semibold mb-6 text-center">Top Rated Venues</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {topRated.map((venue) => (
                        <VenueCard key={venue.id} venue={venue} />
                    ))}
                </div>
            </section>

            <section className="mt-16">
                <h2 className="text-2xl font-semibold mb-6 text-center">Cheapest Venues</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {cheapest.map((venue) => (
                        <VenueCard key={venue.id} venue={venue} />
                    ))}
                </div>
            </section>

            <section className="mt-16">
                <h2 className="text-2xl font-semibold mb-6 text-center">Hidden Gems</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {randomGood.map((venue) => (
                        <VenueCard key={venue.id} venue={venue} />
                    ))}
                </div>
            </section>
        </>
    );
};

export default HomeVenuesShowcase;

