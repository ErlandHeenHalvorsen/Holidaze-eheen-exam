import { useParams } from "react-router";
import VenueByIdComponent from "../components/venues/VenueByIdComponent";

const VenueById = () => {
    const { id } = useParams(); // Get ID from URL

    return (
        <div>

            <VenueByIdComponent id={id} />
        </div>
    );
};

export default VenueById;
