import Header from "./components/header/Header";
import Footer from "./components/header/Footer";
import { Outlet } from "react-router";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
