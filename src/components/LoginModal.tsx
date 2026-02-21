import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = () => {
    const { isLoginModalOpen, closeLoginModal, loginUser, registerUser, modalView, resolveIdentifierToEmail } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        identifier: '', // phone, username, or email
        password: '',
        name: '',
        email: '',
        username: '',
        mobile: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isLoginModalOpen) {
            setIsLogin(modalView === 'login');
            setError('');
            setFormData({ identifier: '', password: '', name: '', email: '', username: '', mobile: '' });
            setShowPassword(false);
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
            if (isLogin) {
                // Login flow
                if (!formData.identifier.trim()) {
                    throw new Error('Please enter your phone number, username, or email.');
                }
                const resolvedEmail = await resolveIdentifierToEmail(formData.identifier.trim());
                await loginUser(resolvedEmail, formData.password);
            } else {
                // Registration flow
                if (!formData.name.trim()) {
                    throw new Error('Name is required.');
                }
                if (!formData.mobile || formData.mobile.length < 10) {
                    throw new Error('Please enter a valid mobile number (at least 10 digits).');
                }

                // Determine the email to use for Firebase Auth
                const authEmail = formData.email.trim() || `${formData.mobile}@travelapp.local`;

                await registerUser(
                    authEmail,
                    formData.password,
                    formData.name.trim(),
                    formData.mobile.trim(),
                    formData.username.trim().toLowerCase() || '',
                    formData.email.trim() || ''
                );
            }
        } catch (err: any) {
            console.error(err);
            let errorMessage = err.message || 'Authentication failed';

            // Map Firebase error codes to user-friendly messages
            if (errorMessage.includes('auth/email-already-in-use')) {
                errorMessage = 'This email or mobile number is already registered.';
            } else if (errorMessage.includes('auth/invalid-email')) {
                errorMessage = 'Invalid email format.';
            } else if (errorMessage.includes('auth/user-not-found') || errorMessage.includes('auth/invalid-credential')) {
                errorMessage = 'Invalid credentials. Please check your login details.';
            } else if (errorMessage.includes('auth/wrong-password')) {
                errorMessage = 'Incorrect password.';
            } else if (errorMessage.includes('auth/weak-password')) {
                errorMessage = 'Password should be at least 6 characters.';
            } else if (errorMessage.includes('auth/operation-not-allowed')) {
                errorMessage = "Login method not enabled. Please enable 'Email/Password' in Firebase Console.";
            } else if (!errorMessage.includes('Username not found')) {
                errorMessage = errorMessage.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
                errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getIdentifierIcon = () => {
        if (!formData.identifier) return 'user';
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier)) return 'email';
        if (/^[0-9]{10,15}$/.test(formData.identifier)) return 'phone';
        return 'username';
    };

    const identifierType = getIdentifierIcon();

    return (
        <div
            onClick={closeLoginModal}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                animation: 'fadeIn 0.3s ease-out'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '440px',
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative Top Gradient Bar */}
                <div style={{ height: '5px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)' }} />

                {/* Close Button */}
                <button
                    onClick={closeLoginModal}
                    style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div style={{ padding: '32px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isLogin ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'linear-gradient(135deg, #10b981, #3b82f6)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                        }}>
                            {isLogin ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                            )}
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>{isLogin ? 'Sign in with phone, username, or email' : 'Join us to unlock exclusive travel deals!'}</p>
                    </div>

                    {error && (
                        <div style={{ marginBottom: '16px', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', fontSize: '13px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {isLogin ? (
                            <>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '6px' }}>Phone / Username / Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text" name="identifier" value={formData.identifier} onChange={handleChange} required
                                            style={{ width: '100%', padding: '14px 16px 14px 44px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box' }}
                                            placeholder="Enter details"
                                        />
                                        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
                                            {identifierType === 'email' ? '✉️' : identifierType === 'phone' ? '📱' : '👤'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '6px' }}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required
                                            style={{ width: '100%', padding: '14px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box' }}
                                            placeholder="••••••••"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                                            {showPassword ? '👁️' : '🙈'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" style={{ width: '100%', padding: '14px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box' }} />
                                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Mobile Number" style={{ width: '100%', padding: '14px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box' }} />
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" style={{ width: '100%', padding: '14px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box' }} />
                            </>
                        )}

                        <button
                            type="submit" disabled={loading}
                            style={{ width: '100%', padding: '15px', background: isLogin ? '#3b82f6' : '#10b981', color: 'white', fontWeight: 700, border: 'none', borderRadius: '14px', cursor: 'pointer', marginTop: '10px' }}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }}>
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default LoginModal;
