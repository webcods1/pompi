import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

// This data should ideally come from a centralized data source or API
const allPackages = [
    {
        id: 1,
        title: 'Majestic Kashmir Tour',
        image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: 'Experience the paradise on earth with our comprehensive Kashmir tour. Enjoy a Shikara ride on the serene Dal Lake, witness the breathtaking meadows of Gulmarg, and explore the valleys of Pahalgam.',
        price: '$599',
        originalPrice: '$850',
        discount: '30% OFF',
        duration: '6 Days / 5 Nights',
        rating: '4.9',
        tag: 'Best Seller',
        location: 'Kashmir, India',
        inclusions: [
            'Accommodation in 4-star hotels & Houseboat',
            'Daily Breakfast & Dinner',
            'Airport Transfers',
            'Sightseeing by private cab',
            'Shikara Ride on Dal Lake',
            'Gondola Ride tickets (Phase 1)'
        ],
        itinerary: [
            { day: 1, title: 'Arrival in Srinagar', desc: 'Pickup from airport, check-in to houseboat. Evening Shikara ride.' },
            { day: 2, title: 'Srinagar to Gulmarg', desc: 'Day trip to Gulmarg. Enjoy Gondola ride and snow activities.' },
            { day: 3, title: 'Srinagar to Pahalgam', desc: 'Visit Saffron fields and Avantipura ruins enroute.' },
            { day: 4, title: 'Pahalgam Sightseeing', desc: 'Visit Betaab Valley, Chandanwari and Aru Valley.' },
            { day: 5, title: 'Return to Srinagar', desc: 'Local sightseeing - Mughal Gardens and Shankaracharya Temple.' },
            { day: 6, title: 'Departure', desc: 'Transfer to Srinagar airport for onward journey.' }
        ]
    },
    {
        id: 2,
        title: 'Royal Rajasthan Heritage',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: 'Immerse yourself in the royal heritage of Rajasthan. Visit the majestic Amer Fort in Jaipur, the City of Lakes Udaipur, and experience a desert safari in Jaisalmer.',
        price: '$450',
        originalPrice: '$650',
        discount: '30% OFF',
        duration: '7 Days / 6 Nights',
        rating: '4.8',
        tag: 'Cultural',
        location: 'Rajasthan, India',
        inclusions: [
            'Heritage Hotel Stays',
            'Daily Buffet Breakfast',
            'Camel Safari in Jaisalmer',
            'Boat ride in Lake Pichola',
            'English speaking guide',
            'All monument entry fees'
        ],
        itinerary: [
            { day: 1, title: 'Arrival in Jaipur', desc: 'Welcome to the Pink City. Check-in and evening at Chokhi Dhani.' },
            { day: 2, title: 'Jaipur Sightseeing', desc: 'Visit Amer Fort, Hawa Mahal, Jantar Mantar and City Palace.' },
            { day: 3, title: 'Jaipur to Jodhpur', desc: 'Drive to the Blue City. Visit Mehrangarh Fort.' },
            { day: 4, title: 'Jodhpur to Jaisalmer', desc: 'Travel to the Golden City. Evening at Sam Sand Dunes.' },
            { day: 5, title: 'Jaisalmer Exploration', desc: 'Visit Jaisalmer Fort and Havelis. Desert Safari in evening.' },
            { day: 6, title: 'Jaisalmer to Udaipur', desc: 'Drive to Udaipur, visiting Ranakpur Jain Temple enroute.' },
            { day: 7, title: 'Udaipur & Departure', desc: 'City Palace, Lake Pichola boat ride. Transfer to airport.' }
        ]
    },
    // Add more packages as needed... mapping from HomeOffers data
    {
        id: 3,
        title: 'Kerala Backwaters Bliss',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: 'Relax in the serene backwaters of Alleppey, explore the tea gardens of Munnar, and witness the colonial charm of Kochi.',
        price: '$399',
        originalPrice: '$600',
        discount: '35% OFF',
        duration: '5 Days / 4 Nights',
        rating: '5.0',
        tag: 'Nature',
        location: 'Kerala, India',
        inclusions: [
            'Premium Houseboat Stay',
            'All Meals on Houseboat',
            'Breakfast in Hotels',
            'Tea Museum Visit',
            'Kathakali Dance Show',
            'Private AC Vehicle'
        ],
        itinerary: [
            { day: 1, title: 'Arrival in Kochi - Munnar', desc: 'Drive to Munnar, enjoying waterfalls like Cheeyappara en route.' },
            { day: 2, title: 'Munnar Sightseeing', desc: 'Visit Eravikulam National Park, Tea Museum, and Mattupetty Dam.' },
            { day: 3, title: 'Munnar to Thekkady', desc: 'Spice plantation tour and Periyar Lake boat ride.' },
            { day: 4, title: 'Thekkady to Alleppey', desc: 'Check in to Houseboat. Cruise through backwaters.' },
            { day: 5, title: 'Departure from Kochi', desc: 'Morning cruise, checkout and transfer to Kochi airport.' }
        ]
    },
    {
        id: 4,
        title: 'Goa Beach & Party',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: 'The ultimate beach vacation. Experience the vibrant nightlife of North Goa and the tranquil beaches of South Goa.',
        price: '$299',
        originalPrice: '$450',
        discount: '35% OFF',
        duration: '4 Days / 3 Nights',
        rating: '4.7',
        tag: 'Popular',
        location: 'Goa, India',
        inclusions: [
            '3 Star Resort Stay',
            'Daily Breakfast',
            'Airport Pickup & Drop',
            'One Day North Goa Tour',
            'One Day South Goa Tour',
            'Mandovi River Cruise Ticket'
        ],
        itinerary: [
            { day: 1, title: 'Arrival in Goa', desc: 'Transfer to hotel. Leisure time at Calangute beach.' },
            { day: 2, title: 'North Goa Tour', desc: 'Fort Aguada, Baga Beach, Anjuna Beach and Vagator.' },
            { day: 3, title: 'South Goa Tour', desc: 'Old Goa Churches, Mangueshi Temple, Dona Paula and Miramar.' },
            { day: 4, title: 'Departure', desc: 'Check out and transfer to Dabolim Airport.' }
        ]
    },
    {
        id: 5,
        title: 'Himalayan Trek Adventure',
        image: 'https://images.unsplash.com/photo-1518002171953-a080ee802e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Experience the thrill of trekking through the majestic Himalayan ranges. Perfect for adventure enthusiasts.',
        price: '$350',
        originalPrice: '$550',
        discount: '36% OFF',
        duration: '6 Days',
        rating: '4.9',
        tag: 'Adventure',
        location: 'Himachal Pradesh, India',
        inclusions: ['Trekking Guides', 'Camping Gear', 'All Meals during Trek', 'Permits'],
        itinerary: [
            { day: 1, title: 'Arrival in Manali', desc: 'Acclimatization and briefing.' },
            { day: 2, title: 'Trek Starts', desc: 'Manali to Camp 1.' },
            { day: 3, title: 'Summit Day', desc: 'Reach the peak and enjoy panoramic views.' },
            { day: 4, title: 'Descent', desc: 'Return to base camp.' },
            { day: 5, title: 'Leisure', desc: 'Explore Manali local culture.' },
            { day: 6, title: 'Departure', desc: 'Return journey.' }
        ]
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
        tag: 'Honeymoon',
        location: 'Andaman & Nicobar Islands',
        inclusions: [],
        itinerary: []
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
        tag: 'Spiritual',
        location: 'Varanasi, India',
        inclusions: [],
        itinerary: []
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
        tag: 'Heritage',
        location: 'Mysore, India',
        inclusions: [],
        itinerary: []
    }
];

