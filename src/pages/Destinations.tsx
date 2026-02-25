import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import ScrollToTop from '../components/ScrollToTop';

// ─── Region config (display order, colours, emoji) ───────────────────────────
const REGION_DISPLAY = [
    {
        key: 'north_india',
        label: 'North India',
        emoji: '🏔️',
        gradient: 'from-blue-700 to-indigo-800',
        accentBg: 'bg-blue-50',
        accentText: 'text-blue-700',
        chipBg: 'bg-blue-100 text-blue-800',
        btnClass: 'bg-blue-600 hover:bg-blue-700',
        sectionBg: 'bg-gradient-to-b from-blue-50 to-white',
        dividerColor: 'from-blue-400 to-transparent',
        defaultDesc: 'Discover the majestic mountains, historic forts, and spiritual ghats of North India.',
    },
    {
        key: 'south_india',
        label: 'South India',
        emoji: '🌴',
        gradient: 'from-emerald-600 to-teal-800',
        accentBg: 'bg-emerald-50',
        accentText: 'text-emerald-700',
        chipBg: 'bg-emerald-100 text-emerald-800',
        btnClass: 'bg-emerald-600 hover:bg-emerald-700',
        sectionBg: 'bg-gradient-to-b from-emerald-50 to-white',
        dividerColor: 'from-emerald-400 to-transparent',
        defaultDesc: 'Explore backwater cruises, ancient temples and lush green landscapes of South India.',
    },
    {
        key: 'rajasthan',
        label: 'Rajasthan',
        emoji: '🏯',
        gradient: 'from-orange-500 to-amber-700',
        accentBg: 'bg-orange-50',
        accentText: 'text-orange-700',
        chipBg: 'bg-orange-100 text-orange-800',
        btnClass: 'bg-orange-500 hover:bg-orange-600',
        sectionBg: 'bg-gradient-to-b from-orange-50 to-white',
        dividerColor: 'from-orange-400 to-transparent',
        defaultDesc: 'Step into a royal world of palaces, sand dunes, and vibrant culture in Rajasthan.',
    },
    {
        key: 'goa',
        label: 'Goa',
        emoji: '🏖️',
        gradient: 'from-cyan-500 to-sky-700',
        accentBg: 'bg-cyan-50',
        accentText: 'text-cyan-700',
        chipBg: 'bg-cyan-100 text-cyan-800',
        btnClass: 'bg-cyan-500 hover:bg-cyan-600',
        sectionBg: 'bg-gradient-to-b from-cyan-50 to-white',
        dividerColor: 'from-cyan-400 to-transparent',
        defaultDesc: 'Sun, sand & soul — enjoy beautiful beaches, vibrant nightlife and Portuguese heritage in Goa.',
    },
];

// ─── Package-link helper (same logic as Hero.tsx) ─────────────────────────────
const getPackageLink = (place: any, regionLabel: string, packages: any[]): string => {
    if (place.packageId) return `/package/${place.packageId}`;
    if (packages.length > 0) {
        const words = `${place.name} ${regionLabel}`
            .toLowerCase()
            .split(' ')
            .filter((w: string) => w.length > 3);
        const matched = packages.find((pkg: any) => {
            const t = (pkg.title || '').toLowerCase();
            const l = (pkg.location || '').toLowerCase();
            return words.some((w: string) => t.includes(w) || l.includes(w));
        });
        if (matched) return `/package/${matched.id}`;
    }
    return '/packages';
};

// ─── Place Card ───────────────────────────────────────────────────────────────
const PlaceCard = ({
    place,
    regionLabel,
    packages,
    btnClass,
    navigate,
}: {
    place: any;
    regionLabel: string;
    packages: any[];
    btnClass: string;
    navigate: (path: string) => void;
}) => (
    <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="aspect-[4/3] overflow-hidden">
            <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80';
                }}
            />
        </div>
        {/* Always-visible overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3 md:p-4">
            <h3 className="text-white font-bold text-sm md:text-lg mb-0.5 leading-tight drop-shadow">
                {place.name}
            </h3>
            <p className="text-gray-200 text-[10px] md:text-sm leading-tight line-clamp-2">
                {place.description}
            </p>
        </div>
        {/* Hover explore button */}
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
                onClick={() => navigate(getPackageLink(place, regionLabel, packages))}
                className={`${btnClass} text-white font-bold px-5 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-sm`}
            >
                Explore
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </button>
        </div>
    </div>
);

