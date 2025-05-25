import React, { useState, useEffect } from "react";
import useFetch from "../../utils/useFetch";
import VenueCard from "./VenueCard";

const VenuesMain = () => {
    const { data, loading, error } = useFetch("https://v2.api.noroff.dev/holidaze/venues");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const venuesPerPage = 18;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    if (loading) return <p className="text-center text-lg mt-10">Loading venues...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

    const filteredVenues = data?.filter((venue) => {
        const city = venue.location?.city?.toLowerCase() || "";
        const country = venue.location?.country?.toLowerCase() || "";
        const searchTerm = debouncedSearch.toLowerCase();
        const matchesLocation = city.includes(searchTerm) || country.includes(searchTerm);
        const matchesRating = venue.rating >= minRating;
        return matchesLocation && matchesRating;
    }) || [];

    const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);
    const startIndex = (currentPage - 1) * venuesPerPage;
    const currentVenues = filteredVenues.slice(startIndex, startIndex + venuesPerPage);

    return (
        <div className="px-4 py-8 max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by city or country"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={minRating}
                    onChange={(e) => {
                        setMinRating(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="w-full max-w-[150px] px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={0}>All Ratings</option>
                    <option value={1}>1★ and up</option>
                    <option value={2}>2★ and up</option>
                    <option value={3}>3★ and up</option>
                    <option value={4}>4★ and up</option>
                    <option value={5}>5★ only</option>
                </select>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                {currentVenues.length > 0 ? (
                    currentVenues.map((venue) => (
                        <VenueCard key={venue.id} venue={venue} />
                    ))
                ) : (
                    <p className="text-center text-gray-600 mt-10">
                        No venues found matching "{debouncedSearch}" with rating {minRating}★ and up
                    </p>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-1 rounded ${currentPage === pageNum
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 hover:bg-gray-300"
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default VenuesMain;
