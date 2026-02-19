import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
    const { currentUser, userData, loading: authLoading, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        location: ''
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                mobile: userData.mobile || userData.phone || '',
                location: userData.location || ''
            });
        }
    }, [userData]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-28 pb-16 px-4">
                <div className="container mx-auto max-w-2xl">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center relative">
                            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-blue-200 shadow-lg">
                                {formData.name ? formData.name.charAt(0).toUpperCase() : '👤'}
                            </div>
                            <h1 className="text-3xl font-display font-bold text-white">My Profile</h1>
                            <p className="text-blue-100 mb-4">Your personal travel details</p>
                        </div>

                        {/* Details Section */}
                        <div className="p-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 font-medium">
                                        {formData.name || 'Not provided'}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Mobile Number</label>
                                    <div className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 font-medium">
                                        {formData.mobile || 'Not provided'}
                                    </div>
                                </div>

                                {formData.location && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Location</label>
                                        <div className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 font-medium">
                                            {formData.location}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Logout Action */}
                            <div className="pt-8 mt-8 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="w-full py-3.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
