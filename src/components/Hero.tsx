import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import TravelRoute from './TravelRoute';




const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState<any[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const SLIDE_DURATION = 6000;

    useEffect(() => {
        // Fetch Slides
        const slidesRef = ref(db, 'hero_slides');
        const unsubSlides = onValue(slidesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                setSlides(list);
            } else {
                setSlides([]);
            }
        });

        // Fetch Packages for Auto-Matching
        const packagesRef = ref(db, 'packages');
        const unsubPackages = onValue(packagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                setPackages(list);
            } else {
                setPackages([]);
            }
        });

        return () => {
            unsubSlides();
            unsubPackages();
        };
    }, []);

    // Logic to find the best matching package for a slide
    const getPackageLink = (slide: any) => {
        if (!slide) return '/packages';

        // 1. Explicit Link (set in Admin)
        if (slide.packageId) {
            return `/package/${slide.packageId}`;
        }

        // 2. Auto-Match by Title
        // Check if banner title matches any package title (partial match)
        if (packages.length > 0 && slide.title) {
            const slideTitleWords = slide.title.toLowerCase().split(' ');

            const matchedPkg = packages.find(pkg => {
                const pkgTitle = pkg.title.toLowerCase();
                // Check if any significant word from banner title exists in package title
                return slideTitleWords.some((word: string) =>
                    word.length > 3 && pkgTitle.includes(word)
                );
            });

            if (matchedPkg) {
                return `/package/${matchedPkg.id}`;
            }
        }

        // 3. Fallback to static matching (for legacy/hardcoded support if needed, or just default)
        // ... (removed static list to rely on real data as requested)

        return '/packages';
    };

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, [slides]);

    if (slides.length === 0) {
        return <div className="h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
    }

    const packageLink = getPackageLink(slides[currentSlide]);

    return (
        <div className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
            {/* Background Images with Slide effect */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out z-0 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{
                        backgroundImage: `url('${slide.image}')`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            ))}

            {/* Travel Route Animation */}
            {slides[currentSlide] && slides[currentSlide].destinations && (
                <TravelRoute key={`route-${currentSlide}`} destinations={slides[currentSlide].destinations} />
            )}

            {/* Content Area */}
            <div className="relative z-10 px-4 max-w-4xl mx-auto">
                <div key={currentSlide} className="animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 drop-shadow-lg">
                        {slides[currentSlide]?.title}
                    </h1>
                    <p className="text-xl md:text-3xl font-display italic mb-8 text-gray-200 drop-shadow-md lg:px-20">
                        {slides[currentSlide]?.quote}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <Link
                        to={packageLink}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 shadow-lg no-underline"
                    >
                        Package Details
                    </Link>
                    <Link to="/destinations" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold py-4 px-8 rounded-full transition-all border border-white/50 no-underline">
                        More Destinations
                    </Link>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="relative h-1.5 w-16 bg-white/30 rounded-full overflow-hidden transition-all hover:bg-white/50 group"
                    >
                        {index === currentSlide && (
                            <div
                                key={currentSlide}
                                className="absolute top-0 left-0 h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                                style={{
                                    animation: `${SLIDE_DURATION}ms progress-fill linear forwards`
                                }}
                            />
                        )}
                        {/* Background for inactive state is already provided by button class */}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Hero;
