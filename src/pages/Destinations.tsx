import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import ScrollToTop from '../components/ScrollToTop';

const Destinations = () => {
    const navigate = useNavigate();
    const [destinationsData, setDestinationsData] = useState<any[]>([]);
    const [loadingDest, setLoadingDest] = useState(true);
    const [packages, setPackages] = useState<any[]>([]);

    // Load destinations from Firebase
    useEffect(() => {
        const destRef = ref(db, 'destinations');
        const unsub = onValue(destRef, (snap) => {
            if (snap.exists()) {
                const data = snap.val();
                const list = Object.entries(data).map(([id, val]: [string, any]) => ({
                    id,
                    ...val,
                    places: val.places ? Object.values(val.places) : [],
                }));
                list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                setDestinationsData(list);
            } else {
                setDestinationsData([]);
            }
            setLoadingDest(false);
        });
        return () => unsub();
    }, []);

    // Load all packages for auto title-matching (same as Hero.tsx)
    useEffect(() => {
        const pkgRef = ref(db, 'packages');
        const unsub = onValue(pkgRef, (snap) => {
            if (snap.exists()) {
                const data = snap.val();
                const list = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
                setPackages(list);
            } else {
                setPackages([]);
            }
        });
        return () => unsub();
    }, []);

    // Same logic as Hero.tsx getPackageLink:
    // 1. Explicit packageId on the place → go directly
    // 2. Auto-match place name words against package titles
    // 3. Fallback to /packages
    const getPackageLink = (place: any, stateName: string): string => {
        // 1. Explicit link set by admin
        if (place.packageId) {
            return `/package/${place.packageId}`;
        }

        // 2. Auto-match: split place name + state into words > 3 chars
        if (packages.length > 0) {
            const searchWords = `${place.name} ${stateName}`
                .toLowerCase()
                .split(' ')
                .filter((w: string) => w.length > 3);

            const matched = packages.find((pkg: any) => {
                const pkgTitle = (pkg.title || '').toLowerCase();
                const pkgLocation = (pkg.location || '').toLowerCase();
                return searchWords.some((word: string) =>
                    pkgTitle.includes(word) || pkgLocation.includes(word)
                );
            });

            if (matched) return `/package/${matched.id}`;
        }

        // 3. Fallback
        return '/packages';
    };

    const handleExplore = (place: any, stateName: string) => {
        navigate(getPackageLink(place, stateName));
    };

    return (
        <div className="relative min-h-screen bg-white w-full">
            <div className="relative z-10">
                <Navbar />

                {/* Hero Section */}
                <section className="relative h-[85vh] md:h-[115vh] flex items-center justify-center text-white overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900/10">
                        <img
                            src="/india.jpg"
                            alt="Explore India"
                            className="w-full h-full object-contain md:object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                if (target.parentElement) {
                                    target.parentElement.style.background = 'linear-gradient(to right, rgb(37, 99, 235), rgb(220, 38, 38))';
                                }
                            }}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
                    <div className="relative z-10 text-center px-4">
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-2xl">Explore India</h1>
                        <p className="text-lg md:text-2xl font-light max-w-2xl mx-auto drop-shadow-lg">
                            Discover the incredible diversity of India's destinations
                        </p>
                    </div>
                </section>

                {loadingDest ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
                    </div>
                ) : destinationsData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <p className="text-lg font-medium">No destinations added yet.</p>
                        <p className="text-sm">Check back soon or visit the admin panel to add destinations.</p>
                    </div>
                ) : (
                    destinationsData.map((destination, index) => (
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
                                        {destination.places.map((place: any, placeIndex: number) => (
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
                                                    <button
                                                        onClick={() => handleExplore(place, destination.state)}
                                                        className="bg-white text-red-600 font-bold px-2 py-1 md:px-6 md:py-2 text-[8px] md:text-base rounded-full hover:bg-gray-100 transition-colors flex items-center gap-1"
                                                    >
                                                        Explore
                                                        <svg className="w-2 h-2 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </ScrollReveal>
                    ))
                )}

                <Footer />
            </div>

            <ScrollToTop />
        </div>
    );
};

export default Destinations;
