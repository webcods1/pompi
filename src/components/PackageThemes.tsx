import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const PackageThemes = () => {
    const navigate = useNavigate();
    const [themePackages, setThemePackages] = useState<any>({
        honeymoon: [],
        spiritual: [],
        adventure: []
    });

    useEffect(() => {
        const packagesRef = ref(db, 'packages');
        const unsub = onValue(packagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const allPackages = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));

                const newThemePackages = {
                    honeymoon: allPackages.filter((pkg: any) => pkg.category === 'honeymoon'),
                    spiritual: allPackages.filter((pkg: any) => pkg.category === 'spiritual'),
                    adventure: allPackages.filter((pkg: any) => pkg.category === 'adventure')
                };

                setThemePackages(newThemePackages);
            } else {
                setThemePackages({
                    honeymoon: [],
                    spiritual: [],
                    adventure: []
                });
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
            case 'honeymoon':
                return 'bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 border-pink-100';
            case 'spiritual':
                return 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-orange-100';
            case 'adventure':
                return 'bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 border-sky-100';
            default:
                return 'bg-gray-50 border-gray-100';
        }
    };

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
                        if (!packages || packages.length === 0) return null; // Don't show empty themes

                        return (
                            <div
                                key={theme.id}
                                className={`rounded-[2.5rem] p-6 md:p-10 border shadow-sm ${getThemeStyles(theme.id)} transition-all hover:shadow-md`}
                            >
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                            {theme.title.split(' ')[0]}
                                            <span className="text-gray-600 font-normal">{theme.title.substring(theme.title.indexOf(' ') + 1)}</span>
                                        </h3>
                                        <p className="text-gray-600 text-sm md:text-base opacity-80">{theme.subtitle}</p>
                                    </div>
                                    {/* Optional: Add View All button logic if needed */}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {packages.map((pkg: any) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => navigate(`/package/${pkg.id}`)}
                                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5 border border-white/50 cursor-pointer"
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={pkg.image}
                                                    alt={pkg.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                                                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                    {pkg.rating || '4.5'}
                                                </div>
                                                <div className="absolute bottom-3 left-3 text-white">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5 text-yellow-300">{pkg.duration}</p>
                                                    <h4 className="font-bold text-base leading-tight drop-shadow-md">{pkg.title}</h4>
                                                </div>
                                            </div>
                                            <div className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Starting from</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <p className="text-lg font-bold text-gray-800">{pkg.price}</p>
                                                        <span className="text-[10px] text-gray-400">/person</span>
                                                    </div>
                                                </div>
                                                <button className="bg-gray-50 text-gray-800 hover:bg-black hover:text-white p-2.5 rounded-xl transition-all duration-300 shadow-sm border border-gray-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PackageThemes;
