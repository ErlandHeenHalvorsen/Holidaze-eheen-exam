import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="bg-white shadow-inner mt-12">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
                <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
                <nav className="flex space-x-4">
                    <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                    <Link to="/venues" className="hover:text-blue-600 transition">Venues</Link>
                    <Link to="/profile" className="hover:text-blue-600 transition">Profile</Link>
                    <Link to="/auth" className="hover:text-blue-600 transition">Login</Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
