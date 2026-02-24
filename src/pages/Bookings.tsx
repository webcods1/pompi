import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';


const Bookings = () => {
    const { currentUser } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoadingBookings(false);
            return;
        }

        const bookingsRef = ref(db, 'ticket_bookings');
        const unsubscribe = onValue(bookingsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const userBookings = Object.entries(data)
                    .map(([key, value]: [string, any]) => ({ id: key, ...value }))
                    .filter((booking: any) => booking.userId === currentUser.uid || booking.userEmail === currentUser.email);
                userBookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setBookings(userBookings);
            } else {
                setBookings([]);
            }
            setLoadingBookings(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ticket Available': return 'bg-green-100 text-green-700 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const ticketTypes = [
        {
            to: '/bookings/bus',
            img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
            alt: 'Bus Travel',
            title: 'Bus',
            desc: 'Comfortable AC & sleeper buses for intercity travel.',
            btn: 'Book Bus',
            color: 'red',
            border: 'border-red-50',
            shadow: 'shadow-red-200',
            hover: 'group-hover:text-red-600',
            bg: 'bg-red-600 group-hover:bg-red-700',
        },
        {
            to: '/bookings/train',
            img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=800&auto=format&fit=crop',
            alt: 'Train Journey',
            title: 'Train',
            desc: 'Fast & secure railway reservations across India.',
            btn: 'Book Train',
            color: 'blue',
            border: 'border-blue-50',
            shadow: 'shadow-blue-200',
            hover: 'group-hover:text-blue-600',
            bg: 'bg-blue-600 group-hover:bg-blue-700',
        },
        {
            to: '/bookings/flight',
            img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop',
            alt: 'Flight Travel',
            title: 'Flight',
            desc: 'Domestic & International flights at best prices.',
            btn: 'Book Flight',
            color: 'sky',
            border: 'border-sky-50',
            shadow: 'shadow-sky-200',
            hover: 'group-hover:text-sky-600',
            bg: 'bg-sky-500 group-hover:bg-sky-600',
        },
    ];

    const vehicleTypes = [
        {
            to: '/bookings/vehicle/car',
            img: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=800&auto=format&fit=crop',
            alt: 'Taxi Service',
            title: 'Taxi Service',
            desc: 'Instant taxi booking for local and outstation travel.',
            btn: 'Book Now',
            hover: 'group-hover:text-orange-600',
            bgBtn: 'bg-orange-500 group-hover:bg-orange-600',
            shadow: 'shadow-orange-200',
        },
        {
            to: '/bookings/vehicle/tempo',
            img: '/urbania.webp',
            alt: 'Traveller Booking',
            title: 'Traveller Booking',
            desc: 'Spacious tempo travellers for group trips.',
            btn: 'Book Now',
            hover: 'group-hover:text-violet-600',
            bgBtn: 'bg-violet-600 group-hover:bg-violet-700',
            shadow: 'shadow-violet-200',
        },
        {
            to: '/bookings/vehicle/bus',
            img: '/pompiai.png',
            alt: 'Bus Booking',
            title: 'Bus Booking',
            desc: 'Luxury & standard buses for large groups.',
            btn: 'Book Now',
            hover: 'group-hover:text-emerald-600',
            bgBtn: 'bg-emerald-600 group-hover:bg-emerald-700',
            shadow: 'shadow-emerald-200',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-24 pb-32 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 container mx-auto px-6">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-md">
                        Start Your Journey Here
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Book flights, buses, trains, and vehicles — all in one place.
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="container mx-auto px-4 py-16">

                {/* ── TICKET BOOKINGS ─────────────────────────────────────── */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-900 text-white text-lg shadow-md">
                            🎫
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Ticket Bookings</h2>
                            <p className="text-gray-500 text-sm mt-0.5">Book bus, train & flight tickets instantly</p>
                        </div>
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-blue-900 via-purple-400 to-transparent mt-4 mb-8"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {ticketTypes.map((t) => (
                        <Link key={t.to} to={t.to} className="block group">
                            <div className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${t.border} border overflow-hidden h-full`}>
                                <div className="h-48 overflow-hidden relative">
                                    <img src={t.img} alt={t.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className={`text-2xl font-bold text-gray-800 mb-2 transition-colors ${t.hover}`}>{t.title}</h3>
                                    <p className="text-gray-500 mb-6 text-sm">{t.desc}</p>
                                    <div className={`w-full ${t.bg} text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg ${t.shadow} pointer-events-none text-center`}>
                                        {t.btn}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── VEHICLE BOOKINGS ─────────────────────────────────────── */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-700 text-white text-lg shadow-md">
                            🚕
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Vehicle Booking</h2>
                            <p className="text-gray-500 text-sm mt-0.5">Taxi services, tempo travellers & buses for any trip</p>
                        </div>
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-emerald-700 via-teal-400 to-transparent mt-4 mb-8"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
                    {vehicleTypes.map((v) => (
                        <Link key={v.to} to={v.to} className="block group">
                            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full flex flex-col border border-gray-100">
                                {/* Clean image — no emoji, no overlay tint */}
                                <div className="h-52 overflow-hidden relative">
                                    <img
                                        src={v.img}
                                        alt={v.alt}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Subtle dark bottom gradient for readability only */}
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                                <div className="p-5 flex flex-col flex-1 text-center">
                                    <h3 className={`text-xl font-bold text-gray-800 mb-2 transition-colors ${v.hover}`}>{v.title}</h3>
                                    <p className="text-gray-500 text-sm mb-5 flex-1">{v.desc}</p>
                                    <div className={`w-full ${v.bgBtn} text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md ${v.shadow} pointer-events-none text-center text-sm`}>
                                        {v.btn}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── BOOKING HISTORY ───────────────────────────────────────── */}
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 text-white text-lg shadow-md">
                            📋
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Your Recent Bookings</h2>
                            <p className="text-gray-500 text-sm mt-0.5">Track the status of your ticket bookings</p>
                        </div>
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-gray-800 via-gray-400 to-transparent mt-4 mb-8"></div>

                    {!currentUser ? (
                        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-dashed border-gray-300">
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-lg font-bold text-gray-600">Please Log In</h3>
                            <p className="text-gray-500 mb-6">Log in to view your booking history.</p>
                            <Link to="/login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Log In</Link>
                        </div>
                    ) : loadingBookings ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading your tickets...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-dashed border-gray-300">
                            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-600">No upcoming trips</h3>
                            <p className="text-gray-500 mb-6">Looks like you haven't booked anything yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                                    {booking.status || 'Under Progress'}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono">
                                                    ID: {booking.id.slice(-8)}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
                                                <span className="capitalize">{booking.type}</span> to {booking.to}
                                            </h3>
                                            <p className="text-gray-500 text-sm">From {booking.from}</p>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-1">
                                            <p className="text-gray-400 text-xs uppercase font-bold">Travel Date</p>
                                            <p className="font-semibold text-gray-800 text-lg">{booking.date}</p>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-1 min-w-[150px]">
                                            <p className="text-gray-400 text-xs uppercase font-bold">Booked On</p>
                                            <p className="font-medium text-gray-600 text-sm">{new Date(booking.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                        {booking.status === 'Ticket Available' && (
                                            <div className="text-sm text-green-700 flex items-center gap-2">
                                                <span>✅</span>
                                                <span className="font-medium">Confirmed! Check your email for ticket details.</span>
                                            </div>
                                        )}
                                        {booking.status === 'Cancelled' && (
                                            <div className="text-sm text-red-700 flex items-center gap-2">
                                                <span>❌</span>
                                                <span className="font-medium">Booking cancelled. Contact support for refunds.</span>
                                            </div>
                                        )}
                                        {(!booking.status || booking.status === 'Under Progress') && (
                                            <div className="text-sm text-yellow-700 flex items-center gap-2">
                                                <span>⏳</span>
                                                <span className="font-medium">Processing request...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            <Footer />
        </div >
    );
};

export default Bookings;
