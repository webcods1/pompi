import { useEffect, useState } from 'react';

interface Destination {
    name: string;
    id: number;
}

interface TravelRouteProps {
    destinations: Destination[];
}

const TravelRoute = ({ destinations }: TravelRouteProps) => {
    const [visibleItems, setVisibleItems] = useState<number>(0);
    const [lineWidth, setLineWidth] = useState<number>(0);

    useEffect(() => {
        // Reset state when destinations change
        setVisibleItems(0);
        setLineWidth(0);

        // Reveal dots and names one by one
        const timer = setInterval(() => {
            setVisibleItems((prev) => {
                if (prev < destinations.length + 1) return prev + 1;
                clearInterval(timer);
                return prev;
            });
        }, 800);

        return () => clearInterval(timer);
    }, [destinations]);

    useEffect(() => {
        // Animate the line drawing
        if (visibleItems >= 1) {
            const lineTimer = setTimeout(() => {
                const progress = Math.min(((visibleItems - 1) / (destinations.length - 1)) * 100, 100);
                setLineWidth(progress);
            }, 200);
            return () => clearTimeout(lineTimer);
        }
    }, [visibleItems, destinations]);

    const isReached = (index: number) => {
        if (index === 0) return visibleItems >= 1;
        return visibleItems > index + 1;
    };

    return (

        <div className="absolute z-30 flex md:flex-col flex-row items-center md:items-start justify-between md:justify-start gap-4 md:gap-8 py-4 px-4 w-full md:w-auto left-0 md:left-24 bottom-28 md:bottom-auto md:top-[60%] md:-translate-y-1/2">

            {/* Desktop Vertical Line */}
            <div className="absolute left-[5px] top-6 bottom-6 w-[1px] bg-white/20 rounded-full hidden md:block">
                <div
                    className="absolute top-0 left-0 w-full bg-red-600 transition-all duration-700 ease-in-out origin-top rounded-full shadow-[0_0_10px_rgba(220,38,38,0.6)]"
                    style={{ height: `${lineWidth}%` }}
                />
            </div>

            {/* Mobile Horizontal Line */}
            <div className="absolute left-8 right-8 top-[22px] h-[1px] bg-white/20 rounded-full md:hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-700 ease-in-out origin-left rounded-full shadow-[0_0_10px_rgba(220,38,38,0.6)]"
                    style={{ width: `${lineWidth}%` }}
                />
            </div>

            {destinations.map((dest, index) => (
                <div key={`${dest.id}-${dest.name}`} className="flex flex-col md:flex-row items-center gap-2 md:gap-6 relative group flex-1 md:flex-none justify-center">
                    <div className="relative flex items-center justify-center">
                        {/* Dot */}
                        <div
                            className={`w-[12px] h-[12px] rounded-full transition-all duration-500 ease-out z-10
                ${visibleItems > index ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                ${isReached(index) ? 'bg-red-600' : 'bg-white'}
                ${visibleItems === index + 1 ? 'ring-2 ring-white/30 scale-125 shadow-[0_0_15px_rgba(255,255,255,0.7)]' : ''}
                ${isReached(index) && visibleItems === index + 1 ? 'ring-2 ring-red-400/50 shadow-[0_0_15px_rgba(220,38,38,0.8)]' : ''}
              `}
                        />

                        {/* Glow effect for active dot */}
                        {visibleItems === index + 1 && (
                            <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${isReached(index) ? 'bg-red-500' : 'bg-white'}`} />
                        )}
                    </div>

                    <span
                        className={`text-white text-[10px] md:text-xl font-display tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out whitespace-nowrap
              ${visibleItems > index ? 'opacity-100 translate-x-0 md:translate-x-0 translate-y-0' : 'opacity-0 md:translate-x-6 translate-y-2'}
            `}
                        style={{ transitionDelay: '200ms' }}
                    >
                        {dest.name}
                    </span>
                </div>
            ))}
        </div>
    );

};

export default TravelRoute;
