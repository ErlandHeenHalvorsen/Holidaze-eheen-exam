import React, { useState, useEffect } from "react";
import VenueCard from "./VenueCard";

const VenuesMain = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageFound, setPageFound] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        let active = true;
        const controller = new AbortController();

        const fetchInitialVenues = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    "https://v2.api.noroff.dev/holidaze/venues?limit=100&page=1&_owner=true&_bookings=true&sort=created&sortOrder=desc",
                    { signal: controller.signal }
                );
                const json = await res.json();
                if (!res.ok) {
                    throw new Error(json.errors?.[0]?.message || "Failed to fetch venues");
                }
                if (active) {
                    setVenues(json.data);
                    setPageFound(1);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        const fetchMatchingPage = async () => {
            setLoading(true);
            setError(null);
            let page = 1;
            let matchFound = false;

            while (!matchFound && active) {
                try {
                    const res = await fetch(
                        `https://v2.api.noroff.dev/holidaze/venues?limit=100&page=${page}&_owner=true&_bookings=true`,
                        { signal: controller.signal }
                    );
                    const json = await res.json();

                    if (!res.ok) {
                        throw new Error(json.errors?.[0]?.message || "Failed to fetch venues");
                    }

                    const matches = json.data.filter((venue) => {
                        const term = debouncedSearch.toLowerCase();
                        const name = venue.name?.toLowerCase() || "";
                        const city = venue.location?.city?.toLowerCase() || "";
                        const country = venue.location?.country?.toLowerCase() || "";
                        const address = venue.location?.address?.toLowerCase() || "";
                        const continent = venue.location?.continent?.toLowerCase() || "";

                        return (
                            name.includes(term) ||
                            city.includes(term) ||
                            country.includes(term) ||
                            address.includes(term) ||
                            continent.includes(term)
                        );
                    });

                    if (matches.length > 0) {
                        setVenues(matches);
                        setPageFound(page);
                        matchFound = true;
                    } else if (json.meta?.isLastPage) {
                        setVenues([]);
                        setPageFound(null);
                        matchFound = true;
                    } else {
                        page++;
                    }
                } catch (err) {
                    if (err.name !== "AbortError") {
                        setError(err.message);
                        break;
                    }
                }
            }

            if (active) setLoading(false);
        };

        if (debouncedSearch.length > 0) {
            fetchMatchingPage();
        } else {
            fetchInitialVenues();
        }

        return () => {
            active = false;
            controller.abort();
        };
    }, [debouncedSearch]);

    return (
        <div className="px-4 py-8 max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search venues by name, city, country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {loading && <p className="text-center text-lg">Loading venues...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && venues.length === 0 && (
                <p className="text-center text-gray-600">
                    No venues found{debouncedSearch ? ` for "${debouncedSearch}"` : ""}
                </p>
            )}

            {venues.length > 0 && (
                <>
                    <div className="flex flex-wrap justify-center gap-4">
                        {venues.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default VenuesMain;
