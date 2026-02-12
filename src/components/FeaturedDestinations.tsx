import { useState } from 'react';

const destinations = [
    {
        id: 1,
        title: 'Manali, Himachal',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹12,000',
        rating: '4.8',
        description: 'Experience the snowy peaks and adventure of the Himalayas in Manali.'
    },
    {
        id: 2,
        title: 'Goa Beaches',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹9,999',
        rating: '4.7',
        description: 'Relax on the sun-kissed beaches and enjoy the vibrant nightlife of Goa.'
    },
    {
        id: 3,
        title: 'Jaipur, Rajasthan',
        image: 'https://images.unsplash.com/photo-1477587458883-4a36979e45e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹11,500',
        rating: '4.9',
        description: 'Explore the majestic forts and royal culture of the Pink City.'
    },
    {
        id: 4,
        title: 'Leh Ladakh',
        image: 'https://images.unsplash.com/photo-1581791538302-33758102379b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹18,000',
        rating: '4.9',
        description: 'Journey through high mountain passes and crystal blue lakes.'
    },
    {
        id: 5,
        title: 'Rishikesh, Uttarakhand',
        image: 'https://images.unsplash.com/photo-1598344032644-88981665a388?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹8,500',
        rating: '4.7',
        description: 'The yoga capital of the world with thrilling river rafting.'
    },
    {
        id: 6,
        title: 'Udaipur, Rajasthan',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹14,000',
        rating: '4.8',
        description: 'Experience the romance of the City of Lakes and royal palaces.'
    }
];

const ITEM_PER_PAGE = 3;

const FeaturedDestinations = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(destinations.length / ITEM_PER_PAGE);

    const nextSlide = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevSlide = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };


    return (
        <section id="destinations" className="py-14 bg-white">
            <div className="max-w-[95%] mx-auto px-2">
                <div className="bg-blue-50 rounded-2xl py-12 px-4 md:px-8 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-left">
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-1">Popular Destinations</h2>
                            <p className="text-sm text-gray-600 max-w-2xl">
                                Discover our most loved travel packages, curated just for you.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={prevSlide}
                                className="p-3 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors text-gray-900 group"
                                aria-label="Previous Destinations"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-3 rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700 transition-colors group"
                                aria-label="Next Destinations"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentPage * 100}%)` }}
                        >
                            {/* Each "page" is a full-width flex container containing 3 cards */}
                            {Array.from({ length: totalPages }).map((_, pageIndex) => (
                                <div key={pageIndex} className="flex-shrink-0 w-full grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
                                    {destinations.slice(pageIndex * ITEM_PER_PAGE, (pageIndex + 1) * ITEM_PER_PAGE).map((dest) => (
                                        <div
                                            key={dest.id}
                                            className="bg-white rounded-md md:rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                        >
                                            <div className="relative h-20 md:h-36 overflow-hidden">
                                                <img
                                                    src={dest.image}
                                                    alt={dest.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                />
                                                <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-white/90 backdrop-blur-sm px-1 md:px-2 py-0.5 rounded-full text-[9px] md:text-xs font-semibold flex items-center shadow-sm">
                                                    <span className="text-yellow-500 mr-0.5 md:mr-1">★</span> {dest.rating}
                                                </div>
                                            </div>

                                            <div className="p-1.5 md:p-3">
                                                <div className="flex justify-between items-start mb-0.5 md:mb-1">
                                                    <h3 className="text-[9px] md:text-sm font-bold text-gray-900 leading-tight">{dest.title}</h3>
                                                    <span className="text-blue-600 font-bold bg-blue-50 px-1 md:px-1.5 py-0.5 rounded-full text-[7px] md:text-[10px] whitespace-nowrap ml-0.5">
                                                        {dest.price}
                                                    </span>
                                                </div>

                                                <p className="text-gray-500 mb-1 md:mb-3 text-[7px] md:text-[11px] line-clamp-2 leading-tight hidden md:block">
                                                    {dest.description}
                                                </p>

                                                <button className="w-full bg-gray-900 text-white font-medium py-0.5 md:py-1.5 rounded md:rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center group text-[8px] md:text-xs">
                                                    <span className="hidden md:inline">View Details</span>
                                                    <span className="md:hidden">View</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2 h-2 md:w-3 md:h-3 ml-0.5 md:ml-1.5 transition-transform group-hover:translate-x-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-6 gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentPage ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedDestinations;
