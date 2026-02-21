import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { sendBookingEmail } from '../utils/emailService';

const vehicleConfig: Record<string, any> = {
    car: {
        title: 'Car Rental',
        emoji: '🚗',
        subtitle: 'Self-drive & chauffeur cars for your comfort',
        accent: 'from-orange-500 to-amber-500',
        btn: 'bg-orange-500 hover:bg-orange-600',
        ring: 'focus:ring-orange-400',
        img: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=1200&auto=format&fit=crop',
        options: ['Hatchback', 'Sedan', 'SUV', 'Luxury'],
        capacities: ['4 Seater', '5 Seater', '7 Seater'],
    },
    tempo: {
        title: 'Tempo Traveller',
        emoji: '🚐',
        subtitle: 'Spacious vans for group travel',
        accent: 'from-violet-500 to-purple-600',
        btn: 'bg-violet-600 hover:bg-violet-700',
        ring: 'focus:ring-violet-400',
        img: '/urbania.webp',
        options: ['9 Seater', '12 Seater', '14 Seater', '17 Seater'],
        capacities: [],
    },
    bus: {
        title: 'Bus Booking',
        emoji: '🚌',
        subtitle: 'Luxury & standard buses for large groups',
        accent: 'from-emerald-500 to-teal-600',
        btn: 'bg-emerald-600 hover:bg-emerald-700',
        ring: 'focus:ring-emerald-400',
        img: '/pompiai.png',
        options: ['20 Seat', '34 Seat', '49 Seat'],
        showAcOption: true,
    },
    minibus: {
        title: 'Mini Bus',
        emoji: '🚎',
        subtitle: 'Compact buses for mid-size groups',
        accent: 'from-pink-500 to-rose-600',
        btn: 'bg-pink-600 hover:bg-pink-700',
        ring: 'focus:ring-pink-400',
        img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
        options: ['15 Seater', '20 Seater', '25 Seater'],
        capacities: [],
    },
};

const VehicleBooking = () => {
    const { type = 'car' } = useParams<{ type: string }>();
    const config = vehicleConfig[type] || vehicleConfig.car;
    const { currentUser } = useAuth();

    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        pickup: '',
        drop: '',
        date: '',
        returnDate: '',
        vehicleOption: config.options[0] || '',
        passengers: '',
        acType: 'AC',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const bookingData = {
                ...form,
                vehicleType: type,
                vehicleTitle: config.title,
                userId: currentUser?.uid || null,
                userEmail: currentUser?.email || null,
                status: 'Under Review',
                createdAt: serverTimestamp(),
            };
            await push(ref(db, 'vehicle_bookings'), bookingData);

            // Send email to admin
            await sendBookingEmail({ ...bookingData, type: 'vehicle' });

            setSubmitted(true);
        } catch (err) {
            alert('Failed to submit booking. Please try again.');
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <div className={`relative bg-gradient-to-r ${config.accent} py-20 text-white overflow-hidden`}>
                <div className="absolute inset-0 bg-black/30"></div>
                <img src={config.img} alt={config.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" />
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <div className="text-6xl mb-4 drop-shadow-lg">{config.emoji}</div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 drop-shadow-md">{config.title}</h1>
                    <p className="text-lg text-white/80 max-w-xl mx-auto">{config.subtitle}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-white" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }}></div>
            </div>

            <div className="container mx-auto px-4 py-14 max-w-2xl">

                {/* Back link */}
                <Link to="/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors mb-8 group">
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Bookings
                </Link>

                {submitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Request Sent!</h2>
                        <p className="text-green-700 mb-6">We've received your {config.title} request. Our team will contact you shortly on <strong>{form.phone}</strong>.</p>
                        <Link to="/bookings" className={`inline-block px-8 py-3 ${config.btn} text-white font-bold rounded-xl transition-colors shadow-lg`}>
                            Back to Bookings
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className={`bg-gradient-to-r ${config.accent} p-6 text-white`}>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {config.emoji} Book Your {config.title}
                            </h2>
                            <p className="text-white/70 text-sm mt-1">Fill in the details below and we'll get back to you</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                            {/* Name, Phone & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                                    <input
                                        type="text" name="name" value={form.name} onChange={handleChange} required
                                        placeholder="Your full name"
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 ${config.ring} outline-none transition-all`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                                    <input
                                        type="tel" name="phone" value={form.phone} onChange={handleChange} required
                                        placeholder="+91 98765 43210"
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 ${config.ring} outline-none transition-all`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email ID *</label>
                                    <input
                                        type="email" name="email" value={form.email || ''} onChange={handleChange} required
                                        placeholder="you@email.com"
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 ${config.ring} outline-none transition-all`}
                                    />
                                </div>
                            </div>

                            {/* Pickup & Drop */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pickup Location *</label>
                                    <input
                                        type="text" name="pickup" value={form.pickup} onChange={handleChange} required
                                        placeholder="e.g. Perinthalmanna"
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 ${config.ring} outline-none transition-all`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Drop Location *</label>
                                    <input
                                        type="text" name="drop" value={form.drop} onChange={handleChange} required
                                        placeholder="e.g. Kochi Airport"
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 ${config.ring} outline-none transition-all`}
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pickup Date *</label>
                                    <input
                                        type="date" name="date" value={form.date} onChange={handleChange} required
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 ${config.ring} outline-none transition-all`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Return Date <span className="font-normal text-gray-400">(if round trip)</span></label>
                                    <input
                                        type="date" name="returnDate" value={form.returnDate} onChange={handleChange}
                                        min={form.date || new Date().toISOString().split('T')[0]}
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 ${config.ring} outline-none transition-all`}
                                    />
                                </div>
                            </div>

                            {/* Vehicle Seat Option & Passengers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Seat Capacity *</label>
                                    <select
                                        name="vehicleOption" value={form.vehicleOption} onChange={handleChange} required
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 ${config.ring} outline-none transition-all`}
                                    >
                                        {config.options.map((opt: string) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">No. of Passengers *</label>
                                    <input
                                        type="number" name="passengers" value={form.passengers} onChange={handleChange} required
                                        min="1" max="60" placeholder="e.g. 30"
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 ${config.ring} outline-none transition-all`}
                                    />
                                </div>
                            </div>

                            {/* AC / Non-AC — only for Bus */}
                            {config.showAcOption && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">AC Preference *</label>
                                    <div className="flex gap-4">
                                        {['AC', 'Non-AC'].map((opt) => (
                                            <label
                                                key={opt}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 cursor-pointer transition-all font-semibold text-sm
                                                    ${form.acType === opt
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="acType"
                                                    value={opt}
                                                    checked={form.acType === opt}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <span>{opt === 'AC' ? '❄️' : '🌬️'}</span>
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Additional Notes</label>
                                <textarea
                                    name="message" value={form.message} onChange={handleChange} rows={3}
                                    placeholder="Any special requirements, preferred AC/Non-AC, pick-up time, etc."
                                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 ${config.ring} outline-none transition-all resize-none`}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full ${config.btn} text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] text-base flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    <>{config.emoji} Submit Booking Request</>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400">
                                Our team will contact you within 2 hours to confirm availability & pricing.
                            </p>
                        </form>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default VehicleBooking;
