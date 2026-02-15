import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';


const Bookings = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero Section for Bookings */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-24 pb-32 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 container mx-auto px-6">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-md">
                        Start Your Journey Here
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Book flights, buses, trains, and hotels seamlessly.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Booking Options Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Bus Booking Card */}
                    <Link to="/bookings/bus" className="block group">
                        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-red-50 overflow-hidden h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop"
                                    alt="Bus Travel"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">Bus</h3>
                                <p className="text-gray-500 mb-6 text-sm">Comfortable AC & sleeper buses for intercity travel.</p>
                                <div className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg group-hover:bg-red-700 transition-colors shadow-lg shadow-red-200 pointer-events-none text-center">
                                    Book Bus
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Train Booking Card */}
                    <Link to="/bookings/train" className="block group">
                        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-50 overflow-hidden h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=800&auto=format&fit=crop"
                                    alt="Train Journey"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Train</h3>
                                <p className="text-gray-500 mb-6 text-sm">Fast & secure railway reservations across India.</p>
                                <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 pointer-events-none">
                                    Book Train
                                </button>
                            </div>
                        </div>
                    </Link>

                    {/* Flight Booking Card */}
                    <Link to="/bookings/flight" className="block group">
                        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-sky-50 overflow-hidden h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop"
                                    alt="Flight Travel"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors">Flight</h3>
                                <p className="text-gray-500 mb-6 text-sm">Domestic & International flights at best prices.</p>
                                <button className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg group-hover:bg-sky-600 transition-colors shadow-lg shadow-sky-200 pointer-events-none">
                                    Book Flight
                                </button>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Placeholder for Booking History/Active Bookings */}
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Your Recent Bookings</h2>
                        <button className="text-blue-600 font-semibold hover:underline">View All History</button>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-12 text-center border border-dashed border-gray-300">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-600">No upcoming trips</h3>
                        <p className="text-gray-500 mb-6">Looks like you haven't booked anything yet.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Bookings;