// ─── Region Section ───────────────────────────────────────────────────────────
const RegionSection = ({
    cfg,
    data,
    packages,
    navigate,
    index,
}: {
    cfg: typeof REGION_DISPLAY[0];
    data: any;
    packages: any[];
    navigate: (path: string) => void;
    index: number;
}) => {
    const places: any[] = data?.places
        ? Array.isArray(data.places) ? data.places : Object.values(data.places)
        : [];

    const highlights: string[] = data?.highlights
        ? data.highlights.split(',').map((h: string) => h.trim()).filter(Boolean)
        : [];

    const hasSectionData = data && (data.tagline || data.description || places.length > 0);

    if (!hasSectionData) return null;

    return (
        <ScrollReveal animation="fade-up" delay={100}>
            <section
                id={cfg.key}
                className={`py-16 md:py-20 ${index % 2 === 0 ? cfg.sectionBg : 'bg-white'}`}
            >
                <div className="container mx-auto px-4 md:px-8">

                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end gap-6 mb-10">
                        {/* Hero image thumbnail + title block */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                                    {cfg.emoji}
                                </div>
                                <div>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${cfg.accentText} block mb-0.5`}>Destination</span>
                                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight">
                                        {cfg.label}
                                    </h2>
                                </div>
                            </div>

                            {data?.tagline && (
                                <p className={`text-lg md:text-xl font-semibold ${cfg.accentText} mb-2`}>
                                    {data.tagline}
                                </p>
                            )}
                            <p className="text-gray-600 max-w-2xl leading-relaxed text-sm md:text-base">
                                {data?.description || cfg.defaultDesc}
                            </p>

                            {/* Highlights chips */}
                            {highlights.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {highlights.map((h, i) => (
                                        <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.chipBg}`}>
                                            ✦ {h}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Hero image */}
                        {data?.heroImage && (
                            <div className="w-full md:w-72 h-44 rounded-2xl overflow-hidden shadow-xl flex-shrink-0">
                                <img
                                    src={data.heroImage}
                                    alt={cfg.label}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className={`w-full h-px bg-gradient-to-r ${cfg.dividerColor} mb-8`} />

                    {/* Places Grid */}
                    {places.length > 0 ? (
                        <div className={`grid gap-4 md:gap-6 ${places.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
                                places.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' :
                                    places.length === 3 ? 'grid-cols-3' :
                                        'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                            }`}>
                            {places.map((place: any, i: number) => (
                                <PlaceCard
                                    key={i}
                                    place={place}
                                    regionLabel={cfg.label}
                                    packages={packages}
                                    btnClass={cfg.btnClass}
                                    navigate={navigate}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${cfg.accentBg} border-current ${cfg.accentText} opacity-50`}>
                            <span className="text-4xl mb-3 block">{cfg.emoji}</span>
                            <p className="font-medium">Places coming soon for {cfg.label}</p>
                        </div>
                    )}
                </div>
            </section>
        </ScrollReveal>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const Destinations = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [destinationsData, setDestinationsData] = useState<any[]>([]);
    const [regionSections, setRegionSections] = useState<Record<string, any>>({});
    const [packages, setPackages] = useState<any[]>([]);
    const [loadingDest, setLoadingDest] = useState(true);
    const [loadingRegions, setLoadingRegions] = useState(true);

    // ── General destinations (AdminDestinationManager) ──────────────────────
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

    // ── Region sections (AdminRegionManager) ────────────────────────────────
    useEffect(() => {
        const regRef = ref(db, 'region_sections');
        const unsub = onValue(regRef, (snap) => {
            if (snap.exists()) {
                setRegionSections(snap.val());
            } else {
                setRegionSections({});
            }
            setLoadingRegions(false);
        });
        return () => unsub();
    }, []);

    // ── Packages (for auto-linking) ─────────────────────────────────────────
    useEffect(() => {
        const pkgRef = ref(db, 'packages');
        const unsub = onValue(pkgRef, (snap) => {
            if (snap.exists()) {
                setPackages(Object.entries(snap.val()).map(([id, val]: [string, any]) => ({ id, ...val })));
            } else {
                setPackages([]);
            }
        });
        return () => unsub();
    }, []);

    // ── Hash scroll ─────────────────────────────────────────────────────────
    const isLoading = loadingDest || loadingRegions;
    useEffect(() => {
        if (!isLoading && location.hash) {
            const id = location.hash.substring(1).replace(/%20/g, ' ');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
            }
        }
    }, [location, isLoading]);

    const handleExplore = (place: any, stateName: string) => {
        navigate(getPackageLink(place, stateName, packages));
    };

    // Which REGION_DISPLAY keys have admin data?
    const activeRegions = REGION_DISPLAY.filter(r => {
        const d = regionSections[r.key];
        if (!d) return false;
        const places = d.places ? (Array.isArray(d.places) ? d.places : Object.values(d.places)) : [];
        return d.tagline || d.description || places.length > 0;
    });

    return (
        <div className="relative min-h-screen bg-white w-full">
            <div className="relative z-10">
                <Navbar />

                {/* ── Hero ──────────────────────────────────────────────── */}
                <section className="relative h-[85vh] md:h-[115vh] flex items-center justify-center text-white overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900/10">
                        <img
                            src="/india.jpg"
                            alt="Explore India"
                            className="w-full h-full object-contain md:object-cover"
                            onError={(e) => {
                                const t = e.target as HTMLImageElement;
                                t.style.display = 'none';
                                if (t.parentElement) {
                                    t.parentElement.style.background = 'linear-gradient(to right, rgb(37,99,235), rgb(220,38,38))';
                                }
                            }}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
                    <div className="relative z-10 text-center px-4">
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-2xl">Explore India</h1>
                        <p className="text-lg md:text-2xl font-light max-w-2xl mx-auto drop-shadow-lg">
                            Discover the incredible diversity of India's destinations
                        </p>

                        {/* Quick-jump pills */}
                        {activeRegions.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-3 mt-8">
                                {activeRegions.map(r => (
                                    <button
                                        key={r.key}
                                        onClick={() => {
                                            document.getElementById(r.key)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className="bg-white/20 backdrop-blur-sm border border-white/40 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/30 transition-all"
                                    >
                                        {r.emoji} {r.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Loading ────────────────────────────────────────────── */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
                    </div>
                ) : (
                    <>
                        {/* ── Fixed Region Sections (North India, South India, Rajasthan, Goa) ── */}
                        {REGION_DISPLAY.map((cfg, idx) => (
                            <RegionSection
                                key={cfg.key}
                                cfg={cfg}
                                data={regionSections[cfg.key]}
                                packages={packages}
                                navigate={navigate}
                                index={idx}
                            />
                        ))}

                        {/* ── General / Custom Destinations (from AdminDestinationManager) ── */}
                        {destinationsData.length > 0 && (
                            <>
                                {/* Separator */}
                                <div className="py-8 bg-gray-100">
                                    <div className="container mx-auto px-4 md:px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-px bg-gray-300" />
                                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                                🗺️ More Destinations
                                            </h2>
                                            <div className="flex-1 h-px bg-gray-300" />
                                        </div>
                                    </div>
                                </div>

                                {destinationsData.map((destination, index) => (
                                    <ScrollReveal key={destination.id} animation="fade-up" delay={100}>
                                        <section
                                            id={destination.state}
                                            className={`py-12 md:py-16 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                                        >
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
                                ))}
                            </>
                        )}

                        {/* Empty state — nothing from either source */}
                        {activeRegions.length === 0 && destinationsData.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                                <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <p className="text-lg font-medium">No destinations added yet.</p>
                                <p className="text-sm">Check back soon or visit the admin panel to add destinations.</p>
                            </div>
                        )}
                    </>
                )}

                <Footer />
            </div>

            <ScrollToTop />
        </div>
    );
};

export default Destinations;
