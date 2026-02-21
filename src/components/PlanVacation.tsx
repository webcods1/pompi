import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { sendBookingEmail } from '../utils/emailService';

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

const destinations = [
    'Kashmir – Srinagar, Gulmarg, Pahalgam',
    'Manali – Solang Valley, Rohtang Pass',
    'Goa – Beaches, Nightlife, Heritage',
    'Kerala – Munnar, Alleppey, Thekkady',
    'Rajasthan – Jaipur, Udaipur, Jodhpur',
    'Leh Ladakh – Pangong, Nubra Valley',
    'Rishikesh – Adventure & Spiritual Tour',
    'Andaman & Nicobar Islands',
    'North East – Meghalaya, Assam, Sikkim',
    'South India – Ooty, Kodaikanal, Coorg',
];

const PlanVacation = () => {
    const { currentUser, openLoginModal } = useAuth();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        travelDate: '',
        returnDate: '',
        travelers: '2',
        budget: '',
        fullName: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            openLoginModal();
            return;
        }

        try {
            const inquiryData = {
                ...formData,
                startDate: formData.travelDate,
                createdAt: new Date().toISOString(),
                status: 'New'
            };
            await push(ref(db, "vacation_inquiries"), inquiryData);

            // Send email to admin
            await sendBookingEmail({ ...inquiryData, type: 'vacation_inquiry', name: formData.fullName });

            setIsSubmitted(true);
            setFormData({
                destination: '',
                travelDate: '',
                returnDate: '',
                travelers: '2',
                budget: '',
                fullName: '',
                phone: '',
                email: '',
                message: '',
            });
            setTimeout(() => setIsSubmitted(false), 4000);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to submit inquiry. Please try again.");
        }
    };

    return (
        <section className="py-8 md:py-14 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-lg md:text-3xl font-display font-bold text-gray-900 mb-2 md:mb-3 uppercase tracking-tight">
                        Full-fill your travel dreams with us
                    </h2>
                    <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto">
                        Your journey to the perfect holiday starts here. We handle the details, you make the memories.
                    </p>
                </div>

                {/* 3-Step Cards */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8 relative">
                    <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-blue-100 -z-10"></div>

                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center text-center group">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-600 text-white rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-4 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300 [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-8 md:[&>svg]:h-8">
                                {step.icon}
                            </div>
                            <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">{step.title}</h3>
                            <p className="text-gray-600 text-[10px] md:text-sm leading-relaxed max-w-xs hidden md:block">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ──────────────── Plan Your Trip Form ──────────────── */}
                <div className="mt-6 md:mt-12 relative">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/[0.02] rounded-full"></div>
                        {/* Grid Pattern */}
                        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="tripGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#tripGrid)" />
                        </svg>
                    </div>

                    <div className="relative z-10 px-3 md:px-8 py-4 md:py-6">
                        {/* Form Header */}
                        <div className="text-center mb-3 md:mb-4">
                            <div className="inline-flex items-center gap-1 md:gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2 md:px-3 py-0.5 md:py-1 mb-1 md:mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                                <span className="text-white/90 text-[9px] md:text-[10px] font-medium tracking-wide">Start Planning Today</span>
                            </div>
                            <h3 className="text-base md:text-2xl font-bold text-white mb-0.5 md:mb-1">
                                Plan Your Dream Trip
                            </h3>
                            <p className="text-blue-100 text-[10px] md:text-xs max-w-md mx-auto">
                                Fill in your details and our travel experts will craft the perfect itinerary.
                            </p>
                        </div>

                        {/* Success Message */}
                        {isSubmitted && (
                            <div className="mb-5 mx-auto max-w-2xl bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-3.5 flex items-center gap-3 animate-fade-in-up">
                                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Request Submitted Successfully!</p>
                                    <p className="text-emerald-100 text-xs">Our travel expert will call you within 24 hours.</p>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl p-3 md:p-5 shadow-2xl">
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                                    {/* Destination */}
                                    <div className="col-span-2 lg:col-span-3">
                                        <label className="block text-white/80 text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 tracking-wide">
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                </svg>
                                                Where do you want to go?
                                            </span>
                                        </label>
                                        <select
                                            name="destination"
                                            value={formData.destination}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/10 border border-white/20 text-white text-xs md:text-sm rounded-md md:rounded-lg py-1 md:py-2 px-2.5 md:px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all appearance-none cursor-pointer [&>option]:text-gray-900 [&>option]:bg-white"
                                        >
                                            <option value="">Select your dream destination...</option>
                                            {destinations.map((dest) => (
                                                <option key={dest} value={dest}>{dest}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Travel Date */}
                                    <div>
                                        <label className="block text-white/80 text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 tracking-wide">
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                </svg>
                                                Travel Date
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            name="travelDate"
                                            value={formData.travelDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/10 border border-white/20 text-white text-xs md:text-sm rounded-md md:rounded-lg py-1 md:py-2.5 px-2.5 md:px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all [color-scheme:dark]"
                                        />
                                    </div>

                                    {/* Return Date */}
                                    <div>
                                        <label className="block text-white/80 text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 tracking-wide">
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                                </svg>
                                                Return Date
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            name="returnDate"
                                            value={formData.returnDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/10 border border-white/20 text-white text-xs md:text-sm rounded-md md:rounded-lg py-1 md:py-2.5 px-2.5 md:px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all [color-scheme:dark]"
                                        />
                                    </div>

                                    {/* Travelers */}
                                    <div>
                                        <label className="block text-white/80 text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 tracking-wide">
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                </svg>
                                                No. of Travelers
                                            </span>
                                        </label>
                                        <select
                                            name="travelers"
                                            value={formData.travelers}
                                            onChange={handleChange}
                                            className="w-full bg-white/10 border border-white/20 text-white text-xs md:text-sm rounded-md md:rounded-lg py-1 md:py-2.5 px-2.5 md:px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all appearance-none cursor-pointer [&>option]:text-gray-900 [&>option]:bg-white"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                                <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                                            ))}
                                            <option value="10+">10+ (Group Tour)</option>
                                        </select>
                                    </div>

                                    {/* Budget */}
                                    <div>
                                        <label className="block text-white/80 text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 tracking-wide">
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                                </svg>
                                                Budget Per Person
                                            </span>
                                        </label>
                                        <select
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/10 border border-white/20 text-white text-xs md:text-sm rounded-md md:rounded-lg py-1 md:py-2.5 px-2.5 md:px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all appearance-none cursor-pointer [&>option]:text-gray-900 [&>option]:bg-white"
                                        >
                                            <option value="">Select budget range...</option>
                                            <option value="5000-10000">₹5,000 – ₹10,000</option>
                                            <option value="10000-20000">₹10,000 – ₹20,000</option>
                                            <option value="20000-35000">₹20,000 – ₹35,000</option>
                                            <option value="35000-50000">₹35,000 – ₹50,000</option>
                                            <option value="50000+">₹50,000+  (Premium)</option>
                                        </select>
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-white/80 text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 tracking-wide">
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                                Full Name
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                            className="w-full bg-white/10 border border-white/20 text-white text-xs md:text-sm placeholder:text-white/40 rounded-md md:rounded-lg py-1 md:py-2.5 px-2.5 md:px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-white/80 text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 tracking-wide">
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                </svg>
                                                Phone Number
                                            </span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+91 98765 43210"
                                            className="w-full bg-white/10 border border-white/20 text-white text-xs md:text-sm placeholder:text-white/40 rounded-md md:rounded-lg py-1 md:py-2.5 px-2.5 md:px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-white/80 text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 tracking-wide">
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                </svg>
                                                Email Address
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                            className="w-full bg-white/10 border border-white/20 text-white text-xs md:text-sm placeholder:text-white/40 rounded-md md:rounded-lg py-1 md:py-2.5 px-2.5 md:px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                                        />
                                    </div>

                                    {/* Special Requirements */}
                                    <div className="col-span-2 lg:col-span-3">
                                        <label className="block text-white/80 text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 tracking-wide">
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                                </svg>
                                                Special Requirements (Optional)
                                            </span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={1}
                                            placeholder="E.g., Honeymoon trip, wheelchair access..."
                                            className="w-full bg-white/10 border border-white/20 text-white text-xs md:text-sm placeholder:text-white/40 rounded-md md:rounded-lg py-1 md:py-2.5 px-2.5 md:px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="mt-3 md:mt-4 flex flex-col sm:flex-row items-center gap-2 md:gap-3">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 md:py-2.5 px-6 md:px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/30 text-[11px] md:text-xs tracking-wide flex items-center justify-center gap-2 group"
                                    >
                                        {/* Airplane Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                                        </svg>
                                        Submit Trip Request
                                        {/* Globe Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 opacity-60">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                        </svg>
                                    </button>
                                    <p className="text-white/50 text-[9px] md:text-xs text-center sm:text-left">
                                        Free consultation • No commitment • Expert advice within 24 hrs
                                    </p>
                                </div>
                            </div>
                        </form>

                        {/* Trust Badges */}
                        <div className="mt-3 md:mt-4 flex flex-wrap justify-center gap-2 md:gap-6">
                            {[
                                { icon: '🛡️', text: '100% Secure' },
                                { icon: '💰', text: 'Best Price Guarantee' },
                                { icon: '📞', text: '24/7 Support' },
                                { icon: '⭐', text: '10,000+ Happy Travelers' },
                            ].map((badge) => (
                                <div key={badge.text} className="flex items-center gap-1 md:gap-1.5 text-white/60 text-[9px] md:text-[10px]">
                                    <span className="text-sm">{badge.icon}</span>
                                    <span>{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll Down Button */}
                <div className="flex justify-center mt-8 md:mt-12">
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
