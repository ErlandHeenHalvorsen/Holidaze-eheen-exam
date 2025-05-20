import { Routes, Route } from "react-router";
import Layout from "./Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import VenueById from "./pages/VenueById";
import Venues from "./pages/Venues";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="auth" element={<Auth />} />
                <Route path="profile" element={<Profile />} />
                <Route path="venues" element={<Venues />} />
                <Route path="venues/:id" element={<VenueById />} />
            </Route>
        </Routes>
    );
}
export default App;