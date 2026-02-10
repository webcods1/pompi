import { useState, useEffect } from 'react';
import TravelRoute from './TravelRoute';

const slides = [
    {
        image: '/kashmir.jpg',
        title: 'Kashmir: The Paradise on Earth',
        quote: '"If there is heaven on earth, it\'s here, it\'s here, it\'s here."',
        destinations: [
            { name: 'Srinagar', id: 1 },
            { name: 'Sonmarg', id: 2 },
            { name: 'Gulmarg', id: 3 },
            { name: 'Pahalgam', id: 4 }
        ]
    },
    {
        image: '/taj.jpg',
        title: 'Taj Mahal: The Epitome of Love',
        quote: '"A teardrop on the cheek of time, an eternal monument to love."',
        destinations: [
            { name: 'Red Fort', id: 1 },
            { name: 'India Gate', id: 2 },
            { name: 'Lotus Temple', id: 3 },
            { name: 'Qutub Minar', id: 4 }
        ]
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 8000); // Increased time to allow animation to complete
        return () => clearInterval(timer);
    }, []);

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
            <TravelRoute key={currentSlide} destinations={slides[currentSlide].destinations} />

            {/* Content Area */}
            <div className="relative z-10 px-4 max-w-4xl mx-auto">
                <div key={currentSlide} className="animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 drop-shadow-lg">
                        {slides[currentSlide].title}
                    </h1>
                    <p className="text-xl md:text-3xl font-display italic mb-8 text-gray-200 drop-shadow-md lg:px-20">
                        {slides[currentSlide].quote}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 shadow-lg">
                        Start Planning
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold py-4 px-8 rounded-full transition-all border border-white/50">
                        View Destinations
                    </button>
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
                                className="absolute top-0 left-0 h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                                style={{
                                    animation: 'progress-fill 8000ms linear forwards'
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
