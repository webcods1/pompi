const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 overflow-hidden">
            {/* Main Content Area with Split Color */}
            <div className="relative">
                {/* Background Split Overlay - Only for the top content area */}
                <div className="absolute inset-0 flex pointer-events-none">
                    <div className="w-full md:w-1/4 lg:w-1/4 bg-white"></div>
                    <div className="w-full md:w-3/4 lg:w-3/4 bg-gray-900"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-wrap md:flex-nowrap">
                        {/* Brand Section - White Background Area */}
                        <div className="w-full md:w-1/4 p-6 flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="mb-4">
                                <img src="/logo2.png" alt="Logo" className="h-10 w-auto object-contain" />
                            </div>

                            <p className="text-gray-600 text-xs leading-relaxed mb-6 max-w-xs">
                                Your trusted travel partner specifically focused on providing the best domestic and international travel experiences.
                            </p>

                            <div className="flex space-x-3">
                                {/* Social Links with SVG Icons */}
                                <a href="#" className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-red-50 transition-all duration-300 group bg-white shadow-sm hover:scale-110">
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-red-50 transition-all duration-300 group bg-white shadow-sm hover:scale-110">
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-red-50 transition-all duration-300 group bg-white shadow-sm hover:scale-110">
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Links Section - Dark Background Area */}
                        <div className="w-full md:w-3/4 p-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
                            <div>
                                <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-red-500">Company</h4>
                                <ul className="space-y-4 text-gray-400 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors duration-300">About Our Story</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors duration-300">Meet The Team</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors duration-300">Success Stories</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors duration-300">Travel Blog</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-red-500">Fast Reach</h4>
                                <ul className="space-y-4 text-gray-400 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors duration-300">Book A Hotel</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors duration-300">Tour Packages</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors duration-300">Flight Tickets</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors duration-300">Contact Support</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-red-500">Office Location</h4>
                                <div className="space-y-4 text-gray-400 text-xs leading-relaxed">
                                    <div className="flex items-start space-x-3">
                                        <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p>123 Travel Plaza, MG Road,<br />Kolkata, West Bengal 700001</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <p>+91 98765 43210</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <p>info@pompis.com</p>
                                    </div>

                                    {/* Google Maps Link/Preview */}
                                    <div className="mt-6">
                                        <a
                                            href="https://www.google.com/maps/search/?api=1&query=MG+Road+Kolkata"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block relative rounded-lg overflow-hidden border border-gray-800 hover:border-red-500/50 transition-colors"
                                        >
                                            <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                                                {/* Visual Map Mockup using SVG Patterns */}
                                                <svg className="absolute inset-0 w-full h-full opacity-20" width="100" height="100" viewBox="0 0 100 100">
                                                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                                                    </pattern>
                                                    <rect width="100" height="100" fill="url(#grid)" />
                                                    <path d="M 0 50 Q 50 20 100 50" fill="none" stroke="white" strokeWidth="2" />
                                                    <path d="M 50 0 Q 30 50 50 100" fill="none" stroke="white" strokeWidth="2" />
                                                </svg>

                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform">
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-[10px] text-white font-bold tracking-widest uppercase bg-black/50 px-2 py-1 rounded">View On Map</span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Always Dark Background */}
            <div className="bg-gray-950 border-t border-gray-800/50 relative z-20">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    <p>&copy; {new Date().getFullYear()} All rights reserved by Webcods Technologies.</p>
                    <div className="flex space-x-8 mt-6 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors duration-300">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
