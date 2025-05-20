import { Link } from "react-router";

const VenueCard = ({ venue }) => {
    const {
        id,
        name,
        location,
        price,
        rating,
        media,
    } = venue;

    const imageUrl = media?.[0]?.url || "https://via.placeholder.com/300x200";
    const imageAlt = media?.[0]?.alt || "Venue image";

    return (
        <Link
            to={`/venues/${id}`}
            className="block transition-transform transform hover:scale-105 duration-200"
        >
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow w-[300px]">
                <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-1">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
                        <span className="text-sm text-yellow-500 font-medium">
                            {rating ? `${rating}/5` : "–"}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">
                        {location?.city || "Unknown"}, {location?.country || ""}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                        ${price} <span className="text-gray-500">per night</span>
                    </p>
                    <div className="text-yellow-400 text-sm">
                        {"★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VenueCard;
