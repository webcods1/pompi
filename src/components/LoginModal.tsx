import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = () => {
    const { isLoginModalOpen, closeLoginModal, loginUser, registerUser, modalView } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        mobile: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoginModalOpen) {
            setIsLogin(modalView === 'login');
            setError('');
            setFormData({ mobile: '', password: '', name: '' });
        }
    }, [isLoginModalOpen, modalView]);

    if (!isLoginModalOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Create a synthetic email from mobile number for Firebase Auth
            const email = `${formData.mobile}@travelapp.local`;

            if (isLogin) {
                await loginUser(email, formData.password);
            } else {
                if (!formData.name) {
                    throw new Error("Name is required");
                }
                if (!formData.mobile || formData.mobile.length < 10) {
                    throw new Error("Please enter a valid mobile number");
                }
                await registerUser(email, formData.password, formData.name, formData.mobile);
            }
            // Close modal is handled inside context functions on success
        } catch (err: any) {
            console.error(err);
            let errorMessage = err.message || "Authentication failed";

            // Map Firebase error codes to user-friendly messages
            if (errorMessage.includes("auth/email-already-in-use")) {
                errorMessage = "This mobile number is already registered.";
            } else if (errorMessage.includes("auth/invalid-email")) {
                errorMessage = "Invalid mobile number format.";
            } else if (errorMessage.includes("auth/user-not-found") || errorMessage.includes("auth/invalid-credential")) {
                errorMessage = "Invalid mobile number or password.";
            } else if (errorMessage.includes("auth/wrong-password")) {
                errorMessage = "Incorrect password.";
            } else if (errorMessage.includes("auth/weak-password")) {
                errorMessage = "Password should be at least 6 characters.";
            } else if (errorMessage.includes("auth/operation-not-allowed")) {
                errorMessage = "Login method not enabled. Please enable 'Email/Password' in Firebase Console -> Authentication.";
                // Log to console for developer instructions
                console.error("FIREBASE ERROR: 'auth/operation-not-allowed'");
                console.error("To fix this: Go to Firebase Console -> Authentication -> Sign-in method -> Enable 'Email/Password'.");
            } else {
                // Fallback cleanup
                errorMessage = errorMessage.replace("Firebase: Error (auth/", "").replace(").", "").replace(/-/g, " ");
                errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={closeLoginModal}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up"
            >
                {/* Close Button */}
                <button
                    onClick={closeLoginModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    {/* Form Section */}
                    <div className="w-full p-8 md:p-10">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                                {isLogin ? 'Welcome Back!' : 'Create Account'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isLogin
                                    ? 'Please enter your mobile number to sign in.'
                                    : 'Join us to unlock exclusive travel deals!'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs text-center">
                                <p>{error}</p>
                                {error.includes("Enable 'Email/Password'") && (
                                    <div className="mt-2 pt-2 border-t border-red-100 text-[10px] text-red-500 text-left">
                                        <strong>Why?</strong> Firebase does not support "Mobile + Password" natively.
                                        We use the "Email/Password" system behind the scenes (converting mobile to a unique ID).
                                        <br /><br />
                                        Please enable <strong>Email/Password</strong> provider in your Firebase Console to make this work.
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                        placeholder="John Doe"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                    placeholder="9876543210"
                                    required
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10-digit mobile number"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transform hover:-translate-y-0.5 transition-all text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {loading
                                    ? 'Processing...'
                                    : (isLogin ? 'Sign In' : 'Sign Up')}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                        setFormData({ mobile: '', password: '', name: '' });
                                    }}
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
