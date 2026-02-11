
const southDestinations = [
    {
        id: 1,
        title: 'Munnar, Kerala',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹15,000',
        rating: '4.9',
        description: 'Breathe in the fresh mountain air amidst endless tea plantations and misty hills.'
    },
    {
        id: 2,
        title: 'Alleppey, Kerala',
        image: 'https://images.unsplash.com/photo-1543731068-7d0f5beff43a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹12,500',
        rating: '4.8',
        description: 'Immerse yourself in serenity with a traditional houseboat stay on the backwaters.'
    },
    {
        id: 3,
        title: 'Thekkady, Kerala',
        image: 'https://images.unsplash.com/photo-1589308617300-4742f9547da2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹10,000',
        rating: '4.7',
        description: 'Discover the wild beauty of Periyar National Park and spice plantations.'
    },
    {
        id: 4,
        title: 'Wayanad, Kerala',
        image: 'https://images.unsplash.com/photo-1578330107248-61f237f8ea61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹9,500',
        rating: '4.6',
        description: 'Explore the green paradise with waterfalls, caves, and spice plantations.'
    },
    {
        id: 5,
        title: 'Kovalam, Kerala',
        image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹13,000',
        rating: '4.7',
        description: 'Enjoy the crescent-shaped beaches and world-class Ayurvedic treatments.'
    },
    {
        id: 6,
        title: 'Varkala, Kerala',
        image: 'https://images.unsplash.com/photo-1628154563816-9218d6a8b79d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        price: '₹11,000',
        rating: '4.8',
        description: 'Experience the unique cliffside beaches and spiritual atmosphere.'
    },
];

const SouthIndiaDestinations = () => {
    return (
        <section id="south-india" className="py-20 bg-emerald-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Best Choices from South</h2>
                    <h3 className="text-2xl font-display font-semibold text-blue-600 mb-4">Kerala Focused Trip</h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore "God's Own Country" with our specially curated Kerala travel packages.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {southDestinations.map((dest) => (
                        <div
                            key={dest.id}
                            className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg duration-300 border border-emerald-100"
                        >
                            <div className="relative h-36 overflow-hidden">
                                <img
                                    src={dest.image}
                                    alt={dest.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold flex items-center shadow-sm">
                                    <span className="text-yellow-500 mr-1">★</span> {dest.rating}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-lg font-bold text-gray-900">{dest.title}</h3>
                                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                                        {dest.price}
                                    </span>
                                </div>

                                <p className="text-gray-500 mb-4 text-xs line-clamp-2">
                                    {dest.description}
                                </p>

                                <button className="w-full bg-emerald-600 text-white font-medium py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center group text-sm">
                                    Book Now
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className="inline-flex items-center justify-center bg-gray-900 text-white font-bold py-4 px-10 rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-xl group">
                        View More Kerala Packages
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SouthIndiaDestinations;
