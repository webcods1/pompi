import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TrainBooking = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1600&auto=format&fit=crop"
                    alt="Train Journey"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/40 flex flex-col justify-center items-center text-white text-center p-6">
                    <h1 className="text-5xl font-display font-bold mb-4">Train Booking</h1>
                    <p className="text-xl max-w-2xl">Connect across the nation with fast and reliable railway networks.</p>
                </div>
            </div>

            {/* Booking Form Section */}
            <div className="container mx-auto px-4 -mt-24 relative z-10 mb-20">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 p-3 rounded-xl">🚆</span>
                        Find Trains
                    </h2>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From Station</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-400">🚉</span>
                                    <input
                                        type="text"
                                        placeholder="Origin..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To Station</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-400">🏁</span>
                                    <input
                                        type="text"
                                        placeholder="Destination..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-400">📅</span>
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                                    <option>All Classes</option>
                                    <option>Sleeper (SL)</option>
                                    <option>AC 3 Tier (3A)</option>
                                    <option>AC 2 Tier (2A)</option>
                                    <option>First Class (1A)</option>
                                    <option>Chair Car (CC)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quota</label>
                                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                                    <option>General</option>
                                    <option>Tatkal</option>
                                    <option>Ladies</option>
                                    <option>Senior Citizen</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-lg">
                                Search Trains
                            </button>
                        </div>
                    </form>

                    {/* Features */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-8">
                        <div className="text-center">
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚡</div>
                            <h4 className="font-bold text-gray-800">Fast Booking</h4>
                            <p className="text-sm text-gray-500 mt-2">IRCTC Authorized Partner</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🍲</div>
                            <h4 className="font-bold text-gray-800">E-Catering</h4>
                            <p className="text-sm text-gray-500 mt-2">Order food on trip</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔄</div>
                            <h4 className="font-bold text-gray-800">Easy Refund</h4>
                            <p className="text-sm text-gray-500 mt-2">Instant cancellation refunds</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TrainBooking;
