import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const cruiseHighlights = [
    { icon: '🚢', title: 'Luxury Cruise', desc: 'Premium Nefertiti cruise experience' },
    { icon: '🌅', title: 'Sunset Views', desc: 'Breathtaking Arabian Sea sunsets' },
    { icon: '🍽️', title: 'Fine Dining', desc: 'Multi-cuisine onboard restaurant' },
    { icon: '🎶', title: 'Entertainment', desc: 'Live music & cultural shows' },
];

const initialPackages = [
    {
        id: 'nef-1',
        title: 'Day Cruise Experience',
        duration: '6 Hours',
        price: '₹3,500',
        features: ['Lunch Buffet', 'Live Music', 'Deck Access', 'Welcome Drink'],
    },
    {
        id: 'nef-2',
        title: 'Sunset Dinner Cruise',
        duration: '4 Hours',
        price: '₹4,999',
        features: ['Dinner Buffet', 'Sunset Viewing', 'DJ Night', 'Cocktails'],
        popular: true,
    },
    {
        id: 'nef-3',
        title: 'Overnight Luxury Cruise',
        duration: '18 Hours',
        price: '₹8,500',
        features: ['All Meals', 'Private Cabin', 'Spa Access', 'Guided Tour'],
    },
];

const cruiseImages = [
    { src: '/neferitity.jpg', caption: 'Nefertiti Cruise - Kochi' },
    { src: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', caption: 'Cruise Deck View' },
    { src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', caption: 'Sunset Sailing' },
    { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', caption: 'Luxury Interior' },
    { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', caption: 'Fine Dining Onboard' },
];

const NefertitiCruise = () => {
    const [activePackage, setActivePackage] = useState<string | number>('nef-1');
    const [currentImage, setCurrentImage] = useState(0);
    const [packages, setPackages] = useState<any[]>(initialPackages);

    useEffect(() => {
        const packagesRef = ref(db, 'packages');
        const unsub = onValue(packagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const fetchedPackages = Object.entries(data)
                    .map(([key, val]: [string, any]) => ({
                        id: key,
                        ...val,
                        features: val.inclusions || [] // Map inclusions to features if features missing
                    }))
                    .filter((pkg) => pkg.category === 'nefertity');

                if (fetchedPackages.length > 0) {
                    setPackages(fetchedPackages);
                    setActivePackage(fetchedPackages[0].id);
                }
            }
        });
        return () => unsub();
    }, []);

    const nextImage = useCallback(() => {
        setCurrentImage((prev) => (prev + 1) % cruiseImages.length);
    }, []);

    const prevImage = useCallback(() => {
        setCurrentImage((prev) => (prev - 1 + cruiseImages.length) % cruiseImages.length);
    }, []);

    // Auto-play carousel
    useEffect(() => {
        const timer = setInterval(nextImage, 4000);
        return () => clearInterval(timer);
    }, [nextImage]);

    return (
        <section id="nefertiti-cruise" className="relative py-8 md:py-14 overflow-hidden">
            {/* Ocean Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-900 via-blue-900 to-indigo-950"></div>

            {/* Animated Wave Layers */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: '120px' }}>
                <svg className="absolute bottom-0 w-[200%] animate-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: '60px' }}>
                    <path d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,40 1440,40 L1440,120 L0,120Z" fill="rgba(255,255,255,0.06)" />
                </svg>
                <svg className="absolute bottom-0 w-[200%] animate-wave-slow" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: '80px' }}>
                    <path d="M0,60 C320,10 640,100 960,40 C1120,10 1320,80 1440,60 L1440,120 L0,120Z" fill="rgba(255,255,255,0.04)" />
                </svg>
                <svg className="absolute bottom-0 w-[200%] animate-wave-slower" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: '100px' }}>
                    <path d="M0,80 C240,30 480,90 720,50 C960,10 1200,70 1440,40 L1440,120 L0,120Z" fill="rgba(255,255,255,0.03)" />
                </svg>
            </div>

            {/* Floating Bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/5 animate-float"
                        style={{
                            width: `${8 + i * 6}px`,
                            height: `${8 + i * 6}px`,
                            left: `${5 + i * 10}%`,
                            bottom: `-${5 + i * 4}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${5 + i * 1.5}s`,
                        }}
                    />
                ))}
            </div>

            {/* 🐠 Underwater Sea Life */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Swimming Fish - left to right */}
                <div className="absolute animate-swim-right" style={{ top: '20%', animationDuration: '18s', animationDelay: '0s' }}>
                    <span className="text-2xl opacity-15" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>🐟</span>
                </div>
                <div className="absolute animate-swim-right" style={{ top: '55%', animationDuration: '14s', animationDelay: '3s' }}>
                    <span className="text-xl opacity-12" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>🐠</span>
                </div>
                <div className="absolute animate-swim-right" style={{ top: '75%', animationDuration: '20s', animationDelay: '7s' }}>
                    <span className="text-lg opacity-10" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>🐟</span>
                </div>
                <div className="absolute animate-swim-right" style={{ top: '35%', animationDuration: '16s', animationDelay: '10s' }}>
                    <span className="text-xl opacity-15" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>🐡</span>
                </div>

                {/* Swimming Fish - right to left */}
                <div className="absolute animate-swim-left" style={{ top: '40%', animationDuration: '22s', animationDelay: '2s' }}>
                    <span className="text-2xl opacity-12">🐟</span>
                </div>
                <div className="absolute animate-swim-left" style={{ top: '65%', animationDuration: '17s', animationDelay: '5s' }}>
                    <span className="text-lg opacity-10">🐠</span>
                </div>

                {/* Jellyfish - floating down slowly */}
                <div className="absolute animate-jellyfish" style={{ left: '15%', animationDuration: '15s', animationDelay: '0s' }}>
                    <span className="text-2xl opacity-10">🪼</span>
                </div>
                <div className="absolute animate-jellyfish" style={{ left: '70%', animationDuration: '18s', animationDelay: '6s' }}>
                    <span className="text-xl opacity-8">🪼</span>
                </div>

                {/* Seahorse - gentle bobbing */}
                <div className="absolute animate-bob" style={{ right: '8%', top: '30%', animationDuration: '6s' }}>
                    <span className="text-xl opacity-12">🦑</span>
                </div>

                {/* Turtle */}
                <div className="absolute animate-swim-right" style={{ top: '85%', animationDuration: '25s', animationDelay: '4s' }}>
                    <span className="text-2xl opacity-10" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>🐢</span>
                </div>

                {/* Octopus */}
                <div className="absolute animate-bob" style={{ left: '5%', bottom: '20%', animationDuration: '8s', animationDelay: '2s' }}>
                    <span className="text-2xl opacity-8">🐙</span>
                </div>

                {/* Starfish - static at bottom */}
                <div className="absolute bottom-4 left-[20%] animate-pulse" style={{ animationDuration: '4s' }}>
                    <span className="text-xl opacity-10">⭐</span>
                </div>
                <div className="absolute bottom-6 right-[25%] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                    <span className="text-lg opacity-8">🌟</span>
                </div>

                {/* Coral / Seaweed at bottom */}
                <div className="absolute bottom-0 left-[10%] animate-sway" style={{ animationDuration: '4s', transformOrigin: 'bottom center' }}>
                    <span className="text-3xl opacity-10">🪸</span>
                </div>
                <div className="absolute bottom-0 left-[40%] animate-sway" style={{ animationDuration: '5s', animationDelay: '1s', transformOrigin: 'bottom center' }}>
                    <span className="text-2xl opacity-8">🌿</span>
                </div>
                <div className="absolute bottom-0 right-[15%] animate-sway" style={{ animationDuration: '3.5s', animationDelay: '0.5s', transformOrigin: 'bottom center' }}>
                    <span className="text-3xl opacity-10">🪸</span>
                </div>
                <div className="absolute bottom-0 right-[35%] animate-sway" style={{ animationDuration: '4.5s', animationDelay: '2s', transformOrigin: 'bottom center' }}>
                    <span className="text-xl opacity-8">🌿</span>
                </div>

                {/* Shell */}
                <div className="absolute bottom-3 left-[55%] animate-pulse" style={{ animationDuration: '6s' }}>
                    <span className="text-lg opacity-8">🐚</span>
                </div>
            </div>

            {/* Sparkle / Light rays from surface */}
            <div className="absolute top-0 left-[20%] w-px h-32 bg-gradient-to-b from-cyan-300/20 to-transparent"></div>
            <div className="absolute top-0 left-[50%] w-px h-24 bg-gradient-to-b from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-[25%] w-px h-28 bg-gradient-to-b from-cyan-200/15 to-transparent"></div>

            {/* Content */}
            <div className="container mx-auto px-2 md:px-8 lg:px-16 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-3">
                            <span className="text-sm">⚓</span>
                            <span className="text-white/90 text-[10px] font-medium tracking-wider uppercase">Exclusive Cruise Package</span>
                        </div>
                        <h2 className="text-lg md:text-2xl lg:text-3xl font-display font-bold text-white mb-1 md:mb-2">
                            Kochin Nefertiti Cruise
                        </h2>
                        <p className="text-xs md:text-sm text-cyan-200/80 max-w-lg mx-auto">
                            Sail through the majestic backwaters of Kochi on the legendary Nefertiti cruise ship.
                        </p>
                    </div>

                    {/* Main Content: Image + Highlights */}
                    <div className="flex flex-col lg:flex-row gap-3 md:gap-6 mb-4 md:mb-8">
                        {/* Cruise Image Carousel */}
                        <div className="lg:w-3/5 relative group">
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10">
                                {/* Images */}
                                <div className="relative h-32 md:h-64 lg:h-72">
                                    {cruiseImages.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img.src}
                                            alt={img.caption}
                                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${i === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent"></div>

                                {/* Prev Arrow */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Previous image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                {/* Next Arrow */}
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Next image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>

                                {/* Caption Badge */}
                                <div className="absolute bottom-3 left-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2">
                                    <p className="text-white font-bold text-sm">🚢 {cruiseImages[currentImage].caption}</p>
                                    <p className="text-cyan-200 text-[10px]">Kochi Backwater Cruise</p>
                                </div>

                                {/* Rating */}
                                <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                                    <span className="text-white text-[10px] font-bold">★ 4.9</span>
                                </div>

                                {/* Dot Indicators */}
                                <div className="absolute bottom-3 right-3 flex gap-1">
                                    {cruiseImages.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentImage(i)}
                                            className={`rounded-full transition-all duration-300 ${i === currentImage ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="lg:w-2/5 grid grid-cols-2 gap-2 md:gap-3">
                            {cruiseHighlights.map((h, i) => (
                                <div
                                    key={i}
                                    className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 hover:bg-white/15 transition-all duration-300 group"
                                >
                                    <span className="text-lg md:text-2xl block mb-1 md:mb-2 group-hover:scale-110 transition-transform">{h.icon}</span>
                                    <h4 className="text-white font-bold text-[9px] md:text-xs mb-0.5">{h.title}</h4>
                                    <p className="text-cyan-200/70 text-[7px] md:text-[10px] hidden md:block">{h.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Packages */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                onClick={() => setActivePackage(pkg.id)}
                                className={`relative cursor-pointer rounded-lg md:rounded-xl p-2 md:p-4 transition-all duration-300 border ${activePackage === pkg.id
                                    ? 'bg-white/15 border-cyan-400/40 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-2 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        MOST POPULAR
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-1 md:mb-2">
                                    <div>
                                        <h3 className="text-white font-bold text-[9px] md:text-sm leading-tight">{pkg.title}</h3>
                                        <p className="text-cyan-300/70 text-[7px] md:text-[10px]">⏱ {pkg.duration}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-cyan-300 font-bold text-xs md:text-lg">{pkg.price}</p>
                                        <p className="text-white/40 text-[7px] md:text-[9px]">per person</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1 md:gap-1.5 mb-2 md:mb-3">
                                    {pkg.features && pkg.features.map((f: string, i: number) => (
                                        <span key={i} className="bg-white/10 text-white/80 text-[6px] md:text-[9px] px-1 md:px-2 py-0.5 rounded-full">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                                <Link to={`/package/${pkg.id}`} className={`block text-center w-full py-1 md:py-1.5 rounded md:rounded-lg text-[8px] md:text-xs font-bold transition-all ${activePackage === pkg.id
                                    ? 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-md'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                    }`}>
                                    <span className="hidden md:inline">{activePackage === pkg.id ? 'View Details' : 'View Package'}</span>
                                    <span className="md:hidden">{activePackage === pkg.id ? 'View' : 'Select'}</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NefertitiCruise;
