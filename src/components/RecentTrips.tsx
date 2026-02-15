import { useState, useEffect, useRef } from 'react';

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

const RecentTrips = () => {
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

    // Split data into 3 columns
    const chunk1 = mediaGallery.slice(0, 6);
    const chunk2 = mediaGallery.slice(6, 12);
    const chunk3 = mediaGallery.slice(12, 18);

    const Column = ({ items, direction = 'up', speed = 'normal' }: { items: MediaItem[], direction?: 'up' | 'down', speed?: 'slow' | 'normal' | 'fast' }) => {
        const doubledItems = [...items, ...items, ...items]; // Triple for smoother infinite scroll

        return (
            <div className="relative h-full overflow-hidden group">
                {/* Scroll Track */}
                <div
                    className={`absolute left-0 right-0 w-full flex flex-col gap-3 md:gap-4 ${direction === 'up' ? 'animate-scrollUp' : 'animate-scrollDown'
                        }`}
                    style={{
                        animationDuration: speed === 'slow' ? '45s' : speed === 'fast' ? '25s' : '35s'
                    }}
                >
                    {doubledItems.map((media, idx) => (
                        <div
                            key={`${media.id}-${idx}`}
                            className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border border-white/10 shadow-lg shrink-0 transform transition-transform hover:scale-95"
                            onClick={() => setSelectedMedia(media)}
                        >
                            {/* Media Content */}
                            {media.type === 'image' ? (
                                <img
                                    src={`/images/${media.src}.jpg`}
                                    alt={media.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full relative">
                                    <img
                                        src={`/images/${media.src}_thumb.jpg`}
                                        alt={media.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Info Gradient - Minimal on card, full on hover/modal */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

                            {/* Video Badge */}
                            {media.type === 'video' && (
                                <div className="absolute top-2 right-2 bg-red-600/90 backdrop-blur-md text-white px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm z-10">
                                    VIDEO
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <section className="relative py-12 md:py-20 bg-black overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900"></div>
            </div>

            <div className="container mx-auto px-4 md:px-16 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-block mb-3">
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-500/50">
                            Our Journey
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                            Recent Trips
                        </span>
                    </h2>
                </div>

                {/* Auto-Scrolling Gallery Wall */}
                {/* Height calc: approx 3.5 cards height on mobile to show "3 vertical" */}
                <div className="relative h-[500px] md:h-[600px] bg-gray-900/50 rounded-2xl border border-white/5 overflow-hidden p-2 md:p-4">
                    <div className="grid grid-cols-3 gap-3 md:gap-4 h-full relative">
                        {/* Overlay Gradients to mask edges */}
                        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>

                        <Column items={chunk1} direction="up" speed="normal" />
                        <Column items={chunk2} direction="down" speed="slow" />
                        <Column items={chunk3} direction="up" speed="fast" />
                    </div>
                </div>

                {/* View More Button */}
                <div className="text-center mt-8">
                    <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-red-500/30 transition-all active:scale-95 inline-flex items-center gap-2 text-sm md:text-base">
                        <span>View Full Gallery</span>
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Modal for Expanded View */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div
                        className="relative max-w-5xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors bg-white/10 rounded-full p-2"
                            onClick={() => setSelectedMedia(null)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10">
                            <div className="aspect-video w-full bg-black">
                                {selectedMedia.type === 'video' ? (
                                    <video
                                        src={`/videos/${selectedMedia.src}.mp4`}
                                        className="w-full h-full object-contain"
                                        controls
                                        autoPlay
                                    />
                                ) : (
                                    <img
                                        src={`/images/${selectedMedia.src}.jpg`}
                                        alt={selectedMedia.title}
                                        className="w-full h-full object-contain"
                                    />
                                )}
                            </div>

                            <div className="p-4 md:p-6 bg-gray-900 border-t border-white/10">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{selectedMedia.title}</h3>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <style>{`
                @keyframes scrollUp {
                    from { transform: translateY(0); }
                    to { transform: translateY(-33.33%); }
                }
                @keyframes scrollDown {
                    from { transform: translateY(-33.33%); }
                    to { transform: translateY(0); }
                }
                .animate-scrollUp {
                    animation: scrollUp linear infinite;
                }
                .animate-scrollDown {
                    animation: scrollDown linear infinite;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </section>
    );
};

export default RecentTrips;
