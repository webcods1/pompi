import React from 'react';

const destinations = [
    {
        id: 1,
        title: 'Bali, Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '$899',
        rating: '4.9',
        description: 'Experience the tropical paradise of Bali with its lush landscapes and vibrant culture.'
    },
    {
        id: 2,
        title: 'Santorini, Greece',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4c79e4284?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '$1299',
        rating: '4.8',
        description: 'Enjoy breathtaking sunsets and iconic white-washed architecture in Santorini.'
    },
    {
        id: 3,
        title: 'Kyoto, Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '$1599',
        rating: '4.9',
        description: 'Immerse yourself in the ancient traditions and stunning gardens of Kyoto.'
    },
];

const FeaturedDestinations = () => {
    return (
        <section id="destinations" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our most loved travel packages, curated just for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest) => (
                        <div
                            key={dest.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-xl duration-300"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={dest.image}
                                    alt={dest.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center shadow-sm">
                                    <span className="text-yellow-500 mr-1">★</span> {dest.rating}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{dest.title}</h3>
                                    <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-sm">
                                        {dest.price}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-6 text-sm line-clamp-2">
                                    {dest.description}
                                </p>

                                <button className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center group">
                                    View Details
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedDestinations;
