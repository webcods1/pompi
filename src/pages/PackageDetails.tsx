import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { push, ref, serverTimestamp, get, child } from 'firebase/database';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { sendBookingEmail } from '../utils/emailService';
import { sendBookingSMS } from '../utils/smsService';

// This data should ideally come from a centralized data source or API

const PackageDetails = () => {
    const { id } = useParams();
    const { currentUser, userData, openLoginModal } = useAuth();
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success'>('idle');
    const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'inclusions'>('overview');
    const [travelDate, setTravelDate] = useState('');
    const [guests, setGuests] = useState('1 Adult');

    const [pkg, setPkg] = useState<any>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPackageAndRelated = async () => {
            setLoading(true);
            try {
                // Determine if ID is likely a static ID (numeric) or Firebase ID (string)
                const isStaticId = !isNaN(Number(id));
                let currentPkg = null;

                // 1. Try to find in static list first if it looks like a number
                if (isStaticId) {
                }

                // 2. If not found in static list (or if ID matches but we want to be sure), check Firebase
                if (!currentPkg) {
                    // Start checking Firebase
                    // Direct fetch by ID
                    const snapshot = await get(child(ref(db), `packages/${id}`));
                    if (snapshot.exists()) {
                        currentPkg = { id: snapshot.key, ...snapshot.val() };
                    } else {
                        // Fallback: Check if it's one of the "offer_trips" manually if structure differs
                        // Sometimes offers are stored differently or we need to search through all packages
                        // But for now, direct ID fetch is the standard way.
                    }
                }

                if (currentPkg) {
                    setPkg(currentPkg);

                    // Fetch all packages for related suggestions if it's a Nefertiti package
                    if ((currentPkg as any).category === 'nefertity') {
                        const packagesRef = ref(db, 'packages');
                        const snapshot = await get(packagesRef);
                        if (snapshot.exists()) {
                            // Logic to fetch related packages was here but unused in render
                        }
                    }
                } else {
                    console.log("Package not found for ID:", id);
                    setPkg(null);
                }
            } catch (error) {
                console.error("Error fetching package:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPackageAndRelated();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const handleBook = () => {
        if (!currentUser) {
            openLoginModal();
            return;
        }

        if (!travelDate) {
            alert("Please select a travel date");
            return;
        }

        setBookingStatus('booking');

        const bookingRef = ref(db, 'tour_bookings');
        const newBooking = {
            packageId: pkg?.id,
            packageTitle: pkg?.title,
            packageImage: pkg?.image,
            userId: currentUser.uid,
            userName: userData?.name || 'User',
            userEmail: currentUser.email,
            userMobile: userData?.mobile || 'N/A',
            travelDate,
            guests,
            price: pkg?.price,
            status: 'Pending',
            createdAt: serverTimestamp()
        };

        push(bookingRef, newBooking)
            .then(async () => {
                // Send email to admin
                try {
                    await sendBookingEmail({ ...newBooking, type: 'tour' });
                    await sendBookingSMS({ ...newBooking, type: 'tour' });
                } catch (err) {
                    console.error("Notifications failed:", err);
                }
                setBookingStatus('success');
                setTimeout(() => setBookingStatus('idle'), 3000);
            })
            .catch((error) => {
                console.error("Error booking tour:", error);
                setBookingStatus('idle');
                alert("Failed to book tour. Please try again.");
            });
    };

    if (!pkg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Package Not Found</h2>
                    <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <ScrollToTop />


            {/* Hero Section */}
            <div className="relative h-[55vh] md:h-[70vh] w-full">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 text-white container mx-auto">
                    <div className="max-w-4xl">
                        <div className="flex flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
                            <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider">
                                {pkg.tag}
                            </span>
                            <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] md:text-xs font-bold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {pkg.location}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-6xl lg:text-7xl font-display font-bold mb-4 md:mb-6 leading-tight text-shadow-lg">{pkg.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 md:gap-8 text-xs md:text-lg font-medium opacity-90">
                            <div className="flex items-center gap-2 md:gap-3">
                                <span className="bg-white/20 p-1.5 md:p-2 rounded-full">
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </span>
                                {pkg.duration}
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <span className="bg-white/20 p-1.5 md:p-2 rounded-full">
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                </span>
                                {pkg.rating} / 5.0 Rating
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl -mt-10 md:-mt-20 relative z-10 pb-24 md:pb-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area */}
                    <div className="lg:w-2/3 space-y-6 md:space-y-8">

                        {/* Tab Navigation */}
                        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-1.5 md:p-2 flex overflow-x-auto no-scrollbar gap-1">
                            {['overview', 'itinerary', 'inclusions'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`flex-1 py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${activeTab === tab
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content Sections */}
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 min-h-[300px] md:min-h-[400px]">
                            {activeTab === 'overview' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Experience the Journey</h2>
                                    <p className="text-gray-600 leading-7 md:leading-8 text-base md:text-lg">{pkg.description}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4 md:pt-6">
                                        <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl">
                                            <div className="text-2xl mb-2">🏨</div>
                                            <p className="font-bold text-gray-800 text-xs md:text-sm">Luxury Stay</p>
                                        </div>
                                        <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl">
                                            <div className="text-2xl mb-2">🍽️</div>
                                            <p className="font-bold text-gray-800 text-xs md:text-sm">Meals Included</p>
                                        </div>
                                        <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl">
                                            <div className="text-2xl mb-2">🚙</div>
                                            <p className="font-bold text-gray-800 text-xs md:text-sm">Transfers</p>
                                        </div>
                                        <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl">
                                            <div className="text-2xl mb-2">🎟️</div>
                                            <p className="font-bold text-gray-800 text-xs md:text-sm">Sightseeing</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'itinerary' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6 md:mb-8">Day-wise Itinerary</h2>
                                    {pkg.itinerary && pkg.itinerary.length > 0 ? (
                                        <div className="relative border-l-2 border-blue-100 ml-2 md:ml-3 space-y-8 md:space-y-12">
                                            {pkg.itinerary.map((item: any, index: number) => (
                                                <div key={index} className="relative pl-6 md:pl-12 group">
                                                    <span className="absolute -left-[7px] md:-left-[9px] top-0 h-3 w-3 md:h-4 md:w-4 rounded-full bg-blue-600 ring-2 md:ring-4 ring-white group-hover:scale-125 transition-transform duration-300"></span>
                                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                                                        <span className="text-xs md:text-sm font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2 md:px-3 py-1 rounded-full w-fit">Day {item.day}</span>
                                                        <h3 className="text-lg md:text-xl font-bold text-gray-900">{item.title}</h3>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed text-sm md:text-lg bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">Itinerary details coming soon.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'inclusions' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6 md:mb-8">What's Included</h2>
                                    {pkg.inclusions && pkg.inclusions.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                            {pkg.inclusions.map((inc: any, index: number) => (
                                                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-green-50 border border-green-100 hover:shadow-sm transition-shadow">
                                                    <div className="bg-green-100 p-2 rounded-full text-green-600 flex-shrink-0">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                    <p className="text-gray-700 font-medium text-sm md:text-base">{inc}</p>
                                                </div>
                                            ))}

                                            {/* Static Exclusions for completeness */}
                                            <div className="md:col-span-2 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                                                <h3 className="text-lg font-bold text-gray-800 mb-4">Exclusions</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70">
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                        <span className="text-red-400">✖</span> Airfare / Train fare
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                        <span className="text-red-400">✖</span> Personal expenses
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">Inclusion details coming soon.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Booking Card - Desktop/Tablet */}
                    <div className="hidden lg:block lg:w-1/3">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                    <p className="text-blue-100 text-sm font-medium mb-1 relative z-10">Starting from</p>
                                    <div className="flex items-baseline gap-2 relative z-10">
                                        <h2 className="text-4xl font-bold">{pkg.price}</h2>
                                        <span className="text-sm opacity-80">/ person</span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3 relative z-10">
                                        <span className="line-through opacity-60 text-sm">{pkg.originalPrice}</span>
                                        <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded">
                                            {pkg.discount}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 block">Travel Date</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={travelDate}
                                                    onChange={(e) => setTravelDate(e.target.value)}
                                                    className="w-full pl-4 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-700"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 block">Travelers</label>
                                            <div className="relative">
                                                <select
                                                    value={guests}
                                                    onChange={(e) => setGuests(e.target.value)}
                                                    className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-700 appearance-none"
                                                >
                                                    <option>1 Adult</option>
                                                    <option>2 Adults</option>
                                                    <option>2 Adults, 1 Child</option>
                                                    <option>4 Adults</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            onClick={handleBook}
                                            disabled={bookingStatus === 'booking' || bookingStatus === 'success'}
                                            className={`w-full py-4 text-lg font-bold rounded-xl shadow-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${bookingStatus === 'success'
                                                ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
                                                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-red-200'
                                                }`}
                                        >
                                            {bookingStatus === 'booking' ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : bookingStatus === 'success' ? (
                                                <>
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    Request Sent!
                                                </>
                                            ) : (
                                                'Request Booking'
                                            )}
                                        </button>
                                        <p className="text-center text-xs text-gray-400 mt-4">
                                            {bookingStatus === 'success' ? (
                                                <span className="text-green-600 font-bold flex items-center justify-center gap-1">
                                                    📧 Booking status sent to your mail ID
                                                </span>
                                            ) : (
                                                "No payment required today. We'll contact you to confirm."
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 group hover:border-blue-200 transition-colors cursor-pointer">
                                <div className="bg-blue-50 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Expert Support</p>
                                    <p className="text-lg font-bold text-gray-900">9745008000, 9495968593</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50 flex items-center justify-between pb-4">
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Starting from</p>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-blue-600">{pkg.price}</span>
                        <span className="text-xs text-gray-400 line-through">{pkg.originalPrice}</span>
                    </div>
                </div>
                <button
                    onClick={() => {
                        // Scroll to the top or open a modal - for now let's just use the same handler but maybe scroll to form if we were to move it?
                        // Actually, for mobile let's simplisticly scroll to a ref or just open a simple native confirm/prompt?
                        // Better: reuse the handleBook logic but we need inputs.
                        // Let's scroll to the desktop sidebar which we will display as a block at the bottom for mobile instead of hidden?
                        // No, let's make the sidebar visible at the bottom for mobile inside the flow, and this button scrolls to it?
                        // Or better, just open a simple dialog.
                        const bookingSection = document.getElementById('mobile-booking-section');
                        if (bookingSection) {
                            bookingSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    className="bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-transform"
                >
                    Check Availability
                </button>
            </div>

            {/* Mobile Booking Section (Visible only on mobile/tablet at bottom) */}
            <div id="mobile-booking-section" className="lg:hidden container mx-auto px-4 pb-24">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gray-50 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900">Book This Tour</h3>
                        <p className="text-sm text-gray-500">Fill in your details to request a callback.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Travel Date</label>
                            <input
                                type="date"
                                value={travelDate}
                                onChange={(e) => setTravelDate(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Travelers</label>
                            <select
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option>1 Adult</option>
                                <option>2 Adults</option>
                                <option>2 Adults, 1 Child</option>
                                <option>4 Adults</option>
                            </select>
                        </div>
                        <button
                            onClick={handleBook}
                            disabled={bookingStatus === 'booking' || bookingStatus === 'success'}
                            className={`w-full py-4 text-lg font-bold rounded-xl shadow-lg transition-all ${bookingStatus === 'success' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
                                }`}
                        >
                            {bookingStatus === 'booking' ? 'Processing...' : bookingStatus === 'success' ? 'Request Sent!' : 'Send Request'}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PackageDetails;
