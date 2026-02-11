
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
        <section id="services" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 uppercase tracking-tight">
                        Our Comprehensive Services
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        One-stop solution for all your travel needs. We make your journey smooth and comfortable.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookingServices.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-red-100 group"
                        >
                            <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-10 h-10 object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://cdn-icons-png.flaticon.com/512/201/201623.png'; // Universal travel icon
                                    }}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {service.description}
                            </p>
                            <button className="text-red-600 font-bold flex items-center gap-2 group/btn">
                                Learn More
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover/btn:translate-x-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TravelServices;
