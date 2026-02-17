import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect, useRef } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
    const { currentUser, userData, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = useState(false);

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                location: userData.location || ''
            });
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setMessage({ type: 'success', text: 'You can now edit your profile details.' });
        setTimeout(() => {
            nameInputRef.current?.focus();
            setMessage({ type: '', text: '' });
        }, 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = {
                ...userData,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                updatedAt: new Date().toISOString()
            };

            await set(ref(db, 'users/' + currentUser.uid), payload);

            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 5000);

        } catch (error: any) {
            console.error("Error saving profile:", error);
            setMessage({
                type: 'error',
                text: 'An error occurred while saving profile.'
            });
        } finally {
            setLoading(false);
        }
    };

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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-28 pb-16 px-4">
                <div className="container mx-auto max-w-2xl">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center relative">
                            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-blue-200 relative group cursor-pointer shadow-lg">
                                {formData.name ? formData.name.charAt(0).toUpperCase() : '👤'}

                                {!isEditing && (
                                    <button
                                        onClick={handleEditClick}
                                        className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors z-10"
                                        title="Edit Profile"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <h1 className="text-3xl font-display font-bold text-white">My Profile</h1>
                            <p className="text-blue-100 mb-4">Manage your travel details</p>
                        </div>

                        <div className="p-8">
                            {message.text && (
                                <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                        <input
                                            ref={nameInputRef}
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${!isEditing
                                                ? 'bg-gray-100 border-transparent text-gray-500 cursor-not-allowed'
                                                : 'bg-white border-blue-100 focus:border-blue-500 text-gray-900 shadow-sm'
                                                }`}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${!isEditing
                                                ? 'bg-gray-100 border-transparent text-gray-500 cursor-not-allowed'
                                                : 'bg-white border-blue-100 focus:border-blue-500 text-gray-900 shadow-sm'
                                                }`}
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Location / City</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${!isEditing
                                                ? 'bg-gray-100 border-transparent text-gray-500 cursor-not-allowed'
                                                : 'bg-white border-blue-100 focus:border-blue-500 text-gray-900 shadow-sm'
                                                }`}
                                            placeholder="e.g. Mumbai, India"
                                        />
                                    </div>
                                </div>

                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={handleEditClick}
                                        className="w-full py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 shadow-sm transition-all transform hover:-translate-y-1 flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit Details
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`flex-[2] py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
                                        >
                                            {loading ? 'Saving...' : 'Save Profile'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
