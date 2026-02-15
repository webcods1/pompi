import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BusBooking = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop"
                    alt="Bus Travel"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center p-6">
                    <h1 className="text-5xl font-display font-bold mb-4">Bus Booking</h1>
                    <p className="text-xl max-w-2xl">Travel comfortably across cities with our premium bus partners.</p>
                </div>
            </div>

            {/* Booking Form Section */}
            <div className="container mx-auto px-4 -mt-24 relative z-10 mb-20">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                        <span className="bg-red-100 text-red-600 p-3 rounded-xl">🚌</span>
                        Search Buses
                    </h2>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-400">📍</span>
                                    <input
                                        type="text"
                                        placeholder="Leaving from..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-400">🏁</span>
                                    <input
                                        type="text"
                                        placeholder="Going to..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-400">📅</span>
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-lg">
                                Search Buses
                            </button>
                        </div>
                    </form>

                    {/* Features */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-8">
                        <div className="text-center">
                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💤</div>
                            <h4 className="font-bold text-gray-800">Sleeper Coaches</h4>
                            <p className="text-sm text-gray-500 mt-2">Rest comfortably on long journeys</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">❄️</div>
                            <h4 className="font-bold text-gray-800">AC Buses</h4>
                            <p className="text-sm text-gray-500 mt-2">Climate controlled travel</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📍</div>
                            <h4 className="font-bold text-gray-800">Live Tracking</h4>
                            <p className="text-sm text-gray-500 mt-2">Know exactly where your bus is</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BusBooking;
