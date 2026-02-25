import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
const Navbar = () => {
    const location = useLocation();
    const { currentUser, openLoginModal } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDestDropdownOpen, setIsDestDropdownOpen] = useState(false);
    const [isMobileDestOpen, setIsMobileDestOpen] = useState(false);
    const dropdownTimeout = useRef<any>(null);

    const handleOpenDropdown = () => {
        if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
        setIsDestDropdownOpen(true);
    };

    const handleCloseDropdown = () => {
        dropdownTimeout.current = setTimeout(() => {
            setIsDestDropdownOpen(false);
        }, 300); // 300ms grace period to cross gaps
    };

    const megaDestinations = [
        {
            title: 'Popular Regions',
            links: [
                { name: 'North India', path: '/destinations' },
                { name: 'South India', path: '/destinations#Kerala' },
                { name: 'Rajasthan', path: '/destinations#Rajasthan' },
                { name: 'Goa', path: '/destinations#Goa' },
            ]
        },
        {
            title: 'Special Packages',
            links: [
                { name: 'Kerala Specials', path: '/kerala-packages' },
                { name: 'Honeymoon Tours', path: '/packages' },
                { name: 'Adventure Trips', path: '/packages' },
                { name: 'Family Holidays', path: '/packages' },
            ]
        },
        {
            title: 'Quick Access',
            links: [
                { name: 'All Destinations', path: '/destinations' },
                { name: 'View All Packages', path: '/packages' },
                { name: 'International', path: '/packages' },
                { name: 'Trending Deals', path: '/packages#exclusive-offers' },
            ]
        }
    ];

    const destinationLinks = megaDestinations.flatMap(cat => cat.links.map(l => ({ name: l.name, path: l.path })));



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
        <nav className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 bg-white shadow-md font-sans">
            <div className="container mx-auto px-1 md:px-6">
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
                        {['Home', 'Destinations', 'Packages', 'Bookings', 'About', 'Contact'].map((item) => {
                            const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`;
                            const isActive = location.pathname === path;

                            if (item === 'Destinations') {
                                return (
                                    <div
                                        key={item}
                                        className="relative group py-2"
                                        onMouseEnter={handleOpenDropdown}
                                        onMouseLeave={handleCloseDropdown}
                                    >
                                        <Link
                                            to="/destinations"
                                            className={`font-semibold text-xs uppercase tracking-wide transition-all flex items-center gap-1 ${isActive
                                                ? 'text-red-600 font-bold border-b-2 border-red-600 pb-0.5'
                                                : 'text-gray-800 hover:text-red-600'
                                                }`}
                                        >
                                            {item}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3 h-3 transition-transform duration-300 ${isDestDropdownOpen ? 'rotate-180' : ''}`}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </Link>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item}
                                    to={path}
                                    className={`font-semibold text-xs uppercase tracking-wide transition-all ${isActive
                                        ? 'text-red-600 font-bold border-b-2 border-red-600 pb-0.5'
                                        : 'text-gray-800 hover:text-red-600'
                                        }`}
                                >
                                    {item}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side: Phone + Book Now */}
                    <div className="absolute right-6 hidden md:flex items-center gap-3 flex-shrink-0">
                        <a
                            href="tel:+919876543210"
                            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors group border border-gray-100"
                            aria-label="Call us"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                        </a>
                        {currentUser ? (
                            <Link
                                to="/profile"
                                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors group border border-gray-100"
                                aria-label="Profile"
                                title="Profile"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </Link>
                        ) : (
                            <button
                                onClick={() => openLoginModal('login')}
                                className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs transition-colors"
                            >
                                Login
                            </button>
                        )}
                        <Link to="/packages" className="px-5 py-1.5 rounded-lg font-bold transition-all inline-block hover:scale-105 bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/10 active:scale-95 text-xs whitespace-nowrap">
                            Book Now
                        </Link>
                    </div>
                </div>

                {/* ========== MOBILE: Two-Section Navbar ========== */}
                <div className="md:hidden">
                    {/* Mobile Row 1: Toggle+Logo (left) | Profile (right) */}
                    <div className="py-2 px-0 flex items-center justify-between">
                        {/* Left group: Toggle + Logo */}
                        <div className="flex items-center gap-2">
                            {/* Toggle Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-1.5 text-gray-800 bg-gray-50 rounded-full hover:bg-gray-100 transition-all duration-300 hover:rotate-90 active:scale-90 flex-shrink-0"
                                aria-label="Open menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>

                            {/* Logo */}
                            <Link to="/" className="flex items-center group flex-shrink-0">
                                <img
                                    src="/logom.jpg"
                                    alt="TravelApp Logo"
                                    className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </Link>
                        </div>

                        {/* Right group: Phone + Profile */}
                        <div className="flex items-center gap-1.5">
                            {/* Phone Icon */}
                            <a
                                href="tel:+919876543210"
                                className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 active:scale-90 border border-gray-200"
                                aria-label="Call us"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </a>


                            {/* Profile Icon */}
                            {/* Profile Icon or Login */}
                            {currentUser ? (
                                <Link
                                    to="/profile"
                                    className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 active:scale-90 border border-gray-200"
                                    aria-label="Profile"
                                    title="Profile"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => openLoginModal('login')}
                                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs"
                                >
                                    Login
                                </button>
                            )}

                        </div>
                    </div>
                    {/* Mobile Row 2: Search Bar (full width, edge-to-edge) */}
                    <div className="relative group w-full border-t border-gray-100 pb-2">
                        <input
                            type="text"
                            placeholder="Search destinations, packages..."
                            className="w-full bg-gray-50 py-2 pl-9 pr-4 focus:outline-none focus:bg-white focus:ring-0 transition-all text-xs placeholder:text-gray-400"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ========== DESKTOP: Original Bottom Section ========== */}
                <div className="hidden md:flex py-2 px-6 items-center gap-4">
                    {/* Logo - Scrolled Desktop */}
                    <Link
                        to="/"
                        className={`flex items-center group flex-shrink-0 transition-all duration-300 opacity-0 w-0 overflow-hidden ${isScrolled ? '!opacity-100 !w-auto' : ''}`}
                    >
                        <img
                            src="/logo1.jpg"
                            alt="TravelApp Logo"
                            className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Nav Links (Scrolled) */}
                    <div className={`flex items-center space-x-6 transition-all duration-500 delay-100 ${isScrolled ? 'opacity-100 w-auto ml-4' : 'opacity-0 w-0 overflow-hidden'}`}>
                        {['Home', 'Destinations', 'Packages', 'Bookings'].map((item) => {
                            const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`;
                            const isActive = location.pathname === path;

                            if (item === 'Destinations') {
                                return (
                                    <div
                                        key={`${item}-scrolled`}
                                        className="relative group py-2"
                                        onMouseEnter={handleOpenDropdown}
                                        onMouseLeave={handleCloseDropdown}
                                    >
                                        <Link
                                            to="/destinations"
                                            className={`font-semibold text-[10px] uppercase tracking-wide transition-all flex items-center gap-1 ${isActive
                                                ? 'text-red-600 font-bold'
                                                : 'text-gray-800 hover:text-red-600'
                                                }`}
                                        >
                                            {item}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-2.5 h-2.5 transition-transform duration-300 ${isDestDropdownOpen ? 'rotate-180' : ''}`}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </Link>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={`${item}-scrolled`}
                                    to={path}
                                    className={`font-semibold text-[10px] uppercase tracking-wide transition-all ${isActive
                                        ? 'text-red-600 font-bold'
                                        : 'text-gray-800 hover:text-red-600'
                                        }`}
                                >
                                    {item}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Search Bar */}
                    <div className="relative group flex-1 max-w-lg mx-auto">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-full py-1.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-red-500/10 focus:border-red-500 transition-all text-xs placeholder:text-gray-400 shadow-inner"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>



                    {/* Phone Icon - Scrolled */}
                    <a
                        href="tel:+919876543210"
                        className={`p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 group border border-gray-100 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        aria-label="Call us"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                    </a>

                    {/* Profile Icon - Scrolled */}
                    {currentUser ? (
                        <Link
                            to="/profile"
                            className={`p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 group border border-gray-100 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            aria-label="Profile"
                            title="Profile"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </Link>
                    ) : (
                        <button
                            onClick={() => openLoginModal('login')}
                            className={`px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs transition-colors ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            Login
                        </button>
                    )}

                    {/* Book Now - Desktop Only (Scrolled) */}
                    <Link
                        to="/packages"
                        className={`flex-shrink-0 px-5 py-1.5 rounded-lg font-bold transition-all hover:scale-105 bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/10 active:scale-95 text-xs whitespace-nowrap ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
                            {['Home', 'Destinations', 'Packages', 'Bookings', 'About', 'Contact'].map((item) => {
                                const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`;
                                const isActive = location.pathname === path;

                                if (item === 'Destinations') {
                                    return (
                                        <div key={item} className="flex flex-col">
                                            <button
                                                onClick={() => setIsMobileDestOpen(!isMobileDestOpen)}
                                                className={`flex items-center justify-between p-3 rounded-xl transition-all ${isActive || isMobileDestOpen
                                                    ? 'bg-red-50 text-red-600 font-bold'
                                                    : 'hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold'
                                                    }`}
                                            >
                                                <span>{item}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform duration-300 ${isMobileDestOpen ? 'rotate-180' : ''}`}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </button>

                                            {/* Mobile Dropdown Sub-links */}
                                            <div className={`overflow-hidden transition-all duration-300 ${isMobileDestOpen ? 'max-h-80 opacity-100 mt-2 ml-4 border-l-2 border-red-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                                {destinationLinks.map((link) => (
                                                    <Link
                                                        key={link.name}
                                                        to={link.path}
                                                        onClick={() => {
                                                            setIsMobileMenuOpen(false);
                                                            setIsMobileDestOpen(false);
                                                        }}
                                                        className="block p-3 text-sm font-semibold text-gray-600 hover:text-red-600"
                                                    >
                                                        {link.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item}
                                        to={path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${isActive
                                            ? 'bg-red-50 text-red-600 font-bold'
                                            : 'hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold'
                                            }`}
                                    >
                                        <span>{item}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-all ${isActive ? 'text-red-500 translate-x-1' : 'text-gray-300 group-hover:text-red-500 group-hover:translate-x-1'}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </Link>
                                );
                            })}
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

            {/* ========== DESKTOP: MEGA MENU ========== */}
            <div
                className={`hidden md:block absolute top-[100%] left-0 right-0 bg-white shadow-[0_40px_60px_-15px_rgba(0,0,0,0.2)] border-t border-gray-100 transition-all duration-500 overflow-hidden z-[100] ${isDestDropdownOpen ? 'max-h-[650px] opacity-100 block' : 'max-h-0 opacity-0 pointer-events-none'}`}
                onMouseEnter={handleOpenDropdown}
                onMouseLeave={handleCloseDropdown}
            >
                <div className="container mx-auto py-12 px-8 grid grid-cols-4 gap-12">
                    {/* Left Promo Column */}
                    <div className="col-span-1 border-r border-gray-100 pr-12">
                        <div className="relative h-full flex flex-col">
                            <h3 className="text-3xl font-display font-black text-gray-900 mb-4 leading-tight">Plan Your Perfect <span className="text-red-600">Escape</span></h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                Discover the hidden gems of India. From snowy mountains to pristine beaches, we have curated the best experiences just for you.
                            </p>
                            <Link
                                to="/destinations"
                                onClick={() => setIsDestDropdownOpen(false)}
                                className="group inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold text-xs hover:bg-red-600 transition-all w-fit shadow-lg shadow-gray-200"
                            >
                                All Destinations
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>

                            <div className="mt-auto pt-6">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Need Help?</p>
                                <a href="tel:+919876543210" className="text-sm font-bold text-gray-900 hover:text-red-600 transition-colors">+91 98765 43210</a>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {megaDestinations.map((cat, idx) => (
                        <div key={idx} className="col-span-1">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">{cat.title}</h4>
                            <div className="flex flex-col space-y-5">
                                {cat.links.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsDestDropdownOpen(false)}
                                        className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-all group/item border border-transparent hover:border-gray-100"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-extrabold text-[14px] tracking-tight text-gray-800 group-hover:text-red-600 transition-colors uppercase">{link.name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Discover More</span>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-300 group-hover:text-red-500 transform translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Promo Strip */}
                <div className="bg-gray-900 border-t border-gray-800 px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-md animate-pulse uppercase tracking-widest">Live Now</div>
                        <p className="text-[11px] font-bold text-gray-400 tracking-wide">
                            Exclusive <span className="text-white">Summer 2026 Specials</span> for Jammu & Kashmir are now open. Save up to <span className="text-red-500">40%</span> on early bookings!
                        </p>
                    </div>
                    <Link
                        to="/packages#exclusive-offers"
                        onClick={() => setIsDestDropdownOpen(false)}
                        className="group flex items-center gap-2 text-[10px] font-black text-white hover:text-red-500 uppercase tracking-widest transition-all"
                    >
                        View Offer Packages
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
