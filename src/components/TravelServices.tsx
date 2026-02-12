
const bookingServices = [
    {
        id: 1,
        title: 'Hotel Booking',
        description: 'Find the best stays ranging from luxury resorts to budget-friendly hotels.',
        image: '/hotel.png',
        color: 'bg-red-50',
        textColor: 'text-red-600'
    },
    {
        id: 2,
        title: 'Tour Packages',
        description: 'Handpicked holiday packages tailored to your interests and budget.',
        image: '/tour.svg',
        color: 'bg-red-50',
        textColor: 'text-red-600'
    },
    {
        id: 3,
        title: 'Flight Tickets',
        description: 'Easy and fast flight bookings with the best deals and zero hidden costs.',
        image: 'https://cdn-icons-png.flaticon.com/512/3125/3125713.png',
        color: 'bg-red-50',
        textColor: 'text-red-600'
    },
    {
        id: 4,
        title: 'Train Tickets',
        description: 'Hassle-free IRCTC train ticket bookings with instant confirmation.',
        image: '/train.svg',
        color: 'bg-red-50',
        textColor: 'text-red-600'
    },
    {
        id: 5,
        title: 'Bus Tickets',
        description: 'Book your bus seats online for both AC and non-AC coaches at low prices.',
        image: '/bus.svg',
        color: 'bg-red-50',
        textColor: 'text-red-600'
    },
    {
        id: 6,
        title: 'Local Sightseeing',
        description: 'Comprehensive local tour guides and vehicle rentals for city exploration.',
        image: 'https://cdn-icons-png.flaticon.com/512/3754/3754303.png',
        color: 'bg-red-50',
        textColor: 'text-red-600'
    }
];

const TravelServices = () => {
    return (
        <section id="services" className="py-12 bg-gray-50">
            <div className="container mx-auto px-8 md:px-16">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3 uppercase tracking-tight">
                        Our Comprehensive Services
                    </h2>
                    <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                        One-stop solution for all your travel needs. We make your journey smooth and comfortable.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
                        {bookingServices.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white rounded-md md:rounded-xl p-2 md:p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-red-100 group"
                            >
                                <div className={`w-8 h-8 md:w-11 md:h-11 ${service.color} rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-5 h-5 md:w-7 md:h-7 object-contain"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://cdn-icons-png.flaticon.com/512/201/201623.png';
                                        }}
                                    />
                                </div>
                                <h3 className="text-[9px] md:text-sm font-bold text-gray-900 mb-1 md:mb-1.5 group-hover:text-red-600 transition-colors leading-tight">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 text-[7px] md:text-xs leading-relaxed mb-2 md:mb-4 line-clamp-2 hidden md:block">
                                    {service.description}
                                </p>
                                <button className="text-red-600 font-bold text-[8px] md:text-xs flex items-center gap-1 md:gap-1.5 group/btn">
                                    <span className="hidden md:inline">Learn More</span>
                                    <span className="md:hidden">More</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-2 h-2 md:w-3.5 md:h-3.5 transition-transform group-hover/btn:translate-x-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TravelServices;
