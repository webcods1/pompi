import { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AddTripForm from '../components/AddTripForm';

// Helper to format dates
const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const d = new Date(timestamp);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getTimestamp = (date: any) => {
    if (!date) return 0;
    const parsed = new Date(date).getTime();
    return isNaN(parsed) ? 0 : parsed;
};

const TicketBookingsView = ({ bookings, onUpdateStatus }: { bookings: any[], onUpdateStatus: (id: string, status: string) => void }) => {
    const [filter, setFilter] = useState('All');

    const filteredBookings = filter === 'All'
        ? bookings
        : bookings.filter(b => b.type === filter.toLowerCase());

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'bus': return '🚌';
            case 'train': return '🚆';
            case 'flight': return '✈️';
            default: return '🎫';
        }
    };

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex space-x-2 bg-white p-2 rounded-lg shadow-sm w-fit">
                {['All', 'Bus', 'Train', 'Flight'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === type
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Type</th>
                                <th className="px-4 py-3 font-semibold">Customer</th>
                                <th className="px-4 py-3 font-semibold">Route</th>
                                <th className="px-4 py-3 font-semibold">Dates</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Submitted</th>
                                <th className="px-4 py-3 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400 italic">
                                        No {filter === 'All' ? '' : filter} bookings found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 capitalize">
                                                {getTypeIcon(booking.type)} {booking.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-gray-800">{booking.name || '—'}</span>
                                                <span className="text-[10px] text-blue-500">{booking.phone || '—'}</span>
                                                <span className="text-[10px] text-gray-400">{booking.userEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                                                    <span>{booking.from}</span>
                                                    <span className="text-gray-400">→</span>
                                                    <span>{booking.to}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-medium text-gray-700">
                                                    {booking.date || 'N/A'}
                                                </div>
                                                {booking.returnDate && (
                                                    <div className="text-[10px] text-gray-500">
                                                        Return: {booking.returnDate}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${booking.status === 'Ticket Available' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {booking.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-[10px]">
                                            {formatDate(booking.createdAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                {booking.status !== 'Ticket Available' && (
                                                    <button
                                                        onClick={() => onUpdateStatus(booking.id, 'Ticket Available')}
                                                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-[10px] font-bold shadow-sm transition-colors"
                                                    >
                                                        Available
                                                    </button>
                                                )}
                                                {booking.status !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
                                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] font-bold shadow-sm transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

const TourBookingsView = ({ bookings, onUpdateStatus }: { bookings: any[], onUpdateStatus: (id: string, status: string) => void }) => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Package</th>
                            <th className="px-4 py-3 font-semibold">User</th>
                            <th className="px-4 py-3 font-semibold">Travel Date</th>
                            <th className="px-4 py-3 font-semibold">Guests</th>
                            <th className="px-4 py-3 font-semibold">Price</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Submitted</th>
                            <th className="px-4 py-3 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-400 italic">
                                    No tour bookings found.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <img src={booking.packageImage} alt="" className="w-8 h-8 rounded-md object-cover" />
                                            <span className="font-bold text-gray-800">{booking.packageTitle}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{booking.userName}</span>
                                            <span className="text-[10px] text-gray-500">{booking.userEmail}</span>
                                            <span className="text-[10px] text-blue-500">{booking.userMobile}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-700">
                                        {booking.travelDate}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                            {booking.guests}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-mono font-bold text-green-600">
                                        {booking.price}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 text-[10px]">
                                        {formatDate(booking.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {booking.status !== 'Confirmed' && (
                                                <button
                                                    onClick={() => onUpdateStatus(booking.id, 'Confirmed')}
                                                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-[10px] font-bold shadow-sm transition-colors"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {booking.status !== 'Cancelled' && (
                                                <button
                                                    onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
                                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] font-bold shadow-sm transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const VehicleBookingsView = ({ bookings, onUpdateStatus }: { bookings: any[], onUpdateStatus: (id: string, status: string) => void }) => {
    const getVehicleIcon = (type: string) => {
        switch (type) {
            case 'car': return '🚗';
            case 'tempo': return '🚐';
            case 'bus': return '🚌';
            case 'minibus': return '🚎';
            default: return '🚗';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Vehicle</th>
                            <th className="px-4 py-3 font-semibold">Customer</th>
                            <th className="px-4 py-3 font-semibold">Route</th>
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 font-semibold">Seats / AC</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Submitted</th>
                            <th className="px-4 py-3 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-400 italic">
                                    No vehicle bookings found.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-emerald-50/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 capitalize">
                                            {getVehicleIcon(booking.vehicleType)} {booking.vehicleTitle || booking.vehicleType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-gray-800">{booking.name}</span>
                                            <span className="text-[10px] text-blue-500">{booking.phone}</span>
                                            <span className="text-[10px] text-gray-400">{booking.userEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 font-bold text-gray-800">
                                            <span>{booking.pickup}</span>
                                            <span className="text-gray-400">→</span>
                                            <span>{booking.drop}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-gray-700">{booking.date || 'N/A'}</span>
                                            {booking.returnDate && (
                                                <span className="text-[10px] text-gray-400">Return: {booking.returnDate}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-gray-700">{booking.vehicleOption}</span>
                                            {booking.acType && (
                                                <span className={`text-[10px] font-bold ${booking.acType === 'AC' ? 'text-sky-600' : 'text-orange-500'
                                                    }`}>{booking.acType === 'AC' ? '❄️ AC' : '🌬️ Non-AC'}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status || 'Under Review'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 text-[10px]">
                                        {formatDate(booking.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {booking.status !== 'Confirmed' && (
                                                <button
                                                    onClick={() => onUpdateStatus(booking.id, 'Confirmed')}
                                                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-[10px] font-bold shadow-sm transition-colors"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {booking.status !== 'Cancelled' && (
                                                <button
                                                    onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
                                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] font-bold shadow-sm transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

import AdminBannerManagerNew from '../components/AdminBannerManagerNew';
import AdminDestinationManager from '../components/AdminDestinationManager';

const Admin = () => {
    const { currentUser, userData, loading: authLoading, isAdmin, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('inquiries');
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [vehicleBookings, setVehicleBookings] = useState<any[]>([]);
    const [tourBookings, setTourBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAdmin) return;
        setLoading(true);

        const inquiriesRef = ref(db, 'vacation_inquiries');
        const messagesRef = ref(db, 'contact_messages');
        const usersRef = ref(db, 'users');
        const bookingsRef = ref(db, 'ticket_bookings');
        const vehicleBookingsRef = ref(db, 'vehicle_bookings');
        const tourBookingsRef = ref(db, 'tour_bookings');

        // Listen for Inquiries
        const unsubInquiries = onValue(inquiriesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                list.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
                setInquiries(list);
            } else {
                setInquiries([]);
            }
        });

        // Listen for Messages
        const unsubMessages = onValue(messagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                list.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
                setMessages(list);
            } else {
                setMessages([]);
            }
        });

        // Listen for Users
        const unsubUsers = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    uid: key,
                    ...val
                }));
                list.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
                setUsers(list);
            } else {
                setUsers([]);
            }
        });

        // Listen for Ticket Bookings
        const unsubBookings = onValue(bookingsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                list.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
                setBookings(list);
            } else {
                setBookings([]);
            }
        });

        // Listen for Vehicle Bookings
        const unsubVehicleBookings = onValue(vehicleBookingsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                list.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
                setVehicleBookings(list);
            } else {
                setVehicleBookings([]);
            }
        });

        // Listen for Tour Bookings
        const unsubTourBookings = onValue(tourBookingsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                list.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
                setTourBookings(list);
            } else {
                setTourBookings([]);
            }
            setLoading(false);
        }, (err) => {
            console.error("Error fetching data:", err);
            setError(`Connection Error: ${err.message}`);
            setLoading(false);
        });


        return () => {
            unsubInquiries();
            unsubMessages();
            unsubUsers();
            unsubBookings();
            unsubVehicleBookings();
            unsubTourBookings();
        };
    }, [isAdmin]);

    const SidebarItem = ({ id, label, icon }: { id: string, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center w-full px-6 py-4 text-left transition-colors ${activeTab === id
                ? 'bg-blue-600 text-white border-r-4 border-blue-300'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
        >
            <span className="mr-3">{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );

    const updateStatus = (id: string, status: string, type: 'ticket' | 'tour' | 'vehicle' = 'ticket') => {
        if (window.confirm(`Are you sure you want to mark this booking as '${status}'?`)) {
            const path = type === 'tour' ? `tour_bookings/${id}` : type === 'vehicle' ? `vehicle_bookings/${id}` : `ticket_bookings/${id}`;
            update(ref(db, path), { status })
                .then(() => {
                    // Success (Data listener will update UI)
                })
                .catch((err) => {
                    console.error("Error updating status:", err);
                    alert("Failed to update status.");
                });
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!currentUser || !isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 flex flex-col shadow-2xl z-20">
                <div className="h-20 flex items-center justify-center border-b border-gray-800">
                    <h2 className="text-2xl font-display font-bold text-white tracking-wider">
                        POMPI<span className="text-blue-500">TRAVELS</span>
                    </h2>
                </div>

                <nav className="flex-1 py-8 overflow-y-auto">
                    <SidebarItem id="inquiries" label="Trip Inquiries" icon="✈️" />
                    <SidebarItem id="bookings" label="Bookings" icon="📋" />
                    <SidebarItem id="tour_bookings" label="Tour Bookings" icon="🌴" />
                    <SidebarItem id="add_trip" label="Add New Trip" icon="➕" />
                    <SidebarItem id="destinations" label="Destinations" icon="🗺️" />
                    <SidebarItem id="banners" label="Hero Banners" icon="🖼️" />
                    <SidebarItem id="messages" label="Contact Messages" icon="✉️" />
                    <SidebarItem id="users" label="Registered Users" icon="👥" />
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <span>🚪</span>
                        <span className="ml-3 font-medium">Logout Admin</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-800">
                            {activeTab === 'inquiries' && 'Vacation Inquiries'}
                            {activeTab === 'bookings' && 'Bookings'}
                            {activeTab === 'tour_bookings' && 'Tour Package Bookings'}
                            {activeTab === 'add_trip' && 'Add New Package'}
                            {activeTab === 'destinations' && 'Manage Destinations'}
                            {activeTab === 'banners' && 'Manage Hero Banners'}
                            {activeTab === 'messages' && 'Contact Messages'}
                            {activeTab === 'users' && 'Registered Users'}
                        </h1>
                        <span className="ml-4 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                            {activeTab === 'inquiries' && inquiries.length}
                            {activeTab === 'bookings' && (bookings.length + vehicleBookings.length)}
                            {activeTab === 'tour_bookings' && tourBookings.length}
                            {activeTab === 'messages' && messages.length}
                            {activeTab === 'users' && users.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800">{userData?.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-500">{userData?.email}</p>
                        </div>
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                    </div>
                </header >

                {/* Dashboard Body */}
                < div className="flex-1 overflow-auto p-8" >
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {
                        loading ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                                <p className="text-gray-500 animate-pulse">Fetching latest data...</p>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'inquiries' && (
                                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-4 py-3 font-semibold">User</th>
                                                        <th className="px-4 py-3 font-semibold">Contact</th>
                                                        <th className="px-4 py-3 font-semibold">Destination</th>
                                                        <th className="px-4 py-3 font-semibold">Travellers</th>
                                                        <th className="px-4 py-3 font-semibold">Budget</th>
                                                        <th className="px-4 py-3 font-semibold">Travel Dates</th>
                                                        <th className="px-4 py-3 font-semibold">Submitted</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 text-xs">
                                                    {inquiries.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-400 italic">No inquiries found.</td>
                                                        </tr>
                                                    ) : (
                                                        inquiries.map((inquiry) => (
                                                            <tr key={inquiry.id} className="hover:bg-blue-50/30 transition-colors">
                                                                <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
                                                                    {inquiry.fullName}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium text-blue-600">{inquiry.phone}</span>
                                                                        <span className="text-[10px] text-gray-400">{inquiry.email}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 font-medium text-gray-700">
                                                                    {inquiry.destination}
                                                                </td>
                                                                <td className="px-4 py-3 text-center">
                                                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                                                        {inquiry.travelers} Guests
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 font-mono font-medium text-green-600">
                                                                    ₹{inquiry.budget}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-[9px] uppercase text-gray-400 min-w-[60px]">Travel Date</span>
                                                                            <span className="font-medium text-gray-700">{inquiry.date || inquiry.startDate || 'N/A'}</span>
                                                                        </div>
                                                                        {inquiry.returnDate && (
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-[9px] uppercase text-gray-400 min-w-[60px]">Return</span>
                                                                                <span className="font-medium text-gray-700">{inquiry.returnDate}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-400 text-[10px]">
                                                                    {formatDate(inquiry.createdAt)}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'messages' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {messages.length === 0 ? (
                                            <div className="col-span-full bg-white p-12 text-center rounded-xl shadow border border-gray-100">
                                                <p className="text-gray-400">No contact messages yet.</p>
                                            </div>
                                        ) : (
                                            messages.map((msg) => (
                                                <div key={msg.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-1 px-1 bg-blue-500 h-0 group-hover:h-full transition-all duration-300"></div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-gray-800">{msg.name}</h3>
                                                            <p className="text-xs text-blue-600">{msg.email}</p>
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">{formatDate(msg.createdAt)}</span>
                                                    </div>
                                                    <div className="mb-4">
                                                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Subject</span>
                                                        <p className="text-sm font-semibold text-gray-700">{msg.subject}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                        <p className="text-sm text-gray-600 italic line-clamp-4">"{msg.message}"</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'users' && (
                                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-4 font-semibold">Name</th>
                                                        <th className="px-6 py-4 font-semibold">Mobile Number</th>
                                                        <th className="px-6 py-4 font-semibold">Created Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {users.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No users found in Realtime Database.</td>
                                                        </tr>
                                                    ) : (
                                                        users.map((user) => (
                                                            <tr key={user.uid} className="hover:bg-blue-50/30 transition-colors">
                                                                <td className="px-6 py-4 font-medium text-gray-800">{user.name || 'N/A'}</td>
                                                                <td className="px-6 py-4 text-blue-600 text-sm font-bold">{user.mobile || 'N/A'}</td>
                                                                <td className="px-6 py-4 text-gray-600 text-xs">{formatDate(user.createdAt)}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'bookings' && (
                                    <div className="space-y-10">
                                        {/* ── Ticket Bookings Section ── */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-900 text-white text-base shadow">
                                                    🎫
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-gray-900">Ticket Bookings</h2>
                                                    <p className="text-gray-400 text-xs">Bus, Train & Flight ticket requests</p>
                                                </div>
                                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{bookings.length}</span>
                                            </div>
                                            <div className="w-full h-px bg-gradient-to-r from-blue-900 via-blue-400 to-transparent mb-4"></div>
                                            <TicketBookingsView bookings={bookings} onUpdateStatus={(id, status) => updateStatus(id, status, 'ticket')} />
                                        </div>

                                        {/* ── Vehicle Bookings Section ── */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-700 text-white text-base shadow">
                                                    🚗
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-gray-900">Vehicle Bookings</h2>
                                                    <p className="text-gray-400 text-xs">Car, Tempo Traveller & Bus hire requests</p>
                                                </div>
                                                <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">{vehicleBookings.length}</span>
                                            </div>
                                            <div className="w-full h-px bg-gradient-to-r from-emerald-700 via-teal-400 to-transparent mb-4"></div>
                                            <VehicleBookingsView bookings={vehicleBookings} onUpdateStatus={(id, status) => updateStatus(id, status, 'vehicle')} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tour_bookings' && (
                                    <TourBookingsView bookings={tourBookings} onUpdateStatus={(id, status) => updateStatus(id, status, 'tour')} />
                                )}

                                {activeTab === 'add_trip' && <AddTripForm />}

                                {activeTab === 'destinations' && <AdminDestinationManager />}

                                {activeTab === 'banners' && <AdminBannerManagerNew />}
                            </>
                        )
                    }
                </div >
            </main >
        </div >
    );
};
export default Admin;
