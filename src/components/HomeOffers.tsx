import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';

const packagesData = [
    {
        id: 1,
        title: 'Majestic Kashmir Tour',
        image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Dal Lake Shikara ride, Gulmarg skiing, and Pahalgam valley views.',
        price: '$599',
        originalPrice: '$850',
        discount: '30% OFF',
        duration: '6 Days',
        rating: '4.9',
        tag: 'Best Seller'
    },
    {
        id: 2,
        title: 'Royal Rajasthan Heritage',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Explore Jaipur forts, Udaipur lakes, and Jaisalmer desert safari.',
        price: '$450',
        originalPrice: '$650',
        discount: '30% OFF',
        duration: '7 Days',
        rating: '4.8',
        tag: 'Cultural'
    },
    {
        id: 3,
        title: 'Kerala Backwaters Bliss',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Houseboat stay in Alleppey, Munnar tea gardens, and Kochi culture.',
        price: '$399',
        originalPrice: '$600',
        discount: '35% OFF',
        duration: '5 Days',
        rating: '5.0',
        tag: 'Nature'
    },
    {
        id: 4,
        title: 'Goa Beach & Party',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'North Goa nightlife, South Goa serene beaches, and water sports.',
        price: '$299',
        originalPrice: '$450',
        discount: '35% OFF',
        duration: '4 Days',
        rating: '4.7',
        tag: 'Popular'
    },
    {
        id: 5,
        title: 'Himalayan Trek Adventure',
        image: 'https://images.unsplash.com/photo-1518002171953-a080ee802e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Experience the thrill of trekking through the majestic Himalayan ranges.',
        price: '$350',
        originalPrice: '$550',
        discount: '36% OFF',
        duration: '6 Days',
        rating: '4.9',
        tag: 'Adventure'
    },
    {
        id: 6,
        title: 'Andaman Island Paradise',
        image: 'https://images.unsplash.com/photo-1572099606223-6e29045d7de3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Crystal clear waters, scuba diving, and pristine white sand beaches.',
        price: '$699',
        originalPrice: '$950',
        discount: '26% OFF',
        duration: '7 Days',
        rating: '4.8',
        tag: 'Honeymoon'
    },
    {
        id: 7,
        title: 'Varanasi Spiritual Journey',
        image: 'https://images.unsplash.com/photo-1561361513-35bdcd257a28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Witness the Ganga Aarti and explore the ancient temples of Varanasi.',
        price: '$250',
        originalPrice: '$350',
        discount: '28% OFF',
        duration: '3 Days',
        rating: '4.6',
        tag: 'Spiritual'
    },
    {
        id: 8,
        title: 'Mysore Royal Heritage',
        image: 'https://images.unsplash.com/photo-1582555620950-8b1d7d0284d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Explore the grand Mysore Palace and the beautiful Brindavan Gardens.',
        price: '$199',
        originalPrice: '$300',
        discount: '33% OFF',
        duration: '2 Days',
        rating: '4.7',
        tag: 'Heritage'
    }
];