const PackageDetails = () => {
    const { id } = useParams();
    const { currentUser, openLoginModal } = useAuth();
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success'>('idle');
    const pkg = allPackages.find(p => p.id === Number(id));

    const handleBook = () => {
        if (!currentUser) {
            openLoginModal();
            return;
        }

        setBookingStatus('booking');
        // Simulate booking API call
        setTimeout(() => {
            setBookingStatus('success');
            // Reset after 3 seconds
            setTimeout(() => setBookingStatus('idle'), 3000);
        }, 1500);
    };

    if (!pkg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Package Not Found</h2>
                    <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <ScrollToTop />

            {/* Hero Image */}
            <div className="relative h-[60vh] w-full">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-screen-xl mx-auto">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                        {pkg.tag}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">{pkg.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm md:text-base opacity-90">
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {pkg.duration}
                        </span>
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {pkg.location}
                        </span>
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            {pkg.rating} Rating
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-screen-xl">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content Room */}
                    <div className="lg:w-2/3">
                        {/* Description */}
                        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{pkg.description}</p>
                        </div>

                        {/* Itinerary */}
                        {pkg.itinerary && pkg.itinerary.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Itinerary</h2>
                                <div className="space-y-8">
                                    {pkg.itinerary.map((item, index) => (
                                        <div key={index} className="flex gap-4 relative">
                                            {/* Line connector */}
                                            {index !== pkg.itinerary!.length - 1 && (
                                                <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
                                            )}

                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                                                {item.day}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                                                <p className="text-gray-600">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inclusions */}
                        {pkg.inclusions && pkg.inclusions.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Included</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pkg.inclusions.map((inc, index) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-600">
                                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            {inc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Booking Card */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 p-6 border-b border-gray-100">
                                    <p className="text-gray-500 text-sm mb-1 line-through">Original Price: {pkg.originalPrice}</p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-4xl font-bold text-gray-900">{pkg.price}</h2>
                                        <span className="text-sm font-semibold text-green-600">per person</span>
                                    </div>
                                    <div className="mt-2 inline-block bg-red-100 text-xs text-red-700 px-2 py-1 rounded font-bold">
                                        Save {pkg.discount}
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Select Date</label>
                                        <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Guests</label>
                                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                            <option>1 Adult</option>
                                            <option>2 Adults</option>
                                            <option>2 Adults, 1 Child</option>
                                            <option>4 Adults</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleBook}
                                        disabled={bookingStatus === 'booking' || bookingStatus === 'success'}
                                        className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 ${bookingStatus === 'success'
                                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/30'
                                            : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30'
                                            }`}
                                    >
                                        {bookingStatus === 'booking' ? 'Processing...' :
                                            bookingStatus === 'success' ? 'Booking Requested!' : 'Proceed to Book'}
                                    </button>

                                    <div className="pt-4 text-center">
                                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            Secure Payment & Instant Confirmation
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                                <div className="bg-white p-2.5 rounded-full text-blue-600 shadow-sm">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-1">Need Help?</h4>
                                    <p className="text-sm text-gray-600 mb-2">Speak to our travel expert for free guidance.</p>
                                    <a href="tel:+1234567890" className="text-blue-700 font-bold hover:underline">Call +1 (234) 567-890</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PackageDetails;
