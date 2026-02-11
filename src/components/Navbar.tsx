import { Link } from 'react-router-dom';

const Navbar = () => {

    return (
        <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white shadow-md font-sans">
            <div className="container mx-auto px-6">
                {/* Top Section: Logo, NavLinks, Button */}
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    {/* Logo (Top Left) */}
                    <Link to="/" className="flex items-center group flex-shrink-0 md:-ml-20">
                        <img
                            src="/logo1.jpg"
                            alt="TravelApp Logo"
                            className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Nav Links (Center) */}
                    <div className="hidden md:flex items-center space-x-6">
                        {['Home', 'Destinations', 'Packages', 'About', 'Contact', 'Bookings'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                                className="font-semibold transition-colors hover:text-red-600 text-gray-800 text-xs uppercase tracking-wide"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Book Now (Top Right) */}
                    <div className="hidden md:block flex-shrink-0 md:-mr-20">
                        <Link to="/packages" className="px-5 py-1.5 rounded-lg font-bold transition-all inline-block hover:scale-105 bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/10 active:scale-95 text-xs">
                            Book Now
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button className="p-2 rounded-md text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Bottom Section: Search Bar */}
                <div className="py-2 px-4 md:px-20 lg:px-40">
                    <div className="relative group max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search for luxury tours, destinations or packages..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-full py-1.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-red-500/10 focus:border-red-500 transition-all text-xs placeholder:text-gray-400 shadow-inner"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