const HomeOffers = ({ showAll = false }: { showAll?: boolean }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Filter data based on prop
    const displayedPackages = showAll ? packagesData : packagesData.slice(0, 4);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId: number;
        let direction = 1; // 1 for forward (right), -1 for backward (left)
        const speed = 0.5; // Adjust speed as needed

        const scroll = () => {
            if (!isPaused && scrollContainer) {
                // Check bounds
                if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1) {
                    direction = -1;
                } else if (scrollContainer.scrollLeft <= 0) {
                    direction = 1;
                }

                scrollContainer.scrollLeft += speed * direction;
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused]);

    return (
        <section className="py-12 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 relative overflow-hidden">
            <style>{`
                @keyframes swing {
                    0% { transform: rotate(3deg); }
                    50% { transform: rotate(-3deg); }
                    100% { transform: rotate(3deg); }
                }
                .animate-swing {
                    animation: swing 3s ease-in-out infinite;
                }
            `}</style>

            {/* Hanging Tag - Left Side with Swing Animation */}
            <div className="absolute top-0 left-4 md:left-8 z-10 block origin-top animate-swing">
                <div className="h-8 md:h-12 w-0.5 bg-yellow-800 mx-auto opacity-40"></div>
                <div className="bg-white text-red-600 font-bold p-2 md:p-3 rounded-b-lg shadow-lg text-center border-t-4 border-yellow-800 relative w-20 md:w-24">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 md:w-4 h-3 md:h-4 bg-gray-800 rounded-full border-2 border-white"></div>
                    <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Upto</p>
                    <p className="text-xl md:text-2xl font-display leading-none mb-0.5">40%</p>
                    <p className="text-[10px] md:text-xs font-bold bg-red-100 text-red-600 rounded px-1">OFF</p>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-0">
                <div className="flex justify-end mb-6">
                    <Link to="/packages" className="flex items-center gap-1 text-white font-bold text-xs hover:gap-2 transition-all hover:text-yellow-100 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm border border-white/20">
                        View All Offers
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </Link>
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {displayedPackages.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 border border-gray-100 relative">
                            {/* Discount Badge */}
                            <div className="absolute top-3 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 z-20 shadow-md">
                                {pkg.discount}
                            </div>

                            {/* Card Image */}
                            <div className="relative h-32 overflow-hidden">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[8px] font-bold text-gray-800 flex items-center gap-0.5 shadow-sm">
                                    <svg className="w-2 h-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {pkg.rating}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-3 flex flex-col h-40">
                                <div className="mb-0.5">
                                    <span className="text-[8px] font-bold text-blue-600 uppercase tracking-wider mb-0.5 block">{pkg.tag}</span>
                                    <h3 className="text-sm font-bold text-gray-800 group-hover:text-red-600 transition-colors leading-tight line-clamp-1">{pkg.title}</h3>
                                </div>
                                <div className="flex items-center gap-1 mb-1.5 text-[9px] text-gray-500">
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {pkg.duration}
                                </div>

                                <p className="text-gray-600 mb-2 line-clamp-2 text-[10px] leading-snug">{pkg.description}</p>

                                <div className="border-t border-gray-100 pt-1.5 mt-auto">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-[9px] text-gray-400 line-through font-semibold block">{pkg.originalPrice}</span>
                                            <p className="text-base font-bold text-red-600 leading-none">{pkg.price}</p>
                                        </div>
                                        <button className="bg-red-600 text-white font-bold text-[9px] py-1 px-2.5 rounded shadow-red-500/20 shadow-md active:scale-95 hover:bg-red-700 transition-colors">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Scrollable Layout with Auto-Scroll (Ping Pong) */}
                <div className="md:hidden -mx-4">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto hide-scrollbar pb-4 px-4 gap-3 snap-x"
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {displayedPackages.map((pkg) => (
                            <div key={pkg.id} className="flex-shrink-0 w-[60vw] bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 relative snap-center">
                                {/* Discount Badge */}
                                <div className="absolute top-3 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 z-20 shadow-md">
                                    {pkg.discount}
                                </div>

                                {/* Card Image */}
                                <div className="relative h-32 overflow-hidden">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[8px] font-bold text-gray-800 flex items-center gap-0.5 shadow-sm">
                                        <svg className="w-2 h-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        {pkg.rating}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-3 flex flex-col h-36">
                                    <div className="mb-0.5">
                                        <span className="text-[8px] font-bold text-blue-600 uppercase tracking-wider mb-0.5 block">{pkg.tag}</span>
                                        <h3 className="text-sm font-bold text-gray-800 leading-tight line-clamp-1">{pkg.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-1 mb-1.5 text-[9px] text-gray-500">
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {pkg.duration}
                                    </div>

                                    <div className="border-t border-gray-100 pt-1.5 mt-auto">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="text-[9px] text-gray-400 line-through font-semibold block">{pkg.originalPrice}</span>
                                                <p className="text-base font-bold text-red-600 leading-none">{pkg.price}</p>
                                            </div>
                                            <button className="bg-red-600 text-white font-bold text-[9px] py-1 px-2.5 rounded shadow-red-500/20 shadow-md active:scale-95 transition-colors">
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <style>{`
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        .hide-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link to="/packages" className="inline-block bg-white text-red-600 font-bold py-2 px-6 rounded-full text-xs shadow-md border border-gray-100">
                        View All Offers
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeOffers;
