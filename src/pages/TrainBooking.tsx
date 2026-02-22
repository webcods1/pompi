import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { ref, push } from 'firebase/database';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { sendBookingEmail } from '../utils/emailService';
import { sendBookingSMS } from '../utils/smsService';

const TrainBooking = () => {
    const { currentUser, openLoginModal } = useAuth();
    const [loading, setLoading] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'success'>('idle');
    const [formData, setFormData] = useState<any>({});

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            openLoginModal();
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                ...formData,
                type: 'train',
                userId: currentUser.uid,
                userEmail: currentUser.email,
                createdAt: new Date().toISOString(),
                status: 'Under Progress'
            };

            await push(ref(db, 'ticket_bookings'), bookingData);

            // Send email to admin
            await sendBookingEmail(bookingData);

            // Send SMS alert to admin
            await sendBookingSMS(bookingData);

            setBookingStatus('success');
            setFormData({}); // Reset form
        } catch (error) {
            console.error("Error booking:", error);
            alert("Failed to submit booking.");
        } finally {
            setLoading(false);
        }
    };

    const resetBooking = () => {
        setBookingStatus('idle');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />


            {/* Hero Section */}
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1600&auto=format&fit=crop"
                    alt="Train Journey"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/40 flex flex-col justify-center items-center text-white text-center p-6">
                    <h1 className="text-5xl font-display font-bold mb-4">Train Booking</h1>
                    <p className="text-xl max-w-2xl">Connect across the nation with fast and reliable railway networks.</p>
                </div>
            </div>

            {/* Booking Form Section */}
            <div className="container mx-auto px-4 -mt-24 relative z-10 mb-20">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 max-w-4xl mx-auto">
                    {/* Back to Bookings */}
                    <Link to="/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors mb-6 group">
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Bookings
                    </Link>

                    {bookingStatus === 'success' ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-5xl">🚆</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ticket Under Progress!</h2>
                            <div className="max-w-md mx-auto space-y-6">
                                <p className="text-lg text-gray-600">
                                    Thank you for your train booking request.
                                </p>
                                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                                    <p className="text-blue-800 font-medium text-lg mb-2">
                                        Our travel expert will connect with you shortly to confirm your details and complete the booking.
                                    </p>
                                    <p className="text-blue-600 text-sm font-bold flex items-center justify-center gap-2">
                                        <span>📧</span> A booking status has been sent to your mail ID
                                    </p>
                                </div>
                                <button
                                    onClick={resetBooking}
                                    className="inline-block bg-gray-900 text-white font-bold py-4 px-10 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Book Another Ticket
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                                <span className="bg-blue-100 text-blue-600 p-3 rounded-xl">🚆</span>
                                Book Train Tickets
                            </h2>

                            <form className="space-y-6" onSubmit={handleBooking}>
                                {/* Name, Phone & Email */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
                                            <input
                                                required
                                                name="name"
                                                value={formData.name || ''}
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="Your full name"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">📞</span>
                                            <input
                                                required
                                                name="phone"
                                                value={formData.phone || ''}
                                                onChange={handleInputChange}
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">✉️</span>
                                            <input
                                                required
                                                name="email"
                                                value={formData.email || ''}
                                                onChange={handleInputChange}
                                                type="email"
                                                placeholder="you@email.com"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">From Station</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">🚉</span>
                                            <input
                                                required
                                                name="from"
                                                value={formData.from || ''}
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="Origin..."
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">To Station</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">🏁</span>
                                            <input
                                                required
                                                name="to"
                                                value={formData.to || ''}
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="Destination..."
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">📅</span>
                                            <input
                                                required
                                                name="date"
                                                value={formData.date || ''}
                                                onChange={handleInputChange}
                                                type="date"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                        <select
                                            name="class"
                                            value={formData.class || 'All Classes'}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                        >
                                            <option>All Classes</option>
                                            <option>Sleeper (SL)</option>
                                            <option>AC 3 Tier (3A)</option>
                                            <option>AC 2 Tier (2A)</option>
                                            <option>First Class (1A)</option>
                                            <option>Chair Car (CC)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quota</label>
                                        <select
                                            name="quota"
                                            value={formData.quota || 'General'}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                        >
                                            <option>General</option>
                                            <option>Tatkal</option>
                                            <option>Ladies</option>
                                            <option>Senior Citizen</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-lg disabled:opacity-70 disabled:cursor-not-allowed">
                                        {loading ? 'Submitting...' : 'Submit Booking Request'}
                                    </button>
                                </div>
                            </form>

                            {/* Features */}
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-8">
                                <div className="text-center">
                                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚡</div>
                                    <h4 className="font-bold text-gray-800">Fast Booking</h4>
                                    <p className="text-sm text-gray-500 mt-2">IRCTC Authorized Partner</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🍲</div>
                                    <h4 className="font-bold text-gray-800">E-Catering</h4>
                                    <p className="text-sm text-gray-500 mt-2">Order food on trip</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔄</div>
                                    <h4 className="font-bold text-gray-800">Easy Refund</h4>
                                    <p className="text-sm text-gray-500 mt-2">Instant cancellation refunds</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TrainBooking;
