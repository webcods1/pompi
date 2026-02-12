import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-screen-xl z-50 transition-all duration-300 bg-white shadow-md font-sans">
            <div className="container mx-auto px-6">
                {/* Top Section: Logo, NavLinks, Button */}
                <div className={`relative flex items-center justify-center border-b border-gray-50 transition-all duration-300 ease-in-out overflow-hidden ${isScrolled ? 'max-h-0 py-0 opacity-0 border-transparent' : 'max-h-20 py-2 opacity-100'}`}>
                    {/* Logo (Top Left) */}
                    <Link to="/" className="absolute left-6 flex items-center group flex-shrink-0">
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

                    {/* Book Now (Top Right) - in nav links row */}
                    <div className="absolute right-6 hidden md:block flex-shrink-0">
                        <Link to="/packages" className="px-5 py-1.5 rounded-lg font-bold transition-all inline-block hover:scale-105 bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/10 active:scale-95 text-xs whitespace-nowrap">
                            Book Now
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="absolute right-6 md:hidden">
                        <button className="p-2 rounded-md text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Bottom Section: Logo (when scrolled) + Search Bar + Book Now */}
                <div className="py-2 px-4 md:px-6 flex items-center gap-4">
                    {/* Logo - shows when nav links are hidden */}
                    <Link
                        to="/"
                        className={`flex items-center group flex-shrink-0 transition-all duration-300 ${isScrolled ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}
                    >
                        <img
                            src="/logo1.jpg"
                            alt="TravelApp Logo"
                            className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Search Bar */}
                    <div className="relative group flex-1 max-w-2xl mx-auto">
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

                    {/* Book Now - shows when nav links are hidden */}
                    <Link
                        to="/packages"
                        className={`hidden md:inline-block flex-shrink-0 px-5 py-1.5 rounded-lg font-bold transition-all hover:scale-105 bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/10 active:scale-95 text-xs whitespace-nowrap ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

