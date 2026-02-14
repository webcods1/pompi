import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface UserProfile {
    name: string;
    mobile: string;
}

const Navbar = () => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({ name: '', mobile: '' });
    const [formData, setFormData] = useState<UserProfile>({ name: '', mobile: '' });
    const profileRef = useRef<HTMLDivElement>(null);

    // Load profile from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            const parsed = JSON.parse(saved);
            setProfile(parsed);
            setFormData(parsed);
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const saveProfile = () => {
        setProfile(formData);
        localStorage.setItem('userProfile', JSON.stringify(formData));
        setIsProfileOpen(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(w => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

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

                    {/* Book Now (Top Right) - in nav links row */}
                    <div className="absolute right-6 hidden md:block flex-shrink-0">
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
                            <div className="flex-shrink-0 relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 active:scale-90 border border-gray-200"
                                    aria-label="Profile"
                                >
                                    {profile.name ? (
                                        <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                                            <span className="text-white text-[9px] font-bold leading-none">{getInitials(profile.name)}</span>
                                        </div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    )}
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-[70] animate-fade-in-up">
                                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                            </svg>
                                            My Profile
                                        </h3>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">Mobile Number</label>
                                                <input
                                                    type="tel"
                                                    placeholder="Enter mobile number"
                                                    value={formData.mobile}
                                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={saveProfile}
                                            className="mt-4 w-full py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all active:scale-95 shadow-md shadow-red-500/20"
                                        >
                                            Save Profile
                                        </button>

                                        {profile.name && (
                                            <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                                                <p>👤 {profile.name}</p>
                                                <p>📱 {profile.mobile}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
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

                    {/* Search Bar */}
                    <div className="relative group flex-1 max-w-2xl mx-auto">
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

                    {/* Profile Icon - Desktop */}
                    <div className="flex-shrink-0 relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 active:scale-90 border border-gray-200"
                            aria-label="Profile"
                        >
                            {profile.name ? (
                                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                                    <span className="text-white text-[10px] font-bold leading-none">{getInitials(profile.name)}</span>
                                </div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            )}
                        </button>

                        {/* Profile Dropdown - Desktop */}
                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-[70] animate-fade-in-up">
                                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    My Profile
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">Mobile Number</label>
                                        <input
                                            type="tel"
                                            placeholder="Enter mobile number"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={saveProfile}
                                    className="mt-4 w-full py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all active:scale-95 shadow-md shadow-red-500/20"
                                >
                                    Save Profile
                                </button>

                                {profile.name && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                                        <p>👤 {profile.name}</p>
                                        <p>📱 {profile.mobile}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

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
        </nav>
    );
};

export default Navbar;
