

const SchoolPackages = () => {
    return (
        <section className="py-20 bg-yellow-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Visual Side - Collage */}
                    <div className="md:w-1/2 relative h-[500px] flex items-center justify-center">
                        <div className="relative w-full h-full">
                            {/* Decorative Elements */}
                            <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                            <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>

                            {/* Card 1: Museum/Science (Top Right) */}
                            <div className="absolute top-4 right-2 md:right-0 z-20 w-40 md:w-48 bg-white p-2 rounded-2xl shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-500 hover:z-30">
                                <img
                                    src="https://images.unsplash.com/photo-1564593649638-33e9d0e6573c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                    alt="Science Museum"
                                    className="w-full h-28 object-cover rounded-xl mb-2"
                                />
                                <div className="px-2 pb-2">
                                    <span className="text-[9px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Science</span>
                                    <h4 className="font-bold text-gray-800 text-xs mt-1">Interactive Labs</h4>
                                </div>
                            </div>

                            {/* Card 2: Main Hiking Image (Center) */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-56 md:w-64 bg-white p-3 rounded-3xl shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500 hover:z-40 border-4 border-white/50">
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1544961371-515863f34bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                        alt="Nature Trek"
                                        className="w-full h-56 object-cover rounded-2xl"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                                        <span className="text-xs font-bold text-green-600">4.9/5 ⭐</span>
                                    </div>
                                </div>
                                <div className="mt-3 px-1">
                                    <h3 className="font-bold text-gray-800 text-base">Nature Exploration</h3>
                                    <p className="text-gray-500 text-[10px]">Team building & ecology workshops</p>
                                </div>
                            </div>

                            {/* Card 3: Historical/Bus (Bottom Left) */}
                            <div className="absolute bottom-8 left-0 md:-left-4 z-20 w-40 md:w-48 bg-white p-2 rounded-2xl shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-500 hover:z-30">
                                <img
                                    src="https://images.unsplash.com/photo-1533649687747-d5d28cece32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                    alt="Historical Fort"
                                    className="w-full h-28 object-cover rounded-xl mb-2"
                                />
                                <div className="px-2 pb-2">
                                    <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">History</span>
                                    <h4 className="font-bold text-gray-800 text-xs mt-1">Ancient Forts</h4>
                                </div>
                            </div>

                            {/* Card 4: Space Camp (Bottom Right) */}
                            <div className="absolute bottom-0 right-4 md:right-6 z-10 w-36 md:w-44 bg-white p-2 rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500 hover:z-30">
                                <img
                                    src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                    alt="Space Camp"
                                    className="w-full h-24 object-cover rounded-xl mb-2"
                                />
                                <div className="px-2 pb-2">
                                    <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Space</span>
                                    <h4 className="font-bold text-gray-800 text-xs mt-1">Astronomy Camp</h4>
                                </div>
                            </div>

                            {/* Card 5: Art Workshop (Top Left) */}
                            <div className="absolute top-6 left-6 md:left-4 z-10 w-36 md:w-44 bg-white p-2 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-500 hover:z-30">
                                <img
                                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                    alt="Art Workshop"
                                    className="w-full h-24 object-cover rounded-xl mb-2"
                                />
                                <div className="px-2 pb-2">
                                    <span className="text-[9px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">Art</span>
                                    <h4 className="font-bold text-gray-800 text-xs mt-1">Creative Arts</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="md:w-1/2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Education First
                            </span>
                            <span className="text-yellow-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 0114.353-8.68z" />
                                    <path d="M5.355 20.41A5.198 5.198 0 016 16.128a6.985 6.985 0 002.25-4.577 49.32 49.32 0 0111.36 3.333c.715.304 1.483.477 2.25.64v3.196a.18.18 0 01-.064.144c-.983.784-2.128 1.416-3.379 1.838-1.55.517-3.238.64-4.87.278a5.556 5.556 0 01-3.674-1.928 2.502 2.502 0 01-.518-1.638z" />
                                </svg>
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-800 mb-6 leading-tight">
                            Memorable <span className="text-blue-600">School Trips</span> & <br />Educational Tours
                        </h2>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Combine learning with adventure! Our school packages are designed to provide students with hands-on experiences, fostering curiosity and teamwork in safe, supervised environments.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {[
                                { title: 'Historical Sites', icon: '🏛️', desc: 'Interactive history lessons' },
                                { title: 'Nature Camps', icon: '⛺', desc: 'Biology & ecology workshops' },
                                { title: 'Science Centers', icon: '🔬', desc: 'Curiosity driven visits' },
                                { title: 'Adventure Parks', icon: '🧗', desc: 'Team building activities' }
                            ].map((feature) => (
                                <div key={feature.title} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <span className="text-2xl bg-gray-50 p-2 rounded-lg">{feature.icon}</span>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{feature.title}</h4>
                                        <p className="text-xs text-gray-500">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                                Plan a Trip
                            </button>
                            <button className="text-blue-600 font-bold py-3 px-6 hover:bg-blue-50 rounded-full transition-colors flex items-center gap-2">
                                Download Brochure
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SchoolPackages;
