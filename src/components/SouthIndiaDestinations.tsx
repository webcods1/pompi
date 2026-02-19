
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const initialDestinations = [
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
    const [destinations, setDestinations] = useState<any[]>(initialDestinations);

    useEffect(() => {
        const packagesRef = ref(db, 'packages');
        const unsub = onValue(packagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const fetchedDestinations = Object.entries(data)
                    .map(([key, val]: [string, any]) => ({ id: key, ...val }))
                    .filter((pkg) => pkg.category === 'southside');

                if (fetchedDestinations.length > 0) {
                    setDestinations(fetchedDestinations);
                }
            }
        });
        return () => unsub();
    }, []);

    return (
        <section id="south-india" className="py-12 bg-emerald-50">
            <div className="container mx-auto px-8 md:px-16">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">Best Choices from South</h2>
                    <h3 className="text-lg font-display font-semibold text-blue-600 mb-2">Kerala Focused Trip</h3>
                    <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                        Explore "God's Own Country" with our specially curated Kerala travel packages.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5">
                        {destinations.map((dest) => (
                            <div
                                key={dest.id}
                                className="bg-white rounded-md md:rounded-xl shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md duration-300 border border-emerald-100"
                            >
                                <div className="relative h-20 md:h-28 overflow-hidden">
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

                                    <Link to={`/package/${dest.id}`} className="w-full bg-emerald-600 text-white font-medium py-0.5 md:py-1.5 rounded md:rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center group text-[8px] md:text-xs">
                                        <span className="hidden md:inline">View Trip</span>
                                        <span className="md:hidden">View</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2 h-2 md:w-3 md:h-3 ml-0.5 md:ml-1.5 transition-transform group-hover:translate-x-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link to="/kerala-packages" className="inline-flex items-center justify-center bg-gray-900 text-white font-bold py-2.5 px-8 rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-lg group text-sm">
                            View More Kerala Packages
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SouthIndiaDestinations;
