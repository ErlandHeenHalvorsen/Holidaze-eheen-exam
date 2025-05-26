import HomeMain from "../components/home/HomeMain";
import heroImg from "../assets/heroexam.png";
const Home = () => {
    return (
        <div>
            <section
                className="bg-cover bg-center h-[80vh] relative"
                style={{ backgroundImage: `url(${heroImg})` }}
            >
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
                    <h1 className="text-4xl sm:text-6xl font-bold mb-4">Find your next escape</h1>
                    <p className="text-lg sm:text-xl mb-6 max-w-xl">Explore unique venues hosted by real people  wherever you want to go.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="/venues" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100">Browse Venues</a>
                        <a href="/auth" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700">Become a Host</a>
                    </div>
                </div>
            </section>
            <HomeMain />
        </div>
    )
}
export default Home;