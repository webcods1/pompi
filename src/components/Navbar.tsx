import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; // For stricter mobile lock
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

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
                {/* Top Section: Desktop Only */}
                <div className={`hidden md:flex relative items-center justify-center border-b border-gray-50 transition-all duration-300 ease-in-out overflow-hidden ${isScrolled ? 'max-h-0 py-0 opacity-0 border-transparent' : 'max-h-20 py-2 opacity-100'}`}>
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
                </div>

                {/* Bottom Section: Mobile (Logo+Search+Toggle) & Desktop (Search+ScrolledLogo) */}
                <div className="py-2 px-4 md:px-6 flex items-center gap-2 md:gap-4">
                    {/* Logo - Scrolled Desktop OR Mobile Always */}
                    <Link
                        to="/"
                        className={`flex items-center group flex-shrink-0 transition-all duration-300 md:opacity-0 md:w-0 md:overflow-hidden ${isScrolled ? 'md:!opacity-100 md:!w-auto' : ''}`}
                    >
                        <img
                            src="/logo1.jpg"
                            alt="TravelApp Logo"
                            className="h-8 md:h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Search Bar */}
                    <div className="relative group flex-1 max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-full py-1.5 pl-8 md:pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-red-500/10 focus:border-red-500 transition-all text-xs placeholder:text-gray-400 shadow-inner"
                        />
                        <div className="absolute left-2.5 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle (Right) */}
                    <div className="md:hidden flex-shrink-0">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-1.5 text-gray-800 bg-gray-50 rounded-full hover:bg-gray-100 transition-all duration-300 hover:rotate-90 active:scale-90"
                            aria-label="Open menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>

                    {/* Book Now - Desktop Only (Scrolled) */}
                    <Link
                        to="/packages"
                        className={`hidden md:inline-block flex-shrink-0 px-5 py-1.5 rounded-lg font-bold transition-all hover:scale-105 bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/10 active:scale-95 text-xs whitespace-nowrap ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        Book Now
                    </Link>
                </div>
            </div>
            {/* Mobile Sidebar Menu (Left Slide-in) */}
            <div className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none delay-300'}`}>
                {/* Backdrop Overlay */}
                <div
                    className="absolute inset-0 bg-white/90 backdrop-blur-md touch-none"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>

                {/* Sidebar Panel - Full Screen */}
                <div className={`absolute top-0 left-0 w-screen h-screen bg-white shadow-none transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 h-full flex flex-col overflow-y-auto">
                        {/* Header: Logo + Close Button */}
                        {/* Header: Close Button Only (Logo Removed) */}
                        <div className="flex items-center justify-end mb-8">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 -mr-2 text-gray-500 hover:text-red-600 transition-colors bg-gray-50 rounded-full hover:rotate-90 duration-300"
                                aria-label="Close menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Nav Links */}
                        <div className="flex flex-col space-y-4 flex-1">
                            {['Home', 'Destinations', 'Packages', 'About', 'Contact', 'Bookings'].map((item) => (
                                <Link
                                    key={item}
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50 group transition-all"
                                >
                                    <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">{item}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </Link>
                            ))}
                        </div>

                        {/* Footer: Book Button */}
                        <div className="mt-auto pt-6 border-t border-gray-100">
                            <Link
                                to="/packages"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full text-center py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

