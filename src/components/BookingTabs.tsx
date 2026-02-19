import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

const BookingTabs = () => {
    const [activeTab, setActiveTab] = useState('bus');
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 'bus', label: 'Bus', icon: '🚌' },
        { id: 'train', label: 'Train', icon: '🚆' },
        { id: 'flight', label: 'Flight', icon: '✈️' },
        // { id: 'holidays', label: 'Holidays', icon: '🏖️' }, // Keeping simple for now as per request
        // { id: 'cabs', label: 'Cabs', icon: '🚖' },
        // { id: 'hotels', label: 'Hotels', icon: '🏨' },
        // { id: 'homestays', label: 'Homestays', icon: '🏡' }
    ];

    const [bookingStatus, setBookingStatus] = useState<'idle' | 'success'>('idle');

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBooking = async (e: any, type: string) => {
        e.preventDefault();
        setLoading(true);
        try {
            await push(ref(db, 'ticket_bookings'), {
                ...formData,
                type,
                createdAt: new Date().toISOString(),
                status: 'Under Progress' // Set initial status as requested 'under progress'
            });
            setBookingStatus('success');
            setFormData({}); // Reset form data but keep success view
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

    const renderForm = () => {
        switch (activeTab) {
            case 'bus':
                return (
                    <form onSubmit={(e) => handleBooking(e, 'bus')} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                <input required name="from" onChange={handleInputChange} value={formData.from || ''} type="text" placeholder="Departure City" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <input required name="to" onChange={handleInputChange} value={formData.to || ''} type="text" placeholder="Destination City" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input required name="date" onChange={handleInputChange} value={formData.date || ''} type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
                            </div>
                            <div className="flex items-end">
                                <button disabled={loading} type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50">
                                    {loading ? 'Booking...' : 'Book Now'}
                                </button>
                            </div>
                        </div>
                    </form>
                );
            case 'train':
                return (
                    <form onSubmit={(e) => handleBooking(e, 'train')} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From Station</label>
                                <input required name="from" onChange={handleInputChange} value={formData.from || ''} type="text" placeholder="Source Station" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To Station</label>
                                <input required name="to" onChange={handleInputChange} value={formData.to || ''} type="text" placeholder="Destination Station" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                                <input required name="date" onChange={handleInputChange} value={formData.date || ''} type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                            <div className="flex items-end">
                                <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50">
                                    {loading ? 'Booking...' : 'Book Now'}
                                </button>
                            </div>
                        </div>
                    </form>
                );
            case 'flight':
                return (
                    <form onSubmit={(e) => handleBooking(e, 'flight')} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                <input required name="from" onChange={handleInputChange} value={formData.from || ''} type="text" placeholder="Source Airport" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <input required name="to" onChange={handleInputChange} value={formData.to || ''} type="text" placeholder="Destination Airport" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                                <input required name="date" onChange={handleInputChange} value={formData.date || ''} type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                                <input name="returnDate" onChange={handleInputChange} value={formData.returnDate || ''} type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
                            </div>
                            <div className="flex items-end">
                                <button disabled={loading} type="submit" className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors shadow-lg disabled:opacity-50">
                                    {loading ? 'Booking...' : 'Book Now'}
                                </button>
                            </div>
                        </div>
                    </form>
                );
            default:
                return (
                    <div className="text-center py-8 text-gray-500">
                        <p>Booking form for {tabs.find(t => t.id === activeTab)?.label} coming soon!</p>
                    </div>
                );
        }
    };


    if (bookingStatus === 'success') {
        return (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-6xl mx-auto -mt-24 relative z-20 p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🎫</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ticket Under Progress!</h2>
                <div className="max-w-md mx-auto space-y-4">
                    <p className="text-lg text-gray-600">
                        Thank you for your booking request using Pompi Travels.
                    </p>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                        <p className="text-blue-800 font-medium">
                            Our travel expert will connect with you shortly to confirm your details and complete the booking.
                        </p>
                    </div>
                </div>
                <button
                    onClick={resetBooking}
                    className="mt-8 bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-black transition-colors shadow-lg"
                >
                    Book Another Ticket
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-6xl mx-auto -mt-24 relative z-20">
            {/* Tabs Header */}
            <div className="flex overflow-x-auto bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center justify-center min-w-[100px] py-4 px-6 transition-all duration-300 text-sm font-semibold border-b-4 ${activeTab === tab.id
                            ? 'border-red-600 text-red-600 bg-white shadow-sm'
                            : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                    >
                        <span className="text-2xl mb-1 filter drop-shadow-sm">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <div className="p-8 bg-white min-h-[200px]">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    Book your {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                {renderForm()}

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Verified Partners
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Secure Payments
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        24/7 Support
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingTabs;
