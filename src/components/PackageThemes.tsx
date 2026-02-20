import { useState, useEffect, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

// Returns how many cards should be visible per page based on screen width
const getCardsPerPage = () => (window.innerWidth >= 1024 ? 4 : 2);

const PackageThemes = () => {
    const navigate = useNavigate();
    const [themePackages, setThemePackages] = useState<any>({
        honeymoon: [],
        spiritual: [],
        adventure: []
    });

    // tracks cards per page (4 on desktop, 2 on mobile)
    const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage);

    // Update cardsPerPage on window resize
    useEffect(() => {
        const handleResize = () => setCardsPerPage(getCardsPerPage());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const packagesRef = ref(db, 'packages');
        const unsub = onValue(packagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const allPackages = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));

                setThemePackages({
                    honeymoon: allPackages.filter((pkg: any) => pkg.category === 'honeymoon'),
                    spiritual: allPackages.filter((pkg: any) => pkg.category === 'spiritual'),
                    adventure: allPackages.filter((pkg: any) => pkg.category === 'adventure')
                });
            } else {
                setThemePackages({ honeymoon: [], spiritual: [], adventure: [] });
            }
        });
        return () => unsub();
    }, []);

    const themeConfig = [
        {
            id: 'honeymoon',
            title: 'Romantic Honeymoons',
            subtitle: 'Celebrate love in the most enchanting destinations of India.',
        },
        {
            id: 'spiritual',
            title: 'Spiritual Journeys',
            subtitle: 'Find inner peace and explore the divine heritage of India.',
        },
        {
            id: 'adventure',
            title: 'Adventure & Wildlife',
            subtitle: 'Thrilling experiences for the brave and nature lovers.',
        }
    ];

    const getThemeStyles = (id: string) => {
        switch (id) {
            case 'honeymoon': return 'bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 border-pink-100';
            case 'spiritual': return 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-orange-100';
            case 'adventure': return 'bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 border-sky-100';
            default: return 'bg-gray-50 border-gray-100';
        }
    };

    const getAccentColors = (id: string) => {
        switch (id) {
            case 'honeymoon': return { dot: 'bg-pink-500', dotOff: 'bg-pink-200', arrow: 'hover:bg-pink-50 hover:border-pink-200 hover:text-pink-500' };
            case 'spiritual': return { dot: 'bg-orange-500', dotOff: 'bg-orange-200', arrow: 'hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500' };
            case 'adventure': return { dot: 'bg-sky-500', dotOff: 'bg-sky-200', arrow: 'hover:bg-sky-50 hover:border-sky-200 hover:text-sky-500' };
            default: return { dot: 'bg-gray-500', dotOff: 'bg-gray-200', arrow: 'hover:bg-gray-50' };
        }
    };

    const [pageIndexes, setPageIndexes] = useState<{ [key: string]: number }>({});
    const [animating, setAnimating] = useState<{ [key: string]: boolean }>({});

    const changePage = useCallback((themeId: string, totalPackages: number, direction: 'next' | 'prev') => {
        if (animating[themeId]) return;
        setAnimating((prev) => ({ ...prev, [themeId]: true }));
        setTimeout(() => {
            setPageIndexes((prev) => {
                const currentPage = prev[themeId] || 0;
                const totalPages = Math.ceil(totalPackages / cardsPerPage);
                let nextPage: number;
                if (direction === 'next') {
                    nextPage = (currentPage + 1) % totalPages;
                } else {
                    nextPage = (currentPage - 1 + totalPages) % totalPages;
                }
                return { ...prev, [themeId]: nextPage };
            });
            setTimeout(() => {
                setAnimating((prev) => ({ ...prev, [themeId]: false }));
            }, 50);
        }, 280);
    }, [animating, cardsPerPage]);

    return (
        <div className="py-12 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-800 mb-3">Discover India by Theme</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Explore curated vacation experiences tailored to your interests.</p>
                </div>

                <div className="space-y-16">
                    {themeConfig.map((theme) => {
                        const packages = themePackages[theme.id as keyof typeof themePackages];
                        if (!packages || packages.length === 0) return null;

                        const currentPage = pageIndexes[theme.id] || 0;
                        const totalPages = Math.ceil(packages.length / cardsPerPage);
                        const visiblePackages = packages.slice(currentPage * cardsPerPage, currentPage * cardsPerPage + cardsPerPage);
                        const isAnimating = animating[theme.id] || false;
                        const colors = getAccentColors(theme.id);
                        const isDesktop = cardsPerPage === 4;

                        return (
                            <div
                                key={theme.id}
                                className={`rounded-[2.5rem] p-6 md:p-10 border shadow-sm ${getThemeStyles(theme.id)} transition-all hover:shadow-md`}
                            >
                                {/* Header Row */}
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                            {theme.title.split(' ')[0]}
                                            <span className="text-gray-600 font-normal">{theme.title.substring(theme.title.indexOf(' ') + 1)}</span>
                                        </h3>
                                        <p className="text-gray-600 text-sm md:text-base opacity-80">{theme.subtitle}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Dot indicators */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center gap-1.5">
                                                {Array.from({ length: totalPages }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentPage ? `w-5 ${colors.dot}` : `w-1.5 ${colors.dotOff}`}`}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Desktop Arrow Buttons — shown only on lg+ */}
                                        {totalPages > 1 && isDesktop && (
                                            <div className="hidden lg:flex items-center gap-2">
                                                <button
                                                    onClick={() => changePage(theme.id, packages.length, 'prev')}
                                                    disabled={isAnimating}
                                                    aria-label="Previous"
                                                    className={`bg-white border border-gray-200 text-gray-600 p-2.5 rounded-full shadow-sm transition-all duration-200 disabled:opacity-40 ${colors.arrow}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => changePage(theme.id, packages.length, 'next')}
                                                    disabled={isAnimating}
                                                    aria-label="Next"
                                                    className={`bg-white border border-gray-200 text-gray-600 p-2.5 rounded-full shadow-sm transition-all duration-200 disabled:opacity-40 ${colors.arrow}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Cards Grid */}
                                <div
                                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                                    style={{
                                        opacity: isAnimating ? 0 : 1,
                                        transform: isAnimating ? 'translateY(12px)' : 'translateY(0)',
                                        transition: 'opacity 0.28s ease, transform 0.28s ease'
                                    }}
                                >
                                    {visiblePackages.map((pkg: any) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => navigate(`/package/${pkg.id}`)}
                                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5 border border-white/50 cursor-pointer"
                                        >
                                            <div className="relative h-32 md:h-48 overflow-hidden">
                                                <img
                                                    src={pkg.image}
                                                    alt={pkg.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                                <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/90 backdrop-blur-md px-1.5 py-0.5 md:px-2 md:py-1 rounded-md text-[10px] md:text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                                                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    {pkg.rating || '4.5'}
                                                </div>
                                                <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 text-white">
                                                    <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5 text-yellow-300">{pkg.duration}</p>
                                                    <h4 className="font-bold text-xs md:text-base leading-tight drop-shadow-md line-clamp-1">{pkg.title}</h4>
                                                </div>
                                            </div>
                                            <div className="p-3 md:p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[9px] md:text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Starting from</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <p className="text-sm md:text-lg font-bold text-gray-800">{pkg.price}</p>
                                                        <span className="text-[9px] md:text-[10px] text-gray-400">/p</span>
                                                    </div>
                                                </div>
                                                <button className="bg-gray-50 text-gray-800 hover:bg-black hover:text-white p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-300 shadow-sm border border-gray-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile-only: Down Arrow (bottom center) */}
                                {totalPages > 1 && !isDesktop && (
                                    <div className="flex justify-center mt-8 lg:hidden">
                                        <button
                                            onClick={() => changePage(theme.id, packages.length, 'next')}
                                            disabled={isAnimating}
                                            className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors group disabled:opacity-50"
                                        >
                                            <span className="text-xs font-bold uppercase tracking-widest">{currentPage + 1} / {totalPages}</span>
                                            <div className={`bg-white p-2.5 rounded-full shadow-md border border-gray-100 group-hover:shadow-lg transition-all`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 animate-bounce">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PackageThemes;
