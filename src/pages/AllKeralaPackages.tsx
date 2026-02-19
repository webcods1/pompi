import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const KeralaPackages = () => {
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        const packagesRef = ref(db, 'packages');
        const unsub = onValue(packagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const fetchedPackages = Object.entries(data)
                    .map(([key, val]: [string, any]) => ({ id: key, ...val }))
                    .filter((pkg) => pkg.category === 'magic_kerala');
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
                    <span className="inline-block py-1 px-3 rounded-full bg-green-600/90 backdrop-blur-sm text-xs font-bold tracking-wider mb-4 animate-fade-in-up">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((pkg) => (
                            <Link to={`/package/${pkg.id}`} key={pkg.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
                                        <span className="text-yellow-500">★</span> {pkg.rating || '4.8'}
                                    </div>
                                    {pkg.discount && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            {pkg.discount}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider block mb-2">{pkg.location}</span>
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-green-700 transition-colors mb-2 line-clamp-2">
                                            {pkg.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                                            {pkg.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400 font-semibold uppercase">Starting from</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-gray-900">{pkg.price}</span>
                                                {pkg.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through decoration-red-400">{pkg.originalPrice}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-green-50 transition-colors">
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
        </div>
    );
};

export default KeralaPackages;
