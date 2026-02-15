import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import HomeOffers from '../components/HomeOffers';
import PackageThemes from '../components/PackageThemes';
import KeralaPackage from '../components/KeralaPackage';
import SchoolPackages from '../components/SchoolPackages';

const packagesData = [
    {
        id: 1,
        title: 'Majestic Kashmir Tour',
        image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Dal Lake Shikara ride, Gulmarg skiing, and Pahalgam valley views.',
        price: '$599',
        originalPrice: '$850',
        discount: '30% OFF',
        duration: '6 Days',
        rating: '4.9',
        tag: 'Best Seller'
    },
    {
        id: 2,
        title: 'Royal Rajasthan Heritage',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Explore Jaipur forts, Udaipur lakes, and Jaisalmer desert safari.',
        price: '$450',
        originalPrice: '$650',
        discount: '30% OFF',
        duration: '7 Days',
        rating: '4.8',
        tag: 'Cultural'
    },
    {
        id: 3,
        title: 'Kerala Backwaters Bliss',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Houseboat stay in Alleppey, Munnar tea gardens, and Kochi culture.',
        price: '$399',
        originalPrice: '$600',
        discount: '35% OFF',
        duration: '5 Days',
        rating: '5.0',
        tag: 'Nature'
    },
    {
        id: 4,
        title: 'Goa Beach & Party',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'North Goa nightlife, South Goa serene beaches, and water sports.',
        price: '$299',
        originalPrice: '$450',
        discount: '35% OFF',
        duration: '4 Days',
        rating: '4.7',
        tag: 'Popular'
    }
];

const Packages = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <ScrollToTop />

            {/* Hero Banner Section */}
            <section className="relative flex items-center justify-center text-white overflow-hidden">
                {/* Background Image Container */}
                <div className="relative w-full">
                    <img
                        src="/packagebanner.jpg"
                        alt="India Travel Packages"
                        className="w-full h-auto object-cover min-h-[400px]"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>

                    {/* Banner Content - Absolute Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4 max-w-4xl mx-auto">
                        <span className="inline-block py-1 px-3 rounded-full bg-red-600/80 backdrop-blur-sm text-xs font-bold tracking-wider mb-4 animate-fade-in-up">
                            LIMITED TIME INDIA DEALS
                        </span>
                        <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 drop-shadow-2xl leading-tight animate-fade-in-up delay-100">
                            Exclusive Travel <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
                                Packages
                            </span>
                        </h1>
                        <p className="text-lg md:text-2xl font-light text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-lg animate-fade-in-up delay-200">
                            Unbeatable offers on Kashmir, Kerala, Rajasthan & more.
                        </p>
                        <button
                            onClick={() => {
                                document.getElementById('exclusive-offers')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-2xl hover:scale-105 transition-all transform animate-fade-in-up delay-300"
                        >
                            View Offer Packages
                        </button>
                    </div>
                </div>
            </section>

            {/* Exclusive Offers Section - Reusing Home Style */}
            <div id="exclusive-offers">
                <HomeOffers showAll={true} />
            </div>

            {/* Packages Grid Section */}
            <section className="py-16 px-6 container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-800 mb-3">Hot Deals of the Month 🔥</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm">Don't miss out on these hand-picked packages designed for the smart traveler.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {packagesData.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 border border-gray-100 relative">
                            {/* Discount Badge */}
                            <div className="absolute top-3 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 z-20 shadow-md">
                                {pkg.discount}
                            </div>

                            {/* Card Image */}
                            <div className="relative h-32 overflow-hidden">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[8px] font-bold text-gray-800 flex items-center gap-0.5 shadow-sm">
                                    <svg className="w-2 h-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {pkg.rating}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-3 flex flex-col h-40">
                                <div className="mb-0.5">
                                    <span className="text-[8px] font-bold text-blue-600 uppercase tracking-wider block">{pkg.tag}</span>
                                    <h3 className="text-sm font-bold text-gray-800 group-hover:text-red-600 transition-colors leading-tight line-clamp-1">{pkg.title}</h3>
                                </div>
                                <div className="flex items-center gap-1 mb-1.5 text-[9px] text-gray-500">
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {pkg.duration}
                                </div>

                                <p className="text-gray-600 mb-2 line-clamp-2 text-[10px] leading-snug">{pkg.description}</p>

                                <div className="border-t border-gray-100 pt-1.5 mt-auto">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-[9px] text-gray-400 line-through font-semibold block">{pkg.originalPrice}</span>
                                            <p className="text-base font-bold text-red-600 leading-none">{pkg.price}</p>
                                        </div>
                                        <button className="bg-red-600 text-white font-bold text-[9px] py-1 px-2.5 rounded shadow-red-500/20 shadow-md active:scale-95 hover:bg-red-700 transition-colors">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Kerala Highlight Section */}
            <KeralaPackage />

            {/* Curated Themes Section */}
            <PackageThemes />

            {/* Educational Tours Section */}
            <SchoolPackages />

            <Footer />
        </div>
    );
};

export default Packages;
