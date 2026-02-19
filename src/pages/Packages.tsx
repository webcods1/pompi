import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import HomeOffers from '../components/HomeOffers';
import PackageThemes from '../components/PackageThemes';
import KeralaPackage from '../components/KeralaPackage';
import SchoolPackages from '../components/SchoolPackages';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Packages = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100); // Small delay to ensure render
            }
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <ScrollToTop />

            {/* Hero Banner Section */}
            <section className="relative flex items-center justify-center text-white overflow-hidden h-screen md:h-auto">
                {/* Background Image Container */}
                <div className="absolute inset-0 w-full h-full md:relative md:h-auto">
                    <img
                        src="/packagebanner.jpg" // You might want to use a state or prop for this if dynamic
                        alt="India Travel Packages"
                        className="w-full h-full md:h-auto object-cover md:min-h-[400px]"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
                </div>

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
            </section>

            {/* Exclusive Offers Section - Reusing Home Style */}
            <div id="exclusive-offers">
                <HomeOffers showAll={true} />
            </div>

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
