import { Link } from "react-router";

const Header = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">
                    <Link to="/">Holidaze</Link>
                </h1>
                <nav className="flex space-x-6 text-gray-700 font-medium">
                    <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                    <Link to="/venues" className="hover:text-blue-600 transition">Venues</Link>
                    <Link to="/auth" className="hover:text-blue-600 transition">Login</Link>
                    <Link to="/profile" className="hover:text-blue-600 transition">Profile</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
