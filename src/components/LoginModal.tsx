import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendOTPEmail } from '../utils/emailService';

const LoginModal = () => {
    const { isLoginModalOpen, closeLoginModal, loginUser, registerUser, modalView } = useAuth();

    const [view, setView] = useState<'login' | 'register' | 'verify-otp'>('login');
    const [actionType, setActionType] = useState<'login' | 'register'>('login');
    const [formData, setFormData] = useState({
        identifier: '', // login identifier
        name: '',       // register
        username: '',   // register
        email: '',      // register
        mobile: '',     // register
        otp: ''
    });
    const [resolvedEmail, setResolvedEmail] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoginModalOpen) {
            setView(modalView === 'login' ? 'login' : 'register');
            setActionType(modalView === 'login' ? 'login' : 'register');
            setError('');
            setSuccess('');
            setGeneratedOTP('');
            setResolvedEmail('');
            setFormData({ identifier: '', name: '', username: '', email: '', mobile: '', otp: '' });
        }
    }, [isLoginModalOpen, modalView]);

    if (!isLoginModalOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const email = formData.identifier.trim();
            if (!email) throw new Error('Please enter your email address.');

            // Basic email format validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw new Error('Please enter a valid email address.');
            }

            setResolvedEmail(email);

            try {
                // Try logging in with the systematic password
                await loginUser(email);
            } catch (authErr: any) {
                // Check if it's a legacy account (manual password)
                if (authErr.message?.includes('invalid-credential') || authErr.code === 'auth/invalid-credential') {
                    setSuccess('Legacy account found. Please verify with OTP to complete your sign-in.');

                    // Generate and send OTP for legacy verification
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOTP(otp);
                    await sendOTPEmail(email, otp);

                    setActionType('login');
                    setView('verify-otp');
                } else {
                    throw authErr;
                }
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterOTPRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.name.trim()) throw new Error('Full Name is required.');
            if (!formData.username.trim()) throw new Error('Username is required.');
            if (formData.username.includes(' ')) throw new Error('Username cannot contain spaces.');
            if (!formData.email.trim()) throw new Error('Email is required.');
            if (!formData.mobile.trim() || formData.mobile.length < 10) throw new Error('Valid Mobile Number is required.');

            setResolvedEmail(formData.email.trim());

            // Generate and send OTP for Registration Verification
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOTP(otp);
            await sendOTPEmail(formData.email.trim(), otp);

            setSuccess('OTP sent for email verification.');
            setActionType('register');
            setView('verify-otp');
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (formData.otp !== generatedOTP) {
                throw new Error('Invalid OTP. Please check and try again.');
            }

            if (actionType === 'login') {
                // For legacy users, we use our special reset path to let them in
                setSuccess('Account verified! Signing you in...');
                await loginUser(resolvedEmail);
            } else {
                // Registration final step after OTP verification
                await registerUser(
                    resolvedEmail,
                    formData.name.trim(),
                    formData.mobile.trim(),
                    formData.username.trim()
                );
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={closeLoginModal}
            style={{
                position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s ease-out'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative', width: '100%', maxWidth: '440px', background: 'white', borderRadius: '24px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
                }}
            >
                <div style={{ height: '5px', background: 'linear-gradient(90deg, #3b82f6, #10b981, #f59e0b)' }} />

                <button
                    onClick={closeLoginModal}
                    style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>

                <div style={{ padding: '32px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: view === 'login' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : (view === 'register' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)'),
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                        }}>
                            {view === 'verify-otp' ? '✉️' : '👤'}
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
                            {view === 'login' && 'Sign In'}
                            {view === 'register' && 'Create Account'}
                            {view === 'verify-otp' && 'Verify Email'}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                            {view === 'login' && 'Enter your registered email address to sign in.'}
                            {view === 'register' && 'Enter your details to receive a verification OTP.'}
                            {view === 'verify-otp' && `Enter the 6-digit code sent to ${resolvedEmail.replace(/(.{2})(.*)(?=@)/, (_gp1, gp2, gp3) => gp2 + '*'.repeat(gp3.length))}`}
                        </p>
                    </div>

                    {error && (
                        <div style={{ marginBottom: '16px', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', fontSize: '13px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div style={{ marginBottom: '16px', padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', color: '#16a34a', fontSize: '13px', textAlign: 'center' }}>
                            {success}
                        </div>
                    )}

                    {view === 'login' && (
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '6px' }}>Email Address</label>
                                <input
                                    type="email" name="identifier" value={formData.identifier} onChange={handleChange} required
                                    placeholder="yourname@gmail.com"
                                    style={{ width: '100%', padding: '14px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box' }}
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                style={{ width: '100%', padding: '15px', background: '#3b82f6', color: 'white', fontWeight: 700, border: 'none', borderRadius: '14px', cursor: 'pointer' }}
                            >
                                {loading ? 'Signing in...' : 'Sign In Now'}
                            </button>
                            <p style={{ fontSize: '14px', textAlign: 'center', color: '#6b7280' }}>
                                New here? <button type="button" onClick={() => setView('register')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }}>Create Account</button>
                            </p>
                        </form>
                    )}

                    {view === 'register' && (
                        <form onSubmit={handleRegisterOTPRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" style={{ width: '100%', padding: '14px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box' }} />
                            <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Username" style={{ width: '100%', padding: '14px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box' }} />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" style={{ width: '100%', padding: '14px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box' }} />
                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Mobile Number" style={{ width: '100%', padding: '14px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box' }} />

                            <button
                                type="submit" disabled={loading}
                                style={{ width: '100%', padding: '15px', background: '#10b981', color: 'white', fontWeight: 700, border: 'none', borderRadius: '14px', cursor: 'pointer', marginTop: '8px' }}
                            >
                                {loading ? 'Sending OTP...' : 'Verify Email & Join'}
                            </button>
                            <p style={{ fontSize: '14px', textAlign: 'center', color: '#6b7280' }}>
                                Already have an account? <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }}>Sign In</button>
                            </p>
                        </form>
                    )}

                    {view === 'verify-otp' && (
                        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <input
                                type="text" name="otp" value={formData.otp} onChange={handleChange} required
                                placeholder="000000"
                                maxLength={6}
                                style={{ width: '100%', padding: '14px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '14px', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 700 }}
                            />
                            <button
                                type="submit" disabled={loading}
                                style={{ width: '100%', padding: '15px', background: '#f59e0b', color: 'white', fontWeight: 700, border: 'none', borderRadius: '14px', cursor: 'pointer' }}
                            >
                                {loading ? 'Logging in...' : 'Verify & Continue'}
                            </button>
                            <button type="button" onClick={() => setView(actionType)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '13px', cursor: 'pointer' }}>Change Details / Resend</button>
                        </form>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default LoginModal;
