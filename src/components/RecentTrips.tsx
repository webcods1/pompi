littimport { useState, useEffect, useRef } from 'react';

interface MediaItem {
    id: number;
    type: 'image' | 'video';
    src: string;
    title: string;
    location: string;
}

const mediaGallery: MediaItem[] = [
    { id: 1, type: 'image', src: 'trip_1', title: 'Ooty Hill Station', location: 'Tamil Nadu' },
    { id: 2, type: 'video', src: 'trip_video_1', title: 'Wedding Celebration', location: 'Chennai' },
    { id: 3, type: 'image', src: 'trip_2', title: 'Coorg Coffee Plantations', location: 'Karnataka' },
    { id: 4, type: 'image', src: 'trip_3', title: 'Madurai Temple Tour', location: 'Tamil Nadu' },
    { id: 5, type: 'video', src: 'trip_video_2', title: 'Corporate Outing', location: 'Bangalore' },
    { id: 6, type: 'image', src: 'trip_4', title: 'Beach Resort Trip', location: 'Goa' },
    { id: 7, type: 'image', src: 'trip_5', title: 'Mountain Adventure', location: 'Munnar' },
    { id: 8, type: 'video', src: 'trip_video_3', title: 'Family Vacation', location: 'Kerala' },
    { id: 9, type: 'image', src: 'trip_6', title: 'Heritage Tour', location: 'Hampi' },
    { id: 10, type: 'image', src: 'trip_7', title: 'Backwater Cruise', location: 'Alleppey' },
    { id: 11, type: 'video', src: 'trip_video_4', title: 'School Trip', location: 'Mysore' },
    { id: 12, type: 'image', src: 'trip_8', title: 'Wildlife Safari', location: 'Bandipur' },
    { id: 13, type: 'image', src: 'trip_9', title: 'City Tour', location: 'Mumbai' },
    { id: 14, type: 'video', src: 'trip_video_5', title: 'Adventure Sports', location: 'Rishikesh' },
    { id: 15, type: 'image', src: 'trip_10', title: 'Desert Safari', location: 'Rajasthan' },
    { id: 16, type: 'image', src: 'trip_11', title: 'Valley of Flowers', location: 'Uttarakhand' },
    { id: 17, type: 'video', src: 'trip_video_6', title: 'Cultural Festival', location: 'Jaipur' },
    { id: 18, type: 'image', src: 'trip_12', title: 'Lake Paradise', location: 'Udaipur' }
];

const gradients = [
    'from-blue-500 via-purple-500 to-pink-500',
    'from-red-500 via-orange-500 to-yellow-500',
    'from-green-500 via-teal-500 to-cyan-500',
    'from-indigo-500 via-blue-500 to-purple-500',
    'from-pink-500 via-rose-500 to-red-500',
    'from-yellow-500 via-orange-500 to-red-500',
    'from-cyan-500 via-blue-500 to-indigo-500',
    'from-violet-500 via-purple-500 to-fuchsia-500',
    'from-lime-500 via-green-500 to-emerald-500',
    'from-amber-500 via-orange-500 to-red-500',
    'from-teal-500 via-cyan-500 to-blue-500',
    'from-fuchsia-500 via-pink-500 to-rose-500',
    'from-emerald-500 via-green-500 to-teal-500',
    'from-orange-500 via-red-500 to-pink-500',
    'from-sky-500 via-blue-500 to-indigo-500',
    'from-rose-500 via-pink-500 to-purple-500',
    'from-purple-500 via-violet-500 to-indigo-500',
    'from-green-500 via-emerald-500 to-teal-500'
];

