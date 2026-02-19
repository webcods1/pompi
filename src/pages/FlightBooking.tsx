import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { db } from '../firebase';
import { ref, push } from 'firebase/database';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const FlightBooking = () => {
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
            await push(ref(db, 'ticket_bookings'), {
                ...formData,
                type: 'flight',
                userId: currentUser.uid,
                userEmail: currentUser.email,
                createdAt: new Date().toISOString(),
                status: 'Under Progress'
            });
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
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop"
                    alt="Flight Travel"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-sky-900/40 flex flex-col justify-center items-center text-white text-center p-6">
                    <h1 className="text-5xl font-display font-bold mb-4">Flight Booking</h1>
                    <p className="text-xl max-w-2xl">Fly to your dream destinations with our exclusive airline deals.</p>
                </div>
            </div>

            {/* Booking Form Section */}
            <div className="container mx-auto px-4 -mt-24 relative z-10 mb-20">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 max-w-4xl mx-auto">

                    {bookingStatus === 'success' ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-5xl">✈️</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ticket Under Progress!</h2>
                            <div className="max-w-md mx-auto space-y-6">
                                <p className="text-lg text-gray-600">
                                    Thank you for your flight booking request.
                                </p>
                                <div className="bg-sky-50 border border-sky-100 p-6 rounded-xl">
                                    <p className="text-sky-800 font-medium text-lg">
                                        Our travel expert will connect with you shortly to confirm your details and complete the booking.
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
                                <span className="bg-sky-100 text-sky-600 p-3 rounded-xl">✈️</span>
                                Book Flight Tickets
                            </h2>

                            <form className="space-y-6" onSubmit={handleBooking}>
                                {/* Trip Type */}
                                <div className="flex gap-6 mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="tripType" value="one-way" onChange={handleInputChange} defaultChecked className="w-4 h-4 text-sky-600 focus:ring-sky-500" />
                                        <span className="text-gray-700 font-medium">One Way</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="tripType" value="round-trip" onChange={handleInputChange} className="w-4 h-4 text-sky-600 focus:ring-sky-500" />
                                        <span className="text-gray-700 font-medium">Round Trip</span>
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">🛫</span>
                                            <input
                                                required
                                                name="from"
                                                value={formData.from || ''}
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="Origin Airport..."
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">🛬</span>
                                            <input
                                                required
                                                name="to"
                                                value={formData.to || ''}
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="Destination Airport..."
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">📅</span>
                                            <input
                                                required
                                                name="date"
                                                value={formData.date || ''}
                                                onChange={handleInputChange}
                                                type="date"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">📅</span>
                                            <input
                                                name="returnDate"
                                                value={formData.returnDate || ''}
                                                onChange={handleInputChange}
                                                type="date"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                                disabled={formData.tripType !== 'round-trip' && !formData.returnDate} // Enable if specifically needed or simplify
                                            />
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Travelers & Class</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
                                            <input
                                                name="travelers"
                                                value={formData.travelers || ''}
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="1 Travel, Economy"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all cursor-pointer bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-lg disabled:opacity-70 disabled:cursor-not-allowed">
                                        {loading ? 'Booking...' : 'Book Now'}
                                    </button>
                                </div>
                            </form>

                            {/* Features */}
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-8">
                                <div className="text-center">
                                    <div className="bg-sky-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💰</div>
                                    <h4 className="font-bold text-gray-800">Best Price Guarantee</h4>
                                    <p className="text-sm text-gray-500 mt-2">Find the cheapest flights</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-sky-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🌍</div>
                                    <h4 className="font-bold text-gray-800">Global Coverage</h4>
                                    <p className="text-sm text-gray-500 mt-2">Fly to over 100+ countries</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-sky-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🛡️</div>
                                    <h4 className="font-bold text-gray-800">Secure Booking</h4>
                                    <p className="text-sm text-gray-500 mt-2">Safe and encrypted transactions</p>
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

export default FlightBooking;
