
import { Link } from 'react-router-dom';

const services = [
    {
        id: 1,
        title: 'Wedding Services',
        description: 'Premium luxury buses for your special day. We ensure your guests travel in comfort and style.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        )
    },
    {
        id: 2,
        title: 'Local Trips',
        description: 'Explore local attractions with our experienced drivers. Perfect for family outings and city tours.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
        )
    },
    {
        id: 3,
        title: 'Corporate Travel',
        description: 'Efficient and reliable transport solutions for corporate events and employee commutes.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
        )
    }
];

const BusServices = () => {
    return (
        <section id="bus-services" className="py-10 bg-white">
            <div className="container mx-auto px-8 md:px-16">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Left Side: Image */}
                        <div className="lg:w-1/2 relative group">
                            <div className="absolute -inset-3 bg-red-100 rounded-2xl transform -rotate-3 transition-transform group-hover:rotate-0 duration-500"></div>
                            <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-3">
                                <img
                                    src="/pompiai.png"
                                    alt="Pompi Bus Service"
                                    className="w-full h-auto rounded-lg transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                                    }}
                                />
                            </div>
                            {/* Status Badge */}
                            <div className="absolute -bottom-4 -right-4 bg-red-600 text-white p-4 rounded-xl shadow-lg hidden md:block">
                                <p className="text-xl font-bold">24/7</p>
                                <p className="text-[10px] font-medium uppercase tracking-wider">Available</p>
                            </div>
                        </div>

                        {/* Right Side: Content */}
                        <div className="lg:w-1/2">
                            <div className="mb-4">
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3 uppercase tracking-tight">
                                    Luxury Tourist Bus Services
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed border-l-4 border-red-600 pl-4 italic">
                                    "Safe, Comfortable, and Reliable transport solutions for every occasion."
                                </p>
                            </div>

                            <div className="space-y-3">
                                {services.map((service) => (
                                    <div key={service.id} className="flex gap-4 group">
                                        <div className="flex-shrink-0 w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center transition-colors group-hover:bg-red-600 group-hover:text-white duration-300">
                                            {service.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 mb-1">{service.title}</h3>
                                            <p className="text-gray-600 text-xs">{service.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link to="/bookings/bus" className="bg-red-600 text-white font-bold py-2.5 px-8 rounded-full hover:bg-red-700 transition-all hover:scale-105 shadow-lg text-sm inline-block">
                                    Book Your Bus Now
                                </Link>
                                <button className="bg-white text-gray-900 border-2 border-gray-900 font-bold py-2.5 px-8 rounded-full hover:bg-gray-900 hover:text-white transition-all text-sm">
                                    Call for Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusServices;
