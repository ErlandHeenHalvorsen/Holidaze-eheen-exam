import React from "react";
import useFetch from "../../utils/useFetch";
import VenueCard from "./VenueCard";

const VenuesMain = () => {
    const { data, loading, error } = useFetch("https://v2.api.noroff.dev/holidaze/venues");

    if (loading) return <p>Loading venues...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            padding: "2rem"
        }}>
            {data?.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
            ))}
        </div>
    );
};

export default VenuesMain;
