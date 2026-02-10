import { Link } from 'react-router-dom';

const Navbar = () => {

    return (
        <nav
            className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white shadow-md py-4 font-sans"
        >
            <div className="w-full px-6 flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo1.jpg"
                            alt="TravelApp Logo"
                            className="h-6 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>
                </div>

                <div className="hidden md:flex space-x-8">
                    {['Home', 'Destinations', 'Packages', 'About', 'Contact', 'Bookings'].map((item) => (
                        <Link
                            key={item}
                            to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                            className="font-medium transition-colors hover:text-blue-600 text-gray-700"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:block">
                    <Link to="/packages" className="px-6 py-2 rounded-full font-semibold transition-transform inline-block hover:scale-105 bg-blue-600 text-white hover:bg-blue-700">
                        Book Now
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button className="p-2 rounded-md text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
