import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const AllKeralaPackages = () => {
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        const packagesRef = ref(db, 'packages');
        const unsub = onValue(packagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const fetchedPackages = Object.entries(data)
                    .map(([key, val]: [string, any]) => ({ id: key, ...val }))
                    .filter((pkg) => pkg.category === 'magic_kerala' || pkg.category === 'all_kerala' || pkg.category === 'southside');
                setPackages(fetchedPackages);
            }
        });
        return () => unsub();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Navbar />
            <ScrollToTop />

            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/kerala.jpg"
                        alt="Kerala - God's Own Country"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <span className="inline-block py-1 px-3 rounded-full bg-green-600/90 backdrop-blur-sm text-xs font-bold tracking-wider mb-4">
                        GOD'S OWN COUNTRY
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg leading-tight">
                        All <span className="text-green-400">Kerala</span> Package
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
                        Explore the serene backwaters, misty hills of Munnar, and pristine beaches.
                    </p>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="container mx-auto px-4 py-16">
                {packages.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Loading Kerala packages...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
                        {packages.map((pkg) => (
                            <Link to={`/package/${pkg.id}`} key={pkg.id} className="group bg-white rounded-lg md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                                <div className="relative h-20 md:h-44 overflow-hidden">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-md px-1.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
                                        <span className="text-yellow-500">★</span> {pkg.rating || '4.8'}
                                    </div>
                                    {pkg.discount && (
                                        <div className="hidden md:block absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            {pkg.discount}
                                        </div>
                                    )}
                                </div>

                                <div className="p-1.5 md:p-5 flex-1 flex flex-col">
                                    <div className="mb-2 md:mb-4">
                                        <span className="text-[10px] md:text-xs font-bold text-green-600 uppercase tracking-wider block mb-1 md:mb-2">{pkg.location}</span>
                                        <h3 className="text-xs md:text-xl font-bold text-gray-900 leading-tight group-hover:text-green-700 transition-colors mb-1 md:mb-2 line-clamp-2">
                                            {pkg.title}
                                        </h3>
                                        <p className="hidden md:block text-gray-500 text-sm line-clamp-3 leading-relaxed">
                                            {pkg.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto border-t border-gray-100 pt-2 md:pt-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] md:text-xs text-gray-400 font-semibold uppercase hidden md:block">Starting from</p>
                                            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2">
                                                <span className="text-sm md:text-2xl font-bold text-gray-900">{pkg.price}</span>
                                                {pkg.originalPrice && (
                                                    <span className="hidden md:inline text-sm text-gray-400 line-through decoration-red-400">{pkg.originalPrice}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden md:block bg-gray-50 p-2 rounded-lg group-hover:bg-green-50 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div >
    );
};

export default AllKeralaPackages;
