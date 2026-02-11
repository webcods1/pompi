import { useEffect, useState, useRef } from 'react';

const ScrollTrack = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: document.documentElement.scrollHeight });
    const lastScrollY = useRef(0);
    const busRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const footer = document.querySelector('footer');
            const footerTop = footer ? footer.offsetTop : document.documentElement.scrollHeight;
            const totalScroll = footerTop - window.innerHeight + 100; // Finish navigation slightly before reaching the very end

            setIsScrollingUp(currentScroll < lastScrollY.current);
            lastScrollY.current = currentScroll;

            const progress = Math.min(Math.max(currentScroll / totalScroll, 0), 1);
            setScrollProgress(progress);
        };

        const updateDimensions = () => {
            const footer = document.querySelector('footer');
            const newHeight = (footer ? footer.offsetTop : document.documentElement.scrollHeight) + 60;

            setDimensions({
                width: window.innerWidth,
                height: newHeight
            });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', updateDimensions);

        // Initial values
        updateDimensions();
        handleScroll();

        // Check height changes (e.g. after images load)
        const observer = new ResizeObserver(updateDimensions);
        observer.observe(document.body);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateDimensions);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (pathRef.current && busRef.current) {
            const pathLength = pathRef.current.getTotalLength();
            // We use a small offset so the bus stays slightly ahead of the point to calculate rotation better
            const length = scrollProgress * pathLength;
            const point = pathRef.current.getPointAtLength(length);

            const nextPoint = pathRef.current.getPointAtLength(Math.min(length + 5, pathLength));
            let angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;

            // Level the bus to horizontal parking position at the very beginning or end
            if (scrollProgress < 0.02 || scrollProgress > 0.98) {
                angle = 0;
            } else if (isScrollingUp) {
                angle -= 180;
            }

            busRef.current.style.transform = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg)`;
        }
    }, [scrollProgress, dimensions, isScrollingUp]);

    const centerX = dimensions.width * 0.85; // Position track on the right side
    const hAmp = dimensions.width * 0.05; // Smaller curves for the side track
    const h = dimensions.height;

    const pathD = `M ${centerX - 20} 20
                  L ${centerX} 40
                  Q ${centerX + hAmp} ${h * 0.1} ${centerX} ${h * 0.2} 
                  T ${centerX} ${h * 0.4} 
                  T ${centerX} ${h * 0.6} 
                  T ${centerX} ${h * 0.8} 
                  L ${centerX} ${h - 100}
                  L ${centerX - 20} ${h - 80}`; // Curved entrance to parking spot even higher

    return (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden" style={{ height: h }}>
            <svg width={dimensions.width} height={h} viewBox={`0 0 ${dimensions.width} ${h}`}>
                {/* Dotted Path */}
                <path
                    ref={pathRef}
                    d={pathD}
                    fill="none"
                    stroke="#cbd5e1" // Slate-300
                    strokeWidth="3"
                    strokeDasharray="8,12"
                    className="opacity-30"
                />

                {/* Section Stop Marks - One per major section */}
                {[0.15, 0.38, 0.62, 0.85].map((pos, i) => {
                    const length = pos * (pathRef.current?.getTotalLength() || 0);
                    const point = pathRef.current?.getPointAtLength(length) || { x: centerX, y: h * pos };
                    return (
                        <g key={i}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="8"
                                fill="#ffffff"
                                stroke="#ef4444"
                                strokeWidth="2"
                                className="animate-pulse shadow-sm"
                            />
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="3"
                                fill="#ef4444"
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Moving Bus Container */}
            <div
                ref={busRef}
                className="absolute top-0 left-0 w-16 h-12 -ml-8 -mt-6 z-20 flex items-center justify-center transition-transform duration-200 ease-out"
            >
                <svg viewBox="0 0 100 60" className="w-14 h-auto drop-shadow-lg">
                    {/* Bus Body */}
                    <rect x="5" y="10" width="90" height="35" rx="6" fill="#1e293b" />
                    <rect x="10" y="15" width="80" height="15" rx="2" fill="#ffffff" opacity="0.1" />
                    {/* Windows */}
                    <rect x="15" y="18" width="12" height="10" rx="1" fill="#ffffff" opacity="0.9" />
                    <rect x="32" y="18" width="12" height="10" rx="1" fill="#ffffff" opacity="0.9" />
                    <rect x="49" y="18" width="12" height="10" rx="1" fill="#ffffff" opacity="0.9" />
                    <rect x="66" y="18" width="12" height="10" rx="1" fill="#ffffff" opacity="0.9" />
                    {/* Front Door */}
                    <rect x="83" y="18" width="8" height="27" rx="1" fill="#f8fafc" />
                    {/* Headlight */}
                    <circle cx="92" cy="40" r="2" fill="#ffffff" />

                    {/* Animated Wheels */}
                    <g className="animate-spin-slow origin-center">
                        <circle cx="25" cy="48" r="7" fill="#000000" />
                        <circle cx="25" cy="48" r="3" fill="#ffffff" />
                        <rect x="24" y="41" width="2" height="14" fill="#ffffff" opacity="0.5" />
                        <rect x="18" y="47" width="14" height="2" fill="#ffffff" opacity="0.5" />
                    </g>
                    <g className="animate-spin-slow origin-center">
                        <circle cx="75" cy="48" r="7" fill="#000000" />
                        <circle cx="75" cy="48" r="3" fill="#ffffff" />
                        <rect x="74" y="41" width="2" height="14" fill="#ffffff" opacity="0.5" />
                        <rect x="68" y="47" width="14" height="2" fill="#ffffff" opacity="0.5" />
                    </g>

                    <style>
                        {`
                        .animate-spin-slow {
                            animation: spin 0.8s linear infinite;
                            transform-origin: center;
                            transform-box: fill-box;
                        }
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        `}
                    </style>
                </svg>
            </div>
        </div>
    );
};

export default ScrollTrack;