const RecentTrips = () => {
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [mediaStates, setMediaStates] = useState<number[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Initialize media states
    useEffect(() => {
        setMediaStates(mediaGallery.map((_, i) => i % gradients.length));
    }, []);

    // Auto-morph media items
    useEffect(() => {
        const interval = setInterval(() => {
            setMediaStates(prev =>
                prev.map(() => Math.floor(Math.random() * gradients.length))
            );
        }, 3500); // Morph every 3.5 seconds

        return () => clearInterval(interval);
    }, []);

    // Track scroll for parallax
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const progress = Math.max(0, Math.min(1,
                    (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
                ));
                setScrollProgress(progress);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Generate chaotic positions with depth
    const getMediaStyle = (index: number) => {
        const time = Date.now() / 1000;
        const chaos = Math.max(0, 1 - scrollProgress * 2); // Chaos decreases as you scroll

        // Wave motion parameters
        const waveSpeed = 0.3;
        const waveAmplitude = 15 * (1 + chaos);
        const waveFrequency = 0.5;

        // Individual wave offset for each item
        const waveOffset = (index * 0.3) + (time * waveSpeed);
        const waveY = Math.sin(waveOffset * waveFrequency) * waveAmplitude;
        const waveX = Math.cos(waveOffset * waveFrequency * 0.7) * (waveAmplitude * 0.5);

        // Depth-based parallax
        const depth = (index % 5) / 5; // 5 depth layers
        const parallaxY = scrollProgress * 100 * (depth - 0.5);

        // Rotation with chaos
        const rotationChaos = chaos * (Math.sin(time * 0.5 + index) * 8);
        const rotationHarmony = Math.sin(waveOffset * 0.3) * 3;
        const rotation = rotationChaos + rotationHarmony;

        // Scale variation with breathing effect
        const breathe = 1 + Math.sin(time * 0.8 + index * 0.5) * 0.05;
        const depthScale = 0.7 + (depth * 0.6);
        const scale = breathe * depthScale;

        // Z-depth for 3D layering
        const zDepth = depth * 100;

        return {
            transform: `
                translate3d(${waveX}px, ${waveY + parallaxY}px, ${zDepth}px)
                rotate(${rotation}deg)
                scale(${scale})
            `,
            opacity: 0.7 + (depth * 0.3),
            zIndex: Math.floor(depth * 50),
            filter: `blur(${(1 - depth) * 0.5}px) brightness(${0.9 + depth * 0.2})`,
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease'
        };
    };

    return (
        <section
            ref={containerRef}
            className="relative py-20 bg-black overflow-hidden"
            style={{
                perspective: '1500px',
                perspectiveOrigin: '50% 50%'
            }}
        >
            {/* Volumetric Light Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900"></div>

                {/* Animated light rays */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `
                            radial-gradient(ellipse at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                            radial-gradient(ellipse at 80% 70%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                            radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 60%)
                        `,
                        animation: 'lightPulse 8s ease-in-out infinite'
                    }}
                ></div>

                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-8 md:px-16 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 relative">
                    <div className="inline-block mb-6">
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-500/50">
                            Our Journey
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
                        <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                            Recent Trips Gallery
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Experience the magic of our memorable journeys
                    </p>
                </div>

                {/* Cinematic 3D Gallery */}
                <div
                    className="relative h-[600px] md:h-[800px]"
                    style={{
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Chaotic Floating Media Grid */}
                    <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-4 p-8">
                        {mediaGallery.map((media, index) => {
                            const size = index % 3 === 0 ? 'large' : index % 2 === 0 ? 'medium' : 'small';
                            const sizeClasses = {
                                large: 'w-64 h-64 md:w-80 md:h-80',
                                medium: 'w-48 h-48 md:w-56 md:h-56',
                                small: 'w-40 h-40 md:w-44 md:h-44'
                            };

                            return (
                                <div
                                    key={media.id}
                                    className={`${sizeClasses[size]} absolute cursor-pointer group`}
                                    style={{
                                        ...getMediaStyle(index),
                                        left: `${(index * 17) % 80}%`,
                                        top: `${(index * 23) % 70}%`,
                                        transformStyle: 'preserve-3d'
                                    }}
                                    onClick={() => setSelectedMedia(media)}
                                >
                                    {/* Glow effect */}
                                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Media card */}
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                                        {/* Gradient background with morphing (Visible while loading or if error) */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${gradients[mediaStates[index] || 0]} transition-all duration-[3500ms] ease-in-out`}
                                            style={{
                                                backgroundSize: '200% 200%',
                                                animation: 'gradientShift 6s ease infinite'
                                            }}
                                        />

                                        {/* Real Media Content */}
                                        {media.type === 'image' ? (
                                            <img
                                                src={`/images/${media.src}.jpg`}
                                                alt={media.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 bg-gray-800"
                                                onLoad={(e) => {
                                                    (e.target as HTMLImageElement).classList.remove('opacity-0');
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 w-full h-full">
                                                {/* Video Thumbnail/Placeholder */}
                                                <img
                                                    src={`/images/${media.src}_thumb.jpg`}
                                                    alt={media.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0"
                                                    onLoad={(e) => {
                                                        (e.target as HTMLImageElement).classList.remove('opacity-0');
                                                    }}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                                {/* Video Play Icon Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                                                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                                                        <svg className="w-12 h-12 md:w-16 md:h-16 text-white relative z-10 drop-shadow-2xl opacity-90 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Reflection overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                                        {/* Info overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                                            <h4 className="text-white font-bold text-sm md:text-base mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                {media.title}
                                            </h4>
                                            <p className="text-white/80 text-xs flex items-center gap-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                {media.location}
                                            </p>
                                        </div>

                                        {/* Video badge */}
                                        {media.type === 'video' && (
                                            <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                                                </svg>
                                                VIDEO
                                            </div>
                                        )}

                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* View More Button */}
                <div className="text-center mt-16 relative z-20">
                    <button className="group relative bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-4 px-12 rounded-full hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-500 hover:scale-105 inline-flex items-center gap-3 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="relative z-10">View Full Gallery</span>
                        <svg className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Modal for Expanded View */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl animate-fadeIn"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div
                        className="relative max-w-6xl w-full animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute -top-16 right-0 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:rotate-90 z-50 border border-white/20"
                            onClick={() => setSelectedMedia(null)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Media Display */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
                            <div className="aspect-video w-full relative">
                                {/* Background Gradient (Visible while loading) */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[selectedMedia.id % gradients.length]} opacity-50`}></div>

                                {selectedMedia.type === 'video' ? (
                                    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                        {/* Video Player */}
                                        <video
                                            src={`/videos/${selectedMedia.src}.mp4`}
                                            className="w-full h-full object-cover"
                                            controls
                                            autoPlay
                                            muted={false}
                                            onError={(e) => {
                                                (e.target as HTMLVideoElement).parentElement!.style.display = 'none';
                                            }}
                                        />
                                        {/* Fallback if video fails */}
                                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                                                <svg className="w-24 h-24 text-white relative z-10 drop-shadow-2xl opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                                <p className="text-white text-center mt-4 font-bold">Video Preview</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full relative">
                                        <img
                                            src={`/images/${selectedMedia.src}.jpg`}
                                            alt={selectedMedia.title}
                                            className="w-full h-full object-cover relative z-10"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                        {/* Fallback content */}
                                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                                            <div className="text-white/50 animate-pulse">Loading Image...</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Bar */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8">
                                <h3 className="text-3xl font-bold text-white mb-3">{selectedMedia.title}</h3>
                                <div className="flex items-center gap-2 text-white/90 text-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{selectedMedia.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS Animations */}
            <style>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes lightPulse {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.1); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(-20px) translateX(10px); }
                    66% { transform: translateY(-10px) translateX(-10px); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </section>
    );
};

export default RecentTrips;
