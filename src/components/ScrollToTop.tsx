import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const { pathname } = useLocation();

    // Automatically scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;

            // Calculate scroll progress (0 to 100)
            const totalScrollableHeight = documentHeight - windowHeight;
            const progress = (scrollTop / totalScrollableHeight) * 100;

            setScrollProgress(Math.min(progress, 100));
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Calculate stroke dash offset for circular progress
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    // Calculate bus position on the circle
    // Convert scroll progress (0-100) to degrees (0-360)
    const angle = (scrollProgress / 100) * 360;
    const angleInRadians = (angle - 90) * (Math.PI / 180); // Start at top (-90 degrees)

    // Calculate bus position on the circle circumference
    const centerX = 24;
    const centerY = 24;
    const busRadius = radius + 6; // Position bus slightly outside the circle
    const busX = centerX + busRadius * Math.cos(angleInRadians);
    const busY = centerY + busRadius * Math.sin(angleInRadians);

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 group transition-all duration-300 opacity-100 translate-y-0"
            aria-label="Scroll to top"
        >
            <div className="relative w-14 h-14 md:w-16 md:h-16">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-2xl group-hover:shadow-[0_20px_60px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-all duration-300"></div>

                {/* Progress Circle with Bus */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 48 48" style={{ overflow: 'visible' }}>
                    {/* Background track */}
                    <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="3"
                        fill="none"
                        transform="rotate(-90 24 24)"
                    />
                    {/* Progress ring */}
                    <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        stroke="#ffffff"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                        transform="rotate(-90 24 24)"
                    />

                    {/* Bus Icon traveling around the circle */}
                    <g
                        transform={`translate(${busX}, ${busY}) rotate(${angle} 0 0)`}
                        className="transition-all duration-300"
                    >
                        {/* Bus SVG Icon */}
                        <g transform="translate(-6, -6) scale(0.5)">
                            {/* Bus body */}
                            <rect x="2" y="6" width="20" height="14" rx="2" fill="white" stroke="white" strokeWidth="1" />
                            {/* Windows */}
                            <rect x="4" y="8" width="4" height="4" fill="#ef4444" rx="0.5" />
                            <rect x="9" y="8" width="4" height="4" fill="#ef4444" rx="0.5" />
                            <rect x="14" y="8" width="4" height="4" fill="#ef4444" rx="0.5" />
                            {/* Wheels */}
                            <circle cx="7" cy="20" r="2" fill="white" stroke="#ef4444" strokeWidth="1.5" />
                            <circle cx="17" cy="20" r="2" fill="white" stroke="#ef4444" strokeWidth="1.5" />
                            {/* Front detail */}
                            <rect x="2" y="14" width="20" height="2" fill="white" />
                        </g>
                    </g>
                </svg>

                {/* Percentage Text (visible on hover) */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(scrollProgress)}% scrolled
                </div>
            </div>
        </button>
    );
};

export default ScrollToTop;
