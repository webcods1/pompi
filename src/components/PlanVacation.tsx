
const steps = [
    {
        id: 1,
        title: 'Choose Destination',
        description: 'Select your dream location from our curated list of domestic and international spots.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
        )
    },
    {
        id: 2,
        title: 'Book Your Trip',
        description: 'Flexible payment options and instant confirmation for your peace of mind.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        )
    },
    {
        id: 3,
        title: 'Enjoy Your Vacation',
        description: 'Pack your bags and create memories that will last a lifetime.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
        )
    }
];

const PlanVacation = () => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 uppercase tracking-tight">
                        Full-fill your travel dreams with us
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Your journey to the perfect holiday starts here. We handle the details, you make the memories.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-blue-100 -z-10"></div>

                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-20">
                    <button
                        onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white p-4 rounded-full shadow-lg border border-gray-100 text-red-600 hover:text-red-700 hover:shadow-xl transition-all animate-bounce group"
                        aria-label="Scroll to destinations"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PlanVacation;
