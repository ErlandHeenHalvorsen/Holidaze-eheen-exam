import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import ProfileHeader from "./ProfileHeader";
import CreateVenueModal from "./CreateVenueModal";

export default function ProfilePage() {
    const user = useAuthStore((s) => s.user);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user) return <p className="text-center mt-10">You must be logged in to view your profile.</p>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
            <ProfileHeader user={user} />

            <div className="flex justify-between items-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                >
                    Create New Venue
                </button>
                <button
                    onClick={clearAuth}
                    className="text-red-600 hover:underline"
                >
                    Log out
                </button>
            </div>

            <CreateVenueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
