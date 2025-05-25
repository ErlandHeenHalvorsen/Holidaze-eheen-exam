import React from "react";

export default function ProfileHeader({ user }) {
    if (!user) return null;

    const avatarUrl = user.avatar?.url || "";
    const avatarAlt = user.avatar?.alt || "User avatar";

    const bannerUrl = user.banner?.url || "";
    const bannerAlt = user.banner?.alt || "Profile banner";

    return (
        <div className="rounded-xl overflow-hidden shadow-md">
            {/* Banner */}
            <div className="relative h-40 w-full bg-gray-200">
                {bannerUrl && (
                    <img
                        src={bannerUrl}
                        alt={bannerAlt}
                        className="w-full h-full object-cover"
                    />
                )}
                {/* Avatar */}
                <div className="absolute -bottom-12 left-6">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={avatarAlt}
                            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl border-4 border-white shadow">
                            {user.name?.[0]?.toUpperCase() || "?"}
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="pt-16 pb-6 px-6">
                <h1 className="text-2xl font-semibold">{user.name || "Unnamed"}</h1>
                <p className="text-gray-600">{user.email || "No email provided"}</p>
            </div>
        </div>
    );
}
