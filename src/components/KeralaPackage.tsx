
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const KeralaPackage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        const packagesRef = ref(db, 'packages');
        const unsub = onValue(packagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const fetchedPackages = Object.entries(data)
                    .map(([key, val]: [string, any]) => ({ id: key, ...val }))
                    .filter((pkg) => pkg.category === 'magic_kerala');

                if (fetchedPackages.length > 0) {
                    setPackages(fetchedPackages);
                }
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (packages.length < 2) return; // Don't auto-scroll if 0 or 1 item

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % packages.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [packages]);

    const getItem = (offset: number) => {
        return packages[(currentIndex + offset) % packages.length];
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

                    <div className="mt-8">
                        <Link to="/kerala-packages" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 font-bold py-3 px-8 rounded-full transition-all group">
                            View All Packages
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </Link>
                    </div>


                </div>

                {/* Right Side - Small Package Cards Carousel */}
                <div className="w-full md:w-5/12 flex flex-col gap-4 relative h-auto md:h-64 justify-center mt-8 md:mt-0">
                    {packages.length > 0 ? (
                        (packages.length === 1 ? [0] : [0, 1]).map((offset) => {
                            const item = getItem(offset);
                            if (!item) return null; // Guard against undefined
                            return (
                                <Link to={`/package/${item.id}`}
                                    key={item.id || offset}
                                    className={`bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-all duration-700 cursor-pointer group ${offset === 1 ? 'md:translate-x-4' : ''}`}
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
                                </Link>
                            );
                        })
                    ) : (
                        <div className="text-white text-center italic bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            Loading exclusive Kerala packages...
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default KeralaPackage;
