import React, { useState, useEffect } from 'react';

const miniPackages = [
    {
        id: 1,
        title: 'Alleppey Houseboat',
        duration: '2 Days / 1 Night',
        price: '$150',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 2,
        title: 'Munnar Tea Gardens',
        duration: '3 Days / 2 Nights',
        price: '$199',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 3,
        title: 'Varkala Beach',
        duration: '3 Days / 2 Nights',
        price: '$180',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb56fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 4,
        title: 'Wayanad Wildlife',
        duration: '4 Days / 3 Nights',
        price: '$250',
        image: 'https://images.unsplash.com/photo-1598460662703-a204aa7338dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 5,
        title: 'Kochi Culture Tour',
        duration: '2 Days / 1 Night',
        price: '$120',
        image: 'https://images.unsplash.com/photo-1591528659423-37599723bd23?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }
];

const KeralaPackage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % miniPackages.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const getItem = (offset: number) => {
        return miniPackages[(currentIndex + offset) % miniPackages.length];
    };

    return (
        <section className="relative py-20 px-6 overflow-hidden">
            {/* Background Image with Parallax-like effect */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/kerala.jpg"
                    alt="Kerala Backwaters"
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay for better readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            </div>

            <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                {/* Text Content */}
                <div className="md:w-1/2 text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-green-600/90 backdrop-blur-sm text-xs font-bold tracking-wider mb-6 animate-pulse">
                        GOD'S OWN COUNTRY
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                        Experience the Magic of <span className="text-green-400">Kerala</span>
                    </h2>
                    <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                        Immerse yourself in the serene backwaters, lush tea gardens, and pristine beaches.
                        Our exclusive Kerala package offers a perfect blend of nature, culture, and relaxation.
                    </p>

                    <ul className="grid grid-cols-2 gap-4 mb-8">
                        {['Houseboat Stays', 'Ayurvedic Spa', 'Tea Plantations', 'Cultural Arts'].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm font-semibold">
                                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap gap-4">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1">
                            Book Kerala Package
                        </button>
                        <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 font-bold py-3 px-8 rounded-full transition-all">
                            View Itinerary
                        </button>
                    </div>
                </div>

                {/* Right Side - Small Package Cards Carousel */}
                <div className="md:w-5/12 hidden md:flex flex-col gap-4 relative h-64 justify-center">
                    {[0, 1].map((offset) => {
                        const item = getItem(offset);
                        return (
                            <div
                                key={item.id}
                                className={`bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-all duration-700 cursor-pointer group ${offset === 1 ? 'translate-x-4' : ''}`}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="text-white font-bold text-lg leading-tight">{item.title}</h4>
                                    <p className="text-green-300 text-xs font-semibold mb-1">{item.duration}</p>
                                    <p className="text-white/80 text-xs">Starting from <span className="text-white font-bold text-base ml-1">{item.price}</span></p>
                                </div>
                                <div className="bg-green-500 p-2 rounded-full text-white group-hover:scale-110 transition-transform">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default KeralaPackage;
