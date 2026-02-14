import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import ScrollToTop from '../components/ScrollToTop';

const destinationsData = [
    {
        id: 7,
        state: 'Jammu and Kashmir',
        tagline: 'Paradise on Earth',
        description: 'Snow-capped mountains, pristine lakes, and breathtaking valleys.',
        places: [
            {
                name: 'Srinagar',
                image: 'https://images.unsplash.com/photo-1581791538302-33758102379b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Dal Lake & Houseboats'
            },
            {
                name: 'Gulmarg',
                image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Meadow of Flowers'
            },
            {
                name: 'Pahalgam',
                image: 'https://images.unsplash.com/photo-1581791538302-33758102379b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Valley of Shepherds'
            },
            {
                name: 'Sonmarg',
                image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Meadow of Gold'
            }
        ]
    },
    {
        id: 8,
        state: 'Himachal Pradesh',
        tagline: 'Valley of Gods',
        description: 'Adventure sports, scenic beauty, and serene monasteries in the Himalayas.',
        places: [
            {
                name: 'Solang Valley',
                image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Adventure Hub'
            },
            {
                name: 'Rohtang Pass',
                image: 'https://images.unsplash.com/photo-1581791538302-33758102379b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Snow Paradise'
            },
            {
                name: 'Old Manali',
                image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Hippie Village'
            },
            {
                name: 'Hadimba Temple',
                image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Ancient Shrine'
            }
        ]
    },
    {
        id: 5,
        state: 'Delhi',
        tagline: 'Heart of India',
        description: 'The capital city blends historical grandeur with modern metropolitan life.',
        places: [
            {
                name: 'Red Fort',
                image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Mughal Architecture'
            },
            {
                name: 'India Gate',
                image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'War Memorial'
            },
            {
                name: 'Qutub Minar',
                image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'UNESCO Heritage'
            },
            {
                name: 'Lotus Temple',
                image: 'https://images.unsplash.com/photo-1608211604459-5e85e81f36af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Bahai House of Worship'
            }
        ]
    },
    {
        id: 6,
        state: 'Rajasthan',
        tagline: 'Land of Kings',
        description: 'Royal palaces, majestic forts, and vibrant culture define this desert state.',
        places: [
            {
                name: 'Jaipur',
                image: 'https://images.unsplash.com/photo-1477587458883-4a36979e45e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Pink City'
            },
            {
                name: 'Udaipur',
                image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'City of Lakes'
            },
            {
                name: 'Jaisalmer',
                image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Golden City'
            },
            {
                name: 'Jodhpur',
                image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Blue City'
            }
        ]
    },
    {
        id: 4,
        state: 'Goa',
        tagline: 'Beach Paradise',
        description: 'Sun, sand, and sea combined with Portuguese heritage and vibrant nightlife.',
        places: [
            {
                name: 'North Goa',
                image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Beaches & Nightlife'
            },
            {
                name: 'South Goa',
                image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Peaceful Beaches'
            },
            {
                name: 'Old Goa',
                image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Portuguese Heritage'
            },
            {
                name: 'Palolem',
                image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Crescent Beach'
            }
        ]
    },
    {
        id: 1,
        state: 'Karnataka',
        tagline: 'Land of Diversity',
        description: 'From tech hubs to ancient ruins, Karnataka offers a perfect blend of modernity and heritage.',
        places: [
            {
                name: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Garden City & IT Capital'
            },
            {
                name: 'Mysore',
                image: 'https://images.unsplash.com/photo-1581981368919-7c467a0c5777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'City of Palaces'
            },
            {
                name: 'Hampi',
                image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Ancient Ruins & Heritage'
            },
            {
                name: 'Coorg',
                image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Scotland of India'
            }
        ]
    },
    {
        id: 2,
        state: 'Kerala',
        tagline: 'God\'s Own Country',
        description: 'Experience tranquil backwaters, lush greenery, and vibrant culture in this tropical paradise.',
        places: [
            {
                name: 'Munnar',
                image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Tea Gardens & Hills'
            },
            {
                name: 'Alleppey',
                image: 'https://images.unsplash.com/photo-1543731068-7d0f5beff43a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Backwater Paradise'
            },
            {
                name: 'Kochi',
                image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Queen of Arabian Sea'
            },
            {
                name: 'Wayanad',
                image: 'https://images.unsplash.com/photo-1578330107248-61f237f8ea61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Nature\'s Abode'
            }
        ]
    },
    {
        id: 3,
        state: 'Tamil Nadu',
        tagline: 'Land of Temples',
        description: 'Ancient temples, rich culture, and beautiful beaches await you in Tamil Nadu.',
        places: [
            {
                name: 'Chennai',
                image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Gateway to South India'
            },
            {
                name: 'Madurai',
                image: 'https://images.unsplash.com/photo-1608211604459-5e85e81f36af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Temple City'
            },
            {
                name: 'Ooty',
                image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Queen of Hills'
            },
            {
                name: 'Rameswaram',
                image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Sacred Pilgrimage'
            }
        ]
    }
];

const Destinations = () => {
    return (
        <div className="relative min-h-screen bg-white max-w-screen-xl mx-auto shadow-xl">
            <div className="relative z-10">
                <Navbar />

                {/* Hero Section */}
                <section className="relative h-[85vh] md:h-[115vh] flex items-center justify-center text-white overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-gray-900/10">
                        <img
                            src="/india.jpg"
                            alt="Explore India"
                            className="w-full h-full object-contain md:object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                // Fallback to gradient if image not found
                                target.style.display = 'none';
                                if (target.parentElement) {
                                    target.parentElement.style.background = 'linear-gradient(to right, rgb(37, 99, 235), rgb(220, 38, 38))';
                                }
                            }}
                        />
                    </div>
                    {/* Dark Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
                    {/* Content */}
                    <div className="relative z-10 text-center px-4">
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-2xl">Explore India</h1>
                        <p className="text-lg md:text-2xl font-light max-w-2xl mx-auto drop-shadow-lg">
                            Discover the incredible diversity of India's destinations
                        </p>
                    </div>
                </section>

                {/* Destinations Sections */}
                {destinationsData.map((destination, index) => (
                    <ScrollReveal key={destination.id} animation="fade-up" delay={100}>
                        <section className={`py-12 md:py-16 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                            <div className="container mx-auto px-4 md:px-8">
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                                        {destination.state}
                                    </h2>
                                    <p className="text-xl md:text-2xl text-red-600 font-semibold mb-3">
                                        {destination.tagline}
                                    </p>
                                    <p className="text-gray-600 max-w-2xl mx-auto">
                                        {destination.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-4 gap-2 md:gap-6">
                                    {destination.places.map((place, placeIndex) => (
                                        <div
                                            key={placeIndex}
                                            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                                        >
                                            <div className="aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={place.image}
                                                    alt={place.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-2 md:p-4">
                                                <h3 className="text-white font-bold text-[10px] md:text-lg mb-0.5 md:mb-1 leading-tight">
                                                    {place.name}
                                                </h3>
                                                <p className="text-gray-200 text-[8px] md:text-sm leading-tight line-clamp-2">
                                                    {place.description}
                                                </p>
                                            </div>
                                            {/* Explore Button on Hover */}
                                            <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button className="bg-white text-red-600 font-bold px-2 py-1 md:px-6 md:py-2 text-[8px] md:text-base rounded-full hover:bg-gray-100 transition-colors">
                                                    Explore
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ScrollReveal>
                ))}

                <Footer />
            </div>

            <ScrollToTop />
        </div>
    );
};

export default Destinations;
