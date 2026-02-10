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
        <div className="absolute left-8 md:left-24 top-[60%] -translate-y-1/2 z-30 flex flex-col items-start gap-8 py-4">
            {/* Vertical Background Line */}
            <div className="absolute left-[5px] top-6 bottom-6 w-[1px] bg-white/20 rounded-full">
                {/* Animated Progress Line */}
                <div
                    className="absolute top-0 left-0 w-full bg-red-600 transition-all duration-700 ease-in-out origin-top rounded-full shadow-[0_0_10px_rgba(220,38,38,0.6)]"
                    style={{ height: `${lineWidth}%` }}
                />
            </div>

            {destinations.map((dest, index) => (
                <div key={`${dest.id}-${dest.name}`} className="flex items-center gap-6 relative group">
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
                        className={`text-white text-lg md:text-xl font-display tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out
              ${visibleItems > index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}
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
